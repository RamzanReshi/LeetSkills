-- ============================================================
-- LeetSkills — full idempotent schema
-- Safe to run repeatedly.
-- ============================================================

create schema if not exists leetskill;

grant usage on schema leetskill to anon, authenticated, service_role;

-- ============================================================
-- profiles
-- ============================================================

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

grant select, insert, update on leetskill.profiles to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
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
    select 1 from pg_policies
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
    select 1 from pg_policies
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

-- ============================================================
-- completed_attempts — append-only scenario history
-- ============================================================

create table if not exists leetskill.completed_attempts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  path_id text not null,
  difficulty text not null,
  thinking_trace text not null default '',
  final_response text not null default '',
  score numeric not null,
  skill_scores jsonb not null,
  ai_feedback jsonb not null,
  fingerprint_before jsonb not null,
  fingerprint_after jsonb not null,
  fallback_used boolean not null default false,
  error_state jsonb,
  started_at timestamptz not null,
  submitted_at timestamptz not null,
  evaluated_at timestamptz not null,
  completed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists completed_attempts_user_completed_idx
  on leetskill.completed_attempts (user_id, completed_at desc);

create index if not exists completed_attempts_user_scenario_idx
  on leetskill.completed_attempts (user_id, scenario_id);

alter table leetskill.completed_attempts enable row level security;

grant select, insert on leetskill.completed_attempts to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'leetskill'
      and tablename = 'completed_attempts'
      and policyname = 'completed_attempts_select_own'
  ) then
    create policy "completed_attempts_select_own"
      on leetskill.completed_attempts
      for select
      to authenticated
      using ((select auth.uid()) = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'leetskill'
      and tablename = 'completed_attempts'
      and policyname = 'completed_attempts_insert_own'
  ) then
    create policy "completed_attempts_insert_own"
      on leetskill.completed_attempts
      for insert
      to authenticated
      with check ((select auth.uid()) = user_id);
  end if;
end;
$$;
