import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkshopEvent } from 'shared-kernel';

@Component({
  selector: 'mfe-event-detail-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="drawer-overlay" (click)="close.emit()">
      <div class="drawer-content" (click)="$event.stopPropagation()">
        <!-- Drawer Header -->
        <div class="drawer-header" [style.background]="event.accentGradient">
          <div class="header-top">
            <span class="category-tag">{{ event.categoryLabel }}</span>
            <button type="button" class="btn-close" (click)="close.emit()" aria-label="Cerrar">✕</button>
          </div>
          <h2 class="drawer-title">{{ event.title }}</h2>
          <p class="drawer-subtitle">{{ event.subtitle }}</p>
          <div class="header-badges">
            <span class="pill-info">⏱ {{ event.duration }}</span>
            <span class="pill-info">📍 {{ event.location }}</span>
            <span class="pill-info">🎯 {{ event.level }}</span>
          </div>
        </div>

        <!-- Drawer Body Scrollable -->
        <div class="drawer-scroll">
          <!-- CONCERT: Line-Up & Festival Specs -->
          <section class="drawer-section" *ngIf="event.eventType === 'concert' && event.concertData as concert">
            <h4 class="section-heading accent-pink">Line-Up & Artistas Confirmados</h4>
            <div class="concert-artists-grid">
              <div class="artist-pill" *ngFor="let artist of concert.lineUp">
                <span class="artist-mic">🎤</span>
                <span class="artist-title">{{ artist }}</span>
              </div>
            </div>
            <div class="concert-specs-row">
              <div class="spec-card">
                <span class="spec-label">Género Musical</span>
                <span class="spec-value">{{ concert.genre }}</span>
              </div>
              <div class="spec-card">
                <span class="spec-label">Escenario</span>
                <span class="spec-value">{{ concert.stageName }}</span>
              </div>
              <div class="spec-card">
                <span class="spec-label">Apertura Puertas</span>
                <span class="spec-value">{{ concert.doorOpeningTime }}</span>
              </div>
              <div class="spec-card">
                <span class="spec-label">Edad Mínima</span>
                <span class="spec-value">{{ concert.ageRestriction }}</span>
              </div>
            </div>
          </section>

          <!-- LEISURE / MEETUP: Experience Specs -->
          <section class="drawer-section" *ngIf="(event.eventType === 'leisure' || event.eventType === 'meetup') && event.leisureData as leisure">
            <h4 class="section-heading accent-amber">Experiencia & Actividades de Ocio</h4>
            <div class="leisure-activities-grid">
              <div class="activity-card" *ngFor="let act of leisure.activitiesHighlight">
                <span class="activity-star">✦</span>
                <span>{{ act }}</span>
              </div>
            </div>
            <div class="leisure-specs-row">
              <div class="spec-card" *ngIf="leisure.dressCode">
                <span class="spec-label">Dress Code</span>
                <span class="spec-value">{{ leisure.dressCode }}</span>
              </div>
              <div class="spec-card">
                <span class="spec-label">Alimentación / Catering</span>
                <span class="spec-value">{{ leisure.foodIncluded ? '✅ Incluida durante el evento' : 'Zonas Gourmet disponibles' }}</span>
              </div>
              <div class="spec-card" *ngIf="leisure.minAge">
                <span class="spec-label">Edad Mínima</span>
                <span class="spec-value">+{{ leisure.minAge }} años</span>
              </div>
              <div class="spec-card" *ngIf="event.meetupData?.communityName">
                <span class="spec-label">Comunidad Organizadora</span>
                <span class="spec-value">{{ event.meetupData?.communityName }}</span>
              </div>
            </div>
          </section>

          <!-- COURSE: Syllabus & Modules -->
          <section class="drawer-section" *ngIf="event.eventType === 'course' && event.courseData as course">
            <h4 class="section-heading accent-violet">Estructura Académica del Curso</h4>
            <div class="course-metrics-row">
              <div class="metric-box">
                <span class="metric-val">{{ course.syllabusWeeks }} Semanas</span>
                <span class="metric-lbl">Duración Programa</span>
              </div>
              <div class="metric-box">
                <span class="metric-val">{{ course.academicHours }} Horas</span>
                <span class="metric-lbl">Carga Académica</span>
              </div>
              <div class="metric-box">
                <span class="metric-val">100% Práctico</span>
                <span class="metric-lbl">Proyectos Reales</span>
              </div>
            </div>
            <div class="modules-accordion" *ngIf="course.modules">
              <div class="module-item" *ngFor="let mod of course.modules; let idx = index">
                <span class="mod-badge">Módulo {{ idx + 1 }}</span>
                <span class="mod-title">{{ mod }}</span>
              </div>
            </div>
          </section>

          <!-- Instructor Profile (Only if exists) -->
          <section class="drawer-section" *ngIf="event.instructor">
            <h4 class="section-heading">Mentor & Especialista</h4>
            <div class="instructor-detailed-card">
              <img [src]="event.instructor.avatar" [alt]="event.instructor.name" class="avatar-lg" />
              <div class="instructor-body">
                <div class="name-badge-row">
                  <h3 class="name">{{ event.instructor.name }}</h3>
                  <span class="speaker-badge" *ngIf="event.instructor.badge">{{ event.instructor.badge }}</span>
                </div>
                <p class="role">{{ event.instructor.role }} en {{ event.instructor.company }}</p>
                <p class="bio">{{ event.instructor.bio }}</p>
              </div>
            </div>
          </section>

          <!-- Overview & Description -->
          <section class="drawer-section">
            <h4 class="section-heading">Descripción del Evento</h4>
            <p class="description-text">{{ event.description }}</p>
          </section>

          <!-- Syllabus & Topics / Highlights -->
          <section class="drawer-section">
            <h4 class="section-heading">{{ event.eventType === 'concert' ? 'Puntos Clave del Show' : 'Contenido y Temario' }}</h4>
            <div class="topics-list">
              <div class="topic-item" *ngFor="let topic of event.topics; let i = index">
                <span class="topic-num">0{{ i + 1 }}</span>
                <span class="topic-desc">{{ topic }}</span>
              </div>
            </div>
          </section>

          <!-- What's Included -->
          <section class="drawer-section">
            <h4 class="section-heading">¿Qué Incluye tu Entrada / Registro?</h4>
            <div class="includes-grid">
              <div class="include-item" *ngFor="let item of event.includes">
                <span class="check-icon">✓</span>
                <span>{{ item }}</span>
              </div>
            </div>
          </section>

          <!-- Available Schedule Dates -->
          <section class="drawer-section">
            <h4 class="section-heading">Fechas y Sesiones Disponibles</h4>
            <div class="slots-grid">
              <div class="slot-card" *ngFor="let slot of event.scheduleDates" [class.sold-out]="slot.availableSeats === 0">
                <div class="slot-day-time">
                  <span class="day-badge">{{ slot.dayName }}</span>
                  <span class="slot-date">{{ slot.date }}</span>
                  <span class="slot-time">{{ slot.time }}</span>
                </div>
                <div class="slot-status">
                  <span *ngIf="slot.availableSeats > 0" class="seats-avail">
                    {{ slot.availableSeats }} cupos disponibles
                  </span>
                  <span *ngIf="slot.availableSeats === 0" class="seats-none">
                    Agotado
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Drawer Footer with Sticky CTA -->
        <div class="drawer-footer">
          <div class="price-summary">
            <span class="price-val" *ngIf="event.price > 0">{{ '$' + event.price }} USD</span>
            <span class="price-val text-free" *ngIf="event.price === 0">GRATIS</span>
            <span class="price-sub">{{ event.price === 0 ? 'Registro libre 2026' : 'Garantía y confirmación inmediata' }}</span>
          </div>
          <button type="button" class="btn-action-book" [ngClass]="getBtnClass(event.eventType)" (click)="book.emit(event)">
            {{ getBtnText(event.eventType, event.price) }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(4, 7, 15, 0.82);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
      animation: fadeIn 0.25s ease-out;
    }

    .drawer-content {
      width: 100%;
      max-width: 640px;
      height: 100%;
      background: #0d1322;
      border-left: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      flex-direction: column;
      box-shadow: -15px 0 50px rgba(0, 0, 0, 0.8);
      animation: slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideLeft {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .drawer-header {
      padding: 28px 28px 24px;
      position: relative;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .category-tag {
      background: rgba(0, 0, 0, 0.45);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .btn-close {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.08);
    }

    .drawer-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 8px;
      line-height: 1.25;
      font-family: 'Outfit', sans-serif;
    }

    .drawer-subtitle {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.88);
      margin: 0 0 16px;
      line-height: 1.5;
    }

    .header-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill-info {
      background: rgba(0, 0, 0, 0.4);
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 0.78rem;
      color: #ffffff;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .drawer-scroll {
      flex-grow: 1;
      overflow-y: auto;
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .section-heading {
      font-size: 0.88rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #38bdf8;
      font-weight: 700;
      margin: 0 0 14px;
    }

    .section-heading.accent-pink {
      color: #f43f5e;
    }

    .section-heading.accent-amber {
      color: #f59e0b;
    }

    .section-heading.accent-violet {
      color: #a855f7;
    }

    /* Concert elements */
    .concert-artists-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
    }

    .artist-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.3);
      padding: 8px 14px;
      border-radius: 9999px;
      color: #fecdd3;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .concert-specs-row, .leisure-specs-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
    }

    .spec-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 10px 12px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .spec-label {
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .spec-value {
      font-size: 0.85rem;
      font-weight: 600;
      color: #ffffff;
    }

    /* Leisure elements */
    .leisure-activities-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .activity-card {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.2);
      padding: 10px 14px;
      border-radius: 8px;
      color: #fef3c7;
      font-size: 0.88rem;
    }

    .activity-star {
      color: #f59e0b;
    }

    /* Course elements */
    .course-metrics-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }

    .metric-box {
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.25);
      border-radius: 10px;
      padding: 12px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-val {
      font-size: 1.1rem;
      font-weight: 800;
      color: #d8b4fe;
    }

    .metric-lbl {
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .modules-accordion {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .module-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 10px 14px;
      border-radius: 8px;
    }

    .mod-badge {
      background: #7c3aed;
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .mod-title {
      font-size: 0.88rem;
      color: #f1f5f9;
      font-weight: 500;
    }

    /* Instructor Profile */
    .instructor-detailed-card {
      display: flex;
      gap: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      padding: 16px;
      border-radius: 14px;
    }

    .avatar-lg {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #6366f1;
    }

    .name-badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .name {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
    }

    .speaker-badge {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(99, 102, 241, 0.35);
    }

    .role {
      font-size: 0.82rem;
      color: #94a3b8;
      margin: 2px 0 8px;
    }

    .bio {
      font-size: 0.84rem;
      color: #cbd5e1;
      line-height: 1.5;
      margin: 0;
    }

    .description-text {
      font-size: 0.92rem;
      color: #cbd5e1;
      line-height: 1.65;
      margin: 0;
    }

    .topics-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .topic-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 12px 16px;
      border-radius: 10px;
    }

    .topic-num {
      font-weight: 800;
      color: #6366f1;
      font-size: 0.88rem;
    }

    .topic-desc {
      font-size: 0.88rem;
      color: #e2e8f0;
      line-height: 1.45;
    }

    .includes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    @media (max-width: 500px) {
      .includes-grid { grid-template-columns: 1fr; }
    }

    .include-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      color: #cbd5e1;
    }

    .check-icon {
      color: #10b981;
      font-weight: bold;
    }

    .slots-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .slot-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 12px 16px;
      border-radius: 10px;
    }

    .slot-card.sold-out {
      opacity: 0.45;
    }

    .slot-day-time {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .day-badge {
      background: rgba(99, 102, 241, 0.2);
      color: #c7d2fe;
      font-size: 0.72rem;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 600;
    }

    .slot-date {
      font-size: 0.88rem;
      font-weight: 600;
      color: #ffffff;
    }

    .slot-time {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .seats-avail {
      font-size: 0.78rem;
      color: #38bdf8;
      font-weight: 600;
    }

    .seats-none {
      font-size: 0.78rem;
      color: #ef4444;
      font-weight: 600;
    }

    .drawer-footer {
      padding: 18px 28px;
      background: #080c16;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .price-summary {
      display: flex;
      flex-direction: column;
    }

    .price-val {
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
    }

    .price-val.text-free {
      color: #34d399;
    }

    .price-sub {
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .btn-action-book {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 14px 24px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      transition: all 0.25s ease;
      white-space: nowrap;
    }

    .btn-action-book:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(99, 102, 241, 0.6);
      filter: brightness(1.1);
    }

    .btn-concert {
      background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
      box-shadow: 0 4px 20px rgba(236, 72, 153, 0.5);
    }

    .btn-course {
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.5);
    }

    .btn-leisure {
      background: linear-gradient(135deg, #10b981 0%, #0284c7 100%);
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.5);
    }
  `],
})
export class EventDetailDrawerComponent {
  @Input({ required: true }) event!: WorkshopEvent;
  @Output() close = new EventEmitter<void>();
  @Output() book = new EventEmitter<WorkshopEvent>();

  getBtnClass(type?: string): string {
    switch (type) {
      case 'concert': return 'btn-concert';
      case 'course': return 'btn-course';
      case 'leisure':
      case 'meetup': return 'btn-leisure';
      default: return '';
    }
  }

  getBtnText(type?: string, price?: number): string {
    if (price === 0) return 'Registrarme Gratis Ahora →';
    switch (type) {
      case 'concert': return 'Comprar Entradas Concierto →';
      case 'course': return 'Inscribirme en el Curso →';
      case 'leisure':
      case 'meetup': return 'Confirmar Asistencia →';
      default: return 'Agendar Ahora y Reservar Cupo →';
    }
  }
}
