# Site officiel de l’EDR Nord Toulousain

Site vitrine de l’École de Rugby Nord Toulousain, réalisé avec Next.js, TypeScript, App Router et Tailwind CSS. Le projet est prêt pour un déploiement automatique sur Vercel depuis la branche `main`.

## Lancer le site

Prérequis : Node.js 20 ou plus récent et pnpm.

```bash
pnpm install
pnpm dev
```

Le site est alors disponible sur `http://localhost:3000`.

Vérifications avant publication :

```bash
pnpm lint
pnpm build
```

## Modifier les informations

Le fichier principal à modifier est :

`src/data/site-content.ts`

Il centralise :

- les coordonnées de l’EDR ;
- les catégories et leurs textes ;
- les informations d’entraînement ;
- les éducateurs ;
- les partenaires ;
- les événements ;
- les informations du tournoi 2027 ;
- la navigation.

Les calendriers de la saison sont centralisés séparément dans :

`src/data/calendar.ts`

Ce fichier contient la liste des mois et les tableaux `seasonEvents.plateaux` et `seasonEvents.tournois`.

Les réunions et les comptes rendus sont centralisés dans :

`src/data/meetings.ts`

La liste des photographies de la galerie est centralisée dans :

`src/data/gallery.ts`

Toutes les informations qui ne sont pas encore officielles affichent volontairement « À venir » ou « Informations à venir ». Ne les remplacer qu’avec des informations validées par l’EDR.

## Remplacer les images

Déposer chaque fichier au chemin exact indiqué ci-dessous. Les composants affichent automatiquement un placeholder si un fichier est absent.

| Usage | Fichier attendu |
|---|---|
| Logo officiel | `public/images/logo-edr.png` |
| Grande photo d’accueil | `public/images/hero-enfants-edr.jpg` |
| Photo de groupe de présentation | `public/images/presentation-groupe.jpg` |
| Équipe Baby Rugby | `public/images/categories/baby.jpg` |
| Équipe U6 | `public/images/categories/u6.png` |
| Équipe U8 | `public/images/categories/u8.png` |
| Équipe U10 | `public/images/categories/u10.png` |
| Équipe U12 | `public/images/categories/u12.png` |
| Équipe U14 | `public/images/categories/u14.png` |
| Logos des mairies | `public/images/partners/mairies/` |
| Logos des entreprises | `public/images/partners/entreprises/` |
| Visuels d’actualité | `public/images/news/` |
| Visuels du carrousel d’accueil | `public/images/carousel/` |
| Forum des associations | `public/images/carousel/forums-associations.jpeg` |
| Affiche du tournoi 2027 | `public/images/tournoi/tournoi-2027.jpeg` |
| Galerie LD Studio | `public/images/gallery/ld-studio/ld-studio-01.jpg` à `ld-studio-20.jpg` |
| Portraits du bureau | `public/images/leadership/` |
| Portraits des éducateurs | `public/images/educators/` |
| Affiches d’événements | `public/images/events/nom-evenement.jpg` |
| Photos de galerie LD Studio | `public/images/gallery/ld-studio/` |

Conseils :

- utiliser des images Web optimisées ;
- conserver les noms de fichiers exacts ;
- privilégier le format JPEG pour les photographies et PNG pour les logos ;
- renseigner un texte alternatif descriptif lors de l’ajout d’un nouvel emplacement.

## Ajouter un éducateur

Dans la catégorie concernée dans `src/data/site-content.ts`, ajouter une entrée dans le tableau `educators`.

```ts
{
  name: "Prénom Nom",
  image: "/images/educators/prenom-nom.jpg",
  categoryContact: false,
}
```

Déposer ensuite le portrait dans `public/images/educators/`. Si `image` est absent ou que le fichier n’existe pas encore, la carte affiche automatiquement « Photo à venir ».

Pour modifier un entraînement, mettre à jour les champs `days`, `hours`, `place` et `address` de la catégorie concernée. Les informations pratiques sont regroupées dans `practical`.

## Ajouter un partenaire

Ajouter une entrée dans `partners.entreprises` ou `partners.mairies` dans `src/data/site-content.ts`. Le champ `officialUrl` est facultatif. Utiliser `hideMissingLink: true` lorsqu’aucun bouton ni aucune mention de lien ne doit être affiché.

Les nouveaux logos attendus sont :

| Partenaire | Fichier attendu |
|---|---|
| LD Studio | `public/images/partners/entreprises/ld-studio.png` |
| RO Maintenance | `public/images/partners/entreprises/ro-maintenance.jpg` |
| EM’ASSIST | `public/images/partners/entreprises/em-assist.png` |

## Ajouter une date au calendrier

Dans `src/data/calendar.ts`, ajouter une entrée dans `seasonEvents.plateaux` ou `seasonEvents.tournois`. Renseigner uniquement des dates et lieux officiellement confirmés.

```ts
{
  date: "2026-10-03",
  category: "U10",
  title: "Nom officiel du rendez-vous",
  commune: "Commune",
  venue: "Lieu précis",
  time: "10 h 00",
  details: "Informations pratiques validées",
  directionsUrl: "Lien d’itinéraire vérifié",
}
```

