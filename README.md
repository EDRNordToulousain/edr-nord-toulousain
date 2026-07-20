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
- les calendriers de plateaux et de tournois ;
- les informations du tournoi 2027 ;
- la navigation.

Toutes les informations qui ne sont pas encore officielles affichent volontairement « À venir » ou « Informations à venir ». Ne les remplacer qu’avec des informations validées par l’EDR.

## Remplacer les images

Déposer chaque fichier au chemin exact indiqué ci-dessous. Les composants affichent automatiquement un placeholder si un fichier est absent.

| Usage | Fichier attendu |
|---|---|
| Logo officiel | `public/images/logo-edr.png` |
| Grande photo d’accueil | `public/images/hero-enfants-edr.jpg` |
| Photo de groupe de présentation | `public/images/presentation-groupe.jpg` |
| Équipe Baby Rugby | `public/images/categories/baby.jpg` |
| Équipe U6 | `public/images/categories/u6.jpg` |
| Équipe U8 | `public/images/categories/u8.jpg` |
| Équipe U10 | `public/images/categories/u10.jpg` |
| Équipe U12 | `public/images/categories/u12.jpg` |
| Équipe U14 | `public/images/categories/u14.jpg` |
| Logos partenaires | `public/images/partners/nom-du-partenaire.png` |
| Affiches d’événements | `public/images/events/nom-evenement.jpg` |
| Photos de galerie | `public/images/gallery/photo-1.jpg`, `photo-2.jpg`, etc. |

Conseils :

- utiliser des images Web optimisées ;
- conserver les noms de fichiers exacts ;
- privilégier le format JPEG pour les photographies et PNG pour les logos ;
- renseigner un texte alternatif descriptif lors de l’ajout d’un nouvel emplacement.

## Ajouter un éducateur

Dans la catégorie concernée dans `src/data/site-content.ts`, ajouter une entrée dans le tableau `educators`. Les cartes sont prévues pour recevoir une photographie, le prénom et le nom, le rôle et une courte présentation. Tant que ces données ne sont pas validées, conserver le tableau vide.

## Ajouter une date au calendrier

Les tableaux `editableCalendars.plateaux` et `editableCalendars.tournois` sont les sources destinées aux futures dates. Renseigner uniquement des dates et lieux officiellement confirmés.

## Pages disponibles

Le site contient l’accueil, la présentation, les six catégories, la boutique, les calendriers de plateaux et tournois, le tournoi 2027, la galerie, les cinq événements, les partenaires, le contact, les mentions légales, la politique de confidentialité et une page 404 personnalisée.

## Déploiement Vercel

Importer ce dépôt dans Vercel avec les réglages Next.js par défaut. Aucune base de données, clé API ou variable d’environnement n’est nécessaire. Chaque nouveau commit poussé sur `main` déclenche ensuite automatiquement un nouveau déploiement si le dépôt est déjà connecté à Vercel.
