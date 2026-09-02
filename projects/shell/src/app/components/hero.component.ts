import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shell-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-section">
      <!-- Ambient Glow Orbs -->
      <div class="ambient-glow glow-indigo"></div>
      <div class="ambient-glow glow-cyan"></div>
      <div class="ambient-glow glow-magenta"></div>

      <div class="hero-content">
        <!-- Eyebrow Tag -->
        <div class="hero-eyebrow">
          <span class="sparkle-icon">✦</span>
          <span>CURSOS • CONCIERTOS • OCIO & MEETUPS • TALLERES 2026</span>
          <span class="sparkle-icon">✦</span>
        </div>

        <!-- Master Title -->
        <h1 class="hero-title">
          Aprende, conecta y vive <br />
          <span class="gradient-text">las experiencias 2026</span> <br />
          más vibrantes del mundo tech.
        </h1>

        <!-- Subtitle -->
        <p class="hero-subtitle">
          El ecosistema donde convergen la educación de vanguardia y el entretenimiento cultural: 
          cursos intensivos con mentores top, festivales de música en vivo, noches de networking con jazz 
          y hackathons de 48 horas pensados para transformar tu visión.
        </p>

        <!-- Fast Navigation Category Tags -->
        <div class="hero-category-pills">
          <a href="#talleres" class="hero-cat-tag tag-course">
            <span>🎓 Cursos Estructurados</span>
          </a>
          <a href="#talleres" class="hero-cat-tag tag-concert">
            <span>🎵 Conciertos & Festivales</span>
          </a>
          <a href="#talleres" class="hero-cat-tag tag-leisure">
            <span>🎉 Ocio, Hackathons & Meetups</span>
          </a>
          <a href="#talleres" class="hero-cat-tag tag-workshop">
            <span>⚡ Masterclasses de Élite</span>
          </a>
        </div>

        <!-- CTA Buttons Row -->
        <div class="hero-cta-group">
          <a href="#talleres" class="btn-hero-primary">
            <span>Explorar Toda la Agenda 2026</span>
            <span class="arrow">↓</span>
          </a>
          <a href="#metodologia" class="btn-hero-secondary">
            <span>Conoce el Método & Cultura AURORA</span>
          </a>
        </div>

        <!-- Social Proof Stats Banner -->
        <div class="stats-banner">
          <div class="stat-item">
            <span class="stat-number">+50,000</span>
            <span class="stat-label">Asistentes & Profesionales</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">99.2%</span>
            <span class="stat-label">Índice de Satisfacción</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">15+ Artistas</span>
            <span class="stat-label">& Mentores Internacionales</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">4 Formatos</span>
            <span class="stat-label">Cursos, Música, Ocio y Labs</span>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      padding: 150px 24px 75px;
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
      left: 15%;
    }

    .glow-cyan {
      background: #06b6d4;
      top: 15%;
      right: 15%;
      animation-delay: -5s;
    }

    .glow-magenta {
      background: #ec4899;
      top: 35%;
      left: 45%;
      opacity: 0.2;
      animation-delay: -3s;
    }

    @keyframes floatGlow {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(40px, 30px) scale(1.15); }
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 980px;
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
      padding: 6px 20px;
      border-radius: 9999px;
      color: #a5b4fc;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      margin-bottom: 24px;
      backdrop-filter: blur(8px);
    }

    .sparkle-icon {
      color: #818cf8;
    }

    .hero-title {
      font-size: clamp(2.4rem, 5.5vw, 4.2rem);
      font-weight: 900;
      color: #ffffff;
      line-height: 1.14;
      letter-spacing: -0.03em;
      margin: 0 0 24px;
      font-family: 'Outfit', sans-serif;
    }

    .gradient-text {
      background: linear-gradient(135deg, #38bdf8 0%, #a855f7 45%, #f43f5e 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.22rem);
      color: #94a3b8;
      line-height: 1.68;
      max-width: 820px;
      margin: 0 0 28px;
    }

    /* Category pills row in hero */
    .hero-category-pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-bottom: 34px;
    }

    .hero-cat-tag {
      display: inline-flex;
      align-items: center;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 0.84rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s ease;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
    }

    .hero-cat-tag:hover {
      transform: translateY(-2px);
    }

    .tag-course:hover {
      border-color: #a855f7;
      color: #e9d5ff;
      background: rgba(168, 85, 247, 0.15);
    }

    .tag-concert:hover {
      border-color: #f43f5e;
      color: #fecdd3;
      background: rgba(244, 63, 94, 0.15);
    }

    .tag-leisure:hover {
      border-color: #f59e0b;
      color: #fef3c7;
      background: rgba(245, 158, 11, 0.15);
    }

    .tag-workshop:hover {
      border-color: #06b6d4;
      color: #cffafe;
      background: rgba(6, 182, 212, 0.15);
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
      max-width: 940px;
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
