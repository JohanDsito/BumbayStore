import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Hay Supabase configurado? Si no, la capa de datos cae a los datos locales
 * de src/data/products.seed.ts para que el sitio siga funcionando.
 */
export const supabaseHabilitado = Boolean(url && anonKey);

let cliente: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseHabilitado) return null;
  cliente ??= createClient(url!, anonKey!, {
    auth: { persistSession: false },
  });
  return cliente;
}

/** URL pública de una imagen guardada en el bucket `productos`. */
export function imagenUrl(ruta: string | null): string | null {
  if (!ruta) return null;
  if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;
  if (ruta.startsWith("/")) return ruta;
  if (!url) return `/productos/${ruta}`;
  return `${url}/storage/v1/object/public/productos/${ruta}`;
}
