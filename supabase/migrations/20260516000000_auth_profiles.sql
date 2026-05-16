create schema if not exists leetskill;

do $$
begin
  if to_regclass('public.profiles') is not null
    and to_regclass('leetskill.profiles') is null then
    alter table public.profiles set schema leetskill;
  end if;
end;
$$;

create table if not exists leetskill.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text default 'AI-era engineering learner',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table leetskill.profiles enable row level security;

grant usage on schema leetskill to anon, authenticated, service_role;
grant select, insert, update on leetskill.profiles to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'leetskill'
      and tablename = 'profiles'
      and policyname = 'Users can read their own profile'
  ) then
    create policy "Users can read their own profile"
      on leetskill.profiles
      for select
      to authenticated
      using ((select auth.uid()) = id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'leetskill'
      and tablename = 'profiles'
      and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on leetskill.profiles
      for update
      to authenticated
      using ((select auth.uid()) = id)
      with check ((select auth.uid()) = id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'leetskill'
      and tablename = 'profiles'
      and policyname = 'Users can insert their own profile'
  ) then
    create policy "Users can insert their own profile"
      on leetskill.profiles
      for insert
      to authenticated
      with check ((select auth.uid()) = id);
  end if;
end;
$$;

create or replace function leetskill.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = leetskill
as $$
begin
  insert into leetskill.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, profiles.full_name),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function leetskill.handle_new_user();
