-- L'ANTICA FORNO MEDEA — Supabase schema (شغّله كاملاً في SQL Editor، ثم شغّل seed.sql)
create extension if not exists pgcrypto;

-- ===== المديرون =====
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz default now());
alter table public.admins enable row level security;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins for select to authenticated using (user_id = auth.uid());
-- لا توجد سياسة إدراج/تعديل/حذف: إضافة مدير تتم فقط من SQL Editor (انظر README).

-- ===== القائمة =====
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), name_ar text not null, name_fr text, emoji text default '🍽️',
  sort_order int default 0, is_active boolean default true);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid not null references public.categories(id) on delete restrict,
  name_ar text not null, name_fr text, desc_ar text, desc_fr text, emoji text default '🍽️',
  base_price int check (base_price >= 0), image_url text, is_new boolean default false,
  is_available boolean default true, is_hidden boolean default false, sold_out_date date, sort_order int default 0);
create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  name_ar text not null, name_fr text, price int not null check (price >= 0), sort_order int default 0);
create table if not exists public.product_extras (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  name_ar text not null, name_fr text, price int default 0 check (price >= 0), size_prices jsonb, sort_order int default 0);
create table if not exists public.option_groups (  -- خيار إلزامي واحد (الصلصة / النوع): slot = ch أو ch2 كما في الموقع الأصلي
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  slot text not null check (slot in ('ch','ch2')), title_ar text not null, title_fr text, sort_order int default 0,
  unique (product_id, slot));
create table if not exists public.group_options (
  id uuid primary key default gen_random_uuid(), group_id uuid not null references public.option_groups(id) on delete cascade,
  name_ar text not null, name_fr text, price int default 0 check (price >= 0), size_prices jsonb, sort_order int default 0);
create table if not exists public.product_removables (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  name_ar text not null, name_fr text, sort_order int default 0);
create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(), name_ar text not null, name_fr text,
  fee int check (fee >= 0),  -- NULL = يؤكدها المطعم
  sort_order int default 0, is_active boolean default true);
create table if not exists public.restaurant_settings (
  id int primary key default 1 check (id = 1), phone text, map_url text, social jsonb default '{}',
  schedule jsonb, dine_enabled boolean default true, tables_list text default '1-20', enforce_hours boolean default true,
  logo_url text, cover_url text, hero_url text, content jsonb default '{}');

-- ===== الطلبات =====
create sequence if not exists public.order_seq;
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique,
  client_token uuid unique, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  customer_name text, phone text, order_type text not null check (order_type in ('delivery','pickup','dine_in')),
  zone_name text, address text, table_number text, notes text,
  items jsonb not null, subtotal int not null, delivery_fee int, delivery_fee_pending boolean not null default false, total int not null,
  status text not null default 'new' check (status in ('new','preparing','ready','out_for_delivery','completed','cancelled')));
