"use client";

import { useSyncExternalStore, useMemo } from "react";
import * as almacen from "@/cliente/carrito/almacen";
import type { CartLine, Product } from "@/dominio/modelos";
import { totalesPedido } from "@/dominio/pedido";

/**
 * Acceso al pedido desde cualquier componente cliente.
 *
 * No hace falta envolver nada en un proveedor: el estado vive en
 * `almacen.ts` y React se suscribe con `useSyncExternalStore`.
 */
export function useCarrito() {
  const estado = useSyncExternalStore(
    almacen.suscribir,
    almacen.getSnapshot,
    almacen.getSnapshotServidor,
  );

  return useMemo(() => {
    const { unidades, total } = totalesPedido(estado.lineas);
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
