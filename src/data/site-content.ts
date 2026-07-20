export const site = {
  name: "EDR Nord Toulousain",
  fullName: "École de Rugby Nord Toulousain",
  title: "EDR Nord Toulousain | École de Rugby",
  description:
    "Découvrez l’École de Rugby Nord Toulousain, ses catégories du Baby Rugby aux U14, son calendrier, ses événements, ses partenaires et son tournoi annuel.",
  address: ["2 rue de Verdun", "31790 Saint-Jory"],
  email: "contact.edrnordtoulousain@gmail.com",
  social: "Réseaux sociaux à venir",
} as const;

export const categories = [
  { slug: "baby", name: "Baby Rugby", photoLabel: "PHOTO ÉQUIPE BABY", intro: "Une première découverte du rugby dans un cadre ludique, rassurant et collectif." },
  { slug: "u6", name: "U6", photoLabel: "PHOTO ÉQUIPE U6", intro: "Une catégorie pour découvrir le plaisir de jouer ensemble et progresser à son rythme." },
  { slug: "u8", name: "U8", photoLabel: "PHOTO ÉQUIPE U8", intro: "Les enfants développent leur pratique dans un environnement ludique, progressif et collectif." },
  { slug: "u10", name: "U10", photoLabel: "PHOTO ÉQUIPE U10", intro: "Une étape pour continuer à apprendre, prendre confiance et partager le plaisir du collectif." },
  { slug: "u12", name: "U12", photoLabel: "PHOTO ÉQUIPE U12", intro: "Les jeunes joueuses et joueurs poursuivent leur progression sportive et humaine ensemble." },
  { slug: "u14", name: "U14", photoLabel: "PHOTO ÉQUIPE U14", intro: "Une catégorie tournée vers la progression, l’engagement et l’esprit d’équipe." },
].map((category) => ({
  ...category,
  image: `/images/categories/${category.slug}.jpg`,
  training: { days: "À venir", hours: "À venir", place: "À venir", address: "À venir" },
  educators: [],
  practical: {
    equipment: "Informations à venir",
    documents: "Informations à venir",
    contact: "Informations à venir",
  },
}));

export const values = [
  ["Respect", "Écouter, considérer les autres et grandir ensemble."],
  ["Solidarité", "S’entraider sur le terrain comme en dehors."],
  ["Plaisir", "Jouer, apprendre et partager avec le sourire."],
  ["Progression", "Avancer à son rythme et célébrer chaque étape."],
  ["Esprit d’équipe", "Faire vivre le collectif et la fierté d’être ensemble."],
] as const;

export const partners = {
  mairies: ["Mairie de Saint-Jory", "Mairie de Lespinasse", "Mairie de Bruguières"],
  entreprises: ["Amipub", "Tutti Pizza Bruguières", "Super U Bruguières"],
} as const;

export const events = [
  { slug: "loto", title: "Loto de l’EDR Nord Toulousain" },
  { slug: "tombola", title: "Tombola de l’EDR Nord Toulousain" },
  { slug: "noel", title: "Noël de l’EDR Nord Toulousain" },
  { slug: "calendrier", title: "Le calendrier de l’EDR Nord Toulousain" },
  { slug: "vide-grenier", title: "Vide-grenier de l’EDR Nord Toulousain" },
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
  {
    label: "Événements",
    href: "/evenements",
    children: events.map(({ title, slug }) => ({ label: title.split(" de l’")[0], href: `/evenements/${slug}` })),
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

export const editableCalendars = {
  plateaux: [],
  tournois: [],
} as const;

export const tournament2027 = {
  date: "À venir",
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
  "/evenements",
  ...events.map((event) => `/evenements/${event.slug}`),
  "/partenaires",
  "/partenaires/mairies",
  "/partenaires/entreprises",
  "/contact",
  "/mentions-legales",
  "/politique-de-confidentialite",
] as const;
