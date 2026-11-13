import { authorized, registrationOpen } from '@/lib/volunteers/server';
import { deliverMail } from '@/lib/volunteers/mail';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!authorized(request.headers.get('authorization'))) return new Response(null, { status: 401, headers });
  if (!registrationOpen()) return Response.json({ error: 'Les inscriptions et les envois sont désactivés.' }, { status: 503, headers });
  try { return Response.json(await deliverMail(), { headers }); }
  catch { return Response.json({ error: 'Traitement indisponible' }, { status: 503, headers }); }
}
