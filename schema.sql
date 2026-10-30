create table if not exists public.stories(
 id uuid primary key default gen_random_uuid(),
 owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
 title text, kind text not null default 'real' check (kind in ('real','demo')),
 audio_path text, consent boolean not null default false,
 created_at timestamptz not null default now());
alter table public.stories enable row level security;
create policy "stories select own" on public.stories for select using (owner=auth.uid());
create policy "stories insert own" on public.stories for insert with check (owner=auth.uid());
create policy "stories delete own" on public.stories for delete using (owner=auth.uid());
insert into storage.buckets (id,name,public) values ('audio','audio',false) on conflict (id) do nothing;
create policy "audio select own" on storage.objects for select using (bucket_id='audio' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "audio insert own" on storage.objects for insert with check (bucket_id='audio' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "audio delete own" on storage.objects for delete using (bucket_id='audio' and (storage.foldername(name))[1]=auth.uid()::text);
