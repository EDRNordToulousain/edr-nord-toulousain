import { seasonEvents, seasonMonths, type CalendarEvent, type CalendarKind } from "@/data/calendar";

const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const formatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });

function monthCells(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
}

function EventBadge({ event }: { event: CalendarEvent }) {
  return <div className="mt-2 rounded-xl bg-blue p-2 text-xs text-white"><strong className="block">{event.category} · {event.title}</strong><span className="block text-white/80">{event.commune} · {event.venue} · {event.time}</span>{event.details && <span className="mt-1 block text-white/80">{event.details}</span>}{event.directionsUrl && <a href={event.directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-bold underline">Ouvrir l’itinéraire<span className="sr-only"> (nouvel onglet)</span></a>}</div>;
}

export function SeasonCalendar({ type }: { type: CalendarKind }) {
  const events = seasonEvents[type];
  const emptyMessage = "Le calendrier est en attente des dates et des lieux officiels. Les informations seront communiquées dans les plus brefs délais.";

  return (
    <div className="space-y-10">
      {events.length === 0 && <p className="rounded-3xl border border-blue/20 bg-blue/5 p-6 text-lg font-bold leading-8 text-night">{emptyMessage}</p>}
      {seasonMonths.map(({ year, month }) => {
        const monthKey = `${year}-${String(month).padStart(2, "0")}`;
        const monthEvents = events.filter((event) => event.date.startsWith(monthKey));
        return <section key={monthKey} aria-labelledby={`month-${monthKey}`} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
          <h2 id={`month-${monthKey}`} className="text-2xl font-black capitalize text-night">{formatter.format(new Date(Date.UTC(year, month - 1, 1)))}</h2>
          <div className="mt-5 hidden md:block">
            <div className="calendar-week grid gap-1" aria-hidden="true">{weekdays.map((day, index) => <div key={day} className={`p-2 text-center text-xs font-black uppercase tracking-wide ${index === 5 ? "rounded-t-xl bg-red text-white" : "text-slate-500"}`}>{day}</div>)}</div>
            <div className="calendar-week mt-1 grid gap-1">
              {monthCells(year, month).map((day, index) => {
                const date = day ? `${monthKey}-${String(day).padStart(2, "0")}` : "";
                const dayEvents = events.filter((event) => event.date === date);
                const saturday = index % 7 === 5;
                return <div key={`${monthKey}-${index}`} className={`min-h-28 rounded-xl border p-2 ${saturday ? "min-h-40 border-red/30 bg-red/5" : "border-slate-200 bg-mist/50"}`}>{day && <><span className={`text-sm font-black ${saturday ? "text-red" : "text-night"}`}>{day}</span>{dayEvents.map((event) => <EventBadge key={`${event.date}-${event.title}`} event={event} />)}</>}</div>;
              })}
            </div>
          </div>
          <div className="mt-5 md:hidden">
            {monthEvents.length ? <ol className="space-y-3">{monthEvents.map((event) => <li key={`${event.date}-${event.title}`} className="rounded-2xl bg-mist p-4"><time dateTime={event.date} className="font-black text-red">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${event.date}T12:00:00Z`))}</time><h3 className="mt-2 font-black text-night">{event.category} · {event.title}</h3><p className="mt-1 text-sm text-slate-600">{event.commune} · {event.venue} · {event.time}</p>{event.details && <p className="mt-2 text-sm text-slate-600">{event.details}</p>}{event.directionsUrl && <a href={event.directionsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center font-bold text-blue underline">Ouvrir l’itinéraire<span className="sr-only"> (nouvel onglet)</span></a>}</li>)}</ol> : <p className="rounded-2xl bg-mist p-4 text-sm text-slate-600">Aucun rendez-vous officiel enregistré pour ce mois.</p>}
          </div>
        </section>;
      })}
    </div>
  );
}
