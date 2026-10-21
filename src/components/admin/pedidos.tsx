"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseSesion } from "@/infraestructura/supabase/sesion";
import { precio } from "@/dominio/formato";

type Linea = { sku: string; nombre: string; cantidad: number; precio: number };

type Pedido = {
  id: string;
  nombre: string;
  ciudad: string;
  comentario: string | null;
  total: number;
  unidades: number;
  lineas: Linea[];
  creado_en: string;
};

/** "hace 3 horas", "ayer", "12 sept" — más legible que una marca de tiempo. */
function cuando(iso: string): string {
  const d = new Date(iso);
  const minutos = Math.round((Date.now() - d.getTime()) / 60000);
  if (minutos < 1) return "ahora mismo";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.round(horas / 24);
  if (dias === 1) return "ayer";
  if (dias < 7) return `hace ${dias} días`;
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export function AdminPedidos() {
  const sb = getSupabaseSesion();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!sb) return;
    sb.from("pedidos")
      .select("*")
      .order("creado_en", { ascending: false })
      .limit(200)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setPedidos((data ?? []) as Pedido[]);
        setCargando(false);
      });
  }, [sb]);

  useEffect(cargar, [cargar]);

  if (cargando) {
    return <p className="py-16 text-center font-mono text-xs text-carbon-500">Cargando pedidos…</p>;
  }
  if (error) {
    return <p className="py-16 text-center text-[13px] text-marca-400">{error}</p>;
  }

  if (pedidos.length === 0) {
    return (
      <div className="border border-dashed border-carbon-700 px-6 py-16 text-center">
        <p className="text-[14px] text-carbon-300">Todavía no hay pedidos registrados.</p>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-carbon-500">
          Cada vez que alguien pulse “Enviar pedido por WhatsApp” quedará aquí,
          aunque después no llegue a escribirte.
        </p>
      </div>
    );
  }

  const hoy = new Date().toDateString();
  const deHoy = pedidos.filter((p) => new Date(p.creado_en).toDateString() === hoy);
  const suma = pedidos.reduce((t, p) => t + p.total, 0);

  // Qué ciudades piden más: sirve para negociar tarifas de envío por zona.
  const porCiudad = new Map<string, number>();
  for (const p of pedidos) porCiudad.set(p.ciudad, (porCiudad.get(p.ciudad) ?? 0) + 1);
  const ciudades = [...porCiudad.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <div className="mb-5 grid gap-px bg-carbon-800 sm:grid-cols-3">
        <Dato titulo="Pedidos registrados" valor={String(pedidos.length)} />
        <Dato titulo="Hoy" valor={String(deHoy.length)} />
        <Dato titulo="Valor acumulado" valor={precio(suma)} />
      </div>

      {ciudades.length > 1 && (
        <div className="mb-5 border border-carbon-800 bg-carbon-900 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
            Ciudades que más piden
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ciudades.map(([ciudad, n]) => (
              <li
                key={ciudad}
                className="border border-carbon-700 px-3 py-1.5 text-[12px] text-carbon-200"
              >
                {ciudad}
                <span className="ml-2 font-mono text-[11px] text-marca-400">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="space-y-2">
        {pedidos.map((p) => (
          <li key={p.id} className="border border-carbon-800 bg-carbon-900 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="text-[14px] font-semibold text-carbon-50">{p.nombre}</p>
                <p className="mt-0.5 font-mono text-[11px] text-marca-400">{p.ciudad}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[15px] font-bold text-carbon-50">
                  {precio(p.total)}
                </p>
                <p className="font-mono text-[10px] text-carbon-500">{cuando(p.creado_en)}</p>
              </div>
            </div>

            <ul className="mt-3 space-y-1 border-t border-carbon-850 pt-3">
              {p.lineas.map((l, i) => (
                <li key={`${l.sku}-${i}`} className="flex justify-between gap-3 text-[13px]">
                  <span className="min-w-0 text-carbon-300">
                    <span className="font-mono text-marca-400">{l.cantidad}×</span>{" "}
                    {l.nombre}
                  </span>
                  <span className="shrink-0 font-mono text-[12px] text-carbon-500">
                    {precio(l.precio * l.cantidad)}
                  </span>
                </li>
              ))}
            </ul>

            {p.comentario && (
              <p className="mt-3 border-l-2 border-carbon-700 pl-3 text-[13px] italic leading-relaxed text-carbon-400">
                {p.comentario}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="bg-carbon-900 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
        {titulo}
      </p>
      <p className="mt-1.5 font-mono text-xl font-bold text-carbon-50">{valor}</p>
    </div>
  );
}
