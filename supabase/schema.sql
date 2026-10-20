-- ACHIRA — schéma Supabase
-- À coller une seule fois dans Supabase › SQL Editor › New query, puis « Run ».
-- Principe de sécurité (Row Level Security) :
--   • le public peut DÉPOSER un projet et CANDIDATER, jamais relire ces envois ;
--   • le public ne lit que les projets publiés (sans contacts ni coordonnées du déposant) et les membres visibles ;
--   • seuls les comptes listés dans `admins` voient et modifient tout (la dashboard).

-- ---------- Administrateurs ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create policy "admins: lecture par un admin" on public.admins for select using (public.is_admin());

-- ---------- Membres ----------
create table if not exists public.members (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  metier text not null,                -- libellé d'un métier de l'arbre (jobs.label)
  job_id text,                         -- identifiant du métier dans l'arbre (ex. job-86ad11e3)
  type text check (type in ('Salarié', 'Indépendant', 'Cabinet')),
  city text,
  bio text,
  domains text[] not null default '{}', -- sides en plus de ceux déduits du métier (d1…d16)
  img text,
  email text,                          -- jamais exposé au public
  visible boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.members enable row level security;
create policy "membres: tout pour les admins" on public.members for all using (public.is_admin()) with check (public.is_admin());

create or replace view public.members_public with (security_invoker = false) as
  select id, slug, name, metier, job_id, type, city, bio, domains, img from public.members where visible;

-- ---------- Projets (cercle, déposés, marchés) ----------
create table if not exists public.projects (
  slug text primary key,
  title text not null,
  sub text default '',
  disc text default '',
  place text default '',
  year int,
  phase text default 'Idée',
  status text not null default 'draft' check (status in ('draft', 'pub', 'arch')),
  featured boolean not null default false,
  img text,
  story text default '',
  achira boolean not null default false,
  specialite text default '',
  origin text not null default 'cercle' check (origin in ('cercle', 'depot', 'marche')),
  sides jsonb not null default '{}',   -- { "d3": { "s": "open", "open": ["Fiscaliste"], "lead": 4, "suggest": [4, 11] } }
  answers jsonb,                       -- réponses au questionnaire « Déposer un projet »
  market jsonb,                        -- fiche marché (dont market->'contact', jamais exposée au public)
  submitter jsonb,                     -- { name, email } du déposant, jamais exposé au public
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "projets: tout pour les admins" on public.projects for all using (public.is_admin()) with check (public.is_admin());
-- le public peut déposer un projet, uniquement comme brouillon « déposé »
create policy "projets: dépôt public" on public.projects for insert to anon, authenticated
  with check (origin = 'depot' and status = 'draft' and featured = false and achira = false and market is null);

create or replace view public.projects_public with (security_invoker = false) as
  select slug, title, sub, disc, place, year, phase, featured, img, story, achira, specialite, origin, sides,
         case when market is null then null else market - 'contact' end as market
  from public.projects where status = 'pub';

-- ---------- Candidatures / personnes intéressées ----------
create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  metier text not null,
  type text,
  project text references public.projects (slug) on delete set null,
  domain text,
  link text,
  msg text,
  status text not null default 'new' check (status in ('new', 'ok', 'no')),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.submissions enable row level security;
create policy "candidatures: tout pour les admins" on public.submissions for all using (public.is_admin()) with check (public.is_admin());
create policy "candidatures: envoi public" on public.submissions for insert to anon, authenticated
  with check (status = 'new' and notes is null);

-- ---------- Textes et réglages du site ----------
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
create policy "textes: lecture publique" on public.site_content for select using (true);
create policy "textes: écriture admin" on public.site_content for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Droits ----------
grant select on public.members_public, public.projects_public to anon, authenticated;
grant insert on public.projects, public.submissions to anon, authenticated;
revoke select on public.projects, public.submissions, public.members from anon;

-- ---------- Mise à jour automatique de updated_at ----------
create or replace function public.touch() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects for each row execute function public.touch();

-- ---------- Dernière étape (après avoir créé ton compte dans Authentication › Users) ----------
-- insert into public.admins (user_id) select id from auth.users where email = 'TON-EMAIL@exemple.com';
