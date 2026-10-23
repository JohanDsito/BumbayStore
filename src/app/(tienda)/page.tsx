import Link from "next/link";
import type { Metadata } from "next";

import { site } from "@/config/sitio";
import { catalogo } from "@/servidor/catalogo";
import type { SeccionMenu } from "@/dominio/catalogo";
import { rutaNicho } from "@/dominio/rutas";
import { CarruselDestacados } from "@/components/featured-carousel";
import { GrillaProductos } from "@/components/product-grid";
import { IconoFlecha } from "@/components/icons";
import { BloqueMayorista, EncabezadoSeccion, Portico } from "@/components/portada";

export const metadata: Metadata = {
  title: { absolute: `${site.nombre} — Importador directo con envío a toda Colombia` },
  description: site.descripcion,
  alternates: { canonical: "/" },
};

/**
 * Portada de Bumbay Store: la tienda entera. Presenta los nichos y deja ver
 * todo el catálogo; la portada propia de cada nicho está en /{nicho}.
 */
export default async function Portada() {
  const [productos, destacados, menu] = await Promise.all([
    catalogo.productos(),
    catalogo.destacados(8),
    catalogo.menu(),
  ]);

  return (
    <>
      <Portico
        etiqueta="Importador directo"
        titular={"Importamos directo.\nEnviamos a toda Colombia."}
        descripcion="Herramienta inalámbrica profesional y nuevas líneas en un solo catálogo, sin intermediarios. Arma tu pedido y lo cerramos por WhatsApp."
        datos={[
          { etiqueta: "Productos en catálogo", valor: String(productos.length) },
          { etiqueta: menu.length === 1 ? "Línea" : "Líneas", valor: String(menu.length) },
        ]}
        mensajeWhatsApp={`Hola, quisiera la lista de precios de ${site.nombre}.`}
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <section aria-labelledby="titulo-lineas" className="pt-12 sm:pt-16">
          <h2
            id="titulo-lineas"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-carbon-500"
          >
            Nuestras líneas
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {menu.map((seccion) => (
              <li key={seccion.nicho.slug}>
                <TarjetaNicho seccion={seccion} />
              </li>
            ))}
          </ul>
        </section>

        {destacados.length > 0 && (
          <div className="py-12 sm:py-16">
            <CarruselDestacados productos={destacados} />
          </div>
        )}

        <section aria-labelledby="titulo-catalogo" className="pb-8">
          <EncabezadoSeccion
            id="titulo-catalogo"
            etiqueta="Catálogo completo"
            titulo="Todos los productos"
            cantidad={productos.length}
          />
          <GrillaProductos productos={productos} prioritarias={0} />
        </section>

        <BloqueMayorista />
      </div>
    </>
  );
}

function TarjetaNicho({ seccion }: { seccion: SeccionMenu }) {
  const { nicho, categorias, totalProductos } = seccion;
  return (
    <Link
      href={rutaNicho(nicho)}
      className="group flex h-full flex-col border border-carbon-800 bg-carbon-900 p-6 transition-colors hover:border-marca-500"
    >
      {nicho.submarca && (
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
          {nicho.submarca}
        </span>
      )}
      <span className="mt-2 flex items-center justify-between gap-3 text-xl font-extrabold tracking-[-0.03em] text-carbon-50">
        {nicho.nombre}
        <IconoFlecha className="h-4 w-4 shrink-0 text-carbon-500 transition-transform group-hover:translate-x-0.5 group-hover:text-marca-500" />
      </span>
      {nicho.descripcion && (
        <span className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-carbon-400">
          {nicho.descripcion}
        </span>
      )}
      <span className="mt-auto pt-5 font-mono text-[11px] text-carbon-500">
        {totalProductos} {totalProductos === 1 ? "producto" : "productos"} ·{" "}
        {categorias.length} {categorias.length === 1 ? "categoría" : "categorías"}
      </span>
    </Link>
  );
}
