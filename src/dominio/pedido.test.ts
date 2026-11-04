import { describe, expect, it } from "vitest";
import type { CartLine } from "./modelos";
import {
  LIMITES_PEDIDO,
  acotarCantidad,
  busquedaRegistrable,
  camposInvalidos,
  celularValido,
  esFormaPago,
  formatearCelular,
  nombreFormaPago,
  nombreValido,
  normalizarCelular,
  totalesPedido,
  type DatosCliente,
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

describe("celular", () => {
  it("acepta 10 dígitos que empiezan por 3, con espacios o guiones", () => {
    expect(celularValido("3001234567")).toBe(true);
    expect(celularValido("300 123 4567")).toBe(true);
    expect(celularValido("300-123-4567")).toBe(true);
  });

  it("quita el indicativo +57", () => {
    expect(normalizarCelular("+57 300 123 4567")).toBe("3001234567");
    expect(celularValido("+57 300 123 4567")).toBe(true);
  });

  it("rechaza fijos, números cortos y largos", () => {
    expect(celularValido("6012345678")).toBe(false);
    expect(celularValido("300123456")).toBe(false);
    expect(celularValido("30012345678")).toBe(false);
    expect(celularValido("")).toBe(false);
  });

  it("guarda solo los dígitos y se lee en grupos", () => {
    expect(normalizarCelular("300-123 4567")).toBe("3001234567");
    expect(formatearCelular("3001234567")).toBe("300 123 4567");
  });
});

describe("formas de pago", () => {
  it("conoce las cuatro opciones del formulario", () => {
    expect(esFormaPago("anticipado")).toBe(true);
    expect(esFormaPago("sistecredito")).toBe(true);
    expect(esFormaPago("efectivo")).toBe(false);
    expect(nombreFormaPago("contra_entrega")).toBe("Pago contra entrega");
  });
});

describe("camposInvalidos", () => {
  const divipola = { Nariño: ["Pasto"] };
  const bien: DatosCliente = {
    nombre: "Ana",
    apellido: "Gómez",
    celular: "300 123 4567",
    departamento: "Nariño",
    municipio: "Pasto",
    formaPago: "anticipado",
  };

  it("deja pasar un pedido completo", () => {
    expect(camposInvalidos(bien, divipola)).toEqual([]);
  });

  it("señala los campos en el orden del formulario", () => {
    expect(
      camposInvalidos({ ...bien, apellido: "", celular: "123", formaPago: "" }, divipola),
    ).toEqual(["apellido", "celular", "formaPago"]);
  });

  it("sin departamento, también falta el municipio", () => {
    expect(camposInvalidos({ ...bien, departamento: "" }, divipola)).toEqual([
      "departamento",
      "municipio",
    ]);
  });
});
