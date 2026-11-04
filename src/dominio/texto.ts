/**
 * Acorta un texto sin partir palabras: corta en el último espacio antes del
 * límite y agrega "…". Si ya cabe, lo devuelve igual.
 */
export function resumir(texto: string, limite: number): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= limite) return limpio;
  const corte = limpio.lastIndexOf(" ", limite);
  const base = (corte > limite * 0.6 ? limpio.slice(0, corte) : limpio.slice(0, limite)).trim();
  return `${base.replace(/[\s,.;:·—-]+$/, "")}…`;
}
