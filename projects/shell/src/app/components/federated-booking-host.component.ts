import { Component, OnInit, signal, ViewContainerRef, inject, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'shell-federated-booking-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Container where Federated Booking Modal is dynamically mounted -->
    <ng-container #bookingContainer></ng-container>
  `,
})
export class FederatedBookingHostComponent implements OnInit {
  private readonly vcr = inject(ViewContainerRef);
  readonly isRemoteLoaded = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    try {
      let m: any;
      try {
        m = await loadRemoteModule({
          remoteName: 'mfe-booking',
          exposedModule: './BookingModal',
        });
      } catch {
        m = await loadRemoteModule({
          remoteName: 'mfeBooking',
          exposedModule: './BookingModal',
        });
      }
      const componentClass: Type<any> = m.BookingModalComponent || Object.values(m)[0];
      this.vcr.createComponent(componentClass);
      this.isRemoteLoaded.set(true);
    } catch (err) {
      console.error('Error cargando remote mfe-booking:', err);
    }
  }
}
