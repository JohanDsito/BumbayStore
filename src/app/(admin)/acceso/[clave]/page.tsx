import { notFound } from "next/navigation";
import { PanelAdmin } from "@/components/admin/panel";

/**
 * Acceso al panel por una ruta que no está escrita en el código.
 *
 * El último segmento de la URL tiene que coincidir con la variable de entorno
 * `ADMIN_RUTA`; cualquier otro valor devuelve un 404 igual al de una página
 * inexistente.
 *
 * Que esto NO es seguridad, conviene tenerlo claro: quien llegue a adivinar la
 * ruta se topa igual con el formulario, y sin cuenta en la tabla `admins` no
 * puede hacer nada. Lo que evita es el ruido de los robots que prueban
 * /admin, /wp-admin y compañía, y que la dirección aparezca en registros o en
 * el historial de un navegador compartido.
 *
 * La variable NO lleva el prefijo NEXT_PUBLIC_ a propósito: así se queda en el
 * servidor y nunca viaja dentro del JavaScript que descarga el visitante.
 */

export const dynamic = "force-dynamic";

export default async function PaginaAcceso({
  params,
}: {
  params: Promise<{ clave: string }>;
}) {
  const { clave } = await params;
  const esperada = process.env.ADMIN_RUTA;

  // Sin variable configurada no hay panel: es preferible a dejar una puerta
  // abierta en una ruta por defecto que todo el mundo conocería.
  if (!esperada || clave !== esperada) notFound();

  return <PanelAdmin />;
}
