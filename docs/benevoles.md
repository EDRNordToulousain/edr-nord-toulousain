# Espace bénévoles EDR Nord Toulousain

La page `/benevoles` est intégrée au site officiel, à sa navigation et à son sitemap. Le logo officiel est conservé et sert aux icônes installables. L’accueil présente les cartes des événements. Chaque carte ouvre `/benevoles/<identifiant>` avec les missions et un formulaire propres à cet événement. Les neuf missions sont communes aux trois lotos ; les lieux, horaires, titres et catalogues de missions sont centralisés dans `src/lib/volunteers/events.ts`.

## État réel des services

Aucun binding ni variable Supabase, Resend ou cron n'était configuré dans la machine cloud inspectée. Pas de configuration locale Vercel, ni de jeton Vercel présent. La lecture Git fonctionne, mais l'API GitHub et le domaine officiel sont bloqués par le proxy (403). Leurs domaines ont été ajoutés au brouillon réseau, avec conservation du domaine de référence précédemment proposé ; ce brouillon n'est pas appliqué à la machine. Les réglages du projet Vercel distant ne sont donc pas vérifiables ici.

Le README documente le déploiement Vercel automatique depuis `main`. Un push sur cette branche ne prouve ni le succès du déploiement, ni l'activation du domaine, des e-mails ou du cron. Vérifier les résultats dans Vercel avant de déclarer la page publiée. Aucun e-mail réel n'est envoyé pour les tests.

## Capacités confirmées

| Mission commune aux trois événements | Capacité |
| --- | --- |
| Installation des tables, chaises et de la buvette | Sans limite |
| Encaissement | 4 |
| Tenue de la buvette | 3 |
| Contrôle des cartons | 2 |
| Annonce des numéros | 1 |
| Distribution des numéros | 1 |
| Rangement des tables et chaises | Sans limite |
| Balayage | Sans limite |
| Rangement de la buvette | Sans limite |

Une place d'encaissement est réservée à Lespinasse, conformément à la demande initiale : 3 places restantes sur 4. Aucune réservation supplémentaire n'est inventée pour les deux autres événements. La migration des capacités ne modifie aucune réservation ni inscription. Les missions d’installation, de rangement et de balayage sont sans plafond (`capacity=null`) ; elles restent sélectionnables et ne deviennent jamais complètes. Les missions limitées affichent les places prises et restantes quand les compteurs sont en direct.

Sans services configurés, la page affiche la répartition prévue et la réservation connue, sans présenter ces nombres comme des compteurs en direct. Si une base déjà configurée devient indisponible, le formulaire reste fermé. Avec la base configurée, seuls les compteurs agrégés sont lus et les missions restent visibles même lorsqu'elles ne sont pas ouvertes.

## Configuration Supabase

Créer ou réutiliser un projet, de préférence en région UE, et appliquer **dans l'ordre** dans le SQL Editor d'administration :

1. `supabase/migrations/202611130001_volunteers.sql`
2. `supabase/migrations/202611130002_missions.sql`
3. `supabase/migrations/202611130003_confirmed_capacities.sql`
4. `supabase/migrations/202611130004_unlimited_availability.sql`

Ne pas réexécuter les migrations déjà appliquées. Appliquer uniquement les migrations encore manquantes, dans l’ordre. Si les trois premières sont installées, appliquer seulement la quatrième. La troisième fixe les effectifs confirmés et retire l’interdiction temporaire des capacités illimitées, sans toucher aux réservations, personnes, affectations, statuts d’ouverture ou e-mails existants.

Les tables ont RLS activé, sans politique publique. Les rôles `anon` et `authenticated` ne peuvent ni consulter les tables ni invoquer les fonctions serveur. La clé serveur `service_role` reste exclusivement côté serveur. L'administration utilise le tableau de bord Supabase via des comptes habilités avec MFA ; aucune API publique ne donne les coordonnées. Les accès doivent être limités aux responsables de l'EDR.

La quatrième migration active les quatre missions sans plafond pour les trois lotos ; elle préserve les fermetures des missions limitées. Avant ouverture, activer les autres missions confirmées (`enabled=true`) selon la décision de l’administration. Une capacité `null` signifie désormais explicitement « sans limite », et non « à confirmer ». Le verrou global d’inscription reste désactivé jusqu’à configuration et validation des services. Une réservation transactionnelle contrôle toutes les missions sélectionnées avant d'enregistrer quoi que ce soit. Les doublons e-mail/mission sont refusés et les verrous des missions sont pris dans un ordre stable.

