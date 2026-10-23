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
 * ¿Hay Supabase configurado? Si no, la capa de datos usa los datos locales
 * de src/data, para poder trabajar sin base de datos.
 */
export const supabaseHabilitado = Boolean(url && anonKey);

/** Lo máximo que se espera una respuesta antes de darla por perdida. */
const ESPERA_MS = 8000;
/** Intentos por consulta: Supabase gratuito a veces deja colgada una sola. */
const INTENTOS = 2;

/**
 * `fetch` con tiempo límite y un reintento.
 *
 * Sin esto, una consulta que Supabase deja colgada congela la página entera:
 * `fetch` no tiene tiempo límite, así que la promesa ni responde ni falla,
 * solo espera. Con el límite, una lentitud pasajera se resuelve con el
 * segundo intento, y una caída de verdad termina en un error que la página
 * puede mostrar (app/(tienda)/error.tsx).
 */
async function fetchConLimite(
  entrada: RequestInfo | URL,
  opciones: RequestInit = {},
): Promise<Response> {
  let ultimoError: unknown;
  for (let intento = 1; intento <= INTENTOS; intento++) {
    const limite = AbortSignal.timeout(ESPERA_MS);
    const senal = opciones.signal ? AbortSignal.any([opciones.signal, limite]) : limite;
    try {
      return await fetch(entrada, { ...opciones, signal: senal });
    } catch (error) {
      ultimoError = error;
      // Si quien llamó canceló la consulta, no se reintenta.
      if (opciones.signal?.aborted) break;
    }
  }
  throw ultimoError;
}

let cliente: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseHabilitado) return null;
  cliente ??= createClient(url!, anonKey!, {
    auth: { persistSession: false },
    global: { fetch: fetchConLimite },
  });
  return cliente;
}
