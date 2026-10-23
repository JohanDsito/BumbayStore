import { site } from "@/config/sitio";
import { catalogo } from "@/servidor/catalogo";
import { imagenCompartir, TAMANO_COMPARTIR } from "@/servidor/imagen-compartir";

/** Imagen al compartir la portada de un nicho: su titular y su color. */
export const alt = `${site.nombre}: catálogo por línea`;
export const size = TAMANO_COMPARTIR;
export const contentType = "image/png";

export default async function Imagen({ params }: { params: Promise<{ nicho: string }> }) {
  const { nicho: slug } = await params;
  const nicho = await catalogo.nicho(slug);
  const esTaller = slug === site.nichoTaller;

  return imagenCompartir({
    titular: nicho?.titular ?? nicho?.nombre ?? site.nombre,
    acento: nicho?.acento ?? site.acento,
    rotulo: nicho ? `${nicho.submarca ?? nicho.nombre} · Envío a toda Colombia` : site.nombre,
    logoDe: esTaller ? "tools" : "store",
  });
}
