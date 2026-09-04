import { Component, signal, HostListener, inject, computed } from '@angular/core';
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
            <span class="brand-tag">EXPERIENCIAS & ACADEMIA 2026</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links">
          <a href="#talleres" class="nav-link nav-highlight">Agenda 2026</a>
          <a href="#talleres" class="nav-link">🎓 Cursos</a>
          <a href="#talleres" class="nav-link">🎵 Conciertos</a>
          <a href="#talleres" class="nav-link">🎉 Ocio</a>
          <a href="#metodologia" class="nav-link">Metodología</a>
          <a href="#faq" class="nav-link">Preguntas</a>
        </nav>

        <!-- Right CTA Actions -->
        <div class="nav-actions">
          <!-- Aurora AI Concierge Trigger Button -->
          <button
            type="button"
            class="btn-ai-nav"
            (click)="openConcierge()"
            title="Hablar con Aurora Concierge AI"
          >
            <span class="ai-nav-sparkle">✦</span>
            <span class="ai-nav-txt">Aurora AI</span>
            <span class="ai-nav-badge">2026</span>
          </button>

          <!-- Ticket Wallet Trigger Button -->
          <button
            type="button"
            class="btn-wallet-nav"
            (click)="openWallet()"
            title="Ver mis entradas guardadas"
          >
            <span class="wallet-icon">🎟️</span>
            <span class="wallet-txt">Mis Entradas</span>
            <span class="wallet-badge-count" *ngIf="ticketCount() > 0">
              {{ ticketCount() }}
            </span>
          </button>

          <div class="urgency-pill">
            <span class="live-dot"></span>
            <span>Edición 2026</span>
          </div>
          <a href="#talleres" class="btn-nav-cta">
            <span>Ver Agenda</span>
            <span class="cta-arrow">→</span>
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-wrapper {
      position: sticky;
      top: 48px;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      padding: 14px 24px;
      background: rgba(7, 10, 18, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .navbar-wrapper.scrolled {
      padding: 10px 24px;
      background: rgba(7, 10, 18, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }

    .navbar-container {
      max-width: 1320px;
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
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #f43f5e 100%);
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
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      color: #818cf8;
      margin-top: 3px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    @media (max-width: 960px) {
      .nav-links {
        display: none;
      }
    }

    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-link:hover {
      color: #ffffff;
    }

    .nav-highlight {
      color: #c7d2fe;
      font-weight: 600;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .btn-ai-nav {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.18) 100%);
      border: 1px solid rgba(168, 85, 247, 0.45);
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 9999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-size: 0.84rem;
      font-weight: 700;
      transition: all 0.25s ease;
      box-shadow: 0 0 16px rgba(124, 58, 237, 0.2);
    }

    .btn-ai-nav:hover {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.35) 100%);
      border-color: #c084fc;
      transform: translateY(-1px);
      box-shadow: 0 0 22px rgba(168, 85, 247, 0.45);
    }

    .ai-nav-sparkle {
      color: #c084fc;
      font-size: 0.95rem;
    }

    .ai-nav-badge {
      background: rgba(168, 85, 247, 0.3);
      color: #e9d5ff;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 9999px;
    }

    .btn-wallet-nav {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: #cbd5e1;
      padding: 8px 16px;
      border-radius: 9999px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.84rem;
      font-weight: 600;
      transition: all 0.2s ease;
      position: relative;
    }

    .btn-wallet-nav:hover {
      background: rgba(99, 102, 241, 0.18);
      border-color: #6366f1;
      color: #ffffff;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
    }

    .wallet-icon {
      font-size: 1rem;
    }

    .wallet-badge-count {
      background: #6366f1;
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 1px 7px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .urgency-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #c7d2fe;
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
      background: #34d399;
      box-shadow: 0 0 10px #34d399;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }

    .btn-nav-cta {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
      color: #ffffff;
      padding: 10px 22px;
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
  private readonly busService = inject(CrossMfeBusService);
  readonly isScrolled = signal<boolean>(false);
  readonly ticketCount = computed(() => this.busService.storedBookings().length);

  openWallet(): void {
    if (this.busService && typeof (this.busService as any).openWallet === 'function') {
      try {
        this.busService.openWallet();
      } catch (e) {
        console.warn('busService.openWallet error', e);
      }
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:open-wallet'));
    }
  }

  openConcierge(): void {
    if (this.busService && typeof (this.busService as any).openConcierge === 'function') {
      try {
        this.busService.openConcierge();
      } catch (e) {
        console.warn('busService.openConcierge error', e);
      }
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:open-concierge'));
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 20);
    }
  }
}
