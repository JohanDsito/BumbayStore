import type { FuenteCatalogo } from "@/aplicacion/puertos";

/**
 * Una fuente que suma otras dos: los productos, categorías y nichos de ambas.
 * Se usa en la demostración, para ver los nichos de ejemplo junto al catálogo
 * real de Supabase.
 */
export function sumarFuentes(a: FuenteCatalogo, b: FuenteCatalogo): FuenteCatalogo {
  return {
    productos: async () => [...(await a.productos()), ...(await b.productos())],
    categorias: async () => [...(await a.categorias()), ...(await b.categorias())],
    nichos: async () => [...(await a.nichos()), ...(await b.nichos())],
  };
}
