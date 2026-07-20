import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/PageRenderer";
import { allPaths, categories, events, site } from "@/data/site-content";

type Props = { params: Promise<{ slug: string[] }> };

const titles: Record<string, string> = {
  presentation: "Présentation de l’EDR",
  categories: "Les catégories",
  boutique: "La boutique",
  calendrier: "Calendrier",
  "calendrier/plateaux": "Les plateaux",
  "calendrier/plateaux/saison-2026-2027": "Plateaux — Saison 2026-2027",
  "calendrier/tournois": "Les tournois",
  "calendrier/tournois/saison-2026-2027": "Tournois — Saison 2026-2027",
  "tournoi-edr": "Le tournoi de l’EDR",
  "tournoi-edr/2027": "Tournoi de l’EDR — Édition 2027",
  galerie: "Galerie photos",
  actualites: "Les actualités de l’EDR Nord Toulousain",
  evenements: "Les événements",
  partenaires: "Nos partenaires",
  "partenaires/mairies": "Les mairies partenaires",
  "partenaires/entreprises": "Les entreprises partenaires",
  contact: "Nous contacter",
  "mentions-legales": "Mentions légales",
  "politique-de-confidentialite": "Politique de confidentialité",
};

categories.forEach((category) => { titles[`categories/${category.slug}`] = `Catégorie ${category.name}`; });
events.forEach((event) => { titles[`evenements/${event.slug}`] = event.title; });

export function generateStaticParams() {
  return allPaths.map((path) => ({ slug: path.slice(1).split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = (await params).slug.join("/");
  const title = titles[path] ?? site.name;
  const description = path === "tournoi-edr/2027" ? "Tournoi de l’EDR Nord Toulousain le samedi 5 juin 2027 : compte à rebours et informations pratiques." : path === "actualites" ? "Actualités, affiches et dossier d’inscription de l’École de Rugby Nord Toulousain." : `${title} : informations officielles de l’École de Rugby Nord Toulousain.`;
  return {
    title,
    description,
    alternates: { canonical: `/${path}` },
    openGraph: { title: `${title} | EDR Nord Toulousain`, description, url: `/${path}` },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const path = (await params).slug.join("/");
  if (!allPaths.includes(`/${path}` as (typeof allPaths)[number])) notFound();
  return <PageRenderer path={path} />;
}