Supprimer l’exemple après l’avoir lu : il sert uniquement à montrer la structure et n’est pas affiché sur le site.

## Gérer le carrousel « À la une »

Les diapositives de la page d’accueil sont centralisées dans `src/data/home-carousel.ts`.

Pour ajouter une actualité :

1. déposer son image, sans espace ni accent dans le nom, dans `public/images/carousel/` ;
2. ajouter une entrée dans `homeCarouselSlides` avec un identifiant unique, le titre, la description, le chemin de l’image, son texte alternatif et le lien de destination ;
3. choisir sa position avec `order` (le plus petit nombre apparaît en premier) ;
4. utiliser `enabled: false` pour masquer temporairement la diapositive sans supprimer ses données.

Le délai de défilement automatique est défini par `HOME_CAROUSEL_INTERVAL_MS`. Sa valeur est exprimée en millisecondes : `6_000` correspond à six secondes.

Une diapositive peut ne pas avoir d’image. Dans ce cas, le carrousel affiche une carte graphique cohérente avec le site à partir du titre et de la description fournis.

## Ajouter une réunion ou un compte rendu

Dans `src/data/meetings.ts` :

- ajouter les futures réunions dans `meetings` avec la date, l’heure, le lieu, le type de réunion et le public concerné ;
- déposer les comptes rendus PDF dans `public/documents/reunions/` ;
- ajouter chaque document dans `meetingMinutes` avec son titre, sa date, sa description et son chemin public.

## Ajouter des photographies à la galerie

1. Déposer les images Web optimisées dans `public/images/gallery/ld-studio/`.
2. Ajouter chaque fichier dans `galleryPhotos` dans `src/data/gallery.ts`.
3. Utiliser un texte alternatif général et non identifiant, sans citer le nom d’un enfant.

## Documents publics

| Document | Chemin public |
|---|---|
| Dossier de partenariat — École de Rugby Nord Toulousain | `public/documents/partenaires/dossier-partenariat-edr-nord-toulousain.pdf` |
| Dossier d’inscription 2026/2027 — École de Rugby Nord Toulousain | `public/documents/inscriptions/dossier-inscription-edr-2026-2027.docx` |

Les fichiers sont proposés à la consultation et au téléchargement depuis les pages Partenaires et Actualités. Ils doivent être remplacés sans modifier leurs chemins pour éviter de casser les boutons existants.

## Sources officielles des logos partenaires

Les logos sont affichés avec `object-fit: contain` et ne sont ni redessinés ni recadrés.

| Partenaire | Source officielle |
|---|---|
| Mairie de Cépet | [cepet.fr — logo d’en-tête](https://www.cepet.fr/skins/cepet2/resources/img/header-logo-sm.png) |
| Mairie de Saint-Jory | [saint-jory.fr — logo officiel](https://saint-jory.fr/app/uploads/2019/07/logo-3.png) |
| Mairie de Lespinasse | [ville-lespinasse.fr — logo officiel](https://www.ville-lespinasse.fr/wp-content/uploads/2018/11/logo-Lespinasse-vignette.png) |
| Mairie de Bruguières | [mairie-bruguieres.fr — ressource du site officiel](https://files.appli-intramuros.com/img/city_logo/agglo/713/d901a54e3ebd5a82629246729170d756_bruguieres.png) |
| Mairie de Villeneuve-lès-Bouloc | [villeneuvelesbouloc.fr — logo officiel](https://static.neopse.com/medias/p/2177/site/c7/b4/92/c7b492241c30a058295427e0dca83c7a7fe4165d.jpg) |
| Tutti Pizza Bruguières | [site officiel du restaurant](https://mediab.izipass.cloud/Media/Thumbs/0161/0161547-150.png) |
| Les Salaisons de Saint-Sauveur | [site officiel de l’entreprise](https://www.salaisonsdesaintsauveur.fr/wp-content/uploads/2025/08/cropped-Logo-StSauveur-CMJN-2.png) |
| Crédit Agricole Saint-Jory | [Crédit Agricole — logo national officiel](https://www.credit-agricole.fr/content/dam/assetsca/master/public/commun/images/autre/images/NPC-logo_Agir_chaque_jour_CA_H_Desktop-1.svg) |

Les logos Amipub et Super U Bruguières restent volontairement en attente. Les chemins des logos LD Studio, RO Maintenance et EM’ASSIST sont déjà configurés : il suffit de déposer les fichiers fournis aux emplacements indiqués plus haut.

## Pages disponibles

Le site contient l’accueil, la présentation, les six catégories, la boutique, les calendriers de plateaux et tournois, le tournoi 2027, la galerie, les actualités, les six événements, les réunions et comptes rendus, les partenaires, le contact, les mentions légales, la politique de confidentialité et une page 404 personnalisée.

## Déploiement Vercel

Importer ce dépôt dans Vercel avec les réglages Next.js par défaut. Aucune base de données, clé API ou variable d’environnement n’est nécessaire. Chaque nouveau commit poussé sur `main` déclenche ensuite automatiquement un nouveau déploiement si le dépôt est déjà connecté à Vercel.
