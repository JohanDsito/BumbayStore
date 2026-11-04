-- ============================================================================
-- Datos del cliente en el pedido
--
-- El formulario pasa de "nombre + ciudad" a nombre, apellido, celular,
-- departamento, municipio y forma de pago, cada uno en su columna: así el
-- panel puede agrupar por zona y filtrar por forma de pago.
--
-- `ciudad` ("Municipio, Departamento") queda para los pedidos anteriores y
-- deja de ser obligatoria: los nuevos ya no la llenan.
--
-- La restricción `pedidos_forma` se reescribe con las mismas reglas que
-- src/dominio/pedido.ts aplica en el navegador. Sigue como NOT VALID: no
-- revisa las filas viejas, que no tienen los campos nuevos, solo lo que
-- entre desde ahora.
--
-- OJO al publicar: desde que esta migración se aplica, la versión anterior
-- de la página ya no puede registrar pedidos (no manda los campos nuevos).
-- El pedido igual llega a WhatsApp; solo falta en el panel. Aplicarla justo
-- al publicar el código que la acompaña.
-- ============================================================================

alter table public.pedidos add column if not exists apellido     text;
alter table public.pedidos add column if not exists celular      text;
alter table public.pedidos add column if not exists departamento text;
alter table public.pedidos add column if not exists municipio    text;
alter table public.pedidos add column if not exists forma_pago   text;

alter table public.pedidos alter column ciudad drop not null;

comment on column public.pedidos.celular is
  'Celular de contacto: 10 dígitos que empiezan por 3, sin espacios.';
comment on column public.pedidos.forma_pago is
  'anticipado, contra_entrega, addi o sistecredito (ver FORMAS_PAGO en src/dominio/pedido.ts).';
comment on column public.pedidos.ciudad is
  'Solo pedidos anteriores a noviembre de 2026: "Municipio, Departamento". Los nuevos usan departamento y municipio.';

alter table public.pedidos drop constraint if exists pedidos_forma;
-- Los "is not null" van explícitos: un CHECK que da NULL cuenta como
-- cumplido, y sin ellos un pedido sin apellido o sin celular pasaría.
alter table public.pedidos add constraint pedidos_forma check (
  apellido is not null
  and celular is not null
  and departamento is not null
  and municipio is not null
  and forma_pago is not null
  and char_length(btrim(nombre)) between 2 and 80
  and char_length(btrim(apellido)) between 2 and 80
  and celular ~ '^3[0-9]{9}$'
  and char_length(btrim(departamento)) between 2 and 60
  and char_length(btrim(municipio)) between 2 and 80
  and forma_pago in ('anticipado', 'contra_entrega', 'addi', 'sistecredito')
  and (ciudad is null or char_length(btrim(ciudad)) between 2 and 120)
  and (comentario is null or char_length(comentario) <= 1000)
  and total >= 0
  and unidades between 1 and 99900
  and jsonb_typeof(lineas) = 'array'
  and jsonb_array_length(lineas) between 1 and 100
) not valid;

-- Para agrupar y filtrar en el panel.
create index if not exists pedidos_departamento_idx on public.pedidos (departamento);
create index if not exists pedidos_forma_pago_idx   on public.pedidos (forma_pago);
