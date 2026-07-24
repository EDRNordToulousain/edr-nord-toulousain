export const site = {
  name: "EDR Nord Toulousain",
  fullName: "École de Rugby Nord Toulousain",
  title: "EDR Nord Toulousain | École de Rugby",
  description:
    "Découvrez l’École de Rugby Nord Toulousain, ses catégories du Baby Rugby aux U14, son calendrier, ses événements, ses partenaires et son tournoi annuel.",
  address: ["2 rue de Verdun", "31790 Saint-Jory"],
  email: "contact.edrnordtoulousain@gmail.com",
  partnershipEmail: "partenaires.edrnordtoulousain@gmail.com",
  siret: "924 035 793 00018",
  social: "Réseaux sociaux à venir",
  canonicalUrl: "https://www.edr-nordtoulousain.fr",
} as const;

export type Educator = {
  name: string;
  image?: string;
  categoryContact?: boolean;
  pendingLabel?: string;
};

export type Category = {
  slug: string;
  name: string;
  photoLabel: string;
  intro: string;
  image: string;
  training: {
    days: string;
    hours: string;
    place: string;
    address: string;
  };
  educators: readonly Educator[];
  practical: {
    equipment: string;
    documents: string;
    contact: string;
  };
};

export const categories: readonly Category[] = [
  {
    slug: "baby",
    name: "Baby Rugby",
    photoLabel: "PHOTO ÉQUIPE BABY",
    intro: "Une première découverte du rugby dans un cadre ludique, rassurant et collectif.",
    image: "/images/categories/baby.jpg",
    training: {
      days: "Samedi",
      hours: "De 10 h 30 à 11 h 30",
      place: "Stade David Berty",
      address: "Saint-Jory, 31790",
    },
    educators: [
      { name: "Tiphaine Plagnol", image: "/images/educators/tiphaine-plagnol.jpeg", categoryContact: true },
      { name: "Éducateur supplémentaire", pendingLabel: "Éducateur supplémentaire à venir" },
    ],
    practical: {
      equipment: "Tenue de sport",
      documents: "Dossier d’inscription",
      contact: "Tiphaine Plagnol",
    },
  },
  {
    slug: "u6",
    name: "U6",
    photoLabel: "PHOTO ÉQUIPE U6",
    intro: "Une catégorie pour découvrir le plaisir de jouer ensemble et progresser à son rythme.",
    image: "/images/categories/u6.jpg",
    training: {
      days: "Mercredi",
      hours: "De 17 h 00 à 18 h 00",
      place: "Stade David Berty",
      address: "Saint-Jory, 31790",
    },
    educators: [
      { name: "Kamélia Belkacem", image: "/images/educators/kamelia-belkacem.jpeg", categoryContact: true },
      { name: "Jean-Luc Ravin" },
      { name: "Florian Dubois" },
    ],
    practical: {
      equipment: "Tenue de sport, crampons et protège-dents",
      documents: "Dossier d’inscription",
      contact: "Kamélia Belkacem",
    },
  },
  {
    slug: "u8",
    name: "U8",
    photoLabel: "PHOTO ÉQUIPE U8",
    intro: "Les enfants développent leur pratique dans un environnement ludique, progressif et collectif.",
    image: "/images/categories/u8.jpg",
    training: {
      days: "Mercredi",
      hours: "De 17 h 00 à 18 h 30",
      place: "Stade David Berty",
      address: "Saint-Jory, 31790",
    },
    educators: [
      { name: "Alexandre Ruzzante", image: "/images/educators/alexandre-ruzzante.png", categoryContact: true },
      { name: "Philippe Salvatge", image: "/images/educators/philippe-salvatge.jpeg" },
      { name: "Thierry Serre", image: "/images/educators/thierry-serre.png" },
      { name: "Audrey Mechenet", image: "/images/educators/audrey-mechenet.jpeg" },
      { name: "Mathieu Ricard", image: "/images/educators/mathieu-ricard.png" },
      { name: "Marie-Eve Alcaraz", image: "/images/educators/marie-eve-alcaraz.jpeg" },
    ],
    practical: {
      equipment: "Tenue de sport, crampons et protège-dents",
      documents: "Dossier d’inscription",
      contact: "Alexandre Ruzzante",
    },
  },
  {
    slug: "u10",
    name: "U10",
    photoLabel: "PHOTO ÉQUIPE U10",
    intro: "Une étape pour continuer à apprendre, prendre confiance et partager le plaisir du collectif.",
    image: "/images/categories/u10.jpg",
    training: {
      days: "Mercredi et vendredi",
      hours: "Mercredi de 17 h 30 à 19 h 00 · Vendredi de 18 h 00 à 19 h 00",
      place: "Stade David Berty",
      address: "Saint-Jory, 31790",
    },
    educators: [
      { name: "Pierre Peries", categoryContact: true },
      { name: "Bruno Cattaï" },
      { name: "Romain Gomes" },
      { name: "Mathieu Jeannesson" },
      { name: "Loic Szcypta" },
      { name: "Bruno Malandain", image: "/images/educators/bruno-malandain.jpeg" },
    ],
    practical: {
      equipment: "Tenue de sport, crampons et protège-dents",
      documents: "Dossier d’inscription",
      contact: "Pierre Peries",
    },
  },
  {
    slug: "u12",
    name: "U12",
    photoLabel: "PHOTO ÉQUIPE U12",
    intro: "Les jeunes joueuses et joueurs poursuivent leur progression sportive et humaine ensemble.",
    image: "/images/categories/u12.jpg",
    training: {
      days: "Mercredi et vendredi",
      hours: "Mercredi de 17 h 30 à 19 h 00 · Vendredi de 18 h 00 à 19 h 00",
      place: "Stade David Berty",
      address: "Saint-Jory, 31790",
    },
    educators: [
      { name: "Clément Sorbes-Ballesteros", image: "/images/educators/clement-sorbes-ballesteros.jpg", categoryContact: true },
      { name: "Romain Destarac", image: "/images/leadership/romain-destarac.jpeg" },
      { name: "Badre Saddik", image: "/images/educators/badre-saddik.jpeg" },
      { name: "Pierre Cabot" },
      { name: "Mathieu Maurieres", image: "/images/educators/mathieu-maurieres.jpeg" },
      { name: "Stephan Delattre", image: "/images/educators/stephan-delattre.jpeg" },
      { name: "Xavier Gratzer", image: "/images/educators/xavier-gratzer.jpeg" },
    ],
    practical: {
      equipment: "Tenue de sport, crampons et protège-dents",
      documents: "Dossier d’inscription",
      contact: "Clément Sorbes-Ballesteros",
    },
  },
  {
    slug: "u14",
    name: "U14",
    photoLabel: "PHOTO ÉQUIPE U14",
    intro: "Une catégorie tournée vers la progression, l’engagement et l’esprit d’équipe.",
    image: "/images/categories/u14.jpg",
    training: {
      days: "Mercredi et vendredi",
      hours: "Mercredi de 18 h 30 à 20 h 00 · Vendredi de 18 h 00 à 19 h 00",
      place: "Complexe sportif René Albus",
      address: "Bruguières, 31150",
    },
    educators: [
      { name: "Alexis Komaroff", image: "/images/educators/alexis-komaroff.png", categoryContact: true },
      { name: "Clément Chavaux", image: "/images/educators/clement-chavaux.jpeg" },
      { name: "Pierre Badens", image: "/images/educators/pierre-badens.jpeg" },
      { name: "Nathan Bonnin" },
      { name: "Christophe Bonnin" },
    ],
    practical: {
      equipment: "Tenue de sport, crampons et protège-dents",
      documents: "Dossier d’inscription",
      contact: "Alexis Komaroff",
    },
  },
];

