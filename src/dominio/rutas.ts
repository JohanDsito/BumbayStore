import type { Category, Niche, Product } from "./modelos";

/**
 * Las direcciones del sitio, en un solo lugar.
 *
 *   /herramientas                   portada de un nicho
 *   /herramientas/taladros          una categoría dentro de su nicho
 *   /producto/taladro-percutor-…    una ficha, sin nicho ni categoría
 *
 * La ficha no lleva el nicho a propósito: si un producto cambia de categoría,
 * su dirección no cambia y conserva lo que ya ganó en los buscadores.
 */
export const rutaNicho = (nicho: Pick<Niche, "slug">) => `/${nicho.slug}`;

export const rutaCategoria = (categoria: Pick<Category, "slug" | "nichoSlug">) =>
  `/${categoria.nichoSlug}/${categoria.slug}`;

export const rutaProducto = (producto: Pick<Product, "slug">) =>
  `/producto/${producto.slug}`;

/**
 * Secciones fijas del sitio. Un nicho no puede llamarse así porque su
 * dirección chocaría con ellas. La base de datos tiene la misma lista
 * (restricción `nichos_slug_valido`).
 */
export const SLUGS_RESERVADOS: readonly string[] = [
  "acceso",
  "api",
  "buscar",
  "categoria",
  "producto",
];

/** Minúsculas, números y guiones simples: lo que sirve como parte de una URL. */
export function slugDeNichoValido(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && !SLUGS_RESERVADOS.includes(slug);
}
