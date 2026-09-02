import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsCatalogComponent } from './components/events-catalog.component';

@Component({
  selector: 'app-mfe-events-root',
  standalone: true,
  imports: [CommonModule, EventsCatalogComponent],
  template: `
    <div class="mfe-events-app">
      <header class="standalone-header">
        <div class="header-inner">
          <div class="brand">
            <span class="brand-spark">◆</span>
            <span class="brand-text">AURORA <small>Events MFE (Port 4201)</small></span>
          </div>
          <span class="mfe-status-badge">Micro Frontend Activo</span>
        </div>
      </header>

      <main>
        <mfe-events-catalog></mfe-events-catalog>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .mfe-events-app {
      min-height: 100vh;
      background: radial-gradient(circle at 50% 0%, #171d33 0%, #070a12 60%);
    }

    .standalone-header {
      background: rgba(13, 18, 31, 0.85);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      padding: 14px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.15rem;
      letter-spacing: -0.01em;
      color: #ffffff;
    }

    .brand-spark {
      color: #6366f1;
      font-size: 1.3rem;
    }

    .brand small {
      font-size: 0.72rem;
      font-weight: 500;
      color: #94a3b8;
      margin-left: 6px;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 8px;
      border-radius: 6px;
    }

    .mfe-status-badge {
      font-size: 0.75rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: 600;
    }
  `],
})
export class App {}
