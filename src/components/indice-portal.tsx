"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import * as campo from "@/cliente/campo/estado";
import { IconoFlecha } from "@/components/icons";

export type EntradaIndice = {
  nombre: string;
  /** Línea corta debajo del nombre: "19 productos". */
  detalle: string;
  href: string;
};

/**
 * Índice de la portada: los nichos (o las categorías, en la portada de un
 * nicho) con su conteo.
 *
 * En la portada general cada entrada enciende su filamento del campo al
 * pasar el cursor o al enfocarla con el teclado: se ve qué línea es cuál
 * antes de entrar. `enciende` lo desactiva donde el campo es de un solo
 * color y no hay filamento propio que encender.
 */
export function IndicePortal({
  titulo,
  entradas,
  enciende,
}: {
  titulo: string;
  entradas: EntradaIndice[];
  enciende: boolean;
}) {
  return (
    <nav aria-label={titulo}>
      <h2 className="rotulo text-carbon-400">{titulo}</h2>
      <ul className="mt-4 border-t border-carbon-800">
        {entradas.map((e, i) => (
          <li key={e.href}>
            <Link
              href={e.href}
              onPointerEnter={enciende ? () => campo.enfocar(i) : undefined}
              onPointerLeave={enciende ? () => campo.enfocar(null) : undefined}
              onFocus={enciende ? () => campo.enfocar(i) : undefined}
              onBlur={enciende ? () => campo.enfocar(null) : undefined}
              className="group flex items-center justify-between gap-4 border-b border-carbon-800 py-3.5 transition-colors hover:border-carbon-600"
            >
              <span>
                <span className="block text-[15px] font-semibold text-carbon-100 transition-colors group-hover:text-carbon-50">
                  {e.nombre}
                </span>
                <span className="mt-0.5 block font-mono text-[11px] text-carbon-400">
                  {e.detalle}
                </span>
              </span>
              <IconoFlecha className="h-4 w-4 shrink-0 text-carbon-500 transition-[transform,color] duration-300 ease-[var(--ease-salida)] group-hover:translate-x-1 group-hover:text-marca-400" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Lectura del campo: dice qué está mostrando la luz. En la portada general
 * nombra el nicho resaltado; sin resaltado, la tienda entera.
 */
export function LecturaCampo({
  nombres,
  reposo,
}: {
  /** Nombre de cada nicho, en el orden de los filamentos. */
  nombres: string[];
  /** Lo que se lee cuando no hay ningún nicho resaltado. */
  reposo: string;
}) {
  const { foco } = useSyncExternalStore(campo.suscribir, campo.leer, campo.leer);
  const actual = foco !== null ? nombres[foco] : null;

  return (
    <p className="rotulo leading-relaxed text-carbon-300">
      <span className="flex items-center gap-2 text-carbon-400">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-marca-400" />
        Línea
      </span>
      <span className="mt-1.5 block text-carbon-50">{actual ?? reposo}</span>
    </p>
  );
}
