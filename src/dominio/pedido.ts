import type { CartLine } from "./modelos";

/**
 * Reglas del pedido.
 *
 * Los límites existen para que un pedido absurdo —miles de líneas, un nombre
 * de diez páginas— no llegue a la base de datos. La base tiene las mismas
 * restricciones (ver supabase/migrations): estas solo evitan que el cliente
 * escriba algo que de todas formas se rechazaría.
 */
export const LIMITES_PEDIDO = {
  /** Unidades de un mismo producto en una línea. */
  cantidadMaxima: 999,
  /** Productos distintos en un pedido. */
  lineasMaximas: 100,
  nombreMinimo: 2,
  nombreMaximo: 80,
  comentarioMaximo: 1000,
} as const;

/** Lo que se registra de cada búsqueda: ni muy corta para decir algo, ni un párrafo. */
export const LIMITES_BUSQUEDA = { minimo: 2, maximo: 120 } as const;

export function totalesPedido(lineas: readonly CartLine[]): {
  unidades: number;
  total: number;
} {
  return lineas.reduce(
    (acc, l) => ({
      unidades: acc.unidades + l.cantidad,
      total: acc.total + l.precioUnitario * l.cantidad,
    }),
    { unidades: 0, total: 0 },
  );
}

/** Lleva una cantidad al rango permitido para una línea del pedido. */
export function acotarCantidad(cantidad: number): number {
  return Math.min(LIMITES_PEDIDO.cantidadMaxima, Math.max(0, Math.floor(cantidad)));
}

export function nombreValido(nombre: string): boolean {
  const limpio = nombre.trim();
  return (
    limpio.length >= LIMITES_PEDIDO.nombreMinimo &&
    limpio.length <= LIMITES_PEDIDO.nombreMaximo
  );
}

export function busquedaRegistrable(consulta: string): boolean {
  const limpia = consulta.trim();
  return (
    limpia.length >= LIMITES_BUSQUEDA.minimo &&
    limpia.length <= LIMITES_BUSQUEDA.maximo
  );
}
