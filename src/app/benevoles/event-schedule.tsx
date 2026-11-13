import type { VolunteerEvent } from '@/lib/volunteers/events';

export function EventSchedule({ event }: { event: VolunteerEvent }) {
  return <dl className="space-y-3 border-y border-slate-100 py-5">
    {[
      ['Début des besoins bénévoles', event.setup],
      ['Ouverture des portes', event.doors],
      [event.startLabel, event.start],
    ].map(([label, time]) => <div key={label} className="flex items-start justify-between gap-4">
      <dt className="text-slate-600">{label}</dt><dd className="shrink-0 font-bold text-blue">{time}</dd>
    </div>)}
  </dl>;
}
