"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { TarjetaProducto } from "@/components/product-card";
import { IconoFlecha } from "@/components/icons";
import type { Product } from "@/dominio/modelos";

/**
 * Carrusel de destacados. Scroll nativo con puntos de anclaje (así funciona
 * con el dedo en celular sin librerías) más flechas en escritorio.
 */
export function CarruselDestacados({ productos }: { productos: Product[] }) {
  const pista = useRef<HTMLDivElement>(null);
  const [puedeIzquierda, setPuedeIzquierda] = useState(false);
  const [puedeDerecha, setPuedeDerecha] = useState(true);

  const revisarPosicion = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setPuedeIzquierda(el.scrollLeft > 8);
    setPuedeDerecha(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    revisarPosicion();
    const el = pista.current;
    if (!el) return;
    el.addEventListener("scroll", revisarPosicion, { passive: true });
    window.addEventListener("resize", revisarPosicion);
    return () => {
      el.removeEventListener("scroll", revisarPosicion);
      window.removeEventListener("resize", revisarPosicion);
    };
  }, [revisarPosicion]);

  const desplazar = (direccion: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: direccion * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (productos.length === 0) return null;

  return (
    <section aria-labelledby="titulo-destacados" className="relative">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
            Lo más pedido
          </p>
          <h2
            id="titulo-destacados"
            className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-3xl"
          >
            Destacados
          </h2>
        </div>

        <div className="hidden shrink-0 gap-px bg-carbon-800 sm:flex">
          <button
            type="button"
            onClick={() => desplazar(-1)}
            disabled={!puedeIzquierda}
            aria-label="Anterior"
            className="flex h-10 w-10 items-center justify-center bg-carbon-900 text-carbon-300 transition-colors hover:bg-carbon-800 hover:text-marca-400 disabled:opacity-30 disabled:hover:bg-carbon-900 disabled:hover:text-carbon-300"
          >
            <IconoFlecha className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => desplazar(1)}
            disabled={!puedeDerecha}
            aria-label="Siguiente"
            className="flex h-10 w-10 items-center justify-center bg-carbon-900 text-carbon-300 transition-colors hover:bg-carbon-800 hover:text-marca-400 disabled:opacity-30 disabled:hover:bg-carbon-900 disabled:hover:text-carbon-300"
          >
            <IconoFlecha className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={pista}
        className="sin-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {productos.map((producto, i) => (
          <div
            key={producto.slug}
            className="w-[calc(50%-0.375rem)] shrink-0 snap-start sm:w-[280px]"
          >
            <TarjetaProducto producto={producto} prioridad={i < 2} indice={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
