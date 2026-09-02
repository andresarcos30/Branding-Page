export type EventType = 'concert' | 'course' | 'medical' | 'meetup' | 'leisure' | 'workshop';

export type EventCategory =
  | 'all'
  | 'concert'
  | 'medical'
  | 'meetup'
  | 'course'
  | 'leisure'
  | 'ai'
  | 'architecture'
  | 'ux'
  | 'cloud'
  | 'leadership';

export type EventModality = 'all' | 'Virtual' | 'Presencial' | 'Híbrido';
export type EventLevel = 'all' | 'Principiante' | 'Intermedio' | 'Avanzado' | 'Todos los Niveles' | 'Especialistas';

export interface Instructor {
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  badge?: string;
}

export interface ConcertMetadata {
  lineUp: string[];
  ageRestriction: string;
  doorOpeningTime: string;
  stageName: string;
  genre: string;
  zoneTypes: string[];
}

export interface MedicalMetadata {
  cmeCredits: number;
  specialty: string;
  collegiateAccreditation: string;
  scientificChair: string;
  universityEndorsement: string;
  hasLiveSurgeryStream?: boolean;
}

export interface MeetupMetadata {
  communityName: string;
  isFreeTicket: boolean;
  networkingDrinksIncluded: boolean;
  lightningTalksCount: number;
  sponsorPerks?: string;
}

export interface CourseMetadata {
  syllabusWeeks?: number;
  academicHours?: number;
  certificateType: string;
  githubRepoIncluded?: boolean;
  modules?: string[];
}

export interface LeisureMetadata {
  experienceType: string; // 'hackathon' | 'feria' | 'networking' | 'cultural'
  dressCode?: string;
  foodIncluded?: boolean;
  activitiesHighlight: string[];
  minAge?: number;
  maxAttendees?: number;
}

export interface WorkshopEvent {
  id: string;
  title: string;
  subtitle: string;
  eventType?: EventType; // 'concert' | 'course' | 'medical' | 'meetup' | 'leisure' | 'workshop'
  category: EventCategory;
  categoryLabel: string;
  level: EventLevel;
  modality: 'Virtual' | 'Presencial' | 'Híbrido';
  location: string;
  duration: string;
  startDate: string;
  instructor?: Instructor; // opcional — conciertos/eventos de ocio no tienen instructor
  badge: string;
  price: number;
  originalPrice: number;
  spotsTotal: number;
  spotsRemaining: number;
  accentGradient: string;
  heroImageUrl?: string; // imagen de portada para conciertos y eventos de ocio
  description: string;
  topics: string[]; // temario para cursos/talleres, highlights para conciertos
  includes: string[];
  concertData?: ConcertMetadata;
  medicalData?: MedicalMetadata;
  meetupData?: MeetupMetadata;
  courseData?: CourseMetadata;
  leisureData?: LeisureMetadata;
  scheduleDates: {
    id: string;
    date: string;
    dayName: string;
    time: string;
    period: 'Mañana' | 'Tarde' | 'Noche';
    availableSeats: number;
  }[];
}
