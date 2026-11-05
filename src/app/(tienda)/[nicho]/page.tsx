import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { catalogo } from "@/servidor/catalogo";
import { site } from "@/config/sitio";
import { rutaCategoria, rutaNicho } from "@/dominio/rutas";
import type { DatoNicho } from "@/dominio/modelos";
import { CarruselDestacados } from "@/components/featured-carousel";
import { GrillaProductos } from "@/components/product-grid";
import { Migas } from "@/components/migas";
import { ContextoNicho } from "@/components/contexto-nicho";
import { LogoTools } from "@/components/logos";
import {
  ANCLA_CATALOGO,
  BloqueMayorista,
  EncabezadoSeccion,
  FilaCategorias,
  Portico,
  entradasCategorias,
} from "@/components/portada";

type Props = { params: Promise<{ nicho: string }> };

/**
 * Portada de un nicho: /herramientas.
 *
 * Todo lo que muestra sale de los datos del nicho —titular, descripción,
 * cifras, color— y de sus productos. Un nicho nuevo se presenta solo, sin
 * programar su página. Los que se creen después del build se generan en la
 * primera visita.
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
  // Herramientas es Bumbay Tools: lleva su logo sobre el titular.
  const esTaller = nicho.slug === site.nichoTaller;
  const conteo = (n: number) => `${n} ${n === 1 ? "producto" : "productos"}`;

  return (
    <ContextoNicho acento={nicho.acento} intensidad={1}>
      {/* Las migas son parte del escenario: noche, encima del campo. */}
      <div className="portico escenario">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <Migas pasos={[{ nombre: nicho.nombre, ruta: rutaNicho(nicho) }]} />
        </div>
      </div>

      <Portico
        titular={nicho.titular ?? nicho.nombre}
        lineaClave={
          nicho.submarca && !esTaller ? `${nicho.submarca} · ${nicho.nombre}` : nicho.nombre
        }
        descripcion={nicho.descripcion}
        logo={esTaller ? <LogoTools className="w-[240px] sm:w-[320px]" /> : undefined}
        indice={{
          titulo: "Categorías",
          enciende: false,
          entradas: categorias.map((c) => ({
            nombre: c.nombre,
            detalle: conteo(productos.filter((p) => p.categoriaSlug === c.slug).length),
            href: rutaCategoria(c),
          })),
        }}
        lectura={
          <LecturaNicho
            datos={[{ etiqueta: "En catálogo", valor: conteo(productos.length) }, ...nicho.datos]}
          />
        }
        mensajeWhatsApp={`Hola, quisiera la lista de precios de ${marca}.`}
      />

      {/* La tienda, debajo del escenario: fondo sólido en los dos temas. El
          campo de luz se queda en el escenario y no pasa detrás de las
          tarjetas, que ya no tienen caja. */}
      <div className="bg-fondo">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <FilaCategorias
            titulo={`Categorías de ${nicho.nombre}`}
            entradas={entradasCategorias(categorias, productos)}
          />

          {destacados.length > 0 && (
            <div className="pt-12 sm:pt-16">
              <CarruselDestacados productos={destacados} />
            </div>
          )}

          <section id={ANCLA_CATALOGO} aria-labelledby="titulo-catalogo" className="pb-8">
            <EncabezadoSeccion
              id="titulo-catalogo"
              titulo={`Todo en ${nicho.nombre.toLowerCase()}`}
              cantidad={productos.length}
            />
            <GrillaProductos productos={productos} prioritarias={0} />
          </section>

          <BloqueMayorista />
        </div>
      </div>
    </ContextoNicho>
  );
}

/** Los datos del nicho como lectura: etiqueta espaciada, valor en mono. */
function LecturaNicho({ datos }: { datos: DatoNicho[] }) {
  return (
    <dl className="space-y-4">
      {datos.map((d) => (
        <div key={d.etiqueta}>
          <dt className="rotulo text-tinta-suave">{d.etiqueta}</dt>
          <dd className="mt-1 font-mono text-sm text-tinta-fuerte">{d.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
