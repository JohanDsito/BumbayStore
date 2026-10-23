"use client";

import { useEffect, useRef } from "react";
import { registrarBusqueda } from "@/infraestructura/supabase/registro";

/**
 * Deja constancia de una búsqueda, una sola vez por consulta.
 *
 * Va en el cliente y no en el servidor porque la página de resultados se
 * renderiza en cada visita, incluidas las de los rastreadores: registrar ahí
 * llenaría la tabla de ruido que nadie escribió.
 *
 * No pinta nada.
 */
export function RegistrarBusqueda({
  consulta,
  resultados,
}: {
  consulta: string;
  resultados: number;
}) {
  // React puede montar un efecto dos veces en desarrollo, y el cliente puede
  // volver atrás y adelante sobre la misma búsqueda. Se recuerda lo ya
  // registrado para no contar la misma consulta varias veces.
  const registradas = useRef(new Set<string>());

  useEffect(() => {
    const clave = consulta.trim().toLowerCase();
    if (!clave || registradas.current.has(clave)) return;
    registradas.current.add(clave);
    void registrarBusqueda(consulta, resultados);
  }, [consulta, resultados]);

  return null;
}
