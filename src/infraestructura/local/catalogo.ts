import type { FuenteCatalogo } from "@/aplicacion/puertos";
import { productosSeed } from "@/data/products.seed";
import { categoriasSeed } from "@/data/categories.seed";
import { nichosSeed } from "@/data/nichos.seed";
import { categoriasEjemplo, nichosEjemplo, productosEjemplo } from "@/data/ejemplo.seed";
import { categoriasExtremo, nichosExtremo, productosExtremo } from "@/data/extremo.seed";

/**
 * El catálogo de ejemplo que vive en `src/data`.
 *
 * Sirve para trabajar sin base de datos. No es respaldo de Supabase: si
 * Supabase está configurado y falla, la consulta falla (ver
 * servidor/catalogo.ts), porque estos productos son de ejemplo.
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

/**
 * El peor caso de `src/data/extremo.seed.ts`: nombres larguísimos, muchos
 * nichos, precios extremos. Para revisar que la interfaz no se rompa. Se
 * elige con CATALOGO=extremo (ver servidor/catalogo.ts).
 */
export const fuenteExtremo: FuenteCatalogo = {
  productos: async () => [...productosExtremo],
  categorias: async () => [...categoriasExtremo],
  nichos: async () => [...nichosExtremo],
};
