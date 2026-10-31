create table if not exists public.reminders(
 id uuid primary key default gen_random_uuid(),
 owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
 label text not null, at text not null, done_on date,
 created_at timestamptz not null default now());
alter table public.reminders enable row level security;
drop policy if exists "rem select own" on public.reminders;
drop policy if exists "rem insert own" on public.reminders;
drop policy if exists "rem update own" on public.reminders;
drop policy if exists "rem delete own" on public.reminders;
create policy "rem select own" on public.reminders for select using (owner=auth.uid());
create policy "rem insert own" on public.reminders for insert with check (owner=auth.uid());
create policy "rem update own" on public.reminders for update using (owner=auth.uid()) with check (owner=auth.uid());
create policy "rem delete own" on public.reminders for delete using (owner=auth.uid());

create table if not exists public.archive(
 id uuid primary key default gen_random_uuid(),
 owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
 story_id uuid not null unique references public.stories(id) on delete cascade,
 title text, text_orig text, text_en text, tags jsonb,
 created_at timestamptz not null default now());
alter table public.archive enable row level security;
drop policy if exists "archive read all" on public.archive;
drop policy if exists "archive insert own" on public.archive;
drop policy if exists "archive delete own" on public.archive;
create policy "archive read all" on public.archive for select using (true);
create policy "archive insert own" on public.archive for insert with check (owner=auth.uid());
create policy "archive delete own" on public.archive for delete using (owner=auth.uid());
