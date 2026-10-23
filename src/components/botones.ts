/**
 * Clases de los botones del sistema, para usarlas igual en componentes del
 * servidor y del navegador sin arrastrar otros módulos.
 */

/** Botón principal: el color del nicho con el brillo del campo en el borde. */
export const BOTON_PRINCIPAL =
  "rotulo inline-flex h-12 items-center justify-center gap-3 border border-marca-300/40 bg-marca-500 px-7 text-sobre-marca shadow-brillo transition-[background-color,transform] duration-200 hover:bg-marca-400 active:scale-[0.98]";

/** Botón secundario: borde fino sobre vidrio; se enciende en verde si lleva a WhatsApp. */
export const BOTON_SECUNDARIO =
  "rotulo inline-flex h-12 items-center justify-center gap-3 border border-carbon-600 bg-carbon-950/40 px-7 text-carbon-100 transition-colors duration-200 hover:border-disponible hover:text-disponible";
