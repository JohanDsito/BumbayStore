import { acentoLegible, tintaSobre } from "@/dominio/color";

/**
 * Temas de la tienda y del panel. El claro es el predeterminado; el oscuro se
 * elige con el botón de la cabecera y se recuerda en el navegador.
 *
 * Los colores de cada tema viven en src/app/globals.css (variables --t-*).
 * Los de aquí son los pocos que hace falta saber también en el código, y
 * deben coincidir con esos.
 */
export const TEMA = {
  /** Dónde se guarda la elección en localStorage. */
  clave: "bumbay:tema",
  /**
   * Fondo de referencia para el texto de acento en cada tema: un punto más
   * exigente que la superficie más oscura del claro (--t-linea) y que la más
   * clara del oscuro, para que el acento también se lea sobre los paneles
   * translúcidos que dejan ver el campo de luz.
   */
  fondoTexto: { claro: "#dfe2e9", oscuro: "#262a3a" },
  /** Color de la barra del navegador en el celular: --t-fondo de cada tema. */
  barra: { claro: "#f4f5f8", oscuro: "#07080d" },
} as const;

/**
 * Variables CSS de un acento: el color, su tinta encima y su versión de texto
 * para cada tema. Las usan la raíz (turquesa de la tienda) y ContextoNicho.
 */
export function variablesAcento(acento: string): Record<string, string> {
  return {
    "--acento": acento,
    "--acento-tinta": tintaSobre(acento),
    "--acento-texto-claro": acentoLegible(acento, TEMA.fondoTexto.claro),
    "--acento-texto-oscuro": acentoLegible(acento, TEMA.fondoTexto.oscuro),
  };
}

/**
 * Corre en el <head> antes de pintar: si el visitante eligió el modo oscuro,
 * lo pone antes del primer cuadro y no hay parpadeo del tema claro.
 */
export const SCRIPT_TEMA = `try{if(localStorage.getItem(${JSON.stringify(TEMA.clave)})==="oscuro")document.documentElement.dataset.tema="oscuro"}catch(e){}`;
