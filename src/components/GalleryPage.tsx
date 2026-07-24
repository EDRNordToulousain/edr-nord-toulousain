import Link from "next/link";
import { galleryPhotos } from "@/data/gallery";
import { Container, PageHero } from "./UI";
import { ImageWithFallback } from "./ImageWithFallback";

export function GalleryPage() {
  return (
    <>
      <PageHero title="Galerie photos" text="Retrouvez les moments forts de l’EDR Nord Toulousain." />
      <Container className="py-16">
        <section className="mb-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row">
          <p className="text-lg font-black text-night">Photos réalisées par notre partenaire LD Studio</p>
          <Link href="https://www.instagram.com/ldstudio31/" target="_blank" rel="noopener noreferrer" className="flex min-h-16 items-center gap-3 rounded-2xl px-3 py-2 font-bold text-blue transition hover:bg-mist">
            <ImageWithFallback src="/images/partners/entreprises/ld-studio.png" alt="Logo LD Studio" placeholder="LD Studio" objectFit="contain" background="light" className="h-16 w-28 rounded-xl" />
            <span>Voir sur Instagram<span className="sr-only"> (nouvel onglet)</span></span>
          </Link>
        </section>
        {galleryPhotos.length ? (
          <div className="mx-auto grid max-w-5xl gap-8">
            {galleryPhotos.map((photo) => (
              // Les fichiers conservent ici leur format naturel afin qu’aucune photographie ne soit coupée.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-2xl bg-white shadow-card"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => <ImageWithFallback key={index} src={`/images/gallery/ld-studio/photo-${index + 1}.jpg`} alt="" placeholder="Photographie à venir" className="aspect-[4/3] rounded-2xl" />)}
          </div>
        )}
      </Container>
    </>
  );
}