export const values = [
  ["Respect", "Écouter, considérer les autres et grandir ensemble."],
  ["Solidarité", "S’entraider sur le terrain comme en dehors."],
  ["Plaisir", "Jouer, apprendre et partager avec le sourire."],
  ["Progression", "Avancer à son rythme et célébrer chaque étape."],
  ["Esprit d’équipe", "Faire vivre le collectif et la fierté d’être ensemble."],
] as const;

export type Partner = {
  name: string;
  logo?: string;
  officialUrl?: string;
  linkLabel?: string;
  sourceUrl?: string;
  note?: string;
  hideMissingLink?: boolean;
};

export const partners: { mairies: readonly Partner[]; entreprises: readonly Partner[] } = {
  mairies: [
    { name: "Mairie de Cépet", logo: "/images/partners/mairies/cepet.jpg", officialUrl: "https://www.cepet.fr/", sourceUrl: "https://www.cepet.fr/skins/cepet2/resources/img/header-logo-sm.png" },
    { name: "Mairie de Saint-Jory", logo: "/images/partners/mairies/saint-jory.png", officialUrl: "https://saint-jory.fr/", sourceUrl: "https://saint-jory.fr/app/uploads/2019/07/logo-3.png" },
    { name: "Mairie de Lespinasse", logo: "/images/partners/mairies/lespinasse.png", officialUrl: "https://www.ville-lespinasse.fr/", sourceUrl: "https://www.ville-lespinasse.fr/wp-content/uploads/2018/11/logo-Lespinasse-vignette.png" },
    { name: "Mairie de Bruguières", logo: "/images/partners/mairies/bruguieres.png", officialUrl: "https://www.mairie-bruguieres.fr/", sourceUrl: "https://files.appli-intramuros.com/img/city_logo/agglo/713/d901a54e3ebd5a82629246729170d756_bruguieres.png" },
    { name: "Mairie de Villeneuve-lès-Bouloc", logo: "/images/partners/mairies/villeneuve-les-bouloc-logo.jpg", officialUrl: "https://www.villeneuvelesbouloc.fr/", sourceUrl: "https://static.neopse.com/medias/p/2177/site/c7/b4/92/c7b492241c30a058295427e0dca83c7a7fe4165d.jpg" },
  ],
  entreprises: [
    { name: "Amipub", officialUrl: "https://amipub.com/", note: "Logo officiel à fournir" },
    { name: "Tutti Pizza Bruguières", logo: "/images/partners/entreprises/tutti-pizza-bruguieres.png", officialUrl: "https://bruguieres.tutti-pizza.com/", sourceUrl: "https://mediab.izipass.cloud/Media/Thumbs/0161/0161547-150.png" },
    { name: "Super U Bruguières", officialUrl: "https://www.magasins-u.com/magasin/superu-bruguieres", note: "Logo officiel à fournir" },
    { name: "Les Salaisons de Saint-Sauveur", logo: "/images/partners/entreprises/salaisons-saint-sauveur.png", officialUrl: "https://www.salaisonsdesaintsauveur.fr/", sourceUrl: "https://www.salaisonsdesaintsauveur.fr/wp-content/uploads/2025/08/cropped-Logo-StSauveur-CMJN-2.png" },
    { name: "Crédit Agricole Saint-Jory", logo: "/images/partners/entreprises/credit-agricole.svg", officialUrl: "https://www.credit-agricole.fr/particulier/agence/toulouse-31/saint-jory-4675.html", sourceUrl: "https://www.credit-agricole.fr/content/dam/assetsca/master/public/commun/images/autre/images/NPC-logo_Agir_chaque_jour_CA_H_Desktop-1.svg", note: "Logo national officiel" },
    {
      name: "LD Studio",
      logo: "/images/partners/entreprises/ld-studio.png",
      officialUrl: "https://www.instagram.com/ldstudio31/",
      linkLabel: "Découvrir LD Studio sur Instagram",
    },
    {
      name: "RO Maintenance",
      logo: "/images/partners/entreprises/ro-maintenance.jpg",
      hideMissingLink: true,
    },
    {
      name: "EM’ASSIST",
      logo: "/images/partners/entreprises/em-assist.png",
      hideMissingLink: true,
    },
  ],
};

