import type { FuenteCatalogo } from "@/aplicacion/puertos";

/**
 * Una fuente que, si falla, cae a otra.
 *
 * Cada consulta se intenta primero en la principal; si lanza un error, se
 * registra en el log del servidor y se responde con la de respaldo. Así una
 * caída de la base de datos degrada el catálogo en vez de tumbar la tienda.
 */
export function conRespaldo(
  principal: FuenteCatalogo,
  respaldo: FuenteCatalogo,
): FuenteCatalogo {
  const intentar =
    <T>(consulta: string, a: () => Promise<T>, b: () => Promise<T>) =>
    () =>
      a().catch((error: unknown) => {
        const motivo = error instanceof Error ? error.message : String(error);
        console.error(`[catalogo] ${consulta} falló, usando el respaldo:`, motivo);
        return b();
      });

  return {
    productos: intentar(
      "productos",
      () => principal.productos(),
      () => respaldo.productos(),
    ),
    categorias: intentar(
      "categorias",
      () => principal.categorias(),
      () => respaldo.categorias(),
    ),
    nichos: intentar(
      "nichos",
      () => principal.nichos(),
      () => respaldo.nichos(),
    ),
  };
}
