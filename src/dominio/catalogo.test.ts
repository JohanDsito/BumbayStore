import { describe, expect, it } from "vitest";
import type { Category, Niche, Product } from "./modelos";
import {
  buscar,
  categoriasConProductos,
  elegirDestacados,
  menuPorNicho,
  nichosConProductos,
  productosDeNicho,
  relacionadosDe,
  variantesDe,
} from "./catalogo";

function producto(datos: Partial<Product> & { slug: string }): Product {
  return {
    id: datos.slug,
    sku: datos.slug.toUpperCase(),
    nombre: datos.slug,
    categoriaSlug: "taladros",
    marca: null,
    color: null,
    grupo: null,
    precioUnitario: 100000,
    imagen: null,
    imagenMini: null,
    imagenes: [],
    fichaTecnica: null,
    especificaciones: [],
    modoUso: null,
    beneficios: [],
    faq: [],
    destacado: false,
    agotado: false,
    activo: true,
    ...datos,
  };
}

const categoria = (slug: string, orden: number, nichoSlug = "herramientas"): Category => ({
  slug,
  nichoSlug,
  nombre: slug,
  orden,
  descripcion: null,
});

const nicho = (slug: string, orden: number): Niche => ({
  slug,
  nombre: slug,
  submarca: null,
  titular: null,
  descripcion: null,
  datos: [],
  orden,
});

describe("categoriasConProductos", () => {
  it("oculta las categorías vacías y respeta el orden del menú", () => {
    const categorias = [categoria("pulidoras", 2), categoria("vacia", 0), categoria("taladros", 1)];
    const productos = [
      producto({ slug: "a", categoriaSlug: "pulidoras" }),
      producto({ slug: "b", categoriaSlug: "taladros" }),
    ];
    expect(categoriasConProductos(categorias, productos).map((c) => c.slug)).toEqual([
      "taladros",
      "pulidoras",
    ]);
  });
});

describe("nichosConProductos", () => {
  it("oculta los nichos sin categorías visibles", () => {
    const nichos = [nicho("hogar", 2), nicho("herramientas", 1)];
    const visibles = [categoria("taladros", 1, "herramientas")];
    expect(nichosConProductos(nichos, visibles).map((n) => n.slug)).toEqual(["herramientas"]);
  });
});

describe("menuPorNicho", () => {
  it("agrupa las categorías bajo su nicho y cuenta sus productos", () => {
    const nichos = [nicho("herramientas", 1), nicho("hogar", 2)];
    const categorias = [
      categoria("taladros", 1, "herramientas"),
      categoria("cocina", 1, "hogar"),
      categoria("pulidoras", 2, "herramientas"),
    ];
    const productos = [
      producto({ slug: "a", categoriaSlug: "taladros" }),
      producto({ slug: "b", categoriaSlug: "pulidoras" }),
      producto({ slug: "c", categoriaSlug: "cocina" }),
    ];
    const menu = menuPorNicho(nichos, categorias, productos);
    expect(menu.map((s) => [s.nicho.slug, s.categorias.map((c) => c.slug), s.totalProductos])).toEqual([
      ["herramientas", ["taladros", "pulidoras"], 2],
      ["hogar", ["cocina"], 1],
    ]);
  });
});

describe("productosDeNicho", () => {
  it("devuelve solo los productos de las categorías del nicho", () => {
    const categorias = [categoria("taladros", 1, "herramientas"), categoria("cocina", 1, "hogar")];
    const productos = [
      producto({ slug: "a", categoriaSlug: "taladros" }),
      producto({ slug: "c", categoriaSlug: "cocina" }),
    ];
    expect(productosDeNicho("hogar", categorias, productos).map((p) => p.slug)).toEqual(["c"]);
  });
});

describe("elegirDestacados", () => {
  it("nunca pone un agotado en el carrusel", () => {
    const productos = [
      producto({ slug: "agotado", destacado: true, agotado: true }),
      producto({ slug: "ok", destacado: true }),
    ];
    expect(elegirDestacados(productos, 8).map((p) => p.slug)).toEqual(["ok"]);
  });

  it("si no hay destacados, muestra los primeros disponibles", () => {
    const productos = [producto({ slug: "a" }), producto({ slug: "b" }), producto({ slug: "c" })];
    expect(elegirDestacados(productos, 2).map((p) => p.slug)).toEqual(["a", "b"]);
  });
});

describe("variantesDe", () => {
  const azul = producto({ slug: "azul", grupo: "tal", color: "Azul" });
  const amarillo = producto({ slug: "amarillo", grupo: "tal", color: "Amarillo" });
  const otro = producto({ slug: "otro" });

  it("devuelve las versiones de color en orden alfabético", () => {
    expect(variantesDe(azul, [otro, azul, amarillo]).map((p) => p.slug)).toEqual([
      "amarillo",
      "azul",
    ]);
  });

  it("devuelve lista vacía si el producto no tiene grupo o está solo en él", () => {
    expect(variantesDe(otro, [otro, azul])).toEqual([]);
    expect(variantesDe(azul, [azul, otro])).toEqual([]);
  });
});

describe("relacionadosDe", () => {
  it("prioriza la misma categoría, completa con el resto y excluye las versiones de color", () => {
    const actual = producto({ slug: "actual", grupo: "g" });
    const hermano = producto({ slug: "hermano", grupo: "g" });
    const mismaCat = producto({ slug: "misma" });
    const otraCat = producto({ slug: "otra", categoriaSlug: "pulidoras" });
    expect(
      relacionadosDe(actual, [otraCat, actual, hermano, mismaCat], 4).map((p) => p.slug),
    ).toEqual(["misma", "otra"]);
  });
});

describe("buscar", () => {
  const productos = [
    producto({ slug: "pulidora", nombre: "Pulidora angular", fichaTecnica: "Ideal con taladro" }),
    producto({ slug: "taladro", nombre: "Taladro inalámbrico 20V", sku: "BT-TAL-2001" }),
  ];

  it("ignora tildes y mayúsculas", () => {
    expect(buscar(productos, "INALAMBRICO").map((p) => p.slug)).toEqual(["taladro"]);
  });

  it("exige todos los términos y ordena por coincidencia en el nombre", () => {
    expect(buscar(productos, "taladro").map((p) => p.slug)).toEqual(["taladro", "pulidora"]);
    expect(buscar(productos, "taladro martillo")).toEqual([]);
  });

  it("encuentra por SKU", () => {
    expect(buscar(productos, "bt-tal").map((p) => p.slug)).toEqual(["taladro"]);
  });

  it("una consulta vacía no devuelve nada", () => {
    expect(buscar(productos, "   ")).toEqual([]);
  });
});
