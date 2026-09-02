import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopEvent } from 'shared-kernel';

@Component({
  selector: 'mfe-event-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="event-card">
      <!-- Card Top Visual Banner -->
      <div class="card-banner" [style.background]="event.accentGradient">
        <div class="banner-top-row">
          <span class="badge-pill" [ngClass]="getBadgeClass(event.category)">
            {{ event.categoryLabel }}
          </span>
          <span class="badge-pill badge-urgent" *ngIf="event.spotsRemaining <= 4">
            ⚡ ¡Solo {{ event.spotsRemaining }} cupos!
          </span>
        </div>
        <div class="banner-modality-pill">
          <span class="modality-dot" [ngClass]="event.modality.toLowerCase()"></span>
          {{ event.modality }} • {{ event.duration }}
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <div class="card-meta-row">
          <span class="badge-level">{{ event.level }}</span>
          <span class="badge-date">📅 {{ event.startDate }}</span>
        </div>

        <h3 class="card-title">{{ event.title }}</h3>
        <p class="card-subtitle">{{ event.subtitle }}</p>

        <!-- Instructor Row -->
        <div class="instructor-box">
          <img [src]="event.instructor.avatar" [alt]="event.instructor.name" class="instructor-img" loading="lazy" />
          <div class="instructor-info">
            <span class="instructor-name">{{ event.instructor.name }}</span>
            <span class="instructor-role">{{ event.instructor.role }} • {{ event.instructor.company }}</span>
          </div>
        </div>

        <!-- Topics Snippet -->
        <div class="topics-preview">
          <span class="topic-tag" *ngFor="let topic of event.topics.slice(0, 2)">
            ✓ {{ topic }}
          </span>
        </div>

        <!-- Spots Progress Bar -->
        <div class="spots-progress-container">
          <div class="spots-text-row">
            <span class="spots-label">Disponibilidad en tiempo real</span>
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

        <!-- Card Footer: Price and CTA -->
        <div class="card-footer">
          <div class="price-container">
            <span class="price-label">Inversión</span>
            <div class="price-numbers">
              <span class="current-price">\${{ event.price }}</span>
              <span class="original-price" *ngIf="event.originalPrice > event.price">\${{ event.originalPrice }}</span>
              <span class="currency">USD</span>
            </div>
          </div>

          <div class="cta-actions">
            <button type="button" class="btn-detail" (click)="viewDetails.emit(event)">
              Ver Temario
            </button>
            <button type="button" class="btn-book" (click)="bookNow.emit(event)">
              Agendar Lugar
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

    @keyframes pulseGlow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.85; }
    }

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
  `],
})
export class EventCardComponent {
  @Input({ required: true }) event!: WorkshopEvent;
  @Output() viewDetails = new EventEmitter<WorkshopEvent>();
  @Output() bookNow = new EventEmitter<WorkshopEvent>();

  getBadgeClass(category: string): string {
    switch (category) {
      case 'ai': return 'badge-pill-indigo';
      case 'architecture': return 'badge-pill-cyan';
      case 'ux': return 'badge-pill-rose';
      case 'leadership': return 'badge-pill-amber';
      default: return 'badge-pill-indigo';
    }
  }
}
