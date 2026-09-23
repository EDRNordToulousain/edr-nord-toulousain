import Image from "next/image";
import Link from "next/link";
import { featuredEvents, news } from "@/data/site-content";
import { Card, Container, PageHero } from "./UI";

const featuredNews = [
  {
    id: "vide-grenier-2026",
    eyebrow: "Dimanche 8 novembre 2026",
    title: "Vide-grenier de l’EDR Nord Toulousain",
    description: "Espace / Salle des Deux Mers et boulodrome — Lespinasse. Réservez dès maintenant votre emplacement en ligne.",
    image: featuredEvents.videGrenier.poster,
    alt: "Affiche du vide-grenier de l’EDR Nord Toulousain du 8 novembre 2026 à Lespinasse",
    href: "/evenements/vide-grenier",
    ratio: "aspect-[1138/1402]",
  },
  {
    id: "loto-2026",
    eyebrow: "Dimanche 11 octobre 2026 à 15h",
    title: "Retour des lotos de l’EDR Nord Toulousain",
    description: "Rendez-vous à la Salle Xeraco à Bruguières pour le loto de l’école de rugby.",
    image: featuredEvents.loto.poster,
    alt: "Affiche du loto de l’EDR Nord Toulousain du 11 octobre 2026 à Bruguières",
    href: "/evenements/loto",
    ratio: "aspect-[1054/1484]",
  },
] as const;

export function NewsPage() {
  return (
    <>
      <PageHero
        title="Les actualités de l’EDR Nord Toulousain"
        text="Les rendez-vous et informations utiles de l’école de rugby."
      />
      <Container className="py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {featuredNews.map((item) => (
            <Card id={item.id} key={item.id} className="scroll-mt-28 overflow-hidden p-0">
              <Link href={item.href} className="block bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={item.id === "loto-2026" ? 1054 : 1138}
                  height={item.id === "loto-2026" ? 1484 : 1402}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={`${item.ratio} h-auto w-full object-contain`}
                />
              </Link>
              <div className="p-6 sm:p-8">
                <p className="text-sm font-black uppercase tracking-[.16em] text-red">{item.eyebrow}</p>
                <h2 className="mt-2 text-2xl font-black text-night sm:text-3xl">{item.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-blue px-6 py-3 text-center font-bold text-white transition hover:bg-night focus:outline-none focus-visible:ring-4 focus-visible:ring-blue/40"
                >
                  Voir toutes les informations
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {news.map((item) => (
            <Card id={item.id} key={item.path} className="scroll-mt-28 overflow-hidden p-0">
              <a href={item.path} target="_blank" rel="noopener noreferrer" className="block bg-night">
                <Image
                  src={item.path}
                  alt={item.alt}
                  width={1024}
                  height={1536}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[2/3] h-auto w-full object-contain"
                />
              </a>
              <div className="p-6">
                <h2 className="text-2xl font-black text-night">{item.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue px-5 py-3 text-center font-bold text-white hover:bg-night"
                  >
                    Consulter le document<span className="sr-only"> (nouvel onglet)</span>
                  </a>
                  <a
                    href={item.path}
                    download
                    className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-blue px-5 py-3 text-center font-bold text-blue hover:bg-blue hover:text-white"
                  >
                    Télécharger le visuel
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
