-- ACHIRA — migration 005 : l'accueil AKARBI se gère depuis la dashboard.
-- La mise en scène (vidéos, textes, positions, moments d'apparition) est gardée dans site_content, clé « akarbi_home »,
-- lisible par tous (la page AKARBI la lit) et modifiable seulement par l'équipe (politiques existantes de site_content).
-- Les vidéos et leurs images d'attente sont déposées dans le bucket public « akarbi ».

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('akarbi', 'akarbi', true, 52428800, array['video/webm', 'video/mp4', 'image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "akarbi: dépôt par l'équipe" on storage.objects;
drop policy if exists "akarbi: modification par l'équipe" on storage.objects;
drop policy if exists "akarbi: suppression par l'équipe" on storage.objects;
create policy "akarbi: dépôt par l'équipe" on storage.objects for insert to authenticated
  with check (bucket_id = 'akarbi' and public.is_admin());
create policy "akarbi: modification par l'équipe" on storage.objects for update to authenticated
  using (bucket_id = 'akarbi' and public.is_admin()) with check (bucket_id = 'akarbi' and public.is_admin());
create policy "akarbi: suppression par l'équipe" on storage.objects for delete to authenticated
  using (bucket_id = 'akarbi' and public.is_admin());
