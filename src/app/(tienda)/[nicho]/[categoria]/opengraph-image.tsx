import { site } from "@/config/sitio";
import { catalogo } from "@/servidor/catalogo";
import { imagenCompartir, TAMANO_COMPARTIR } from "@/servidor/imagen-compartir";

/**
 * Imagen al compartir una categoría: su nombre, con el color y el logo de su
 * nicho. Hace falta una propia porque la página declara sus datos para redes
 * y con eso deja de heredar la imagen de la tienda.
 */
export const alt = `${site.nombre}: categoría del catálogo`;
export const size = TAMANO_COMPARTIR;
export const contentType = "image/png";

export default async function Imagen({
  params,
}: {
  params: Promise<{ nicho: string; categoria: string }>;
}) {
  const { nicho: nichoSlug, categoria: slug } = await params;
  const [nicho, categoria] = await Promise.all([
    catalogo.nicho(nichoSlug),
    catalogo.categoria(slug),
  ]);

  return imagenCompartir({
    titular: categoria ? `${categoria.nombre}\nPrecio de distribuidor.` : site.nombre,
    acento: nicho?.acento ?? site.acento,
    rotulo: `${nicho?.submarca ?? nicho?.nombre ?? site.nombre} · Envío a toda Colombia`,
    logoDe: nichoSlug === site.nichoTaller ? "tools" : "store",
  });
}
