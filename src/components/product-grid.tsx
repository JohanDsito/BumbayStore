import { TarjetaProducto } from "@/components/product-card";
import type { Product } from "@/dominio/modelos";

type Props = {
  productos: Product[];
  /** Cuántas tarjetas precargan su imagen (las visibles al entrar). */
  prioritarias?: number;
};

/** Grilla del catálogo: 2 columnas en celular, 3 en tablet, 4 en escritorio. */
export function GrillaProductos({ productos, prioritarias = 4 }: Props) {
  if (productos.length === 0) {
    return (
      <div className="border border-dashed border-carbon-700 px-6 py-20 text-center">
        <p className="text-sm text-carbon-400">
          No hay productos para mostrar aquí todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="escalonar grid grid-cols-2 gap-px bg-carbon-800 sm:gap-3 sm:bg-transparent lg:grid-cols-3 xl:grid-cols-4">
      {productos.map((producto, i) => (
        <TarjetaProducto
          key={producto.slug}
          producto={producto}
          prioridad={i < prioritarias}
          indice={i}
        />
      ))}
    </div>
  );
}
