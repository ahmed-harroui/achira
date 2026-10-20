# ACHIRA — Brief pour l'IA (site vitrine des projets + dashboard d'administration)

> Copie ce document en entier dans l'IA (Claude, v0, Cursor…). Il décrit le site à construire, le thème à respecter à la lettre, et la dashboard qui pilote le contenu.
> Les ressources de marque sont déjà dans le dossier `assets/` (police, logo, images, vidéo).

---

## 1. Contexte

**ACHIRA** est le cercle de la maison **AKARBI** (maison marocaine de cuir contemporain, devise *TRUST YOUR WAY*).
ACHIRA réunit des artistes et des créatifs, de l'art traditionnel à l'art moderne — artisans, musiciens, photographes, designers, tailleurs, mannequins — « tous ceux qui refusent de tourner en rond ».

Sur le site AKARBI, ACHIRA n'est qu'une page de présentation. **Le nouveau site ACHIRA est son prolongement : l'endroit où l'on montre en détail les projets du cercle**, et dont tout le contenu se gère depuis une dashboard.

Ton : sobre, poétique, en français, tutoiement (« Tu deviens ACHIRA… »). Phrases courtes. Aucun jargon marketing.

---

## 2. Stack demandée

- **Next.js (App Router) + TypeScript + Tailwind CSS v4** (même stack que le site AKARBI), pnpm.
- Base de données + auth + stockage des médias : **Supabase** (Postgres, Auth, Storage) — ou équivalent, mais une seule solution.
- Site public = pages rendues côté serveur (SEO), revalidées quand on publie depuis la dashboard.
- Dashboard sous `/admin`, protégée par connexion (rôles : `admin`, `editeur`).
- Responsive mobile-first, accessible (focus visibles, `alt` sur toutes les images, `prefers-reduced-motion` respecté).

---

## 3. Thème — À RESPECTER EXACTEMENT (c'est le thème AKARBI)

### 3.1 Polices
```css
@font-face {
  font-family: 'AKARBI';
  src: url('/assets/font/akarbi-typeface.woff2') format('woff2');
  font-display: swap;
}
/* + Google Fonts : Cormorant Garamond (400, 500, italique) et Hanken Grotesk (400–700) */
--brand: 'AKARBI', 'Bebas Neue', 'Oswald', Impact, sans-serif;  /* titres, chiffres, logo-texte */
--serif: 'Cormorant Garamond', 'Times New Roman', serif;          /* phrases d'accroche en italique */
--sans:  'Hanken Grotesk', 'Helvetica Neue', Arial, sans-serif;   /* texte courant, boutons, labels */
```
La police **AKARBI** (fichier fourni) est notre police propriétaire : elle est utilisée pour TOUS les titres. Ne jamais la remplacer par une autre.

