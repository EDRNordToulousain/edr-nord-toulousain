"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  enabledHomeCarouselSlides,
  HOME_CAROUSEL_INTERVAL_MS,
} from "@/data/home-carousel";

export function HomeNewsCarousel() {
  const slides = enabledHomeCarouselSlides;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const swipeTriggered = useRef(false);

  const showPrevious = useCallback(() => {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isHovered || hasFocus || isTouching || reducedMotion || slides.length < 2) return;
    const interval = window.setInterval(showNext, HOME_CAROUSEL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [hasFocus, isHovered, isTouching, reducedMotion, showNext, slides.length]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex];

  return (
    <section className="bg-white py-14 sm:py-20" aria-labelledby="home-carousel-title">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[.2em] text-red">À la une</p>
          <h2 id="home-carousel-title" className="mt-2 text-3xl font-black text-night sm:text-4xl">
            Les informations importantes de l’EDR
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Retrouvez les informations importantes de l’EDR Nord Toulousain.
          </p>
        </div>

        <div
          className="relative mx-auto mt-8 max-w-5xl touch-pan-y outline-none sm:mt-10"
          role="region"
          aria-roledescription="carrousel"
          aria-label="Informations à la une"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setHasFocus(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              showPrevious();
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              showNext();
            }
          }}
          onPointerDown={(event) => {
            pointerStart.current = { x: event.clientX, y: event.clientY };
            swipeTriggered.current = false;
            setIsTouching(true);
          }}
          onPointerUp={(event) => {
            const start = pointerStart.current;
            pointerStart.current = null;
            setIsTouching(false);
            if (!start) return;
            const deltaX = event.clientX - start.x;
            const deltaY = event.clientY - start.y;
            if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
              swipeTriggered.current = true;
              if (deltaX > 0) showPrevious();
              else showNext();
            }
          }}
          onPointerCancel={() => {
            pointerStart.current = null;
            setIsTouching(false);
          }}
        >
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Diapositive {activeIndex + 1} sur {slides.length} : {activeSlide.title}
          </p>

          <div className="overflow-hidden rounded-[2rem] bg-night shadow-card ring-1 ring-night/10">
            <Link
              href={activeSlide.href}
              onClick={(event) => {
                if (swipeTriggered.current) {
                  event.preventDefault();
                  swipeTriggered.current = false;
                }
              }}
              className="group relative block focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-coral"
              aria-label={`${activeSlide.title} — ${activeSlide.buttonLabel}`}
            >
              <div
                className="relative grid min-h-[34rem] place-items-center overflow-hidden bg-[radial-gradient(circle_at_top,#246bce_0%,#0b1f3a_58%)] p-4 sm:min-h-[44rem] sm:p-8 lg:min-h-[48rem]"
              >
                {activeSlide.image ? (
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.imageAlt}
                    fill
                    priority={activeIndex === 0}
                    sizes="(min-width: 1024px) 960px, 100vw"
                    className="object-contain p-3 sm:p-6"
                  />
                ) : (
                  <div className="field-lines relative z-10 flex min-h-[28rem] w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/10 px-6 py-12 text-center text-white sm:min-h-[36rem] sm:px-12">
                    <p className="text-sm font-black uppercase tracking-[.2em] text-coral">Édition 2027</p>
                    <h3 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
                      Tournoi de l’EDR Nord Toulousain
                    </h3>
                    <p className="mt-7 rounded-full bg-red px-5 py-3 text-xl font-black sm:text-2xl">
                      Samedi 5 juin 2027
                    </p>
                    <p className="mt-5 text-lg font-bold text-white/75">Informations à venir</p>
                  </div>
                )}

              </div>
              <article
                className="flex min-h-20 items-center justify-between gap-4 bg-night px-5 py-4 text-white sm:px-8"
                aria-roledescription="diapositive"
                aria-label={`${activeIndex + 1} sur ${slides.length}`}
              >
                <span className="hidden font-bold sm:block">{activeSlide.title}</span>
                <span className="ml-auto inline-flex min-h-12 items-center rounded-full bg-red px-5 py-3 text-sm font-black text-white shadow-lg transition group-hover:bg-coral group-focus-visible:bg-coral sm:text-base">
                  {activeSlide.buttonLabel}
                  <span aria-hidden="true" className="ml-2">→</span>
                </span>
              </article>
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="mt-5 flex min-h-12 items-center justify-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={showPrevious}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-2xl font-black text-night shadow-lg ring-1 ring-night/10 transition hover:bg-red hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue sm:h-14 sm:w-14"
                aria-label="Afficher la diapositive précédente"
              >
                <span aria-hidden="true">←</span>
              </button>
              <div className="flex items-center justify-center gap-1 sm:gap-2" role="tablist" aria-label="Choisir une diapositive">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`Afficher la diapositive ${index + 1} : ${slide.title}`}
                    onClick={() => setActiveIndex(index)}
                    className={`grid h-11 w-11 place-items-center rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-blue ${index === activeIndex ? "text-red" : "text-slate-400 hover:text-blue"}`}
                  >
                    <span className={`block rounded-full transition-all ${index === activeIndex ? "h-3 w-8 bg-red" : "h-3 w-3 bg-current"}`} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={showNext}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-2xl font-black text-night shadow-lg ring-1 ring-night/10 transition hover:bg-red hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue sm:h-14 sm:w-14"
                aria-label="Afficher la diapositive suivante"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
