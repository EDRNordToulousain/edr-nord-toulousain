import { Button, Card, Container, SectionTitle } from "@/components/UI";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { partners, values } from "@/data/site-content";
import { HomeNewsCarousel } from "@/components/HomeNewsCarousel";

const quickLinks = [
  ["🏉", "Les catégories", "Du Baby Rugby aux U14", "/categories"],
  ["📅", "Le calendrier", "Plateaux et tournois", "/calendrier"],
  ["🏆", "Le tournoi 2027", "Préparer la prochaine édition", "/tournoi-edr/2027"],
  ["📷", "La galerie photos", "Les souvenirs de l’EDR", "/galerie"],
  ["🎉", "Les événements", "Les rendez-vous du collectif", "/evenements"],
  ["👕", "La boutique", "Les couleurs de l’EDR", "/boutique"],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[680px] overflow-hidden bg-night text-white">
        <ImageWithFallback src="/images/hero-enfants-edr.jpg" alt="Les enfants de l’École de Rugby Nord Toulousain" placeholder="PHOTO ENFANTS EDR" note="La photographie officielle de l’école de rugby sera ajoutée prochainement." className="absolute inset-0 h-full w-full opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-transparent" />
        <Container className="relative flex min-h-[680px] items-end py-16 sm:items-center">
          <div className="max-w-3xl">
            <p className="font-black uppercase tracking-[.22em] text-coral">Grandir, jouer, partager.</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">École de Rugby<br />Nord Toulousain</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">Une école de rugby où chaque enfant peut apprendre, progresser et vivre pleinement les valeurs du collectif.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="/presentation">Découvrir notre école</Button><Button href="/categories" variant="light">Voir les catégories</Button></div>
          </div>
        </Container>
      </section>

      <HomeNewsCarousel />

      <section className="py-20"><Container><div className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]"><SectionTitle kicker="Bienvenue">Une école pour apprendre, progresser et s’épanouir</SectionTitle><p className="text-lg leading-8 text-slate-600">Du Baby Rugby aux U14, l’EDR Nord Toulousain accompagne les jeunes joueuses et joueurs dans un cadre bienveillant, structuré et convivial. Ici, le plaisir du jeu et la force du collectif font grandir chaque enfant.</p></div></Container></section>

      <section className="bg-white py-20"><Container><SectionTitle kicker="Accès rapides" center>Tout l’univers de l’EDR</SectionTitle><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{quickLinks.map(([icon, title, text, href]) => <Card key={href} className="group transition hover:-translate-y-1 hover:border-blue"><span className="text-3xl" aria-hidden="true">{icon}</span><h3 className="mt-5 text-2xl font-black text-night">{title}</h3><p className="mt-2 text-slate-600">{text}</p><div className="mt-5"><Button href={href} variant="blue">Découvrir</Button></div></Card>)}</div></Container></section>

      <section className="py-20"><Container><SectionTitle kicker="Notre ADN" center>Les valeurs de l’école</SectionTitle><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{values.map(([title, text], index) => <Card key={title} className="relative overflow-hidden"><span className="absolute right-4 top-3 text-5xl font-black text-blue/10">0{index + 1}</span><h3 className="relative text-xl font-black text-night">{title}</h3><p className="relative mt-3 text-sm leading-6 text-slate-600">{text}</p></Card>)}</div></Container></section>

      <section className="bg-night py-20 text-white"><Container><SectionTitle kicker="À la une">Les actualités de l’EDR</SectionTitle><div className="mt-10 grid gap-5 md:grid-cols-3">{[
        ["Calendrier de la saison 2026-2027", "/calendrier"],
        ["Tournoi de l’EDR Nord Toulousain 2027", "/tournoi-edr/2027"],
        ["Boutique officielle", "/boutique"],
      ].map(([title, href]) => <article key={href} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/10"><p className="text-xs font-black uppercase tracking-wider text-coral">Informations à venir</p><h3 className="mt-4 text-2xl font-black">{title}</h3><div className="mt-6"><Button href={href} variant="light">En savoir plus</Button></div></article>)}</div></Container></section>

      <section className="py-20"><Container><SectionTitle kicker="Ils nous accompagnent" center>Nos partenaires</SectionTitle><p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">Merci aux communes et entreprises locales qui soutiennent les projets de l’école de rugby.</p><div className="mt-10 grid gap-4 sm:grid-cols-3">{[...partners.mairies, ...partners.entreprises].map((partner) => <div key={partner.name} className="grid min-h-32 place-items-center rounded-2xl border border-slate-200 bg-white p-5 text-center font-bold text-night">{partner.logo ? <ImageWithFallback src={partner.logo} alt={`Logo officiel — ${partner.name}`} placeholder={partner.name} objectFit="contain" className="h-24 w-full rounded-xl" /> : <span><span className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Logo à fournir</span>{partner.name}</span>}</div>)}</div><div className="mt-10 text-center"><Button href="/partenaires" variant="blue">Découvrir tous nos partenaires</Button></div></Container></section>
    </>
  );
}
