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
    id: "loto-2026",
    title: "Loto de l’EDR Nord Toulousain",
    description: "Dimanche 11 octobre 2026 à 15h, Salle Xeraco à Bruguières.",
    image: "/images/events/loto-11-octobre-2026.png",
    imageAlt: "Affiche du loto de l’EDR Nord Toulousain du 11 octobre 2026 à Bruguières",
    href: "/evenements/loto",
    buttonLabel: "Découvrir le loto",
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
    id: "vide-grenier-2026",
    title: "Vide-grenier de l’EDR Nord Toulousain",
    description: "Dimanche 8 novembre 2026 à Lespinasse.",
    image: "/images/events/vide-grenier-8-novembre-2026.jpeg",
    imageAlt: "Affiche du vide-grenier de l’EDR Nord Toulousain du 8 novembre 2026 à Lespinasse",
    href: "/evenements/vide-grenier",
    buttonLabel: "Réserver un emplacement",
    enabled: true,
    order: 3,
  },
];

export const enabledHomeCarouselSlides = homeCarouselSlides
  .filter((slide) => slide.enabled)
  .sort((a, b) => a.order - b.order);
