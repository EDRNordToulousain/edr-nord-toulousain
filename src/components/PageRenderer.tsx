import Link from "next/link";
import { categories, events, site, tournament2027 } from "@/data/site-content";
import { ImageWithFallback } from "./ImageWithFallback";
import { Button, Card, Container, InfoGrid, PageHero, SectionTitle } from "./UI";
import { PresentationDetails } from "./PresentationDetails";
import { PartnerPage } from "./PartnerPage";
import { NewsPage } from "./NewsPage";
import { SeasonCalendar as MonthlySeasonCalendar } from "./SeasonCalendar";
import { TournamentCountdown } from "./TournamentCountdown";
import { EducatorGrid } from "./EducatorGrid";
import { GalleryPage } from "./GalleryPage";
import { MeetingsPage } from "./MeetingsPage";
import { SocialLinks } from "./SocialLinks";

const presentationParagraphs = [
  "Bienvenue à l’École de Rugby Nord Toulousain, un lieu d’apprentissage, de partage et de passion où chaque enfant peut découvrir le rugby, progresser à son rythme et grandir au sein d’un collectif.",
  "Du Baby Rugby aux U14, notre école accompagne les jeunes joueuses et joueurs dans un cadre bienveillant, structuré et convivial. Chaque séance est pensée pour leur permettre d’apprendre les bases du rugby, de développer leurs capacités et surtout de prendre plaisir à jouer ensemble.",
  "Au-delà du terrain, nous transmettons les valeurs qui font la force du rugby : le respect, la solidarité, l’engagement, le courage et l’esprit d’équipe.",
  "Grâce à l’investissement de nos éducateurs, de nos bénévoles, des familles, des communes partenaires et des entreprises locales, l’EDR Nord Toulousain fait vivre une aventure humaine qui rassemble tout un territoire.",
  "Notre ambition est simple : donner à chaque enfant le plaisir de jouer, l’envie d’apprendre et la fierté de porter les couleurs de l’EDR Nord Toulousain.",
];

function Presentation() {
  return <><PageHero title="Bienvenue à l’EDR Nord Toulousain" text="Un lieu d’apprentissage, de partage et de passion." /><Container className="py-16"><div className="mx-auto max-w-4xl space-y-5 text-lg leading-8 text-slate-700">{presentationParagraphs.map((p) => <p key={p}>{p}</p>)}</div><div className="mt-14 grid gap-5 md:grid-cols-3">{[
    ["Notre mission", "Faire découvrir le rugby dans un environnement accueillant, éducatif et adapté à chaque âge."],
    ["Notre engagement", "Accompagner chaque enfant dans sa progression sportive et humaine, dans le respect de son rythme et de sa personnalité."],
    ["Notre force", "Une équipe d’éducateurs, de bénévoles, de familles et de partenaires réunis autour d’une passion commune."],
  ].map(([title, text]) => <Card key={title}><h2 className="text-2xl font-black text-night">{title}</h2><p className="mt-4 leading-7 text-slate-600">{text}</p></Card>)}</div><ImageWithFallback src="/images/presentation-groupe.jpg" alt="Photo de groupe de l’EDR Nord Toulousain" placeholder="PHOTO DE GROUPE À VENIR" className="mt-14 aspect-[16/7] rounded-3xl" /><PresentationDetails /></Container></>;
}

function Categories() {
  return <><PageHero title="Les catégories" text="Du Baby Rugby aux U14, chaque enfant trouve un cadre adapté pour découvrir, apprendre et partager." /><Container className="py-16"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <Card key={category.slug} className="overflow-hidden p-0"><ImageWithFallback src={category.image} alt={`Équipe ${category.name} de l’EDR Nord Toulousain`} placeholder={category.photoLabel} className="aspect-[4/3]" /><div className="p-6"><h2 className="text-3xl font-black text-night">{category.name}</h2><p className="mt-3 leading-7 text-slate-600">{category.intro}</p><div className="mt-6"><Button href={`/categories/${category.slug}`} variant="blue">Découvrir la catégorie</Button></div></div></Card>)}</div></Container></>;
}

