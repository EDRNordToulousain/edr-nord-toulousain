export type HomeCarouselSlide = {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt: string;
  href: string;
  buttonLabel: string;
  enabled: boolean;
  order: number;
};

export const HOME_CAROUSEL_INTERVAL_MS = 6_000;

export const homeCarouselSlides: readonly HomeCarouselSlide[] = [
  {
    id: "inscriptions",
    title: "Inscriptions à l’EDR Nord Toulousain",
    description: "Les inscriptions pour la saison 2026-2027 sont ouvertes.",
    image: "/images/carousel/inscriptions-saison-2026-2027.jpg",
    imageAlt: "Affiche des inscriptions ouvertes à l’EDR Nord Toulousain pour la saison 2026-2027",
    href: "/actualites#inscriptions",
    buttonLabel: "Préparer l’inscription",
    enabled: true,
    order: 1,
  },
  {
    id: "reprise-entrainements",
    title: "Reprise des entraînements",
    description: "Rendez-vous le mercredi 2 septembre 2026.",
    image: "/images/carousel/reprise-entrainements-2-septembre-2026.jpg",
    imageAlt: "Affiche de la reprise des entraînements de l’EDR Nord Toulousain le mercredi 2 septembre 2026",
    href: "/actualites#reprise-entrainements",
    buttonLabel: "Voir les horaires",
    enabled: true,
    order: 2,
  },
  {
    id: "tournoi-2027",
    title: "Tournoi de l’EDR Nord Toulousain",
    description: "Samedi 5 juin 2027 · Informations à venir",
    imageAlt: "Annonce du tournoi de l’EDR Nord Toulousain du samedi 5 juin 2027",
    href: "/tournoi-edr/2027",
    buttonLabel: "Découvrir le tournoi",
    enabled: true,
    order: 3,
  },
];

export const enabledHomeCarouselSlides = homeCarouselSlides
  .filter((slide) => slide.enabled)
  .sort((a, b) => a.order - b.order);
