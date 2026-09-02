import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossMfeBusService } from 'shared-kernel';

@Component({
  selector: 'shell-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar-wrapper" [class.scrolled]="isScrolled()">
      <div class="navbar-container">
        <!-- Logo Brand -->
        <a href="#" class="navbar-brand">
          <div class="logo-mark">
            <span class="sparkle">✦</span>
          </div>
          <div class="logo-text">
            <span class="brand-name">AURORA</span>
            <span class="brand-tag">SUMMIT & WORKSHOPS</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links">
          <a href="#talleres" class="nav-link">Talleres 2026</a>
          <a href="#metodologia" class="nav-link">Metodología</a>
          <a href="#mentores" class="nav-link">Mentores</a>
          <a href="#testimonios" class="nav-link">Testimonios</a>
          <a href="#faq" class="nav-link">Preguntas</a>
        </nav>

        <!-- Right CTA Actions -->
        <div class="nav-actions">
          <div class="urgency-pill">
            <span class="live-dot"></span>
            <span>Cupos Limitados 2026</span>
          </div>
          <a href="#talleres" class="btn-nav-cta">
            <span>Explorar Talleres</span>
            <span class="cta-arrow">→</span>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      padding: 18px 24px;
    }

    .navbar-wrapper.scrolled {
      padding: 10px 24px;
      background: rgba(7, 10, 18, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .logo-mark {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
    }

    .sparkle {
      color: #ffffff;
      font-size: 1.25rem;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: 'Outfit', sans-serif;
      font-weight: 900;
      font-size: 1.25rem;
      letter-spacing: 0.06em;
      color: #ffffff;
      line-height: 1;
    }

    .brand-tag {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #818cf8;
      margin-top: 3px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
    }

    @media (max-width: 860px) {
      .nav-links {
        display: none;
      }
    }

    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-link:hover {
      color: #ffffff;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .urgency-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #fca5a5;
    }

    @media (max-width: 600px) {
      .urgency-pill {
        display: none;
      }
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ef4444;
      box-shadow: 0 0 10px #ef4444;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }

    .btn-nav-cta {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 9999px;
      text-decoration: none;
      font-size: 0.86rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
      transition: all 0.25s ease;
    }

    .btn-nav-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 22px rgba(99, 102, 241, 0.55);
    }

    .cta-arrow {
      transition: transform 0.2s ease;
    }

    .btn-nav-cta:hover .cta-arrow {
      transform: translateX(3px);
    }
  `],
})
export class NavbarComponent {
  readonly isScrolled = signal<boolean>(false);

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 20);
    }
  }
}
