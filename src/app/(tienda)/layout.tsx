import { site } from "@/config/sitio";
import { catalogo } from "@/servidor/catalogo";
import { EncabezadoSitio } from "@/components/site-header";
import { PieSitio } from "@/components/site-footer";
import { BarraPedido } from "@/components/cart-bar";
import { CampoLuz } from "@/components/campo-luz";
import { JsonLd } from "@/components/json-ld";

/** Armazón de la tienda: cabecera, catálogo, pie y el pedido siempre a mano. */
export default async function LayoutTienda({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const menu = await catalogo.menu();

  // Datos estructurados del negocio: le dicen a Google y a los asistentes de IA
  // qué es Bumbay Store, dónde está y cómo contactarlo.
  const datosNegocio = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: site.nombre,
    description: site.descripcion,
    url: site.url,
    telephone: `+${site.whatsapp}`,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.ciudad,
      addressCountry: "CO",
      streetAddress: site.direccion,
    },
    currenciesAccepted: site.moneda,
    areaServed: { "@type": "Country", name: "Colombia" },
  };

  return (
    <>
      <JsonLd datos={datosNegocio} />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-marca-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-sobre-marca"
      >
        Saltar al contenido
      </a>
      {/* El campo vive aquí y no en cada página: así sobrevive a la
          navegación y cambia de color en vez de volver a empezar. */}
      <CampoLuz
        colores={menu.map((s) => s.nicho.acento ?? "#ec080f")}
        acentoTienda="#ec080f"
      />
      <EncabezadoSitio menu={menu} />
      <main id="contenido">{children}</main>
      {/* Vista previa del producto: solo se llena al navegar desde el catálogo */}
      {modal}
      <PieSitio menu={menu} />
      {/* Espacio para que la barra fija no tape el final del pie */}
      <div aria-hidden className="h-20" />
      <BarraPedido />
    </>
  );
}
