import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shell-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="faq-section" id="faq">
      <div class="faq-container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="eyebrow">DUDAS FRECUENTES</span>
          <h2 class="section-title">Preguntas Frecuentes</h2>
          <p class="section-desc">
            Todo lo que necesitas saber sobre las inscripciones, certificados y dinámica de los talleres.
          </p>
        </div>

        <!-- Accordion List -->
        <div class="accordion-list">
          <div
            class="accordion-item"
            *ngFor="let item of faqs; let i = index"
            [class.open]="openIndex() === i"
          >
            <button type="button" class="accordion-trigger" (click)="toggleFaq(i)">
              <span class="faq-q">{{ item.q }}</span>
              <span class="chevron">{{ openIndex() === i ? '−' : '+' }}</span>
            </button>
            <div class="accordion-content" *ngIf="openIndex() === i">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .faq-section {
      padding: 90px 24px;
      position: relative;
      background: rgba(10, 14, 26, 0.5);
    }

    .faq-container {
      max-width: 860px;
      margin: 0 auto;
    }

    .section-header {
      text-align: center;
      margin-bottom: 50px;
    }

    .eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      color: #06b6d4;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      display: block;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 2.7rem);
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

    .accordion-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .accordion-item {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      overflow: hidden;
      transition: all 0.25s ease;
    }

    .accordion-item.open {
      border-color: rgba(99, 102, 241, 0.4);
      background: rgba(15, 23, 42, 0.85);
    }

    .accordion-trigger {
      width: 100%;
      text-align: left;
      background: transparent;
      border: none;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      color: #ffffff;
      font-size: 1.05rem;
      font-weight: 600;
      gap: 16px;
    }

    .chevron {
      font-size: 1.4rem;
      color: #818cf8;
      font-weight: 700;
      line-height: 1;
    }

    .accordion-content {
      padding: 0 24px 22px;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .accordion-content p {
      margin: 0;
      color: #94a3b8;
      line-height: 1.65;
      font-size: 0.95rem;
    }
  `],
})
export class FaqComponent {
  readonly openIndex = signal<number | null>(0);

  readonly faqs = [
    {
      q: '¿Qué sucede si no puedo asistir en vivo a alguna de las sesiones?',
      a: 'Todas las sesiones son grabadas en resolución 4K y subidas a la plataforma privada en menos de 2 horas. Tendrás acceso de por vida a los videos, repositorios de código y podrás dejar preguntas en el foro para que el instructor te responda directamente.',
    },
    {
      q: '¿Cómo funciona la emisión de facturas para empresas?',
      a: 'Si tu empresa financiará tu participación o compras el pase Squad Enterprise, al completar el agendamiento puedes ingresar el NIT / CIF y razón social para recibir la factura legal electrónica deducible de impuestos.',
    },
    {
      q: '¿Se entrega un certificado oficial verificable?',
      a: 'Sí. Todos los egresados reciben un certificado digital emitido por AURORA Summit Hub con identificador criptográfico único, el cual puedes enlazar directamente a tu perfil de LinkedIn y CV.',
    },
    {
      q: '¿Existe política de reembolso o garantía?',
      a: 'Ofrecemos una garantía de satisfacción total de 7 días. Si después de la primera sesión consideras que el taller no cumple tus expectativas, te reembolsamos el 100% de tu inversión sin preguntas.',
    },
  ];

  toggleFaq(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}
