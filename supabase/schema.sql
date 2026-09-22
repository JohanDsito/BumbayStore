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

  -- Versiones de color: dos filas con el mismo `grupo` y distinto `color`
  -- son la misma herramienta en colores diferentes. Cada una conserva su
  -- propio SKU, su URL y su foto.
  color            text,
  grupo            text,

  -- Precios en pesos colombianos, sin decimales.
  precio_unitario  integer not null check (precio_unitario >= 0),
  precio_mayor     integer check (precio_mayor is null or precio_mayor >= 0),

  -- Nombre del archivo dentro del bucket `productos`. Ej: bt-tal-2001.webp
  imagen           text,
  -- Recorte cuadrado para la grilla del catálogo.
  imagen_mini      text,
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

-- Columnas añadidas después de la primera versión del esquema. Van como ALTER
-- para que volver a ejecutar este archivo actualice una tabla ya creada.
alter table public.productos add column if not exists color       text;
alter table public.productos add column if not exists grupo       text;
alter table public.productos add column if not exists imagen_mini text;

-- Índices para las consultas que realmente hace el sitio.
create index if not exists productos_categoria_idx
  on public.productos (categoria_slug) where activo;
create index if not exists productos_grupo_idx
  on public.productos (grupo) where activo and grupo is not null;
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
drop policy if exists "imagenes escritura admin" on storage.objects;
create policy "imagenes escritura admin"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'productos' and public.es_admin())
  with check (bucket_id = 'productos' and public.es_admin());

-- ============================================================================
-- Existencias
-- ============================================================================

-- `agotado` no es lo mismo que `activo`. Un producto agotado sigue publicado y
-- sigue indexado en Google —quitarlo y volverlo a poner cada semana destruye su
-- posicionamiento—, pero no se puede agregar al pedido.
alter table public.productos add column if not exists agotado boolean not null default false;

-- ============================================================================
-- Pedidos iniciados
--
-- Se guarda el pedido en el momento en que el cliente pulsa "Enviar por
-- WhatsApp", antes de salir del sitio. Así quedan registrados también los que
-- nunca llegaron al chat porque se arrepintieron en el último paso.
-- ============================================================================

create table if not exists public.pedidos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  ciudad      text not null,
  comentario  text,
  total       integer not null,
  unidades    integer not null,
  -- [{sku, nombre, cantidad, precio}, ...] congelado en el momento del pedido:
  -- si mañana cambia el precio, este registro sigue contando lo que se pidió.
  lineas      jsonb not null,
  creado_en   timestamptz not null default now()
);

create index if not exists pedidos_fecha_idx on public.pedidos (creado_en desc);

-- ============================================================================
-- Búsquedas sin resultados
--
-- Lo que la gente busca y no encuentra es demanda medida: dice qué conviene
-- traer en la próxima importación.
-- ============================================================================

create table if not exists public.busquedas (
  id          uuid primary key default gen_random_uuid(),
  consulta    text not null,
  resultados  integer not null default 0,
  creado_en   timestamptz not null default now()
);

create index if not exists busquedas_fecha_idx on public.busquedas (creado_en desc);
create index if not exists busquedas_vacias_idx on public.busquedas (consulta) where resultados = 0;

-- ----------------------------------------------------------------------------
-- Seguridad de las tablas nuevas
--
-- Cualquiera puede ESCRIBIR (un visitante anónimo registra su pedido o su
-- búsqueda) pero solo un usuario autenticado puede LEER: son datos de negocio.
-- Es el permiso inverso al del catálogo.
-- ----------------------------------------------------------------------------

alter table public.pedidos   enable row level security;
alter table public.busquedas enable row level security;

drop policy if exists "pedidos registro publico" on public.pedidos;
create policy "pedidos registro publico"
  on public.pedidos for insert
  to anon, authenticated
  with check (true);

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


-- ============================================================================
-- Dar de alta al administrador
--
-- 1. Authentication -> Users -> Add user  (marca Auto Confirm User)
-- 2. Vuelve aquí, cambia el correo de abajo por el tuyo y ejecuta esta línea.
--
-- Sin este paso el panel deja entrar pero no deja guardar nada, que es
-- exactamente lo que le pasaría a un desconocido que se registre por su
-- cuenta.
-- ============================================================================

-- insert into public.admins (user_id, correo)
-- select id, email from auth.users where email = 'TU-CORREO@ejemplo.com'
-- on conflict (user_id) do nothing;