create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_phone_idx on public.orders (phone, created_at desc);
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- ===== RLS =====
do $$ declare t text; begin
  foreach t in array array['categories','products','product_sizes','product_extras','option_groups','group_options','product_removables','delivery_zones','restaurant_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t||'_read', t);
    execute format('drop policy if exists %I on public.%I', t||'_admin', t);
    execute format('create policy %I on public.%I for select to anon, authenticated using (true)', t||'_read', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t||'_admin', t);
  end loop; end $$;
-- المنتجات المخفية لا تظهر إلا للمدير
drop policy if exists products_read on public.products;
create policy products_read on public.products for select to anon, authenticated using (not is_hidden or public.is_admin());

alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;
grant update (status) on public.orders to authenticated;   -- المدير يغيّر الحالة فقط
drop policy if exists orders_admin_select on public.orders;
drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_select on public.orders for select to authenticated using (public.is_admin());
create policy orders_admin_update on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- لا سياسة INSERT للزبون: الإدراج الوحيد عبر الدالة place_order أدناه.

-- ===== دوال مساعدة =====
create or replace function public.opt_price(p int, sp jsonb, sid uuid) returns int language sql immutable
as $$ select case when sp is not null and sp <> '{}'::jsonb then coalesce((sp->>(sid::text))::int, 0) else coalesce(p, 0) end $$;

create or replace function public.table_ok(lst text, t text) returns boolean language plpgsql immutable as $$
declare x text; m text[];
begin
  if t is null or t = '' or length(t) > 10 then return false; end if;
  for x in select btrim(v) from regexp_split_to_table(coalesce(lst,''), E'[,،\\n]') v loop
    m := regexp_match(x, '^(\d{1,4})\s*-\s*(\d{1,4})$');
    if m is not null then
      if t ~ '^\d{1,4}$' and t::int between m[1]::int and m[2]::int then return true; end if;
    elsif x <> '' and x = t then return true; end if;
  end loop;
  return false;
end $$;

create or replace function public.shop_is_open(sch jsonb) returns boolean language plpgsql stable as $$
declare n timestamp := now() at time zone 'Africa/Algiers'; d jsonb; o int; c int; m int;
begin
  if sch is null or jsonb_typeof(sch) <> 'array' or jsonb_array_length(sch) <> 7 then return true; end if;
  m := extract(hour from n)::int * 60 + extract(minute from n)::int;
  d := sch -> extract(dow from n)::int;                 -- 0 = الأحد، كما في JavaScript
  if coalesce((d->>'closed')::boolean, false) then return false; end if;
  o := split_part(d->>'open',':',1)::int * 60 + split_part(d->>'open',':',2)::int;
  c := split_part(d->>'close',':',1)::int * 60 + split_part(d->>'close',':',2)::int;
  return case when c > o then m >= o and m < c else m >= o or m < c end;
end $$;

-- ===== إنشاء الطلب: الأسعار تُحسب هنا من قاعدة البيانات، ولا يُوثق بأي سعر يرسله المتصفح =====
create or replace function public.place_order(payload jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  s restaurant_settings%rowtype; v_type text := payload->>'order_type';
  v_name text := left(btrim(coalesce(payload->>'customer_name','')), 80);
  v_phone text := regexp_replace(coalesce(payload->>'phone',''), '[\s.\-]', '', 'g');
  v_addr text := left(btrim(coalesce(payload->>'address','')), 300);
  v_notes text := left(btrim(coalesce(payload->>'notes','')), 500);
  v_table text := left(btrim(coalesce(payload->>'table_number','')), 10);
  v_token uuid; v_zone delivery_zones%rowtype; v_zone_name text; v_fee int := 0; v_pending boolean := false;
  it jsonb; p products%rowtype; sz product_sizes%rowtype; g option_groups%rowtype; o group_options%rowtype;
  e product_extras%rowtype; r product_removables%rowtype; x text; n int; has_sizes boolean;
  v_size_id uuid; v_size_name text; v_size_fr text; v_qty int; v_unit int; v_sub int := 0;
  v_items jsonb := '[]'::jsonb; v_ch jsonb; v_ex jsonb; v_rm jsonb; v_ord orders%rowtype; v_today date := (now() at time zone 'Africa/Algiers')::date; v_seq text;
begin
  begin v_token := (payload->>'client_token')::uuid; exception when others then v_token := null; end;
  if v_token is not null then
    select * into v_ord from orders where client_token = v_token;
    if found then return jsonb_build_object('order_number', v_ord.order_number, 'subtotal', v_ord.subtotal, 'delivery_fee', v_ord.delivery_fee,
      'delivery_fee_pending', v_ord.delivery_fee_pending, 'total', v_ord.total, 'created_at', v_ord.created_at); end if;
  end if;
  if v_type not in ('delivery','pickup','dine_in') then raise exception 'invalid_type'; end if;
  select * into s from restaurant_settings where id = 1;
  if coalesce(s.enforce_hours, true) and not shop_is_open(s.schedule) then raise exception 'shop_closed'; end if;
  if v_type <> 'dine_in' and char_length(v_name) < 2 then raise exception 'invalid_name'; end if;
  if (v_type <> 'dine_in' or v_phone <> '') and v_phone !~ '^(0|\+?213)[5-7]\d{8}$' then raise exception 'invalid_phone'; end if;
  if v_phone <> '' and (select count(*) from orders where phone = v_phone and created_at > now() - interval '10 minutes') >= 5 then raise exception 'rate_limited'; end if;
  if jsonb_typeof(payload->'items') <> 'array' or jsonb_array_length(payload->'items') not between 1 and 40 then raise exception 'invalid_items'; end if;

  if v_type = 'delivery' then
    select * into v_zone from delivery_zones where id = (payload->>'zone_id')::uuid and is_active;
    if not found then raise exception 'invalid_zone'; end if;
    v_zone_name := v_zone.name_ar; v_fee := v_zone.fee; v_pending := v_zone.fee is null;
  elsif v_type = 'dine_in' then
    if not coalesce(s.dine_enabled, true) then raise exception 'dine_disabled'; end if;
    if not table_ok(s.tables_list, v_table) then raise exception 'invalid_table'; end if;
  end if;

  for it in select * from jsonb_array_elements(payload->'items') loop
    v_qty := coalesce((it->>'qty')::int, 0);
    if v_qty < 1 or v_qty > 50 then raise exception 'invalid_qty'; end if;
    select * into p from products where id = (it->>'product_id')::uuid and not is_hidden and is_available and sold_out_date is distinct from v_today;
    if not found then raise exception 'product_unavailable'; end if;
    has_sizes := exists (select 1 from product_sizes where product_id = p.id);
    v_size_id := null; v_size_name := null; v_size_fr := null;
    if has_sizes then
      select * into sz from product_sizes where id = (it->>'size_id')::uuid and product_id = p.id;
      if not found then raise exception 'invalid_size'; end if;
      v_unit := sz.price; v_size_id := sz.id; v_size_name := sz.name_ar; v_size_fr := sz.name_fr;
    else
      if p.base_price is null then raise exception 'invalid_price'; end if;
      v_unit := p.base_price;
    end if;
    v_ch := '[]'::jsonb; v_ex := '[]'::jsonb; v_rm := '[]'::jsonb;
    for g in select * from option_groups where product_id = p.id and exists (select 1 from group_options where group_id = option_groups.id) order by sort_order loop
      select count(*) into n from group_options where group_id = g.id and id::text in (select jsonb_array_elements_text(coalesce(it->'option_ids','[]'::jsonb)));
      if n <> 1 then raise exception 'invalid_option'; end if;
      select * into o from group_options where group_id = g.id and id::text in (select jsonb_array_elements_text(coalesce(it->'option_ids','[]'::jsonb))) limit 1;
      v_unit := v_unit + opt_price(o.price, o.size_prices, v_size_id);
      v_ch := v_ch || jsonb_build_object('group', g.title_ar, 'group_fr', g.title_fr, 'name', o.name_ar, 'name_fr', o.name_fr, 'price', opt_price(o.price, o.size_prices, v_size_id));
    end loop;
    for x in select distinct jsonb_array_elements_text(coalesce(it->'extra_ids','[]'::jsonb)) loop
      select * into e from product_extras where id = x::uuid and product_id = p.id;
      if not found then raise exception 'invalid_extra'; end if;
      v_unit := v_unit + opt_price(e.price, e.size_prices, v_size_id);
      v_ex := v_ex || jsonb_build_object('name', e.name_ar, 'name_fr', e.name_fr, 'price', opt_price(e.price, e.size_prices, v_size_id));
    end loop;
    for x in select distinct jsonb_array_elements_text(coalesce(it->'removed_ids','[]'::jsonb)) loop
      select * into r from product_removables where id = x::uuid and product_id = p.id;
      if not found then raise exception 'invalid_removed'; end if;
      v_rm := v_rm || jsonb_build_object('name', r.name_ar, 'name_fr', r.name_fr);
    end loop;
    v_sub := v_sub + v_unit * v_qty;
    v_items := v_items || jsonb_build_object('product_id', p.id, 'name', p.name_ar, 'name_fr', p.name_fr, 'size', v_size_name, 'size_fr', v_size_fr,
      'choices', v_ch, 'extras', v_ex, 'removed', v_rm, 'note', left(btrim(coalesce(it->>'note','')), 200),
      'qty', v_qty, 'unit_price', v_unit, 'line_total', v_unit * v_qty);
  end loop;

  v_seq := nextval('public.order_seq')::text;
  insert into orders (order_number, client_token, customer_name, phone, order_type, zone_name, address, table_number, notes, items, subtotal, delivery_fee, delivery_fee_pending, total)
  values ('LA-' || to_char(now() at time zone 'Africa/Algiers', 'YYMMDD') || '-' || repeat('0', greatest(0, 4 - length(v_seq))) || v_seq,
          v_token, nullif(v_name,''), nullif(v_phone,''), v_type, v_zone_name, nullif(v_addr,''), nullif(v_table,''), nullif(v_notes,''),
          v_items, v_sub, case when v_type = 'delivery' then v_fee end, v_pending, v_sub + coalesce(v_fee, 0))
  returning * into v_ord;
  return jsonb_build_object('order_number', v_ord.order_number, 'subtotal', v_ord.subtotal, 'delivery_fee', v_ord.delivery_fee,
    'delivery_fee_pending', v_ord.delivery_fee_pending, 'total', v_ord.total, 'created_at', v_ord.created_at);
end $$;

revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;
