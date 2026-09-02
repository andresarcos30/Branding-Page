import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkshopEvent, EventCategory, EventModality, CrossMfeBusService } from 'shared-kernel';
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
          <span>Temporada de Talleres 2026</span>
        </div>
        <h2 class="catalog-title">Explora Nuestros Talleres & Masterclasses</h2>
        <p class="catalog-desc">
          Programas intensivos dirigidos por líderes activos en la industria global. 
          Aprende con código en vivo, casos de producción reales y acompañamiento cercano.
        </p>
      </div>

      <!-- Controls & Filters Bar -->
      <div class="filters-panel">
        <!-- Search Input -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por tema, tecnología o mentor..."
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
            [class.active]="selectedModality() === 'Virtual'"
            (click)="selectedModality.set('Virtual')"
          >🌐 Virtual Live</button>
          <button
            type="button"
            class="pill-btn"
            [class.active]="selectedModality() === 'Presencial'"
            (click)="selectedModality.set('Presencial')"
          >🏛 Presencial</button>
          <button
            type="button"
            class="pill-btn"
            [class.active]="selectedModality() === 'Híbrido'"
            (click)="selectedModality.set('Híbrido')"
          >⚡ Híbrido</button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="category-tabs">
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
        <span>Mostrando <strong>{{ filteredEvents().length }}</strong> experiencias formativas disponibles</span>
      </div>

      <!-- Workshop Cards Grid -->
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
          <h3>No encontramos talleres con esos criterios</h3>
          <p>Intenta ajustar la búsqueda o seleccionar otra categoría o modalidad.</p>
          <button type="button" class="btn-reset" (click)="resetFilters()">
            Restablecer Filtros
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
      max-width: 1280px;
      margin: 0 auto;
      padding: 60px 24px 80px;
    }

    .catalog-header {
      text-align: center;
      max-width: 760px;
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
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
      margin: 0 0 16px;
      font-family: 'Outfit', sans-serif;
      letter-spacing: -0.02em;
    }

    .catalog-desc {
      font-size: 1.05rem;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0;
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
      max-width: 420px;
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
      font-size: 0.88rem;
      color: #64748b;
      margin-bottom: 24px;
    }

    .results-info strong {
      color: #38bdf8;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
  readonly selectedCategory = signal<string>('all');
  readonly selectedModality = signal<string>('all');
  readonly drawerEvent = signal<WorkshopEvent | null>(null);

  readonly categories = [
    { id: 'all', label: 'Todos los Talleres', icon: '✨' },
    { id: 'ai', label: 'IA & Agentes', icon: '🧠' },
    { id: 'architecture', label: 'Arquitectura & MFE', icon: '🏛' },
    { id: 'ux', label: 'Diseño & UX Systems', icon: '🎨' },
    { id: 'leadership', label: 'Liderazgo & Tech Exec', icon: '👑' },
    { id: 'cloud', label: 'Cloud & FinOps', icon: '☁️' },
  ];

  readonly filteredEvents = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();
    const mod = this.selectedModality();

    return this.allEvents().filter((event) => {
      // Category filter
      if (cat !== 'all' && event.category !== cat) {
        return false;
      }
      // Modality filter
      if (mod !== 'all' && event.modality !== mod) {
        return false;
      }
      // Text search
      if (q) {
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesSub = event.subtitle.toLowerCase().includes(q);
        const matchesInstructor = event.instructor.name.toLowerCase().includes(q);
        const matchesTopic = event.topics.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSub && !matchesInstructor && !matchesTopic) {
          return false;
        }
      }
      return true;
    });
  });

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
    this.selectedCategory.set('all');
    this.selectedModality.set('all');
  }
}
