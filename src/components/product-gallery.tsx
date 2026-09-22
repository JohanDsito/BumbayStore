"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { imagenUrl } from "@/lib/supabase";
import { IconoFlecha } from "@/components/icons";

type Props = {
  /** Rutas de las imágenes, en orden. La primera es la portada. */
  imagenes: string[];
  nombre: string;
  sku: string;
};

/**
 * Galería de la ficha de producto.
 *
 * Las piezas de marca de Bumbay son una secuencia: cada una explica algo
 * distinto del producto (velocidad, accesorios incluidos, garantía…). Se
 * muestran todas, como en el carrusel de Mercado Libre, porque son material
 * de venta ya hecho.
 *
 * El marco es cuadrado y las imágenes van contenidas: vienen en proporciones
 * muy distintas y sin un marco fijo la página daría saltos al cambiar de
 * imagen.
 */
export function GaleriaProducto({ imagenes, nombre, sku }: Props) {
  const [activa, setActiva] = useState(0);
  const tira = useRef<HTMLDivElement>(null);

  const total = imagenes.length;

  const ir = useCallback(
    (indice: number) => {
      if (total === 0) return;
      setActiva(((indice % total) + total) % total);
    },
    [total],
  );

  // Flechas del teclado para recorrer la galería.
  useEffect(() => {
    if (total < 2) return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") ir(activa - 1);
      if (e.key === "ArrowRight") ir(activa + 1);
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [activa, ir, total]);

  // Mantener la miniatura activa a la vista.
  useEffect(() => {
    const el = tira.current?.children[activa] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [activa]);

  if (total === 0) return null;

  const url = imagenUrl(imagenes[activa]);

  return (
    <div>
      <div className="relative border border-carbon-800 bg-carbon-50">
        <div className="relative aspect-square">
          {url && (
            <Image
              key={imagenes[activa]}
              src={url}
              alt={
                activa === 0
                  ? nombre
                  : `${nombre} — imagen ${activa + 1} de ${total}`
              }
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              priority={activa === 0}
              className="animate-[aparecer_0.3s_var(--ease-salida)] object-contain"
            />
          )}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(activa - 1)}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-carbon-950/70 text-white backdrop-blur-sm transition-colors hover:bg-marca-500"
            >
              <IconoFlecha className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => ir(activa + 1)}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-carbon-950/70 text-white backdrop-blur-sm transition-colors hover:bg-marca-500"
            >
              <IconoFlecha className="h-4 w-4" />
            </button>
            <span className="absolute bottom-2 right-2 bg-carbon-950/70 px-2 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
              {activa + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div
          ref={tira}
          className="sin-scrollbar mt-2 flex gap-2 overflow-x-auto"
          role="tablist"
          aria-label={`Imágenes de ${sku}`}
        >
          {imagenes.map((img, i) => {
            const miniatura = imagenUrl(img);
            const activaEsta = i === activa;
            return (
              <button
                key={img}
                type="button"
                role="tab"
                aria-selected={activaEsta}
                aria-label={`Ver imagen ${i + 1}`}
                onClick={() => ir(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-carbon-50 transition-colors ${
                  activaEsta
                    ? "border-marca-500"
                    : "border-carbon-800 hover:border-carbon-600"
                }`}
              >
                {miniatura && (
                  <Image
                    src={miniatura}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-contain p-0.5"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
