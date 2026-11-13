import type { PublicSlot } from './events';

export type AvailabilitySnapshot = { slots: PublicSlot[]; countsLive: boolean; status: 'loading' | 'open' | 'closed' | 'error'; error?: 'network' | 'version' };

export function parseAvailability(value: unknown, eventId: string): AvailabilitySnapshot {
  if (!value || typeof value !== 'object') throw Error('Invalid availability');
  const data = value as Record<string, unknown>;
  if (typeof data.registrationOpen !== 'boolean' || typeof data.countsLive !== 'boolean' || !Array.isArray(data.slots)) throw Error('Invalid availability');
  for (const slot of data.slots) {
    if (!slot || typeof slot !== 'object' || typeof slot.id !== 'string' || typeof slot.event_id !== 'string' || typeof slot.title !== 'string' ||
      !(slot.capacity === null || (Number.isInteger(slot.capacity) && slot.capacity > 0)) || !Number.isInteger(slot.registered) || slot.registered < 0 ||
      (data.countsLive && typeof slot.enabled !== 'boolean')) throw Error('Invalid availability');
  }
  return { slots: data.slots.filter((slot: PublicSlot) => slot.event_id === eventId), countsLive: data.countsLive, status: data.registrationOpen && data.countsLive ? 'open' : 'closed' };
}
