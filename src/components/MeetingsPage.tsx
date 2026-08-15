import { meetingMinutes, meetings } from "@/data/meetings";
import { Button, Card, Container, PageHero } from "./UI";

const meetingDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function meetingDateParts(date: string) {
  const parts = meetingDateFormatter.formatToParts(new Date(`${date}T12:00:00Z`));
  return {
    day: parts.find((part) => part.type === "day")?.value ?? "",
    month: parts.find((part) => part.type === "month")?.value ?? "",
    year: parts.find((part) => part.type === "year")?.value ?? "",
  };
}

export function MeetingsPage({ section }: { section?: "calendar" | "minutes" }) {
  if (!section) {
    return (
      <>
        <PageHero title="Réunions" text="Retrouvez les prochaines réunions de l’EDR et leurs comptes rendus." />
        <Container className="grid gap-6 py-16 md:grid-cols-2">
          <Card>
            <h2 className="text-3xl font-black text-night">Calendrier des réunions</h2>
            <p className="mt-4 text-slate-600">Les prochaines dates seront publiées ici.</p>
            <div className="mt-6"><Button href="/reunions/calendrier" variant="blue">Consulter le calendrier</Button></div>
          </Card>
          <Card>
            <h2 className="text-3xl font-black text-night">Comptes rendus de réunion</h2>
            <p className="mt-4 text-slate-600">Les documents seront disponibles à la consultation et au téléchargement.</p>
            <div className="mt-6"><Button href="/reunions/comptes-rendus">Voir les comptes rendus</Button></div>
          </Card>
        </Container>
      </>
    );
  }

  if (section === "calendar") {
    return (
      <>
        <PageHero title="Calendrier des réunions" text="Les rendez-vous de la saison 2026-2027, réunis dans une chronologie claire." />
        <Container className="py-16">
          <div className="mb-10 flex justify-center">
            <span className="rounded-full bg-gradient-to-r from-blue to-red px-5 py-2 text-sm font-black uppercase tracking-[.16em] text-white shadow-card">Saison 2026-2027</span>
          </div>
          {meetings.length ? (
            <ol className="relative mx-auto max-w-5xl space-y-7 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-blue before:to-red md:space-y-10 md:before:left-1/2 md:before:-translate-x-1/2">
              {meetings.map((meeting, index) => {
                const date = meetingDateParts(meeting.date);
                const alignLeft = index % 2 === 0;
                return (
                  <li key={meeting.date} className="relative grid items-center pl-14 md:grid-cols-[1fr_5rem_1fr] md:pl-0">
                    <span className={`absolute left-2.5 top-8 z-10 h-6 w-6 rounded-full border-4 border-white shadow-md md:static md:col-start-2 md:row-start-1 md:mx-auto ${meeting.featured ? "bg-red ring-4 ring-red/20" : "bg-blue ring-4 ring-blue/15"}`} aria-hidden="true" />
                    <article className={`overflow-hidden rounded-3xl border bg-white shadow-card ${meeting.featured ? "border-red/30 ring-4 ring-red/5" : "border-slate-200"} ${alignLeft ? "md:col-start-1 md:row-start-1" : "md:col-start-3 md:row-start-1"}`}>
                      <div className={`grid grid-cols-[5.5rem_1fr] ${meeting.featured ? "bg-gradient-to-br from-red to-coral" : "bg-gradient-to-br from-night to-blue"}`}>
                        <div className="grid place-items-center border-r border-white/20 px-3 py-5 text-center text-white">
                          <strong className="text-5xl font-black leading-none">{date.day}</strong>
                          <span className="mt-1 text-sm font-black uppercase tracking-wider">{date.month}</span>
                          <span className="mt-1 text-xs text-white/75">{date.year}</span>
                        </div>
                        <div className="flex min-w-0 flex-col justify-center px-5 py-6 text-white">
                          {meeting.featured && <span className="mb-2 w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider">Temps fort</span>}
                          <h2 className="text-2xl font-black leading-tight">{meeting.title}</h2>
                        </div>
                      </div>
                      <div className="p-5">
                        <time dateTime={meeting.date} className="font-bold capitalize text-night">{meetingDateFormatter.format(new Date(`${meeting.date}T12:00:00Z`))}</time>
                        <p className="mt-2 leading-7 text-slate-600">{meeting.information}</p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          ) : <Card><p className="text-lg font-bold text-night">Les prochaines dates de réunion seront communiquées prochainement.</p></Card>}
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHero title="Comptes rendus de réunion" text="Les comptes rendus seront ajoutés prochainement." />
      <Container className="py-16">
        {meetingMinutes.length ? <div className="grid gap-6 md:grid-cols-2">{meetingMinutes.map((document) => (
          <Card key={document.path}>
            <p className="text-sm font-black uppercase tracking-wider text-red">{document.date}</p>
            <h2 className="mt-2 text-2xl font-black text-night">{document.title}</h2>
            <p className="mt-3 text-slate-600">{document.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={document.path} target="_blank" rel="noopener noreferrer" className="rounded-full bg-blue px-5 py-3 font-bold text-white">Consulter</a>
              <a href={document.path} download className="rounded-full border-2 border-blue px-5 py-3 font-bold text-blue">Télécharger</a>
            </div>
          </Card>
        ))}</div> : <Card><p className="text-lg font-bold text-night">Les comptes rendus seront ajoutés prochainement.</p></Card>}
      </Container>
    </>
  );
}
