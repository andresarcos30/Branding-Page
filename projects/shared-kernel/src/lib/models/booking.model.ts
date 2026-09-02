import { WorkshopEvent } from './workshop-event.model';

export type BookingTier = 
  | 'standard' 
  | 'pro' 
  | 'squad'
  | 'general'
  | 'vip'
  | 'backstage'
  | 'resident'
  | 'specialist'
  | 'fellow'
  | 'free_rsvp'
  | 'supporter'
  | 'sponsor';

export interface BookingTierOption {
  id: BookingTier;
  title: string;
  subtitle: string;
  priceMultiplier: number;
  perks: string[];
  badge?: string;
  popular?: boolean;
}

export interface BookingSlot {
  id: string;
  date: string;
  dayName: string;
  time: string;
  period: 'Mañana' | 'Tarde' | 'Noche';
  availableSeats: number;
}

export interface BookingRequest {
  eventId: string;
  eventTitle: string;
  slot: BookingSlot;
  tier: BookingTier;
  attendeeName: string;
  attendeeEmail: string;
  company?: string;
  experienceLevel?: string;
  specialRequests?: string;
  totalAmount: number;
  discountApplied?: number;
  // Specific vertical inputs
  selectedZone?: string;
  emergencyContact?: string;
  collegiateNumber?: string;
  medicalSpecialty?: string;
  socialProfileUrl?: string;
  networkingGoals?: string;
  githubUsername?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  event: WorkshopEvent;
  slot: BookingSlot;
  tier: BookingTier;
  tierTitle?: string;
  attendeeName: string;
  attendeeEmail: string;
  company?: string;
  dateBooked: string;
  totalAmount: number;
  qrCodeUrl: string;
  // Specific vertical outputs
  selectedZone?: string;
  collegiateNumber?: string;
  medicalSpecialty?: string;
  socialProfileUrl?: string;
}

