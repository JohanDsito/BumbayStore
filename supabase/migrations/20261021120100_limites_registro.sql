-- ============================================================================
-- Límites para lo que escribe un visitante anónimo
--
-- `pedidos` y `busquedas` aceptan inserciones de cualquiera con la llave
-- pública, que viaja en el navegador. Sin límites, alguien podría llenarlas
-- de basura —miles de pedidos falsos con totales inventados— y dejar
-- inservibles los números del panel.
--
-- Dos defensas:
--
-- 1. Restricciones de forma: un pedido tiene entre 1 y 100 líneas, un nombre
--    razonable, un total no negativo… Son las mismas reglas que
--    src/dominio/pedido.ts aplica en el navegador; aquí son las que mandan.
--    Van como NOT VALID para no rechazar filas viejas: se aplican a todo lo
--    que entre desde ahora.
--
-- 2. Un tope de velocidad: pocos registros seguidos desde el mismo origen y
--    un techo total cada 10 minutos. El registro es estadística —el pedido
--    llega a WhatsApp aunque aquí se rechace—, así que frenarlo nunca le
--    cuesta una venta a nadie.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Forma
-- ----------------------------------------------------------------------------
alter table public.pedidos drop constraint if exists pedidos_forma;
alter table public.pedidos add constraint pedidos_forma check (
  char_length(btrim(nombre)) between 2 and 80
  and char_length(btrim(ciudad)) between 2 and 120
  and (comentario is null or char_length(comentario) <= 1000)
  and total >= 0
  and unidades between 1 and 99900
  and jsonb_typeof(lineas) = 'array'
  and jsonb_array_length(lineas) between 1 and 100
) not valid;

alter table public.busquedas drop constraint if exists busquedas_forma;
alter table public.busquedas add constraint busquedas_forma check (
  char_length(btrim(consulta)) between 2 and 120
  and resultados >= 0
) not valid;

-- ----------------------------------------------------------------------------
-- 2. Velocidad
--
-- `origen` identifica de dónde vino la petición sin guardar la IP: es un hash
-- de la IP con la fecha del día, así que sirve para contar y no para rastrear
-- a nadie de un día para otro.
-- ----------------------------------------------------------------------------
alter table public.pedidos   add column if not exists origen text;
alter table public.busquedas add column if not exists origen text;

create index if not exists pedidos_origen_idx
  on public.pedidos (origen, creado_en desc) where origen is not null;
create index if not exists busquedas_origen_idx
  on public.busquedas (origen, creado_en desc) where origen is not null;

-- IP del visitante según las cabeceras que la API de Supabase le pasa a la
-- base. Se prefieren las que pone el proxy (cf-connecting-ip, x-real-ip),
-- que el visitante no puede falsear; x-forwarded-for queda de último recurso.
-- null cuando no hay petición HTTP detrás (SQL Editor, scripts locales).
create or replace function public.ip_peticion()
returns text
language sql
stable
as $$
  with cabeceras as (
    select nullif(current_setting('request.headers', true), '')::json as h
  )
  select nullif(btrim(coalesce(
    h ->> 'cf-connecting-ip',
    h ->> 'x-real-ip',
    split_part(h ->> 'x-forwarded-for', ',', 1)
  )), '')
  from cabeceras;
$$;

comment on function public.ip_peticion is
  'IP del visitante tomada de las cabeceras de la petición, o null si no hay petición HTTP.';

-- Argumentos del disparador: máximo por origen y máximo total, ambos por
-- ventana de 10 minutos.
create or replace function public.limitar_registros()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  por_origen integer := tg_argv[0]::integer;
  en_total   integer := tg_argv[1]::integer;
  ip         text    := public.ip_peticion();
  recientes  integer;
begin
  -- Lo calcula la base; lo que mande el navegador en esta columna se ignora.
  new.origen := case when ip is null then null else md5(ip || ':' || current_date::text) end;

  -- Sin petición HTTP detrás no hay visitante a quien limitar.
  if ip is null then
    return new;
  end if;

  execute format(
    'select count(*) from %I.%I where creado_en > now() - interval ''10 minutes''',
    tg_table_schema, tg_table_name
  ) into recientes;
  if recientes >= en_total then
    raise exception 'Demasiados registros en los últimos minutos' using errcode = 'P0001';
  end if;

  execute format(
    'select count(*) from %I.%I where origen = $1 and creado_en > now() - interval ''10 minutes''',
    tg_table_schema, tg_table_name
  ) into recientes using new.origen;
  if recientes >= por_origen then
    raise exception 'Demasiados registros seguidos desde el mismo origen' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists pedidos_limite on public.pedidos;
create trigger pedidos_limite
  before insert on public.pedidos
  for each row execute function public.limitar_registros('5', '100');

drop trigger if exists busquedas_limite on public.busquedas;
create trigger busquedas_limite
  before insert on public.busquedas
  for each row execute function public.limitar_registros('30', '600');
