"use client";

import { useCarrito } from "@/cliente/carrito/use-carrito";
import { precio } from "@/dominio/formato";
import dynamic from "next/dynamic";

/**
 * El panel del pedido se carga solo cuando hace falta.
 *
 * Arrastra el formulario de envío y con él la lista de los 1.122 municipios
 * del DANE: unos 24 KB que estaban descargándose en todas las páginas aunque
 * el visitante no llegara a abrir el carrito. Ahora llegan al abrirlo, que es
 * una acción deliberada y da tiempo de sobra.
 */
const PanelPedido = dynamic(
  () => import("@/components/cart-drawer").then((m) => m.PanelPedido),
  { ssr: false },
);
import { IconoCarrito, IconoFlecha } from "@/components/icons";

/**
 * Barra fija inferior. Acompaña al cliente mientras sigue navegando para que
 * nunca pierda de vista que tiene un pedido en curso. Aparece solo cuando hay
 * algo dentro y se esconde mientras el panel está abierto.
 */
export function BarraPedido() {
  const { unidades, total, abierto, abrir } = useCarrito();

  const visible = unidades > 0 && !abierto;

  return (
    <>
      {visible && (
        <div className="fixed inset-x-0 bottom-0 z-40 animate-[subir_0.32s_var(--ease-salida)] pb-[env(safe-area-inset-bottom,0px)]">
          <div aria-hidden className="h-px bg-marca-500/70" />
          <div className="border-t border-carbon-800 bg-carbon-900/95 backdrop-blur-md shadow-flotante">
            <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
              <div className="relative shrink-0">
                <IconoCarrito className="h-6 w-6 text-marca-500" />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-marca-500 px-1 font-mono text-[10px] font-bold text-sobre-marca">
                  {unidades}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="rotulo text-[10px] text-carbon-500">
                  Pedido en curso
                </p>
                <p className="font-mono text-base font-bold leading-tight text-carbon-50">
                  {precio(total)}
                </p>
              </div>

              <button
                type="button"
                onClick={abrir}
                className="flex h-11 shrink-0 items-center gap-2 bg-marca-500 px-4 text-[13px] font-semibold tracking-tight text-sobre-marca transition-colors hover:bg-marca-400 sm:px-6"
              >
                Ver pedido
                <IconoFlecha className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {abierto && <PanelPedido />}
    </>
  );
}

/** Botón del header con el contador de unidades. */
export function BotonPedidoHeader() {
  const { unidades, abrir } = useCarrito();

  return (
    <button
      type="button"
      onClick={abrir}
      aria-label={`Ver pedido${unidades > 0 ? `, ${unidades} unidades` : ""}`}
      className="relative flex h-10 w-10 items-center justify-center text-carbon-300 transition-colors hover:text-marca-400"
    >
      <IconoCarrito className="h-5 w-5" />
      {unidades > 0 && (
        <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center bg-marca-500 px-1 font-mono text-[9px] font-bold text-sobre-marca">
          {unidades}
        </span>
      )}
    </button>
  );
}
