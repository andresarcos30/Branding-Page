import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopEvent } from 'shared-kernel';

@Component({
  selector: 'mfe-event-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="event-card" [ngClass]="getCardTypeClass(event.eventType)">
      <!-- Hero Image for Concerts/Leisure events -->
      <div class="card-hero-image" *ngIf="event.heroImageUrl && isConcertOrLeisure(event.eventType)">
        <img [src]="event.heroImageUrl" [alt]="event.title" class="hero-img" loading="lazy" />
        <div class="hero-img-overlay" [style.background]="getOverlayGradient(event.accentGradient)"></div>
        <div class="hero-img-badges">
          <span class="badge-pill" [ngClass]="getBadgeClass(event.category)">{{ event.categoryLabel }}</span>
          <span class="badge-pill badge-urgent" *ngIf="event.spotsRemaining <= 50 && event.spotsRemaining > 0 && event.price > 0">
            ⚡ ¡Últimos cupos!
          </span>
          <span class="badge-pill badge-free" *ngIf="event.price === 0">🆓 Gratis</span>
        </div>
      </div>

      <!-- Card Top Banner for Workshops/Courses (no hero image) -->
      <div class="card-banner" [style.background]="event.accentGradient" *ngIf="!event.heroImageUrl || !isConcertOrLeisure(event.eventType)">
        <div class="banner-top-row">
          <span class="badge-pill" [ngClass]="getBadgeClass(event.category)">
            {{ event.categoryLabel }}
          </span>
          <span class="badge-pill badge-urgent" *ngIf="event.spotsRemaining <= 4 && event.price > 0">
            ⚡ ¡Solo {{ event.spotsRemaining }} cupos!
          </span>
          <span class="badge-pill badge-free" *ngIf="event.price === 0">🆓 Gratis</span>
        </div>
        <div class="banner-modality-pill">
          <span class="modality-dot" [ngClass]="event.modality.toLowerCase()"></span>
          {{ event.modality }} • {{ event.duration }}
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <div class="card-meta-row">
          <span class="badge-level" [ngClass]="getEventTypeBadgeClass(event.eventType)">{{ getEventTypeIcon(event.eventType) }} {{ event.level }}</span>
          <span class="badge-date">📅 {{ event.startDate }}</span>
        </div>

        <h3 class="card-title">{{ event.title }}</h3>
        <p class="card-subtitle">{{ event.subtitle }}</p>

        <!-- Concert: LineUp instead of instructor -->
        <div class="lineup-box" *ngIf="event.eventType === 'concert' && event.concertData">
          <div class="lineup-header">🎤 Line-Up</div>
          <div class="lineup-list">
            <span class="lineup-artist" *ngFor="let artist of event.concertData.lineUp.slice(0, 3)">
              {{ artist }}
            </span>
            <span class="lineup-more" *ngIf="event.concertData.lineUp.length > 3">
              +{{ event.concertData.lineUp.length - 3 }} artistas más
            </span>
          </div>
          <div class="concert-meta-pills">
            <span class="meta-chip">🎵 {{ event.concertData.genre }}</span>
            <span class="meta-chip">🔞 {{ event.concertData.ageRestriction }}</span>
          </div>
        </div>

        <!-- Leisure: Activities Highlight -->
        <div class="leisure-box" *ngIf="(event.eventType === 'leisure' || event.eventType === 'meetup') && event.leisureData">
          <div class="leisure-header">✨ Highlights del Evento</div>
          <div class="leisure-highlights">
            <span class="highlight-tag" *ngFor="let activity of event.leisureData.activitiesHighlight.slice(0, 3)">
              {{ activity }}
            </span>
          </div>
        </div>

        <!-- Instructor Row — for Workshops and Courses -->
        <div class="instructor-box" *ngIf="event.instructor && (event.eventType === 'workshop' || event.eventType === 'course')">
          <img [src]="event.instructor.avatar" [alt]="event.instructor.name" class="instructor-img" loading="lazy" />
          <div class="instructor-info">
            <span class="instructor-name">{{ event.instructor.name }}</span>
            <span class="instructor-role">{{ event.instructor.role }} • {{ event.instructor.company }}</span>
          </div>
        </div>

        <!-- Course: Module Preview -->
        <div class="course-modules" *ngIf="event.eventType === 'course' && event.courseData?.modules">
          <div class="modules-header">📚 Módulos del Programa</div>
          <div class="module-tags">
            <span class="module-tag" *ngFor="let mod of event.courseData!.modules!.slice(0, 4)">{{ mod }}</span>
          </div>
        </div>

        <!-- Topics Snippet — for Workshops (not Courses/Concerts/Leisure) -->
        <div class="topics-preview" *ngIf="event.eventType === 'workshop'">
          <span class="topic-tag" *ngFor="let topic of event.topics.slice(0, 2)">
            ✓ {{ topic }}
          </span>
        </div>

        <!-- Modality pill for concerts/leisure (since they don't have the banner pill) -->
        <div class="modality-pill-inline" *ngIf="isConcertOrLeisure(event.eventType)">
          <span class="modality-dot" [ngClass]="event.modality.toLowerCase()"></span>
          <span>{{ event.modality }}</span>
          <span class="sep">•</span>
          <span>{{ event.duration }}</span>
        </div>

        <!-- Spots Progress Bar -->
        <div class="spots-progress-container" *ngIf="event.price > 0">
          <div class="spots-text-row">
            <span class="spots-label">Disponibilidad</span>
            <span class="spots-counter">{{ event.spotsRemaining }} de {{ event.spotsTotal }} disponibles</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-fill"
              [style.width.%]="((event.spotsTotal - event.spotsRemaining) / event.spotsTotal) * 100"
              [ngClass]="{'progress-critical': event.spotsRemaining <= 4}"
            ></div>
          </div>
        </div>

        <!-- Free event capacity bar -->
        <div class="spots-progress-container" *ngIf="event.price === 0">
          <div class="spots-text-row">
            <span class="spots-label">Cupos Registrados</span>
            <span class="spots-counter spots-free">{{ event.spotsTotal - event.spotsRemaining }} de {{ event.spotsTotal }} registrados</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-fill progress-free"
              [style.width.%]="((event.spotsTotal - event.spotsRemaining) / event.spotsTotal) * 100"
            ></div>
          </div>
        </div>

        <!-- Card Footer: Price and CTA -->
        <div class="card-footer">
          <div class="price-container">
            <span class="price-label">{{ getPriceLabel(event.eventType) }}</span>
            <div class="price-numbers">
              <span class="current-price" [ngClass]="{'price-free': event.price === 0}">
                {{ event.price === 0 ? 'GRATIS' : ('$' + event.price) }}
              </span>
              <ng-container *ngIf="event.price > 0">
                <span class="original-price" *ngIf="event.originalPrice > event.price">{{ '$' + event.originalPrice }}</span>
                <span class="currency">USD</span>
              </ng-container>
            </div>
          </div>

          <div class="cta-actions">
            <button type="button" class="btn-detail" (click)="viewDetails.emit(event)">
              {{ getDetailButtonLabel(event.eventType) }}
            </button>
            <button type="button" class="btn-book" [ngClass]="getBookButtonClass(event.eventType)" (click)="bookNow.emit(event)">
              {{ getBookButtonLabel(event.eventType, event.price) }}
            </button>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .event-card {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.6);
      position: relative;
    }

    .event-card:hover {
      transform: translateY(-6px);
      border-color: rgba(99, 102, 241, 0.45);
      box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.25);
    }

    /* Concert cards get pink hover glow */
    .event-card.type-concert:hover {
      border-color: rgba(236, 72, 153, 0.5);
      box-shadow: 0 20px 40px -15px rgba(236, 72, 153, 0.3);
    }

    /* Course cards get violet hover glow */
    .event-card.type-course:hover {
      border-color: rgba(124, 58, 237, 0.5);
      box-shadow: 0 20px 40px -15px rgba(124, 58, 237, 0.3);
    }

    /* Leisure cards get amber hover glow */
    .event-card.type-leisure:hover, .event-card.type-meetup:hover {
      border-color: rgba(245, 158, 11, 0.5);
      box-shadow: 0 20px 40px -15px rgba(245, 158, 11, 0.3);
    }

    /* ── Hero Image ──────────────────────────────── */
    .card-hero-image {
      position: relative;
      height: 180px;
      overflow: hidden;
    }

    .hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .event-card:hover .hero-img {
      transform: scale(1.05);
    }

    .hero-img-overlay {
      position: absolute;
      inset: 0;
      opacity: 0.65;
    }

    .hero-img-badges {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 6px;
    }

    /* ── Banner (Workshop/Course) ─────────────────── */
    .card-banner {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
    }

    .banner-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .banner-modality-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(10px);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      color: #ffffff;
      font-weight: 500;
      width: fit-content;
    }

    /* ── Badges ──────────────────────────────────── */
    .modality-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .modality-dot.virtual { background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }
    .modality-dot.presencial { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
    .modality-dot.híbrido { background: #a855f7; box-shadow: 0 0 8px #a855f7; }

    .badge-pill {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 4px 10px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.9);
      color: #0f172a;
    }

    .badge-urgent {
      background: #ef4444;
      color: #ffffff;
      animation: pulseGlow 2s infinite ease-in-out;
    }

    .badge-free {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
    }

    @keyframes pulseGlow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.85; }
    }

    /* ── Card Body ───────────────────────────────── */
    .card-body {
      padding: 22px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 14px;
    }

    .card-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
    }

    .badge-level {
      color: #a5b4fc;
      background: rgba(99, 102, 241, 0.12);
      padding: 3px 10px;
      border-radius: 6px;
      font-weight: 600;
      border: 1px solid rgba(99, 102, 241, 0.25);
    }

    .badge-level-concert {
      color: #f9a8d4;
      background: rgba(236, 72, 153, 0.12);
      border-color: rgba(236, 72, 153, 0.3);
    }

    .badge-level-course {
      color: #c4b5fd;
      background: rgba(124, 58, 237, 0.12);
      border-color: rgba(124, 58, 237, 0.3);
    }

    .badge-level-leisure {
      color: #fcd34d;
      background: rgba(245, 158, 11, 0.12);
      border-color: rgba(245, 158, 11, 0.3);
    }

    .badge-date {
      color: #94a3b8;
      font-weight: 500;
    }

    .card-title {
      font-size: 1.22rem;
      font-weight: 700;
      color: #f8fafc;
      line-height: 1.35;
      margin: 0;
      font-family: 'Outfit', sans-serif;
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0;
    }

    /* ── Concert LineUp ──────────────────────────── */
    .lineup-box {
      background: rgba(236, 72, 153, 0.06);
      border: 1px solid rgba(236, 72, 153, 0.18);
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .lineup-header {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #f9a8d4;
    }

    .lineup-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .lineup-artist {
      font-size: 0.82rem;
      color: #fce7f3;
      font-weight: 500;
    }

    .lineup-more {
      font-size: 0.75rem;
      color: #f9a8d4;
      font-style: italic;
    }

    .concert-meta-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }

    .meta-chip {
      font-size: 0.72rem;
      background: rgba(0,0,0,0.25);
      color: #cbd5e1;
      padding: 3px 9px;
      border-radius: 9999px;
      border: 1px solid rgba(255,255,255,0.08);
    }

    /* ── Leisure Highlights ──────────────────────── */
    .leisure-box {
      background: rgba(245, 158, 11, 0.06);
      border: 1px solid rgba(245, 158, 11, 0.18);
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .leisure-header {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #fcd34d;
    }

    .leisure-highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .highlight-tag {
      font-size: 0.75rem;
      background: rgba(245, 158, 11, 0.12);
      color: #fde68a;
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }

    /* ── Instructor Box ──────────────────────────── */
    .instructor-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.03);
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .instructor-img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #6366f1;
    }

    .instructor-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }

    .instructor-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: #f1f5f9;
    }

    .instructor-role {
      font-size: 0.75rem;
      color: #64748b;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    /* ── Course Modules ──────────────────────────── */
    .course-modules {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .modules-header {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #c4b5fd;
    }

    .module-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .module-tag {
      font-size: 0.73rem;
      background: rgba(124, 58, 237, 0.12);
      color: #ddd6fe;
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid rgba(124, 58, 237, 0.25);
      font-weight: 500;
    }

    /* ── Topics (Workshops) ──────────────────────── */
    .topics-preview {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .topic-tag {
      font-size: 0.78rem;
      color: #cbd5e1;
      line-height: 1.4;
    }

    /* ── Modality inline (for concert/leisure) ───── */
    .modality-pill-inline {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .sep { color: #475569; }

    /* ── Spots Bar ───────────────────────────────── */
    .spots-progress-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
    }

    .spots-text-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
    }

    .spots-label { color: #64748b; }
    .spots-counter { color: #38bdf8; font-weight: 600; }
    .spots-free { color: #34d399; }

    .progress-track {
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #38bdf8, #6366f1);
      border-radius: 9999px;
      transition: width 0.4s ease;
    }

    .progress-fill.progress-critical {
      background: linear-gradient(90deg, #f59e0b, #ef4444);
    }

    .progress-fill.progress-free {
      background: linear-gradient(90deg, #10b981, #34d399);
    }

    /* ── Card Footer ─────────────────────────────── */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      gap: 12px;
    }

    .price-container {
      display: flex;
      flex-direction: column;
    }

    .price-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
    }

    .price-numbers {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .current-price {
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
    }

    .current-price.price-free {
      font-size: 1.1rem;
      color: #34d399;
      letter-spacing: 0.05em;
    }

    .original-price {
      font-size: 0.88rem;
      color: #64748b;
      text-decoration: line-through;
    }

    .currency {
      font-size: 0.72rem;
      color: #38bdf8;
      font-weight: 600;
    }

    /* ── CTA Buttons ─────────────────────────────── */
    .cta-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-detail {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      padding: 9px 14px;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .btn-detail:hover {
      border-color: #ffffff;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }

    .btn-book {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      color: #ffffff;
      border: none;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
      white-space: nowrap;
    }

    .btn-book:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
      filter: brightness(1.1);
    }

    /* Concert CTA — pink */
    .btn-book-concert {
      background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
      box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
    }

    .btn-book-concert:hover {
      box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
    }

    /* Course CTA — violet */
    .btn-book-course {
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
    }

    .btn-book-course:hover {
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
    }

    /* Leisure / Free CTA — green */
    .btn-book-leisure {
      background: linear-gradient(135deg, #10b981 0%, #0284c7 100%);
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
    }

    .btn-book-leisure:hover {
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.55);
    }
  `],
})
export class EventCardComponent {
  @Input({ required: true }) event!: WorkshopEvent;
  @Output() viewDetails = new EventEmitter<WorkshopEvent>();
  @Output() bookNow = new EventEmitter<WorkshopEvent>();

  isConcertOrLeisure(type?: string): boolean {
    return type === 'concert' || type === 'leisure' || type === 'meetup';
  }

  getCardTypeClass(type?: string): string {
    if (!type) return '';
    return `type-${type}`;
  }

  getBadgeClass(category: string): string {
    switch (category) {
      case 'ai': return 'badge-pill-indigo';
      case 'architecture': return 'badge-pill-cyan';
      case 'ux': return 'badge-pill-rose';
      case 'leadership': return 'badge-pill-amber';
      case 'concert': return 'badge-pill-pink';
      case 'course': return 'badge-pill-violet';
      case 'leisure':
      case 'meetup': return 'badge-pill-amber';
      default: return 'badge-pill-indigo';
    }
  }

  getEventTypeIcon(type?: string): string {
    switch (type) {
      case 'concert': return '🎵';
      case 'course': return '🎓';
      case 'leisure': return '🎉';
      case 'meetup': return '🤝';
      case 'workshop': return '⚡';
      default: return '';
    }
  }

  getEventTypeBadgeClass(type?: string): string {
    switch (type) {
      case 'concert': return 'badge-level badge-level-concert';
      case 'course': return 'badge-level badge-level-course';
      case 'leisure':
      case 'meetup': return 'badge-level badge-level-leisure';
      default: return 'badge-level';
    }
  }

  getOverlayGradient(gradient: string): string {
    // Extract just the colors for a bottom-to-top fade overlay
    return `linear-gradient(to top, rgba(7, 10, 18, 0.95) 0%, rgba(7, 10, 18, 0.3) 100%)`;
  }

  getPriceLabel(type?: string): string {
    switch (type) {
      case 'concert': return 'Precio de Entrada';
      case 'course': return 'Inversión en tu Carrera';
      case 'leisure':
      case 'meetup': return 'Inscripción';
      default: return 'Inversión';
    }
  }

  getDetailButtonLabel(type?: string): string {
    switch (type) {
      case 'concert': return 'Ver Detalles';
      case 'course': return 'Ver Temario';
      case 'leisure':
      case 'meetup': return 'Ver Info';
      default: return 'Ver Temario';
    }
  }

  getBookButtonLabel(type?: string, price?: number): string {
    if (price === 0) return 'Registrarme Gratis';
    switch (type) {
      case 'concert': return '🎟️ Comprar Entrada';
      case 'course': return '🎓 Inscribirme';
      case 'leisure': return '🎉 Reservar Cupo';
      case 'meetup': return '🤝 Registrarme';
      default: return 'Agendar Lugar';
    }
  }

  getBookButtonClass(type?: string): string {
    switch (type) {
      case 'concert': return 'btn-book-concert';
      case 'course': return 'btn-book-course';
      case 'leisure':
      case 'meetup': return 'btn-book-leisure';
      default: return '';
    }
  }
}
