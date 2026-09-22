import { site } from "@/lib/site-config";
import { getCategorias } from "@/lib/products";
import { EncabezadoSitio } from "@/components/site-header";
import { PieSitio } from "@/components/site-footer";
import { BarraPedido } from "@/components/cart-bar";

/** Armazón de la tienda: cabecera, catálogo, pie y el pedido siempre a mano. */
export default async function LayoutTienda({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  const categorias = await getCategorias();

  // Datos estructurados del negocio: le dicen a Google y a los asistentes de IA
  // qué es Bumbay Tools, dónde está y cómo contactarlo.
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosNegocio) }}
      />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-marca-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      <EncabezadoSitio categorias={categorias} />
      <main id="contenido">{children}</main>
      {/* Vista previa del producto: solo se llena al navegar desde el catálogo */}
      {modal}
      <PieSitio categorias={categorias} />
      {/* Espacio para que la barra fija no tape el final del pie */}
      <div aria-hidden className="h-20" />
      <BarraPedido />
    </>
  );
}
