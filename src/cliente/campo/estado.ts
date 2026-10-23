/**
 * Estado del campo de luz que respira detrás de la tienda.
 *
 * Vive fuera de React, como el pedido: el campo está en el layout y las
 * páginas solo le avisan qué mostrar. Así el campo no se vuelve a crear al
 * navegar, y puede pasar de un color a otro en lugar de parpadear.
 */

export type EstadoCampo = {
  /** Color de la página actual (un nicho). null en la portada general. */
  acento: string | null;
  /** Filamento resaltado en la portada general, por índice de nicho. */
  foco: number | null;
  /** 1 en las portadas; menos donde hay texto largo encima. */
  intensidad: number;
};

const INICIAL: EstadoCampo = { acento: null, foco: null, intensidad: 1 };

let estado = INICIAL;
const oyentes = new Set<() => void>();

function fijar(cambio: Partial<EstadoCampo>) {
  estado = { ...estado, ...cambio };
  for (const oyente of oyentes) oyente();
}

export function suscribir(alCambiar: () => void): () => void {
  oyentes.add(alCambiar);
  return () => oyentes.delete(alCambiar);
}

export function leer(): EstadoCampo {
  return estado;
}

/** Lo que pide una página al montarse. Al desmontarse vuelve al inicial. */
export function pedir(cambio: Pick<EstadoCampo, "acento" | "intensidad">): () => void {
  fijar({ ...cambio, foco: null });
  return () => fijar(INICIAL);
}

export function enfocar(indice: number | null) {
  if (estado.foco !== indice) fijar({ foco: indice });
}
