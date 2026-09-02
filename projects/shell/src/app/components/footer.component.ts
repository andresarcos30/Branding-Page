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
            <span class="news-badge">AURORA RADAR 2026</span>
            <h3 class="news-title">Preventas exclusivas para cursos, festivales & meetups</h3>
            <p class="news-desc">Te avisamos antes de las salidas al público general para asegurar tus entradas y cupos con descuento early-bird.</p>
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
              El ecosistema definitivo de experiencias 2026: educación tecnológica de alto impacto, 
              festivales de música en vivo, hackathons y ocio cultural para la comunidad más ambiciosa de Latinoamérica.
            </p>
            <div class="social-links">
              <a href="#" class="social-icon" aria-label="X">𝕏</a>
              <a href="#" class="social-icon" aria-label="LinkedIn">in</a>
              <a href="#" class="social-icon" aria-label="GitHub">gh</a>
              <a href="#" class="social-icon" aria-label="YouTube">yt</a>
            </div>
          </div>

          <div class="col-links">
            <h4 class="col-title">🎓 Cursos 2026</h4>
            <a href="#talleres">Full Stack con IA</a>
            <a href="#talleres">Data Science & ML</a>
            <a href="#talleres">Product Management</a>
            <a href="#talleres">Programas Certificados</a>
          </div>

          <div class="col-links">
            <h4 class="col-title">🎵 Conciertos</h4>
            <a href="#talleres">AURORA Music Fest</a>
            <a href="#talleres">Noche Quantum</a>
            <a href="#talleres">Jazz & Innovation</a>
            <a href="#talleres">Lineup 2026</a>
          </div>

          <div class="col-links">
            <h4 class="col-title">🎉 Ocio & Meetups</h4>
            <a href="#talleres">Hackathon 48h ($50K)</a>
            <a href="#talleres">Feria Tech Ágora</a>
            <a href="#talleres">Angular Colombia</a>
            <a href="#talleres">Networking Drinks</a>
          </div>

          <div class="col-links">
            <h4 class="col-title">Legal & Soporte</h4>
            <a href="#">Términos de Servicio</a>
            <a href="#">Política de Privacidad</a>
            <a href="#">Garantía 7 Días</a>
            <a href="#">contacto&#64;aurorasummit.io</a>
          </div>
        </div>

        <!-- Copyright & Micro Frontend badge -->
        <div class="footer-bottom">
          <span>© 2026 AURORA Ecosystem. Cursos, Conciertos, Ocio & Talleres. Todos los derechos reservados.</span>
          <div class="arch-badge">
            <span class="arch-dot"></span>
            <span>Arquitectura Micro Frontends • Native Federation • Angular 22</span>
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
      max-width: 1320px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 50px;
    }

    .newsletter-card {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.08) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 36px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 30px;
      flex-wrap: wrap;
    }

    .newsletter-left {
      max-width: 550px;
    }

    .news-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.25);
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 10px;
    }

    .news-title {
      font-size: 1.45rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 8px;
      font-family: 'Outfit', sans-serif;
    }

    .news-desc {
      color: #94a3b8;
      font-size: 0.92rem;
      margin: 0;
      line-height: 1.5;
    }

    .newsletter-form {
      display: flex;
      gap: 10px;
      flex-grow: 1;
      max-width: 440px;
    }

    @media (max-width: 600px) {
      .newsletter-form {
        flex-direction: column;
        width: 100%;
      }
    }

    .news-input {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 0.9rem;
      flex-grow: 1;
      outline: none;
    }

    .news-input:focus {
      border-color: #6366f1;
    }

    .btn-news-submit {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .btn-news-submit:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .footer-links-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      gap: 36px;
    }

    @media (max-width: 990px) {
      .footer-links-grid {
        grid-template-columns: 1fr 1fr;
      }
      .col-brand {
        grid-column: span 2;
      }
    }

    @media (max-width: 600px) {
      .footer-links-grid {
        grid-template-columns: 1fr;
      }
      .col-brand {
        grid-column: span 1;
      }
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .logo-spark {
      color: #818cf8;
      font-size: 1.5rem;
    }

    .logo-name {
      font-size: 1.5rem;
      font-weight: 900;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      letter-spacing: 0.05em;
    }

    .brand-desc {
      color: #94a3b8;
      font-size: 0.88rem;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .social-links {
      display: flex;
      gap: 10px;
    }

    .social-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 700;
      transition: all 0.2s ease;
    }

    .social-icon:hover {
      background: rgba(99, 102, 241, 0.25);
      border-color: #6366f1;
      color: #ffffff;
      transform: translateY(-2px);
    }

    .col-title {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 700;
      margin: 0 0 16px;
      font-family: 'Outfit', sans-serif;
    }

    .col-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .col-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.2s ease;
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
      color: #64748b;
      font-size: 0.82rem;
    }

    .arch-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .arch-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 6px #34d399;
    }
  `],
})
export class FooterComponent {
  subscriberEmail = '';
  readonly isSubscribed = signal(false);

  subscribe(): void {
    if (this.subscriberEmail && this.subscriberEmail.includes('@')) {
      this.isSubscribed.set(true);
      setTimeout(() => {
        this.subscriberEmail = '';
      }, 3000);
    }
  }
}
