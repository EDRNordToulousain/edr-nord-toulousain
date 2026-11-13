import { createHmac } from 'node:crypto';
import { registrationOpen, required, rpc } from '@/lib/volunteers/server';
import { parseRegistration } from '@/lib/volunteers/validation';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'no-store' };
export async function POST(request: Request) {
  if (!registrationOpen()) return Response.json({ error: 'Les inscriptions ne sont pas encore disponibles.' }, { status: 503, headers });
  if (request.headers.get('origin') !== required('VOLUNTEERS_ORIGIN') || !request.headers.get('content-type')?.startsWith('application/json')) return new Response(null, { status: 403, headers });
  let data;
  try {
    // Bound the actual stream, including chunked requests.
    const reader = request.body?.getReader();
    if (!reader) throw Error();
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 8192) { await reader.cancel(); throw Error(); } chunks.push(value); }
    data = parseRegistration(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  } catch { return Response.json({ error: 'Vérifiez les champs et les missions sélectionnées.' }, { status: 400, headers }); }
  try {
    // Vercel overwrites x-vercel-forwarded-for. A shared bucket is deliberately
    // used outside Vercel rather than trusting a caller-controlled IP header.
    const ip = process.env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for') ?? 'shared' : 'shared';
    const result = await rpc<boolean>('volunteer_register', {
      p_first: data.firstName, p_last: data.lastName, p_email: data.email, p_category: data.category, p_slots: data.slots,
      p_bucket: createHmac('sha256', required('VOLUNTEERS_RATE_SALT')).update(ip).digest('hex'),
    });
    if (!result) return Response.json({ error: 'Inscription impossible : une mission est complète, déjà choisie ou la limite de demandes est atteinte. Actualisez les disponibilités ou contactez l’EDR.' }, { status: 409, headers });
    // The database transaction queues confirmations atomically. The authenticated
    // cron delivers them; an email outage never loses the saved registration.
    return Response.json({ message: 'Inscription enregistrée. Votre confirmation sera envoyée par e-mail.' }, { status: 201, headers });
  } catch { return Response.json({ error: 'Enregistrement indisponible. Veuillez réessayer plus tard.' }, { status: 503, headers }); }
}
