import { Injectable, signal, computed } from '@angular/core';
import { WorkshopEvent, BookingSlot, BookingTier, BookingConfirmation } from 'shared-kernel';

@Injectable({
  providedIn: 'root',
})
export class BookingStateService {
  readonly currentStep = signal<number>(1); // 1: Slot, 2: Tier, 3: Form, 4: Confirmation
  readonly selectedEvent = signal<WorkshopEvent | null>(null);
  readonly selectedSlot = signal<BookingSlot | null>(null);
  readonly selectedTier = signal<BookingTier>('pro');
  readonly selectedTimezone = signal<string>('UTC-5 (Bogotá, Lima, CDMX)');

  // Form fields
  readonly attendeeName = signal<string>('');
  readonly attendeeEmail = signal<string>('');
  readonly attendeeCompany = signal<string>('');
  readonly attendeeExperience = signal<string>('Intermedio (2-4 años)');
  readonly promoCode = signal<string>('');
  readonly discountPercent = signal<number>(0);
  readonly promoMessage = signal<string>('');

  // Confirmation result
  readonly confirmedBooking = signal<BookingConfirmation | null>(null);

  readonly tiers = [
    {
      id: 'standard' as BookingTier,
      title: 'Standard Access',
      subtitle: 'Acceso completo a sesiones en vivo y laboratorios',
      priceMultiplier: 1.0,
      badge: 'Básico',
      perks: [
        'Acceso en vivo HD a todas las sesiones',
        'Acceso a grabaciones y materiales por 1 año',
        'Certificado digital con verificación única',
        'Participación en Q&A grupal',
      ],
    },
    {
      id: 'pro' as BookingTier,
      title: 'Pro Experience',
      subtitle: 'La opción recomendada para acelerar tu carrera',
      priceMultiplier: 1.35,
      popular: true,
      badge: '★ Más Elegido',
      perks: [
        'Todo lo incluido en Standard Access',
        'Sesión privada 1-a-1 de mentoría técnica (45 min)',
        'Revisión detallada de tu código o arquitectura',
        'Acceso de por vida a grabaciones y futuras actualizaciones',
        'Canal VIP privado de Discord con mentores',
      ],
    },
    {
      id: 'squad' as BookingTier,
      title: 'Enterprise Squad',
      subtitle: 'Pase corporativo para 3 miembros de tu equipo',
      priceMultiplier: 2.6,
      badge: 'Empresas',
      perks: [
        '3 Pases completos para tu equipo de ingeniería/diseño',
        'Facturación corporativa con impuestos locales deducibles',
        'Sesión grupal privada de resolución de dudas técnicas',
        'Reporte ejecutivo de evaluación de competencias',
      ],
    },
  ];

  readonly calculatedSubtotal = computed(() => {
    const event = this.selectedEvent();
    if (!event) return 0;
    const tierConfig = this.tiers.find((t) => t.id === this.selectedTier());
    const mult = tierConfig ? tierConfig.priceMultiplier : 1;
    return Math.round(event.price * mult);
  });

  readonly calculatedDiscount = computed(() => {
    const sub = this.calculatedSubtotal();
    const disc = this.discountPercent();
    return Math.round((sub * disc) / 100);
  });

  readonly calculatedTotal = computed(() => {
    return Math.max(0, this.calculatedSubtotal() - this.calculatedDiscount());
  });

  initBookingWithEvent(event: WorkshopEvent): void {
    this.selectedEvent.set(event);
    this.currentStep.set(1);
    this.selectedSlot.set(event.scheduleDates[0] || null);
    this.selectedTier.set('pro');
    this.promoCode.set('');
    this.discountPercent.set(0);
    this.promoMessage.set('');
    this.confirmedBooking.set(null);
  }

  applyPromoCode(code: string): boolean {
    const clean = code.trim().toUpperCase();
    if (clean === 'AURORA2026' || clean === 'TECH20' || clean === 'VIP') {
      this.discountPercent.set(20);
      this.promoMessage.set('¡Cupón aplicado! 20% de descuento concedido.');
      return true;
    } else {
      this.discountPercent.set(0);
      this.promoMessage.set('Código no válido o expirado.');
      return false;
    }
  }

  completeBooking(): BookingConfirmation {
    const event = this.selectedEvent()!;
    const slot = this.selectedSlot()!;
    const bookingId = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
    
    // Dynamic simulated QR Code via SVG data URI
    const qrData = encodeURIComponent(`https://aurora.summit/verify/${bookingId}?attendee=${this.attendeeEmail()}`);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}&color=6366f1&bgcolor=070a12`;

    const confirmation: BookingConfirmation = {
      bookingId,
      event,
      slot,
      tier: this.selectedTier(),
      attendeeName: this.attendeeName() || 'Asistente AURORA',
      attendeeEmail: this.attendeeEmail() || 'asistente@aurora.io',
      company: this.attendeeCompany(),
      dateBooked: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      totalAmount: this.calculatedTotal(),
      qrCodeUrl,
    };

    this.confirmedBooking.set(confirmation);
    this.currentStep.set(4);
    return confirmation;
  }

  downloadIcsCalendarFile(confirmation: BookingConfirmation): void {
    const event = confirmation.event;
    const slot = confirmation.slot;
    const startDate = '20261024T140000Z';
    const endDate = '20261024T180000Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AURORA Summit//Workshops//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${confirmation.bookingId}@aurora.summit`,
      `SUMMARY:${event.title} - AURORA Masterclass`,
      `DESCRIPTION:Evento: ${event.subtitle}\\nHost/Mentor: ${event.instructor?.name || 'Organización AURORA'}\\nPase: ${confirmation.tier.toUpperCase()}\\nCódigo Reserva: ${confirmation.bookingId}`,
      `LOCATION:${event.location}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `AURORA-${event.id}-${confirmation.bookingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openGoogleCalendar(confirmation: BookingConfirmation): void {
    const event = confirmation.event;
    const title = encodeURIComponent(`${event.title} - AURORA Masterclass`);
    const details = encodeURIComponent(
      `Taller Oficial: ${event.title}\n${event.subtitle}\n\nMentor/Ponente: ${event.instructor?.name || 'AURORA Tech'}\nPase Adquirido: ${confirmation.tier.toUpperCase()}\nCódigo de Reserva: ${confirmation.bookingId}\n\nAcceso Oficial AURORA Summit 2026`
    );
    const location = encodeURIComponent(event.location || 'AURORA Live Campus');
    // 20261024T140000Z / 20261024T180000Z
    const dates = '20261024T140000Z/20261024T180000Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}

