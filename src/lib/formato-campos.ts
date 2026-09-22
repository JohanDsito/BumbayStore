import type { Spec, Faq } from "@/lib/types";

/**
 * Conversión entre los campos estructurados y el texto plano que se edita en
 * el panel.
 *
 * Se usa el mismo formato del CSV de importación —separadores `|` y `::`— en
 * vez de inventar otro: así lo que se escribe en el panel y lo que se escribe
 * en Excel se leen igual, y no hay dos convenciones que recordar.
 */

const SEP = " | ";

export function listaATexto(items: readonly string[]): string {
  return items.join(SEP);
}

export function textoALista(texto: string): string[] {
  return texto
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function especificacionesATexto(specs: readonly Spec[]): string {
  return specs.map((e) => `${e.label}: ${e.valor}`).join(SEP);
}

export function textoAEspecificaciones(texto: string): Spec[] {
  return textoALista(texto)
    .map((par) => {
      const i = par.indexOf(":");
      if (i === -1) return null;
      const label = par.slice(0, i).trim();
      const valor = par.slice(i + 1).trim();
      return label && valor ? { label, valor } : null;
    })
    .filter((x): x is Spec => x !== null);
}

export function faqATexto(faq: readonly Faq[]): string {
  return faq.map((f) => `${f.pregunta}:: ${f.respuesta}`).join(SEP);
}

export function textoAFaq(texto: string): Faq[] {
  return textoALista(texto)
    .map((par) => {
      const i = par.indexOf("::");
      if (i === -1) return null;
      const pregunta = par.slice(0, i).trim();
      const respuesta = par.slice(i + 2).trim();
      return pregunta && respuesta ? { pregunta, respuesta } : null;
    })
    .filter((x): x is Faq => x !== null);
}

/**
 * Nombre del recorte cuadrado que acompaña a cada imagen.
 * `pulidora-3.webp` -> `pulidora-3-mini.webp`
 */
export function nombreMiniatura(imagen: string): string {
  return imagen.replace(/\.webp$/i, "-mini.webp");
}