function Category({ slug }: { slug: string }) {
  const category = categories.find((item) => item.slug === slug)!;
  return <><PageHero eyebrow="Les catégories" title={category.name} text={category.intro} /><Container className="py-12"><ImageWithFallback src={category.image} alt={`Photographie de l’équipe ${category.name}`} placeholder={category.photoLabel} objectFit="contain" background="light" className="aspect-[4/3] rounded-3xl shadow-card" /><section className="mt-8"><Card><SectionTitle kicker="À retenir">Informations sur les entraînements</SectionTitle><div className="mt-7"><InfoGrid items={[["Jours d’entraînement", category.training.days], ["Horaires", category.training.hours], ["Lieu d’entraînement", category.training.place], ["Adresse", category.training.address]]} /></div></Card></section><section className="mt-6"><Card><SectionTitle kicker="Encadrement">Les éducateurs</SectionTitle><p className="mt-4 text-slate-600">Retrouvez l’équipe éducative de la catégorie. Les portraits manquants seront ajoutés prochainement.</p><EducatorGrid educators={category.educators} /></Card></section><section className="mt-12 grid gap-6 lg:grid-cols-2"><Card><SectionTitle kicker="La catégorie">Jouer et progresser ensemble</SectionTitle><p className="mt-5 text-lg leading-8 text-slate-600">{category.intro} Cette catégorie permet aux enfants de développer leur pratique dans un cadre ludique, progressif et collectif.</p></Card><Card><SectionTitle kicker="Pratique">Informations pratiques</SectionTitle><div className="mt-6"><InfoGrid items={[["Équipement conseillé", category.practical.equipment], ["Documents nécessaires", category.practical.documents], ["Contact de la catégorie", category.practical.contact]]} /></div></Card></section></Container></>;
}

function Boutique() {
  return <><PageHero title="La boutique de l’EDR Nord Toulousain" text="Les couleurs de l’école, bientôt disponibles pour toute la famille." /><Container className="py-16"><Card className="border-red/20 bg-red/5 text-center"><p className="text-3xl font-black text-red">Boutique en cours de construction</p><p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Les équipements et articles aux couleurs de l’EDR Nord Toulousain seront bientôt disponibles sur cette page.</p></Card><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{["Maillots", "Shorts", "Sweats", "Accessoires", "Articles supporters"].map((item) => <Card key={item} className="grid min-h-52 place-items-center text-center"><div><span className="text-4xl">👕</span><h2 className="mt-4 text-xl font-black">{item}</h2><p className="mt-2 text-sm text-slate-500">À venir</p></div></Card>)}</div></Container></>;
}

function CalendarHub({ type }: { type?: "plateaux" | "tournois" }) {
  if (!type) return <><PageHero title="Le calendrier de l’EDR" text="Retrouvez prochainement les dates des plateaux et des tournois." /><Container className="grid gap-6 py-16 md:grid-cols-2"><Choice title="Plateaux" text="Les rencontres de la saison par catégorie." href="/calendrier/plateaux" /><Choice title="Tournois" text="Les tournois auxquels participe l’école." href="/calendrier/tournois" /></Container></>;
  const title = type === "plateaux" ? "Plateaux" : "Tournois";
  return <><PageHero title={title} text={`Consultez le calendrier des ${title.toLowerCase()} de l’EDR.`} /><Container className="py-16"><Choice title={`${title} — Saison 2026-2027`} text="Les dates et lieux officiels seront publiés prochainement." href={`/calendrier/${type}/saison-2026-2027`} /></Container></>;
}

function SeasonCalendar({ type }: { type: "plateaux" | "tournois" }) {
  const title = type === "plateaux" ? "Plateaux" : "Tournois";
  return <><PageHero title={`${title} — Saison 2026-2027`} text={`Un calendrier mensuel prêt à accueillir les dates officielles des ${title.toLowerCase()}.`} /><Container className="py-16"><MonthlySeasonCalendar type={type} /></Container></>;
}

function Choice({ title, text, href }: { title: string; text: string; href: string }) {
  return <Card><span className="text-4xl" aria-hidden="true">📅</span><h2 className="mt-5 text-3xl font-black">{title}</h2><p className="mt-3 text-slate-600">{text}</p><div className="mt-6"><Button href={href} variant="blue">Consulter</Button></div></Card>;
}

