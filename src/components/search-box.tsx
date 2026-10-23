"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { IconoBuscar } from "@/components/icons";

/**
 * Buscador del header. Navega a /buscar?q=… para que el resultado sea una
 * URL compartible y renderizada en el servidor.
 *
 * El campo va sin estado propio: la URL es la única fuente de verdad. El
 * `key` remonta el input cuando cambia la consulta, así el texto se mantiene
 * al día sin necesidad de sincronizarlo con un efecto.
 */
export function Buscador({ className = "" }: { className?: string }) {
  const router = useRouter();
  const consulta = useSearchParams().get("q") ?? "";

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
      }}
      className={`relative ${className}`}
    >
      <IconoBuscar
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-carbon-500"
        aria-hidden
      />
      <input
        key={consulta}
        type="search"
        name="q"
        defaultValue={consulta}
        placeholder="Buscar producto o código…"
        aria-label="Buscar productos"
        className="h-11 w-full border border-carbon-700 bg-carbon-950/60 pl-9 pr-3 text-[13px] text-carbon-100 transition-colors placeholder:text-carbon-400 focus:border-marca-400 focus:outline-none"
      />
    </form>
  );
}
