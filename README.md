# ACHIRA

Le site du cercle ACHIRA (maison AKARBI) et sa dashboard, en maquette statique.

- `maquette/` : le site publié (accueil, projets, sides, métiers, cercle, membres, rejoindre) et la dashboard (`maquette/admin/`).
- `maquette/assets/data.js` : projets, membres, textes et modèle des sides.
- `maquette/assets/marches.js` : les 95 marchés du plan d'action (en brouillon dans la dashboard).
- `PROMPT-ACHIRA.md` : le brief complet pour construire la version finale (Next.js + base de données).
- `assets/` : police AKARBI, logo, images et vidéo de marque.

## Déploiement

Vercel sert le dossier `maquette/` tel quel (voir `vercel.json`), sans étape de build. Chaque push sur `main` redéploie.

## Base de données (Supabase, projet « Achira » `wscvemgeqyzlojkmrmkb`)

- `maquette/assets/config.js` : adresse du projet et clé publique (anon), publique par conception.
- `supabase/schema.sql` : tables, règles de sécurité (RLS), fonctions de lecture publique.
- `supabase/migration-002-lecture-publique.sql` : lecture publique par fonctions (`public_projects`, `public_members`).
- `supabase/seed.sql` : données de départ (membres, projets du cercle, 95 marchés, textes).
- Le public peut déposer un projet et candidater, sans jamais relire ces envois ; il ne lit que les projets publiés et les membres visibles, sans contacts ni e-mails.
- La dashboard (`/admin/`) demande une connexion ; seuls les comptes de la table `admins` voient et modifient les données. Les modifications sont enregistrées automatiquement.
- Ajouter un admin : créer l'utilisateur dans Supabase › Authentication, puis `insert into public.admins (user_id) select id from auth.users where email = '…';`

## À savoir

- Les contacts des marchés sont des exemples sectoriels, non vérifiés pour chaque niche. Ils ne sont visibles que dans la dashboard.
- `donnees/` garde les sources : l'arbre des métiers et les 95 marchés.
