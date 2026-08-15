export type Meeting = {
  date: string;
  title: string;
  information: string;
  featured?: boolean;
};

export type MeetingMinutes = {
  title: string;
  date: string;
  description: string;
  path: string;
};

// Ajouter ici uniquement les réunions dont les informations sont confirmées.
export const meetings: readonly Meeting[] = [
  {
    date: "2026-08-28",
    title: "Réunion de rentrée",
    information: "Horaire et informations pratiques à venir",
    featured: true,
  },
  { date: "2026-11-10", title: "Réunion", information: "Informations à venir" },
  { date: "2027-03-23", title: "Réunion", information: "Informations à venir" },
  { date: "2027-05-11", title: "Réunion", information: "Informations à venir" },
];

// Déposer les PDF dans /public/documents/reunions/ puis renseigner leur chemin ici.
export const meetingMinutes: readonly MeetingMinutes[] = [];
