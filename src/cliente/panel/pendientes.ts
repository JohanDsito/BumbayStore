"use client";

import { useEffect, useId } from "react";

/**
 * Formularios del panel con cambios sin guardar.
 *
 * Cada ficha avisa aquí si está "sucia". Con eso el panel pregunta antes de
 * cambiar de pestaña (que desmonta los formularios) y el navegador antes de
 * cerrar o recargar la página: lo escrito no se pierde sin aviso.
 */

const sucios = new Set<string>();

function alSalir(e: BeforeUnloadEvent) {
  if (sucios.size === 0) return;
  e.preventDefault();
  // Algunos navegadores todavía exigen esto para mostrar el aviso.
  e.returnValue = "";
}

export function hayCambiosSinGuardar(): boolean {
  return sucios.size > 0;
}

/** Registra si este formulario tiene cambios sin guardar. */
export function useCambiosSinGuardar(sucio: boolean) {
  const id = useId();
  useEffect(() => {
    if (!sucio) return;
    sucios.add(id);
    if (sucios.size === 1) window.addEventListener("beforeunload", alSalir);
    return () => {
      sucios.delete(id);
      if (sucios.size === 0) window.removeEventListener("beforeunload", alSalir);
    };
  }, [id, sucio]);
}
