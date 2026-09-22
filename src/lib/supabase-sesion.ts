"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el panel de administración.
 *
 * Es aparte del que usa el catálogo porque necesita lo contrario: el catálogo
 * lee en público y no guarda sesión, y el panel sí tiene que recordar quién
 * entró entre recargas.
 *
 * Todo lo que el panel puede hacer lo decide la base, no este código: las
 * políticas de seguridad por fila solo permiten escribir a un usuario
 * autenticado. Aunque alguien abra /admin, sin sesión no puede tocar nada.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cliente: SupabaseClient | null = null;

export function getSupabaseSesion(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  cliente ??= createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "bumbay:admin",
    },
  });
  return cliente;
}
