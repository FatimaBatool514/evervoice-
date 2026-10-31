alter table public.stories
  add column if not exists transcript text,
  add column if not exists translations jsonb,
  add column if not exists tags jsonb,
  add column if not exists mood text;
drop policy if exists "stories update own" on public.stories;
create policy "stories update own" on public.stories for update using (owner=auth.uid()) with check (owner=auth.uid());
