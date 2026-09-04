import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CrossMfeBusService, WorkshopEvent } from 'shared-kernel';
import { AuroraConciergeAiService, ChatMessage } from '../services/aurora-concierge-ai.service';

@Component({
  selector: 'shell-aurora-concierge-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating AI Agent Trigger Button -->
    <div class="concierge-trigger-container" *ngIf="!isOpen()">
      <div class="ai-ambient-glow"></div>
      <button
        type="button"
        class="btn-concierge-trigger"
        (click)="openConcierge()"
        aria-label="Abrir Aurora Concierge AI"
        title="Abrir Aurora Concierge AI 2026"
      >
        <div class="trigger-inner">
          <div class="ai-symbol">
            <span class="sparkle-spark">✦</span>
          </div>
          <div class="trigger-label-group">
            <span class="label-top">AURORA AI</span>
            <span class="label-sub">Concierge 2026</span>
          </div>
          <div class="online-indicator">
            <span class="indicator-dot"></span>
          </div>
        </div>
      </button>
    </div>

    <!-- Concierge AI Chat Panel / Modal Drawer -->
    <div
      class="concierge-panel-backdrop"
      *ngIf="isOpen()"
      (click)="closeConcierge()"
    >
      <div class="concierge-panel" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="panel-header">
          <div class="header-identity">
            <div class="ai-avatar-wrapper">
              <span class="avatar-spark">✦</span>
              <span class="neural-pulse"></span>
            </div>
            <div>
              <div class="identity-title-row">
                <h3 class="identity-name">Aurora Concierge AI</h3>
                <span class="badge-agentic">AGENTIC 2026/2027</span>
              </div>
              <p class="identity-status">
                <span class="status-live-dot"></span> Conectado a agenda federada & wallet
              </p>
            </div>
          </div>
          <div class="header-actions">
            <button
              type="button"
              class="btn-panel-action"
              (click)="aiService.clearChat()"
              title="Reiniciar chat"
            >
              🔄
            </button>
            <button
              type="button"
              class="btn-panel-action btn-close-x"
              (click)="closeConcierge()"
              aria-label="Cerrar chat"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Capability Chips Ribbon -->
        <div class="capability-ribbon">
          <span class="cap-tag">⚡ Agente Proactivo</span>
          <span class="cap-tag">🎟️ Reserva Directa</span>
          <span class="cap-tag">🧠 Filtrado Inteligente</span>
          <span class="cap-tag">🛡️ Acceso Seguro</span>
        </div>

        <!-- Messages Area -->
        <div class="messages-container" #scrollContainer>
          <div
            *ngFor="let msg of aiService.messages()"
            class="message-row"
            [class.user-row]="msg.sender === 'user'"
            [class.assistant-row]="msg.sender === 'assistant'"
          >
            <!-- Assistant Avatar -->
            <div class="msg-avatar" *ngIf="msg.sender === 'assistant'">
              <span>✦</span>
            </div>

            <div class="msg-bubble-wrapper">
              <div class="msg-bubble" [class.user-bubble]="msg.sender === 'user'">
                <p class="msg-text" [innerHTML]="formatMessageText(msg.text)"></p>
                <span class="msg-timestamp">{{ msg.timestamp }}</span>
              </div>

              <!-- Embedded Event Mini-Cards (Tool Results) -->
              <div class="event-cards-carousel" *ngIf="msg.suggestedEvents && msg.suggestedEvents.length > 0">
                <div class="mini-event-card" *ngFor="let ev of msg.suggestedEvents">
                  <div class="mini-card-header" [style.background]="ev.accentGradient">
                    <span class="mini-cat-badge">{{ ev.categoryLabel }}</span>
                    <span class="mini-price">{{ ev.price === 0 ? 'GRATIS' : ('$' + ev.price + ' USD') }}</span>
                  </div>
                  <div class="mini-card-body">
                    <h5 class="mini-title">{{ ev.title }}</h5>
                    <p class="mini-sub">{{ ev.subtitle }}</p>
                    <div class="mini-meta">
                      <span>📅 {{ ev.startDate }}</span>
                      <span>📍 {{ ev.modality }}</span>
                    </div>
                    <div class="mini-instructor" *ngIf="ev.instructor">
                      <img [src]="ev.instructor.avatar" [alt]="ev.instructor.name" class="instructor-thumb" />
                      <span>{{ ev.instructor.name }} ({{ ev.instructor.company }})</span>
                    </div>
                  </div>
                  <div class="mini-card-footer">
                    <button
                      type="button"
                      class="btn-mini-book"
                      (click)="onBookEvent(ev)"
                    >
                      <span>Reservar Cupo</span>
                      <span class="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Suggested Action Buttons -->
              <div class="suggested-actions" *ngIf="msg.suggestedActions && msg.suggestedActions.length > 0">
                <button
                  type="button"
                  class="btn-suggested-chip"
                  *ngFor="let act of msg.suggestedActions"
                  (click)="act.action()"
                >
                  {{ act.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Thinking Agent State -->
          <div class="message-row assistant-row" *ngIf="aiService.isThinking()">
            <div class="msg-avatar">
              <span>✦</span>
            </div>
            <div class="thinking-bubble">
              <div class="dot-flashing"></div>
              <span>Analizando catálogo y disponibilidad en vivo...</span>
            </div>
          </div>
        </div>

        <!-- Input Form Bar -->
        <form class="chat-input-bar" (ngSubmit)="handleSend()">
          <input
            type="text"
            class="input-query"
            placeholder="Pregunta a Aurora AI sobre talleres, horarios, precios..."
            [(ngModel)]="userPrompt"
            name="userPrompt"
            [disabled]="aiService.isThinking()"
            autocomplete="off"
            #chatInput
          />
          <button
            type="submit"
            class="btn-send-message"
            [disabled]="!userPrompt.trim() || aiService.isThinking()"
            aria-label="Enviar mensaje"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>

        <!-- Footer Notice -->
        <div class="panel-bottom-hint">
          <span>Potenciado por arquitectura de agentes autónomos y microfrontends reactivos de Aurora Hub.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      z-index: 9999;
    }

    /* ─── Floating Trigger ─── */
    .concierge-trigger-container {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 99999;
      pointer-events: auto;
    }

    .ai-ambient-glow {
      position: absolute;
      inset: -6px;
      border-radius: 9999px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0.2) 70%, transparent 100%);
      filter: blur(10px);
      z-index: -1;
      animation: ambientPulse 3s ease-in-out infinite alternate;
    }

    @keyframes ambientPulse {
      0% { transform: scale(0.95); opacity: 0.6; }
      100% { transform: scale(1.15); opacity: 1; }
    }

    .btn-concierge-trigger {
      display: flex;
      align-items: center;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(168, 85, 247, 0.5);
      border-radius: 9999px;
      padding: 10px 20px 10px 14px;
      color: #ffffff;
      cursor: pointer;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(124, 58, 237, 0.3);
      backdrop-filter: blur(16px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-concierge-trigger:hover {
      transform: translateY(-3px) scale(1.03);
      border-color: #a855f7;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.5);
    }

    .trigger-inner {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ai-symbol {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: #ffffff;
      box-shadow: 0 0 14px rgba(168, 85, 247, 0.7);
    }

    .sparkle-spark {
      animation: rotateSpark 4s linear infinite;
      display: inline-block;
    }

    @keyframes rotateSpark {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .trigger-label-group {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .label-top {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 0.88rem;
      letter-spacing: 0.04em;
      background: linear-gradient(90deg, #ffffff, #c7d2fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .label-sub {
      font-size: 0.72rem;
      color: #94a3b8;
    }

    .online-indicator {
      display: flex;
      align-items: center;
      margin-left: 4px;
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 10px #34d399;
      animation: livePulse 2s infinite;
    }

    @keyframes livePulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.5; }
    }

    /* ─── Panel Backdrop & Container ─── */
    .concierge-panel-backdrop {
      position: fixed;
      inset: 0;
      z-index: 2200;
      background: rgba(4, 7, 18, 0.65);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: flex-end;
      animation: fadeInBackdrop 0.25s ease-out;
    }

    @keyframes fadeInBackdrop {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .concierge-panel {
      width: 100%;
      max-width: 480px;
      height: 100%;
      background: rgba(11, 17, 34, 0.94);
      border-left: 1px solid rgba(139, 92, 246, 0.25);
      backdrop-filter: blur(28px);
      display: flex;
      flex-direction: column;
      box-shadow: -15px 0 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.15);
      animation: slideInPanel 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideInPanel {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    /* ─── Header ─── */
    .panel-header {
      padding: 18px 22px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.02);
    }

    .header-identity {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ai-avatar-wrapper {
      position: relative;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 1.3rem;
      box-shadow: 0 0 16px rgba(168, 85, 247, 0.5);
    }

    .identity-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .identity-name {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 800;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
    }

    .badge-agentic {
      font-size: 0.65rem;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 9999px;
      background: rgba(168, 85, 247, 0.2);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #c084fc;
      letter-spacing: 0.05em;
    }

    .identity-status {
      margin: 3px 0 0;
      font-size: 0.75rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .status-live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 8px #34d399;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .btn-panel-action {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .btn-panel-action:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .btn-close-x:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      color: #f87171;
    }

    /* ─── Capability Ribbon ─── */
    .capability-ribbon {
      display: flex;
      gap: 6px;
      padding: 8px 18px;
      background: rgba(0, 0, 0, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      overflow-x: auto;
      white-space: nowrap;
    }

    .cap-tag {
      font-size: 0.68rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.04);
      color: #94a3b8;
    }

    /* ─── Messages Area ─── */
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px 18px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .message-row {
      display: flex;
      gap: 10px;
      max-width: 100%;
    }

    .user-row {
      justify-content: flex-end;
    }

    .assistant-row {
      justify-content: flex-start;
    }

    .msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      color: #ffffff;
      flex-shrink: 0;
      margin-top: 4px;
    }

    .msg-bubble-wrapper {
      max-width: 88%;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .msg-bubble {
      padding: 12px 16px;
      border-radius: 16px;
      border-top-left-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .user-bubble {
      border-top-left-radius: 16px;
      border-top-right-radius: 4px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      border: 1px solid rgba(168, 85, 247, 0.3);
      color: #ffffff;
    }

    .msg-text {
      margin: 0 0 4px;
      white-space: pre-wrap;
    }

    .msg-timestamp {
      font-size: 0.68rem;
      color: #64748b;
      display: block;
      text-align: right;
    }

    .user-bubble .msg-timestamp {
      color: rgba(255, 255, 255, 0.7);
    }

    /* ─── Mini Event Cards Inside Chat ─── */
    .event-cards-carousel {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 4px;
    }

    .mini-event-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
      transition: transform 0.2s, border-color 0.2s;
    }

    .mini-event-card:hover {
      transform: translateY(-2px);
      border-color: rgba(168, 85, 247, 0.4);
    }

    .mini-card-header {
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: #ffffff;
    }

    .mini-cat-badge {
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .mini-price {
      background: rgba(0, 0, 0, 0.35);
      padding: 2px 8px;
      border-radius: 9999px;
    }

    .mini-card-body {
      padding: 10px 12px;
    }

    .mini-title {
      margin: 0 0 4px;
      font-size: 0.92rem;
      font-weight: 700;
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
    }

    .mini-sub {
      margin: 0 0 8px;
      font-size: 0.76rem;
      color: #94a3b8;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .mini-meta {
      display: flex;
      gap: 12px;
      font-size: 0.72rem;
      color: #38bdf8;
      margin-bottom: 6px;
    }

    .mini-instructor {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.72rem;
      color: #cbd5e1;
    }

    .instructor-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      object-fit: cover;
    }

    .mini-card-footer {
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.02);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .btn-mini-book {
      width: 100%;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid rgba(99, 102, 241, 0.4);
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%);
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
    }

    .btn-mini-book:hover {
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      box-shadow: 0 0 16px rgba(124, 58, 237, 0.4);
    }

    /* ─── Suggested Actions Chips ─── */
    .suggested-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }

    .btn-suggested-chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 12px;
      border-radius: 9999px;
      color: #c7d2fe;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-suggested-chip:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: #818cf8;
      color: #ffffff;
      transform: translateY(-1px);
    }

    /* ─── Thinking Bubble ─── */
    .thinking-bubble {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.8rem;
      color: #a78bfa;
    }

    .dot-flashing {
      position: relative;
      width: 6px;
      height: 6px;
      border-radius: 5px;
      background-color: #a78bfa;
      animation: dotPulse 1s infinite linear alternate;
    }

    @keyframes dotPulse {
      0% { opacity: 0.2; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1.3); }
    }

    /* ─── Input Bar ─── */
    .chat-input-bar {
      padding: 12px 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 23, 42, 0.7);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .input-query {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 12px 16px;
      border-radius: 12px;
      color: #ffffff;
      font-size: 0.88rem;
      outline: none;
      transition: all 0.2s;
    }

    .input-query:focus {
      border-color: #818cf8;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 16px rgba(99, 102, 241, 0.25);
    }

    .input-query::placeholder {
      color: #64748b;
    }

    .btn-send-message {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .btn-send-message:hover:not(:disabled) {
      transform: scale(1.06);
      box-shadow: 0 0 16px rgba(168, 85, 247, 0.5);
    }

    .btn-send-message:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* ─── Footer Notice ─── */
    .panel-bottom-hint {
      padding: 6px 18px 12px;
      text-align: center;
      font-size: 0.68rem;
      color: #64748b;
      background: rgba(15, 23, 42, 0.7);
    }
  `],
})
export class AuroraConciergeAiComponent implements AfterViewChecked {
  readonly busService = inject(CrossMfeBusService);
  readonly aiService = inject(AuroraConciergeAiService);

  @ViewChild('scrollContainer') private readonly scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') private readonly chatInput?: ElementRef<HTMLInputElement>;

  readonly isOpen = signal<boolean>(false);
  userPrompt = '';

  constructor() {
    // Synchronize with busService signal if present
    if (this.busService && typeof (this.busService as any).isConciergeOpen === 'function') {
      try {
        const initial = (this.busService as any).isConciergeOpen();
        if (typeof initial === 'boolean') {
          this.isOpen.set(initial);
        }
      } catch (e) {
        // Safe fallback
      }
    }

    // Full decoupling window listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('aurora:open-concierge', () => {
        this.isOpen.set(true);
        setTimeout(() => {
          this.chatInput?.nativeElement.focus();
        }, 150);
      });

      window.addEventListener('aurora:close-concierge', () => {
        this.isOpen.set(false);
      });
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  openConcierge(): void {
    this.isOpen.set(true);
    if (this.busService && typeof (this.busService as any).openConcierge === 'function') {
      try {
        this.busService.openConcierge();
      } catch (e) {
        console.warn('CrossMfeBusService.openConcierge call failed', e);
      }
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:open-concierge'));
    }

    setTimeout(() => {
      this.chatInput?.nativeElement.focus();
    }, 150);
  }

  closeConcierge(): void {
    this.isOpen.set(false);
    if (this.busService && typeof (this.busService as any).closeConcierge === 'function') {
      try {
        this.busService.closeConcierge();
      } catch (e) {
        console.warn('CrossMfeBusService.closeConcierge call failed', e);
      }
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:close-concierge'));
    }
  }

  handleSend(): void {
    if (!this.userPrompt.trim()) return;
    const text = this.userPrompt;
    this.userPrompt = '';
    this.aiService.sendMessage(text);
  }

  onBookEvent(event: WorkshopEvent): void {
    this.closeConcierge();
    if (this.busService && typeof (this.busService as any).openBooking === 'function') {
      this.busService.openBooking(event);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:open-booking', { detail: event }));
    }
  }

  formatMessageText(text: string): string {
    // Basic markdown formatting: bold **text** to <strong>text</strong>
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
