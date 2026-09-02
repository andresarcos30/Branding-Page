import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossMfeBusService } from 'shared-kernel';

@Component({
  selector: 'shell-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <!-- Ambient Glow Orbs -->
      <div class="ambient-glow glow-indigo"></div>
      <div class="ambient-glow glow-cyan"></div>

      <div class="hero-content">
        <!-- Eyebrow Tag -->
        <div class="hero-eyebrow">
          <span class="sparkle-icon">✦</span>
          <span>CONVOCATORIAS ABIERTAS • TEMPORADA 2026</span>
          <span class="sparkle-icon">✦</span>
        </div>

        <!-- Master Title -->
        <h1 class="hero-title">
          Aprende de los mejores <br />
          <span class="gradient-text">arquitectos & líderes</span> <br />
          tecnológicos del mundo.
        </h1>

        <!-- Subtitle -->
        <p class="hero-subtitle">
          Talleres intensivos, prácticos y en cohortes reducidas. Domina IA Generativa con Agentes, 
          Micro Frontends a escala, FinOps Cloud y Liderazgo de Ingeniería guiado por quienes 
          construyen los sistemas más avanzados de la industria.
        </p>

        <!-- CTA Buttons Row -->
        <div class="hero-cta-group">
          <a href="#talleres" class="btn-hero-primary">
            <span>Explorar Talleres Disponibles</span>
            <span class="arrow">↓</span>
          </a>
          <a href="#metodologia" class="btn-hero-secondary">
            <span>Conoce el Método AURORA</span>
          </a>
        </div>

        <!-- Social Proof Stats Banner -->
        <div class="stats-banner">
          <div class="stat-item">
            <span class="stat-number">+25,000</span>
            <span class="stat-label">Profesionales Certificados</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">98.7%</span>
            <span class="stat-label">Calificación de Satisfacción</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">+80</span>
            <span class="stat-label">Mentores Staff & VP Globales</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">100%</span>
            <span class="stat-label">Casos Prácticos de Producción</span>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      padding: 150px 24px 70px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      text-align: center;
    }

    .ambient-glow {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      filter: blur(140px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.28;
      animation: floatGlow 10s infinite alternate ease-in-out;
    }

    .glow-indigo {
      background: #6366f1;
      top: 5%;
      left: 20%;
    }

    .glow-cyan {
      background: #06b6d4;
      top: 15%;
      right: 20%;
      animation-delay: -5s;
    }

    @keyframes floatGlow {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(40px, 30px) scale(1.15); }
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 940px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.35);
      padding: 6px 18px;
      border-radius: 9999px;
      color: #a5b4fc;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      margin-bottom: 24px;
      backdrop-filter: blur(8px);
    }

    .sparkle-icon {
      color: #6366f1;
    }

    .hero-title {
      font-size: clamp(2.4rem, 5.5vw, 4.2rem);
      font-weight: 900;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin: 0 0 24px;
      font-family: 'Outfit', sans-serif;
    }

    .gradient-text {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #f43f5e 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.22rem);
      color: #94a3b8;
      line-height: 1.65;
      max-width: 780px;
      margin: 0 0 36px;
    }

    .hero-cta-group {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 56px;
    }

    .btn-hero-primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      color: #ffffff;
      font-weight: 700;
      font-size: 1rem;
      padding: 16px 32px;
      border-radius: 9999px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.45);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-hero-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(99, 102, 241, 0.6);
      filter: brightness(1.08);
    }

    .arrow {
      transition: transform 0.25s ease;
    }

    .btn-hero-primary:hover .arrow {
      transform: translateY(3px);
    }

    .btn-hero-secondary {
      background: rgba(255, 255, 255, 0.04);
      color: #ffffff;
      font-weight: 600;
      font-size: 1rem;
      padding: 16px 28px;
      border-radius: 9999px;
      text-decoration: none;
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(10px);
      transition: all 0.25s ease;
    }

    .btn-hero-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
    }

    .stats-banner {
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 24px 36px;
      width: 100%;
      max-width: 900px;
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
    }

    @media (max-width: 768px) {
      .stats-banner {
        flex-direction: column;
        gap: 20px;
      }
      .stat-divider {
        display: none;
      }
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .stat-number {
      font-size: 1.85rem;
      font-weight: 900;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      letter-spacing: -0.02em;
    }

    .stat-label {
      font-size: 0.78rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .stat-divider {
      width: 1px;
      height: 38px;
      background: rgba(255, 255, 255, 0.08);
    }
  `],
})
export class HeroComponent {}
