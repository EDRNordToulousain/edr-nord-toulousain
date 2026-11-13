# Synchronisation du formulaire bénévole avec l’API

## Diagnostic et limite de vérification

La page publique et `/api/benevoles` n’ont pas pu être consultées depuis ce cloud : le proxy refuse la connexion HTTPS au domaine officiel (403), avec curl comme avec Chromium. Aucun ancien bundle, échec d’hydratation ou mélange de versions **en production** n’a donc été constaté directement. Ces causes ne doivent pas être présentées comme prouvées.

Un scénario équivalent est reproduit localement dans un vrai navigateur : la page reçoit d’abord `registrationOpen=false`, puis une requête indépendante à l’API renvoie `true` avec `countsLive=true`. L’ancien composant ne relisait le statut qu’au montage ou après un POST : il conservait son état fermé au retour sur l’onglet. C’est le défaut client identifié et corrigé, sans présumer qu’il est l’unique cause du constat de production.

## Correction

- Un seul instantané contient les missions, les compteurs et l’état `loading/open/closed/error`. Une réponse valide ne peut plus actualiser les compteurs sans actualiser aussi le statut.
- Chargement initial, retour sur l’onglet, retour en ligne, visibilité et rafraîchissement toutes les 30 secondes lorsque la page est visible : lecture GET sans cache de l’API.
- Annulation et numérotation des requêtes : une réponse ancienne ne peut pas rouvrir une page après une fermeture plus récente ; délai réseau de 10 secondes.
- Les erreurs HTTP, erreurs réseau et réponses mal formées ferment le formulaire, avec un message d’erreur et un bouton Réessayer. Le chargement ne présente plus à tort les inscriptions comme fermées.
- Ouverture seulement avec les deux booléens `registrationOpen=true` et `countsLive=true`. Le bouton demande aussi au moins une mission réellement disponible et le consentement. Les champs obligatoires gardent leur validation native et le serveur conserve sa validation.
- Avant tout POST, relecture de l’API et vérification de toutes les missions sélectionnées : une fermeture ou un changement de quota n’entraîne pas d’envoi partiel.
- Le service worker reste limité à l’espace bénévoles, sans cache de données personnelles ; sa vérification de mise à jour évite le cache HTTP du script.

## Repères de version

Sur Vercel, la page contient une balise `<meta name="edr-volunteers-release">` et l’API renvoie l’en-tête `X-EDR-Release`, basés sur la variable intégrée `VERCEL_GIT_COMMIT_SHA`. Ce SHA public n’est pas un secret ; aucun nouveau paramètre n’est nécessaire. Hors Vercel, la valeur est `local`.

Si deux versions non locales différentes sont détectées, la page bloque l’inscription et propose explicitement d’actualiser, au lieu de recharger automatiquement et d’effacer une saisie. Le formulaire expose aussi `data-registration-state` pour permettre un contrôle en lecture seule de son état après hydratation.

## Validation locale

`pnpm lint`, `pnpm test:volunteers`, `pnpm build`, `pnpm test:volunteers:status`, `pnpm test:volunteers:browser`.

Le test de statut couvre les trois événements à 320 et 1440 px : état fermé périmé face à une API désormais ouverte, focus/visibilité/retour réseau/polling, quotas complets, consentement et sélection, erreur HTTP, JSON mal formé, ancienne réponse retardée, mélange de versions et fermeture détectée juste avant le POST. Il vérifie qu’aucun POST d’inscription ne part dans ces scénarios de refus. Le test d’intégration séparé enregistre plusieurs missions uniquement dans une base PGlite locale et ne contacte aucun fournisseur d’e-mail.

Aucune migration ni modification de capacité, réservation, secret, cron ou paramètre de service n’est incluse dans ce correctif. La migration 005 déjà appliquée en production n’est pas rejouée ; les migrations exécutées par les tests sont exclusivement des fixtures locales jetables.

## Vérification après déploiement

Vérifier le commit du déploiement Vercel, puis ouvrir chacune des trois pages en navigation privée, sans valider de formulaire :

1. Comparer le SHA de la balise de page avec `X-EDR-Release` du GET `/api/benevoles` et le commit attendu.
2. Vérifier `data-registration-state="open"` lorsque les deux flags API sont vrais, sans message de fermeture.
3. Cocher une mission disponible et le consentement : le bouton devient actif ; le retirer ou ne sélectionner aucune mission maintient le bouton désactivé. Une mission complète reste désactivée.
4. Vérifier les compteurs et la mise à jour au retour sur la page. Ne créer aucune inscription fictive et ne déclencher aucun e-mail ou cron de test en production.

Un push sur `main` déclenche le flux de déploiement existant ; il ne suffit pas à prouver le succès de la publication ni à confirmer la cause exacte de l’incident public.
