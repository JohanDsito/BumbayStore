import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

/**
 * Regenera las páginas del catálogo después de un cambio en el panel.
 *
 * El catálogo se prerenderiza en el build —por eso Google recibe el HTML
 * completo— así que un cambio en la base no se vería hasta la próxima
 * reconstrucción. Esto invalida las rutas afectadas y Next las vuelve a
 * generar en la siguiente visita, sin perder el prerenderizado.
 *
 * Solo responde a quien traiga una sesión válida de Supabase. Se verifica
 * contra Supabase en cada llamada en vez de confiar en el token a ciegas.
 */
export async function POST(peticion: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return Response.json({ error: "Supabase no está configurado" }, { status: 500 });
  }

  const cabecera = peticion.headers.get("authorization") ?? "";
  const token = cabecera.startsWith("Bearer ") ? cabecera.slice(7) : null;
  if (!token) {
    return Response.json({ error: "Falta la sesión" }, { status: 401 });
  }

  const sb = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) {
    return Response.json({ error: "Sesión inválida" }, { status: 401 });
  }

  // Las rutas con segmento dinámico necesitan el patrón y el tipo, no una URL
  // concreta: así se refrescan todas las fichas de una vez.
  revalidatePath("/", "page");
  revalidatePath("/producto/[slug]", "page");
  revalidatePath("/categoria/[slug]", "page");
  revalidatePath("/sitemap.xml");

  return Response.json({ ok: true, momento: new Date().toISOString() });
}
