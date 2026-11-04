import { describe, expect, it } from "vitest";
import { resumir } from "./texto";

describe("resumir", () => {
  it("no parte palabras", () => {
    expect(resumir("Incluye 1 x cargador de batería rápido", 30)).toBe("Incluye 1 x cargador de…");
  });

  it("deja igual lo que ya cabe", () => {
    expect(resumir("Taladro 20V", 30)).toBe("Taladro 20V");
  });

  it("no termina en coma ni en separador", () => {
    expect(resumir("Motor sin escobillas, batería de litio y maletín", 22)).toBe("Motor sin escobillas…");
  });

  it("junta los espacios y saltos de línea", () => {
    expect(resumir("Uno\n\n  dos", 30)).toBe("Uno dos");
  });
});
