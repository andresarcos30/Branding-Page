import { Injectable, inject, signal } from '@angular/core';
import { CrossMfeBusService, WorkshopEvent } from 'shared-kernel';
import { AURORA_EVENTS_CATALOG } from '../data/aurora-events.data';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedEvents?: WorkshopEvent[];
  suggestedActions?: { label: string; action: () => void }[];
  isThinking?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuroraConciergeAiService {
  private readonly busService = inject(CrossMfeBusService);
  private readonly allEvents: WorkshopEvent[] = AURORA_EVENTS_CATALOG;

  readonly messages = signal<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: '¡Hola! Soy **Aurora Concierge AI**, tu copiloto inteligente de la temporada 2026/2027. ✦\n\nPuedo recomendarte talleres de arquitectura e IA, ayudarte a apartar cupos antes del sold-out, buscar conciertos o mostrar tus entradas guardadas. ¿En qué te gustaría enfocarte hoy?',
      timestamp: this.getCurrentTimeString(),
      suggestedActions: [
        { label: '🚀 Recomiéndame talleres de IA', action: () => this.sendMessage('¿Qué opciones tienen sobre Inteligencia Artificial y Agentes?') },
        { label: '🏛️ Micro Frontends & Arquitectura', action: () => this.sendMessage('Quiero aprender sobre Micro Frontends y Arquitectura') },
        { label: '🎵 Ver Conciertos & Ocio', action: () => this.sendMessage('¿Qué conciertos y eventos de ocio tienen disponibles?') },
        { label: '🎟️ Ver mis entradas', action: () => this.sendMessage('¿Dónde veo mis entradas guardadas?') },
      ],
    },
  ]);

  readonly isThinking = signal<boolean>(false);

  private getCurrentTimeString(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  async sendMessage(userInput: string): Promise<void> {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: this.getCurrentTimeString(),
    };

    this.messages.update((msgs) => [...msgs, userMessage]);
    this.isThinking.set(true);

    // Simulación de razonamiento agéntico y búsqueda vectorial contextual
    await new Promise((resolve) => setTimeout(resolve, 600));

    const response = this.resolveIntentAndGenerateResponse(trimmed);
    this.isThinking.set(false);

    this.messages.update((msgs) => [...msgs, response]);
  }

  private resolveIntentAndGenerateResponse(input: string): ChatMessage {
    const q = input.toLowerCase();

    // Intent 1: Mis Entradas / Wallet
    if (q.includes('entrada') || q.includes('ticket') || q.includes('wallet') || q.includes('boveda') || q.includes('bóveda') || q.includes('mis pases') || q.includes('mi reserva')) {
      const ticketsCount = this.busService.storedBookings().length;
      return {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: ticketsCount > 0
          ? `Actualmente tienes **${ticketsCount} ${ticketsCount === 1 ? 'pase activo' : 'pases activos'}** en tu Bóveda Digital AURORA. Puedes consultar los códigos QR, descargarlos o agregarlos a Google Calendar.`
          : 'Aún no tienes pases en tu Bóveda Digital. Cuando confirmes la reserva de cualquier taller o concierto, tu código QR y credencial aparecerán allí automáticamente.',
        timestamp: this.getCurrentTimeString(),
        suggestedActions: [
          {
            label: '🎟️ Abrir Bóveda de Entradas',
            action: () => this.safeOpenWallet(),
          },
        ],
      };
    }

    // Intent 2: Conciertos / Música en Vivo
    if (q.includes('concierto') || q.includes('musica') || q.includes('música') || q.includes('festival') || q.includes('jazz') || q.includes('electronica') || q.includes('electrónica')) {
      const concerts = this.allEvents.filter((e) => e.eventType === 'concert');
      return {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: 'La temporada AURORA 2026 incluye producciones sonoras de clase mundial con mapping en tiempo real y formatos íntimos de networking. Aquí tienes las opciones destacadas:',
        suggestedEvents: concerts,
        timestamp: this.getCurrentTimeString(),
        suggestedActions: [
          {
            label: '🔍 Filtrar conciertos en la agenda',
            action: () => this.safeTriggerCatalogSearch('', 'concert'),
          },
        ],
      };
    }

    // Intent 3: Eventos Gratuitos / Meetups / Ocio / Hackathon
    if (q.includes('gratis') || q.includes('gratuito') || q.includes('free') || q.includes('hackathon') || q.includes('meetup') || q.includes('ocio')) {
      const freeOrLeisure = this.allEvents.filter((e) => e.price === 0 || e.eventType === 'leisure' || e.eventType === 'meetup');
      return {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: '¡Por supuesto! Contamos con experiencias de alto valor impulsadas por la comunidad y sponsors, incluyendo el **Hackathon AURORA 48h** ($50K USD en premios) y el **Meetup Angular Colombia** 100% gratuitos:',
        suggestedEvents: freeOrLeisure,
        timestamp: this.getCurrentTimeString(),
        suggestedActions: [
          {
            label: '⚡ Ver Ocio y Hackathons en vivo',
            action: () => this.safeTriggerCatalogSearch('', 'leisure'),
          },
        ],
      };
    }

    // Intent 4: Inteligencia Artificial y Agentes
    if (q.includes('ia') || q.includes('ai') || q.includes('agente') || q.includes('llm') || q.includes('deepmind') || q.includes('machine learning')) {
      const aiEvents = this.allEvents.filter((e) => e.category === 'ai' || e.id.includes('ai') || e.topics.some((t) => t.toLowerCase().includes('ia')));
      return {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: 'En IA tenemos el workshop estelar dictado por la **Dra. Valeria Montes (Ex-DeepMind)** enfocado en arquitecturas de agentes autónomos, RAG híbrido y orquestación con memoria persistente:',
        suggestedEvents: aiEvents,
        timestamp: this.getCurrentTimeString(),
        suggestedActions: [
          {
            label: '🧠 Filtrar IA en el catálogo',
            action: () => this.safeTriggerCatalogSearch('', 'ai'),
          },
        ],
      };
    }

    // Intent 5: Arquitectura de Micro Frontends
    if (q.includes('micro') || q.includes('mfe') || q.includes('frontend') || q.includes('arquitectura') || q.includes('federation')) {
      const archEvents = this.allEvents.filter((e) => e.category === 'architecture' || e.id.includes('micro-frontends'));
      return {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: 'El programa de **Arquitectura Micro Frontends & Modular Enterprise** con **Mateo Cárdenas (Google Developer Expert)** es el referente absoluto para diseñar monorepos, Native Federation y decoupling a gran escala:',
        suggestedEvents: archEvents,
        timestamp: this.getCurrentTimeString(),
        suggestedActions: [
          {
            label: '🏛️ Filtrar Arquitectura Web',
            action: () => this.safeTriggerCatalogSearch('', 'architecture'),
          },
        ],
      };
    }

    // Intent 6: Cursos Estructurados de varias semanas
    if (q.includes('curso') || q.includes('semanas') || q.includes('fullstack') || q.includes('data science') || q.includes('product management') || q.includes('pm')) {
      const courses = this.allEvents.filter((e) => e.eventType === 'course');
      return {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: 'Si buscas formación profunda de varias semanas con certificación oficial verificable y mentoría 1-a-1, te sugiero nuestros cursos de alta demanda:',
        suggestedEvents: courses,
        timestamp: this.getCurrentTimeString(),
        suggestedActions: [
          {
            label: '🎓 Explorar todos los Cursos',
            action: () => this.safeTriggerCatalogSearch('', 'course'),
          },
        ],
      };
    }

    // Intent 7: Reserva directa por nombre o palabra clave
    const matched = this.allEvents.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      e.categoryLabel.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      (e.instructor?.name.toLowerCase().includes(q) ?? false)
    );

    if (matched.length > 0) {
      return {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: `He encontrado **${matched.length} ${matched.length === 1 ? 'experiencia' : 'experiencias'}** en nuestra agenda 2026 que coinciden con tu búsqueda:`,
        suggestedEvents: matched.slice(0, 3),
        timestamp: this.getCurrentTimeString(),
        suggestedActions: [
          {
            label: '🎯 Ver todas las coincidencias en agenda',
            action: () => this.safeTriggerCatalogSearch(q),
          },
        ],
      };
    }

    // Fallback: Asistencia amigable con recomendaciones
    return {
      id: 'ast_' + Date.now(),
      sender: 'assistant',
      text: `Entendido. Te puedo orientar en cualquier temática de la temporada 2026: **Inteligencia Artificial**, **Micro Frontends**, **Design Systems**, **Liderazgo Técnico**, **Conciertos** o **Hackathons**. ¿Cuál de estas áreas se alinea más con tus metas de este año?`,
      timestamp: this.getCurrentTimeString(),
      suggestedActions: [
        { label: '🤖 Talleres de IA & Modelos', action: () => this.sendMessage('Háblame del taller de IA') },
        { label: '🎨 Design Systems & UI', action: () => this.sendMessage('¿Qué hay de Design Systems?') },
        { label: '☁️ Cloud FinOps & Kubernetes', action: () => this.sendMessage('Detalles de Cloud FinOps') },
        { label: '📅 Ver agenda completa', action: () => this.safeTriggerCatalogSearch('') },
      ],
    };
  }

  private safeOpenWallet(): void {
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

  private safeTriggerCatalogSearch(query: string, category?: string): void {
    if (this.busService && typeof (this.busService as any).triggerCatalogSearch === 'function') {
      try {
        this.busService.triggerCatalogSearch(query, category);
      } catch (e) {
        console.warn('busService.triggerCatalogSearch error', e);
      }
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aurora:catalog-search', { detail: { query, category } })
      );
    }
  }

  bookDirectly(event: WorkshopEvent): void {
    if (this.busService && typeof (this.busService as any).openBooking === 'function') {
      try {
        this.busService.openBooking(event);
      } catch (e) {
        console.warn('busService.openBooking error', e);
      }
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:open-booking', { detail: event }));
    }
  }

  clearChat(): void {
    this.messages.set([
      {
        id: 'welcome-clean',
        sender: 'assistant',
        text: 'Historial reiniciado. Estoy listo para ayudarte a encontrar y reservar la mejor experiencia técnica y cultural de 2026.',
        timestamp: this.getCurrentTimeString(),
      },
    ]);
  }
}
