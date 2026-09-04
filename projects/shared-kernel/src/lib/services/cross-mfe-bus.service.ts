import { Injectable, signal } from '@angular/core';
import { WorkshopEvent } from '../models/workshop-event.model';
import { BookingConfirmation } from '../models/booking.model';

const GLOBAL_BUS_KEY = '__AURORA_CROSS_MFE_BUS__';
const STORAGE_KEY = 'aurora_tickets_wallet_v1';

export interface BusEventsMap {
  OPEN_BOOKING: WorkshopEvent;
  CLOSE_BOOKING: void;
  BOOKING_CONFIRMED: BookingConfirmation;
  FILTER_CATEGORY: string;
  TOGGLE_CONCIERGE: boolean;
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

  // Concierge AI Signals
  readonly isConciergeOpen = signal<boolean>(false);
  readonly conciergeTargetSearch = signal<string>('');

  // Ticket Wallet Signals
  readonly isWalletModalOpen = signal<boolean>(false);
  readonly storedBookings = signal<BookingConfirmation[]>(this.loadBookingsFromStorage());

  constructor() {
    this.initGlobalWindowBridge();
  }

  private loadBookingsFromStorage(): BookingConfirmation[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveBookingsToStorage(bookings: BookingConfirmation[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Error saving tickets to localStorage', e);
    }
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
        this.addBookingToWallet(e.detail);
      }
    }) as EventListener);

    window.addEventListener('aurora:open-concierge', (() => {
      this.isConciergeOpen.set(true);
    }) as EventListener);

    window.addEventListener('aurora:close-concierge', (() => {
      this.isConciergeOpen.set(false);
    }) as EventListener);

    window.addEventListener('aurora:open-wallet', (() => {
      this.isWalletModalOpen.set(true);
    }) as EventListener);

    window.addEventListener('aurora:close-wallet', (() => {
      this.isWalletModalOpen.set(false);
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
    this.addBookingToWallet(confirmation);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aurora:booking-confirmed', { detail: confirmation })
      );
    }
  }

  addBookingToWallet(confirmation: BookingConfirmation): void {
    const list = [confirmation, ...this.storedBookings().filter(b => b.bookingId !== confirmation.bookingId)];
    this.storedBookings.set(list);
    this.saveBookingsToStorage(list);
  }

  openWallet(): void {
    this.isWalletModalOpen.set(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:open-wallet'));
    }
  }

  closeWallet(): void {
    this.isWalletModalOpen.set(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:close-wallet'));
    }
  }

  openConcierge(): void {
    this.isConciergeOpen.set(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:open-concierge'));
    }
  }

  closeConcierge(): void {
    this.isConciergeOpen.set(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aurora:close-concierge'));
    }
  }

  toggleConcierge(): void {
    const next = !this.isConciergeOpen();
    this.isConciergeOpen.set(next);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(next ? 'aurora:open-concierge' : 'aurora:close-concierge'));
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

  triggerCatalogSearch(query: string, category?: string): void {
    if (category) {
      this.setCategoryFilter(category);
    }
    this.conciergeTargetSearch.set(query);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('aurora:catalog-search', { detail: { query, category } })
      );
    }
  }
}

