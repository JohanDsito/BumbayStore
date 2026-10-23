const base = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * URL pública de una imagen del bucket `productos`.
 *
 * Vive en su propio archivo, sin dependencias, por una razón de peso literal:
 * antes estaba junto al cliente de Supabase, y como la usan componentes de
 * cliente —la galería, el panel del pedido— arrastraba la librería entera al
 * navegador: 240 KB de código de autenticación y tiempo real que la tienda
 * nunca ejecuta.
 *
 * Aquí solo se concatena texto.
 */
export function imagenUrl(ruta: string | null): string | null {
  if (!ruta) return null;
  if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;
  if (ruta.startsWith("/")) return ruta;
  if (!base) return `/productos/${ruta}`;
  return `${base}/storage/v1/object/public/productos/${ruta}`;
}
