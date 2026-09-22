"use client";

import { useCarrito } from "@/lib/cart-context";
import { IconoCarrito, IconoMas, IconoMenos, IconoBasura } from "@/components/icons";
import type { Product } from "@/lib/types";

type Props = {
  producto: Product;
  /** `grande` en la ficha de producto, `compacto` en las tarjetas de la grilla. */
  tamano?: "grande" | "compacto";
};

/**
 * Botón de "Agregar al pedido" que se convierte en control de cantidad en
 * cuanto hay unidades. Es el mismo elemento, no dos controles distintos: así
 * el cliente no pierde de vista dónde estaba.
 */
export function AgregarAlPedido({ producto, tamano = "grande" }: Props) {
  const { agregar, fijarCantidad, cantidadDe } = useCarrito();
  const cantidad = cantidadDe(producto.slug);
  const grande = tamano === "grande";

  // En el HTML del servidor el pedido siempre está vacío, así que se pinta el
  // botón en reposo y el control de cantidad aparece al hidratar.
  const enPedido = cantidad > 0;

  if (producto.agotado) {
    return (
      <div
        className={`flex w-full items-center justify-center border border-carbon-700 bg-carbon-850 font-medium text-carbon-400 ${
          grande ? "h-14 text-[15px]" : "h-10 text-[13px]"
        }`}
      >
        Agotado
      </div>
    );
  }

  if (!enPedido) {
    return (
      <button
        type="button"
        onClick={() => agregar(producto)}
        className={`group/btn flex w-full items-center justify-center gap-2 bg-marca-500 font-semibold text-white transition-all duration-200 hover:bg-marca-400 active:scale-[0.98] ${
          grande
            ? "h-14 text-[15px] tracking-tight"
            : "h-10 text-[13px] tracking-tight"
        }`}
      >
        <IconoCarrito className={grande ? "h-5 w-5" : "h-4 w-4"} />
        {grande ? "Agregar al pedido" : "Agregar"}
      </button>
    );
  }

  return (
    <div
      className={`flex w-full items-stretch border border-marca-500 bg-marca-500/10 ${
        grande ? "h-14" : "h-10"
      }`}
    >
      <button
        type="button"
        onClick={() => fijarCantidad(producto.slug, cantidad - 1)}
        aria-label={cantidad === 1 ? "Quitar del pedido" : "Quitar una unidad"}
        className="flex w-12 shrink-0 items-center justify-center text-marca-400 transition-colors hover:bg-marca-500 hover:text-white"
      >
        {cantidad === 1 ? (
          <IconoBasura className={grande ? "h-5 w-5" : "h-4 w-4"} />
        ) : (
          <IconoMenos className={grande ? "h-5 w-5" : "h-4 w-4"} />
        )}
      </button>

      <div className="flex flex-1 flex-col items-center justify-center leading-none">
        <span
          className={`font-mono font-semibold text-carbon-50 ${
            grande ? "text-lg" : "text-sm"
          }`}
        >
          {cantidad}
        </span>
        {grande && (
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-marca-300">
            {cantidad === 1 ? "unidad" : "unidades"}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => fijarCantidad(producto.slug, cantidad + 1)}
        aria-label="Agregar una unidad"
        className="flex w-12 shrink-0 items-center justify-center text-marca-400 transition-colors hover:bg-marca-500 hover:text-white"
      >
        <IconoMas className={grande ? "h-5 w-5" : "h-4 w-4"} />
      </button>
    </div>
  );
}
