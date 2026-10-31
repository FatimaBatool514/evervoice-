alter table public.stories
  add column if not exists places jsonb,
  add column if not exists vault jsonb;