### 3.2 Couleurs
```css
:root {
  /* verts pétrole (fond AKARBI) */
  --p950: #050f0c; --p900: #0a1a16; --p800: #0f261f; --p700: #173a30;
  /* bordeaux (univers ACHIRA — dominant sur ce site) */
  --b950: #140309; --b900: #260610; --b800: #3b0a17; --b700: #561020;
  --achira: #7f0b1f;            /* rouge ACHIRA : accents, gros numéros, sélection, filets */
  /* ivoire / encre */
  --ivory: #eee5d3; --paper: #eee5d3; --ink: #10231d; --ink2: #44544d;
  --iv80: rgba(238,229,211,.82); --iv60: rgba(238,229,211,.62);
  --iv30: rgba(238,229,211,.3);  --iv14: rgba(238,229,211,.14);
  --champ: #c5a676;             /* champagne : petits numéros, focus */
  --gut: clamp(20px, 4.5vw, 76px);         /* marge latérale */
  --ease: cubic-bezier(.22, 1, .36, 1);    /* easing de toutes les animations */
}
```
- Le site ACHIRA est **majoritairement bordeaux sombre** (alors qu'AKARBI est vert pétrole). Le vert pétrole et le fond ivoire « papier » servent de sections de respiration.
- Fonds de section types :
  - Hero : `radial-gradient(90% 70% at 50% 30%, #3b0a17 0%, #16040a 60%, #0a0205 100%)`
  - Section sombre : `#0e0306`
  - Section bordeaux : `linear-gradient(180deg, #1b050b, #2a0711)`
  - Section claire : `var(--paper)` texte `var(--ink)`, avec un léger grain papier (bruit SVG en `mix-blend-mode: multiply`, opacité .5).
- `::selection { background: var(--achira); color: var(--ivory); }`

### 3.3 Typographie (classes)
| Classe | Style |
|---|---|
| `.display` | `400 clamp(64px, 11vw, 176px)/.9 var(--brand)`, letter-spacing .03em |
| `.h2` | `400 clamp(40px, 5.6vw, 92px)/.95 var(--brand)`, ls .03em |
| `.h3` | `400 clamp(28px, 2.9vw, 46px)/1 var(--brand)`, ls .04em |
| `.h4` | `400 clamp(22px, 1.8vw, 28px)/1.05 var(--brand)`, ls .06em |
| `.lead` | `italic 400 clamp(21px, 2vw, 32px)/1.2 var(--serif)`, couleur `--iv80` |
| `.eyebrow` | `600 11px var(--sans)`, ls .26em, MAJUSCULES, couleur `--iv60` |
| `.body` | `16px/1.65 var(--sans)`, max 62ch, couleur `--iv80` |
| `.num` | `400 18px var(--brand)`, ls .12em, couleur `--champ` |
| `.big` (gros numéros) | `400 clamp(54px, 6vw, 96px)/.8 var(--brand)`, couleur `--achira` |

### 3.4 Composants
- **Boutons** : pilule (`border-radius: 999px`), hauteur 50px, `600 12px` Hanken, ls .2em, majuscules.
  - `btn--solid` : fond ivoire, texte encre · `btn--line` : bordure `--iv30` · `btn--bord` : fond `--achira`, hover `#95102a`.
- **Lien fléché** : majuscules, souligné 1px, la flèche glisse de 6px au survol.
- **Chips** (tags métiers / catégories) : pilule bordure `--iv30`, `600 11px`, ls .18em, majuscules.
- **Listes numérotées** : lignes séparées par un filet `1px var(--iv14)`, gros numéro rouge `--achira` à gauche (grille `120px | titre | texte`).
- **Images** : `border-radius: 14px`, `object-fit: cover`.
- **Nav** : pilule flottante centrée en haut, fond `rgba(38,6,16,.42)` + `backdrop-filter: blur(10px)`, bordure `--iv14`, liens 11px majuscules ls .2em. Au scroll vers le bas, elle se réduit au seul logo ACHIRA ; elle revient au scroll vers le haut.
- **Logo** : `assets/achira-logo.svg` (en `currentColor`, ivoire sur fond sombre).

### 3.5 Animations
- Titres révélés mot par mot (chaque mot glisse de bas en haut dans un masque `overflow: hidden`).
- Paragraphes / cartes : apparition en fondu + translation 24px au scroll (IntersectionObserver), easing `--ease`.
- Vidéos et grandes images : léger parallax. Tout est désactivé si `prefers-reduced-motion`.

---

## 4 bis. Les sides d'un projet — LE MODÈLE CENTRAL

Un projet ACHIRA n'est pas seulement un projet créatif ou informatique : c'est **tous les côtés (« sides ») d'un projet réel**. Chaque projet est découpé selon un modèle commun, éditable dans la dashboard :

```
PROJET
└── Side (domaine)            ex. 1. Comptabilité générale
    └── Mission (tâche)       ex. Comptabilité fournisseurs
        └── Sous-mission      ex. Litiges et avoirs
            ├── Compétences requises   ex. Lettrage, Rapprochement…
            └── Métiers recherchés     ex. Comptable fournisseurs, Expert-comptable…
                └── Professionnels     Salarié · Indépendant · Cabinet
```

**Sides du modèle (schéma fourni, à reprendre intégralement)** :
1. Comptabilité générale · 2. Comptabilité analytique et contrôle de gestion · 3. Fiscalité et obligations déclaratives · 4. Trésorerie et financement · 5. Facturation et gestion commerciale · 6. Paie et charges sociales · 7. Juridique financier et contrats · 8. Audit, contrôle interne et conformité · 9. Systèmes d'information comptable · 10. Achats et gestion fournisseurs · 11. Gestion des risques financiers · 12. Conseil financier et pilotage.

**Sides ajoutés** (pôle « Création, production & marque ») : 13. Création et design · 14. Production et fabrication · 15. Marketing et communication · 16. Digital et outils.

Chaque side porte : ses missions (arborescentes), ses compétences requises, ses métiers, et les profils acceptés (Salarié, Indépendant, Cabinet).

**Pour chaque projet, chaque side a** : un état (*Couvert · En partie · À pourvoir · Non requis*), un responsable (membre), et la liste des métiers recherchés affichés publiquement.

**Affichage public** : barre de couverture des sides sur chaque carte projet, grille des sides par pôle, panneau de détail d'un side, **carte mentale interactive « logic-right »** (projet → sides → missions → compétences / métiers → profils), liste « Le projet cherche ».

**Boucle complète** : un visiteur propose son aide sur un side → la candidature arrive dans la dashboard → « Accepter et confier le side » crée le membre, le nomme responsable du side, retire le métier des postes recherchés et met à jour l'état du side.

**Marchés (fiches projet étendues)** : un projet peut porter une fiche marché qui reprend toutes les colonnes du fichier `plan_action_95_niches_avec_contacts.csv` : id, secteur, domaine, sous-domaine, micro-niche, nano-niche, ville, score exploratoire, priorité (A/B/C), hypothèse de problème, problème central, preuve à collecter, source documentaire, solution agence, produit SaaS, modules MVP, KPI, responsables (découverte / produit / distribution), statut de la preuve, prochaine action, et un **contact** (entreprise exemple, ville, téléphone, e-mail, WhatsApp, Instagram, URL source, type de rapprochement, date de consultation, statut du contact, prochain contact). Les 95 marchés sont importés en **brouillon** (jamais visibles publiquement tant qu'ils ne sont pas publiés ; les contacts ne sont jamais affichés sur le site public). Les contacts sont des exemples sectoriels non vérifiés pour chaque niche.

**Spécialité ACHIRA** : chaque projet a un interrupteur « logo ACHIRA » (activé / désactivé) et un champ texte « spécialité ». Le logo activé marque les projets intéressants : badge sur la carte et la page publique, filtre dans la dashboard, présence dans la matrice des sides.

**Arbre des métiers et domaines (source unique)** : `donnees/arbre_metiers_domaines_maroc.json` (schéma 1.0) — secteurs → domaines (sides) → tâches ; compétences et métiers reliés aux domaines par les relations `REQUIRES_SKILL` et `PERFORMED_BY` ; modes d'exercice des métiers (salarié, indépendant, cabinet, à titre indicatif). La base de données reprend ces nœuds et relations tels quels (garder les identifiants) ; le schéma d'extension prévoit `subdomain`, `specialty`, `service`, `problem`, `solution`, `company` et les relations `CHILD_OF`, `SOLVES`, `DELIVERED_AS`, `AUTOMATED_BY`.

**Tout est relié** : projet / marché → sides touchés → métiers (PERFORMED_BY) → membres (chaque membre a un métier de l'arbre, qui le relie automatiquement aux sides).
- **Déposer un projet** (`/deposer`) : parcours interactif en 7 questions (secteur, stade, offre, clients, équipe, argent, visibilité). Chaque réponse pondère des sides ; le panneau de droite se met à jour en direct : sides classés (Prioritaire / Important / Utile, avec la raison), personnes du cercle suggérées, métiers à trouver. L'envoi crée un projet « déposé » en brouillon dans la dashboard, avec ses sides ouverts.
- **Marchés** : le même moteur calcule les sides d'un marché à partir de sa fiche (secteur, solution, produit, modules) ; règles sectorielles (ex. santé → conformité CNDP).
- **Dashboard, fiche projet** : panneau « Sides touchés et personnes suggérées » — « Ouvrir les sides suggérés », « Confier à [membre] » (le membre devient responsable, le métier sort des postes recherchés).
- **Recherche globale** (bouton loupe, touche `/` ou Ctrl+K) sur le site et la dashboard : sides, missions, compétences, métiers (avec nombre de membres), membres, projets (et marchés côté dashboard).
- **Membres** : recherche, filtre par métier (`/membres#job-comptable`), sides déduits du métier.

Maquette de référence : dossier `maquette/` (ouvrir `maquette/index.html`).

---

## 4. Site public — pages (multi-pages, une URL par page)

Pages : `/` Accueil · `/projets` · `/projets/[slug]` · `/metiers` (le cercle cherche + catalogue des métiers par side) · `/cercle` · `/membres` · `/rejoindre`.
Dashboard : `/admin` Tableau de bord (matrice projets × sides) · `/admin/projets` · `/admin/projets/[slug]` (éditeur des sides) · `/admin/modele` (modèle des sides + carte complète) · `/admin/textes` · `/admin/membres` · `/admin/candidatures` · `/admin/reglages`.

S'inspirer directement de la page ACHIRA du site AKARBI (hero logo + titre géant, phrase manifeste, collage d'images, parcours numéroté 01/02/03, grille « vie du cercle », citation finale) et l'étendre aux projets.

### 4.1 Accueil `/`
1. **Hero** plein écran : logo ACHIRA, titre `.display` « ACHIRA », accroche `.lead--xl` « Un cercle qui avance ensemble. », eyebrow « Des histoires singulières. Des valeurs partagées. ». Vidéo `assets/vid/achira.webm` en fond optionnelle (poster `poster-achira.webp`).
2. **Manifeste** : grande phrase révélée mot par mot (texte éditable en dashboard).
3. **Projets à la une** : 3 à 6 projets marqués « à la une », grandes cartes image + titre + catégorie + année.
4. **Le parcours** : Suivre / Devenir ACHIRA / Construire avec nous (liste numérotée, éditable).
5. **Les membres** : bandeau de portraits (membres mis en avant).
6. **Citation finale** : « L'achat donne un accès. *Les valeurs donnent l'appartenance.* » + boutons (Instagram ACHIRA, lien vers le site AKARBI, « Proposer un projet »).

### 4.2 Projets `/projets`
- Grille de cartes (image de couverture, titre, discipline, année, membres).
- **Filtres** en chips : discipline (Artisanat, Musique, Photographie, Design, Mode, Vidéo…), année, membre. Recherche texte.
- Les catégories et filtres viennent de la dashboard.

### 4.3 Détail d'un projet `/projets/[slug]` — LE CŒUR DU SITE
Mise en page éditoriale longue, comme un chapitre :
1. **Hero** : image ou vidéo de couverture plein écran, titre `.display`, sous-titre `.lead`, eyebrow (discipline · lieu · année).
2. **Fiche** : bloc de métadonnées (date, lieu, statut : *en cours / terminé*, membres participants avec avatar et rôle, partenaires, lien AKARBI éventuel vers une pièce).
3. **L'histoire** : texte riche (titres, paragraphes, citations).
4. **Le processus** : étapes numérotées 01, 02, 03… (gros numéros `--achira`), chacune avec texte + image(s).
5. **Galerie** : images et vidéos, mise en page collage (tailles alternées), ouverture en plein écran (lightbox, navigation clavier).
6. **Crédits** : qui a fait quoi.
7. **Projet suivant / précédent** en bas de page, grande carte cliquable.

Le contenu d'un projet est composé de **blocs** ordonnables depuis la dashboard (texte, image, galerie, vidéo, citation, étapes, chiffres clés), pour que chaque projet ait sa propre mise en page.

### 4.4 Membres `/membres` et `/membres/[slug]`
Portrait, nom, savoir-faire (chips), courte bio, liens (Instagram, site), et la liste de ses projets.

### 4.5 Le cercle `/cercle`
Reprise de la page ACHIRA d'AKARBI : « Contre la routine qui enferme », le parcours, « Faire vivre le cercle » (Entretenir le lien · Se retrouver · Contribuer aux choix · Garder une direction).

### 4.6 Rejoindre / Proposer un projet `/rejoindre`
Formulaire : nom, e-mail, savoir-faire, lien portfolio, message, fichiers optionnels. Les envois arrivent dans la dashboard.

### 4.7 Commun
- **Discord du cercle : https://discord.gg/FdEmP3XJq** — un seul réglage (dashboard › Réglages) et le même bouton « Discord ACHIRA ↗ » partout : colonne Contact du footer, menu mobile, accueil, Le cercle, Sides, Métiers, Rejoindre, détail d'un side. Ouverture dans un nouvel onglet.
- Footer : logo, devise « TRUST YOUR WAY » en `--brand` couleur `--achira`, liens, Instagram, lien vers AKARBI, mentions légales / confidentialité.
- SEO : titre « [Page] — ACHIRA », meta description et image Open Graph par projet (éditables).

---

## 5. Dashboard `/admin` — gère la plupart du contenu du site

Même identité (polices, couleurs) mais en version **interface de travail** : fond `--b950`/`#0e0306`, panneaux `--b900`, texte ivoire, boutons pilule, plus dense et lisible. Barre latérale à gauche.

### 5.1 Tableau de bord (accueil admin)
Chiffres clés : nombre de projets (publiés / brouillons), membres, candidatures non lues, dernières modifications.

### 5.2 Projets
- Liste avec recherche, filtre par statut (brouillon / publié / archivé), tri, glisser-déposer pour l'ordre d'affichage.
- Éditeur de projet :
  - Champs : titre, slug (auto), sous-titre, discipline(s), année, lieu, statut du projet, couverture (image ou vidéo), membres + rôle, partenaires, « à la une » (oui/non), SEO (titre, description, image OG).
  - **Constructeur de blocs** : ajouter / réordonner / supprimer des blocs (texte riche, image, galerie, vidéo, citation, étapes du processus, chiffres clés).
  - Boutons : Enregistrer le brouillon · Prévisualiser · Publier · Dépublier.

### 5.3 Membres
CRUD complet : portrait, nom, slug, savoir-faire, bio, liens, mis en avant (oui/non), ordre.

### 5.4 Contenus du site (pages)
Tous les textes affichés sur le site public sont éditables ici, section par section :
hero de l'accueil (titre, accroche, vidéo/poster), manifeste, étapes du parcours, blocs « vie du cercle », citation finale, textes de la page Cercle, footer, liens réseaux sociaux.

### 5.5 Catégories / disciplines
Ajouter, renommer, réordonner les disciplines utilisées dans les filtres.

### 5.6 Médiathèque
Upload d'images et vidéos (glisser-déposer), texte `alt` obligatoire, recadrage, compression automatique en WebP, réutilisables dans tous les projets.

### 5.7 Candidatures
Liste des formulaires « Rejoindre / Proposer un projet », statut (nouveau, lu, accepté, refusé), notes internes.

### 5.8 Utilisateurs & réglages
Comptes admin/éditeur, invitations, paramètres généraux (nom du site, SEO par défaut, lien AKARBI, Instagram).

---

## 6. Modèle de données (indicatif)

- `projects` (id, slug, title, subtitle, year, location, project_status, cover_media_id, featured, sort_order, publish_status, seo_title, seo_description, og_media_id, published_at, created_at, updated_at)
- `project_blocks` (id, project_id, type, content JSON, sort_order)
- `project_members` (project_id, member_id, role)
- `project_disciplines` (project_id, discipline_id)
- `disciplines` (id, name, slug, sort_order)
- `members` (id, slug, name, portrait_media_id, bio, skills[], links JSON, featured, sort_order)
- `media` (id, url, type image/video, alt, width, height)
- `site_content` (key, value JSON) — textes des sections du site
- `submissions` (id, name, email, skill, portfolio_url, message, files, status, notes, created_at)
- `users` / rôles via l'auth

---

## 7. Ressources fournies (dossier `assets/`)

| Fichier | Usage |
|---|---|
| `font/akarbi-typeface.woff2` | Police de marque AKARBI (titres) |
| `achira-logo.svg` | Symbole ACHIRA (`currentColor`) |
| `vid/achira.webm`, `vid/achira.mp4` | Vidéo du hero |
| `img/poster-achira.webp` | Poster de la vidéo |
| `img/end-achira.webp` | Image de fin / citation |
| `img/u-cercle-1/2/3.webp` | Collage « le cercle » |

---

## 8. Livrables attendus

1. Projet Next.js complet dans ce dossier, qui démarre avec `pnpm install && pnpm dev`.
2. Thème centralisé (variables CSS + config Tailwind) reprenant exactement la section 3.
3. Site public (section 4) alimenté uniquement par la base de données.
4. Dashboard (section 5) fonctionnelle avec authentification.
5. Script de seed avec 3 projets d'exemple, 4 membres et les textes ACHIRA existants.
6. `README.md` : installation, variables d'environnement, déploiement (Vercel).
