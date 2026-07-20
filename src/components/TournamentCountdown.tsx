"use client";

import { useEffect, useState } from "react";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(target: string): Remaining | null {
  const distance = new Date(target).getTime() - Date.now();
  if (distance <= 0) return null;
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export function TournamentCountdown({ target }: { target: string }) {
  const [remaining, setRemaining] = useState<Remaining | null | undefined>(undefined);

  useEffect(() => {
    const update = () => setRemaining(getRemaining(target));
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, [target]);

  if (remaining === undefined) {
    return <div className="min-h-32 rounded-3xl bg-night p-6 text-center text-white" aria-label="Chargement du compte à rebours">Chargement du compte à rebours…</div>;
  }

  if (remaining === null) {
    return <p className="rounded-3xl bg-red p-7 text-center text-xl font-black text-white" role="status">Le tournoi de l’EDR Nord Toulousain a lieu aujourd’hui !</p>;
  }

  const units = [[remaining.days, "Jours"], [remaining.hours, "Heures"], [remaining.minutes, "Minutes"], [remaining.seconds, "Secondes"]] as const;
  return (
    <section aria-label="Compte à rebours avant le tournoi" aria-live="polite" className="rounded-3xl bg-night p-5 text-white shadow-card sm:p-8">
      <p className="text-center text-sm font-black uppercase tracking-[.18em] text-coral">Le rendez-vous approche</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {units.map(([value, label]) => <div key={label} className="rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/15"><strong className="block text-3xl font-black tabular-nums sm:text-5xl">{value}</strong><span className="mt-1 block text-xs font-bold uppercase tracking-wide text-white/70">{label}</span></div>)}
      </div>
    </section>
  );
}
