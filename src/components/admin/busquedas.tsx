"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getSupabaseSesion } from "@/lib/supabase-sesion";

type Busqueda = { consulta: string; resultados: number; creado_en: string };

type Agrupada = { consulta: string; veces: number; ultima: string };

export function AdminBusquedas() {
  const sb = getSupabaseSesion();
  const [filas, setFilas] = useState<Busqueda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!sb) return;
    sb.from("busquedas")
      .select("consulta, resultados, creado_en")
      .order("creado_en", { ascending: false })
      .limit(1000)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setFilas((data ?? []) as Busqueda[]);
        setCargando(false);
      });
  }, [sb]);

  useEffect(cargar, [cargar]);

  // Se agrupa aquí y no en la base: son como mucho mil filas y así no hace
  // falta una vista ni una función en Postgres.
  const { vacias, conResultado } = useMemo(() => {
    const juntar = (lista: Busqueda[]): Agrupada[] => {
      const mapa = new Map<string, Agrupada>();
      for (const f of lista) {
        const clave = f.consulta.toLowerCase();
        const previo = mapa.get(clave);
        if (previo) previo.veces++;
        else mapa.set(clave, { consulta: f.consulta, veces: 1, ultima: f.creado_en });
      }
      return [...mapa.values()].sort((a, b) => b.veces - a.veces);
    };
    return {
      vacias: juntar(filas.filter((f) => f.resultados === 0)),
      conResultado: juntar(filas.filter((f) => f.resultados > 0)),
    };
  }, [filas]);

  if (cargando) {
    return <p className="py-16 text-center font-mono text-xs text-carbon-500">Cargando búsquedas…</p>;
  }
  if (error) {
    return <p className="py-16 text-center text-[13px] text-marca-400">{error}</p>;
  }

  if (filas.length === 0) {
    return (
      <div className="border border-dashed border-carbon-700 px-6 py-16 text-center">
        <p className="text-[14px] text-carbon-300">Nadie ha usado el buscador todavía.</p>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-carbon-500">
          Cuando empiecen, aquí verás sobre todo lo que buscan y no encuentran:
          eso te dice qué conviene traer en la próxima importación.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section>
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-marca-400">
          Buscaron y no encontraron
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-carbon-500">
          Demanda que se está yendo con las manos vacías. Es lo más accionable
          de esta pantalla.
        </p>

        {vacias.length === 0 ? (
          <p className="mt-4 border border-dashed border-carbon-700 p-6 text-center text-[13px] text-carbon-400">
            Todas las búsquedas encontraron algo.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-carbon-800 border border-carbon-800 bg-carbon-900">
            {vacias.map((b) => (
              <li key={b.consulta} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="min-w-0 truncate text-[14px] text-carbon-100">
                  {b.consulta}
                </span>
                <span className="shrink-0 font-mono text-[12px] text-marca-400">
                  {b.veces} {b.veces === 1 ? "vez" : "veces"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-carbon-500">
          Lo que sí encuentran
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-carbon-500">
          Útil para saber qué productos conviene destacar en la portada.
        </p>

        {conResultado.length === 0 ? (
          <p className="mt-4 border border-dashed border-carbon-700 p-6 text-center text-[13px] text-carbon-400">
            Ninguna búsqueda con resultados todavía.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-carbon-800 border border-carbon-800 bg-carbon-900">
            {conResultado.slice(0, 30).map((b) => (
              <li key={b.consulta} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="min-w-0 truncate text-[14px] text-carbon-300">
                  {b.consulta}
                </span>
                <span className="shrink-0 font-mono text-[12px] text-carbon-500">
                  {b.veces}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
