"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { site } from "@/config/sitio";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { Buscador } from "@/components/search-box";
import { BotonPedidoHeader } from "@/components/cart-bar";
import { IconoWhatsApp, IconoMenu, IconoCerrar } from "@/components/icons";
import { LogoStore } from "@/components/logos";
import type { SeccionMenu } from "@/dominio/catalogo";
import { rutaCategoria, rutaNicho } from "@/dominio/rutas";

/**
 * Encabezado de la tienda: vidrio oscuro flotando sobre el campo de luz.
 *
 * La fila de navegación muestra solo los nichos, así cabe aunque haya
 * muchos. Las categorías aparecen en una segunda fila cuando se está dentro
 * de un nicho, que es cuando sirven.
 */
export function EncabezadoSitio({ menu }: { menu: SeccionMenu[] }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const ruta = usePathname();

  // Nicho en el que se está: por su portada o por una de sus categorías.
  const actual = menu.find(
    (s) => ruta === rutaNicho(s.nicho) || ruta.startsWith(`${rutaNicho(s.nicho)}/`),
  );

  return (
    <header className="sticky top-0 z-30 border-b border-carbon-800/80 bg-carbon-950/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <Link
          href="/"
          aria-label={`${site.nombre}, inicio`}
          className="flex shrink-0 items-center transition-opacity hover:opacity-80"
        >
          <LogoStore prioridad className="w-[108px] sm:w-[136px]" />
        </Link>

        <nav aria-label="Nichos" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {menu.map(({ nicho }) => {
              const activo = actual?.nicho.slug === nicho.slug;
              return (
                <li key={nicho.slug}>
                  <Link
                    href={rutaNicho(nicho)}
                    aria-current={ruta === rutaNicho(nicho) ? "page" : undefined}
                    className={`rotulo relative block whitespace-nowrap px-3 py-2 transition-colors ${
                      activo ? "text-carbon-50" : "text-carbon-300 hover:text-carbon-50"
                    }`}
                  >
                    {nicho.nombre}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 -bottom-px h-px origin-left bg-marca-400 transition-transform duration-300 ease-[var(--ease-salida)] ${
                        activo ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Suspense fallback={<div className="hidden h-10 flex-1 md:block" />}>
          <Buscador className="ml-auto hidden w-full max-w-sm md:block" />
        </Suspense>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
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
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú del catálogo"}
            aria-expanded={menuAbierto}
            className="flex h-10 w-10 items-center justify-center text-carbon-300 transition-colors hover:text-carbon-50 lg:hidden"
          >
            {menuAbierto ? <IconoCerrar className="h-5 w-5" /> : <IconoMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Buscador en celular: va en su propia fila para no comprimir la marca */}
      <div className="border-t border-carbon-800/70 px-4 py-2.5 md:hidden">
        <Suspense fallback={<div className="h-10" />}>
          <Buscador />
        </Suspense>
      </div>

      {/* Categorías del nicho en el que se está */}
      {actual && actual.categorias.length > 0 && (
        <nav
          aria-label={`Categorías de ${actual.nicho.nombre}`}
          className="hidden border-t border-carbon-800/70 lg:block"
        >
          <ul className="sin-scrollbar mx-auto flex max-w-[1400px] items-center gap-1 overflow-x-auto px-6">
            {actual.categorias.map((c) => {
              const activo = ruta === rutaCategoria(c);
              return (
                <li key={c.slug}>
                  <Link
                    href={rutaCategoria(c)}
                    aria-current={activo ? "page" : undefined}
                    className={`block whitespace-nowrap px-3 py-2.5 text-[13px] transition-colors ${
                      activo ? "text-marca-400" : "text-carbon-300 hover:text-carbon-50"
                    }`}
                  >
                    {c.nombre}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Menú desplegable en celular */}
      {menuAbierto && (
        <nav aria-label="Catálogo" className="border-t border-carbon-800 bg-carbon-900 lg:hidden">
          <ul className="max-h-[60vh] overflow-y-auto">
            <li>
              <Link
                href="/"
                onClick={() => setMenuAbierto(false)}
                className="rotulo block border-b border-carbon-850 px-5 py-4 text-carbon-100"
              >
                Inicio
              </Link>
            </li>
            {menu.map(({ nicho, categorias }) => (
              <li key={nicho.slug}>
                <Link
                  href={rutaNicho(nicho)}
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-baseline justify-between border-b border-carbon-850 px-5 py-3.5 text-[15px] font-semibold text-carbon-50"
                >
                  {nicho.nombre}
                  {nicho.submarca && (
                    <span className="rotulo text-[9.5px] text-carbon-400">{nicho.submarca}</span>
                  )}
                </Link>
                <ul>
                  {categorias.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={rutaCategoria(c)}
                        onClick={() => setMenuAbierto(false)}
                        className="block border-b border-carbon-850 py-3 pl-9 pr-5 text-sm text-carbon-300 transition-colors active:bg-carbon-850"
                      >
                        {c.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
