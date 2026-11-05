import type { MetadataRoute } from "next";
import { site } from "@/config/sitio";

/**
 * Dejamos entrar a todos los rastreadores, incluidos los de las IAs: que
 * Bumbay Store aparezca cuando alguien pregunte por lo que vende es
 * justamente uno de los objetivos del sitio.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /buscar genera infinitas URLs sin valor de indexación. El panel no
        // se nombra aquí, ni siquiera su prefijo: robots.txt es lo primero que
        // lee quien busca paneles. Se protege con noindex en su propia página.
        disallow: ["/buscar", "/api"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