function Tournament({ edition = false }: { edition?: boolean }) {
  if (!edition) return <><PageHero title="Le tournoi de l’EDR Nord Toulousain" text="Un grand rendez-vous sportif et convivial porté par l’école de rugby." /><Container className="py-16"><Choice title="Édition 2027" text="Découvrez les premières informations sur la prochaine édition." href="/tournoi-edr/2027" /></Container></>;
  return <><PageHero eyebrow="Rendez-vous officiel" title="Tournoi de l’EDR Nord Toulousain — Édition 2027" text="L’EDR Nord Toulousain prépare son tournoi 2027. Les équipes participantes, le programme, les horaires et les modalités d’inscription seront annoncés prochainement." /><Container className="py-16"><div className="mb-8 rounded-3xl border-2 border-red bg-white p-6 text-center shadow-card"><p className="text-sm font-black uppercase tracking-[.18em] text-red">Date officielle</p><p className="mt-2 text-3xl font-black text-night sm:text-5xl">{tournament2027.date}</p></div><TournamentCountdown target={tournament2027.target} /><a href={tournament2027.poster} target="_blank" rel="noopener noreferrer" className="mt-10 block rounded-3xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue"><ImageWithFallback src={tournament2027.poster} alt="Affiche du tournoi 2027 de l’EDR Nord Toulousain" placeholder="Affiche officielle à venir" note="Le visuel pourra être ajouté sans modifier la page." objectFit="contain" background="light" className="mx-auto aspect-[3/4] max-h-[56rem] max-w-3xl rounded-3xl shadow-card" /></a><div className="mt-8"><InfoGrid items={[["Lieu", tournament2027.place], ["Catégories concernées", tournament2027.categories], ["Horaires", tournament2027.hours], ["Inscriptions", tournament2027.registration]]} /></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{["Bulletin d’inscription", "Modalités d’inscription", "Catégories concernées", "Programme", "Équipes participantes", "Idées d’hébergement pour les groupes", "Restauration", "Plan d’accès", "Partenaires du tournoi", "Informations pratiques", "Résultats", "Galerie photos"].map((item) => <Card key={item}><h2 className="font-black text-night">{item}</h2><p className="mt-2 text-sm text-slate-500">Informations à venir</p></Card>)}</div></Container></>;
}

function Events({ slug }: { slug?: string }) {
  if (!slug) return <><PageHero title="Les événements" text="Des moments pour se retrouver, partager et faire vivre le collectif." /><Container className="grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">{events.map((event) => <Card key={event.slug}><span className="text-4xl">🎉</span><h2 className="mt-4 text-2xl font-black">{event.title}</h2><p className="mt-3 text-slate-500">Informations à venir</p><div className="mt-6"><Button href={`/evenements/${event.slug}`} variant="blue">Découvrir</Button></div></Card>)}</Container></>;
  const event = events.find((item) => item.slug === slug)!;
  const date = "date" in event ? event.date : "À venir";
  const categoriesLabel = "categories" in event ? event.categories : undefined;
  const futureSections = event.slug === "voyage-fin-annee"
    ? ["Destination", "Dates", "Programme", "Transport", "Hébergement", "Informations pratiques", "Photographies"]
    : event.slug === "vide-grenier"
      ? ["Affiche", "Présentation de l’événement", "Inscriptions", "Tarifs", "Partenaires", "Photographies"]
      : ["Affiche", "Présentation de l’événement", "Partenaires", "Photographies"];
  return <><PageHero title={event.title} text="Toutes les informations concernant cet événement seront communiquées prochainement." /><Container className="py-16"><InfoGrid items={[["Date", date], ["Heure", "À venir"], ["Lieu", "À venir"], ...(categoriesLabel ? [["Catégories concernées", categoriesLabel] as const] : [])]} />{event.slug === "noel" && <p className="mt-5 rounded-2xl bg-red/10 p-5 font-bold text-red">Plus d’informations à venir</p>}<div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{futureSections.map((item) => <Card key={item}><h2 className="text-xl font-black">{item}</h2><p className="mt-3 text-slate-500">Informations à venir</p></Card>)}</div></Container></>;
}