export const leadership = [
  { familyName: "DESTARAC", givenName: "Romain", displayName: "Romain Destarac", role: "Co-président", image: "/images/leadership/romain-destarac.jpeg" },
  { familyName: "SIMON", givenName: "Séverine", displayName: "Séverine Simon", role: "Co-présidente", image: "/images/leadership/severine-simon.jpg" },
  { familyName: "SORBES-BALLESTEROS", givenName: "Leslie", displayName: "Leslie Sorbes-Ballesteros", role: "Trésorière", image: "/images/leadership/leslie-sorbes-ballesteros.png" },
  { familyName: "CABOT", givenName: "Peggy", displayName: "Peggy Cabot", role: "Secrétaire", image: "/images/leadership/peggy-cabot.png" },
] as const;

export const clubHistory = [
  "Créé en 1973, le club RCSJB est formé de deux équipes séniors évoluant en Championnat Promotion Honneur, d’un pôle Jeunes avec une équipe Cadets (M16) et une équipe Juniors (M19) et d’une école de rugby NORD TOULOUSAIN, pour les enfants de 3 à 14 ans, regroupant les communes de Saint-Jory, Bruguières, Cépet, Villeneuve-lès-Bouloc et Lespinasse.",
  "Toutes ces équipes sont encadrées par une quarantaine de dirigeants et éducateurs ou entraîneurs diplômés.",
] as const;

