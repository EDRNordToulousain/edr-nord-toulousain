export const rugbyCategories = ["U6", "U8", "U10", "U12", "U14"] as const;

export type RugbyCategory = (typeof rugbyCategories)[number];

export type CalendarEvent = {
  date: string;
  category: RugbyCategory;
  location: string;
  time?: string;
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

// Une entrée correspond à une catégorie et une date. Pour préciser un lieu,
// remplacer uniquement la valeur `location` de l’entrée concernée.
const plateaux: readonly CalendarEvent[] = [
  { date: "2026-10-10", category: "U6", location: "À venir" },
  { date: "2026-11-14", category: "U6", location: "À venir" },
  { date: "2026-11-28", category: "U6", location: "À venir" },
  { date: "2026-12-05", category: "U6", location: "À venir" },
  { date: "2027-01-16", category: "U6", location: "À venir" },
  { date: "2027-01-30", category: "U6", location: "À venir" },
  { date: "2027-03-06", category: "U6", location: "À venir" },
  { date: "2027-03-20", category: "U6", location: "À venir" },
  { date: "2027-04-24", category: "U6", location: "À venir" },
  { date: "2027-05-29", category: "U6", location: "À venir" },

  { date: "2026-09-26", category: "U8", location: "À venir" },
  { date: "2026-10-10", category: "U8", location: "À venir" },
  { date: "2026-11-14", category: "U8", location: "À venir" },
  { date: "2026-11-28", category: "U8", location: "À venir" },
  { date: "2026-12-05", category: "U8", location: "À venir" },
  { date: "2027-01-16", category: "U8", location: "À venir" },
  { date: "2027-01-30", category: "U8", location: "À venir" },
  { date: "2027-03-06", category: "U8", location: "À venir" },
  { date: "2027-03-20", category: "U8", location: "À venir" },
  { date: "2027-04-24", category: "U8", location: "À venir" },

  { date: "2026-09-26", category: "U10", location: "À venir" },
  { date: "2026-10-10", category: "U10", location: "À venir" },
  { date: "2026-11-14", category: "U10", location: "À venir" },
  { date: "2026-11-28", category: "U10", location: "À venir" },
  { date: "2026-12-05", category: "U10", location: "À venir" },
  { date: "2027-01-16", category: "U10", location: "À venir" },
  { date: "2027-01-30", category: "U10", location: "À venir" },
  { date: "2027-03-06", category: "U10", location: "À venir" },
  { date: "2027-03-20", category: "U10", location: "À venir" },
  { date: "2027-04-24", category: "U10", location: "À venir" },

  { date: "2026-09-26", category: "U12", location: "À venir" },
  { date: "2026-10-10", category: "U12", location: "À venir" },
  { date: "2026-11-14", category: "U12", location: "À venir" },
  { date: "2026-11-28", category: "U12", location: "À venir" },
  { date: "2026-12-05", category: "U12", location: "À venir" },
  { date: "2027-01-16", category: "U12", location: "À venir" },
  { date: "2027-01-30", category: "U12", location: "À venir" },
  { date: "2027-03-06", category: "U12", location: "À venir" },
  { date: "2027-03-13", category: "U12", location: "À venir" },
  { date: "2027-03-20", category: "U12", location: "À venir" },

  { date: "2026-09-19", category: "U14", location: "À venir" },
  { date: "2026-09-26", category: "U14", location: "À venir" },
  { date: "2026-10-10", category: "U14", location: "À venir" },
  { date: "2026-11-07", category: "U14", location: "À venir" },
  { date: "2026-11-21", category: "U14", location: "À venir" },
  { date: "2026-12-05", category: "U14", location: "À venir" },
  { date: "2027-01-16", category: "U14", location: "À venir" },
  { date: "2027-01-30", category: "U14", location: "À venir" },
  { date: "2027-02-27", category: "U14", location: "À venir" },
  { date: "2027-03-13", category: "U14", location: "À venir" },
  { date: "2027-03-20", category: "U14", location: "À venir" },
  { date: "2027-04-24", category: "U14", location: "À venir" },
  { date: "2027-05-30", category: "U14", location: "À venir" },
];

export const seasonEvents: Record<CalendarKind, readonly CalendarEvent[]> = {
  plateaux,
  tournois: [],
};
