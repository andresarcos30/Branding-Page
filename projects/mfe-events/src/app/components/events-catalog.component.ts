import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkshopEvent, CrossMfeBusService } from 'shared-kernel';
import { EventsCatalogService } from '../services/events-catalog.service';
import { EventCardComponent } from './event-card.component';
import { EventDetailDrawerComponent } from './event-detail-drawer.component';

@Component({
  selector: 'mfe-events-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent, EventDetailDrawerComponent],
  template: `
    <section class="events-catalog-container" id="talleres">
      <!-- Section Header -->
      <div class="catalog-header">
        <div class="header-badge">
          <span class="pulse-spark"></span>
          <span>Temporada Global 2026 • Experiencias Oficiales</span>
        </div>
        <h2 class="catalog-title">Cursos, Conciertos & Eventos de Ocio</h2>
        <p class="catalog-desc">
          Desde academias intensivas de código e IA, hasta festivales de música masivos, hackathons de 48 horas 
          y noches exclusivas de jazz y networking. Descubre la agenda 2026 diseñada para inspirar y conectar.
        </p>
      </div>

      <!-- Main Hub Categories (Macro Tabs 2026) -->
      <div class="macro-hub-tabs">
        <button
          type="button"
          class="macro-tab"
          [class.active]="selectedMacroType() === 'all'"
          (click)="setMacroType('all')"
        >
          <span class="macro-icon">✨</span>
          <div class="macro-text">
            <span class="macro-title">Todos</span>
            <span class="macro-count">{{ allEvents().length }} Experiencias</span>
          </div>
        </button>

        <button
          type="button"
          class="macro-tab tab-course"
          [class.active]="selectedMacroType() === 'course'"
          (click)="setMacroType('course')"
        >
          <span class="macro-icon">🎓</span>
          <div class="macro-text">
            <span class="macro-title">Cursos & Academias</span>
            <span class="macro-count">{{ countByType('course') }} Programas</span>
          </div>
        </button>

        <button
          type="button"
          class="macro-tab tab-concert"
          [class.active]="selectedMacroType() === 'concert'"
          (click)="setMacroType('concert')"
        >
          <span class="macro-icon">🎵</span>
          <div class="macro-text">
            <span class="macro-title">Conciertos & Festivales</span>
            <span class="macro-count">{{ countByType('concert') }} Shows en Vivo</span>
          </div>
        </button>

        <button
          type="button"
          class="macro-tab tab-leisure"
          [class.active]="selectedMacroType() === 'leisure'"
          (click)="setMacroType('leisure')"
        >
          <span class="macro-icon">🎉</span>
          <div class="macro-text">
            <span class="macro-title">Ocio & Meetups</span>
            <span class="macro-count">{{ countByType('leisure') }} Encuentros</span>
          </div>
        </button>

        <button
          type="button"
          class="macro-tab tab-workshop"
          [class.active]="selectedMacroType() === 'workshop'"
          (click)="setMacroType('workshop')"
        >
          <span class="macro-icon">⚡</span>
          <div class="macro-text">
            <span class="macro-title">Talleres Avanzados</span>
            <span class="macro-count">{{ countByType('workshop') }} Masterclasses</span>
          </div>
        </button>
      </div>

      <!-- Controls & Filters Bar -->
      <div class="filters-panel">
        <!-- Search Input -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, artista, tecnología o ciudad..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            class="search-input"
          />
          <button
            *ngIf="searchQuery()"
            (click)="searchQuery.set('')"
            class="btn-clear"
            type="button"
          >✕</button>
        </div>

        <!-- Modality Filter Buttons -->
        <div class="modality-pills">
          <button
            type="button"
            class="pill-btn"
            [class.active]="selectedModality() === 'all'"
            (click)="selectedModality.set('all')"
          >Todas las Modalidades</button>
          <button
            type="button"
            class="pill-btn"
            [class.active]="selectedModality() === 'Presencial'"
            (click)="selectedModality.set('Presencial')"
          >🏛 Presencial</button>
          <button
            type="button"
            class="pill-btn"
            [class.active]="selectedModality() === 'Virtual'"
            (click)="selectedModality.set('Virtual')"
          >🌐 Virtual Live</button>
          <button
            type="button"
            class="pill-btn"
            [class.active]="selectedModality() === 'Híbrido'"
            (click)="selectedModality.set('Híbrido')"
          >⚡ Híbrido</button>
        </div>
      </div>

      <!-- Category Filter Pills for Detailed Tag Navigation -->
      <div class="category-tabs" *ngIf="selectedMacroType() === 'all' || selectedMacroType() === 'workshop'">
        <button
          *ngFor="let cat of categories"
          type="button"
          class="cat-tab"
          [class.active]="selectedCategory() === cat.id"
          (click)="onSelectCategory(cat.id)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span>{{ cat.label }}</span>
        </button>
      </div>

      <!-- Count & Result Info -->
      <div class="results-info">
        <span>Mostrando <strong>{{ filteredEvents().length }}</strong> eventos y actividades programadas para 2026</span>
        <span class="clear-filters-hint" *ngIf="searchQuery() || selectedCategory() !== 'all' || selectedModality() !== 'all' || selectedMacroType() !== 'all'">
          <button type="button" class="btn-link-reset" (click)="resetFilters()">Limpiar filtros</button>
        </span>
      </div>

      <!-- Workshop & Events Cards Grid -->
      <div class="events-grid" *ngIf="filteredEvents().length > 0; else noResults">
        <mfe-event-card
          *ngFor="let event of filteredEvents()"
          [event]="event"
          (viewDetails)="onViewDetails($event)"
          (bookNow)="onBookNow($event)"
        ></mfe-event-card>
      </div>

      <!-- No Results State -->
      <ng-template #noResults>
        <div class="no-results-box">
          <div class="empty-icon">🔎</div>
          <h3>No encontramos resultados con estos criterios</h3>
          <p>Intenta ajustar la búsqueda, restablecer los filtros o explorar otra categoría de la temporada 2026.</p>
          <button type="button" class="btn-reset" (click)="resetFilters()">
            Ver Todo el Catálogo 2026
          </button>
        </div>
      </ng-template>

      <!-- Event Detail Drawer -->
      <mfe-event-detail-drawer
        *ngIf="drawerEvent()"
        [event]="drawerEvent()!"
        (close)="drawerEvent.set(null)"
        (book)="onBookNow($event)"
      ></mfe-event-detail-drawer>
    </section>
  `,
  styles: [`
    .events-catalog-container {
      width: 100%;
      max-width: 1320px;
      margin: 0 auto;
      padding: 60px 24px 90px;
    }

    .catalog-header {
      text-align: center;
      max-width: 820px;
      margin: 0 auto 40px;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 6px 16px;
      border-radius: 9999px;
      color: #818cf8;
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }

    .pulse-spark {
      width: 8px;
      height: 8px;
      background: #818cf8;
      border-radius: 50%;
      box-shadow: 0 0 10px #818cf8;
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }

    .catalog-title {
      font-size: clamp(2.1rem, 4.2vw, 3.1rem);
      font-weight: 850;
      color: #ffffff;
      line-height: 1.18;
      margin: 0 0 16px;
      font-family: 'Outfit', sans-serif;
      letter-spacing: -0.02em;
    }

    .catalog-desc {
      font-size: 1.08rem;
      color: #94a3b8;
      line-height: 1.65;
      margin: 0;
    }

    /* Macro Hub Tabs (2026 Innovation) */
    .macro-hub-tabs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 14px;
      margin-bottom: 32px;
    }

    .macro-tab {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      cursor: pointer;
      text-align: left;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(10px);
    }

    .macro-tab:hover {
      background: rgba(255, 255, 255, 0.06);
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.18);
    }

    .macro-tab.active {
      background: rgba(99, 102, 241, 0.18);
      border-color: #6366f1;
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25);
    }

    .macro-tab.tab-course.active {
      background: rgba(124, 58, 237, 0.2);
      border-color: #a855f7;
      box-shadow: 0 8px 25px rgba(168, 85, 247, 0.3);
    }

    .macro-tab.tab-concert.active {
      background: rgba(236, 72, 153, 0.2);
      border-color: #f43f5e;
      box-shadow: 0 8px 25px rgba(244, 63, 94, 0.3);
    }

    .macro-tab.tab-leisure.active {
      background: rgba(245, 158, 11, 0.2);
      border-color: #f59e0b;
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
    }

    .macro-tab.tab-workshop.active {
      background: rgba(6, 182, 212, 0.2);
      border-color: #06b6d4;
      box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
    }

    .macro-icon {
      font-size: 1.8rem;
    }

    .macro-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .macro-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
    }

    .macro-count {
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .filters-panel {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.07);
      backdrop-filter: blur(12px);
      padding: 16px 20px;
      border-radius: 16px;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 16px;
      border-radius: 10px;
      flex-grow: 1;
      max-width: 440px;
    }

    .search-input {
      background: transparent;
      border: none;
      color: #ffffff;
      font-size: 0.9rem;
      width: 100%;
      outline: none;
    }

    .search-input::placeholder {
      color: #64748b;
    }

    .btn-clear {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .modality-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pill-btn:hover {
      background: rgba(255, 255, 255, 0.09);
      color: #ffffff;
    }

    .pill-btn.active {
      background: #6366f1;
      border-color: #6366f1;
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
    }

    .category-tabs {
      display: flex;
      overflow-x: auto;
      gap: 10px;
      padding-bottom: 8px;
      margin-bottom: 24px;
      scrollbar-width: thin;
    }

    .cat-tab {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: #94a3b8;
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .cat-tab:hover {
      background: rgba(255, 255, 255, 0.07);
      color: #ffffff;
    }

    .cat-tab.active {
      background: rgba(99, 102, 241, 0.15);
      border-color: #6366f1;
      color: #c7d2fe;
    }

    .cat-icon {
      font-size: 1.1rem;
    }

    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.88rem;
      color: #64748b;
      margin-bottom: 24px;
    }

    .results-info strong {
      color: #38bdf8;
    }

    .btn-link-reset {
      background: transparent;
      border: none;
      color: #f43f5e;
      cursor: pointer;
      font-size: 0.82rem;
      text-decoration: underline;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 28px;
    }

    @media (max-width: 640px) {
      .events-grid {
        grid-template-columns: 1fr;
      }
    }

    .no-results-box {
      text-align: center;
      padding: 60px 20px;
      background: rgba(15, 23, 42, 0.5);
      border: 1px dashed rgba(255, 255, 255, 0.12);
      border-radius: 20px;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 12px;
    }

    .no-results-box h3 {
      font-size: 1.3rem;
      color: #ffffff;
      margin: 0 0 8px;
    }

    .no-results-box p {
      color: #94a3b8;
      font-size: 0.95rem;
      margin: 0 0 20px;
    }

    .btn-reset {
      background: #6366f1;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
    }
  `],
})
export class EventsCatalogComponent {
  private readonly catalogService = inject(EventsCatalogService);
  private readonly busService = inject(CrossMfeBusService);

