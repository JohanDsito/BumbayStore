import { revalidatePath } from "next/cache";
import { esAdministrador } from "@/infraestructura/supabase/administradores";

/**
 * Regenera las páginas del catálogo después de un cambio en el panel.
 *
 * El catálogo se prerenderiza en el build —por eso Google recibe el HTML
 * completo— así que un cambio en la base no se vería hasta la próxima
 * reconstrucción. Esto invalida las rutas afectadas y Next las vuelve a
 * generar en la siguiente visita, sin perder el prerenderizado.
 *
 * Solo responde a un administrador. Regenerar todo el catálogo cuesta
 * trabajo del servidor, y si bastara con tener cuenta, cualquiera podría
 * pedirlo una y otra vez.
 */
export async function POST(peticion: Request) {
  const cabecera = peticion.headers.get("authorization") ?? "";
  const token = cabecera.startsWith("Bearer ") ? cabecera.slice(7) : null;
  if (!token) {
    return Response.json({ error: "Falta la sesión" }, { status: 401 });
  }

  if (!(await esAdministrador(token))) {
    return Response.json({ error: "Sin permiso" }, { status: 403 });
  }

  // El layout de la tienda lleva el menú de nichos y categorías: refrescarlo
  // regenera todas las páginas que cuelgan de él.
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");

  return Response.json({ ok: true, momento: new Date().toISOString() });
}
