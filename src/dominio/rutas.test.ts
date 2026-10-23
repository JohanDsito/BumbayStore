import { describe, expect, it } from "vitest";
import { rutaCategoria, rutaNicho, rutaProducto, slugDeNichoValido } from "./rutas";

describe("rutas", () => {
  it("la categoría vive dentro de su nicho y la ficha no", () => {
    expect(rutaNicho({ slug: "herramientas" })).toBe("/herramientas");
    expect(rutaCategoria({ slug: "taladros", nichoSlug: "herramientas" })).toBe(
      "/herramientas/taladros",
    );
    expect(rutaProducto({ slug: "taladro-20v" })).toBe("/producto/taladro-20v");
  });
});

describe("slugDeNichoValido", () => {
  it("acepta minúsculas, números y guiones simples", () => {
    expect(slugDeNichoValido("hogar-y-cocina")).toBe(true);
    expect(slugDeNichoValido("tecnologia2")).toBe(true);
  });

  it("rechaza mayúsculas, espacios, tildes y guiones sueltos", () => {
    for (const malo of ["Hogar", "hogar cocina", "tecnología", "-hogar", "hogar--cocina", ""]) {
      expect(slugDeNichoValido(malo)).toBe(false);
    }
  });

  it("rechaza los nombres de secciones fijas del sitio", () => {
    expect(slugDeNichoValido("buscar")).toBe(false);
    expect(slugDeNichoValido("producto")).toBe(false);
  });
});
