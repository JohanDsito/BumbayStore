"use client";

import { useEffect } from "react";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { IconoWhatsApp } from "@/components/icons";
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO } from "@/components/botones";

/**
 * Cuando el catálogo no se pudo leer (Supabase no respondió ni al segundo
 * intento). Preferimos decirlo antes que mostrar productos de ejemplo como
 * si fueran reales: un cliente podría pedir algo que no existe.
 *
 * Solo lo ven las páginas que se arman en cada visita, como la búsqueda.
 * Las que ya estaban generadas siguen mostrando su última versión buena.
 */
export default function ErrorTienda({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[tienda]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6">
      <h1 className="titular text-[clamp(2.5rem,8vw,4.5rem)] text-carbon-50">
        El catálogo no cargó.
        <span className="block text-marca-500">Intenta de nuevo.</span>
      </h1>
      <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-carbon-300">
        No pudimos traer los productos en este momento. Suele resolverse en
        unos segundos; si no, escríbenos y te pasamos la lista de precios por
        WhatsApp.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => retry()} className={BOTON_PRINCIPAL}>
          Reintentar
        </button>
        <a
          href={enlaceGeneral("Hola, quisiera la lista de precios de Bumbay Store.")}
          target="_blank"
          rel="noopener noreferrer"
          className={BOTON_SECUNDARIO}
        >
          <IconoWhatsApp className="h-4 w-4" />
          Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}