export const documents = {
  partner: {
    title: "Dossier de partenariat — École de Rugby Nord Toulousain",
    path: "/documents/partenaires/dossier-partenariat-edr-nord-toulousain.pdf",
  },
  registration: {
    title: "Dossier d’inscription 2026/2027 — École de Rugby Nord Toulousain",
    path: "/documents/inscriptions/dossier-inscription-edr-2026-2027.docx",
  },
} as const;

export const news = [
  {
    id: "reprise-entrainements",
    title: "Reprise des entraînements — Saison 2026-2027",
    description: "Reprise annoncée le mercredi 2 septembre 2026 : U6 et U8 à 17 h, U10 et U12 à 17 h 30 au stade de Saint-Jory, et U14 à 18 h au stade de Bruguières.",
    path: "/images/news/reprise-entrainements-2026.jpg",
    alt: "Affiche de reprise des entraînements de l’EDR Nord Toulousain le 2 septembre 2026",
  },
  {
    id: "reunion-rentree",
    title: "Réunion de rentrée des éducateurs et bénévoles",
    description: "Réunion de préparation de la saison 2026-2027 le vendredi 28 août 2026 à partir de 18 h, au Club House, rue de Verdun à Saint-Jory.",
    path: "/images/news/reunion-rentree-2026.jpg",
    alt: "Affiche de la réunion de rentrée des éducateurs et bénévoles le 28 août 2026",
  },
] as const;

export const events = [
  { slug: "loto", title: "Nos lotos" },
  { slug: "tombola", title: "Notre tombola" },
  { slug: "noel", title: "Noël de l’EDR", date: "12 décembre" },
  { slug: "calendrier", title: "Vente de calendrier" },
  { slug: "vide-grenier", title: "Notre vide-grenier" },
  { slug: "voyage-fin-annee", title: "Notre voyage de fin d’année", categories: "U10 · U12 · U14" },
] as const;

export const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Présentation", href: "/presentation" },
  {
    label: "Catégories",
    href: "/categories",
    children: categories.map(({ name, slug }) => ({ label: name, href: `/categories/${slug}` })),
  },
  { label: "Boutique", href: "/boutique" },
  {
    label: "Calendrier",
    href: "/calendrier",
    children: [
      { label: "Plateaux", href: "/calendrier/plateaux" },
      { label: "Tournois", href: "/calendrier/tournois" },
    ],
  },
  { label: "Tournoi EDR", href: "/tournoi-edr" },
  { label: "Galerie", href: "/galerie" },
  { label: "Actualités", href: "/actualites" },
  {
    label: "Événements",
    href: "/evenements",
    children: events.map(({ title, slug }) => ({ label: title, href: `/evenements/${slug}` })),
  },
  {
    label: "Réunions",
    href: "/reunions",
    children: [
      { label: "Calendrier des réunions", href: "/reunions/calendrier" },
      { label: "Comptes rendus", href: "/reunions/comptes-rendus" },
    ],
  },
  {
    label: "Partenaires",
    href: "/partenaires",
    children: [
      { label: "Les mairies", href: "/partenaires/mairies" },
      { label: "Les entreprises", href: "/partenaires/entreprises" },
    ],
  },
] as const;

export const tournament2027 = {
  date: "Samedi 5 juin 2027",
  target: "2027-06-05T00:00:00+02:00",
  poster: "/images/tournoi/tournoi-2027.jpeg",
  place: "À venir",
  categories: "À venir",
  hours: "À venir",
  registration: "À venir",
} as const;

export const allPaths = [
  "/presentation",
  "/categories",
  ...categories.map((item) => `/categories/${item.slug}`),
  "/boutique",
  "/calendrier",
  "/calendrier/plateaux",
  "/calendrier/plateaux/saison-2026-2027",
  "/calendrier/tournois",
  "/calendrier/tournois/saison-2026-2027",
  "/tournoi-edr",
  "/tournoi-edr/2027",
  "/galerie",
  "/actualites",
  "/evenements",
  ...events.map((event) => `/evenements/${event.slug}`),
  "/reunions",
  "/reunions/calendrier",
  "/reunions/comptes-rendus",
  "/partenaires",
  "/partenaires/mairies",
  "/partenaires/entreprises",
  "/contact",
  "/mentions-legales",
  "/politique-de-confidentialite",
] as const;
