import { childCategories } from './events';
export function parseRegistration(value: unknown) {
  if (!value || typeof value !== 'object') throw Error('invalid');
  const v = value as Record<string, unknown>;
  const text = (key: string, max: number) => {
    if (typeof v[key] !== 'string') throw Error('invalid');
    const s = v[key].trim();
    if (!s || s.length > max || /[\u0000-\u001f\u007f]/u.test(s)) throw Error('invalid');
    return s;
  };
  const firstName = text('firstName', 80), lastName = text('lastName', 80);
  const email = text('email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('invalid');
  const category = text('category', 4);
  if (!(childCategories as readonly string[]).includes(category) || v.consent !== true || v.website) throw Error('invalid');
  if (!Array.isArray(v.slots) || !v.slots.length || v.slots.length > 30 || v.slots.some(s => typeof s !== 'string' || !/^[a-z0-9-]{1,80}$/.test(s))) throw Error('invalid');
  return { firstName, lastName, email, category, slots: [...new Set(v.slots as string[])] };
}
