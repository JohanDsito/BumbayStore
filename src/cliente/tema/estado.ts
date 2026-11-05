import { TEMA } from "@/config/tema";

/**
 * Tema activo, para los componentes que lo necesitan en el código (el botón
 * y el campo de luz). La fuente de verdad es el atributo data-tema de <html>,
 * que pone el script del <head> antes de pintar; aquí solo se lee y se cambia.
 */

export type Tema = "claro" | "oscuro";

const oyentes = new Set<() => void>();

export function leer(): Tema {
  return document.documentElement.dataset.tema === "oscuro" ? "oscuro" : "claro";
}

/** En el servidor no se sabe: se dibuja el predeterminado y se corrige al hidratar. */
export function leerServidor(): Tema {
  return "claro";
}

export function suscribir(alCambiar: () => void): () => void {
  oyentes.add(alCambiar);
  return () => oyentes.delete(alCambiar);
}

export function fijar(tema: Tema) {
  const raiz = document.documentElement;
  if (tema === "oscuro") raiz.dataset.tema = "oscuro";
  else delete raiz.dataset.tema;
  try {
    localStorage.setItem(TEMA.clave, tema);
  } catch {
    // Sin almacenamiento (ventana privada): el tema dura hasta recargar.
  }
  for (const oyente of oyentes) oyente();
}
