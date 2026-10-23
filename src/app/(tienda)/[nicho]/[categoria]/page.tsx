import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { catalogo } from "@/servidor/catalogo";
import { site } from "@/config/sitio";
import { precio } from "@/dominio/formato";
import { rutaCategoria, rutaNicho, rutaProducto } from "@/dominio/rutas";
import { GrillaProductos } from "@/components/product-grid";
import { JsonLd } from "@/components/json-ld";
import { Migas } from "@/components/migas";
import { ContextoNicho } from "@/components/contexto-nicho";

type Props = { params: Promise<{ nicho: string; categoria: string }> };

/** Prerenderiza cada categoría en el build, dentro de su nicho. */
export async function generateStaticParams() {
  const categorias = await catalogo.categorias();
  return categorias.map((c) => ({ nicho: c.nichoSlug, categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: slug } = await params;
  const categoria = await catalogo.categoria(slug);
  if (!categoria) return { title: "Categoría no encontrada" };

  const productos = await catalogo.productosDeCategoria(slug);
  const desde = productos.length
    ? Math.min(...productos.map((p) => p.precioUnitario))
    : 0;

  const descripcion =
    categoria.descripcion ??
    `${categoria.nombre} a precio de distribuidor en ${site.ciudad}. ${productos.length} referencias disponibles.`;

  return {
    title: `${categoria.nombre} — precio de distribuidor`,
    description: desde
      ? `${descripcion} Desde ${precio(desde)}. Envíos a toda Colombia.`
      : descripcion,
    alternates: { canonical: rutaCategoria(categoria) },
    openGraph: {
      type: "website",
      title: `${categoria.nombre} — ${site.nombre}`,
      description: descripcion,
      url: `${site.url}${rutaCategoria(categoria)}`,
      siteName: site.nombre,
      locale: "es_CO",
    },
  };
}

export default async function PaginaCategoria({ params }: Props) {
  const { nicho: nichoSlug, categoria: slug } = await params;
  const categoria = await catalogo.categoria(slug);
  if (!categoria) notFound();

  // La categoría existe pero se pidió bajo otro nicho: o la dirección está
  // mal escrita o la categoría cambió de nicho. Se manda a la buena, de forma
  // permanente, para que los buscadores actualicen su enlace.
  if (categoria.nichoSlug !== nichoSlug) permanentRedirect(rutaCategoria(categoria));

  const [nicho, productos] = await Promise.all([
    catalogo.nicho(nichoSlug),
    catalogo.productosDeCategoria(slug),
  ]);

  // Lista de items: ayuda a los buscadores a entender que esto es un listado
  // de productos y no una página de texto cualquiera.
  const datosLista = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoria.nombre,
    description: categoria.descripcion ?? undefined,
    numberOfItems: productos.length,
    itemListElement: productos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.nombre,
      url: `${site.url}${rutaProducto(p)}`,
    })),
  };

  return (
    <ContextoNicho acento={nicho?.acento ?? null} intensidad={0.55}>
      <JsonLd datos={datosLista} />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <Migas
          pasos={[
            ...(nicho ? [{ nombre: nicho.nombre, ruta: rutaNicho(nicho) }] : []),
            { nombre: categoria.nombre, ruta: rutaCategoria(categoria) },
          ]}
        />

        <header className="border-b border-carbon-800 pb-8 pt-4">
          <h1 className="titular text-[clamp(2.75rem,7vw,4.75rem)] text-carbon-50">
            {categoria.nombre}
          </h1>
          {categoria.descripcion && (
            <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-carbon-300">
              {categoria.descripcion}
            </p>
          )}
          <p className="mt-5 font-mono text-xs text-carbon-400">
            {productos.length} {productos.length === 1 ? "producto" : "productos"}
          </p>
        </header>

        <div className="py-8">
          <h2 className="sr-only">Productos</h2>
          <GrillaProductos productos={productos} prioritarias={4} />
        </div>
      </div>
    </ContextoNicho>
  );
}