function Partners({ type }: { type?: "mairies" | "entreprises" }) {
  return <PartnerPage type={type} />;
}

function Contact() {
  return <><PageHero title="Nous contacter" text="Une question sur l’école de rugby ? Retrouvez ici nos coordonnées." /><Container className="py-16"><div className="grid gap-6 lg:grid-cols-2"><Card><h2 className="text-3xl font-black">École de Rugby Nord Toulousain</h2><h3 className="mt-7 text-lg font-black text-night">Siège social de l’association</h3><address className="mt-2 not-italic leading-8 text-slate-600">{site.address[0]}<br />{site.address[1]}</address><div className="mt-7 grid gap-4"><div className="rounded-2xl bg-mist p-5"><h3 className="font-black text-night">Contact général</h3><a href={`mailto:${site.email}`} className="mt-2 block break-all font-bold text-blue underline">{site.email}</a></div><div className="rounded-2xl bg-mist p-5"><h3 className="font-black text-night">Partenariats</h3><a href={`mailto:${site.partnershipEmail}`} className="mt-2 block break-all font-bold text-blue underline">{site.partnershipEmail}</a></div></div><div className="mt-7"><h3 className="mb-3 font-black text-night">Retrouvez-nous sur les réseaux sociaux</h3><SocialLinks /></div></Card><div className="grid min-h-96 place-items-center overflow-hidden rounded-3xl bg-white p-8 shadow-card ring-1 ring-slate-200"><ImageWithFallback src="/images/logo-edr.png" alt="Logo officiel de l’EDR Nord Toulousain" placeholder="Logo de l’EDR Nord Toulousain" objectFit="contain" background="light" className="h-80 w-full max-w-lg rounded-3xl" /></div></div></Container></>;
}

function Legal({ privacy = false }: { privacy?: boolean }) {
  return <><PageHero title={privacy ? "Politique de confidentialité" : "Mentions légales"} /><Container className="py-16"><Card><h2 className="text-2xl font-black">Informations officielles à venir</h2>{!privacy && <p className="mt-5 font-bold text-night">SIRET : {site.siret}</p>}<p className="mt-5 text-lg leading-8 text-slate-600">Cette page sera complétée avec les informations légales officielles de l’EDR Nord Toulousain.</p></Card></Container></>;
}

export function PageRenderer({ path }: { path: string }) {
  const parts = path.split("/");
  if (path === "presentation") return <Presentation />;
  if (path === "categories") return <Categories />;
  if (parts[0] === "categories") return <Category slug={parts[1]} />;
  if (path === "boutique") return <Boutique />;
  if (path === "calendrier") return <CalendarHub />;
  if (path === "calendrier/plateaux") return <CalendarHub type="plateaux" />;
  if (path === "calendrier/tournois") return <CalendarHub type="tournois" />;
  if (path === "calendrier/plateaux/saison-2026-2027") return <SeasonCalendar type="plateaux" />;
  if (path === "calendrier/tournois/saison-2026-2027") return <SeasonCalendar type="tournois" />;
  if (path === "tournoi-edr") return <Tournament edition />;
  if (path === "tournoi-edr/2027") return <Tournament edition />;
  if (path === "galerie") return <GalleryPage />;
  if (path === "actualites") return <NewsPage />;
  if (path === "evenements") return <Events />;
  if (parts[0] === "evenements") return <Events slug={parts[1]} />;
  if (path === "partenaires") return <Partners />;
  if (path === "partenaires/mairies") return <Partners type="mairies" />;
  if (path === "partenaires/entreprises") return <Partners type="entreprises" />;
  if (path === "reunions") return <MeetingsPage />;
  if (path === "reunions/calendrier") return <MeetingsPage section="calendar" />;
  if (path === "reunions/comptes-rendus") return <MeetingsPage section="minutes" />;
  if (path === "contact") return <Contact />;
  if (path === "mentions-legales") return <Legal />;
  if (path === "politique-de-confidentialite") return <Legal privacy />;
  return <div className="py-24 text-center"><h1 className="text-4xl font-black">Page introuvable</h1><Link href="/" className="mt-6 inline-block text-blue underline">Retour à l’accueil</Link></div>;
}
