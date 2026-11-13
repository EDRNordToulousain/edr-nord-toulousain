import { configured, registrationOpen, rpc } from '@/lib/volunteers/server';
import { previewSlots, type PublicSlot } from '@/lib/volunteers/events';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    if (!configured()) return Response.json({ slots: previewSlots, registrationOpen: false, countsLive: false }, { headers: { 'Cache-Control': 'no-store' } });
    return Response.json({ slots: await rpc<PublicSlot[]>('volunteer_counts'), registrationOpen: registrationOpen(), countsLive: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Les inscriptions sont temporairement indisponibles.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
