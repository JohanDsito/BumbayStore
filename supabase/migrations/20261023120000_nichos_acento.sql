-- ============================================================================
-- Color de acento de cada nicho
--
-- Cada nicho tiene su color: tiñe su filamento en el campo de luz de la
-- portada, sus botones y sus enlaces. Herramientas conserva el rojo exacto
-- del logotipo de Bumbay.
-- ============================================================================

alter table public.nichos add column if not exists acento text;

alter table public.nichos drop constraint if exists nichos_acento_hex;
alter table public.nichos add constraint nichos_acento_hex
  check (acento is null or acento ~ '^#[0-9a-fA-F]{6}$');

update public.nichos set acento = '#ec080f' where slug = 'herramientas' and acento is null;
