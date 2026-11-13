'use client';
import { useEffect, useState } from 'react';
import { childCategories, volunteerEvents, volunteerMissions, previewSlots, type PublicSlot } from '@/lib/volunteers/events';
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
export function Volunteers() {
  const [slots, setSlots] = useState<PublicSlot[]>(previewSlots);
  const [countsLive, setCountsLive] = useState(false);
  const [available, setAvailable] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [install, setInstall] = useState<InstallPrompt | null>(null);
  useEffect(() => {
    let active = true;
    fetch('/api/benevoles', { cache: 'no-store' }).then(async r => { if (!r.ok) throw Error(); return r.json(); })
      .then(data => { if (active) { setSlots(data.slots); setCountsLive(data.countsLive === true); setAvailable(data.registrationOpen === true); } }).catch(() => { if (active) { setAvailable(false); setCountsLive(false); } });
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/benevoles/sw.js', { scope: '/benevoles' }).catch(() => {});
    const listener = (event: Event) => { event.preventDefault(); setInstall(event as InstallPrompt); };
    window.addEventListener('beforeinstallprompt', listener);
    return () => { active = false; window.removeEventListener('beforeinstallprompt', listener); };
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available) return;
    setBusy(true); setMessage('');
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch('/api/benevoles/inscriptions', { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName: data.get('firstName'), lastName: data.get('lastName'), email: data.get('email'), category: data.get('category'), website: data.get('website'), consent: data.get('consent') === 'on', slots: selected }) });
      const result = await response.json();
      setMessage(response.ok ? result.message : result.error);
      if (response.ok) { form.reset(); setSelected([]); }
      const refresh = await fetch('/api/benevoles', { cache: 'no-store' });
      if (refresh.ok) { const data = await refresh.json(); setSlots(data.slots); setAvailable(data.registrationOpen === true); setCountsLive(data.countsLive === true); }
    } catch { setMessage('Connexion interrompue. En cas de doute, contactez l’EDR avant de renouveler votre inscription.'); }
    finally { setBusy(false); }
  }
  const input = 'mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-ink focus:outline-blue';
  return <>
    <section className="bg-night px-4 py-16 text-white"><div className="mx-auto max-w-6xl">
      <p className="font-bold uppercase tracking-widest text-red">Ensemble pour l’EDR</p>
      <h1 className="mt-4 text-4xl font-black sm:text-5xl">L’espace bénévoles</h1>
      <p className="mt-6 max-w-2xl text-lg text-white/85">Un peu de votre temps, beaucoup pour nos enfants. Rejoignez l’équipe des bénévoles pour les trois lotos de l’EDR Nord Toulousain.</p>
      <a href="#inscription" className="mt-8 inline-flex rounded-full bg-red px-6 py-3 font-bold">Choisir mes missions</a>
    </div></section>
    <div className="mx-auto max-w-6xl px-4 py-12">
      <form onSubmit={submit} id="inscription">
        <h2 className="text-3xl font-black text-night">Trois rendez-vous pour se retrouver</h2>
        <p className="mt-3 text-slate-600">Cochez une ou plusieurs missions, sur un ou plusieurs lotos.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">{volunteerEvents.map(e => <fieldset key={e.id} className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <legend className="rounded-full bg-blue px-4 py-2 font-black text-white">{e.town}</legend>
          <p className="mt-3 text-xl font-black text-night">{e.label}</p><p className="mt-1 text-slate-600">{e.venue}</p>
          <dl className="my-5 space-y-2 border-y border-slate-100 py-4">{[['Installation',e.setup],['Ouverture des portes',e.doors],['Loto',e.loto]].map(([label,time]) => <div key={label} className="flex justify-between gap-3"><dt>{label}</dt><dd className="font-bold text-blue">{time}</dd></div>)}</dl>
          {slots.filter(s => s.event_id === e.id).sort((a,b) => volunteerMissions.findIndex(m => a.id === `${a.event_id}-${m.id}`) - volunteerMissions.findIndex(m => b.id === `${b.event_id}-${m.id}`)).map(s => <label key={s.id} className="mt-3 flex cursor-pointer gap-3 rounded-xl bg-mist p-4">
            <input type="checkbox" className="mt-1 h-5 w-5 accent-blue" disabled={busy || (s.capacity !== null && s.registered >= s.capacity)} checked={selected.includes(s.id)} onChange={ev => setSelected(current => ev.target.checked ? [...current,s.id] : current.filter(id => id !== s.id))} />
            <span><span className="block font-bold text-night">{s.title}</span><span className="text-sm text-slate-600">{s.capacity === null ? `${countsLive ? `${s.registered} inscrits · ` : ''}Sans limite de bénévoles` : `${countsLive ? '' : 'À l’ouverture : '}${s.registered} / ${s.capacity} places prises · ${Math.max(0,s.capacity-s.registered)} places restantes${!countsLive && s.registered > 0 ? ' (réservation existante)' : ''}`}</span></span>
          </label>)}
          {!slots.some(s => s.event_id === e.id) && <p className="text-sm text-slate-600">Les missions seront disponibles à l’ouverture des inscriptions.</p>}
          {e.id === 'lespinasse-2026' && !slots.some(s => s.id === 'lespinasse-2026-encaissement') && <p className="mt-3 rounded-xl bg-mist p-4 text-sm"><strong>Encaissement :</strong> 1 place réservée, 3 places à prendre à l’ouverture.</p>}
        </fieldset>)}</div>
        <div className="mt-10 rounded-3xl bg-mist p-6 sm:p-8"><h2 className="text-2xl font-black text-night">Votre inscription</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="font-bold">Nom<input className={input} name="lastName" autoComplete="family-name" maxLength={80} required /></label>
            <label className="font-bold">Prénom<input className={input} name="firstName" autoComplete="given-name" maxLength={80} required /></label>
            <label className="font-bold">E-mail<input className={input} name="email" type="email" autoComplete="email" maxLength={254} required /></label>
            <label className="font-bold">Catégorie de l’enfant<select className={input} name="category" required defaultValue=""><option value="" disabled>Choisir une catégorie</option>{childCategories.map(c => <option key={c}>{c}</option>)}</select></label>
          </div>
          <div hidden aria-hidden="true"><label>Site web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="mt-6 flex items-start gap-3 text-sm"><input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-blue" /><span>J’accepte l’utilisation de ces informations pour la gestion de mon bénévolat. Pour consulter, corriger ou supprimer mes données : communication.edrnordtoulousain@gmail.com.</span></label>
          <button disabled={!available || !selected.length || busy} className="mt-6 rounded-full bg-red px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Enregistrement…' : 'Confirmer mon inscription'}</button>
          {!available && <p className="mt-4 text-sm text-slate-600">Les inscriptions ne sont pas encore ouvertes. Merci de revenir prochainement.</p>}
          <p role="status" aria-live="polite" className="mt-4 font-semibold text-night">{message}</p>
        </div>
      </form>
      <aside className="mt-8 rounded-2xl border border-blue/20 p-6"><h2 className="font-black text-night">L’espace bénévoles à portée de main</h2><p className="mt-2 text-sm text-slate-600">L’ajout à l’écran d’accueil est facultatif. Une connexion est nécessaire pour consulter les disponibilités et s’inscrire. Sur iPhone : Partager, puis « Sur l’écran d’accueil ».</p>{install && <button type="button" className="mt-4 rounded-full bg-blue px-5 py-3 font-bold text-white" onClick={async () => { await install.prompt(); await install.userChoice; setInstall(null); }}>Ajouter à mon écran d’accueil</button>}</aside>
    </div>
  </>;
}
