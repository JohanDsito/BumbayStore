import type { Category, Niche, Product } from "@/dominio/modelos";
import {
  buscar,
  categoriasConProductos,
  elegirDestacados,
  menuPorNicho,
  nichosConProductos,
  productosDeNicho,
  relacionadosDe,
  variantesDe,
  type SeccionMenu,
} from "@/dominio/catalogo";
import type { FuenteCatalogo } from "./puertos";

/**
 * Casos de uso del catálogo: lo que las páginas pueden preguntar.
 *
 * Cada uno junta lo que trae la fuente con las reglas del dominio. Las
 * páginas no filtran ni ordenan por su cuenta; si una regla cambia, cambia
 * aquí o en `dominio/catalogo.ts` y vale para todo el sitio.
 */
export type Catalogo = ReturnType<typeof crearCatalogo>;

export function crearCatalogo(fuente: FuenteCatalogo) {
  const categorias = async (): Promise<Category[]> =>
    categoriasConProductos(await fuente.categorias(), await fuente.productos());

  const nichos = async (): Promise<Niche[]> =>
    nichosConProductos(await fuente.nichos(), await categorias());

  return {
    productos: (): Promise<Product[]> => fuente.productos(),

    producto: async (slug: string): Promise<Product | null> =>
      (await fuente.productos()).find((p) => p.slug === slug) ?? null,

    /** Categorías con al menos un producto publicado. */
    categorias,

    categoria: async (slug: string): Promise<Category | null> =>
      (await categorias()).find((c) => c.slug === slug) ?? null,

    productosDeCategoria: async (slug: string): Promise<Product[]> =>
      (await fuente.productos()).filter((p) => p.categoriaSlug === slug),

    /** Nichos con al menos una categoría visible. */
    nichos,

    nicho: async (slug: string): Promise<Niche | null> =>
      (await nichos()).find((n) => n.slug === slug) ?? null,

    /** Cada nicho visible con sus categorías: lo que pinta la navegación. */
    menu: async (): Promise<SeccionMenu[]> =>
      menuPorNicho(await nichos(), await categorias(), await fuente.productos()),

    categoriasDeNicho: async (slug: string): Promise<Category[]> =>
      (await categorias()).filter((c) => c.nichoSlug === slug),

    productosDeNicho: async (slug: string): Promise<Product[]> =>
      productosDeNicho(slug, await fuente.categorias(), await fuente.productos()),

    /** Destacados de toda la tienda o, si se indica, de un solo nicho. */
    destacados: async (limite: number, nichoSlug?: string): Promise<Product[]> => {
      const productos = nichoSlug
        ? productosDeNicho(nichoSlug, await fuente.categorias(), await fuente.productos())
        : await fuente.productos();
      return elegirDestacados(productos, limite);
    },

    buscar: async (consulta: string): Promise<Product[]> =>
      buscar(await fuente.productos(), consulta),

    variantesDe: async (producto: Product): Promise<Product[]> =>
      variantesDe(producto, await fuente.productos()),

    relacionadosDe: async (producto: Product, limite: number): Promise<Product[]> =>
      relacionadosDe(producto, await fuente.productos(), limite),
  };
}
