# ACHIRA

Le site du cercle ACHIRA (maison AKARBI) et sa dashboard, en maquette statique.

- `maquette/` : le site publié (accueil, projets, sides, métiers, cercle, membres, rejoindre) et la dashboard (`maquette/admin/`).
- `maquette/assets/data.js` : projets, membres, textes et modèle des sides.
- `maquette/assets/marches.js` : les 95 marchés du plan d'action (en brouillon dans la dashboard).
- `PROMPT-ACHIRA.md` : le brief complet pour construire la version finale (Next.js + base de données).
- `assets/` : police AKARBI, logo, images et vidéo de marque.

## Déploiement

Vercel sert le dossier `maquette/` tel quel (voir `vercel.json`), sans étape de build.

## Limites de la maquette

- Les modifications faites dans la dashboard restent dans le navigateur de la personne qui les fait.
- La dashboard n'a pas de mot de passe : toute personne qui connaît l'adresse `/admin/` peut l'ouvrir.
- Les contacts des marchés sont des exemples sectoriels, non vérifiés pour chaque niche.
