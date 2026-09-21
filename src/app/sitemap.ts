import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";
import { getProductos, getCategorias } from "@/lib/products";

/**
 * Mapa del sitio. Se regenera solo: cada producto y cada categoría que exista
 * en Supabase aparece aquí sin que haya que tocar nada.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productos, categorias] = await Promise.all([
    getProductos(),
    getCategorias(),
  ]);

  const ahora = new Date();

  return [
    {
      url: site.url,
      lastModified: ahora,
      changeFrequency: "daily",
      priority: 1,
    },
    ...categorias.map((c) => ({
      url: `${site.url}/categoria/${c.slug}`,
      lastModified: ahora,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...productos.map((p) => ({
      url: `${site.url}/producto/${p.slug}`,
      lastModified: ahora,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
