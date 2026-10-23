import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * ¿El dueño de esta sesión es administrador?
 *
 * Tener sesión no basta: el registro de Supabase está abierto y cualquiera
 * puede crearse una cuenta. La respuesta la da la función `es_admin()` de la
 * base, que mira la tabla `admins`, la misma que protege la escritura del
 * catálogo. Así hay una sola lista de administradores y no dos que puedan
 * contradecirse.
 *
 * La consulta se hace con el token del usuario: si está vencido o es falso,
 * Supabase lo rechaza y aquí se responde `false`.
 */
export async function esAdministrador(token: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return false;

  const sb = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await sb.rpc("es_admin");
  return !error && data === true;
}
