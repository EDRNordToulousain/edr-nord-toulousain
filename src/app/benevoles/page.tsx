import type { Metadata } from 'next';
import Link from 'next/link';
import { volunteerEvents } from '@/lib/volunteers/events';
import { EventSchedule } from './event-schedule';

export const metadata: Metadata = {
  title: 'Espace bénévoles', description: 'Rejoignez l’équipe des bénévoles de l’EDR Nord Toulousain.',
  alternates: { canonical: '/benevoles' },
};

export default function VolunteersPage() {
  return <>
    <section className="bg-night px-4 py-16 text-white"><div className="mx-auto max-w-6xl">
      <p className="font-bold uppercase tracking-widest text-red">Ensemble pour l’EDR</p>
      <h1 className="mt-4 text-4xl font-black sm:text-5xl">L’espace bénévoles</h1>
      <p className="mt-6 max-w-2xl text-lg text-white/85">Un peu de votre temps, beaucoup pour nos enfants. Rejoignez l’équipe des bénévoles de l’EDR Nord Toulousain.</p>
      <a href="#inscription" className="mt-8 inline-flex rounded-full bg-red px-6 py-3 font-bold">Choisir un événement</a>
    </div></section>
    {/* Preserve the existing /benevoles#inscription link at the event chooser. */}
    <section id="inscription" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12" aria-labelledby="events-title">
      <h2 id="events-title" className="text-3xl font-black text-night">Nos événements</h2>
      <p className="mt-3 text-slate-600">Choisissez un événement pour découvrir ses missions et proposer votre aide.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">{volunteerEvents.map(event => <article key={event.id} className="flex min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
        <p className="text-sm font-bold text-blue">{event.label}</p>
        <h3 className="mt-3 text-2xl font-black text-night">{event.title}</h3>
        <p className="mb-5 mt-3 text-slate-600">{event.venue}</p>
        <EventSchedule event={event} />
        <Link href={`/benevoles/${event.id}`} aria-label={`Voir les missions — ${event.title}`} className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-red px-5 py-3 text-center font-bold text-white transition hover:bg-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue">Voir les missions</Link>
      </article>)}</div>
    </section>
  </>;
}
