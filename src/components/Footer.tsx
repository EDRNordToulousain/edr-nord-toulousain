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
        <div><h2 className="font-black uppercase tracking-wide">Liens utiles</h2><div className="mt-4 grid gap-2 text-sm text-white/70"><Link href="/categories">Les catégories</Link><Link href="/calendrier">Calendrier</Link><Link href="/actualites">Actualités</Link><Link href="/evenements">Événements</Link><Link href="/partenaires">Partenaires</Link><Link href="/contact">Nous contacter</Link></div></div>
        <div><h2 className="font-black uppercase tracking-wide">À retrouver bientôt</h2><p className="mt-4 text-sm text-white/65">{site.social}</p><div className="mt-6 flex flex-wrap gap-4 text-sm"><Link href="/mentions-legales">Mentions légales</Link><Link href="/politique-de-confidentialite">Confidentialité</Link></div></div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/55">© {new Date().getFullYear()} École de Rugby Nord Toulousain. Tous droits réservés.</div>
    </footer>
  );
}
