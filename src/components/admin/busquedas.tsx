"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getSupabaseSesion } from "@/infraestructura/supabase/sesion";
import { mensajeDeError } from "@/infraestructura/supabase/errores";

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
        if (error) setError(mensajeDeError(error, "cargar las búsquedas"));
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
    return <p className="py-16 text-center font-mono text-xs text-tinta-tenue">Cargando búsquedas…</p>;
  }
  if (error) {
    return <p className="py-16 text-center text-[13px] text-acento-texto">{error}</p>;
  }

  if (filas.length === 0) {
    return (
      <div className="border border-dashed border-borde px-6 py-16 text-center">
        <p className="text-[14px] text-tinta-media">Nadie ha usado el buscador todavía.</p>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-tinta-tenue">
          Cuando empiecen, aquí verás sobre todo lo que buscan y no encuentran:
          eso te dice qué conviene traer en la próxima importación.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section>
        <h2 className="rotulo text-[10px] text-acento-texto">
          Buscaron y no encontraron
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-tinta-tenue">
          Demanda que se está yendo con las manos vacías. Es lo más accionable
          de esta pantalla.
        </p>

        {vacias.length === 0 ? (
          <p className="mt-4 border border-dashed border-borde p-6 text-center text-[13px] text-tinta-suave">
            Todas las búsquedas encontraron algo.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-linea border border-linea bg-superficie">
            {vacias.map((b) => (
              <li key={b.consulta} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="min-w-0 truncate text-[14px] text-tinta">
                  {b.consulta}
                </span>
                <span className="shrink-0 font-mono text-[12px] text-acento-texto">
                  {b.veces} {b.veces === 1 ? "vez" : "veces"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="rotulo text-[10px] text-tinta-tenue">
          Lo que sí encuentran
        </h2>
        <p className="mt-1.5 text-[12px] leading-relaxed text-tinta-tenue">
          Útil para saber qué productos conviene destacar en la portada.
        </p>

        {conResultado.length === 0 ? (
          <p className="mt-4 border border-dashed border-borde p-6 text-center text-[13px] text-tinta-suave">
            Ninguna búsqueda con resultados todavía.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-linea border border-linea bg-superficie">
            {conResultado.slice(0, 30).map((b) => (
              <li key={b.consulta} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="min-w-0 truncate text-[14px] text-tinta-media">
                  {b.consulta}
                </span>
                <span className="shrink-0 font-mono text-[12px] text-tinta-tenue">
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
