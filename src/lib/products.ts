import "server-only";

import { getSupabase } from "@/lib/supabase";
import { productosSeed } from "@/data/products.seed";
import { categoriasSeed } from "@/data/categories.seed";
import type { Category, Product, Spec, Faq } from "@/lib/types";

/**
 * Capa de acceso a datos del catálogo.
 *
 * Si hay Supabase configurado, lee de ahí. Si no, usa los datos locales de
 * src/data. Los componentes no saben de dónde vienen los datos, así que migrar
 * a Supabase es cuestión de poner las variables de entorno.
 */

/** Convierte una fila de Supabase (snake_case) al modelo del dominio. */
function aProducto(fila: Record<string, unknown>): Product {
  return {
    id: String(fila.id),
    sku: String(fila.sku ?? ""),
    nombre: String(fila.nombre ?? ""),
    slug: String(fila.slug ?? ""),
    categoriaSlug: String(fila.categoria_slug ?? ""),
    marca: (fila.marca as string) ?? null,
    color: (fila.color as string) ?? null,
    grupo: (fila.grupo as string) ?? null,
    precioUnitario: Number(fila.precio_unitario ?? 0),
    precioMayor:
      fila.precio_mayor === null || fila.precio_mayor === undefined
        ? null
        : Number(fila.precio_mayor),
    imagen: (fila.imagen as string) ?? null,
    imagenes: (fila.imagenes as string[]) ?? [],
    fichaTecnica: (fila.ficha_tecnica as string) ?? null,
    especificaciones: (fila.especificaciones as Spec[]) ?? [],
    modoUso: (fila.modo_uso as string) ?? null,
    beneficios: (fila.beneficios as string[]) ?? [],
    faq: (fila.faq as Faq[]) ?? [],
    destacado: Boolean(fila.destacado),
    activo: fila.activo === undefined ? true : Boolean(fila.activo),
  };
}

function aCategoria(fila: Record<string, unknown>): Category {
  return {
    slug: String(fila.slug ?? ""),
    nombre: String(fila.nombre ?? ""),
    orden: Number(fila.orden ?? 0),
    descripcion: (fila.descripcion as string) ?? null,
  };
}

/** Todos los productos activos, ordenados por categoría y nombre. */
export async function getProductos(): Promise<Product[]> {
  const sb = getSupabase();
  if (!sb) return productosSeed.filter((p) => p.activo);

  const { data, error } = await sb
    .from("productos")
    .select("*")
    .eq("activo", true)
    .order("categoria_slug")
    .order("nombre");

  if (error) {
    console.error("[productos] Supabase falló, usando datos locales:", error.message);
    return productosSeed.filter((p) => p.activo);
  }
  return (data ?? []).map(aProducto);
}

/** Un producto por su slug. Devuelve null si no existe. */
export async function getProducto(slug: string): Promise<Product | null> {
  const sb = getSupabase();
  if (!sb) return productosSeed.find((p) => p.slug === slug && p.activo) ?? null;

  const { data, error } = await sb
    .from("productos")
    .select("*")
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    console.error("[producto] Supabase falló, usando datos locales:", error.message);
    return productosSeed.find((p) => p.slug === slug && p.activo) ?? null;
  }
  return data ? aProducto(data) : null;
}

/** Categorías con al menos un producto activo, en su orden de menú. */
export async function getCategorias(): Promise<Category[]> {
  const sb = getSupabase();
  let categorias: Category[];

  if (!sb) {
    categorias = [...categoriasSeed];
  } else {
    const { data, error } = await sb.from("categorias").select("*").order("orden");
    if (error) {
      console.error("[categorias] Supabase falló, usando datos locales:", error.message);
      categorias = [...categoriasSeed];
    } else {
      categorias = (data ?? []).map(aCategoria);
    }
  }

  const productos = await getProductos();
  const conProductos = new Set(productos.map((p) => p.categoriaSlug));
  return categorias
    .filter((c) => conProductos.has(c.slug))
    .sort((a, b) => a.orden - b.orden);
}

export async function getCategoria(slug: string): Promise<Category | null> {
  const categorias = await getCategorias();
  return categorias.find((c) => c.slug === slug) ?? null;
}

export async function getProductosPorCategoria(slug: string): Promise<Product[]> {
  const productos = await getProductos();
  return productos.filter((p) => p.categoriaSlug === slug);
}

/** Productos marcados como destacados, para el carrusel de la portada. */
export async function getDestacados(limite = 8): Promise<Product[]> {
  const productos = await getProductos();
  const destacados = productos.filter((p) => p.destacado);
  return (destacados.length > 0 ? destacados : productos).slice(0, limite);
}

/**
 * Búsqueda por nombre, SKU, marca y ficha técnica. Sin acentos y sin importar
 * mayúsculas, porque nadie escribe "inalámbrica" con tilde en un buscador.
 */
export async function buscarProductos(consulta: string): Promise<Product[]> {
  const q = normalizar(consulta).trim();
  if (!q) return [];

  const terminos = q.split(/\s+/);
  const productos = await getProductos();

  return productos
    .map((p) => {
      const heno = normalizar(
        [p.nombre, p.sku, p.marca, p.categoriaSlug, p.fichaTecnica].join(" "),
      );
      const nombreNorm = normalizar(p.nombre);
      // Todos los términos deben aparecer en algún lado.
      if (!terminos.every((t) => heno.includes(t))) return null;
      // Coincidir en el nombre pesa más que coincidir en la ficha técnica.
      const puntaje =
        terminos.filter((t) => nombreNorm.includes(t)).length * 10 +
        (normalizar(p.sku).includes(q) ? 50 : 0);
      return { producto: p, puntaje };
    })
    .filter((x): x is { producto: Product; puntaje: number } => x !== null)
    .sort((a, b) => b.puntaje - a.puntaje)
    .map((x) => x.producto);
}

/**
 * Versiones de color de la misma herramienta, incluida la actual, en orden
 * alfabético para que el selector no cambie de posición entre fichas.
 * Devuelve lista vacía si el producto no tiene variantes.
 */
export async function getVariantes(producto: Product): Promise<Product[]> {
  if (!producto.grupo) return [];
  const productos = await getProductos();
  const hermanos = productos.filter((p) => p.grupo === producto.grupo);
  return hermanos.length > 1
    ? hermanos.sort((a, b) => (a.color ?? "").localeCompare(b.color ?? "", "es"))
    : [];
}

/** Otros productos de la misma categoría, para la ficha de producto. */
export async function getRelacionados(
  producto: Product,
  limite = 4,
): Promise<Product[]> {
  const productos = await getProductos();
  // Las otras versiones de color no son "relacionados": ya salen en el
  // selector de la ficha, y repetirlas abajo se ve redundante.
  const esHermano = (p: Product) =>
    producto.grupo !== null && p.grupo === producto.grupo;

  const mismaCategoria = productos.filter(
    (p) =>
      p.categoriaSlug === producto.categoriaSlug &&
      p.slug !== producto.slug &&
      !esHermano(p),
  );
  if (mismaCategoria.length >= limite) return mismaCategoria.slice(0, limite);
  const resto = productos.filter(
    (p) =>
      p.categoriaSlug !== producto.categoriaSlug &&
      p.slug !== producto.slug &&
      !esHermano(p),
  );
  return [...mismaCategoria, ...resto].slice(0, limite);
}

function normalizar(texto: string | null): string {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}
