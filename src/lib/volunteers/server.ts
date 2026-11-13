import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';
export function required(name: string) {
  const value = process.env[name];
  if (!value) throw Error('Service non configuré');
  return value;
}
export function configured() {
  return ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'VOLUNTEERS_EMAIL_FROM', 'CRON_SECRET', 'VOLUNTEERS_ORIGIN', 'VOLUNTEERS_RATE_SALT'].every(n => !!process.env[n]);
}
// Only set this server flag after the EDR has approved the integrated page.
export function registrationOpen() {
  return process.env.VOLUNTEERS_REGISTRATION_ENABLED === 'true' && configured();
}
export async function rpc<T>(name: string, args: object = {}): Promise<T> {
  const key = required('SUPABASE_SERVICE_ROLE_KEY');
  const response = await fetch(`${required('SUPABASE_URL')}/rest/v1/rpc/${name}`, {
    method: 'POST', cache: 'no-store', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(args), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw Error('Stockage indisponible');
  return response.json();
}
export function authorized(header: string | null) {
  const expected = process.env.CRON_SECRET;
  if (!expected || !header) return false;
  const a = createHash('sha256').update(header).digest();
  const b = createHash('sha256').update(`Bearer ${expected}`).digest();
  return timingSafeEqual(a, b);
}
