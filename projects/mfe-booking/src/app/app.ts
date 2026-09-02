import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossMfeBusService, WorkshopEvent } from 'shared-kernel';
import { BookingModalComponent } from './components/booking-modal.component';

@Component({
  selector: 'app-mfe-booking-root',
  standalone: true,
  imports: [CommonModule, BookingModalComponent],
  template: `
    <div class="mfe-booking-app">
      <header class="standalone-header">
        <div class="header-inner">
          <div class="brand">
            <span class="brand-spark">⚡</span>
            <span class="brand-text">AURORA <small>Booking & Scheduling MFE (Port 4202)</small></span>
          </div>
          <span class="mfe-status-badge">Micro Frontend Activo</span>
        </div>
      </header>

      <main class="standalone-main">
        <div class="preview-card">
          <div class="preview-icon">📅</div>
          <h2>Motor de Agendamiento & Checkout de AURORA</h2>
          <p>
            Este micro frontend gestiona la reserva de cupos, selección de turnos en tiempo real, 
            pases de conferencia y generación de tickets digitales.
          </p>
          <div class="preview-actions">
            <button type="button" class="btn-demo-book" (click)="openDemoBooking()">
              ✨ Probar Flujo de Agendamiento Interactivo
            </button>
          </div>
        </div>
      </main>

      <!-- The Federated Booking Modal -->
      <mfe-booking-modal></mfe-booking-modal>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .mfe-booking-app {
      min-height: 100vh;
      background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #070a12 65%);
    }

    .standalone-header {
      background: rgba(13, 18, 31, 0.85);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      padding: 14px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.15rem;
      color: #ffffff;
    }

    .brand-spark {
      color: #06b6d4;
      font-size: 1.3rem;
    }

    .brand small {
      font-size: 0.72rem;
      font-weight: 500;
      color: #94a3b8;
      margin-left: 6px;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 8px;
      border-radius: 6px;
    }

    .mfe-status-badge {
      font-size: 0.75rem;
      color: #38bdf8;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: 600;
    }

    .standalone-main {
      max-width: 700px;
      margin: 100px auto;
      padding: 0 20px;
      text-align: center;
    }

    .preview-card {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 48px 32px;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    .preview-icon {
      font-size: 3.5rem;
      margin-bottom: 16px;
    }

    .preview-card h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 12px;
      font-family: 'Outfit', sans-serif;
    }

    .preview-card p {
      color: #94a3b8;
      line-height: 1.6;
      font-size: 1rem;
      margin: 0 0 28px;
    }

    .btn-demo-book {
      background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
      color: #ffffff;
      border: none;
      padding: 14px 28px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
      transition: all 0.25s ease;
    }

    .btn-demo-book:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(99, 102, 241, 0.55);
    }
  `],
})
export class App implements OnInit {
  private readonly busService = inject(CrossMfeBusService);

  readonly sampleEvent: WorkshopEvent = {
    id: 'aurora-ai-agents',
    title: 'IA Generativa Aplicada & Agentes Autónomos',
    subtitle: 'Construye sistemas multi-agente con LLMs, RAG híbrido y orquestación para producción.',
    category: 'ai',
    categoryLabel: 'Inteligencia Artificial',
    level: 'Avanzado',
    modality: 'Virtual',
    location: 'Live Streaming Ultra HD + Lab Virtual',
    duration: '16 Horas • 4 Sesiones',
    startDate: '24 Octubre 2026',
    badge: 'Bestseller ★ 4.98',
    price: 380,
    originalPrice: 480,
    spotsTotal: 30,
    spotsRemaining: 4,
    accentGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    instructor: {
      name: 'Dra. Valeria Montes',
      role: 'Principal AI Architect',
      company: 'Ex-DeepMind',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      bio: 'Investigadora de frontera y arquitecta de LLMs.',
    },
    description: 'Aprende los fundamentos y arquitecturas avanzadas de agentes inteligentes.',
    topics: ['Planificación y memoria de agentes', 'RAG Contextual y reranking', 'Fine-tuning eficiente'],
    includes: ['Certificado verificado', 'Acceso a grabaciones', 'Plantillas de producción'],
    scheduleDates: [
      { id: 'ai-s1', date: '24 Oct 2026', dayName: 'Sábado', time: '09:00 - 13:00 (UTC-5)', period: 'Mañana', availableSeats: 2 },
      { id: 'ai-s2', date: '31 Oct 2026', dayName: 'Sábado', time: '09:00 - 13:00 (UTC-5)', period: 'Mañana', availableSeats: 2 },
    ],
  };

  ngOnInit(): void {}

  openDemoBooking(): void {
    this.busService.openBooking(this.sampleEvent);
  }
}
