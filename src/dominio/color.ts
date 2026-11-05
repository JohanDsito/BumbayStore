/**
 * Reglas de color que no dependen del diseño: qué tinta se lee sobre un
 * color de acento, y cuánto hay que ajustar un acento para leerlo como texto.
 * Todo con la luminancia relativa y el contraste de WCAG 2.
 */

type Rgb = [number, number, number];

const TINTA_OSCURA = "#0b0c12";

function aRgb(hex: string): Rgb | null {
  const limpio = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(limpio)) return null;
  const n = Number.parseInt(limpio, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function aHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function luminancia([r, g, b]: Rgb): number {
  const canal = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function contrasteRgb(a: Rgb, b: Rgb): number {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (oscuro + 0.05);
}

/** Contraste WCAG entre dos colores (1 a 21). 1 si alguno no se entiende. */
export function contraste(a: string, b: string): number {
  const x = aRgb(a);
  const y = aRgb(b);
  return x && y ? contrasteRgb(x, y) : 1;
}

/**
 * Tinta para el texto sobre un fondo del color dado: oscura sobre colores
 * claros (un ámbar), blanca sobre los oscuros (un rojo o un azul). Elige la
 * que más contraste da.
 */
export function tintaSobre(hex: string): "#ffffff" | "#0b0c12" {
  const color = aRgb(hex);
  if (!color) return "#ffffff";
  return contrasteRgb(color, [11, 12, 18]) > contrasteRgb(color, [255, 255, 255])
    ? TINTA_OSCURA
    : "#ffffff";
}

/**
 * El acento como color de texto sobre `fondo`: el mismo color si ya se lee,
 * o mezclado hacia el negro (fondo claro) o el blanco (fondo oscuro) lo justo
 * para llegar al contraste pedido. Así el turquesa sigue siendo turquesa en
 * modo oscuro y se oscurece apenas lo necesario en modo claro.
 *
 * `minimo` es 4,5 para texto normal (WCAG AA) y 3 para texto grande.
 */
export function acentoLegible(acento: string, fondo: string, minimo = 4.5): string {
  const base = aRgb(acento);
  const f = aRgb(fondo);
  if (!base || !f) return acento;
  const destino: Rgb = luminancia(f) > 0.18 ? [0, 0, 0] : [255, 255, 255];
  for (let paso = 0; paso <= 50; paso++) {
    const t = paso / 50;
    const mezcla = aHex([0, 1, 2].map((i) => base[i] + (destino[i] - base[i]) * t) as Rgb);
    // Se mide ya redondeado a hex: es el color que de verdad se pinta.
    if (contraste(mezcla, fondo) >= minimo) return mezcla;
  }
  return aHex(destino);
}
