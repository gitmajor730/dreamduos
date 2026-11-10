-- Dream Duos provider recruitment. Run once in the Supabase SQL editor.

create table if not exists public.admin_allowlist (
  email text primary key
);

insert into public.admin_allowlist (email)
values ('dbm730@gmail.com')
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_allowlist
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create table if not exists public.provider_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  applicant_type text not null default 'individual' check (applicant_type in ('individual', 'business')),
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  provider_approval text not null default 'pending' check (provider_approval in ('pending', 'approved', 'rejected')),
  first_name text,
  last_name text,
  preferred_name text,
  email text,
  phone text,
  city text,
  state text default 'GA',
  zip text,
  contact_method text,
  languages text[] not null default '{}',
  hear_about text,
  referral text,
  home_zip text,
  radius_miles integer,
  preferred_areas text,
  has_transportation boolean,
  start_date date,
  days text[] not null default '{}',
  day_windows jsonb not null default '{}'::jsonb,
  hours_per_week text,
  min_booking text,
  notice text,
  recurring boolean,
  education_level text,
  school text,
  degree text,
  is_student boolean,
  training text,
  website text,
  display_name text,
  headline text,
  bio text,
  loves text,
  photo_path text,
  business jsonb not null default '{}'::jsonb,
  other_skills text,
  consent_application boolean not null default false,
  consent_service_email boolean not null default false,
  consent_public_profile boolean not null default false,
  consent_marketing boolean not null default false,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.provider_services (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.provider_applications (id) on delete cascade,
  service text not null,
  active boolean not null default true,
  years text,
  experience_types text[] not null default '{}',
  experience_notes text,
  skills text[] not null default '{}',
  preferred_tasks text[] not null default '{}',
  excluded_tasks text[] not null default '{}',
  rate text,
  available_now text,
  approval text not null default 'pending' check (approval in ('pending', 'approved', 'rejected', 'needs_info')),
  details jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (application_id, service)
);

alter table public.provider_applications enable row level security;
alter table public.provider_services enable row level security;

drop policy if exists "applications read" on public.provider_applications;
drop policy if exists "applications insert" on public.provider_applications;
drop policy if exists "applications update" on public.provider_applications;
create policy "applications read" on public.provider_applications
  for select using (auth.uid() = user_id or public.is_admin());
create policy "applications insert" on public.provider_applications
  for insert with check (auth.uid() = user_id);
create policy "applications update" on public.provider_applications
  for update using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "services read" on public.provider_services;
drop policy if exists "services insert" on public.provider_services;
drop policy if exists "services update" on public.provider_services;
create policy "services read" on public.provider_services
  for select using (
    public.is_admin() or exists (
      select 1 from public.provider_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );
create policy "services insert" on public.provider_services
  for insert with check (
    exists (
      select 1 from public.provider_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );
create policy "services update" on public.provider_services
  for update using (
    public.is_admin() or exists (
      select 1 from public.provider_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

insert into storage.buckets (id, name, public)
values ('provider-uploads', 'provider-uploads', false)
on conflict (id) do nothing;

drop policy if exists "provider upload own" on storage.objects;
drop policy if exists "provider read own" on storage.objects;
drop policy if exists "provider update own" on storage.objects;
create policy "provider upload own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'provider-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "provider read own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'provider-uploads'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );
create policy "provider update own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'provider-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
