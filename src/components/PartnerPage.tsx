import { documents, partners, type Partner } from "@/data/site-content";
import { Card, Container, PageHero, SectionTitle } from "./UI";
import Image from "next/image";
import Link from "next/link";

function PartnerCard({ partner }: { partner: Partner }) {
  return <Card className="flex h-full flex-col text-center">
    <div className="relative grid aspect-[3/2] place-items-center rounded-2xl border border-slate-200 bg-slate-50 p-5">
      {partner.logo ? <Image src={partner.logo} alt={`Logo officiel — ${partner.name}`} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="p-5 object-contain" /> : <span className="text-sm font-black uppercase tracking-wide text-slate-400">Logo officiel à fournir</span>}
    </div>
    <h2 className="mt-5 text-xl font-black text-night">{partner.name}</h2>
    {partner.note && <p className="mt-2 text-sm text-slate-500">{partner.note}</p>}
    <div className="mt-auto pt-5">{partner.officialUrl ? <a href={partner.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue px-5 py-3 font-bold text-white transition hover:bg-night focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2">Visiter le site officiel<span className="sr-only"> de {partner.name} (nouvel onglet)</span></a> : <span className="text-sm font-bold text-slate-500">Lien officiel à venir</span>}</div>
  </Card>;
}

export function PartnerPage({ type }: { type?: "mairies" | "entreprises" }) {
  const items = type ? partners[type] : [...partners.mairies, ...partners.entreprises];
  const title = type === "mairies" ? "Les mairies partenaires" : type === "entreprises" ? "Les entreprises partenaires" : "Nos partenaires";
  return <><PageHero title={title} text="L’EDR Nord Toulousain remercie chaleureusement les communes et les entreprises qui accompagnent l’école de rugby et contribuent à la réalisation de ses projets." /><Container className="py-16">
    {!type && <section className="mb-14 rounded-3xl bg-night p-6 text-white shadow-card sm:p-10"><p className="text-sm font-black uppercase tracking-[.18em] text-coral">Construisons ensemble</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Devenir partenaire de l’EDR Nord Toulousain</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">Vous souhaitez accompagner l’École de Rugby Nord Toulousain et participer au développement de ses projets ? Découvrez notre dossier partenaire.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href={documents.partner.path} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-red px-6 py-3 font-bold text-white hover:bg-coral">Consulter le dossier partenaire<span className="sr-only"> (nouvel onglet)</span></a><a href={documents.partner.path} download className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-bold text-night hover:bg-mist">Télécharger le PDF</a></div><p className="mt-4 text-sm text-white/60">{documents.partner.title}</p></section>}
    {!type && <><nav aria-label="Rubriques des partenaires" className="mb-12 grid gap-4 sm:grid-cols-2"><Link href="/partenaires/mairies" className="rounded-3xl bg-blue p-6 text-xl font-black text-white transition hover:bg-night">Découvrir les mairies partenaires →</Link><Link href="/partenaires/entreprises" className="rounded-3xl bg-red p-6 text-xl font-black text-white transition hover:bg-coral">Découvrir les entreprises partenaires →</Link></nav><SectionTitle kicker="Ils nous accompagnent">Communes et entreprises partenaires</SectionTitle></>}
    <div className={`${!type ? "mt-8" : ""} grid gap-6 sm:grid-cols-2 lg:grid-cols-3`}>{items.map((partner) => <PartnerCard key={partner.name} partner={partner} />)}</div>
  </Container></>;
}
