'use client';
import Link from 'next/link';
import { availabilityLabel, missionIsFull } from '@/lib/volunteers/availability';
import { EventSchedule } from './event-schedule';
import { useState } from 'react';
import { useAvailability } from './use-availability';
import { childCategories, type VolunteerEvent } from '@/lib/volunteers/events';
export function Volunteers({ event: e }: { event: VolunteerEvent }) {
  const { slots, countsLive, status, error, refresh } = useAvailability(e.id);
  const available = status === 'open';
  const [selected, setSelected] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const eligible = selected.filter(id => slots.some(slot => slot.id === id && slot.enabled === true && !missionIsFull(slot)));
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || busy || !consent || !eligible.length) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setBusy(true); setMessage('');
    try {
      // Check the current API state before posting; never rely on an old tab's flag.
      const current = await refresh();
      if (!current || current.status !== 'open') return;
      const selectedNow = eligible.filter(id => current.slots.some(slot => slot.id === id && slot.enabled === true && !missionIsFull(slot)));
      if (selectedNow.length !== selected.length) {
        setSelected(selectedNow);
        setMessage('Les disponibilités ont changé. Vérifiez vos missions avant de confirmer.');
        return;
      }
      const response = await fetch('/api/benevoles/inscriptions', { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName: data.get('firstName'), lastName: data.get('lastName'), email: data.get('email'), category: data.get('category'), website: data.get('website'), consent: data.get('consent') === 'on', slots: selectedNow }) });
      const result = await response.json();
      setMessage(response.ok ? result.message : result.error);
      if (response.ok) { form.reset(); setSelected([]); setConsent(false); }
      await refresh();
    } catch { setMessage('Connexion interrompue. En cas de doute, contactez l’EDR avant de renouveler votre inscription.'); }
    finally { setBusy(false); }
  }
  const input = 'mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-ink focus:outline-blue';
  return <>
    <section className="bg-night px-4 py-8 sm:py-10 text-white"><div className="mx-auto max-w-6xl">
      <Link href="/benevoles" className="inline-block rounded-lg py-2 font-semibold text-white/85 underline underline-offset-4">← Tous les événements</Link>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">{e.title}</h1>
      <p className="mt-3 text-lg text-white/85">{e.label} · {e.venue}</p>
    </div></section>
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"><EventSchedule event={e} /></div>
      <form onSubmit={submit} id="inscription" data-registration-state={status} aria-busy={status === 'loading' || busy}>
        <fieldset>
          <legend className="text-2xl font-black text-night">Choisissez vos missions</legend>
          <p className="mt-3 text-slate-600">Cochez une ou plusieurs missions pour cet événement, puis validez votre inscription une seule fois.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {slots.slice().sort((a,b) => e.missions.findIndex(m => a.id === `${a.event_id}-${m.id}`) - e.missions.findIndex(m => b.id === `${b.event_id}-${m.id}`)).map(s => <label key={s.id} data-mission-id={s.id} className="flex min-w-0 cursor-pointer items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue/50 focus-within:ring-2 focus-within:ring-blue">
            <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-blue" disabled={busy || (countsLive && s.enabled !== true) || missionIsFull(s)} checked={selected.includes(s.id)} onChange={ev => setSelected(current => ev.target.checked ? [...current,s.id] : current.filter(id => id !== s.id))} />
            <span aria-hidden="true" className="shrink-0 text-xl">{e.missions.find(m => s.id === `${e.id}-${m.id}`)?.icon ?? '🤝'}</span>
            <span className="min-w-0"><span className="block text-lg font-bold leading-snug text-night">{s.title}</span><span className="mt-1 block text-base leading-snug text-slate-600">{availabilityLabel(s, countsLive)}</span></span>
          </label>)}
          {!slots.some(s => s.event_id === e.id) && <p className="text-sm text-slate-600">Les missions seront disponibles à l’ouverture des inscriptions.</p>}
          {e.id === 'lespinasse-2026' && !slots.some(s => s.id === 'lespinasse-2026-encaissement') && <p className="mt-3 rounded-xl bg-mist p-4 text-sm"><strong>Encaissement :</strong> 1 place réservée, 3 places à prendre à l’ouverture.</p>}
          </div>
        </fieldset>
        <div className="mt-6 rounded-2xl bg-mist p-4 sm:p-5"><h2 className="text-2xl font-black text-night">Votre inscription</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="font-bold">Nom<input className={input} name="lastName" autoComplete="family-name" maxLength={80} required /></label>
            <label className="font-bold">Prénom<input className={input} name="firstName" autoComplete="given-name" maxLength={80} required /></label>
            <label className="font-bold">E-mail<input className={input} name="email" type="email" autoComplete="email" maxLength={254} required /></label>
            <label className="font-bold">Catégorie de l’enfant<select className={input} name="category" required defaultValue=""><option value="" disabled>Choisir une catégorie</option>{childCategories.map(c => <option key={c}>{c}</option>)}</select></label>
          </div>
          <div hidden aria-hidden="true"><label>Site web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="mt-6 flex items-start gap-3 text-sm"><input type="checkbox" name="consent" checked={consent} onChange={event => setConsent(event.target.checked)} required className="mt-1 h-4 w-4 accent-blue" /><span>J’accepte l’utilisation de ces informations pour la gestion de mon bénévolat. Pour consulter, corriger ou supprimer mes données : communication.edrnordtoulousain@gmail.com.</span></label>
          <button disabled={!available || !eligible.length || !consent || busy} className="mt-6 rounded-full bg-red px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Enregistrement…' : 'Confirmer mon inscription'}</button>
          {status === 'loading' && <p className="mt-4 text-sm text-slate-600" role="status">Vérification des inscriptions…</p>}
          {status === 'closed' && <p className="mt-4 text-sm text-slate-600">Les inscriptions ne sont pas encore ouvertes. Merci de revenir prochainement.</p>}
          {status === 'error' && <div className="mt-4 text-slate-600" role="alert">
            <p>{error === 'version' ? 'Le site a été mis à jour. Actualisez cette page pour vous inscrire.' : 'Impossible de vérifier les inscriptions pour le moment. Veuillez réessayer.'}</p>
            <button type="button" onClick={() => error === 'version' ? window.location.reload() : void refresh()} className="mt-2 font-bold text-blue underline underline-offset-4">{error === 'version' ? 'Actualiser la page' : 'Réessayer'}</button>
          </div>}
          <Link href="/benevoles" className="mt-5 block w-fit font-bold text-blue underline underline-offset-4">Voir les autres événements</Link>
          <p role="status" aria-live="polite" className="mt-4 font-semibold text-night">{message}</p>
        </div>
      </form>

    </div>
  </>;
}
