import Link from "next/link";
import type { Metadata } from "next";

import { site } from "@/config/sitio";
import { catalogo } from "@/servidor/catalogo";
import { CarruselDestacados } from "@/components/featured-carousel";
import { GrillaProductos } from "@/components/product-grid";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { IconoWhatsApp, IconoFlecha } from "@/components/icons";

export const metadata: Metadata = {
  title: `Herramientas inalámbricas al por mayor en ${site.ciudad}`,
  description: site.descripcion,
  alternates: { canonical: "/" },
};

export default async function Portada() {
  const [productos, destacados, categorias] = await Promise.all([
    catalogo.productos(),
    catalogo.destacados(8),
    catalogo.categorias(),
  ]);

  return (
    <>
      <Portico totalProductos={productos.length} totalCategorias={categorias.length} />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="py-12 sm:py-16">
          <CarruselDestacados productos={destacados} />
        </div>

        <section aria-labelledby="titulo-categorias" className="pb-12">
          <h2
            id="titulo-categorias"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-carbon-500"
          >
            Explorar por categoría
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  className="group flex items-center gap-2 border border-carbon-800 bg-carbon-900 px-4 py-2.5 text-[13px] font-medium text-carbon-300 transition-colors hover:border-marca-500 hover:text-carbon-50"
                >
                  {c.nombre}
                  <IconoFlecha className="h-3.5 w-3.5 text-carbon-500 transition-all group-hover:translate-x-0.5 group-hover:text-marca-500" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="titulo-catalogo" className="pb-8">
          <div className="mb-5 flex items-end justify-between gap-4 border-t border-carbon-800 pt-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
                Catálogo completo
              </p>
              <h2
                id="titulo-catalogo"
                className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-3xl"
              >
                Todos los productos
              </h2>
            </div>
            <span className="shrink-0 font-mono text-xs text-carbon-500">
              {productos.length} {productos.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          <GrillaProductos productos={productos} prioritarias={0} />
        </section>

        <BloqueMayorista />
      </div>
    </>
  );
}

/** Encabezado de portada. Directo: qué venden, a quién, y cómo se compra. */
function Portico({
  totalProductos,
  totalCategorias,
}: {
  totalProductos: number;
  totalCategorias: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-carbon-800">
      {/* Resplandor cálido detrás del texto, como la luz de un taller */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-marca-500/[0.14] blur-[100px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
            <span aria-hidden className="h-px w-8 bg-marca-500" />
            Importador y distribuidor directo
          </p>

          <h1 className="mt-5 text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-carbon-50 sm:text-6xl lg:text-7xl">
            Herramienta inalámbrica
            <span className="block text-marca-500">a precio de mayorista.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-carbon-400 sm:text-base">
            Taladros, pulidoras, combos y herramienta manual para ferreterías,
            talleres y contratistas en toda Colombia. Arma tu pedido en el
            catálogo y lo cerramos por WhatsApp.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contenido-catalogo"
              className="flex h-12 items-center justify-center gap-2 bg-marca-500 px-7 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-marca-400"
            >
              Ver catálogo
              <IconoFlecha className="h-4 w-4" />
            </a>
            <a
              href={enlaceGeneral("Hola, quisiera la lista de precios de Bumbay Tools.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 border border-carbon-700 px-7 text-sm font-semibold tracking-tight text-carbon-100 transition-colors hover:border-disponible hover:text-disponible"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Pedir lista de precios
            </a>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-carbon-800 pt-6">
            <Dato valor={String(totalProductos)} etiqueta="Productos en catálogo" />
            <Dato valor={String(totalCategorias)} etiqueta="Categorías" />
            <Dato
              valor={String(site.garantiaMeses)}
              etiqueta="Meses de garantía"
            />
            <Dato valor={site.plataforma} etiqueta="Plataforma de batería" />
          </dl>
        </div>
      </div>

      <span id="contenido-catalogo" className="sr-only" />
    </section>
  );
}

function Dato({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div>
      <dt className="sr-only">{etiqueta}</dt>
      <dd>
        <span className="block font-mono text-xl font-bold leading-none text-carbon-50">
          {valor}
        </span>
        <span className="mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-carbon-500">
          {etiqueta}
        </span>
      </dd>
    </div>
  );
}

/** Llamado a la acción para el cliente mayorista, que es el que deja margen. */
function BloqueMayorista() {
  return (
    <section className="relative my-8 overflow-hidden border border-carbon-800 bg-carbon-900">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 cinta-precaucion" />
      <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
            Compra por volumen
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-3xl">
            ¿Tienes ferretería o taller?
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-carbon-400">
            Manejamos un solo precio, de distribuidor, igual para todos: el que
            ves en el catálogo. Arma tu pedido y escríbenos con las cantidades
            que necesitas para coordinar despacho a toda Colombia y respaldo de
            garantía.
          </p>
        </div>
        <a
          href={enlaceGeneral(
            "Hola, tengo ferretería/taller y quisiera cotizar con precio de distribuidor.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2.5 bg-disponible px-8 text-sm font-semibold tracking-tight text-carbon-950 transition-opacity hover:opacity-90"
        >
          <IconoWhatsApp className="h-5 w-5" />
          Cotizar al por mayor
        </a>
      </div>
    </section>
  );
}
