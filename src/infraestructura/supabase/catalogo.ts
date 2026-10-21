import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { FuenteCatalogo } from "@/aplicacion/puertos";
import type { Category, Faq, Niche, Product, Spec } from "@/dominio/modelos";

/**
 * El catálogo leído de Supabase.
 *
 * Aquí, y solo aquí, se sabe que las tablas usan snake_case y cómo se llama
 * cada columna. Si una consulta falla lanza el error: decidir qué hacer
 * entonces no es asunto de este archivo (ver `respaldo.ts`).
 */
export function crearFuenteSupabase(sb: SupabaseClient): FuenteCatalogo {
  return {
    async productos() {
      const { data, error } = await sb
        .from("productos")
        .select("*")
        .eq("activo", true)
        .order("categoria_slug")
        .order("nombre");
      if (error) throw new Error(error.message);
      return (data ?? []).map(aProducto);
    },

    async categorias() {
      const { data, error } = await sb.from("categorias").select("*").order("orden");
      if (error) throw new Error(error.message);
      return (data ?? []).map(aCategoria);
    },

    async nichos() {
      const { data, error } = await sb
        .from("nichos")
        .select("*")
        .eq("activo", true)
        .order("orden");
      if (error) throw new Error(error.message);
      return (data ?? []).map(aNicho);
    },
  };
}

type Fila = Record<string, unknown>;

function aProducto(fila: Fila): Product {
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
    imagen: (fila.imagen as string) ?? null,
    imagenMini: (fila.imagen_mini as string) ?? null,
    imagenes: (fila.imagenes as string[]) ?? [],
    fichaTecnica: (fila.ficha_tecnica as string) ?? null,
    especificaciones: (fila.especificaciones as Spec[]) ?? [],
    modoUso: (fila.modo_uso as string) ?? null,
    beneficios: (fila.beneficios as string[]) ?? [],
    faq: (fila.faq as Faq[]) ?? [],
    destacado: Boolean(fila.destacado),
    agotado: Boolean(fila.agotado),
    activo: fila.activo === undefined ? true : Boolean(fila.activo),
  };
}

function aCategoria(fila: Fila): Category {
  return {
    slug: String(fila.slug ?? ""),
    nichoSlug: String(fila.nicho_slug ?? ""),
    nombre: String(fila.nombre ?? ""),
    orden: Number(fila.orden ?? 0),
    descripcion: (fila.descripcion as string) ?? null,
  };
}

function aNicho(fila: Fila): Niche {
  return {
    slug: String(fila.slug ?? ""),
    nombre: String(fila.nombre ?? ""),
    submarca: (fila.submarca as string) ?? null,
    descripcion: (fila.descripcion as string) ?? null,
    orden: Number(fila.orden ?? 0),
  };
}
