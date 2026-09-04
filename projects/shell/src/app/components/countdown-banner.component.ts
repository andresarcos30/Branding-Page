import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shell-countdown-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="countdown-top-banner">
      <div class="banner-container">
        <!-- Live Tag & Sparkle -->
        <div class="badge-live-wrapper">
          <span class="pulse-beacon"></span>
          <span class="badge-text">PRÓXIMO EVENTO EN VIVO</span>
        </div>

        <!-- Event Hook Text -->
        <div class="event-headline">
          <span class="event-title">Arquitectura Micro Frontends & AI Agents Summit 2026</span>
          <span class="event-meta">🗓️ 24 Octubre 2026 • Auditorio Virtual & Presencial</span>
        </div>

        <!-- Clock Numbers Grid -->
        <div class="countdown-clock">
          <div class="clock-unit">
            <span class="unit-number">{{ days() }}</span>
            <span class="unit-label">DÍAS</span>
          </div>
          <span class="clock-colon">:</span>
          <div class="clock-unit">
            <span class="unit-number">{{ hours() }}</span>
            <span class="unit-label">HORAS</span>
          </div>
          <span class="clock-colon">:</span>
          <div class="clock-unit">
            <span class="unit-number">{{ minutes() }}</span>
            <span class="unit-label">MIN</span>
          </div>
          <span class="clock-colon">:</span>
          <div class="clock-unit">
            <span class="unit-number seconds-glow">{{ seconds() }}</span>
            <span class="unit-label">SEG</span>
          </div>
        </div>

        <!-- Fast CTA Anchor -->
        <a href="#talleres" class="btn-banner-fast-cta">
          <span>Asegurar Plaza</span>
          <span class="arrow-spark">⚡</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .countdown-top-banner {
      background: linear-gradient(90deg, #0b0f19 0%, #1e1b4b 50%, #0b0f19 100%);
      border-bottom: 1px solid rgba(99, 102, 241, 0.35);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
      padding: 8px 16px;
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1100;
    }

    .banner-container {
      max-width: 1320px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    @media (max-width: 992px) {
      .banner-container {
        justify-content: center;
        text-align: center;
      }
    }

    .badge-live-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      padding: 4px 10px;
      border-radius: 9999px;
    }

    .pulse-beacon {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ef4444;
      box-shadow: 0 0 10px #ef4444;
      animation: beaconPulse 1.2s infinite;
    }

    @keyframes beaconPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.4; }
    }

    .badge-text {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #fca5a5;
    }

    .event-headline {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    @media (max-width: 768px) {
      .event-headline {
        flex-direction: column;
        gap: 2px;
      }
    }

    .event-title {
      font-size: 0.86rem;
      font-weight: 700;
      color: #ffffff;
    }

    .event-meta {
      font-size: 0.78rem;
      color: #a5b4fc;
      background: rgba(99, 102, 241, 0.15);
      padding: 2px 8px;
      border-radius: 6px;
    }

    .countdown-clock {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 0, 0, 0.4);
      padding: 4px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .clock-unit {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 28px;
    }

    .unit-number {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      font-weight: 900;
      color: #ffffff;
      line-height: 1;
    }

    .seconds-glow {
      color: #38bdf8;
      text-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
    }

    .unit-label {
      font-size: 0.55rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.05em;
      margin-top: 1px;
    }

    .clock-colon {
      font-size: 0.95rem;
      font-weight: 900;
      color: #818cf8;
      margin-bottom: 6px;
    }

    .btn-banner-fast-cta {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 9999px;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
      transition: all 0.2s ease;
    }

    .btn-banner-fast-cta:hover {
      transform: scale(1.04);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.6);
    }

    .arrow-spark {
      font-size: 0.85rem;
    }
  `],
})
export class CountdownBannerComponent implements OnInit, OnDestroy {
  // Target date: 24 de Octubre 2026
  private readonly targetDate = new Date('2026-10-24T09:00:00Z').getTime();
  private timerId: any = null;

  readonly days = signal<string>('00');
  readonly hours = signal<string>('00');
  readonly minutes = signal<string>('00');
  readonly seconds = signal<string>('00');

  ngOnInit(): void {
    this.updateClock();
    if (typeof window !== 'undefined') {
      this.timerId = setInterval(() => this.updateClock(), 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private updateClock(): void {
    const now = new Date().getTime();
    const diff = Math.max(0, this.targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    this.days.set(String(d).padStart(2, '0'));
    this.hours.set(String(h).padStart(2, '0'));
    this.minutes.set(String(m).padStart(2, '0'));
    this.seconds.set(String(s).padStart(2, '0'));
  }
}
