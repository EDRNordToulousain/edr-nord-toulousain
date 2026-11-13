import type { PublicSlot } from './events';

export function missionIsFull(slot: PublicSlot) {
  return slot.capacity !== null && slot.registered >= slot.capacity;
}

export function availabilityLabel(slot: PublicSlot, live: boolean) {
  if (live && slot.enabled !== true) return 'Inscriptions fermées pour cette mission';
  if (slot.capacity === null) {
    return `${live ? `${slot.registered} ${slot.registered === 1 ? 'inscrit' : 'inscrits'} · ` : ''}Sans limite de bénévoles`;
  }
  const remaining = Math.max(0, slot.capacity - slot.registered);
  return `${live ? '' : 'À l’ouverture : '}${slot.registered} / ${slot.capacity} places prises · ${remaining} ${remaining === 1 ? 'place restante' : 'places restantes'}${!live && slot.registered > 0 ? ' (réservation existante)' : ''}`;
}
