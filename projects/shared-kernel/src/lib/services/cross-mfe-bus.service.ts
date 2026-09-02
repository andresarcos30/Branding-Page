import { Injectable, signal } from '@angular/core';
import { WorkshopEvent } from '../models/workshop-event.model';
import { BookingConfirmation } from '../models/booking.model';

const GLOBAL_BUS_KEY = '__AURORA_CROSS_MFE_BUS__';

export interface BusEventsMap {
  OPEN_BOOKING: WorkshopEvent;
  CLOSE_BOOKING: void;
  BOOKING_CONFIRMED: BookingConfirmation;
  FILTER_CATEGORY: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrossMfeBusService {
  // Reactive Signals for in-app state
  readonly selectedEventForBooking = signal<WorkshopEvent | null>(null);
  readonly isBookingModalOpen = signal<boolean>(false);
  readonly latestConfirmation = signal<BookingConfirmation | null>(null);
  readonly activeCategoryFilter = signal<string>('all');

  constructor() {
    this.initGlobalWindowBridge();
  }

  private initGlobalWindowBridge(): void {
    if (typeof window === 'undefined') return;

    const win = window as any;
    if (!win[GLOBAL_BUS_KEY]) {
      win[GLOBAL_BUS_KEY] = {
        listeners: new Map<string, Set<(data: any) => void>>(),
      };
    }

    // Listen for custom window events for full MFE decoupling
    window.addEventListener('aurora:open-booking', ((e: CustomEvent) => {
      if (e.detail) {
        this.selectedEventForBooking.set(e.detail);
        this.isBookingModalOpen.set(true);
      }
    }) as EventListener);

    window.addEventListener('aurora:close-booking', (() => {
      this.isBookingModalOpen.set(false);
    }) as EventListener);

    window.addEventListener('aurora:booking-confirmed', ((e: CustomEvent) => {
      if (e.detail) {
        this.latestConfirmation.set(e.detail);
      }
    }) as EventListener);
  }

  openBooking(event: WorkshopEvent): void {
    this.selectedEventForBooking.set(event);
    this.isBookingModalOpen.set(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aurora:open-booking', { detail: event })
      );
    }
  }

  closeBooking(): void {
    this.isBookingModalOpen.set(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:close-booking'));
    }
  }

  notifyBookingConfirmed(confirmation: BookingConfirmation): void {
    this.latestConfirmation.set(confirmation);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aurora:booking-confirmed', { detail: confirmation })
      );
    }
  }

  setCategoryFilter(category: string): void {
    this.activeCategoryFilter.set(category);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aurora:category-filter', { detail: category })
      );
    }
  }
}
