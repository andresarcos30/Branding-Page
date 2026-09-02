import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shell-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="testimonials-section" id="testimonios">
      <div class="testimonials-container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="eyebrow">HISTORIAS DE ÉXITO</span>
          <h2 class="section-title">Lo que dicen quienes ya asistieron</h2>
          <p class="section-desc">
            Más de 25,000 profesionales han transformado sus habilidades y acelerado su proyección técnica.
          </p>
        </div>

        <!-- Cards Grid -->
        <div class="testimonials-grid">
          <div class="testimonial-card" *ngFor="let t of testimonials">
            <div class="card-stars">★★★★★</div>
            <p class="card-quote">"{{ t.quote }}"</p>
            <div class="attendee-footer">
              <img [src]="t.avatar" [alt]="t.name" class="attendee-avatar" />
              <div class="attendee-data">
                <span class="attendee-name">{{ t.name }}</span>
                <span class="attendee-role">{{ t.role }} • {{ t.company }}</span>
                <span class="workshop-tag">Asistió a: {{ t.workshop }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials-section {
      padding: 90px 24px;
      position: relative;
    }

    .testimonials-container {
      max-width: 1280px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      max-width: 720px;
      margin: 0 auto 50px;
    }

    .eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      color: #f43f5e;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 2.7rem);
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 16px;
      font-family: 'Outfit', sans-serif;
    }

    .section-desc {
      font-size: 1.05rem;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }

    .testimonial-card {
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: all 0.3s ease;
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.35);
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
    }

    .card-stars {
      color: #fbbf24;
      font-size: 1.1rem;
      letter-spacing: 2px;
    }

    .card-quote {
      font-size: 0.95rem;
      color: #e2e8f0;
      line-height: 1.65;
      margin: 0;
      flex-grow: 1;
      font-style: italic;
    }

    .attendee-footer {
      display: flex;
      align-items: center;
      gap: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 16px;
    }

    .attendee-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #6366f1;
    }

    .attendee-data {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .attendee-name {
      font-size: 0.92rem;
      font-weight: 700;
      color: #ffffff;
    }

    .attendee-role {
      font-size: 0.78rem;
      color: #94a3b8;
    }

    .workshop-tag {
      font-size: 0.72rem;
      color: #38bdf8;
      font-weight: 500;
      margin-top: 2px;
    }
  `],
})
export class TestimonialsComponent {
  readonly testimonials = [
    {
      name: 'Gabriel Morales',
      role: 'Staff Software Engineer',
      company: 'Rappi',
      workshop: 'Micro Frontends Enterprise',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
      quote: 'El taller de Micro Frontends nos ahorró al menos 4 meses de investigación técnica. Pudimos desacoplar la aplicación web de nuestro core bancario con cero downtime.',
    },
    {
      name: 'Daniela Salcedo',
      role: 'Engineering Lead',
      company: 'Mercado Libre',
      workshop: 'IA Generativa & Agentes Autónomos',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      quote: 'La Dra. Valeria Montes explica conceptos de LLMs y RAG con un nivel de profundidad que no encuentras en ningún curso online. La sesión 1-a-1 de mentoría fue extraordinaria.',
    },
    {
      name: 'Carlos Andrés Vega',
      role: 'Senior Product Designer',
      company: 'Fintech Studio',
      workshop: 'Design Systems de Clase Mundial',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=160&auto=format&fit=crop&q=80',
      quote: 'Poder conectar tokens de Figma directamente a componentes en código Angular con accesibilidad AAA cambió por completo cómo colaboramos diseño e ingeniería en mi squad.',
    },
  ];
}
