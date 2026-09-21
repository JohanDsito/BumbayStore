import Link from "next/link";
import { ImagenProducto } from "@/components/product-image";
import { AgregarAlPedido } from "@/components/add-to-cart";
import { EtiquetaColor } from "@/components/color-selector";
import { precio, ahorroPorcentaje } from "@/lib/format";
import type { Product } from "@/lib/types";

type Props = {
  producto: Product;
  prioridad?: boolean;
  /** Índice en la grilla, para escalonar la animación de entrada. */
  indice?: number;
};

export function TarjetaProducto({ producto, prioridad = false, indice = 0 }: Props) {
  const ahorro =
    producto.precioMayor !== null
      ? ahorroPorcentaje(producto.precioUnitario, producto.precioMayor)
      : 0;

  return (
    <article
      style={{ "--i": indice } as React.CSSProperties}
      className="group relative flex h-full min-w-0 flex-col border border-carbon-800 bg-carbon-900 transition-colors duration-300 hover:border-carbon-600"
    >
      <div className="relative">
        <ImagenProducto
          imagen={producto.imagen}
          nombre={producto.nombre}
          sku={producto.sku}
          prioridad={prioridad}
        />

        {producto.precioMayor !== null && (
          <span className="absolute left-0 top-3 bg-naranja-500 py-1 pl-2.5 pr-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-carbon-950">
            Mayor −{ahorro}%
          </span>
        )}
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
          {/* En celular los dos precios se apilan: puestos en una sola fila no
              caben en una tarjeta de media pantalla y desbordan el layout. */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
            <div className="min-w-0">
              <span className="block font-mono text-base font-semibold leading-none text-carbon-50 sm:text-lg">
                {precio(producto.precioUnitario)}
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-carbon-500">
                Unidad
              </span>
            </div>

            {producto.precioMayor !== null && (
              <div className="min-w-0 sm:text-right">
                <span className="block font-mono text-sm font-semibold leading-none text-naranja-400">
                  {precio(producto.precioMayor)}
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-carbon-500">
                  Al mayor
                </span>
              </div>
            )}
          </div>

          <div className="relative z-10 mt-3.5">
            <AgregarAlPedido producto={producto} tamano="compacto" />
          </div>
        </div>
      </div>
    </article>
  );
}
