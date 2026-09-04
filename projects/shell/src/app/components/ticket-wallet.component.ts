import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossMfeBusService, BookingConfirmation } from 'shared-kernel';

@Component({
  selector: 'shell-ticket-wallet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Wallet Backdrop Modal -->
    <div
      class="wallet-backdrop"
      *ngIf="busService.isWalletModalOpen()"
      (click)="closeWallet()"
    >
      <div class="wallet-modal-container" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="wallet-header">
          <div class="header-left">
            <div class="wallet-badge-icon">🎟️</div>
            <div>
              <h3 class="wallet-title">Mi Bóveda de Entradas</h3>
              <p class="wallet-subtitle">
                {{ tickets().length }} {{ tickets().length === 1 ? 'pase activo' : 'pases activos' }} para AURORA 2026
              </p>
            </div>
          </div>
          <button type="button" class="btn-wallet-close" (click)="closeWallet()">✕</button>
        </div>

        <!-- Empty State -->
        <div class="empty-wallet-state" *ngIf="tickets().length === 0">
          <div class="empty-icon">🎫</div>
          <h4>Aún no tienes entradas registradas</h4>
          <p>Explora nuestra agenda de workshops de élite y reserva tu lugar para acceder a tus credenciales digitales y códigos QR.</p>
          <button type="button" class="btn-explore-agenda" (click)="goToAgenda()">
            Explorar Agenda de Talleres →
          </button>
        </div>

        <!-- Tickets List -->
        <div class="wallet-content-body" *ngIf="tickets().length > 0">
          <div class="tickets-grid">
            <div
              class="pass-card"
              *ngFor="let t of tickets(); let idx = index"
              [class.expanded]="selectedTicket()?.bookingId === t.bookingId"
            >
              <!-- Card Top Header -->
              <div class="pass-top">
                <div class="pass-brand-row">
                  <span class="pass-chip">AURORA VIP PASS</span>
                  <span class="pass-tier-badge">{{ t.tier | uppercase }} ACCESS</span>
                </div>
                <h4 class="pass-event-title">{{ t.event.title }}</h4>
                <p class="pass-event-sub">{{ t.event.subtitle }}</p>
              </div>

              <!-- Pass Meta Details -->
              <div class="pass-details-row">
                <div class="pass-meta-cell">
                  <span class="meta-title">TITULAR</span>
                  <span class="meta-val">{{ t.attendeeName }}</span>
                </div>
                <div class="pass-meta-cell">
                  <span class="meta-title">FECHA</span>
                  <span class="meta-val">{{ t.slot.date }}</span>
                </div>
                <div class="pass-meta-cell">
                  <span class="meta-title">HORA</span>
                  <span class="meta-val">{{ t.slot.time }}</span>
                </div>
                <div class="pass-meta-cell">
                  <span class="meta-title">SEDE / ENLACE</span>
                  <span class="meta-val">{{ t.event.location }}</span>
                </div>
              </div>

              <!-- Dashed Notch Separator -->
              <div class="pass-divider">
                <div class="notch left-notch"></div>
                <div class="dashed-strip"></div>
                <div class="notch right-notch"></div>
              </div>

              <!-- Pass Bottom / QR & Actions -->
              <div class="pass-bottom">
                <div class="qr-col">
                  <div class="qr-box">
                    <img [src]="t.qrCodeUrl" alt="QR Code Pase" class="pass-qr-img" />
                  </div>
                  <span class="qr-hint">Scan para Acreditación</span>
                </div>

                <div class="info-actions-col">
                  <div class="code-box">
                    <span class="code-label">CÓDIGO DE RESERVA</span>
                    <span class="booking-hash">{{ t.bookingId }}</span>
                  </div>

                  <div class="pass-btn-group">
                    <button
                      type="button"
                      class="btn-pass-action google"
                      (click)="openGoogleCalendar(t)"
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
                      </svg>
                      Google Calendar
                    </button>
                    <button
                      type="button"
                      class="btn-pass-action primary"
                      (click)="downloadIcs(t)"
                    >
                      📅 Descargar .ics
                    </button>
                    <button
                      type="button"
                      class="btn-pass-action secondary"
                      (click)="copyPassCode(t.bookingId, idx)"
                    >
                      {{ copiedIdx() === idx ? '✓ ¡Copiado!' : '📋 Copiar Código' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Bar -->
        <div class="wallet-footer">
          <span class="wallet-guarantee-note">
            🔒 Entradas encriptadas y guardadas de forma segura en tu navegador.
          </span>
          <button type="button" class="btn-done" (click)="closeWallet()">Entendido</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wallet-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(4, 7, 15, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 2500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      animation: fadeIn 0.25s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .wallet-modal-container {
      background: #090e1a;
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: 24px;
      width: 100%;
      max-width: 820px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 45px rgba(99, 102, 241, 0.25);
      overflow: hidden;
      animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes zoomIn {
      from { transform: scale(0.95) translateY(12px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .wallet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .wallet-badge-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3));
      border: 1px solid rgba(99, 102, 241, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
    }

    .wallet-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .wallet-subtitle {
      font-size: 0.82rem;
      color: #94a3b8;
      margin: 2px 0 0;
    }

    .btn-wallet-close {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .btn-wallet-close:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      transform: rotate(90deg);
    }

    /* Empty State */
    .empty-wallet-state {
      padding: 60px 30px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;
    }

    .empty-icon {
      font-size: 3.5rem;
      opacity: 0.8;
      filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.4));
    }

    .empty-wallet-state h4 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      color: #ffffff;
      margin: 0;
    }

    .empty-wallet-state p {
      color: #94a3b8;
      font-size: 0.9rem;
      max-width: 440px;
      margin: 0;
      line-height: 1.5;
    }

    .btn-explore-agenda {
      margin-top: 10px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.9rem;
      padding: 12px 26px;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 18px rgba(99, 102, 241, 0.4);
    }

    .btn-explore-agenda:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(99, 102, 241, 0.6);
    }

    /* Content Body & Grid */
    .wallet-content-body {
      padding: 24px 28px;
      overflow-y: auto;
      flex-grow: 1;
    }

    .tickets-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Holographic Digital Pass */
    .pass-card {
      background: linear-gradient(145deg, rgba(26, 35, 60, 0.85) 0%, rgba(13, 19, 36, 0.95) 100%);
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.15);
      position: relative;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .pass-card:hover {
      border-color: rgba(99, 102, 241, 0.6);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.25);
    }

    .pass-top {
      padding: 22px 24px 16px;
      position: relative;
    }

    .pass-brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .pass-chip {
      font-size: 0.68rem;
      letter-spacing: 0.15em;
      font-weight: 800;
      color: #a5b4fc;
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      padding: 3px 10px;
      border-radius: 9999px;
    }

    .pass-tier-badge {
      font-size: 0.68rem;
      font-weight: 800;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 3px 10px;
      border-radius: 9999px;
    }

    .pass-event-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;
      margin: 4px 0;
    }

    .pass-event-sub {
      font-size: 0.84rem;
      color: #94a3b8;
      margin: 0;
    }

    .pass-details-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding: 0 24px 18px;
    }

    @media (max-width: 650px) {
      .pass-details-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    .pass-meta-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .meta-title {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #64748b;
    }

    .meta-val {
      font-size: 0.85rem;
      font-weight: 600;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Dashed Notch Divider */
    .pass-divider {
      position: relative;
      display: flex;
      align-items: center;
      height: 20px;
      margin: 0;
    }

    .notch {
      width: 20px;
      height: 20px;
      background: #090e1a;
      border-radius: 50%;
      position: absolute;
      top: 0;
      z-index: 2;
    }

    .left-notch {
      left: -10px;
      box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.5);
    }

    .right-notch {
      right: -10px;
      box-shadow: inset 2px 0 4px rgba(0, 0, 0, 0.5);
    }

    .dashed-strip {
      flex-grow: 1;
      border-bottom: 1.5px dashed rgba(255, 255, 255, 0.15);
      margin: 0 15px;
    }

    /* Pass Bottom / QR */
    .pass-bottom {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 18px 24px;
      background: rgba(0, 0, 0, 0.25);
    }

    @media (max-width: 650px) {
      .pass-bottom {
        flex-direction: column;
        text-align: center;
      }
    }

    .qr-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .qr-box {
      background: #ffffff;
      padding: 8px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }

    .pass-qr-img {
      width: 84px;
      height: 84px;
      display: block;
    }

    .qr-hint {
      font-size: 0.65rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-actions-col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex-grow: 1;
      width: 100%;
    }

    .code-box {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .code-label {
      font-size: 0.68rem;
      color: #94a3b8;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .booking-hash {
      font-family: 'SF Mono', Consolas, monospace;
      font-size: 1.15rem;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: 0.05em;
    }

    .pass-btn-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-pass-action {
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-pass-action.primary {
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #c7d2fe;
    }

    .btn-pass-action.primary:hover {
      background: rgba(99, 102, 241, 0.35);
      color: #ffffff;
    }

    .btn-pass-action.google {
      background: rgba(26, 115, 232, 0.2);
      border: 1px solid rgba(26, 115, 232, 0.45);
      color: #93c5fd;
    }

    .btn-pass-action.google:hover {
      background: rgba(26, 115, 232, 0.4);
      color: #ffffff;
    }

    .btn-pass-action.secondary {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
    }

    .btn-pass-action.secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    /* Footer */
    .wallet-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 28px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.3);
    }

    .wallet-guarantee-note {
      font-size: 0.78rem;
      color: #64748b;
    }

    .btn-done {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #ffffff;
      padding: 8px 20px;
      border-radius: 9999px;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-done:hover {
      background: rgba(255, 255, 255, 0.16);
    }
  `],
})
export class TicketWalletComponent {
  readonly busService = inject(CrossMfeBusService);
  readonly selectedTicket = signal<BookingConfirmation | null>(null);
  readonly copiedIdx = signal<number | null>(null);
  readonly tickets = computed(() => this.busService.storedBookings());

  closeWallet(): void {
    this.busService.closeWallet();
  }

  goToAgenda(): void {
    this.busService.closeWallet();
    const el = document.getElementById('talleres');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  copyPassCode(code: string, index: number): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      this.copiedIdx.set(index);
      setTimeout(() => {
        this.copiedIdx.set(null);
      }, 2500);
    }
  }

  openGoogleCalendar(conf: BookingConfirmation): void {
    const event = conf.event;
    const title = encodeURIComponent(`${event.title} - AURORA Masterclass`);
    const details = encodeURIComponent(
      `Taller: ${event.title}\n${event.subtitle}\n\nMentor/Instructor: ${event.instructor?.name || 'Comité Técnico AURORA'}\nPase: ${conf.tier.toUpperCase()}\nCódigo de Reserva: ${conf.bookingId}\n\nAcceso Oficial AURORA Summit 2026`
    );
    const location = encodeURIComponent(event.location || 'AURORA Virtual Campus & Live Streaming');
    const dates = '20261024T140000Z/20261024T180000Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  downloadIcs(conf: BookingConfirmation): void {
    const title = conf.event.title;
    const desc = `Taller: ${conf.event.title} - ${conf.event.subtitle}. Pase: ${conf.tier}. Código de Reserva: ${conf.bookingId}`;
    const location = conf.event.location || 'AURORA Virtual Campus & Live Streaming';
    
    // Simplificado .ics content
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AURORA Summit//Pase Oficial//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:aurora-${conf.bookingId}@aurorasummit.tech`,
      `DTSTAMP:${now}`,
      `SUMMARY:AURORA 2026: ${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `AURORA_Pase_${conf.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
