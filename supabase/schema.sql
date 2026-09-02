create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer','technician','admin')),
  name text,
  mobile text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  mobile text not null,
  appliance text not null check (appliance in ('ac','refrigerator','washing_machine','geyser')),
  brand text not null,
  model text,
  problems text[],
  problem_note text,
  preferred_date date not null,
  preferred_slot text not null,
  address text not null,
  lat numeric(9,6),
  lng numeric(9,6),
  photo_url text,
  status text not null default 'pending' check (status in ('pending','assigned','on_the_way','in_progress','completed','cancelled')),
  technician_id uuid references public.profiles(id) on delete set null,
  admin_note text
);
create index if not exists idx_bookings_mobile on public.bookings (mobile);
create index if not exists idx_bookings_status on public.bookings (status);
create index if not exists idx_bookings_tech on public.bookings (technician_id);

create table if not exists public.sell_requests (
  id uuid primary key default gen_random_uuid(),
  request_code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  mobile text not null,
  appliance text not null check (appliance in ('refrigerator','ac')),
  brand_name text not null,
  model_name text not null,
  capacity_label text not null,
  age_label text not null,
  condition_label text not null,
  estimated_market integer not null default 0,
  estimated_offer integer not null default 0,
  other_offer integer,
  photos jsonb not null default '[]'::jsonb,
  video_url text,
  address text not null,
  lat numeric(9,6),
  lng numeric(9,6),
  status text not null default 'requested' check (status in ('requested','scheduled','picked','purchased','cancelled')),
  pickup_at timestamptz,
  technician_id uuid references public.profiles(id) on delete set null,
  admin_note text
);
create index if not exists idx_sells_mobile on public.sell_requests (mobile);
create index if not exists idx_sells_status on public.sell_requests (status);
create index if not exists idx_sells_tech on public.sell_requests (technician_id);

create table if not exists public.sell_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sell_models (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.sell_brands(id) on delete cascade,
  name text not null,
  appliance text not null check (appliance in ('refrigerator','ac')),
  sort integer not null default 0,
  unique (brand_id, name)
);

create table if not exists public.sell_capacities (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.sell_models(id) on delete cascade,
  label text not null,
  base_value integer not null check (base_value >= 0),
  sort integer not null default 0
);

create table if not exists public.sell_age_brackets (
  id integer primary key,
  label text not null,
  multiplier numeric not null check (multiplier > 0 and multiplier <= 1.5)
);

create table if not exists public.sell_conditions (
  id integer primary key,
  label text not null,
  note text not null default '',
  multiplier numeric not null check (multiplier > 0 and multiplier <= 1.5),
  sort integer not null default 0
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.job_updates (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  sell_request_id uuid references public.sell_requests(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  status text,
  note text,
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists trg_sells_updated on public.sell_requests;
create trigger trg_sells_updated before update on public.sell_requests
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'customer'),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and active
  );
$$;

create or replace function public.is_tech()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'technician' and active
  );
$$;

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.sell_requests enable row level security;
alter table public.sell_brands enable row level security;
alter table public.sell_models enable row level security;
alter table public.sell_capacities enable row level security;
alter table public.sell_age_brackets enable row level security;
alter table public.sell_conditions enable row level security;
alter table public.settings enable row level security;
alter table public.job_updates enable row level security;

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
for select using (id = auth.uid());

drop policy if exists "profiles admin manage" on public.profiles;
create policy "profiles admin manage" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "bookings anyone insert" on public.bookings;
create policy "bookings anyone insert" on public.bookings
for insert with check (true);

drop policy if exists "bookings admin manage" on public.bookings;
create policy "bookings admin manage" on public.bookings
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "bookings tech read own" on public.bookings;
create policy "bookings tech read own" on public.bookings
for select using (technician_id = auth.uid());

drop policy if exists "bookings tech update own" on public.bookings;
create policy "bookings tech update own" on public.bookings
for update using (technician_id = auth.uid()) with check (technician_id = auth.uid());

drop policy if exists "sells anyone insert" on public.sell_requests;
create policy "sells anyone insert" on public.sell_requests
for insert with check (true);

drop policy if exists "sells admin manage" on public.sell_requests;
create policy "sells admin manage" on public.sell_requests
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "sells tech read own" on public.sell_requests;
create policy "sells tech read own" on public.sell_requests
for select using (technician_id = auth.uid());

drop policy if exists "sells tech update own" on public.sell_requests;
create policy "sells tech update own" on public.sell_requests
for update using (technician_id = auth.uid()) with check (technician_id = auth.uid());