## Variables : où saisir les valeurs

Dans Vercel : **Project → Settings → Environment Variables**, séparément pour Preview et Production. Les variables n'agissent sur un déploiement qu'après son redéploiement. En local : `.env.local`, ignoré par Git, d'après `.env.example`. Dans le cloud : paramètres de l'environnement → variables/secrets et accès réseau aux domaines nécessaires. Ne jamais donner les valeurs dans le chat, les journaux, le dépôt ou une variable `NEXT_PUBLIC_*`.

| Variable serveur | Usage |
| --- | --- |
| `VOLUNTEERS_REGISTRATION_ENABLED` | `false` par défaut ; `true` uniquement après validation de la page et des services |
| `SUPABASE_URL` | URL HTTPS exacte du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé serveur `service_role`, jamais la clé publique du navigateur |
| `RESEND_API_KEY` | Clé d'envoi du projet Resend |
| `VOLUNTEERS_EMAIL_FROM` | Expéditeur sur le domaine réellement vérifié, ex. `EDR Bénévoles <benevoles@domaine-verifie>` |
| `VOLUNTEERS_ORIGIN` | Origine exacte du site, sans slash final ; en local `http://localhost:3000` |
| `CRON_SECRET` | Secret aléatoire fort ; Vercel l'envoie automatiquement dans l'en-tête Bearer du cron |
| `VOLUNTEERS_RATE_SALT` | Secret aléatoire distinct pour pseudonymiser le budget IP |

Le verrou est effectif côté API et cron : flag absent, valeur différente de `true` ou service manquant ⇒ aucun enregistrement ni envoi. Renseigner les services seul n'ouvre pas les inscriptions. Revenir à `false` suspend également les envois.

Accès réseau cloud à autoriser pour les services : domaine exact du projet Supabase et `api.resend.com`. Pour vérifier la publication depuis ce cloud : `api.github.com`, `www.edr-nordtoulousain.fr`, `edr-nordtoulousain.fr` et, si nécessaire, le domaine du déploiement Vercel retourné par le projet. Le brouillon réseau sauvegardé reste distinct de la configuration réellement appliquée et d'une publication du site.

## Resend : expéditeur et destinataires

Dans **Resend → Domains**, vérifier le domaine possédé par l'EDR en installant les enregistrements DNS SPF/DKIM demandés ; attendre l'état Verified. Créer ensuite une clé limitée à l'envoi dans **API Keys**. Choisir un `VOLUNTEERS_EMAIL_FROM` sur ce domaine. Le fait de renseigner la variable ne prouve pas que le domaine est vérifié.

`communication.edrnordtoulousain@gmail.com` est le destinataire fixe des notifications et le Reply-To de tous les messages. Ce n'est pas l'expéditeur : le domaine Gmail ne peut pas être déclaré comme domaine vérifié de l'EDR. Chaque inscription ajoute, dans la même transaction, une confirmation au bénévole et une notification administrative avec nom, prénom, catégorie, e-mail et missions. Le contenu est du texte brut et les données ne sont jamais renvoyées au public.

Les tests remplacent l'envoi par des réponses locales simulées ; ils ne contactent pas Resend. Vérifier le domaine, la clé et les droits dans les paramètres du prestataire sans envoyer d'e-mail de test réel. Ne déclarer les livraisons effectives qu'après observation d'envois autorisés en exploitation.

## Planification et rappels

`vercel.json` ne définit pas de cron Vercel : le projet utilise l’offre Hobby, qui ne prend pas en charge une exécution chaque minute. Supabase Cron (`pg_cron`) appelle `/api/benevoles/cron` chaque minute via `pg_net`. Le job utilise `GET` avec `Authorization: Bearer …`; le secret correspondant est conservé dans Supabase Vault et doit correspondre à `CRON_SECRET` dans Vercel. Ne pas ajouter en parallèle un cron Vercel.

