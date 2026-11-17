import 'server-only';
import { required, rpc } from './server';
import { volunteerEvents } from './events';
type Job = { id: string; kind: string; email: string; first_name: string; last_name: string; category: string; event_id: string; missions: string[]; lease: string };
export async function deliverMail() {
  await rpc('volunteer_queue_reminders');
  const jobs = await rpc<Job[]>('volunteer_claim_mail');
  let sent = 0, failed = 0;
  for (const job of jobs) {
    try {
      const event = volunteerEvents.find(e => e.id === job.event_id);
      if (!event) throw Error();
      const admin = job.kind === 'admin';
      const subject = job.kind === 'reminder' ? `Rappel : ${event.title} demain` : `Inscription bénévole — ${event.title}`;
      const schedule = event.schedule.map(item => `${item.label} : ${item.value}.`).join('\n');
      const text = `${admin ? 'Nouvelle inscription' : `Bonjour ${job.first_name},`}\n\n${job.kind === 'reminder' ? 'Votre rendez-vous de demain' : 'Inscription enregistrée'} : ${event.title}, ${event.label}, ${event.venue}.\n${schedule}\nMissions : ${job.missions.join(', ')}.\n${admin ? `Bénévole : ${job.first_name} ${job.last_name}\nE-mail : ${job.email}\nCatégorie : ${job.category}\n` : ''}\nPour toute modification : communication.edrnordtoulousain@gmail.com`;
      const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${required('RESEND_API_KEY')}`, 'Content-Type': 'application/json', 'Idempotency-Key': `volunteer-${job.id}` }, body: JSON.stringify({ from: required('VOLUNTEERS_EMAIL_FROM'), to: [admin ? 'communication.edrnordtoulousain@gmail.com' : job.email], reply_to: 'communication.edrnordtoulousain@gmail.com', subject, text }), signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw Error();
      await rpc('volunteer_finish_mail', { p_id: job.id, p_lease: job.lease, p_success: true }); sent++;
    } catch {
      // Never log provider payloads, addresses or job contents.
      await rpc('volunteer_finish_mail', { p_id: job.id, p_lease: job.lease, p_success: false }); failed++;
    }
  }
  return { sent, failed };
}
