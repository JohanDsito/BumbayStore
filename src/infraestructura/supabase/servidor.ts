import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase del lado del servidor.
 *
 * Lleva `server-only` a propósito: si un componente de cliente lo importara,
 * la compilación falla en vez de colar 240 KB de librería en el navegador del
 * visitante. Para armar URLs de imagen está `../imagen-url.ts`, que no
 * depende de nada; para el panel, `sesion.ts`.
 */

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
