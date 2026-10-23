import type { Category, Niche, Product } from "./modelos";

/**
 * Reglas del catálogo.
 *
 * Funciones puras: reciben listas y devuelven listas. No consultan nada, así
 * que se pueden probar sin base de datos y valen igual si mañana el catálogo
 * viene de otro sitio.
 */

/** Categorías que tienen al menos un producto publicado, en su orden de menú. */
export function categoriasConProductos(
  categorias: readonly Category[],
  productos: readonly Product[],
): Category[] {
  const conProductos = new Set(productos.map((p) => p.categoriaSlug));
  return categorias
    .filter((c) => conProductos.has(c.slug))
    .sort((a, b) => a.orden - b.orden);
}

/**
 * Nichos con algo que mostrar, en su orden de menú. Un nicho recién creado y
 * todavía sin productos no aparece: sería una puerta a un cuarto vacío.
 */
export function nichosConProductos(
  nichos: readonly Niche[],
  categoriasVisibles: readonly Category[],
): Niche[] {
  const conCategorias = new Set(categoriasVisibles.map((c) => c.nichoSlug));
  return nichos
    .filter((n) => conCategorias.has(n.slug))
    .sort((a, b) => a.orden - b.orden);
}

/** Un nicho con sus categorías visibles: lo que muestra el menú. */
export type SeccionMenu = {
  nicho: Niche;
  categorias: Category[];
  totalProductos: number;
};

/** El menú de la tienda: cada nicho visible con sus categorías, en orden. */
export function menuPorNicho(
  nichosVisibles: readonly Niche[],
  categoriasVisibles: readonly Category[],
  productos: readonly Product[],
): SeccionMenu[] {
  return nichosVisibles.map((nicho) => ({
    nicho,
    categorias: categoriasVisibles.filter((c) => c.nichoSlug === nicho.slug),
    totalProductos: productosDeNicho(nicho.slug, categoriasVisibles, productos).length,
  }));
}

/** Productos de un nicho: los de cualquiera de sus categorías. */
export function productosDeNicho(
  nichoSlug: string,
  categorias: readonly Category[],
  productos: readonly Product[],
): Product[] {
  const delNicho = new Set(
    categorias.filter((c) => c.nichoSlug === nichoSlug).map((c) => c.slug),
  );
  return productos.filter((p) => delNicho.has(p.categoriaSlug));
}

/**
 * Productos para el carrusel de la portada. Un agotado no entra: es el mejor
 * espacio del sitio y se desperdicia en algo que nadie puede comprar. Si no
 * hay ninguno marcado como destacado, se muestran los primeros disponibles.
 */
export function elegirDestacados(
  productos: readonly Product[],
  limite: number,
): Product[] {
  const disponibles = productos.filter((p) => !p.agotado);
  const destacados = disponibles.filter((p) => p.destacado);
  return (destacados.length > 0 ? destacados : disponibles).slice(0, limite);
}

/**
 * Versiones de color de la misma herramienta, incluida la actual, en orden
 * alfabético para que el selector no cambie de posición entre fichas.
 * Devuelve lista vacía si el producto no tiene variantes.
 */
export function variantesDe(
  producto: Product,
  productos: readonly Product[],
): Product[] {
  if (!producto.grupo) return [];
  const hermanos = productos.filter((p) => p.grupo === producto.grupo);
  return hermanos.length > 1
    ? [...hermanos].sort((a, b) =>
        (a.color ?? "").localeCompare(b.color ?? "", "es"),
      )
    : [];
}

/**
 * Otros productos para la ficha: primero de la misma categoría y, si no
 * alcanzan, del resto del catálogo.
 */
export function relacionadosDe(
  producto: Product,
  productos: readonly Product[],
  limite: number,
): Product[] {
  // Las otras versiones de color no son "relacionados": ya salen en el
  // selector de la ficha, y repetirlas abajo se ve redundante.
  const esOtro = (p: Product) =>
    p.slug !== producto.slug &&
    !(producto.grupo !== null && p.grupo === producto.grupo);

  const mismaCategoria = productos.filter(
    (p) => esOtro(p) && p.categoriaSlug === producto.categoriaSlug,
  );
  if (mismaCategoria.length >= limite) return mismaCategoria.slice(0, limite);

  const resto = productos.filter(
    (p) => esOtro(p) && p.categoriaSlug !== producto.categoriaSlug,
  );
  return [...mismaCategoria, ...resto].slice(0, limite);
}

/**
 * Búsqueda por nombre, SKU, marca, categoría y ficha técnica. Sin acentos y
 * sin importar mayúsculas, porque nadie escribe "inalámbrica" con tilde en un
 * buscador. Todos los términos deben aparecer; coincidir en el nombre o en el
 * SKU sube el producto en la lista.
 */
export function buscar(
  productos: readonly Product[],
  consulta: string,
): Product[] {
  const q = normalizar(consulta).trim();
  if (!q) return [];
  const terminos = q.split(/\s+/);

  return productos
    .map((p) => {
      const heno = normalizar(
        [p.nombre, p.sku, p.marca, p.categoriaSlug, p.fichaTecnica].join(" "),
      );
      if (!terminos.every((t) => heno.includes(t))) return null;

      const nombre = normalizar(p.nombre);
      const puntaje =
        terminos.filter((t) => nombre.includes(t)).length * 10 +
        (normalizar(p.sku).includes(q) ? 50 : 0);
      return { producto: p, puntaje };
    })
    .filter((x): x is { producto: Product; puntaje: number } => x !== null)
    .sort((a, b) => b.puntaje - a.puntaje)
    .map((x) => x.producto);
}

function normalizar(texto: string | null): string {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}
