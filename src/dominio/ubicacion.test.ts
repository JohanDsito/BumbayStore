import { describe, expect, it } from "vitest";
import { separarCiudad, sinTildes, ubicacionValida, type Divipola } from "./ubicacion";

const divipola: Divipola = {
  Antioquia: ["Medellín", "Envigado"],
  Nariño: ["Pasto", "Ipiales"],
};

describe("ubicacionValida", () => {
  it("acepta un municipio de su departamento", () => {
    expect(ubicacionValida("Nariño", "Pasto", divipola)).toBe(true);
  });

  it("rechaza un municipio de otro departamento", () => {
    expect(ubicacionValida("Antioquia", "Pasto", divipola)).toBe(false);
  });

  it("rechaza un departamento que no existe o vacío", () => {
    expect(ubicacionValida("Narnia", "Pasto", divipola)).toBe(false);
    expect(ubicacionValida("", "", divipola)).toBe(false);
  });
});

describe("separarCiudad", () => {
  it("separa la ciudad guardada por el formulario anterior", () => {
    expect(separarCiudad("Envigado, Antioquia", divipola)).toEqual({
      departamento: "Antioquia",
      municipio: "Envigado",
    });
  });

  it("devuelve null si no es un municipio real", () => {
    expect(separarCiudad("Pasto, Antioquia", divipola)).toBeNull();
    expect(separarCiudad("Medellín", divipola)).toBeNull();
  });
});

describe("sinTildes", () => {
  it("compara sin tildes ni mayúsculas", () => {
    expect(sinTildes(" Nariño ")).toBe("narino");
    expect(sinTildes("MEDELLÍN")).toBe("medellin");
  });
});
