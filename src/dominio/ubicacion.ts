/**
 * Ubicación de entrega: departamento y municipio de Colombia.
 *
 * La lista oficial (Divipola del DANE) vive en src/data/municipios.ts. El
 * dominio no la importa: la recibe, así estas reglas se prueban con una lista
 * corta y no dependen de dónde se guarden los datos.
 */

/** Departamento → sus municipios, como la publica el DANE. */
export type Divipola = Readonly<Record<string, readonly string[]>>;

/** Quita tildes y pasa a minúscula, para que "narino" encuentre "Nariño". */
export function sinTildes(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** ¿El municipio existe y pertenece a ese departamento? */
export function ubicacionValida(
  departamento: string,
  municipio: string,
  divipola: Divipola,
): boolean {
  return divipola[departamento]?.includes(municipio) ?? false;
}

/**
 * Separa la ciudad que guardaba la versión anterior del formulario,
 * "Municipio, Departamento", para no pedirle de nuevo los datos a quien
 * vuelve. Devuelve null si no corresponde a un municipio real.
 */
export function separarCiudad(
  ciudad: string,
  divipola: Divipola,
): { departamento: string; municipio: string } | null {
  const corte = ciudad.lastIndexOf(",");
  if (corte === -1) return null;
  const municipio = ciudad.slice(0, corte).trim();
  const departamento = ciudad.slice(corte + 1).trim();
  return ubicacionValida(departamento, municipio, divipola)
    ? { departamento, municipio }
    : null;
}
