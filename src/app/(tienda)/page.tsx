import type { Metadata } from "next";

import { site } from "@/config/sitio";
import { catalogo } from "@/servidor/catalogo";
import { rutaNicho } from "@/dominio/rutas";
import { CarruselDestacados } from "@/components/featured-carousel";
import { GrillaProductos } from "@/components/product-grid";
import { LecturaCampo } from "@/components/indice-portal";
import { BloqueMayorista, EncabezadoSeccion, Portico } from "@/components/portada";

export const metadata: Metadata = {
  title: { absolute: `${site.nombre} — Importador directo con envío a toda Colombia` },
  description: site.descripcion,
  alternates: { canonical: "/" },
};

/**
 * Portada de Bumbay Store: la tienda entera. Cada nicho tiene su filamento
 * en el campo de luz, y el índice de la izquierda lo enciende al pasar. La
 * portada propia de cada nicho está en /{nicho}.
 */
export default async function Portada() {
  const [productos, destacados, menu] = await Promise.all([
    catalogo.productos(),
    catalogo.destacados(8),
    catalogo.menu(),
  ]);

  const conteo = (n: number) => `${n} ${n === 1 ? "producto" : "productos"}`;

  return (
    <>
      <Portico
        titular={"Importamos directo.\nEnviamos a toda Colombia."}
        lineaClave="Un solo precio · Pedido por WhatsApp"
        descripcion={null}
        indice={{
          titulo: "Líneas",
          enciende: true,
          entradas: menu.map((s) => ({
            nombre: s.nicho.nombre,
            detalle: conteo(s.totalProductos),
            href: rutaNicho(s.nicho),
          })),
        }}
        lectura={
          <LecturaCampo
            nombres={menu.map((s) => s.nicho.nombre)}
            reposo={`${menu.length} ${menu.length === 1 ? "línea" : "líneas"} · ${conteo(productos.length)}`}
          />
        }
        mensajeWhatsApp={`Hola, quisiera la lista de precios de ${site.nombre}.`}
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {destacados.length > 0 && (
          <div className="pb-12 sm:pb-16">
            <CarruselDestacados productos={destacados} />
          </div>
        )}

        <section aria-labelledby="titulo-catalogo" className="pb-8">
          <EncabezadoSeccion
            id="titulo-catalogo"
            titulo="Todo el catálogo"
            cantidad={productos.length}
          />
          <GrillaProductos productos={productos} prioritarias={0} />
        </section>

        <BloqueMayorista />
      </div>
    </>
  );
}
