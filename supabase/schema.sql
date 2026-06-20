create extension if not exists "pgcrypto";

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  image_url text,
  x double precision not null check (x >= 0 and x <= 100),
  y double precision not null check (y >= 0 and y <= 100),
  color text not null default '#ffd98a',
  created_at timestamp with time zone not null default now()
);

alter table public.memories alter column image_url drop not null;
alter table public.memories enable row level security;

drop policy if exists "Public can read memories" on public.memories;
create policy "Public can read memories"
on public.memories
for select
using (true);

create index if not exists memories_created_at_idx on public.memories (created_at asc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memories', 'memories', true, 524288, array['image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view memory images" on storage.objects;
create policy "Public can view memory images"
on storage.objects
for select
using (bucket_id = 'memories');
