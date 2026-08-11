create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null default 'TKJ Student',
  avatar_url text,
  role text not null default 'student' check (role in ('student','teacher','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, user_id)
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic text not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.quiz_results enable row level security;
alter table public.learning_progress enable row level security;

create policy "profiles readable by authenticated users"
on public.profiles for select
to authenticated
using (true);

create policy "users update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "classes readable by authenticated users"
on public.classes for select
to authenticated
using (true);

create policy "members readable by authenticated users"
on public.class_members for select
to authenticated
using (true);

create policy "users read own quiz results"
on public.quiz_results for select
to authenticated
using (auth.uid() = user_id);

create policy "users insert own quiz results"
on public.quiz_results for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users manage own learning progress"
on public.learning_progress for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into public.classes (name)
values ('TKJ 1'), ('TKJ 2')
on conflict (name) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'user_name',''),
      nullif(new.raw_user_meta_data->>'preferred_username',''),
      split_part(coalesce(new.email, 'student'), '@', 1) || '_' || substr(new.id::text, 1, 6)
    ),
    coalesce(new.raw_user_meta_data->>'full_name', 'TKJ Student'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();