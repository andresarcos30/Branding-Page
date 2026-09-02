export type EventCategory = 'all' | 'ai' | 'architecture' | 'ux' | 'cloud' | 'leadership';
export type EventModality = 'all' | 'Virtual' | 'Presencial' | 'Híbrido';
export type EventLevel = 'all' | 'Principiante' | 'Intermedio' | 'Avanzado';

export interface Instructor {
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  badge?: string;
}

export interface WorkshopEvent {
  id: string;
  title: string;
  subtitle: string;
  category: 'ai' | 'architecture' | 'ux' | 'cloud' | 'leadership';
  categoryLabel: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  modality: 'Virtual' | 'Presencial' | 'Híbrido';
  location: string;
  duration: string;
  startDate: string;
  instructor: Instructor;
  badge: string;
  price: number;
  originalPrice: number;
  spotsTotal: number;
  spotsRemaining: number;
  accentGradient: string;
  description: string;
  topics: string[];
  includes: string[];
  scheduleDates: {
    id: string;
    date: string;
    dayName: string;
    time: string;
    period: 'Mañana' | 'Tarde' | 'Noche';
    availableSeats: number;
  }[];
}