  readonly allEvents = signal<WorkshopEvent[]>(this.catalogService.getAllEvents());
  readonly searchQuery = signal<string>('');
  readonly selectedMacroType = signal<string>('all');
  readonly selectedCategory = signal<string>('all');
  readonly selectedModality = signal<string>('all');
  readonly drawerEvent = signal<WorkshopEvent | null>(null);

  readonly categories = [
    { id: 'all', label: 'Todos los Temas', icon: '✨' },
    { id: 'ai', label: 'IA & Agentes', icon: '🧠' },
    { id: 'architecture', label: 'Arquitectura & MFE', icon: '🏛' },
    { id: 'ux', label: 'Diseño & UX Systems', icon: '🎨' },
    { id: 'leadership', label: 'Liderazgo & Tech Exec', icon: '👑' },
    { id: 'cloud', label: 'Cloud & FinOps', icon: '☁️' },
  ];

  countByType(type: string): number {
    return this.allEvents().filter((e) => {
      if (type === 'leisure') return e.eventType === 'leisure' || e.eventType === 'meetup';
      return e.eventType === type;
    }).length;
  }

  readonly filteredEvents = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const macro = this.selectedMacroType();
    const cat = this.selectedCategory();
    const mod = this.selectedModality();

    return this.allEvents().filter((event) => {
      // Macro type filter
      if (macro !== 'all') {
        if (macro === 'leisure' && event.eventType !== 'leisure' && event.eventType !== 'meetup') {
          return false;
        } else if (macro !== 'leisure' && event.eventType !== macro && event.category !== macro) {
          return false;
        }
      }

      // Detailed category filter
      if (cat !== 'all' && event.category !== cat) {
        return false;
      }

      // Modality filter
      if (mod !== 'all' && event.modality !== mod) {
        return false;
      }

      // Search Query
      if (q) {
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesSub = event.subtitle.toLowerCase().includes(q);
        const matchesLocation = event.location.toLowerCase().includes(q);
        const matchesInstructor = event.instructor?.name.toLowerCase().includes(q) ?? false;
        const matchesConcert = event.concertData?.lineUp.some((a) => a.toLowerCase().includes(q)) ?? false;
        const matchesTopic = event.topics.some((t) => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesSub && !matchesLocation && !matchesInstructor && !matchesConcert && !matchesTopic) {
          return false;
        }
      }
      return true;
    });
  });

  setMacroType(type: string): void {
    this.selectedMacroType.set(type);
    if (type !== 'all' && type !== 'workshop') {
      this.selectedCategory.set('all');
    }
  }

  onSelectCategory(catId: string): void {
    this.selectedCategory.set(catId);
    this.busService.setCategoryFilter(catId);
  }

  onViewDetails(event: WorkshopEvent): void {
    this.drawerEvent.set(event);
  }

  onBookNow(event: WorkshopEvent): void {
    this.drawerEvent.set(null);
    this.busService.openBooking(event);
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedMacroType.set('all');
    this.selectedCategory.set('all');
    this.selectedModality.set('all');
  }
}
