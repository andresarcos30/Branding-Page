import { Component, OnInit, signal, ViewContainerRef, inject, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'shell-federated-events-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mfe-wrapper">
      <!-- Micro Frontend Status Badge -->
      <div class="mfe-header-bar">
        <div class="mfe-badge" [class.federated]="isRemoteLoaded()">
          <span class="pulse-indicator"></span>
          <span>{{ isRemoteLoaded() ? 'MFE-EVENTS FEDERATED (Port 4201)' : 'MFE-EVENTS CARGANDO...' }}</span>
        </div>
        <span class="mfe-tech-tag">Native Federation • Dynamic Standalone Module</span>
      </div>

      <!-- Container where MFE Component is dynamically mounted -->
      <ng-container #mfeContainer></ng-container>
    </div>
  `,
  styles: [`
    .mfe-wrapper {
      position: relative;
      width: 100%;
    }

    .mfe-header-bar {
      max-width: 1280px;
      margin: 0 auto 16px;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .mfe-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.72rem;
      font-weight: 700;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px 12px;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }

    .mfe-badge.federated {
      color: #a78bfa;
      background: rgba(139, 92, 246, 0.12);
      border-color: rgba(139, 92, 246, 0.35);
    }

    .pulse-indicator {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #8b5cf6;
      box-shadow: 0 0 8px #8b5cf6;
    }

    .mfe-tech-tag {
      font-size: 0.72rem;
      color: #64748b;
    }
  `],
})
export class FederatedEventsHostComponent implements OnInit {
  private readonly vcr = inject(ViewContainerRef);
  readonly isRemoteLoaded = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    try {
      let m: any;
      try {
        m = await loadRemoteModule({
          remoteName: 'mfe-events',
          exposedModule: './EventsCatalog',
        });
      } catch {
        m = await loadRemoteModule({
          remoteName: 'mfeEvents',
          exposedModule: './EventsCatalog',
        });
      }
      const componentClass: Type<any> = m.EventsCatalogComponent || Object.values(m)[0];
      this.vcr.createComponent(componentClass);
      this.isRemoteLoaded.set(true);
    } catch (err) {
      console.error('Error cargando remote mfe-events:', err);
    }
  }
}
