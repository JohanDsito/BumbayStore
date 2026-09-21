import { notFound } from "next/navigation";

import { getProducto, getCategoria } from "@/lib/products";
import { VistaPrevia } from "@/components/quick-view";

type Props = { params: Promise<{ slug: string }> };

/**
 * Intercepta /producto/[slug] cuando se navega desde dentro del sitio y lo
 * muestra como vista previa encima del catálogo.
 *
 * Si alguien entra directo a la URL, la recarga, o llega desde Google, esta
 * ruta no se activa y se sirve la ficha completa de src/app/producto/[slug].
 * Por eso el SEO no cambia: el buscador siempre ve la página entera.
 */
export default async function VistaPreviaProducto({ params }: Props) {
  const { slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) notFound();

  const categoria = await getCategoria(producto.categoriaSlug);

  return <VistaPrevia producto={producto} categoria={categoria} />;
}
