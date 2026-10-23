/**
 * Reglas de color que no dependen del diseño: qué tinta se lee sobre un
 * color de acento.
 */

/**
 * Tinta para el texto sobre un fondo del color dado: oscura sobre colores
 * claros (un ámbar), blanca sobre los oscuros (un rojo o un azul). Usa la
 * luminancia relativa de WCAG y elige la que más contraste da.
 */
export function tintaSobre(hex: string): "#ffffff" | "#0b0c12" {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return "#ffffff";
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const l =
    0.2126 * canal((n >> 16) & 255) + 0.7152 * canal((n >> 8) & 255) + 0.0722 * canal(n & 255);
  const contraBlanco = 1.05 / (l + 0.05);
  const contraOscuro = (l + 0.05) / (0.0046 + 0.05);
  return contraOscuro > contraBlanco ? "#0b0c12" : "#ffffff";
}
