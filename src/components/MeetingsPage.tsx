import { meetingMinutes, meetings } from "@/data/meetings";
import { Button, Card, Container, InfoGrid, PageHero } from "./UI";

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
        <PageHero title="Calendrier des réunions" text="Les prochaines dates de réunion seront communiquées prochainement." />
        <Container className="py-16">
          {meetings.length ? meetings.map((meeting) => (
            <Card key={`${meeting.date}-${meeting.kind}`} className="mb-5">
              <InfoGrid items={[
                ["Date", meeting.date],
                ["Heure", meeting.time],
                ["Lieu", meeting.venue],
                ["Type de réunion", meeting.kind],
                ["Personnes concernées", meeting.audience],
              ]} />
              {meeting.agenda && <p className="mt-5 text-slate-600"><strong>Ordre du jour :</strong> {meeting.agenda}</p>}
            </Card>
          )) : <Card><p className="text-lg font-bold text-night">Les prochaines dates de réunion seront communiquées prochainement.</p></Card>}
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
