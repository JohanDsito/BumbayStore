import { describe, expect, it } from "vitest";
import { acentoLegible, contraste, tintaSobre } from "./color";

describe("tintaSobre", () => {
  it("usa tinta blanca sobre el rojo Bumbay", () => {
    expect(tintaSobre("#ec080f")).toBe("#ffffff");
  });

  it("usa tinta oscura sobre un ámbar claro", () => {
    expect(tintaSobre("#ffb21a")).toBe("#0b0c12");
  });

  it("si el color no se entiende, queda en blanco", () => {
    expect(tintaSobre("rojo")).toBe("#ffffff");
  });
});

describe("contraste", () => {
  it("da 21 entre blanco y negro y 1 entre iguales", () => {
    expect(contraste("#ffffff", "#000000")).toBeCloseTo(21, 1);
    expect(contraste("#12acaa", "#12acaa")).toBe(1);
  });
});

describe("acentoLegible", () => {
  const claro = "#eceef3";
  const oscuro = "#191c29";

  it("deja el acento igual si ya se lee", () => {
    expect(acentoLegible("#12acaa", oscuro)).toBe("#12acaa");
  });

  it("oscurece el turquesa y el ámbar lo justo sobre fondo claro", () => {
    for (const acento of ["#12acaa", "#ffb21a", "#8b5cff", "#ff5c9a", "#ec080f"]) {
      const texto = acentoLegible(acento, claro);
      expect(contraste(texto, claro)).toBeGreaterThanOrEqual(4.5);
      // Sigue siendo de su familia: no se va al negro.
      expect(contraste(texto, "#000000")).toBeGreaterThan(2);
    }
  });

  it("aclara un acento oscuro sobre fondo oscuro", () => {
    const texto = acentoLegible("#5a1a8c", oscuro);
    expect(contraste(texto, oscuro)).toBeGreaterThanOrEqual(4.5);
  });

  it("para texto grande pide 3:1", () => {
    const grande = acentoLegible("#12acaa", claro, 3);
    expect(contraste(grande, claro)).toBeGreaterThanOrEqual(3);
    expect(contraste(grande, claro)).toBeLessThan(4.5);
  });
});
