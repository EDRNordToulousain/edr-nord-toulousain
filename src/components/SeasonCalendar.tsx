import { seasonEvents, seasonMonths, type CalendarEvent, type CalendarKind } from "@/data/calendar";

const weekdays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeZone: "UTC" });

function monthCells(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
}

function groupByDate(events: readonly CalendarEvent[]) {
  return events.reduce<Map<string, CalendarEvent[]>>((groups, event) => {
    const current = groups.get(event.date) ?? [];
    current.push(event);
    groups.set(event.date, current);
    return groups;
  }, new Map());
}

function EventLines({ events }: { events: readonly CalendarEvent[] }) {
  return (
    <div className="mt-2 divide-y divide-white/20 overflow-hidden rounded-xl bg-blue text-white shadow-sm">
      {events.map((event) => (
        <div key={`${event.date}-${event.category}`} className="px-2 py-2 text-xs leading-tight">
          <p className="flex flex-wrap items-baseline gap-x-1">
            <strong className="rounded-md bg-white/15 px-1.5 py-1 text-[.7rem] tracking-wide">{event.category}</strong>
            <span className="font-semibold text-white/90">Lieu : {event.location.toLocaleLowerCase("fr-FR")}</span>
          </p>
          {event.time && <p className="mt-1 text-white/80">{event.time}</p>}
          {event.details && <p className="mt-1 text-white/80">{event.details}</p>}
        </div>
      ))}
    </div>
  );
}

export function SeasonCalendar({ type }: { type: CalendarKind }) {
  const events = seasonEvents[type];
  const eventsByDate = groupByDate(events);
  const emptyMessage = "Le calendrier est en attente des dates et des lieux officiels. Les informations seront communiquées dans les plus brefs délais.";

  return (
    <div className="space-y-10">
      {events.length === 0 && <p className="rounded-3xl border border-blue/20 bg-blue/5 p-6 text-lg font-bold leading-8 text-night">{emptyMessage}</p>}
      {seasonMonths.map(({ year, month }) => {
        const monthKey = `${year}-${String(month).padStart(2, "0")}`;
        const monthDates = [...eventsByDate.entries()].filter(([date]) => date.startsWith(monthKey));

        return (
          <section key={monthKey} aria-labelledby={`month-${monthKey}`} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
            <h2 id={`month-${monthKey}`} className="text-2xl font-black capitalize text-night">{monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)))}</h2>
            <div className="mt-5 hidden md:block">
              <div className="calendar-week grid gap-1" aria-hidden="true">
                {weekdays.map((day, index) => <div key={day} className={`p-2 text-center text-xs font-black uppercase tracking-wide ${index === 5 ? "rounded-t-xl bg-red text-white" : "text-slate-500"}`}>{day}</div>)}
              </div>
              <div className="calendar-week mt-1 grid items-stretch gap-1">
                {monthCells(year, month).map((day, index) => {
                  const date = day ? `${monthKey}-${String(day).padStart(2, "0")}` : "";
                  const dayEvents = eventsByDate.get(date) ?? [];
                  const saturday = index % 7 === 5;
                  const busySaturday = saturday && dayEvents.length >= 4;

                  return (
                    <div key={`${monthKey}-${index}`} className={`min-h-28 rounded-xl border p-2 ${saturday ? "min-h-40 border-red/30 bg-red/5" : "border-slate-200 bg-mist/50"} ${busySaturday ? "min-h-64" : ""}`}>
                      {day && <><span className={`text-sm font-black ${saturday ? "text-red" : "text-night"}`}>{day}</span>{dayEvents.length > 0 && <EventLines events={dayEvents} />}</>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-5 md:hidden">
              {monthDates.length ? (
                <ol className="space-y-3">
                  {monthDates.map(([date, dateEvents]) => (
                    <li key={date} className="overflow-hidden rounded-2xl border border-slate-200 bg-mist shadow-sm">
                      <time dateTime={date} className="block bg-night px-4 py-3 font-black capitalize text-white">{dateFormatter.format(new Date(`${date}T12:00:00Z`))}</time>
                      <div className="divide-y divide-slate-200">
                        {dateEvents.map((event) => (
                          <div key={`${date}-${event.category}`} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-4 py-3">
                            <strong className="rounded-full bg-blue px-3 py-1 text-sm text-white">{event.category}</strong>
                            <span className="text-sm font-semibold text-slate-700">Lieu : {event.location.toLocaleLowerCase("fr-FR")}</span>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : <p className="rounded-2xl bg-mist p-4 text-sm text-slate-600">Aucun rendez-vous officiel enregistré pour ce mois.</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
