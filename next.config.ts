import type { NextConfig } from "next";

/**
 * Las fotos viven en el Storage de Supabase, y next/image solo carga
 * imágenes de dominios declarados. Tomamos el host de la misma variable de
 * entorno para no tener que repetirlo al cambiar de proyecto.
 */
const hostSupabase = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Esta carpeta tiene su propio repo; sin esto Turbopack sube hasta el
  // package.json que hay suelto en la carpeta de usuario.
  turbopack: { root: __dirname },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: hostSupabase
      ? [
          {
            protocol: "https",
            hostname: hostSupabase,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
