import Link from "next/link";
import { ImagenProducto } from "@/components/product-image";
import { AgregarAlPedido } from "@/components/add-to-cart";
import { EtiquetaColor } from "@/components/color-selector";
import { precio } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  producto: Product;
  prioridad?: boolean;
  /** Índice en la grilla, para escalonar la animación de entrada. */
  indice?: number;
};

export function TarjetaProducto({ producto, prioridad = false, indice = 0 }: Props) {
  return (
    <article
      style={{ "--i": indice } as React.CSSProperties}
      className="group relative flex h-full min-w-0 flex-col border border-carbon-800 bg-carbon-900 transition-colors duration-300 hover:border-carbon-600"
    >
      <div className="relative">
        <ImagenProducto
          imagen={producto.imagenMini ?? producto.imagen}
          nombre={producto.nombre}
          sku={producto.sku}
          prioridad={prioridad}
        />

      </div>

      <div className="esquinas-tecnicas flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] tracking-[0.16em] text-carbon-500">
            {producto.sku}
          </span>
          {producto.color && <EtiquetaColor color={producto.color} />}
        </div>

        <h3 className="mt-1.5 text-[13px] font-semibold leading-snug tracking-tight text-carbon-100 sm:text-sm">
          {/* El enlace cubre toda la tarjeta salvo el botón, que va por encima. */}
          <Link href={`/producto/${producto.slug}`} className="before:absolute before:inset-0">
            {producto.nombre}
          </Link>
        </h3>

        <div className="mt-auto pt-3.5">
          <div className="min-w-0">
            <span className="block font-mono text-lg font-semibold leading-none text-carbon-50">
              {precio(producto.precioUnitario)}
            </span>
          </div>

          <div className="relative z-10 mt-3.5">
            <AgregarAlPedido producto={producto} tamano="compacto" />
          </div>
        </div>
      </div>
    </article>
  );
}
