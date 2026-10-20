-- ACHIRA — migration 002 : lecture publique par fonctions sécurisées au lieu de vues.
-- Raison : les vues projects_public / members_public ont été passées en security_invoker
-- (correction automatique du Security Advisor), ce qui bloquait la lecture publique.
drop view if exists public.projects_public;
drop view if exists public.members_public;

create or replace function public.public_projects() returns setof jsonb
language sql stable security definer set search_path = public as $$
  select (to_jsonb(p) - 'submitter' - 'answers' - 'market')
         || jsonb_build_object('market', case when p.market is null then null else p.market - 'contact' end)
  from public.projects p where p.status = 'pub';
$$;

create or replace function public.public_members() returns setof jsonb
language sql stable security definer set search_path = public as $$
  select to_jsonb(m) - 'email' - 'visible' from public.members m where m.visible;
$$;

revoke execute on function public.public_projects(), public.public_members() from public;
grant execute on function public.public_projects(), public.public_members() to anon, authenticated;
