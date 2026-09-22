"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCarrito } from "@/lib/cart-context";
import { ImagenProducto } from "@/components/product-image";
import { AgregarAlPedido } from "@/components/add-to-cart";
import { precio, ahorroPorcentaje } from "@/lib/format";
import { enlaceConsulta } from "@/lib/whatsapp";
import { site } from "@/lib/site-config";
import {
  IconoCerrar,
  IconoWhatsApp,
  IconoFlecha,
  IconoCarrito,
} from "@/components/icons";
import { SelectorColor } from "@/components/color-selector";
import type { Product, Category } from "@/lib/types";

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

  const url = `${site.url}/producto/${producto.slug}`;

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

  const ahorro =
    producto.precioMayor !== null
      ? ahorroPorcentaje(producto.precioUnitario, producto.precioMayor)
      : 0;

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
          {/* --- Imagen --- */}
          {/* El panel claro cubre toda la columna y la foto se centra en él:
              de lo contrario queda un vacío oscuro cuando la columna de texto
              es más alta que la imagen cuadrada. */}
          <div className="relative flex items-center border-b border-carbon-800 bg-carbon-50 sm:border-b-0 sm:border-r">
            <ImagenProducto
              className="w-full"
              aspecto="h-[30vh] sm:h-auto sm:aspect-square"
              imagen={producto.imagen}
              nombre={producto.nombre}
              sku={producto.sku}
              prioridad
              sizes="(max-width: 640px) 100vw, 400px"
            />
            {producto.precioMayor !== null && (
              <span className="absolute left-0 top-3 bg-marca-500 py-1 pl-2.5 pr-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                Mayor −{ahorro}%
              </span>
            )}
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
                Precio unidad
              </span>
            </div>

            {producto.precioMayor !== null && (
              <div className="mt-3 border-l-2 border-marca-500 bg-marca-500/[0.08] px-3 py-2.5">
                <span className="font-mono text-lg font-bold leading-none text-marca-400">
                  {precio(producto.precioMayor)}
                </span>
                <span className="ml-2 text-[11px] uppercase tracking-[0.1em] text-marca-300">
                  al mayor
                </span>
              </div>
            )}

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
              href={`/producto/${producto.slug}`}
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
