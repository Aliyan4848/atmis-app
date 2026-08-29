-- ATMIS Supabase schema
-- Run this in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query)

-- =========================================================
-- profiles — extra applicant info beyond what auth.users stores
-- =========================================================
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  cnic text not null unique,
  phone text not null,
  province text not null,
  district text not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- =========================================================
-- applications — the real application records
-- =========================================================
create table if not exists applications (
  id text primary key,                      -- e.g. ATMIS-2026-48213
  user_id uuid references auth.users(id),   -- nullable: guest submissions allowed
  full_name text not null,
  father_name text,
  cnic text not null,
  phone text not null,
  email text not null,
  province text not null,
  district text,
  tehsil text,
  address text,
  disability_type text,
  disability_percentage int,
  device_type text,
  reason text,
  cnic_doc_name text,
  medical_cert_name text,
  current_stage_index int default 0,
  submitted_at date default current_date,
  created_at timestamptz default now()
);

-- RLS is enabled with NO policies below — this deliberately blocks all
-- direct client access (anon or authenticated). Every read/write to this
-- table goes through server-side API routes using the service role key,
-- which bypasses RLS entirely. This keeps duplicate-detection and tracking
-- able to see across all applicants, without exposing the whole table to
-- the browser.
alter table applications enable row level security;

create index if not exists applications_cnic_idx on applications (cnic);
create index if not exists applications_phone_idx on applications (phone);
create index if not exists applications_email_idx on applications (lower(email));
create index if not exists applications_user_id_idx on applications (user_id);

-- =========================================================
-- demo seed data — so Track/Admin have something to show immediately
-- =========================================================
insert into applications
  (id, full_name, cnic, phone, email, province, district, device_type, current_stage_index, submitted_at)
values
  ('ATMIS-2026-48213', 'Ayesha Bibi', '17301-1234567-1', '0300-1234567', 'ayesha.demo@example.com', 'Khyber Pakhtunkhwa', 'Peshawar', 'manual-wheelchair', 4, '2026-07-14'),
  ('ATMIS-2026-48099', 'Bilal Ahmed', '17301-7654321-3', '0333-9876543', 'bilal.demo@example.com', 'Punjab', 'Lahore', 'power-wheelchair', 7, '2026-06-02')
on conflict (id) do nothing;
