import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import { site } from "@/lib/site-config";
import { getCategorias } from "@/lib/products";
import { EncabezadoSitio } from "@/components/site-header";
import { PieSitio } from "@/components/site-footer";
import { BarraPedido } from "@/components/cart-bar";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nombre} — Herramientas inalámbricas al por mayor en ${site.ciudad}`,
    template: `%s | ${site.nombre}`,
  },
  description: site.descripcion,
  applicationName: site.nombre,
  keywords: [
    "herramientas inalámbricas",
    "taladros inalámbricos",
    "pulidoras",
    "herramientas al por mayor",
    "distribuidor herramientas Colombia",
    "ferretería mayorista",
    site.ciudad,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: site.url,
    siteName: site.nombre,
    title: `${site.nombre} — Herramientas inalámbricas al por mayor`,
    description: site.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: site.nombre,
    description: site.descripcion,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
    <html lang="es-CO" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosNegocio) }}
        />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-naranja-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-carbon-950"
        >
          Saltar al contenido
        </a>
        <EncabezadoSitio categorias={categorias} />
        <main id="contenido">{children}</main>
        <PieSitio categorias={categorias} />
        {/* Espacio para que la barra fija no tape el final del pie */}
        <div aria-hidden className="h-20" />
        <BarraPedido />
      </body>
    </html>
  );
}
