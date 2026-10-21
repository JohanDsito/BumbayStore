import "server-only";

import { cache } from "react";
import { crearCatalogo } from "@/aplicacion/catalogo";
import type { FuenteCatalogo } from "@/aplicacion/puertos";
import { fuenteLocal } from "@/infraestructura/local/catalogo";
import { conRespaldo } from "@/infraestructura/respaldo";
import { crearFuenteSupabase } from "@/infraestructura/supabase/catalogo";
import { getSupabase } from "@/infraestructura/supabase/servidor";

/**
 * Punto de armado del catálogo: el único lugar que decide qué implementación
 * se usa. Las páginas importan `catalogo` de aquí y no saben si los datos
 * vienen de Supabase o de los datos locales.
 *
 * - Con Supabase configurado, se lee de ahí y, si falla, de los datos locales.
 * - Sin Supabase, se usan los datos locales directamente.
 *
 * Cada consulta va envuelta en `cache` de React: una página pide productos
 * desde el encabezado, la grilla, los relacionados y los metadatos, y sin
 * esto cada uno descargaba la tabla entera. Así se consulta una vez por
 * visita y el resto reutiliza el resultado. La memoria dura solo esa visita.
 */
function elegirFuente(): FuenteCatalogo {
  const sb = getSupabase();
  return sb ? conRespaldo(crearFuenteSupabase(sb), fuenteLocal) : fuenteLocal;
}

const fuente = elegirFuente();

export const catalogo = crearCatalogo({
  productos: cache(() => fuente.productos()),
  categorias: cache(() => fuente.categorias()),
  nichos: cache(() => fuente.nichos()),
});
