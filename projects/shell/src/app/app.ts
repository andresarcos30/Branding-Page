import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrossMfeBusService, BookingConfirmation } from 'shared-kernel';
import { NavbarComponent } from './components/navbar.component';
import { HeroComponent } from './components/hero.component';
import { PartnersComponent } from './components/partners.component';
import { FederatedEventsHostComponent } from './components/federated-events-host.component';
import { MethodologyComponent } from './components/methodology.component';
import { TestimonialsComponent } from './components/testimonials.component';
import { FaqComponent } from './components/faq.component';
import { FooterComponent } from './components/footer.component';
import { FederatedBookingHostComponent } from './components/federated-booking-host.component';
import { TicketWalletComponent } from './components/ticket-wallet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    PartnersComponent,
    FederatedEventsHostComponent,
    MethodologyComponent,
    TestimonialsComponent,
    FaqComponent,
    FooterComponent,
    FederatedBookingHostComponent,
    TicketWalletComponent,
  ],
  template: `
    <div class="shell-app-layout">
      <!-- Global Navigation -->
      <shell-navbar></shell-navbar>

      <!-- Hero Section -->
      <shell-hero></shell-hero>

      <!-- Partners Social Proof Bar -->
      <shell-partners></shell-partners>

      <!-- Micro Frontend 1: Events & Workshops Explorer -->
      <shell-federated-events-host></shell-federated-events-host>

      <!-- Methodology & Brand Value Pillars -->
      <shell-methodology></shell-methodology>

      <!-- Testimonials & Alumni Proof -->
      <shell-testimonials></shell-testimonials>

      <!-- FAQ Section -->
      <shell-faq></shell-faq>

      <!-- Global Footer -->
      <shell-footer></shell-footer>

      <!-- Micro Frontend 2: Federated Booking Modal -->
      <shell-federated-booking-host></shell-federated-booking-host>

      <!-- Ticket Wallet Vault Modal -->
      <shell-ticket-wallet></shell-ticket-wallet>

      <!-- Confirmation Toast Floating Notification -->
      <div class="toast-notification" *ngIf="activeToast() as toast">
        <div class="toast-icon">🎟️</div>
        <div class="toast-content">
          <span class="toast-title">¡Reserva Confirmada!</span>
          <span class="toast-desc">{{ toast.attendeeName }} reservó "{{ toast.event.title }}" (Código: {{ toast.bookingId }})</span>
        </div>
        <button type="button" class="btn-toast-close" (click)="activeToast.set(null)">✕</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      color: #f8fafc;
      background-color: #070a12;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
    }

    .shell-app-layout {
      position: relative;
      overflow-x: hidden;
      background: radial-gradient(circle at 50% 0%, #11182d 0%, #070a12 50%);
    }

    /* Floating Toast Notification */
    .toast-notification {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 3000;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(52, 211, 153, 0.4);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(52, 211, 153, 0.2);
      backdrop-filter: blur(16px);
      padding: 16px 20px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      max-width: 420px;
      animation: slideInToast 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideInToast {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .toast-icon {
      font-size: 1.8rem;
    }

    .toast-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-grow: 1;
    }

    .toast-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #34d399;
      font-family: 'Outfit', sans-serif;
    }

    .toast-desc {
      font-size: 0.8rem;
      color: #cbd5e1;
      line-height: 1.4;
    }

    .btn-toast-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 4px;
    }
  `],
})
export class App {
  private readonly busService = inject(CrossMfeBusService);
  readonly activeToast = signal<BookingConfirmation | null>(null);

  constructor() {
    effect(() => {
      const confirmation = this.busService.latestConfirmation();
      if (confirmation) {
        this.activeToast.set(confirmation);
        setTimeout(() => {
          this.activeToast.set(null);
        }, 7000);
      }
    });
  }
}
