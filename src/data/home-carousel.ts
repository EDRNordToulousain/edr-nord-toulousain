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
    "id": "vente-calendriers-2026",
    "title": "Grande vente des calendriers",
    "description": "À partir du 3 décembre : 5 € le calendrier pour financer le matériel, les sorties et les tournois de l’EDR.",
    "image": "/images/carousel/vente-calendriers-2026.png",
    "imageAlt": "Grande vente des calendriers de l’EDR à partir du 3 décembre, 5 € le calendrier",
    "href": "/actualites#vente-calendriers-2026",
    "buttonLabel": "Découvrir le programme",
    "enabled": true,
    "order": 1
  },
  {
    "id": "repas-noel-2026",
    "title": "Repas de Noël de l’EDR",
    "description": "Cadeaux du Père Noël, diffusion du match, animations et repas : découvrez le programme réservé aux licenciés et familles de l’EDR.",
    "image": "/images/carousel/repas-noel-2026.png",
    "imageAlt": "Programme du repas de Noël de l’EDR : animations et tartiflette au confit de canard",
    "href": "/actualites#repas-noel-2026",
    "buttonLabel": "Découvrir le programme",
    "enabled": true,
    "order": 2
  }
];

export const enabledHomeCarouselSlides = homeCarouselSlides
  .filter((slide) => slide.enabled)
  .sort((a, b) => a.order - b.order);
