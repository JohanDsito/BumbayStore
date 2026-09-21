"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { site } from "@/lib/site-config";
import { enlaceGeneral } from "@/lib/whatsapp";
import { Buscador } from "@/components/search-box";
import { BotonPedidoHeader } from "@/components/cart-bar";
import { Logotipo, IconoWhatsApp, IconoMenu, IconoCerrar } from "@/components/icons";
import type { Category } from "@/lib/types";

export function EncabezadoSitio({ categorias }: { categorias: Category[] }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const ruta = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-carbon-800 bg-carbon-950/92 backdrop-blur-md">
      {/* Franja de contacto: en este negocio el teléfono vende más que el diseño */}
      <div className="hidden border-b border-carbon-850 bg-carbon-900 lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-1.5">
          <p className="font-mono text-[11px] tracking-tight text-carbon-500">
            Importador y distribuidor · {site.ciudad}, {site.pais}
          </p>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[11px] text-carbon-500">{site.horario}</span>
            <a
              href={enlaceGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-disponible transition-opacity hover:opacity-80"
            >
              <IconoWhatsApp className="h-3.5 w-3.5" />
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 sm:gap-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Logotipo className="h-8 w-8 text-naranja-500" />
          <span className="flex flex-col leading-none">
            <span className="text-[17px] font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-lg">
              BUMBAY
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-naranja-500">
              Tools
            </span>
          </span>
        </Link>

        <Suspense fallback={<div className="hidden h-10 flex-1 md:block" />}>
          <Buscador className="hidden flex-1 md:block" />
        </Suspense>

        <div className="ml-auto flex items-center gap-1">
          <a
            href={enlaceGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp"
            className="hidden h-10 w-10 items-center justify-center text-disponible transition-opacity hover:opacity-70 sm:flex"
          >
            <IconoWhatsApp className="h-5 w-5" />
          </a>
          <BotonPedidoHeader />
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú de categorías"}
            aria-expanded={menuAbierto}
            className="flex h-10 w-10 items-center justify-center text-carbon-300 transition-colors hover:text-naranja-400 lg:hidden"
          >
            {menuAbierto ? (
              <IconoCerrar className="h-5 w-5" />
            ) : (
              <IconoMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Buscador en celular: va en su propia fila para no comprimir el logo */}
      <div className="border-t border-carbon-850 px-4 py-2.5 md:hidden">
        <Suspense fallback={<div className="h-10" />}>
          <Buscador />
        </Suspense>
      </div>

      {/* Categorías: carrusel horizontal en celular, fila completa en escritorio */}
      <nav
        aria-label="Categorías"
        className="hidden border-t border-carbon-850 lg:block"
      >
        <div className="mx-auto max-w-[1400px] px-6">
          <ul className="sin-scrollbar flex items-center gap-1 overflow-x-auto">
            <li>
              <EnlaceCategoria href="/" activo={ruta === "/"}>
                Todo el catálogo
              </EnlaceCategoria>
            </li>
            {categorias.map((c) => (
              <li key={c.slug}>
                <EnlaceCategoria
                  href={`/categoria/${c.slug}`}
                  activo={ruta === `/categoria/${c.slug}`}
                >
                  {c.nombre}
                </EnlaceCategoria>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Menú desplegable en celular */}
      {menuAbierto && (
        <nav
          aria-label="Categorías"
          className="border-t border-carbon-850 bg-carbon-900 lg:hidden"
        >
          <ul className="max-h-[60vh] overflow-y-auto">
            <li>
              <Link
                href="/"
                onClick={() => setMenuAbierto(false)}
                className="block border-b border-carbon-850 px-5 py-3 text-sm font-medium text-carbon-100"
              >
                Todo el catálogo
              </Link>
            </li>
            {categorias.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center justify-between border-b border-carbon-850 px-5 py-3 text-sm text-carbon-300 transition-colors active:bg-carbon-850"
                >
                  {c.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div aria-hidden className="h-[3px] cinta-precaucion opacity-70" />
    </header>
  );
}

function EnlaceCategoria({
  href,
  activo,
  children,
}: {
  href: string;
  activo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={`relative block whitespace-nowrap px-3 py-2.5 text-[12.5px] font-medium tracking-tight transition-colors ${
        activo
          ? "text-naranja-400"
          : "text-carbon-400 hover:text-carbon-100"
      }`}
    >
      {children}
      {activo && (
        <span
          aria-hidden
          className="absolute inset-x-3 bottom-0 h-[2px] bg-naranja-500"
        />
      )}
    </Link>
  );
}
