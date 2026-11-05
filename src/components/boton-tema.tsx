"use client";

import { useSyncExternalStore } from "react";
import * as tema from "@/cliente/tema/estado";
import { IconoLuna, IconoSol } from "@/components/icons";

/**
 * Cambia entre el modo claro y el oscuro. Muestra el ícono del modo al que
 * lleva: luna en el claro, sol en el oscuro.
 */
export function BotonTema({ className = "" }: { className?: string }) {
  const actual = useSyncExternalStore(tema.suscribir, tema.leer, tema.leerServidor);
  const otro = actual === "claro" ? "oscuro" : "claro";

  return (
    <button
      type="button"
      onClick={() => tema.fijar(otro)}
      aria-label={`Cambiar a modo ${otro}`}
      title={`Modo ${otro}`}
      className={`flex h-11 w-11 items-center justify-center text-tinta-media transition-colors hover:text-tinta-fuerte ${className}`}
    >
      {actual === "claro" ? <IconoLuna className="h-5 w-5" /> : <IconoSol className="h-5 w-5" />}
    </button>
  );
}
