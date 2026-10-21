import type { Category, Niche, Product } from "@/dominio/modelos";

/**
 * Lo que la aplicación necesita del mundo exterior, dicho como contrato.
 *
 * La aplicación depende de esta interfaz, no de Supabase. Quien la implementa
 * vive en `infraestructura/`, y la pieza que elige cuál usar es
 * `servidor/catalogo.ts`. Cambiar de base de datos es escribir otra
 * implementación de esto, sin tocar las páginas ni las reglas.
 */
export interface FuenteCatalogo {
  /** Solo productos publicados (`activo`), agotados incluidos. */
  productos(): Promise<Product[]>;
  categorias(): Promise<Category[]>;
  nichos(): Promise<Niche[]>;
}
