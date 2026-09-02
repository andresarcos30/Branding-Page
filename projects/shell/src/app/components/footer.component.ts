import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'shell-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <footer class="footer-wrapper">
      <div class="footer-container">
        <!-- Top Newsletter Row -->
        <div class="newsletter-card">
          <div class="newsletter-left">
            <span class="news-badge">AURORA RADAR TECH</span>
            <h3 class="news-title">Recibe convocatorias prioritarias & masterclasses exclusivas</h3>
            <p class="news-desc">Te avisamos antes del lanzamiento público para que nunca te quedes sin cupo.</p>
          </div>
          <div class="newsletter-form">
            <input
              type="email"
              placeholder="tu.correo@empresa.com"
              [(ngModel)]="subscriberEmail"
              class="news-input"
            />
            <button type="button" class="btn-news-submit" (click)="subscribe()">
              {{ isSubscribed() ? '✓ ¡Suscrito!' : 'Suscribirme' }}
            </button>
          </div>
        </div>

        <!-- Footer Main Links Grid -->
        <div class="footer-links-grid">
          <div class="col-brand">
            <div class="footer-brand">
              <span class="logo-spark">✦</span>
              <span class="logo-name">AURORA</span>
            </div>
            <p class="brand-desc">
              Plataforma de formación técnica y summits de alto nivel para ingenieros, arquitectos y diseñadores de producto de habla hispana.
            </p>
            <div class="social-links">
              <a href="#" class="social-icon">𝕏</a>
              <a href="#" class="social-icon">in</a>
              <a href="#" class="social-icon">gh</a>
              <a href="#" class="social-icon">yt</a>
            </div>
          </div>

          <div class="col-links">
            <h4 class="col-title">Talleres 2026</h4>
            <a href="#talleres">IA Generativa & Agentes</a>
            <a href="#talleres">Micro Frontends a Escala</a>
            <a href="#talleres">Design Systems & UI Ops</a>
            <a href="#talleres">Cloud FinOps & Kubernetes</a>
            <a href="#talleres">Executive Tech Leadership</a>
          </div>

          <div class="col-links">
            <h4 class="col-title">Plataforma</h4>
            <a href="#metodologia">El Método AURORA</a>
            <a href="#mentores">Conoce a los Mentores</a>
            <a href="#testimonios">Casos de Graduados</a>
            <a href="#faq">Preguntas Frecuentes</a>
            <a href="#">Pases Squad para Empresas</a>
          </div>

          <div class="col-links">
            <h4 class="col-title">Legal & Soporte</h4>
            <a href="#">Términos de Servicio</a>
            <a href="#">Política de Privacidad</a>
            <a href="#">Garantía de Satisfacción 7 Días</a>
            <a href="#">contacto&#64;aurorasummit.io</a>
          </div>
        </div>

        <!-- Copyright & Micro Frontend badge -->
        <div class="footer-bottom">
          <span>© 2026 AURORA Summit & Workshops Hub. Todos los derechos reservados.</span>
          <div class="arch-badge">
            <span class="arch-dot"></span>
            <span>Micro Frontends Architecture: Shell + MFE Events + MFE Booking (Angular 22)</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-wrapper {
      background: #04070e;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 70px 24px 30px;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 50px;
    }

    .newsletter-card {
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 20px;
      padding: 36px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      flex-wrap: wrap;
    }

    .news-badge {
      font-size: 0.72rem;
      font-weight: 800;
      color: #818cf8;
      letter-spacing: 0.1em;
      display: block;
      margin-bottom: 6px;
    }

    .news-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px;
      font-family: 'Outfit', sans-serif;
    }

    .news-desc {
      font-size: 0.88rem;
      color: #94a3b8;
      margin: 0;
    }

    .newsletter-form {
      display: flex;
      gap: 10px;
      flex-grow: 1;
      max-width: 440px;
    }

    .news-input {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 12px 16px;
      color: #ffffff;
      font-size: 0.9rem;
      outline: none;
      flex-grow: 1;
    }

    .btn-news-submit {
      background: #6366f1;
      color: #ffffff;
      border: none;
      padding: 12px 22px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .btn-news-submit:hover {
      background: #4f46e5;
    }

    .footer-links-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      gap: 40px;
    }

    @media (max-width: 860px) {
      .footer-links-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 500px) {
      .footer-links-grid {
        grid-template-columns: 1fr;
      }
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 1.35rem;
      color: #ffffff;
      margin-bottom: 12px;
    }

    .logo-spark {
      color: #6366f1;
    }

    .brand-desc {
      font-size: 0.86rem;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 18px;
    }

    .social-links {
      display: flex;
      gap: 10px;
    }

    .social-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 700;
      transition: all 0.2s ease;
    }

    .social-icon:hover {
      color: #ffffff;
      background: rgba(99, 102, 241, 0.2);
      border-color: #6366f1;
    }

    .col-title {
      font-size: 0.82rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #ffffff;
      margin: 0 0 16px;
    }

    .col-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .col-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.86rem;
      transition: color 0.2s;
    }

    .col-links a:hover {
      color: #38bdf8;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 0.78rem;
      color: #64748b;
    }

    .arch-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 4px 12px;
      border-radius: 9999px;
      color: #34d399;
      font-size: 0.72rem;
      font-weight: 600;
    }

    .arch-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
  `],
})
export class FooterComponent {
  subscriberEmail = '';
  readonly isSubscribed = signal<boolean>(false);

  subscribe(): void {
    if (this.subscriberEmail.includes('@')) {
      this.isSubscribed.set(true);
      setTimeout(() => {
        this.subscriberEmail = '';
        this.isSubscribed.set(false);
      }, 4000);
    }
  }
}