Dans Supabase : activer `pg_cron` et `pg_net`, créer le job `volunteers-mail-queue`, puis contrôler **Integrations → Cron** et les exécutions du job. La commande SQL du job ne contient pas le secret en clair. `pg_net` place temporairement les en-têtes déchiffrés dans sa file d’attente ; limiter les accès au projet Supabase aux responsables autorisés. Contrôler aussi les journaux de fonction Vercel. Aucune exécution authentifiée de test n'est lancée contre un service réel depuis ce travail.

La file est persistante. Jusqu'à trois e-mails sont traités par invocation ; adapter la capacité du worker si le volume l'exige. Les confirmations attendent le prochain passage. Les rappels sont créés une seule fois par personne et événement le jour civil précédent en `Europe/Paris`, avec l'ensemble des missions. Cela évite un rappel par mission. Une panne de l'ordonnanceur pendant toute la veille ne permet pas de respecter l'échéance : surveiller son fonctionnement.

Les baux de cinq minutes évitent deux workers simultanés sur le même message. La clé d'idempotence Resend est stable. Les reprises ambiguës passent à `manual` après 23 h, avant l'expiration de la fenêtre d'idempotence de 24 h ; contrôler Resend avant toute reprise administrative. Un rappel non envoyé le jour de l'événement passe aussi à `manual`. Surveiller les états `pending`, les baux expirés de `sending` et `manual`. Aucun payload nominatif ou brut du prestataire n'est journalisé par le code.

## Confidentialité et PWA

Les réponses publiques ne contiennent que les identifiants de missions/événements, intitulés, capacités et compteurs agrégés. Pas de noms, e-mails ou catégories d'inscrits dans le HTML serveur, les URL, le stockage navigateur ou les API publiques. Le formulaire n'utilise ni localStorage, ni sessionStorage, ni IndexedDB ; ses champs restent seulement en mémoire le temps de la saisie. Les API sont `no-store`.

L'installation est facultative. Le manifeste utilise `/benevoles` pour l'identifiant, le démarrage et le scope, avec icônes 192/512 dérivées du logo officiel. Le service worker ne traite que les navigations vers `/benevoles` et ses sous-pages `/benevoles/...` ; il n'intercepte pas les API ni les autres pages du site. Il ne stocke rien, y compris les pages, inscriptions et données d'administration. Hors connexion, il affiche un message statique sans données personnelles ; les disponibilités et inscriptions nécessitent une connexion. Le bas de page ne conserve que le titre « L’espace bénévoles à portée de main », sans consigne ni bouton d’installation ; l’installation native du navigateur reste possible.

Le formulaire applique contrôle d'origine, limite réelle de 8 Kio, validation serveur, honeypot et budgets persistants de 10 demandes/heure par IP et adresse. Hors Vercel, un budget IP partagé est utilisé plutôt que faire confiance à un en-tête contrôlé par l'appelant ; tout autre hébergement doit définir une source IP fiable avant ouverture.

L'EDR doit définir la durée de conservation adaptée et supprimer les données devenues inutiles, y compris selon les politiques des sauvegardes Supabase et de Resend. La suppression d'une personne supprime ses affectations et messages en cascade. Les demandes d'accès/correction/suppression vont à l'adresse de communication figurant dans le consentement du formulaire. Mettre à jour la politique de confidentialité avec la durée choisie avant ouverture.

## Vérification effectuée et limites

Commandes : `pnpm lint`, `pnpm test:volunteers`, `pnpm build`, `pnpm test:volunteers:browser`. Pour le navigateur : Chromium à `/usr/bin/chromium` ou `CHROMIUM_PATH`, ports 3400/3401 libres, compilation préalable nécessaire.

Dix tests automatisés passent : catalogue des 27 missions, plafonds confirmés, inscriptions sans limite et réservation préservée, confidentialité SQL/RLS, réservation transactionnelle et limites, validation des champs, verrou d'ouverture, e-mails/destinataires/Reply-To simulés, rappels uniques et baux/reprises. Le test Chromium utilise une base PostgreSQL embarquée et un adaptateur REST locaux ; il vérifie l’accueil et les trois pages événement sur mobile et grand écran, l’ancien lien `/benevoles#inscription`, installation et rangement des tables/chaises validés ensemble à Lespinasse puis une inscription séparée à Bruguières, quatre messages en file, le compteur dans un second navigateur, l'ouverture explicite uniquement dans la fixture locale, l'isolation PWA et le repli hors connexion sans cache nominatif.

