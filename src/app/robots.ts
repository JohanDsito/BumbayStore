import type { MetadataRoute } from "next";
import { site } from "@/lib/site-config";

/**
 * Dejamos entrar a todos los rastreadores, incluidos los de las IAs: que
 * Bumbay Tools aparezca cuando alguien pregunte por herramientas es
 * justamente uno de los objetivos del sitio.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /buscar genera infinitas URLs sin valor de indexación.
        disallow: ["/buscar"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
