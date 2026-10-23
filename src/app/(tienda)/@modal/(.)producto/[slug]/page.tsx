import { notFound } from "next/navigation";

import { catalogo } from "@/servidor/catalogo";
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
  const producto = await catalogo.producto(slug);
  if (!producto) notFound();

  const [categoria, variantes] = await Promise.all([
    catalogo.categoria(producto.categoriaSlug),
    catalogo.variantesDe(producto),
  ]);

  return (
    <VistaPrevia producto={producto} categoria={categoria} variantes={variantes} />
  );
}
