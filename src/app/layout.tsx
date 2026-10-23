import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import { site } from "@/config/sitio";

/**
 * Armazón mínimo, común a todo.
 *
 * La tienda y el panel de administración son dos mundos distintos —uno tiene
 * cabecera, carrito y pie; el otro no— así que cada uno monta su propio
 * armazón en su grupo de rutas. Aquí solo quedan las tipografías, los estilos
 * y los metadatos que comparten.
 */

// Variable en peso y en ancho: el mismo Archivo da el titular ultracondensado
// del portal (62 %) y los rótulos anchos y espaciados (112 %), sin cargar
// una segunda familia.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
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
    default: `${site.nombre} — Importador directo con envío a toda Colombia`,
    template: `%s | ${site.nombre}`,
  },
  description: site.descripcion,
  applicationName: site.nombre,
  keywords: [
    "importador directo Colombia",
    "tienda mayorista",
    "herramientas inalámbricas",
    "taladros inalámbricos",
    "pulidoras",
    "llaves de impacto",
    "herramientas al por mayor",
    "distribuidor herramientas Colombia",
    "ferretería mayorista",
    site.ciudad,
  ],
  // Sin canonical aquí: lo hereda cada página que no declare el suyo, y
  // apuntarlas todas a "/" le diría a Google que son la misma portada.
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: site.url,
    siteName: site.nombre,
    title: `${site.nombre} — Importador directo con envío a toda Colombia`,
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
  themeColor: "#07080d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${archivo.variable} ${plexMono.variable}`}>
      {/*
        Varias extensiones del navegador (ColorZilla, Grammarly, gestores de
        contraseñas…) añaden atributos al <body> antes de que React hidrate, y
        eso dispara un aviso de discrepancia que no viene de nuestro código.
        `suppressHydrationWarning` solo silencia los atributos de ESTE elemento,
        no los de sus hijos, así que no puede ocultar un error real dentro de
        los componentes.
      */}
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
