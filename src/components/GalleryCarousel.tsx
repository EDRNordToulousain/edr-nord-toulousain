"use client";

import { useRef, useState } from "react";
import type { GalleryPhoto } from "@/data/gallery";

export function GalleryCarousel({ photos }: { photos: readonly GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const activePhoto = photos[activeIndex];

  const previous = () => setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
  const next = () => setActiveIndex((index) => (index + 1) % photos.length);

  return (
    <section
      className="mx-auto max-w-5xl outline-none"
      aria-label="Galerie photos de l’EDR Nord Toulousain"
      aria-roledescription="carrousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
      }}
      onPointerDown={(event) => {
        pointerStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        const start = pointerStart.current;
        pointerStart.current = null;
        if (!start) return;
        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) previous();
          else next();
        }
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      <p className="sr-only" aria-live="polite">
        Photographie {activeIndex + 1} sur {photos.length}
      </p>
      <div className="relative flex min-h-64 touch-pan-y items-center justify-center overflow-hidden rounded-3xl bg-white p-2 shadow-card ring-1 ring-slate-200 sm:p-4">
        {/* Une image native conserve ici ses proportions exactes et évite tout recadrage. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activePhoto.src}
          src={activePhoto.src}
          alt={activePhoto.alt}
          decoding="async"
          className="block h-auto max-h-[78vh] w-auto max-w-full rounded-2xl object-contain"
        />
        <button
          type="button"
          onClick={previous}
          className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-3xl font-black text-night shadow-lg transition hover:bg-mist focus:outline-none focus-visible:ring-4 focus-visible:ring-blue sm:left-5"
          aria-label="Afficher la photographie précédente"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/95 text-3xl font-black text-night shadow-lg transition hover:bg-mist focus:outline-none focus-visible:ring-4 focus-visible:ring-blue sm:right-5"
          aria-label="Afficher la photographie suivante"
        >
          ›
        </button>
      </div>
      <div className="mt-5 flex items-center justify-center gap-5">
        <button type="button" onClick={previous} className="font-bold text-blue underline underline-offset-4">
          Précédente
        </button>
        <span className="min-w-20 text-center text-sm font-black text-night">
          {activeIndex + 1} / {photos.length}
        </span>
        <button type="button" onClick={next} className="font-bold text-blue underline underline-offset-4">
          Suivante
        </button>
      </div>
      <p className="mt-3 text-center text-sm text-slate-500">Utilisez les flèches ou faites glisser la photo sur votre téléphone.</p>
    </section>
  );
}
