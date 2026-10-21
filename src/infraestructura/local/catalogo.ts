import type { FuenteCatalogo } from "@/aplicacion/puertos";
import { productosSeed } from "@/data/products.seed";
import { categoriasSeed } from "@/data/categories.seed";
import { nichosSeed } from "@/data/nichos.seed";

/**
 * El catálogo de ejemplo que vive en `src/data`.
 *
 * Sirve para trabajar sin base de datos y como respaldo: si Supabase no
 * responde en producción, la tienda muestra esto en vez de quedar en blanco.
 */
export const fuenteLocal: FuenteCatalogo = {
  productos: async () => productosSeed.filter((p) => p.activo),
  categorias: async () => [...categoriasSeed],
  nichos: async () => [...nichosSeed],
};