drop policy if exists "brands public read" on public.sell_brands;
create policy "brands public read" on public.sell_brands
for select using (true);
drop policy if exists "brands admin manage" on public.sell_brands;
create policy "brands admin manage" on public.sell_brands
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "models public read" on public.sell_models;
create policy "models public read" on public.sell_models
for select using (true);
drop policy if exists "models admin manage" on public.sell_models;
create policy "models admin manage" on public.sell_models
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "capacities public read" on public.sell_capacities;
create policy "capacities public read" on public.sell_capacities
for select using (true);
drop policy if exists "capacities admin manage" on public.sell_capacities;
create policy "capacities admin manage" on public.sell_capacities
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "ages public read" on public.sell_age_brackets;
create policy "ages public read" on public.sell_age_brackets
for select using (true);
drop policy if exists "ages admin manage" on public.sell_age_brackets;
create policy "ages admin manage" on public.sell_age_brackets
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "conditions public read" on public.sell_conditions;
create policy "conditions public read" on public.sell_conditions
for select using (true);
drop policy if exists "conditions admin manage" on public.sell_conditions;
create policy "conditions admin manage" on public.sell_conditions
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings
for select using (true);
drop policy if exists "settings admin manage" on public.settings;
create policy "settings admin manage" on public.settings
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "job_updates staff read" on public.job_updates;
create policy "job_updates staff read" on public.job_updates
for select using (public.is_admin() or public.is_tech());
drop policy if exists "job_updates staff write" on public.job_updates;
create policy "job_updates staff write" on public.job_updates
for insert with check (author_id = auth.uid() and (public.is_admin() or public.is_tech()));

