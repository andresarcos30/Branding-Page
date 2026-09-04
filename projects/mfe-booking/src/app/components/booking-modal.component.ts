import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkshopEvent, BookingSlot, BookingTier, CrossMfeBusService } from 'shared-kernel';
import { BookingStateService } from '../services/booking-state.service';

@Component({
  selector: 'mfe-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-modal-backdrop" *ngIf="isOpen()" (click)="onBackdropClick($event)">
      <div class="booking-dialog" (click)="$event.stopPropagation()">
        
        <!-- Modal Top Bar -->
        <div class="dialog-header">
          <div class="header-left">
            <span class="step-counter">Paso {{ state.currentStep() }} de 4</span>
            <h2 class="dialog-title">Agendamiento de Taller</h2>
          </div>
          <button type="button" class="btn-close" (click)="onClose()" aria-label="Cerrar">✕</button>
        </div>

        <!-- Progress Steps Bar -->
        <div class="steps-progress-bar">
          <div class="step-indicator" [class.active]="state.currentStep() >= 1" [class.done]="state.currentStep() > 1">
            <span class="step-num">1</span>
            <span class="step-label">Fecha & Horario</span>
          </div>
          <div class="step-divider" [class.filled]="state.currentStep() > 1"></div>
          <div class="step-indicator" [class.active]="state.currentStep() >= 2" [class.done]="state.currentStep() > 2">
            <span class="step-num">2</span>
            <span class="step-label">Tipo de Pase</span>
          </div>
          <div class="step-divider" [class.filled]="state.currentStep() > 2"></div>
          <div class="step-indicator" [class.active]="state.currentStep() >= 3" [class.done]="state.currentStep() > 3">
            <span class="step-num">3</span>
            <span class="step-label">Datos & Pago</span>
          </div>
          <div class="step-divider" [class.filled]="state.currentStep() >= 4"></div>
          <div class="step-indicator" [class.active]="state.currentStep() === 4">
            <span class="step-num">4</span>
            <span class="step-label">Ticket Digital</span>
          </div>
        </div>

        <!-- Selected Event Brief Card -->
        <div class="event-brief-banner" *ngIf="state.selectedEvent() as ev">
          <div class="banner-gradient-accent" [style.background]="ev.accentGradient"></div>
          <div class="brief-info">
            <span class="brief-cat">{{ ev.categoryLabel }} • {{ ev.modality }}</span>
            <h3 class="brief-title">{{ ev.title }}</h3>
            <span class="brief-mentor" *ngIf="ev.instructor">Mentor: {{ ev.instructor.name }} ({{ ev.instructor.company }})</span>
            <span class="brief-mentor" *ngIf="!ev.instructor && ev.eventType === 'concert'">Género: {{ ev.concertData?.genre }}</span>
            <span class="brief-mentor" *ngIf="!ev.instructor && ev.eventType !== 'concert'">Sede: {{ ev.location }}</span>
          </div>
          <div class="brief-price">
            <span class="total-label">Total a Pagar</span>
            <span class="price-val">{{ '$' + state.calculatedTotal() }} <small>USD</small></span>
          </div>
        </div>

        <!-- Modal Body Content -->
        <div class="dialog-body">

          <!-- ================= STEP 1: CALENDAR & SLOTS ================= -->
          <div class="step-content" *ngIf="state.currentStep() === 1">
            <div class="step-intro">
              <h4>Selecciona la Fecha y Turno de tu Preferencia</h4>
              <p>Elige la sesión que mejor se adapte a tu agenda. Las plazas son estrictamente limitadas para garantizar feedback personalizado.</p>
            </div>

            <!-- Timezone selector -->
            <div class="timezone-picker">
              <label>Zona Horaria:</label>
              <select [ngModel]="state.selectedTimezone()" (ngModelChange)="state.selectedTimezone.set($event)">
                <option value="UTC-5 (Bogotá, Lima, CDMX)">UTC-5 (Bogotá, Lima, CDMX)</option>
                <option value="UTC-4 (Santiago, Miami)">UTC-4 (Santiago, Miami)</option>
                <option value="UTC-3 (Buenos Aires, São Paulo)">UTC-3 (Buenos Aires, São Paulo)</option>
                <option value="UTC+1 (Madrid, Barcelona)">UTC+1 (Madrid, Barcelona)</option>
              </select>
            </div>

            <!-- Slots Cards Grid -->
            <div class="slots-selection-grid">
              <div
                *ngFor="let slot of state.selectedEvent()?.scheduleDates"
                class="slot-select-card"
                [class.selected]="state.selectedSlot()?.id === slot.id"
                [class.disabled]="slot.availableSeats === 0"
                (click)="slot.availableSeats > 0 && state.selectedSlot.set(slot)"
              >
                <div class="slot-badge-row">
                  <span class="day-chip">{{ slot.dayName }}</span>
                  <span class="seats-chip" *ngIf="slot.availableSeats > 0">{{ slot.availableSeats }} cupos</span>
                  <span class="seats-chip-exhausted" *ngIf="slot.availableSeats === 0">Agotado</span>
                </div>
                <div class="slot-primary-info">
                  <span class="slot-date-big">{{ slot.date }}</span>
                  <span class="slot-time-highlight">⏰ {{ slot.time }}</span>
                </div>
                <div class="slot-period-tag">Turno: {{ slot.period }}</div>
              </div>
            </div>
          </div>

          <!-- ================= STEP 2: TIER SELECTION ================= -->
          <div class="step-content" *ngIf="state.currentStep() === 2">
            <div class="step-intro">
              <h4>Elige tu Nivel de Experiencia y Pase</h4>
              <p>Selecciona cómo deseas vivir el taller: desde el pase estándar hasta experiencias con mentoría 1-a-1 o pases para tu squad.</p>
            </div>

            <div class="tiers-grid">
              <div
                *ngFor="let tier of state.tiers"
                class="tier-card"
                [class.selected]="state.selectedTier() === tier.id"
                [class.popular]="tier.popular"
                (click)="state.selectedTier.set(tier.id)"
              >
                <div class="tier-top">
                  <span class="tier-pill" [class.popular-pill]="tier.popular">{{ tier.badge }}</span>
                  <h3 class="tier-title">{{ tier.title }}</h3>
                  <p class="tier-sub">{{ tier.subtitle }}</p>
                  <div class="tier-pricing">
                    <span class="t-price">{{ '$' + Math.round((state.selectedEvent()?.price || 0) * tier.priceMultiplier) }}</span>
                    <span class="t-unit">USD</span>
                  </div>
                </div>

                <div class="tier-perks">
                  <div class="perk-item" *ngFor="let perk of tier.perks">
                    <span class="perk-check">✓</span>
                    <span>{{ perk }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ================= STEP 3: ATTENDEE FORM & CHECKOUT ================= -->
          <div class="step-content" *ngIf="state.currentStep() === 3">
            <div class="step-intro">
              <h4>Información del Asistente & Confirmación</h4>
              <p>Completa tus datos para emitir tu credencial de acceso y acceso a las salas de trabajo colaborativo.</p>
            </div>

            <div class="form-layout">
              <div class="form-fields">
                <div class="input-group">
                  <label>Nombre y Apellidos *</label>
                  <input
                    type="text"
                    placeholder="Ej. Sofia Romero"
                    [ngModel]="state.attendeeName()"
                    (ngModelChange)="state.attendeeName.set($event)"
                    required
                  />
                </div>

                <div class="input-group">
                  <label>Correo Corporativo / Personal *</label>
                  <input
                    type="email"
                    placeholder="sofia.romero@empresa.com"
                    [ngModel]="state.attendeeEmail()"
                    (ngModelChange)="state.attendeeEmail.set($event)"
                    required
                  />
                </div>

                <div class="input-row-2">
                  <div class="input-group">
                    <label>Empresa / Organización (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Mercado Libre / Freelance"
                      [ngModel]="state.attendeeCompany()"
                      (ngModelChange)="state.attendeeCompany.set($event)"
                    />
                  </div>

                  <div class="input-group">
                    <label>Nivel de Experiencia</label>
                    <select
                      [ngModel]="state.attendeeExperience()"
                      (ngModelChange)="state.attendeeExperience.set($event)"
                    >
                      <option>Junior (0-2 años)</option>
                      <option>Intermedio (2-4 años)</option>
                      <option>Senior / Staff (5+ años)</option>
                      <option>Lead / Manager / Director</option>
                    </select>
                  </div>
                </div>

                <!-- Promo Code -->
                <div class="promo-box">
                  <label>¿Tienes un código de descuento? (Prueba <strong>AURORA2026</strong>)</label>
                  <div class="promo-input-row">
                    <input
                      type="text"
                      placeholder="Código de cupón"
                      [ngModel]="state.promoCode()"
                      (ngModelChange)="state.promoCode.set($event)"
                      style="text-transform: uppercase;"
                    />
                    <button type="button" class="btn-apply-promo" (click)="applyPromo()">
                      Aplicar
                    </button>
                  </div>
                  <span class="promo-feedback" [class.success]="state.discountPercent() > 0" *ngIf="state.promoMessage()">
                    {{ state.promoMessage() }}
                  </span>
                </div>
              </div>

              <!-- Order Summary Column -->
              <div class="order-summary-card">
                <h5>Resumen de la Orden</h5>
                <div class="summary-line">
                  <span>Taller Seleccionado:</span>
                  <span class="val-txt">{{ state.selectedEvent()?.title }}</span>
                </div>
                <div class="summary-line">
                  <span>Fecha:</span>
                  <span class="val-txt">{{ state.selectedSlot()?.date }} ({{ state.selectedSlot()?.time }})</span>
                </div>
                <div class="summary-line">
                  <span>Pase:</span>
                  <span class="val-txt">{{ state.selectedTier() | uppercase }}</span>
                </div>
                <div class="summary-line">
                  <span>Subtotal:</span>
                  <span class="val-num">{{ '$' + state.calculatedSubtotal() }} USD</span>
                </div>
                <div class="summary-line discount-line" *ngIf="state.discountPercent() > 0">
                  <span>Descuento ({{ state.discountPercent() }}%):</span>
                  <span class="val-num discount-val">-{{ '$' + state.calculatedDiscount() }} USD</span>
                </div>
                <div class="summary-total-line">
                  <span>Inversión Total:</span>
                  <span class="total-big">{{ '$' + state.calculatedTotal() }} USD</span>
                </div>
                <div class="payment-guarantee">
                  <span>🔒 Checkout Simulado Seguro • Cero Riesgo</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ================= STEP 4: BOARDING PASS TICKET ================= -->
          <div class="step-content ticket-step" *ngIf="state.currentStep() === 4 && state.confirmedBooking() as conf">
            <div class="success-header">
              <div class="confetti-check">🎉</div>
              <h3 class="success-title">¡Lugar Confirmado Exitosamente!</h3>
              <p class="success-desc">
                Hemos reservado tu cupo en el taller. Te enviamos la confirmación con el link de acceso a 
                <strong>{{ conf.attendeeEmail }}</strong>.
              </p>
            </div>

            <!-- Digital Boarding Pass Card -->
            <div class="digital-ticket">
              <div class="ticket-left">
                <div class="ticket-brand-row">
                  <span class="aurora-label">AURORA SUMMIT PASS</span>
                  <span class="tier-tag">{{ conf.tier | uppercase }} ACCESS</span>
                </div>

                <h4 class="ticket-event-title">{{ conf.event.title }}</h4>
                <p class="ticket-event-sub">{{ conf.event.subtitle }}</p>

                <div class="ticket-meta-grid">
                  <div class="meta-item">
                    <span class="meta-label">ASISTENTE</span>
                    <span class="meta-val">{{ conf.attendeeName }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">FECHA & SESIÓN</span>
                    <span class="meta-val">{{ conf.slot.date }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">HORARIO</span>
                    <span class="meta-val">{{ conf.slot.time }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">MODALIDAD / SEDE</span>
                    <span class="meta-val">{{ conf.event.location }}</span>
                  </div>
                </div>

                <div class="ticket-footer-left">
                  <span class="id-label">CÓDIGO DE RESERVA:</span>
                  <span class="booking-code">{{ conf.bookingId }}</span>
                </div>
              </div>

              <!-- Ticket Notch Divider -->
              <div class="ticket-divider">
                <div class="notch top-notch"></div>
                <div class="dashed-line"></div>
                <div class="notch bottom-notch"></div>
              </div>

              <!-- Ticket Right: QR Code & Actions -->
              <div class="ticket-right">
                <div class="qr-container">
                  <img [src]="conf.qrCodeUrl" alt="QR Code" class="qr-image" />
                  <span class="qr-tip">Escanear para acceso</span>
                </div>
                <span class="verified-badge">✓ Verificado</span>
              </div>
            </div>

            <!-- Action Buttons for Google Calendar, .ICS, Wallet and Link -->
            <div class="ticket-actions">
              <button type="button" class="btn-google-cal" (click)="state.openGoogleCalendar(conf)">
                <svg class="gcal-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
                </svg>
                <span>Añadir a Google Calendar</span>
              </button>
              <button type="button" class="btn-cal-download" (click)="state.downloadIcsCalendarFile(conf)">
                📅 Descargar .ICS (Apple/Outlook)
              </button>
              <button type="button" class="btn-wallet-view" (click)="openWalletAndCloseModal()">
                🎟️ Ver en Mi Bóveda
              </button>
              <button type="button" class="btn-copy-link" (click)="copyAccessLink(conf.bookingId)">
                {{ copyButtonText() }}
              </button>
            </div>
          </div>

        </div>

        <!-- Modal Dialog Actions Footer (Steps 1, 2, 3) -->
        <div class="dialog-actions-footer" *ngIf="state.currentStep() < 4">
          <button
            type="button"
            class="btn-prev-step"
            *ngIf="state.currentStep() > 1"
            (click)="state.currentStep.set(state.currentStep() - 1)"
          >
            ← Volver
          </button>

          <div class="footer-spacer"></div>

          <button
            type="button"
            class="btn-next-step"
            *ngIf="state.currentStep() === 1"
            [disabled]="!state.selectedSlot()"
            (click)="state.currentStep.set(2)"
          >
            Continuar a Selección de Pase →
          </button>

          <button
            type="button"
            class="btn-next-step"
            *ngIf="state.currentStep() === 2"
            (click)="state.currentStep.set(3)"
          >
            Continuar a Datos del Asistente →
          </button>

          <button
            type="button"
            class="btn-confirm-booking"
            *ngIf="state.currentStep() === 3"
            [disabled]="!state.attendeeName() || !state.attendeeEmail()"
            (click)="onConfirmBooking()"
          >
            ✨ Confirmar y Generar Pase ({{ '$' + state.calculatedTotal() }} USD)
          </button>
        </div>

        <!-- Footer when on ticket step -->
        <div class="dialog-actions-footer" *ngIf="state.currentStep() === 4">
          <div class="footer-spacer"></div>
          <button type="button" class="btn-finish" (click)="onClose()">
            Listo / Cerrar
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .booking-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(3, 6, 14, 0.88);
      backdrop-filter: blur(14px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: fadeIn 0.25s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .booking-dialog {
      background: #0c1220;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      width: 100%;
      max-width: 860px;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.2);
      overflow: hidden;
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes scaleUp {
      from { transform: scale(0.96) translateY(10px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 28px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    }

    .step-counter {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #818cf8;
      letter-spacing: 0.08em;
    }

    .dialog-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #ffffff;
      margin: 2px 0 0;
      font-family: 'Outfit', sans-serif;
    }

    .btn-close {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      transition: all 0.2s ease;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }

    .steps-progress-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 28px;
      background: rgba(0, 0, 0, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      overflow-x: auto;
    }

    .step-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 0.82rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .step-indicator.active {
      color: #818cf8;
    }

    .step-indicator.done {
      color: #38bdf8;
    }

    .step-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }

    .step-indicator.active .step-num {
      background: #6366f1;
      color: #ffffff;
    }

    .step-indicator.done .step-num {
      background: #0ea5e9;
      color: #ffffff;
    }

    .step-divider {
      flex-grow: 1;
      height: 2px;
      background: rgba(255, 255, 255, 0.08);
      margin: 0 12px;
      min-width: 20px;
    }

    .step-divider.filled {
      background: #6366f1;
    }

    .event-brief-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 28px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      position: relative;
      gap: 16px;
    }

    .banner-gradient-accent {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
    }

    .brief-cat {
      font-size: 0.72rem;
      color: #a5b4fc;
      text-transform: uppercase;
      font-weight: 700;
    }

    .brief-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 2px 0;
    }

    .brief-mentor {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .brief-price {
      text-align: right;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .total-label {
      font-size: 0.7rem;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
    }

    .price-val {
      font-size: 1.35rem;
      font-weight: 800;
      color: #38bdf8;
      font-family: 'Outfit', sans-serif;
    }

    .price-val small {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .dialog-body {
      padding: 24px 28px;
      overflow-y: auto;
      flex-grow: 1;
    }

    .step-intro {
      margin-bottom: 20px;
    }

    .step-intro h4 {
      font-size: 1.15rem;
      color: #ffffff;
      margin: 0 0 6px;
    }

    .step-intro p {
      font-size: 0.88rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.5;
    }

    .timezone-picker {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .timezone-picker select {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      outline: none;
    }

    .slots-selection-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
    }

    .slot-select-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1.5px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.25s ease;
    }

    .slot-select-card:hover:not(.disabled) {
      background: rgba(99, 102, 241, 0.08);
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
    }

    .slot-select-card.selected {
      background: rgba(99, 102, 241, 0.18);
      border-color: #6366f1;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.35);
    }

    .slot-select-card.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .slot-badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .day-chip {
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 600;
    }

    .seats-chip {
      font-size: 0.72rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.12);
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 600;
    }

    .seats-chip-exhausted {
      font-size: 0.72rem;
      color: #ef4444;
      background: rgba(239, 68, 68, 0.12);
      padding: 2px 8px;
      border-radius: 6px;
    }

    .slot-date-big {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      display: block;
    }

    .slot-time-highlight {
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .slot-period-tag {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 4px;
    }

    /* TIERS */
    .tiers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 16px;
    }

    .tier-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1.5px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 20px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      transition: all 0.25s ease;
      position: relative;
    }

    .tier-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .tier-card.selected {
      background: rgba(99, 102, 241, 0.14);
      border-color: #6366f1;
      box-shadow: 0 0 25px rgba(99, 102, 241, 0.3);
    }

    .tier-card.popular {
      border-color: rgba(99, 102, 241, 0.35);
    }

    .tier-pill {
      font-size: 0.7rem;
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      padding: 3px 10px;
      border-radius: 9999px;
      font-weight: 700;
      display: inline-block;
      margin-bottom: 8px;
    }

    .popular-pill {
      background: #6366f1;
      color: #ffffff;
    }

    .tier-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px;
    }

    .tier-sub {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0 0 12px;
      line-height: 1.4;
    }

    .tier-pricing {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .t-price {
      font-size: 1.55rem;
      font-weight: 800;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
    }

    .t-unit {
      font-size: 0.75rem;
      color: #64748b;
    }

    .tier-perks {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 12px;
    }

    .perk-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 0.78rem;
      color: #cbd5e1;
      line-height: 1.4;
    }

    .perk-check {
      color: #34d399;
      font-weight: bold;
    }

    /* STEP 3 FORM */
    .form-layout {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 24px;
    }

    @media (max-width: 700px) {
      .form-layout {
        grid-template-columns: 1fr;
      }
    }

    .form-fields {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input-group label {
      font-size: 0.8rem;
      color: #cbd5e1;
      font-weight: 600;
    }

    .input-group input, .input-group select {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 10px 14px;
      color: #ffffff;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }

    .input-group input:focus, .input-group select:focus {
      border-color: #6366f1;
      box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
    }

    .input-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .promo-box {
      margin-top: 8px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      padding: 12px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .promo-box label {
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .promo-input-row {
      display: flex;
      gap: 8px;
    }

    .promo-input-row input {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 8px;
      flex-grow: 1;
      font-size: 0.85rem;
    }

    .btn-apply-promo {
      background: #3b82f6;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
    }

    .promo-feedback {
      font-size: 0.78rem;
      color: #f87171;
    }

    .promo-feedback.success {
      color: #34d399;
    }

    .order-summary-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: fit-content;
    }

    .order-summary-card h5 {
      font-size: 0.92rem;
      color: #ffffff;
      margin: 0 0 4px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .summary-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      color: #94a3b8;
    }

    .val-txt {
      color: #ffffff;
      font-weight: 500;
      max-width: 160px;
      text-align: right;
    }

    .val-num {
      color: #ffffff;
      font-weight: 600;
    }

    .discount-val {
      color: #34d399;
    }

    .summary-total-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 12px;
      margin-top: 4px;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .total-big {
      font-size: 1.35rem;
      color: #38bdf8;
      font-family: 'Outfit', sans-serif;
    }

    .payment-guarantee {
      text-align: center;
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 6px;
    }

    /* STEP 4: BOARDING PASS */
    .ticket-step {
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
    }

    .success-header {
      text-align: center;
      max-width: 580px;
    }

    .confetti-check {
      font-size: 2.5rem;
      margin-bottom: 6px;
    }

    .success-title {
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px;
      font-family: 'Outfit', sans-serif;
    }

    .success-desc {
      font-size: 0.9rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.5;
    }

    .digital-ticket {
      background: linear-gradient(135deg, #131b2e 0%, #0e1526 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      width: 100%;
      max-width: 680px;
      display: flex;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.25);
      position: relative;
      overflow: hidden;
    }

    @media (max-width: 600px) {
      .digital-ticket {
        flex-direction: column;
      }
    }

    .ticket-left {
      padding: 24px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .ticket-brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .aurora-label {
      font-size: 0.75rem;
      font-weight: 800;
      color: #818cf8;
      letter-spacing: 0.1em;
    }

    .tier-tag {
      background: rgba(99, 102, 241, 0.2);
      color: #c7d2fe;
      font-size: 0.7rem;
      padding: 2px 10px;
      border-radius: 9999px;
      font-weight: 700;
      border: 1px solid rgba(99, 102, 241, 0.35);
    }

    .ticket-event-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      line-height: 1.3;
      font-family: 'Outfit', sans-serif;
    }

    .ticket-event-sub {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0;
    }

    .ticket-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 6px;
      background: rgba(0, 0, 0, 0.25);
      padding: 12px 14px;
      border-radius: 10px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-label {
      font-size: 0.65rem;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .meta-val {
      font-size: 0.82rem;
      font-weight: 600;
      color: #e2e8f0;
    }

    .ticket-footer-left {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-top: 4px;
    }

    .id-label {
      font-size: 0.7rem;
      color: #64748b;
    }

    .booking-code {
      font-size: 0.95rem;
      font-weight: 800;
      color: #38bdf8;
      font-family: monospace;
      letter-spacing: 0.05em;
    }

    .ticket-divider {
      position: relative;
      width: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }

    .dashed-line {
      width: 1px;
      height: 100%;
      border-left: 2px dashed rgba(255, 255, 255, 0.15);
    }

    .notch {
      width: 20px;
      height: 20px;
      background: #0c1220;
      border-radius: 50%;
      position: absolute;
      left: 0;
    }

    .top-notch { top: -10px; }
    .bottom-notch { bottom: -10px; }

    .ticket-right {
      padding: 24px 20px;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      min-width: 180px;
    }

    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      background: #070a12;
      padding: 10px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .qr-image {
      width: 120px;
      height: 120px;
      border-radius: 6px;
    }

    .qr-tip {
      font-size: 0.65rem;
      color: #64748b;
      text-transform: uppercase;
    }

    .verified-badge {
      font-size: 0.75rem;
      color: #34d399;
      font-weight: 700;
    }

    .ticket-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 4px;
    }

    .btn-google-cal {
      background: #1a73e8;
      color: #ffffff;
      border: none;
      padding: 12px 18px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(26, 115, 232, 0.4);
      transition: all 0.2s ease;
    }

    .btn-google-cal:hover {
      background: #1557b0;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 115, 232, 0.6);
    }

    .gcal-icon {
      flex-shrink: 0;
    }

    .btn-cal-download {
      background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
      color: #ffffff;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(14, 165, 233, 0.35);
      transition: all 0.2s ease;
    }

    .btn-cal-download:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
    }

    .btn-wallet-view {
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #c7d2fe;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-wallet-view:hover {
      background: rgba(99, 102, 241, 0.35);
      color: #ffffff;
      transform: translateY(-2px);
    }

    .btn-copy-link {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-copy-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    /* FOOTER ACTIONS */
    .dialog-actions-footer {
      display: flex;
      align-items: center;
      padding: 16px 28px;
      background: rgba(8, 12, 22, 0.95);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      gap: 12px;
    }

    .footer-spacer {
      flex-grow: 1;
    }

    .btn-prev-step {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .btn-next-step {
      background: #6366f1;
      color: #ffffff;
      border: none;
      padding: 11px 22px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-next-step:hover:not(:disabled) {
      background: #4f46e5;
      transform: translateY(-1px);
    }

    .btn-next-step:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-confirm-booking {
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 0.92rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
      transition: all 0.25s ease;
    }

    .btn-confirm-booking:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 22px rgba(16, 185, 129, 0.5);
    }

    .btn-confirm-booking:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-finish {
      background: #6366f1;
      color: #ffffff;
      border: none;
      padding: 11px 24px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
    }
  `],
})
export class BookingModalComponent {
  readonly state = inject(BookingStateService);
  readonly busService = inject(CrossMfeBusService);
  protected readonly Math = Math;

  readonly isOpen = computed(() => this.busService.isBookingModalOpen());
  readonly copyButtonText = signal<string>('🔗 Copiar Link de Acceso');

  constructor() {
    // When cross-MFE bus emits an event to book, initialize the state
    effect(() => {
      const ev = this.busService.selectedEventForBooking();
      if (ev) {
        this.state.initBookingWithEvent(ev);
      }
    });
  }

  applyPromo(): void {
    this.state.applyPromoCode(this.state.promoCode());
  }

  onConfirmBooking(): void {
    const confirmation = this.state.completeBooking();
    this.busService.notifyBookingConfirmed(confirmation);
  }

  openWalletAndCloseModal(): void {
    this.busService.closeBooking();
    this.busService.openWallet();
  }

  copyAccessLink(bookingId: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://aurora.summit/tickets/${bookingId}`);
      this.copyButtonText.set('✓ ¡Enlace Copiado!');
      setTimeout(() => this.copyButtonText.set('🔗 Copiar Link de Acceso'), 2500);
    }
  }

  onClose(): void {
    this.busService.closeBooking();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('booking-modal-backdrop')) {
      this.onClose();
    }
  }
}
