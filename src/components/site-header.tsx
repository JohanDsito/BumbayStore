"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { site } from "@/config/sitio";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { Buscador } from "@/components/search-box";
import { BotonPedidoHeader } from "@/components/cart-bar";
import { IconoWhatsApp, IconoMenu, IconoCerrar, IconoFlecha } from "@/components/icons";
import { RedesSociales } from "@/components/redes-sociales";
import { BotonTema } from "@/components/boton-tema";
import { LogoStore } from "@/components/logos";
import type { SeccionMenu } from "@/dominio/catalogo";
import { rutaCategoria, rutaNicho } from "@/dominio/rutas";

/**
 * Encabezado de la tienda: vidrio oscuro flotando sobre el campo de luz. Es
 * escenario: de noche en los dos temas, como el marco de arriba de la tienda.
 *
 * En computador, la fila de navegación muestra solo los nichos, así cabe
 * aunque haya muchos, y las categorías aparecen en una segunda fila cuando se
 * está dentro de un nicho, que es cuando sirven. En celular todo eso vive en
 * el menú: los nichos, y al tocar uno, sus categorías.
 */
export function EncabezadoSitio({ menu }: { menu: SeccionMenu[] }) {
  const ruta = usePathname();
  const cabecera = useRef<HTMLElement>(null);
  const botonMenu = useRef<HTMLButtonElement>(null);

  // El menú recuerda en qué página se abrió: al navegar a otra, la ruta ya no
  // coincide y queda cerrado solo, sin un efecto que lo cierre.
  const [rutaMenu, setRutaMenu] = useState<string | null>(null);
  const menuAbierto = rutaMenu === ruta;
  // Un solo nicho desplegado a la vez.
  const [nichoAbierto, setNichoAbierto] = useState<string | null>(null);

  // Publica el alto de la cabecera en --alto-cabecera, para que los saltos a
  // un ancla no dejen el título debajo de ella (scroll-padding-top en
  // globals.css). Cambia con el ancho y con la fila de categorías del nicho.
  // El menú de celular no cuenta: se dibuja fuera del flujo, por debajo.
  useEffect(() => {
    const elemento = cabecera.current;
    if (!elemento) return;
    const publicar = () =>
      document.documentElement.style.setProperty(
        "--alto-cabecera",
        `${elemento.offsetHeight}px`,
      );
    const observador = new ResizeObserver(publicar);
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  // Nicho en el que se está: por su portada o por una de sus categorías.
  const actual = menu.find(
    (s) => ruta === rutaNicho(s.nicho) || ruta.startsWith(`${rutaNicho(s.nicho)}/`),
  );

  const abrirMenu = () => {
    setRutaMenu(ruta);
    // Abre desplegado el nicho donde ya se está: es lo más probable que busque.
    setNichoAbierto(actual?.nicho.slug ?? null);
  };

  /** Cierra y devuelve el foco al botón que lo abrió. */
  const cerrarMenu = useCallback(() => {
    setRutaMenu(null);
    botonMenu.current?.focus();
  }, []);

  // Con el menú abierto, Escape lo cierra y el fondo no se desplaza: en
  // celular es fácil arrastrar la página por debajo sin querer.
  useEffect(() => {
    if (!menuAbierto) return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrarMenu();
    };
    window.addEventListener("keydown", alPresionar);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = previo;
    };
  }, [menuAbierto, cerrarMenu]);

  return (
    <header ref={cabecera} className="escenario sticky top-0 z-30 border-b border-linea/80 bg-fondo/92 backdrop-blur-md">
      {/* En celular, tres columnas: menú, logo centrado y pedido. En computador
          la fila corre de izquierda a derecha con los nichos y el buscador. */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2.5 sm:px-6 lg:flex lg:gap-6 lg:py-3">
        <button
          ref={botonMenu}
          type="button"
          onClick={menuAbierto ? cerrarMenu : abrirMenu}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú del catálogo"}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          className="-ml-2 flex h-11 w-11 items-center justify-center text-tinta transition-colors hover:text-tinta-fuerte lg:hidden"
        >
          {menuAbierto ? <IconoCerrar className="h-5 w-5" /> : <IconoMenu className="h-6 w-6" />}
        </button>

        <Link
          href="/"
          aria-label={`${site.nombre}, inicio`}
          className="flex shrink-0 items-center justify-self-center transition-opacity hover:opacity-80"
        >
          <LogoStore prioridad className="w-[148px] lg:w-[136px]" />
        </Link>

        {/* Si los nichos no caben, la fila se desliza y el borde derecho se
            desvanece para avisar que hay más. */}
        <nav
          aria-label="Nichos"
          className="sin-scrollbar hidden min-w-0 flex-1 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%_-_2.5rem),transparent)] lg:block"
        >
          <ul className="flex w-max items-center gap-1">
            {menu.map(({ nicho }) => {
              const activo = actual?.nicho.slug === nicho.slug;
              return (
                <li key={nicho.slug}>
                  <Link
                    href={rutaNicho(nicho)}
                    aria-current={ruta === rutaNicho(nicho) ? "page" : undefined}
                    title={nicho.nombre}
                    className={`rotulo relative block max-w-[20rem] truncate whitespace-nowrap px-3 py-2 transition-colors ${
                      activo ? "text-tinta-fuerte" : "text-tinta-media hover:text-tinta-fuerte"
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

        <Suspense fallback={<div className="hidden h-11 flex-1 lg:block" />}>
          <Buscador className="ml-auto hidden w-full lg:block lg:max-w-60 xl:max-w-xs" />
        </Suspense>

        <div className="-mr-2 flex items-center gap-1 justify-self-end lg:mr-0">
          <BotonTema />
          <a
            href={enlaceGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp"
            className="hidden h-11 w-11 items-center justify-center text-disponible transition-opacity hover:opacity-70 sm:flex"
          >
            <IconoWhatsApp className="h-5 w-5" />
          </a>
          <BotonPedidoHeader />
        </div>
      </div>

      {/* Buscador en celular y tableta: va en su propia fila para no comprimir la marca */}
      <div className="border-t border-linea/70 px-4 py-2.5 sm:px-6 lg:hidden">
        <Suspense fallback={<div className="h-11" />}>
          <Buscador />
        </Suspense>
      </div>

      {/* Categorías del nicho en el que se está */}
      {actual && actual.categorias.length > 0 && (
        <nav
          aria-label={`Categorías de ${actual.nicho.nombre}`}
          className="hidden border-t border-linea/70 lg:block"
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
                      activo ? "text-acento-texto" : "text-tinta-media hover:text-tinta-fuerte"
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

      {/* Menú de celular: solo los nichos; cada uno despliega sus categorías.
          Va fuera del flujo (absolute), así no cambia el alto de la cabecera. */}
      {menuAbierto && (
        <div className="lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Cerrar menú"
            onClick={cerrarMenu}
            className="absolute inset-x-0 top-full h-dvh animate-[aparecer_0.2s_ease-out] bg-fondo/75"
          />
          <nav
            id="menu-movil"
            aria-label="Catálogo"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--alto-cabecera,8rem))] animate-[aparecer_0.2s_var(--ease-salida)] overflow-y-auto overscroll-contain border-t border-linea bg-superficie shadow-flotante"
          >
            <ul>
              {menu.map(({ nicho, categorias }) => {
                const desplegado = nichoAbierto === nicho.slug;
                const idLista = `menu-movil-${nicho.slug}`;
                return (
                  <li key={nicho.slug} className="border-b border-hundido">
                    <button
                      type="button"
                      onClick={() => setNichoAbierto(desplegado ? null : nicho.slug)}
                      aria-expanded={desplegado}
                      aria-controls={idLista}
                      className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-3 text-left"
                    >
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-tinta-fuerte">
                          {nicho.nombre}
                        </span>
                        {nicho.submarca && (
                          <span className="rotulo mt-0.5 block text-[11px] text-tinta-suave">
                            {nicho.submarca}
                          </span>
                        )}
                      </span>
                      <IconoFlecha
                        className={`h-4 w-4 shrink-0 text-tinta-suave transition-transform duration-200 ${
                          desplegado ? "-rotate-90" : "rotate-90"
                        }`}
                      />
                    </button>
                    {desplegado && (
                      <ul id={idLista} className="pb-2">
                        {categorias.map((c) => (
                          <li key={c.slug}>
                            <Link
                              href={rutaCategoria(c)}
                              onClick={() => setRutaMenu(null)}
                              aria-current={ruta === rutaCategoria(c) ? "page" : undefined}
                              className={`flex min-h-11 items-center py-2.5 pl-9 pr-5 text-sm transition-colors active:bg-hundido ${
                                ruta === rutaCategoria(c) ? "text-acento-texto" : "text-tinta-media"
                              }`}
                            >
                              {c.nombre}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href={rutaNicho(nicho)}
                            // Al navegar se cierra solo; esto cubre tocar la
                            // página en la que ya se está.
                            onClick={() => setRutaMenu(null)}
                            className="flex min-h-11 items-center gap-2 py-2.5 pl-9 pr-5 text-sm font-semibold text-acento-texto"
                          >
                            Ver todo en {nicho.nombre.toLowerCase()}
                            <IconoFlecha className="h-4 w-4" />
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
              <RedesSociales />
              <a
                href={enlaceGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex h-11 items-center gap-2 bg-disponible px-4 text-[13px] font-semibold tracking-tight text-sobre-disponible transition-opacity hover:opacity-90"
              >
                <IconoWhatsApp className="h-4 w-4" />
                Escribir por WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
