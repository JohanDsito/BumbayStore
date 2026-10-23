import type { FuenteCatalogo } from "@/aplicacion/puertos";
import { productosSeed } from "@/data/products.seed";
import { categoriasSeed } from "@/data/categories.seed";
import { nichosSeed } from "@/data/nichos.seed";
import { categoriasEjemplo, nichosEjemplo, productosEjemplo } from "@/data/ejemplo.seed";

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

/**
 * El catálogo local más los nichos de ejemplo de `src/data/ejemplo.seed.ts`.
 * Sirve para ver y diseñar la tienda con varias líneas antes de que existan
 * los nichos reales. Se elige con CATALOGO=ejemplo (ver servidor/catalogo.ts).
 */
export const fuenteEjemplo: FuenteCatalogo = {
  productos: async () => [...(await fuenteLocal.productos()), ...productosEjemplo],
  categorias: async () => [...(await fuenteLocal.categorias()), ...categoriasEjemplo],
  nichos: async () => [...(await fuenteLocal.nichos()), ...nichosEjemplo],
};