Compilation Next.js/TypeScript et ESLint passent (43 pages générées, dont les trois nouvelles pages événement). Les missions, capacités, lieux et horaires existants sont conservés. Chaque formulaire ne présente et ne soumet que les missions de son événement ; changer d’événement ouvre un nouveau formulaire vide. Les données nominatives ne sont pas transférées à l’accueil ni entre événements. Les tests n'établissent ni la concurrence interconnexions d'un projet Supabase distant (PGlite sérialise), ni la vérification DNS Resend, ni la livraison réelle, ni la planification Vercel, ni le succès d'un déploiement distant. Ces points restent à vérifier dans les services configurés.


## Ajouter un événement

Ajouter une entrée à `volunteerEvents` dans `src/lib/volunteers/events.ts`, avec un identifiant stable, un titre, le lieu, les horaires (`setup`, `doors`, `start`), le libellé de début et son propre tableau `missions`. Les lotos partagent `volunteerMissions`, mais un autre type d’événement peut définir un autre tableau. La carte, l’URL, les métadonnées et le sitemap sont générés depuis ce catalogue ; aucun nouveau composant de page n’est nécessaire. Ajouter aussi une migration pour créer l’événement et ses missions en base avec les mêmes identifiants. La réorganisation actuelle ne nécessite aucune migration supplémentaire et conserve toutes les inscriptions existantes.

Le lien historique `/benevoles` reste l’accueil, et son ancre `#inscription` conduit maintenant au choix d’événement. Le formulaire de chaque événement garde aussi cette ancre. Les URL d’événement inconnues renvoient une page 404. Les paramètres de service, secrets, accès SQL, API d’inscription et règles d’envoi n’ont pas été modifiés par cette réorganisation ; les tests utilisent exclusivement la base locale et les envois simulés.


## Correction des inscriptions aux missions sans plafond

Cas reproduit localement : les migrations initiales créaient toutes les missions avec `enabled=false`. La migration des capacités retirait le plafond mais préservait ce statut. Les anciennes fixtures de test activaient toutes les missions et masquaient donc ce problème. La fonction d’inscription refuse justement les missions fermées ; l’interface ne lisait auparavant pas leur statut et permettait malgré tout de les cocher.

La migration `202611130004_unlimited_availability.sql` active uniquement l’installation, le rangement des tables/chaises, le balayage et le rangement de la buvette pour les trois lotos confirmés. Elle ne modifie ni capacités, ni réservations, ni personnes, ni affectations, ni e-mails ; les fermetures des missions limitées restent inchangées. Le verrou global d’inscription et tous les paramètres des services restent en place. **Un déploiement Git/Vercel n’exécute pas cette migration Supabase** : l’appliquer dans le SQL Editor du projet après les trois précédentes pour corriger ce cas sur la base réelle. Sans accès à ce projet, son application et la cause précise de l’essai en production ne sont pas confirmables depuis ce cloud.

L’API publique continue d’utiliser la fonction de compteurs existante et lit, côté serveur seulement, les colonnes `id,enabled` de la table des missions. Aucun nouvel RPC ni changement de secret n’est nécessaire à son déploiement. Elle ne renvoie qu’une liste explicite de champs publics ; toute colonne nominative inattendue est écartée. Une mission fermée n’est plus proposée comme sélectionnable, même si elle est sans plafond. Une panne du stockage maintient le formulaire fermé.

Le formulaire conserve l’envoi d’un tableau de tous les identifiants cochés. La validation serveur accepte plusieurs missions sans aucune valeur de capacité envoyée par le navigateur. La fonction SQL prend toujours toutes les missions en une transaction ; un plafond `null` est volontairement ignoré. Les tests vérifient la paire exacte installation/rangement, les quatre missions illimitées ensemble, les refus de quotas limités et le rollback intégral après une erreur simulée pendant l’insertion (personne, affectations et file d’e-mails).

Présentation : espaces réduits, repères décoratifs masqués aux lecteurs d’écran, intitulés à 18 px et compteurs à 16 px ; « 1 inscrit » et « 1 place restante » sont au singulier. Rangement des tables/chaises et Balayage partagent une rangée à partir de deux colonnes ; les missions restent en une colonne sur petit écran. Les besoins commencent à 17 h 30 à Lespinasse et Saint-Jory, et à 11 h à Bruguières.
