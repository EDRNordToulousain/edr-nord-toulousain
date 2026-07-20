export type CalendarEvent = {
  date: string;
  category: string;
  title: string;
  commune: string;
  venue: string;
  time: string;
  details?: string;
  directionsUrl?: string;
};

export type CalendarKind = "plateaux" | "tournois";

export const seasonMonths = [
  { year: 2026, month: 8 },
  { year: 2026, month: 9 },
  { year: 2026, month: 10 },
  { year: 2026, month: 11 },
  { year: 2026, month: 12 },
  { year: 2027, month: 1 },
  { year: 2027, month: 2 },
  { year: 2027, month: 3 },
  { year: 2027, month: 4 },
  { year: 2027, month: 5 },
  { year: 2027, month: 6 },
] as const;

// Ajouter uniquement des dates officiellement confirmées, au format AAAA-MM-JJ.
export const seasonEvents: Record<CalendarKind, readonly CalendarEvent[]> = {
  plateaux: [],
  tournois: [],
};
