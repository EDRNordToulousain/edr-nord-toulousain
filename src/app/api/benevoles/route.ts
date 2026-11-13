import { configured, registrationOpen, readAvailability } from '@/lib/volunteers/server';
import { previewSlots } from '@/lib/volunteers/events';
export const dynamic = 'force-dynamic';
export async function GET() {
  const headers = { 'Cache-Control': 'no-store', 'X-EDR-Release': process.env.VERCEL_GIT_COMMIT_SHA || 'local' };
  try {
    if (!configured()) return Response.json({ slots: previewSlots, registrationOpen: false, countsLive: false }, { headers });
    return Response.json({ slots: await readAvailability(), registrationOpen: registrationOpen(), countsLive: true }, { headers });
  } catch {
    return Response.json({ error: 'Les inscriptions sont temporairement indisponibles.' }, { status: 503, headers });
  }
}
