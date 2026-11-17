export type VolunteerMission = {
  id: string;
  title: string;
  capacity: number | null;
  icon?: string;
  description?: string;
};
export type VolunteerScheduleItem = { label: string; value: string };
export type VolunteerEvent = {
  id: string;
  title: string;
  town: string;
  date: string;
  label: string;
  venue: string;
  schedule: readonly VolunteerScheduleItem[];
  missions: readonly VolunteerMission[];
};

// Confirmed unlimited missions use null; finite missions always have a positive capacity.
export const volunteerMissions = [
  { id: 'installation', icon: '🛠️', title: 'Installation des tables, chaises et de la buvette', capacity: null },
  { id: 'encaissement', icon: '💶', title: 'Encaissement', capacity: 4 },
  { id: 'buvette', icon: '🥤', title: 'Tenue de la buvette', capacity: 3 },
  { id: 'controle-cartons', icon: '🔎', title: 'Contrôle des cartons', capacity: 2 },
  { id: 'annonce-numeros', icon: '🎤', title: 'Annonce des numéros', capacity: 1 },
  { id: 'distribution-numeros', icon: '🎱', title: 'Distribution des numéros', capacity: 1 },
  { id: 'rangement-tables', icon: '🪑', title: 'Rangement des tables et chaises', capacity: null },
  { id: 'balayage', icon: '🧹', title: 'Balayage', capacity: null },
  { id: 'rangement-buvette', icon: '📦', title: 'Rangement de la buvette', capacity: null },
] as const;

export const tombolaMissions = [
  {
    id: 'prospection-lots',
    icon: '🎁',
    title: 'Recherche et prospection de lots',
    description: 'Identifier et contacter les commerces, entreprises, artisans et partenaires pour obtenir des lots, bons cadeaux ou prestations en don, avec possibilité de reçu fiscal (CERFA).',
    capacity: null,
  },
  {
    id: 'collecte-lots',
    icon: '🚗',
    title: 'Collecte des lots',
    description: 'Récupérer les lots auprès des commerçants et entreprises partenaires.',
    capacity: 2,
  },
] as const;

// A new catalogue entry creates its card and route; storage uses a matching migration.
// The array is kept in chronological order using each event's launch or event date.
export const volunteerEvents = [
  {
    id: 'lespinasse-2026', title: 'Loto de Lespinasse', town: 'Lespinasse', date: '2026-11-21', label: 'samedi 21 novembre 2026', venue: 'Salle du Canal des Deux Mers', missions: volunteerMissions,
    schedule: [
      { label: 'Début des besoins bénévoles', value: '17 h 30' },
      { label: 'Ouverture des portes', value: '19 h 30' },
      { label: 'Début du loto', value: '21 h' },
    ],
  },
  {
    id: 'tombola-2026-2027', title: 'Tombola de l’EDR', town: 'Saint-Jory', date: '2026-12-03', label: 'lancement jeudi 3 décembre 2026', venue: 'Stade David Berty, Saint-Jory', missions: tombolaMissions,
    schedule: [
      { label: 'Lancement de la tombola', value: '3 décembre 2026' },
      { label: 'Tirage au sort', value: '17 mars 2027' },
    ],
  },
  {
    id: 'bruguieres-2027', title: 'Loto de Bruguières', town: 'Bruguières', date: '2027-01-24', label: 'dimanche 24 janvier 2027', venue: 'Salle Xeraco', missions: volunteerMissions,
    schedule: [
      { label: 'Début des besoins bénévoles', value: '11 h' },
      { label: 'Ouverture des portes', value: '13 h' },
      { label: 'Début du loto', value: '15 h' },
    ],
  },
  {
    id: 'saint-jory-2027', title: 'Loto de Saint-Jory', town: 'Saint-Jory', date: '2027-03-20', label: 'samedi 20 mars 2027', venue: 'Foyer rural', missions: volunteerMissions,
    schedule: [
      { label: 'Début des besoins bénévoles', value: '17 h 30' },
      { label: 'Ouverture des portes', value: '19 h 30' },
      { label: 'Début du loto', value: '21 h' },
    ],
  },
] as const satisfies readonly VolunteerEvent[];

export const childCategories = ['Baby', 'U6', 'U8', 'U10', 'U12', 'U14'] as const;
export type PublicSlot = { id: string; event_id: string; title: string; capacity: number | null; registered: number; enabled?: boolean };
export const previewSlots: PublicSlot[] = volunteerEvents.flatMap(event => event.missions.map(mission => ({
  id: `${event.id}-${mission.id}`, event_id: event.id, title: mission.title, capacity: mission.capacity,
  registered: event.id === 'lespinasse-2026' && mission.id === 'encaissement' ? 1 : 0,
})));
