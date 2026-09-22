-- ============================================================================
-- FALTA POR EJECUTAR
--
-- Tu base ya tiene las tablas, la columna `agotado`, pedidos y busquedas.
-- Lo unico que falta es la tabla de administradores, la funcion que decide
-- quien lo es, y las politicas que dependen de ella.
--
-- Pega TODO esto en el SQL Editor de Supabase y ejecutalo de una vez.
-- ============================================================================

-- ============================================================================
-- Quién es administrador
--
-- No basta con "estar autenticado". El registro de Supabase está abierto por
-- defecto: cualquiera puede crearse una cuenta con su propio correo,
-- confirmarla y quedar autenticado. Si las políticas se conformaran con eso,
-- esa persona podría editar el catálogo.
--
-- Por eso el permiso se ata a una lista explícita. Estar en esta tabla es lo
-- único que da acceso de escritura.
-- ============================================================================

create table if not exists public.admins (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  correo    text,
  creado_en timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Nadie puede leer ni modificar esta tabla desde el navegador. Se administra
-- solo desde el SQL Editor, que usa la llave de servicio y se salta RLS.
drop policy if exists "admins sin acceso publico" on public.admins;

create or replace function public.es_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

comment on function public.es_admin is
  'Verdadero si quien hace la petición está en la tabla admins.';

-- ============================================================================
-- Seguridad a nivel de fila (RLS)
--
-- La idea: cualquiera puede LEER el catálogo (si no, la tienda no funciona),
-- pero solo un usuario autenticado puede modificarlo. La llave `anon` que va
-- en el navegador queda así limitada a lectura, aunque alguien la extraiga
-- del código fuente.
-- ============================================================================

alter table public.categorias enable row level security;
alter table public.productos  enable row level security;

-- Lectura pública
drop policy if exists "categorias lectura publica" on public.categorias;
create policy "categorias lectura publica"
  on public.categorias for select
  to anon, authenticated
  using (true);

drop policy if exists "productos lectura publica" on public.productos;
create policy "productos lectura publica"
  on public.productos for select
  to anon, authenticated
  using (activo);

-- Escritura solo para usuarios autenticados (tú, desde el panel de Supabase).
drop policy if exists "categorias escritura autenticada" on public.categorias;
drop policy if exists "categorias escritura admin" on public.categorias;
create policy "categorias escritura admin"
  on public.categorias for all
  to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "productos escritura autenticada" on public.productos;
drop policy if exists "productos escritura admin" on public.productos;
create policy "productos escritura admin"
  on public.productos for all
  to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- ----------------------------------------------------------------------------
-- Pedidos y busquedas: la lectura tambien pasa a exigir ser administrador
-- ----------------------------------------------------------------------------
drop policy if exists "pedidos lectura autenticada" on public.pedidos;
drop policy if exists "pedidos lectura admin" on public.pedidos;
create policy "pedidos lectura admin"
  on public.pedidos for select
  to authenticated
  using (public.es_admin());

drop policy if exists "busquedas registro publico" on public.busquedas;
create policy "busquedas registro publico"
  on public.busquedas for insert
  to anon, authenticated
  with check (true);

drop policy if exists "busquedas lectura autenticada" on public.busquedas;
drop policy if exists "busquedas lectura admin" on public.busquedas;
create policy "busquedas lectura admin"
  on public.busquedas for select
  to authenticated
  using (public.es_admin());

-- ----------------------------------------------------------------------------
-- Imagenes: subir y borrar tambien exige ser administrador
-- ----------------------------------------------------------------------------
drop policy if exists "imagenes escritura autenticada" on storage.objects;
drop policy if exists "imagenes escritura admin" on storage.objects;
create policy "imagenes escritura admin"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'productos' and public.es_admin())
  with check (bucket_id = 'productos' and public.es_admin());

-- ----------------------------------------------------------------------------
-- Darte de alta como administrador
-- ----------------------------------------------------------------------------
insert into public.admins (user_id, correo)
select id, email from auth.users where email = 'bumbaycol@gmail.com'
on conflict (user_id) do nothing;

-- Comprobación: debe devolver una fila con tu correo.
select correo, creado_en from public.admins;
