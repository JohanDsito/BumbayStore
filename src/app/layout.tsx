import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

import { site } from "@/lib/site-config";

/**
 * Armazón mínimo, común a todo.
 *
 * La tienda y el panel de administración son dos mundos distintos —uno tiene
 * cabecera, carrito y pie; el otro no— así que cada uno monta su propio
 * armazón en su grupo de rutas. Aquí solo quedan las tipografías, los estilos
 * y los metadatos que comparten.
 */

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
    "llaves de impacto",
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
