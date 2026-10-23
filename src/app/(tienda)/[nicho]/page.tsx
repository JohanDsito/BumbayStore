import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { catalogo } from "@/servidor/catalogo";
import { site } from "@/config/sitio";
import { rutaNicho } from "@/dominio/rutas";
import { CarruselDestacados } from "@/components/featured-carousel";
import { GrillaProductos } from "@/components/product-grid";
import { Migas } from "@/components/migas";
import {
  BloqueMayorista,
  EncabezadoSeccion,
  ExplorarCategorias,
  Portico,
} from "@/components/portada";

type Props = { params: Promise<{ nicho: string }> };

/**
 * Portada de un nicho: /herramientas.
 *
 * Todo lo que muestra sale de los datos del nicho —titular, descripción,
 * cifras— y de sus productos. Un nicho nuevo se presenta solo, sin programar
 * su página. Los que se creen después del build se generan en la primera
 * visita.
 */
export async function generateStaticParams() {
  const nichos = await catalogo.nichos();
  return nichos.map((n) => ({ nicho: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nicho: slug } = await params;
  const nicho = await catalogo.nicho(slug);
  if (!nicho) return { title: "Página no encontrada" };

  const titulo = nicho.submarca ? `${nicho.nombre} · ${nicho.submarca}` : nicho.nombre;
  const descripcion = nicho.descripcion ?? site.descripcion;

  return {
    title: `${titulo} — envío a toda Colombia`,
    description: descripcion,
    alternates: { canonical: rutaNicho(nicho) },
    openGraph: {
      type: "website",
      title: `${titulo} — ${site.nombre}`,
      description: descripcion,
      url: `${site.url}${rutaNicho(nicho)}`,
      siteName: site.nombre,
      locale: "es_CO",
    },
  };
}

export default async function PortadaNicho({ params }: Props) {
  const { nicho: slug } = await params;
  const nicho = await catalogo.nicho(slug);
  if (!nicho) notFound();

  const [productos, destacados, categorias] = await Promise.all([
    catalogo.productosDeNicho(slug),
    catalogo.destacados(8, slug),
    catalogo.categoriasDeNicho(slug),
  ]);

  const marca = nicho.submarca ?? nicho.nombre;

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <Migas pasos={[{ nombre: nicho.nombre, ruta: rutaNicho(nicho) }]} />
      </div>

      <Portico
        etiqueta={nicho.submarca ? `${nicho.submarca} · ${nicho.nombre}` : nicho.nombre}
        titular={nicho.titular ?? nicho.nombre}
        descripcion={nicho.descripcion}
        datos={[
          { etiqueta: "Productos en catálogo", valor: String(productos.length) },
          { etiqueta: "Categorías", valor: String(categorias.length) },
          ...nicho.datos,
        ]}
        mensajeWhatsApp={`Hola, quisiera la lista de precios de ${marca}.`}
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {destacados.length > 0 && (
          <div className="py-12 sm:py-16">
            <CarruselDestacados productos={destacados} />
          </div>
        )}

        <ExplorarCategorias titulo="Explorar por categoría" categorias={categorias} />

        <section aria-labelledby="titulo-catalogo" className="pb-8">
          <EncabezadoSeccion
            id="titulo-catalogo"
            etiqueta={marca}
            titulo={`Todo en ${nicho.nombre.toLowerCase()}`}
            cantidad={productos.length}
          />
          <GrillaProductos productos={productos} prioritarias={0} />
        </section>

        <BloqueMayorista />
      </div>
    </>
  );
}
