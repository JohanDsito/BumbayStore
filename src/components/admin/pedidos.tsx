"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseSesion } from "@/infraestructura/supabase/sesion";
import { precio } from "@/dominio/formato";
import { FORMAS_PAGO, formatearCelular, nombreFormaPago } from "@/dominio/pedido";
import { separarCiudad } from "@/dominio/ubicacion";
import { municipiosPorDepartamento } from "@/data/municipios";

type Linea = { sku: string; nombre: string; cantidad: number; precio: number };

/** Los campos nuevos llegan vacíos en los pedidos anteriores a noviembre de 2026. */
type Pedido = {
  id: string;
  nombre: string;
  apellido: string | null;
  celular: string | null;
  departamento: string | null;
  municipio: string | null;
  forma_pago: string | null;
  /** Solo pedidos anteriores: "Municipio, Departamento". */
  ciudad: string | null;
  comentario: string | null;
  total: number;
  unidades: number;
  lineas: Linea[];
  creado_en: string;
};

/** Departamento y municipio del pedido, leyendo también los pedidos anteriores. */
function zona(p: Pedido): { departamento: string; municipio: string } | null {
  if (p.departamento && p.municipio) {
    return { departamento: p.departamento, municipio: p.municipio };
  }
  return p.ciudad ? separarCiudad(p.ciudad, municipiosPorDepartamento) : null;
}

const SIN_DATO = "Sin dato";

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
  const [pago, setPago] = useState("");
  const [departamento, setDepartamento] = useState("");

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

  // Los departamentos del filtro son los que tienen pedidos, no los 33.
  const departamentos = [
    ...new Set(pedidos.map((p) => zona(p)?.departamento ?? SIN_DATO)),
  ].sort((a, b) => a.localeCompare(b, "es"));

  const visibles = pedidos.filter(
    (p) =>
      (!pago || (p.forma_pago ?? "") === pago) &&
      (!departamento || (zona(p)?.departamento ?? SIN_DATO) === departamento),
  );

  const hoy = new Date().toDateString();
  const deHoy = visibles.filter((p) => new Date(p.creado_en).toDateString() === hoy);
  const suma = visibles.reduce((t, p) => t + p.total, 0);

  // Qué zonas piden más: sirve para negociar tarifas de envío. Con un
  // departamento elegido, se ve por municipio dentro de él.
  const porZona = new Map<string, number>();
  for (const p of visibles) {
    const z = zona(p);
    const clave = departamento ? (z?.municipio ?? SIN_DATO) : (z?.departamento ?? SIN_DATO);
    porZona.set(clave, (porZona.get(clave) ?? 0) + 1);
  }
  const zonas = [...porZona.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <Filtro
          etiqueta="Forma de pago"
          valor={pago}
          alCambiar={setPago}
          opciones={[
            { valor: "", texto: "Todas" },
            ...FORMAS_PAGO.map((f) => ({ valor: f.id, texto: f.nombre })),
          ]}
        />
        <Filtro
          etiqueta="Departamento"
          valor={departamento}
          alCambiar={setDepartamento}
          opciones={[
            { valor: "", texto: "Todos" },
            ...departamentos.map((d) => ({ valor: d, texto: d })),
          ]}
        />
      </div>

      <div className="mb-5 grid gap-px bg-carbon-800 sm:grid-cols-3">
        <Dato titulo="Pedidos registrados" valor={String(visibles.length)} />
        <Dato titulo="Hoy" valor={String(deHoy.length)} />
        <Dato titulo="Valor acumulado" valor={precio(suma)} />
      </div>

      {zonas.length > 1 && (
        <div className="mb-5 border border-carbon-800 bg-carbon-900 p-4">
          <p className="rotulo text-[10px] text-carbon-500">
            {departamento ? `Municipios que más piden en ${departamento}` : "Departamentos que más piden"}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {zonas.map(([nombre, n]) => (
              <li
                key={nombre}
                className="border border-carbon-700 px-3 py-1.5 text-[12px] text-carbon-200"
              >
                {nombre}
                <span className="ml-2 font-mono text-[11px] text-marca-400">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {visibles.length === 0 && (
        <p className="border border-dashed border-carbon-700 p-6 text-center text-[13px] text-carbon-400">
          Ningún pedido con esos filtros.
        </p>
      )}

      <ul className="space-y-2">
        {visibles.map((p) => {
          const z = zona(p);
          return (
            <li key={p.id} className="border border-carbon-800 bg-carbon-900 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-carbon-50">
                    {p.nombre} {p.apellido}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-marca-400">
                    {z ? `${z.municipio}, ${z.departamento}` : (p.ciudad ?? SIN_DATO)}
                  </p>
                  {(p.celular || p.forma_pago) && (
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-carbon-300">
                      {p.celular && (
                        <a href={`tel:+57${p.celular}`} className="hover:text-carbon-50">
                          {formatearCelular(p.celular)}
                        </a>
                      )}
                      {p.forma_pago && <span>{nombreFormaPago(p.forma_pago)}</span>}
                    </p>
                  )}
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
          );
        })}
      </ul>
    </div>
  );
}

function Filtro({
  etiqueta,
  valor,
  alCambiar,
  opciones,
}: {
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  opciones: { valor: string; texto: string }[];
}) {
  return (
    <label className="block">
      <span className="rotulo text-[10px] text-carbon-500">{etiqueta}</span>
      <select
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        className="mt-1.5 h-11 w-full border border-carbon-700 bg-carbon-850 px-3 text-[13px] text-carbon-100 focus:border-marca-500 focus:outline-none"
      >
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </label>
  );
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="bg-carbon-900 p-4">
      <p className="rotulo text-[10px] text-carbon-500">
        {titulo}
      </p>
      <p className="mt-1.5 font-mono text-xl font-bold text-carbon-50">{valor}</p>
    </div>
  );
}