create or replace function public.track_search(q text)
returns table (
  kind text,
  code text,
  customer text,
  detail text,
  status text,
  visit_date date,
  slot text,
  offer integer,
  created timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  likeq text := '%' || coalesce(q, '') || '%';
begin
  return query
  select
    'repair'::text,
    b.booking_code,
    b.customer_name,
    concat_ws(' ', initcap(replace(b.appliance, '_', ' ')), b.brand, b.model),
    b.status,
    b.preferred_date,
    b.preferred_slot,
    null::integer,
    b.created_at
  from public.bookings b
  where b.booking_code ilike likeq
  limit 5;

  return query
  select
    'sell'::text,
    s.request_code,
    s.customer_name,
    concat_ws(' ', case s.appliance when 'ac' then 'AC' else 'Refrigerator' end, s.brand_name, s.model_name, '(' || s.capacity_label || ')'),
    s.status,
    null::date,
    null::text,
    s.estimated_offer,
    s.created_at
  from public.sell_requests s
  where s.request_code ilike likeq
  limit 5;
end;
$$;

grant execute on function public.track_search(text) to anon, authenticated;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.bookings;
    exception when duplicate_object then null;
    end;
    begin
      alter publication supabase_realtime add table public.sell_requests;
    exception when duplicate_object then null;
    end;
  end if;
end;
$$;

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "uploads public read" on storage.objects;
create policy "uploads public read" on storage.objects
for select using (bucket_id = 'uploads');

drop policy if exists "uploads anyone insert" on storage.objects;
create policy "uploads anyone insert" on storage.objects
for insert with check (bucket_id = 'uploads');

insert into public.sell_brands (name, sort) values
  ('LG', 1),
  ('Samsung', 2),
  ('Whirlpool', 3),
  ('Voltas', 4),
  ('Daikin', 5),
  ('Blue Star', 6),
  ('Godrej', 7),
  ('Haier', 8),
  ('Other Brand', 9)
on conflict (name) do nothing;

insert into public.sell_models (brand_id, name, appliance, sort)
select b.id, m.name, m.appliance, m.sort
from (values
  ('LG', 'Single Door Series', 'refrigerator', 1),
  ('LG', 'Double Door Series', 'refrigerator', 2),
  ('LG', 'Split AC (Inverter)', 'ac', 3),
  ('LG', 'Window AC', 'ac', 4),
  ('Samsung', 'Single Door Series', 'refrigerator', 1),
  ('Samsung', 'Double Door Series', 'refrigerator', 2),
  ('Samsung', 'Split AC (Inverter)', 'ac', 3),
  ('Whirlpool', 'Single Door Series', 'refrigerator', 1),
  ('Whirlpool', 'Double Door Series', 'refrigerator', 2),
  ('Whirlpool', 'Split AC', 'ac', 3),
  ('Voltas', 'Split AC (Vectra/Maha)', 'ac', 1),
  ('Voltas', 'Window AC', 'ac', 2),
  ('Daikin', 'Split AC (FTKM/FTKP)', 'ac', 1),
  ('Blue Star', 'Split AC', 'ac', 1),
  ('Blue Star', 'Double Door Fridge', 'refrigerator', 2),
  ('Godrej', 'Single Door Series', 'refrigerator', 1),
  ('Godrej', 'Split AC', 'ac', 2),
  ('Haier', 'Double Door Series', 'refrigerator', 1),
  ('Haier', 'Split AC', 'ac', 2),
  ('Other Brand', 'Single Door Fridge', 'refrigerator', 1),
  ('Other Brand', 'Double Door Fridge', 'refrigerator', 2),
  ('Other Brand', 'Split AC', 'ac', 3)
) as m(brand, name, appliance, sort)
join public.sell_brands b on b.name = m.brand
on conflict do nothing;

insert into public.sell_capacities (model_id, label, base_value, sort)
select sm.id, c.label, c.base_value, c.sort
from (values
  ('LG', 'Single Door Series', '190 L', 2100, 1),
  ('LG', 'Single Door Series', '220 L', 2500, 2),
  ('LG', 'Double Door Series', '260 L', 3200, 1),
  ('LG', 'Double Door Series', '308 L', 3800, 2),
  ('LG', 'Double Door Series', '340 L', 4300, 3),
  ('LG', 'Split AC (Inverter)', '1 Ton', 4400, 1),
  ('LG', 'Split AC (Inverter)', '1.5 Ton', 5200, 2),
  ('LG', 'Split AC (Inverter)', '2 Ton', 6100, 3),
  ('LG', 'Window AC', '1.5 Ton', 3600, 1),
  ('Samsung', 'Single Door Series', '198 L', 2200, 1),
  ('Samsung', 'Single Door Series', '225 L', 2600, 2),
  ('Samsung', 'Double Door Series', '253 L', 3300, 1),
  ('Samsung', 'Double Door Series', '324 L', 4200, 2),
  ('Samsung', 'Split AC (Inverter)', '1 Ton', 4300, 1),
  ('Samsung', 'Split AC (Inverter)', '1.5 Ton', 5100, 2),
  ('Samsung', 'Split AC (Inverter)', '2 Ton', 6000, 3),
  ('Whirlpool', 'Single Door Series', '190 L', 2000, 1),
  ('Whirlpool', 'Single Door Series', '215 L', 2400, 2),
  ('Whirlpool', 'Double Door Series', '265 L', 3200, 1),
  ('Whirlpool', 'Split AC', '1 Ton', 4100, 1),
  ('Whirlpool', 'Split AC', '1.5 Ton', 4900, 2),
  ('Voltas', 'Split AC (Vectra/Maha)', '1 Ton', 4500, 1),
  ('Voltas', 'Split AC (Vectra/Maha)', '1.5 Ton', 5300, 2),
  ('Voltas', 'Split AC (Vectra/Maha)', '2 Ton', 6200, 3),
  ('Voltas', 'Window AC', '1 Ton', 3000, 1),
  ('Voltas', 'Window AC', '1.5 Ton', 3500, 2),
  ('Daikin', 'Split AC (FTKM/FTKP)', '1 Ton', 4800, 1),
  ('Daikin', 'Split AC (FTKM/FTKP)', '1.5 Ton', 5600, 2),
  ('Daikin', 'Split AC (FTKM/FTKP)', '2 Ton', 6500, 3),
  ('Blue Star', 'Split AC', '1 Ton', 4400, 1),
  ('Blue Star', 'Split AC', '1.5 Ton', 5200, 2),
  ('Blue Star', 'Double Door Fridge', '280 L', 3400, 1),
  ('Godrej', 'Single Door Series', '185 L', 2000, 1),
  ('Godrej', 'Single Door Series', '240 L', 2800, 2),
  ('Godrej', 'Split AC', '1 Ton', 4000, 1),
  ('Godrej', 'Split AC', '1.5 Ton', 4800, 2),
  ('Haier', 'Double Door Series', '258 L', 3100, 1),
  ('Haier', 'Split AC', '1.5 Ton', 4700, 1),
  ('Other Brand', 'Single Door Fridge', '190 L', 1700, 1),
  ('Other Brand', 'Double Door Fridge', '260 L', 2600, 1),
  ('Other Brand', 'Split AC', '1 Ton', 3600, 1),
  ('Other Brand', 'Split AC', '1.5 Ton', 4300, 2),
  ('Other Brand', 'Split AC', '2 Ton', 5000, 3)
) as c(brand, model, label, base_value, sort)
join public.sell_models sm on sm.name = c.model
join public.sell_brands b on b.id = sm.brand_id and b.name = c.brand
on conflict do nothing;

insert into public.sell_age_brackets (id, label, multiplier) values
  (1, '0 – 3 Years', 1.00),
  (2, '3 – 5 Years', 0.85),
  (3, '5 – 8 Years', 0.65),
  (4, '8+ Years', 0.45)
on conflict (id) do nothing;

insert into public.sell_conditions (id, label, note, multiplier, sort) values
  (1, 'Excellent', 'Like new, no repairs needed', 1.00, 1),
  (2, 'Good', 'Minor wear, fully working', 0.85, 2),
  (3, 'Average', 'Visible wear, working', 0.70, 3),
  (4, 'Not Working', 'Some fault / needs repair', 0.35, 4)
on conflict (id) do nothing;

insert into public.settings (key, value) values
  ('pricing', '{"uplift_pct": 20}'::jsonb)
on conflict (key) do nothing;
