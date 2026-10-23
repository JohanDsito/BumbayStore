import "server-only";

import { cache } from "react";
import { crearCatalogo } from "@/aplicacion/catalogo";
import type { FuenteCatalogo } from "@/aplicacion/puertos";
import { fuenteEjemplo, fuenteExtremo, fuenteLocal } from "@/infraestructura/local/catalogo";
import { crearFuenteSupabase } from "@/infraestructura/supabase/catalogo";
import { getSupabase } from "@/infraestructura/supabase/servidor";

/**
 * Punto de armado del catálogo: el único lugar que decide qué implementación
 * se usa. Las páginas importan `catalogo` de aquí y no saben si los datos
 * vienen de Supabase o de los datos locales.
 *
 * - Con CATALOGO=ejemplo, se usan los datos locales más los nichos de
 *   ejemplo, aunque haya Supabase. Es para trabajar en tu equipo.
 * - Con CATALOGO=extremo, el catálogo del peor caso, para revisar que la
 *   interfaz aguante datos incómodos.
 * - Con Supabase configurado, se lee solo de ahí. Si no responde (ni al
 *   reintento, ver supabase/servidor.ts), la consulta falla: nunca se
 *   muestran productos de ejemplo como si fueran reales. Las páginas ya
 *   generadas conservan su última versión buena, una publicación fallida
 *   deja en línea la anterior, y las que se arman en cada visita muestran
 *   el aviso de app/(tienda)/error.tsx.
 * - Sin Supabase, se usan los datos locales directamente.
 *
 * Cada consulta va envuelta en `cache` de React: una página pide productos
 * desde el encabezado, la grilla, los relacionados y los metadatos, y sin
 * esto cada uno descargaba la tabla entera. Así se consulta una vez por
 * visita y el resto reutiliza el resultado. La memoria dura solo esa visita.
 */
function elegirFuente(): FuenteCatalogo {
  if (process.env.CATALOGO === "ejemplo") return fuenteEjemplo;
  if (process.env.CATALOGO === "extremo") return fuenteExtremo;
  const sb = getSupabase();
  return sb ? crearFuenteSupabase(sb) : fuenteLocal;
}

const fuente = elegirFuente();

export const catalogo = crearCatalogo({
  productos: cache(() => fuente.productos()),
  categorias: cache(() => fuente.categorias()),
  nichos: cache(() => fuente.nichos()),
});
