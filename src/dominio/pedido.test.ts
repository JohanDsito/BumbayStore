import { describe, expect, it } from "vitest";
import type { CartLine } from "./modelos";
import {
  LIMITES_PEDIDO,
  acotarCantidad,
  busquedaRegistrable,
  nombreValido,
  totalesPedido,
} from "./pedido";

const linea = (cantidad: number, precioUnitario: number): CartLine => ({
  slug: `p-${cantidad}-${precioUnitario}`,
  sku: "SKU",
  nombre: "Producto",
  precioUnitario,
  imagen: null,
  cantidad,
});

describe("totalesPedido", () => {
  it("suma unidades y total", () => {
    expect(totalesPedido([linea(2, 1000), linea(3, 500)])).toEqual({ unidades: 5, total: 3500 });
  });

  it("un pedido vacío vale cero", () => {
    expect(totalesPedido([])).toEqual({ unidades: 0, total: 0 });
  });
});

describe("acotarCantidad", () => {
  it("no deja pasar del máximo ni bajar de cero", () => {
    expect(acotarCantidad(5000)).toBe(LIMITES_PEDIDO.cantidadMaxima);
    expect(acotarCantidad(-3)).toBe(0);
    expect(acotarCantidad(2.7)).toBe(2);
  });
});

describe("nombreValido", () => {
  it("exige un nombre de longitud razonable, sin contar espacios de los bordes", () => {
    expect(nombreValido("  A ")).toBe(false);
    expect(nombreValido("Ana")).toBe(true);
    expect(nombreValido("x".repeat(LIMITES_PEDIDO.nombreMaximo + 1))).toBe(false);
  });
});

describe("busquedaRegistrable", () => {
  it("descarta consultas de una letra o de un párrafo", () => {
    expect(busquedaRegistrable("a")).toBe(false);
    expect(busquedaRegistrable("taladro")).toBe(true);
    expect(busquedaRegistrable("x".repeat(121))).toBe(false);
  });
});
