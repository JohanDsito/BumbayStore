import { site } from "@/config/sitio";
import { imagenCompartir, TAMANO_COMPARTIR } from "@/servidor/imagen-compartir";

/** Imagen al compartir la portada (y las páginas que no tengan la suya). */
export const alt = `${site.nombre}: importamos directo y enviamos a toda Colombia`;
export const size = TAMANO_COMPARTIR;
export const contentType = "image/png";

export default async function Imagen() {
  return imagenCompartir({
    titular: "Importamos directo.\nEnviamos a toda Colombia.",
    acento: site.acento,
    rotulo: "Un solo precio · Pedido por WhatsApp",
    logoDe: "store",
  });
}
