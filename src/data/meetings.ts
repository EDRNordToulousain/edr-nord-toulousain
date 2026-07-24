export type Meeting = {
  date: string;
  time: string;
  venue: string;
  kind: string;
  audience: string;
  agenda?: string;
};

export type MeetingMinutes = {
  title: string;
  date: string;
  description: string;
  path: string;
};

// Ajouter ici uniquement les réunions dont les informations sont confirmées.
export const meetings: readonly Meeting[] = [];

// Déposer les PDF dans /public/documents/reunions/ puis renseigner leur chemin ici.
export const meetingMinutes: readonly MeetingMinutes[] = [];
