export type VolunteerMission = { id: string; title: string; capacity: number | null };
export type VolunteerEvent = {
  id: string; title: string; town: string; date: string; label: string; venue: string;
  setup: string; doors: string; start: string; startLabel: string;
  missions: readonly VolunteerMission[];
};

// Confirmed unlimited missions use null; finite missions always have a positive capacity.
export const volunteerMissions = [
  { id: 'installation', title: 'Installation des tables, chaises et de la buvette', capacity: null },
  { id: 'encaissement', title: 'Encaissement', capacity: 4 },
  { id: 'buvette', title: 'Tenue de la buvette', capacity: 3 },
  { id: 'controle-cartons', title: 'Contrôle des cartons', capacity: 2 },
  { id: 'annonce-numeros', title: 'Annonce des numéros', capacity: 1 },
  { id: 'distribution-numeros', title: 'Distribution des numéros', capacity: 1 },
  { id: 'rangement-tables', title: 'Rangement des tables et chaises', capacity: null },
  { id: 'balayage', title: 'Balayage', capacity: null },
  { id: 'rangement-buvette', title: 'Rangement de la buvette', capacity: null },
] as const;

// A new catalogue entry creates its card and route; storage uses a matching migration.
export const volunteerEvents = [
  { id: 'lespinasse-2026', title: 'Loto de Lespinasse', town: 'Lespinasse', date: '2026-11-21', label: 'samedi 21 novembre 2026', venue: 'Salle du Canal des Deux Mers', setup: '17 h 30', doors: '19 h 30', start: '21 h', startLabel: 'Début du loto', missions: volunteerMissions },
  { id: 'bruguieres-2027', title: 'Loto de Bruguières', town: 'Bruguières', date: '2027-01-24', label: 'dimanche 24 janvier 2027', venue: 'Salle Xeraco', setup: '11 h', doors: '13 h', start: '15 h', startLabel: 'Début du loto', missions: volunteerMissions },
  { id: 'saint-jory-2027', title: 'Loto de Saint-Jory', town: 'Saint-Jory', date: '2027-03-20', label: 'samedi 20 mars 2027', venue: 'Foyer rural', setup: '17 h 30', doors: '19 h 30', start: '21 h', startLabel: 'Début du loto', missions: volunteerMissions },
] as const satisfies readonly VolunteerEvent[];

export const childCategories = ['Baby', 'U6', 'U8', 'U10', 'U12', 'U14'] as const;
export type PublicSlot = { id: string; event_id: string; title: string; capacity: number | null; registered: number };
export const previewSlots: PublicSlot[] = volunteerEvents.flatMap(event => event.missions.map(mission => ({
  id: `${event.id}-${mission.id}`, event_id: event.id, title: mission.title, capacity: mission.capacity,
  registered: event.id === 'lespinasse-2026' && mission.id === 'encaissement' ? 1 : 0,
})));
