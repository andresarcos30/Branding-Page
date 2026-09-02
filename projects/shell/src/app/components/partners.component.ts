import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shell-partners',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="partners-section">
      <div class="partners-container">
        <span class="partners-title">INGENIEROS Y LÍDERES DE NUESTROS TALLERES COLABORAN EN:</span>
        <div class="logos-row">
          <div class="partner-pill" *ngFor="let partner of partners">
            <span class="partner-icon">{{ partner.icon }}</span>
            <span class="partner-name">{{ partner.name }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .partners-section {
      padding: 40px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(8, 11, 20, 0.6);
    }

    .partners-container {
      max-width: 1280px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .partners-title {
      font-size: 0.72rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.14em;
    }

    .logos-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 16px;
    }

    .partner-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      padding: 8px 18px;
      border-radius: 9999px;
      color: #94a3b8;
      font-size: 0.88rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .partner-pill:hover {
      border-color: rgba(99, 102, 241, 0.4);
      color: #ffffff;
      background: rgba(99, 102, 241, 0.08);
      transform: translateY(-2px);
    }

    .partner-icon {
      font-size: 1rem;
    }
  `],
})
export class PartnersComponent {
  readonly partners = [
    { name: 'Mercado Libre', icon: '🟡' },
    { name: 'Nubank', icon: '🟣' },
    { name: 'Stripe Ecosystem', icon: '🔵' },
    { name: 'Rappi Tech Labs', icon: '🟠' },
    { name: 'AWS Cloud Innovators', icon: '🟠' },
    { name: 'Globant Enterprise', icon: '🟢' },
    { name: 'Y Combinator Alumni', icon: '🟧' },
  ];
}
