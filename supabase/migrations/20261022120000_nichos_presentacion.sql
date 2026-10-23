-- ============================================================================
-- Lo que cada nicho muestra en su portada
--
-- La portada de un nicho sale de sus datos, no del código: así un nicho nuevo
-- se presenta solo, sin que haya que programar su página.
--
--   titular  El título grande. Si tiene dos líneas (separadas por un salto
--            de línea), la segunda se resalta con el color de la marca.
--   datos    Cifras cortas bajo el título: [{"etiqueta": "...", "valor": "..."}]
-- ============================================================================

alter table public.nichos add column if not exists titular text;
alter table public.nichos add column if not exists datos jsonb not null default '[]'::jsonb;

alter table public.nichos drop constraint if exists nichos_datos_lista;
alter table public.nichos add constraint nichos_datos_lista
  check (jsonb_typeof(datos) = 'array');

-- Herramientas conserva lo que ya decía su portada.
update public.nichos
set
  titular = E'Herramienta inalámbrica\na precio de mayorista.',
  descripcion = 'Taladros, pulidoras, combos y herramienta manual para ferreterías, talleres y contratistas en toda Colombia. Arma tu pedido en el catálogo y lo cerramos por WhatsApp.',
  datos = '[{"etiqueta": "Meses de garantía", "valor": "6"}, {"etiqueta": "Plataforma de batería", "valor": "128V"}]'::jsonb
where slug = 'herramientas' and titular is null;

-- ----------------------------------------------------------------------------
-- El slug de un nicho es la primera parte de la URL (/herramientas), así que
-- no puede chocar con una sección fija del sitio ni llevar caracteres raros.
-- La misma lista vive en src/dominio/rutas.ts.
-- ----------------------------------------------------------------------------
alter table public.nichos drop constraint if exists nichos_slug_valido;
alter table public.nichos add constraint nichos_slug_valido check (
  slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  and slug not in ('acceso', 'api', 'buscar', 'categoria', 'producto')
);

-- ----------------------------------------------------------------------------
-- El panel tiene que ver también los nichos apagados para poder encenderlos.
-- La lectura pública sigue mostrando solo los activos.
-- ----------------------------------------------------------------------------
drop policy if exists "nichos lectura admin" on public.nichos;
create policy "nichos lectura admin"
  on public.nichos for select
  to authenticated
  using (public.es_admin());
