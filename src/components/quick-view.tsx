"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCarrito } from "@/cliente/carrito/use-carrito";
import { GaleriaProducto } from "@/components/product-gallery";
import { AgregarAlPedido } from "@/components/add-to-cart";
import { precio } from "@/dominio/formato";
import { enlaceConsulta } from "@/infraestructura/whatsapp";
import { site } from "@/config/sitio";
import {
  IconoCerrar,
  IconoWhatsApp,
  IconoFlecha,
  IconoCarrito,
} from "@/components/icons";
import { SelectorColor } from "@/components/color-selector";
import type { Product, Category } from "@/dominio/modelos";
import { rutaProducto } from "@/dominio/rutas";

type Props = {
  producto: Product;
  categoria: Category | null;
  /** Versiones de color de la misma herramienta. Vacío si no tiene. */
  variantes: Product[];
};

/**
 * Vista previa del producto.
 *
 * Se abre al tocar una tarjeta del catálogo, sobre la grilla, para que el
 * cliente decida sin perder el lugar donde iba navegando. La URL sí cambia
 * (la ruta se intercepta), así que el enlace se puede compartir y quien lo
 * abra directo verá la ficha completa en vez de este panel.
 *
 * Muestra lo justo para decidir la compra. Todo el detalle —especificaciones
 * completas, modo de uso, preguntas frecuentes— vive en la ficha, y hay un
 * enlace visible hacia ella.
 */
export function VistaPrevia({ producto, categoria, variantes }: Props) {
  const router = useRouter();
  const { abrir, unidades } = useCarrito();
  const [copiado, setCopiado] = useState(false);

  const cerrar = useCallback(() => router.back(), [router]);

  // Cerrar con Escape y bloquear el desplazamiento del fondo.
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alPresionar);

    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", alPresionar);
      document.body.style.overflow = previo;
    };
  }, [cerrar]);

  // Misma secuencia de piezas que en la ficha: cada una explica algo distinto
  // del producto, y aquí es donde el cliente decide sin salir del catálogo.
  const galeria =
    producto.imagenes.length > 0
      ? producto.imagenes
      : producto.imagen
        ? [producto.imagen]
        : [];

  const url = `${site.url}${rutaProducto(producto)}`;

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles (o sin HTTPS): no hacemos nada,
      // el cliente siempre puede copiar la URL de la barra del navegador.
    }
  };

  return (
    <div
      className="fixed inset-0 z-[45] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Vista previa de ${producto.nombre}`}
    >
      <button
        type="button"
        aria-label="Cerrar vista previa"
        onClick={cerrar}
        className="absolute inset-0 animate-[aparecer_0.2s_ease-out] bg-carbon-950/85 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-4xl animate-[subir_0.3s_var(--ease-salida)] flex-col border border-carbon-700 bg-carbon-900 shadow-flotante sm:max-h-[88vh] sm:animate-[aparecer_0.25s_var(--ease-salida)]">
        <div aria-hidden className="h-1 shrink-0 cinta-precaucion" />

        {/* Barra superior: compartir a la izquierda, cerrar a la derecha */}
        <div className="flex shrink-0 items-center justify-between border-b border-carbon-800 px-3 py-2">
          <button
            type="button"
            onClick={copiarEnlace}
            className="flex items-center gap-2 px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-carbon-400 transition-colors hover:text-marca-400"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
            </svg>
            {copiado ? "Enlace copiado" : "Copiar enlace"}
          </button>

          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center text-carbon-400 transition-colors hover:text-carbon-50"
          >
            <IconoCerrar className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 overflow-y-auto overscroll-contain sm:grid-cols-2">
          {/* --- Galería --- */}
          <div className="relative border-b border-carbon-800 p-3 sm:border-b-0 sm:border-r">
            {producto.agotado && (
              <span className="absolute left-5 top-5 z-10 bg-carbon-950/90 py-1 pl-2.5 pr-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-carbon-200 ring-1 ring-carbon-700 backdrop-blur-sm">
                Agotado
              </span>
            )}
            <GaleriaProducto
              imagenes={galeria}
              nombre={producto.nombre}
              sku={producto.sku}
              tamano="compacto"
            />
          </div>

          {/* --- Información --- */}
          <div className="flex flex-col p-5">
            <p className="font-mono text-[11px] tracking-[0.16em] text-carbon-500">
              {producto.sku}
              {categoria && (
                <>
                  <span aria-hidden className="mx-2 text-carbon-700">
                    ·
                  </span>
                  <span className="text-carbon-400">{categoria.nombre}</span>
                </>
              )}
            </p>

            <h2 className="mt-2 text-xl font-extrabold leading-tight tracking-[-0.03em] text-carbon-50 sm:text-2xl">
              {producto.nombre}
            </h2>

            <div className="mt-4">
              <span className="block font-mono text-3xl font-extrabold leading-none text-carbon-50">
                {precio(producto.precioUnitario)}
              </span>
              <span className="mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-carbon-500">
                Precio
              </span>
            </div>


            <SelectorColor
              variantes={variantes}
              slugActual={producto.slug}
              tamano="compacto"
              navegacion="previa"
            />

            <div className="mt-5">
              <AgregarAlPedido producto={producto} tamano="grande" />
            </div>

            {/* Las dos salidas que el cliente necesita tras agregar */}
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={cerrar}
                className="flex h-11 items-center justify-center gap-2 border border-carbon-700 px-3 text-[13px] font-medium text-carbon-200 transition-colors hover:border-carbon-500 hover:text-carbon-50"
              >
                <IconoFlecha className="h-4 w-4 rotate-180" />
                Seguir viendo
              </button>
              <button
                type="button"
                onClick={abrir}
                className="flex h-11 items-center justify-center gap-2 border border-carbon-700 px-3 text-[13px] font-medium text-carbon-200 transition-colors hover:border-marca-500 hover:text-marca-400"
              >
                <IconoCarrito className="h-4 w-4" />
                Ver pedido
                {unidades > 0 && (
                  <span className="font-mono text-[11px] text-marca-400">
                    ({unidades})
                  </span>
                )}
              </button>
            </div>

            <a
              href={enlaceConsulta(producto)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex h-11 items-center justify-center gap-2 border border-carbon-700 text-[13px] font-medium text-carbon-200 transition-colors hover:border-disponible hover:text-disponible"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Más información por WhatsApp
            </a>

            {/* Un adelanto de la ficha técnica, para no dejar la vista previa vacía */}
            {producto.especificaciones.length > 0 && (
              <dl className="mt-5 divide-y divide-carbon-800 border-t border-carbon-800">
                {producto.especificaciones.slice(0, 4).map((e) => (
                  <div key={e.label} className="flex justify-between gap-4 py-2">
                    <dt className="text-[12px] text-carbon-500">{e.label}</dt>
                    <dd className="text-right font-mono text-[12px] text-carbon-200">
                      {e.valor}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <Link
              href={rutaProducto(producto)}
              className="group mt-4 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-marca-400 transition-colors hover:text-marca-300"
            >
              Ver ficha completa
              <IconoFlecha className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
