import { notFound, permanentRedirect } from "next/navigation";

import { catalogo } from "@/servidor/catalogo";
import { rutaCategoria } from "@/dominio/rutas";

/**
 * Dirección antigua de las categorías, de cuando la tienda tenía un solo
 * nicho: /categoria/taladros. Ahora la categoría vive dentro de su nicho
 * (/herramientas/taladros) y esto redirige de forma permanente, para que no
 * se rompan los enlaces compartidos y los buscadores actualicen el suyo.
 *
 * Se resuelve en cada visita: son pocas y así una categoría que cambie de
 * nicho redirige siempre al lugar correcto.
 */
export const dynamic = "force-dynamic";

export default async function CategoriaAntigua({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoria = await catalogo.categoria(slug);
  if (!categoria) notFound();
  permanentRedirect(rutaCategoria(categoria));
}
