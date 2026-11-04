import type { MetadataRoute } from "next";
import { site } from "@/config/sitio";
import { catalogo } from "@/servidor/catalogo";
import { rutaCategoria, rutaNicho, rutaProducto } from "@/dominio/rutas";
import type { Product } from "@/dominio/modelos";

/**
 * Mapa del sitio. Se regenera solo: cada nicho, categoría y producto que
 * exista en Supabase aparece aquí sin que haya que tocar nada.
 *
 * La fecha de cada página es la de su cambio real: la del producto, o la del
 * producto más reciente para un nicho o una categoría. Si todas dijeran "hoy",
 * Google aprendería a ignorarlas. Cuando no hay fecha (datos de ejemplo), se
 * omite en vez de inventarla.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [nichos, categorias, productos] = await Promise.all([
    catalogo.nichos(),
    catalogo.categorias(),
    catalogo.productos(),
  ]);

  const masReciente = (lista: Product[]): Date | undefined => {
    const fechas = lista.flatMap((p) => (p.actualizadoEn ? [Date.parse(p.actualizadoEn)] : []));
    return fechas.length ? new Date(Math.max(...fechas)) : undefined;
  };

  const deCategoria = (slug: string) => productos.filter((p) => p.categoriaSlug === slug);
  const deNicho = (slug: string) => {
    const suyas = new Set(categorias.filter((c) => c.nichoSlug === slug).map((c) => c.slug));
    return productos.filter((p) => suyas.has(p.categoriaSlug));
  };

  const entrada = (ruta: string, prioridad: number, fecha: Date | undefined) => ({
    url: `${site.url}${ruta}`,
    ...(fecha ? { lastModified: fecha } : {}),
    priority: prioridad,
  });

  return [
    entrada("/", 1, masReciente(productos)),
    ...nichos.map((n) => entrada(rutaNicho(n), 0.9, masReciente(deNicho(n.slug)))),
    ...categorias.map((c) => entrada(rutaCategoria(c), 0.8, masReciente(deCategoria(c.slug)))),
    ...productos.map((p) =>
      entrada(rutaProducto(p), 0.7, p.actualizadoEn ? new Date(p.actualizadoEn) : undefined),
    ),
  ];
}
