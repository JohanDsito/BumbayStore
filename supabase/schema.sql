-- ============================================================================
-- Bumbay Tools — esquema de base de datos
--
-- Cómo usarlo: entra a tu proyecto en supabase.com, abre el SQL Editor,
-- pega todo este archivo y ejecútalo. Es idempotente: puedes correrlo de
-- nuevo sin romper nada.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Categorías
-- ----------------------------------------------------------------------------
create table if not exists public.categorias (
  slug        text primary key,
  nombre      text not null,
  orden       integer not null default 0,
  descripcion text,
  creado_en   timestamptz not null default now()
);

comment on table public.categorias is 'Categorías del catálogo. El slug es la URL: /categoria/{slug}';

-- ----------------------------------------------------------------------------
-- Productos
-- ----------------------------------------------------------------------------
create table if not exists public.productos (
  id               uuid primary key default gen_random_uuid(),
  sku              text not null unique,
  nombre           text not null,
  slug             text not null unique,
  categoria_slug   text not null references public.categorias(slug) on update cascade,
  marca            text,

  -- Precios en pesos colombianos, sin decimales.
  precio_unitario  integer not null check (precio_unitario >= 0),
  precio_mayor     integer check (precio_mayor is null or precio_mayor >= 0),

  -- Nombre del archivo dentro del bucket `productos`. Ej: bt-tal-2001.webp
  imagen           text,
  imagenes         text[] not null default '{}',

  ficha_tecnica    text,
  -- [{"label": "Voltaje", "valor": "20V máx"}, ...]
  especificaciones jsonb not null default '[]'::jsonb,
  modo_uso         text,
  beneficios       text[] not null default '{}',
  -- [{"pregunta": "...", "respuesta": "..."}, ...]
  faq              jsonb not null default '[]'::jsonb,

  destacado        boolean not null default false,
  activo           boolean not null default true,

  creado_en        timestamptz not null default now(),
  actualizado_en   timestamptz not null default now(),

  -- El precio al mayor nunca debe ser mayor que el unitario: si pasa,
  -- es un error de digitación en el Excel y conviene atajarlo aquí.
  constraint precio_mayor_coherente
    check (precio_mayor is null or precio_mayor <= precio_unitario)
);

comment on table public.productos is 'Catálogo. El slug es la URL: /producto/{slug}';

-- Índices para las consultas que realmente hace el sitio.
create index if not exists productos_categoria_idx
  on public.productos (categoria_slug) where activo;
create index if not exists productos_destacado_idx
  on public.productos (destacado) where activo and destacado;
create index if not exists productos_busqueda_idx
  on public.productos using gin (to_tsvector('spanish', nombre || ' ' || coalesce(ficha_tecnica, '')));

-- Mantener actualizado_en al día.
create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

drop trigger if exists productos_actualizado_en on public.productos;
create trigger productos_actualizado_en
  before update on public.productos
  for each row execute function public.tocar_actualizado_en();

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
create policy "categorias escritura autenticada"
  on public.categorias for all
  to authenticated
  using (true) with check (true);

drop policy if exists "productos escritura autenticada" on public.productos;
create policy "productos escritura autenticada"
  on public.productos for all
  to authenticated
  using (true) with check (true);

-- ============================================================================
-- Almacenamiento de imágenes
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do update set public = true;

drop policy if exists "imagenes lectura publica" on storage.objects;
create policy "imagenes lectura publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'productos');

drop policy if exists "imagenes escritura autenticada" on storage.objects;
create policy "imagenes escritura autenticada"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'productos')
  with check (bucket_id = 'productos');
