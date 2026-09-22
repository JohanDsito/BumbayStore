"use client";

import { useSyncExternalStore, useMemo } from "react";
import * as almacen from "@/lib/cart-store";
import type { CartLine, Product } from "@/lib/types";

/**
 * Acceso al pedido desde cualquier componente cliente.
 *
 * No hace falta envolver nada en un proveedor: el estado vive en
 * `cart-store.ts` y React se suscribe con `useSyncExternalStore`.
 */
export function useCarrito() {
  const estado = useSyncExternalStore(
    almacen.suscribir,
    almacen.getSnapshot,
    almacen.getSnapshotServidor,
  );

  return useMemo(() => {
    const unidades = estado.lineas.reduce((s, l) => s + l.cantidad, 0);
    const total = estado.lineas.reduce(
      (s, l) => s + l.precioUnitario * l.cantidad,
      0,
    );
    return {
      lineas: estado.lineas as CartLine[],
      nombre: estado.nombre,
      ciudad: estado.ciudad,
      comentario: estado.comentario,
      abierto: estado.abierto,
      unidades,
      total,
      cantidadDe: (slug: string) =>
        estado.lineas.find((l) => l.slug === slug)?.cantidad ?? 0,
      agregar: (producto: Product, cantidad?: number) =>
        almacen.agregar(producto, cantidad),
      fijarCantidad: almacen.fijarCantidad,
      quitar: almacen.quitar,
      vaciar: almacen.vaciar,
      fijarComentario: almacen.fijarComentario,
      fijarNombre: almacen.fijarNombre,
      fijarCiudad: almacen.fijarCiudad,
      abrir: almacen.abrir,
      cerrar: almacen.cerrar,
    };
  }, [estado]);
}
