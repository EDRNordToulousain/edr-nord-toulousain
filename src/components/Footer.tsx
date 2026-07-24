import Link from "next/link";
import { Logo } from "./Logo";
import { site } from "@/data/site-content";

export function Footer() {
  return (
    <footer className="mt-20 bg-night text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div className="flex gap-4">
          <Logo />
          <div><strong className="text-lg">{site.fullName}</strong><p className="mt-2 text-sm leading-6 text-white/65">{site.address.join(", ")}</p><a href={`mailto:${site.email}`} className="text-sm text-white/80 hover:text-white">{site.email}</a></div>
        </div>
        <div><h2 className="font-black uppercase tracking-wide">Liens utiles</h2><div className="mt-4 grid gap-2 text-sm text-white/70"><Link href="/categories">Les catégories</Link><Link href="/calendrier">Calendrier</Link><Link href="/actualites">Actualités</Link><Link href="/evenements">Événements</Link><Link href="/reunions">Réunions</Link><Link href="/partenaires">Partenaires</Link><Link href="/contact">Nous contacter</Link></div></div>
        <div><h2 className="font-black uppercase tracking-wide">Suivez-nous</h2><div className="mt-4 flex flex-wrap gap-3"><a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/20">Facebook<span className="sr-only"> (nouvel onglet)</span></a><a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/20">Instagram<span className="sr-only"> (nouvel onglet)</span></a></div><div className="mt-6 flex flex-wrap gap-4 text-sm"><Link href="/mentions-legales">Mentions légales</Link><Link href="/politique-de-confidentialite">Confidentialité</Link></div></div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/55">© {new Date().getFullYear()} École de Rugby Nord Toulousain. Tous droits réservés. · SIRET : {site.siret}</div>
    </footer>
  );
}
