-- ============================================================================
-- Nichos: el nivel por encima de las categorías
--
-- Bumbay Store vende varias líneas de negocio (herramientas, hogar…). Cada
-- categoría pertenece a un nicho, y los productos llegan al nicho por su
-- categoría: así un producto no tiene que repetir el dato y no puede quedar
-- en un nicho distinto al de su categoría.
--
-- Las categorías que ya existían eran todas de herramientas, y quedan
-- asignadas a ese nicho.
-- ============================================================================

create table if not exists public.nichos (
  slug        text primary key,
  nombre      text not null,
  -- Marca propia del nicho, como "Bumbay Tools". null si usa solo Bumbay Store.
  submarca    text,
  descripcion text,
  orden       integer not null default 0,
  activo      boolean not null default true,
  creado_en   timestamptz not null default now()
);

comment on table public.nichos is 'Líneas de negocio de Bumbay Store. El slug es la URL: /{slug}';

alter table public.nichos enable row level security;

drop policy if exists "nichos lectura publica" on public.nichos;
create policy "nichos lectura publica"
  on public.nichos for select
  to anon, authenticated
  using (activo);

drop policy if exists "nichos escritura admin" on public.nichos;
create policy "nichos escritura admin"
  on public.nichos for all
  to authenticated
  using (public.es_admin()) with check (public.es_admin());

insert into public.nichos (slug, nombre, submarca, descripcion, orden)
values (
  'herramientas',
  'Herramientas',
  'Bumbay Tools',
  'Herramienta inalámbrica profesional de 128V: taladros, pulidoras, llaves de impacto, combos y herramienta manual.',
  1
)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Cada categoría, en un nicho
-- ----------------------------------------------------------------------------
alter table public.categorias
  add column if not exists nicho_slug text
  references public.nichos(slug) on update cascade;

update public.categorias set nicho_slug = 'herramientas' where nicho_slug is null;

alter table public.categorias alter column nicho_slug set not null;

create index if not exists categorias_nicho_idx on public.categorias (nicho_slug);
