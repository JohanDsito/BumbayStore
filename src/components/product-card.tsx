import Link from "next/link";
import { ImagenProducto } from "@/components/product-image";
import { AgregarAlPedido } from "@/components/add-to-cart";
import { EtiquetaColor } from "@/components/color-selector";
import { precio } from "@/dominio/formato";
import type { Product } from "@/dominio/modelos";
import { rutaProducto } from "@/dominio/rutas";

type Props = {
  producto: Product;
  prioridad?: boolean;
};

export function TarjetaProducto({ producto, prioridad = false }: Props) {
  return (
    <article
      className="group relative flex h-full min-w-0 flex-col border border-linea bg-superficie transition-colors duration-300 hover:border-borde-fuerte"
    >
      <div className="relative">
        <div className={producto.agotado ? "opacity-45 grayscale" : undefined}>
          <ImagenProducto
            imagen={producto.imagenMini ?? producto.imagen}
            nombre={producto.nombre}
            sku={producto.sku}
            prioridad={prioridad}
          />
        </div>

        {producto.agotado && (
          <span className="absolute left-0 top-3 bg-fondo py-1 pl-2.5 pr-3 rotulo text-[11px] font-semibold text-tinta ring-1 ring-noche">
            Agotado
          </span>
        )}

      </div>

      <div className="esquinas-tecnicas flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] tracking-[0.16em] text-tinta-tenue">
            {producto.sku}
          </span>
          {producto.color && <EtiquetaColor color={producto.color} />}
        </div>

        <h3 className="mt-1.5 text-[13px] font-semibold leading-snug tracking-tight text-tinta sm:text-sm">
          {/* El enlace cubre toda la tarjeta, foto incluida, salvo el botón, que va
              por encima. Por eso entre él y el <article> no puede haber otro
              bloque posicionado (ver .esquinas-tecnicas en globals.css). */}
          <Link href={rutaProducto(producto)} className="before:absolute before:inset-0">
            {producto.nombre}
          </Link>
        </h3>

        <div className="mt-auto pt-3.5">
          <div className="min-w-0">
            <span
              className={`block font-mono text-lg font-semibold leading-none ${
                producto.agotado ? "text-tinta-tenue line-through" : "text-tinta-fuerte"
              }`}
            >
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
