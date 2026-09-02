import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shell-methodology',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="methodology-section" id="metodologia">
      <div class="section-container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="eyebrow">EL ESTÁNDAR FORMATIVO</span>
          <h2 class="section-title">El Método AURORA</h2>
          <p class="section-desc">
            Diseñamos experiencias pedagógicas orientadas a la realidad del software moderno.
            Sin diapositivas interminables: arquitectura, código y toma de decisiones en vivo.
          </p>
        </div>

        <!-- 4 Pillars Grid -->
        <div class="pillars-grid">
          <div class="pillar-card" *ngFor="let pillar of pillars">
            <div class="pillar-icon-box" [style.background]="pillar.gradient">
              <span>{{ pillar.icon }}</span>
            </div>
            <h3 class="pillar-title">{{ pillar.title }}</h3>
            <p class="pillar-desc">{{ pillar.description }}</p>
            <div class="pillar-highlight">
              <span class="sparkle">✦</span>
              <span>{{ pillar.highlight }}</span>
            </div>
          </div>
        </div>

        <!-- Quote Banner -->
        <div class="quote-card" id="mentores">
          <div class="quote-content">
            <p class="quote-text">
              "En la era de la inteligencia artificial, el verdadero valor de un ingeniero no es memorizar sintaxis, 
              sino entender sistemas distribuidos, modularidad y saber tomar decisiones arquitecturales complejas bajo presión."
            </p>
            <div class="quote-author">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80" alt="Mateo Cárdenas" class="author-img" />
              <div class="author-details">
                <span class="author-name">Mateo Cárdenas</span>
                <span class="author-title">VP of Engineering • Mentor Líder en AURORA</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .methodology-section {
      padding: 90px 24px;
      position: relative;
      background: rgba(10, 14, 26, 0.5);
    }

    .section-container {
      max-width: 1280px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      max-width: 720px;
      margin: 0 auto 56px;
    }

    .eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 2.8rem);
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

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
      margin-bottom: 60px;
    }

    .pillar-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 32px 26px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .pillar-card:hover {
      transform: translateY(-5px);
      border-color: rgba(99, 102, 241, 0.4);
      box-shadow: 0 15px 35px -10px rgba(99, 102, 241, 0.25);
    }

    .pillar-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    .pillar-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      font-family: 'Outfit', sans-serif;
    }

    .pillar-desc {
      font-size: 0.9rem;
      color: #94a3b8;
      line-height: 1.55;
      margin: 0;
      flex-grow: 1;
    }

    .pillar-highlight {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: #38bdf8;
      font-weight: 600;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 14px;
    }

    .sparkle {
      color: #818cf8;
    }

    .quote-card {
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 24px;
      padding: 44px 48px;
      box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.6);
      position: relative;
    }

    @media (max-width: 640px) {
      .quote-card {
        padding: 30px 24px;
      }
    }

    .quote-content {
      max-width: 860px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .quote-text {
      font-size: clamp(1.1rem, 2.2vw, 1.35rem);
      color: #f1f5f9;
      font-style: italic;
      line-height: 1.6;
      margin: 0;
    }

    .quote-author {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .author-img {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #6366f1;
    }

    .author-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .author-name {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
    }

    .author-title {
      font-size: 0.82rem;
      color: #94a3b8;
    }
  `],
})
export class MethodologyComponent {
  readonly pillars = [
    {
      icon: '⚡',
      title: 'Código Real de Producción',
      description: 'Construye proyectos basados en arquitecturas reales que resuelven problemas de concurrencia, escalabilidad y latencia.',
      highlight: 'Repositorios completos con CI/CD incluidos',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    },
    {
      icon: '🎯',
      title: 'Feedback Quirúrgico 1-a-1',
      description: 'Sesiones personalizadas de code-review y asesoría para destrabar los desafíos técnicos que enfrentas en tu empresa.',
      highlight: 'Revisiones privadas de arquitectura',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    },
    {
      icon: '👥',
      title: 'Cohortes Reducidas (Máx 25)',
      description: 'Rechazamos las aulas masivas. Cada taller tiene cupos limitados para asegurar una interacción constante y debates profundos.',
      highlight: 'Acceso directo a los instructores',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    },
    {
      icon: '🌐',
      title: 'Red Exclusiva de Alumnos',
      description: 'Ingresa al Discord privado de egresados de AURORA con ofertas de empleo confidenciales, hackathons y mentorías mensuales.',
      highlight: '+25,000 profesionales conectados',
      gradient: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
    },
  ];
}
