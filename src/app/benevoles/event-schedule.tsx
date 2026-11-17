import type { VolunteerEvent } from '@/lib/volunteers/events';

export function EventSchedule({ event }: { event: VolunteerEvent }) {
  return <dl className="space-y-2 border-y border-slate-100 py-3">
    {event.schedule.map(({ label, value }) => <div key={label} className="flex items-start justify-between gap-4">
      <dt className="text-slate-600">{label}</dt><dd className="shrink-0 text-right font-bold text-blue">{value}</dd>
    </div>)}
  </dl>;
}
