"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { DatoNicho } from "@/dominio/modelos";

/**
 * Lo que el panel lee y escribe de la estructura del catálogo: nichos y
 * categorías. Los componentes del panel llaman a estas funciones en vez de
 * armar consultas, así los nombres de tablas y columnas viven en un solo
 * lugar.
 *
 * Los permisos los pone la base (políticas `... escritura admin`): sin estar
 * en la tabla `admins`, cualquier escritura queda sin efecto.
 */

/** Un nicho tal como lo edita el panel, incluidos los apagados. */
export type NichoAdmin = {
  slug: string;
  nombre: string;
  submarca: string | null;
  titular: string | null;
  descripcion: string | null;
  datos: DatoNicho[];
  acento: string | null;
  orden: number;
  activo: boolean;
};

export type CategoriaAdmin = {
  slug: string;
  nicho_slug: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
};

type Resultado = { error: string | null };

export async function listarNichos(sb: SupabaseClient): Promise<NichoAdmin[]> {
  const { data, error } = await sb
    .from("nichos")
    .select("slug, nombre, submarca, titular, descripcion, datos, acento, orden, activo")
    .order("orden");
  if (error) throw new Error(error.message);
  return (data ?? []) as NichoAdmin[];
}

export async function listarCategorias(sb: SupabaseClient): Promise<CategoriaAdmin[]> {
  const { data, error } = await sb
    .from("categorias")
    .select("slug, nicho_slug, nombre, descripcion, orden")
    .order("orden");
  if (error) throw new Error(error.message);
  return (data ?? []) as CategoriaAdmin[];
}

/** Productos por categoría: para avisar antes de mover una categoría llena. */
export async function contarProductosPorCategoria(
  sb: SupabaseClient,
): Promise<Map<string, number>> {
  const { data, error } = await sb.from("productos").select("categoria_slug");
  if (error) throw new Error(error.message);
  const cuenta = new Map<string, number>();
  for (const fila of data ?? []) {
    const slug = fila.categoria_slug as string;
    cuenta.set(slug, (cuenta.get(slug) ?? 0) + 1);
  }
  return cuenta;
}

export async function crearNicho(
  sb: SupabaseClient,
  nicho: Pick<NichoAdmin, "slug" | "nombre" | "orden">,
): Promise<Resultado> {
  const { error } = await sb.from("nichos").insert({ ...nicho, activo: false });
  if (!error) return { error: null };
  return {
    error: /duplicate|unique/i.test(error.message)
      ? `Ya existe un nicho con la dirección "${nicho.slug}".`
      : error.message,
  };
}

/** El slug no se edita: es la dirección del nicho y cambiarla rompe enlaces. */
export async function guardarNicho(
  sb: SupabaseClient,
  slug: string,
  cambios: Omit<NichoAdmin, "slug">,
): Promise<Resultado> {
  const { data, error } = await sb
    .from("nichos")
    .update(cambios)
    .eq("slug", slug)
    .select("slug");
  return conPermiso(data, error);
}

export async function crearCategoria(
  sb: SupabaseClient,
  categoria: CategoriaAdmin,
): Promise<Resultado> {
  const { error } = await sb.from("categorias").insert(categoria);
  if (!error) return { error: null };
  return {
    error: /duplicate|unique/i.test(error.message)
      ? `Ya existe una categoría con la dirección "${categoria.slug}".`
      : error.message,
  };
}

export async function guardarCategoria(
  sb: SupabaseClient,
  slug: string,
  cambios: Omit<CategoriaAdmin, "slug">,
): Promise<Resultado> {
  const { data, error } = await sb
    .from("categorias")
    .update(cambios)
    .eq("slug", slug)
    .select("slug");
  return conPermiso(data, error);
}

/**
 * Sin permiso, la base no devuelve error: simplemente no modifica ninguna
 * fila. Hay que mirar el resultado para no decir "Guardado" en falso.
 */
function conPermiso(data: unknown[] | null, error: { message: string } | null): Resultado {
  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "No se guardó: esta cuenta no tiene permisos de escritura." };
  }
  return { error: null };
}

/**
 * Pide a Next que regenere la tienda. El catálogo está prerenderizado: sin
 * esto un cambio no se vería hasta la próxima publicación del sitio.
 * Si falla no se avisa: el cambio ya quedó guardado en la base.
 */
export async function pedirRegeneracion(sb: SupabaseClient): Promise<void> {
  const { data } = await sb.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return;
  await fetch("/api/revalidar", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  }).catch(() => undefined);
}
