import type { MetadataRoute } from "next";
import { site } from "@/config/sitio";
import { catalogo } from "@/servidor/catalogo";
import { rutaCategoria, rutaNicho, rutaProducto } from "@/dominio/rutas";

/**
 * Mapa del sitio. Se regenera solo: cada nicho, categoría y producto que
 * exista en Supabase aparece aquí sin que haya que tocar nada.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [nichos, categorias, productos] = await Promise.all([
    catalogo.nichos(),
    catalogo.categorias(),
    catalogo.productos(),
  ]);

  const ahora = new Date();
  const entrada = (ruta: string, prioridad: number, frecuencia: "daily" | "weekly") => ({
    url: `${site.url}${ruta}`,
    lastModified: ahora,
    changeFrequency: frecuencia,
    priority: prioridad,
  });

  return [
    entrada("/", 1, "daily"),
    ...nichos.map((n) => entrada(rutaNicho(n), 0.9, "daily")),
    ...categorias.map((c) => entrada(rutaCategoria(c), 0.8, "weekly")),
    ...productos.map((p) => entrada(rutaProducto(p), 0.7, "weekly")),
  ];
}
