-- ACHIRA — migration 004 : demandes d'adhésion (« Devenir membre ») et membres réels.
-- 1. Les candidatures distinguent une candidature sur un projet et une demande d'adhésion,
--    et gardent les réponses détaillées du questionnaire.
alter table public.submissions add column if not exists kind text not null default 'candidature';
alter table public.submissions add column if not exists details jsonb not null default '{}';
alter table public.submissions drop constraint if exists submissions_kind_check;
alter table public.submissions add constraint submissions_kind_check check (kind in ('candidature', 'membre'));

drop policy if exists "candidatures: envoi public" on public.submissions;
create policy "candidatures: envoi public" on public.submissions for insert to anon, authenticated
  with check (status = 'new' and notes is null and kind in ('candidature', 'membre') and pg_column_size(details) < 20000);

-- 2. Les membres peuvent aussi être un groupe, un cabinet ou une entreprise
alter table public.members drop constraint if exists members_type_check;
alter table public.members add constraint members_type_check check (type in ('Salarié', 'Indépendant', 'Cabinet', 'Groupe ou collectif', 'Entreprise ou service'));
alter table public.members add column if not exists details jsonb not null default '{}';

-- 3. Message dans la messagerie de l'équipe : adhésion ou candidature
create or replace function public.notify_submission() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.messages (type, title, body, payload, author)
  values ('candidature',
          case when new.kind = 'membre'
               then 'Demande d’adhésion : ' || left(new.name, 80) || ' (' || left(new.metier, 80) || ')'
               else 'Nouvelle candidature : ' || left(new.name, 80) || ' (' || left(new.metier, 80) || ')' end,
          nullif(left(coalesce(new.msg, ''), 600), ''),
          jsonb_build_object('submission', new.id, 'kind', new.kind, 'project', new.project, 'domain', new.domain, 'metier', new.metier, 'code', new.details->>'code'),
          left(new.name, 200));
  return new;
end $$;

-- 4. La lecture publique des membres ne renvoie ni e-mail ni détails privés
create or replace function public.public_members() returns setof jsonb
language sql stable security definer set search_path = public as $$
  select to_jsonb(m) - 'email' - 'visible' - 'details' from public.members m where m.visible;
$$;

-- 5. Seuls les vrais membres restent visibles sur le site : les profils d'exemple sont masqués (pas supprimés)
update public.members set visible = false where slug in ('meriem-a', 'othmane-k', 'sara-d', 'nora-l', 'youssef-m', 'hind-b', 'amine-r', 'rania-t', 'ilyes');
