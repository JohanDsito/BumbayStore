"use client";

import { useState, useMemo, useRef, useEffect, useId } from "react";
import { municipiosPorDepartamento } from "@/data/municipios";
import { sinTildes, ubicacionValida } from "@/dominio/ubicacion";

/** Los 33 departamentos en orden alfabético del español ("Córdoba" antes de "Cundinamarca"). */
const DEPARTAMENTOS = Object.keys(municipiosPorDepartamento).sort((a, b) =>
  a.localeCompare(b, "es"),
);

/** Municipios de un departamento con su forma buscable, calculada una vez. */
const INDICE = new Map(
  Object.entries(municipiosPorDepartamento).map(([departamento, lista]) => [
    departamento,
    lista.map((nombre) => ({ nombre, buscable: sinTildes(nombre) })),
  ]),
);

function buscar(departamento: string, consulta: string) {
  const lista = INDICE.get(departamento) ?? [];
  const q = sinTildes(consulta);
  // Sin nada escrito se muestra el departamento entero: son 125 como mucho
  // (Antioquia), y en los pequeños se elige sin teclear.
  if (!q) return lista;
  return lista
    .filter((m) => m.buscable.includes(q))
    .sort((a, b) => Number(b.buscable.startsWith(q)) - Number(a.buscable.startsWith(q)));
}

const CLASE_CAMPO =
  "mt-2 h-11 w-full border px-3 text-[14px] text-carbon-100 placeholder:text-carbon-500 focus:border-marca-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
const CLASE_NORMAL = "border-carbon-700 bg-carbon-850";
const CLASE_ERROR = "border-marca-500 bg-marca-500/[0.10]";

type Props = {
  departamento: string;
  municipio: string;
  alCambiar: (campo: "departamento" | "municipio", valor: string) => void;
  errores: { departamento: string | null; municipio: string | null };
};

/**
 * Departamento y ciudad o municipio, encadenados, sobre la lista del DANE.
 *
 * El departamento es una lista nativa: son 33 y el celular la muestra con su
 * propio selector, cómodo con el pulgar. El municipio se habilita después y
 * busca solo dentro de ese departamento, sin tildes, así "pasto" encuentra
 * "Pasto" y no hay que recorrer 1.122 nombres.
 */
export function CampoUbicacion({ departamento, municipio, alCambiar, errores }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [resaltado, setResaltado] = useState(0);
  const contenedor = useRef<HTMLDivElement>(null);
  const idLista = useId();

  const elegido = ubicacionValida(departamento, municipio, municipiosPorDepartamento);
  const sugerencias = useMemo(
    () => (elegido ? [] : buscar(departamento, municipio)),
    [departamento, municipio, elegido],
  );
  const visible = abierto && sugerencias.length > 0;

  // Cerrar al tocar fuera del campo.
  useEffect(() => {
    if (!visible) return;
    const alTocar = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener("mousedown", alTocar);
    return () => document.removeEventListener("mousedown", alTocar);
  }, [visible]);

  const elegir = (nombre: string) => {
    alCambiar("municipio", nombre);
    setAbierto(false);
    setResaltado(0);
  };

  const alTeclear = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setAbierto(false);
      return;
    }
    if (!visible) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setResaltado((i) => (i + 1) % sugerencias.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setResaltado((i) => (i - 1 + sugerencias.length) % sugerencias.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      elegir(sugerencias[Math.min(resaltado, sugerencias.length - 1)].nombre);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="pedido-departamento" className="block rotulo text-[11px] text-carbon-500">
          Departamento
        </label>
        <select
          id="pedido-departamento"
          value={departamento}
          onChange={(e) => {
            alCambiar("departamento", e.target.value);
            setResaltado(0);
          }}
          aria-invalid={errores.departamento ? true : undefined}
          aria-describedby={errores.departamento ? "pedido-departamento-error" : undefined}
          className={`${CLASE_CAMPO} ${errores.departamento ? CLASE_ERROR : CLASE_NORMAL}`}
        >
          <option value="">Elige tu departamento</option>
          {DEPARTAMENTOS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errores.departamento && (
          <p id="pedido-departamento-error" className="mt-1.5 text-[12px] text-marca-400">
            {errores.departamento}
          </p>
        )}
      </div>

      <div ref={contenedor} className="relative">
        <label htmlFor="pedido-municipio" className="block rotulo text-[11px] text-carbon-500">
          Ciudad o municipio
        </label>
        <input
          id="pedido-municipio"
          type="text"
          role="combobox"
          aria-expanded={visible}
          aria-controls={idLista}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={!departamento}
          value={municipio}
          onChange={(e) => {
            alCambiar("municipio", e.target.value);
            setAbierto(true);
            setResaltado(0);
          }}
          onFocus={() => setAbierto(true)}
          onClick={() => setAbierto(true)}
          onKeyDown={alTeclear}
          placeholder={departamento ? "Escribe y elige de la lista" : "Primero elige el departamento"}
          aria-invalid={errores.municipio ? true : undefined}
          aria-describedby={errores.municipio ? "pedido-municipio-error" : undefined}
          className={`${CLASE_CAMPO} ${errores.municipio ? CLASE_ERROR : CLASE_NORMAL}`}
        />

        {/* Confirmación discreta de que el municipio salió de la lista oficial */}
        {elegido && !errores.municipio && (
          <span className="pointer-events-none absolute right-3 top-[2.45rem] text-disponible">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m4 12.5 5 5L20 6.5" />
            </svg>
          </span>
        )}

        {visible && (
          <ul
            id={idLista}
            role="listbox"
            aria-label={`Municipios de ${departamento}`}
            className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-y-auto border border-carbon-700 bg-carbon-850 shadow-panel"
          >
            {sugerencias.map((m, i) => (
              <li key={m.nombre} role="option" aria-selected={i === resaltado}>
                <button
                  type="button"
                  // mousedown en vez de click: el blur del input se dispara
                  // antes que el click y cerraría la lista sin elegir nada.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    elegir(m.nombre);
                  }}
                  onMouseEnter={() => setResaltado(i)}
                  className={`block min-h-11 w-full px-3 py-2.5 text-left text-[14px] leading-tight text-carbon-100 transition-colors ${
                    i === resaltado ? "bg-marca-500/[0.14]" : ""
                  }`}
                >
                  {m.nombre}
                </button>
              </li>
            ))}
          </ul>
        )}

        {errores.municipio && (
          <p id="pedido-municipio-error" className="mt-1.5 text-[12px] text-marca-400">
            {errores.municipio}
          </p>
        )}
      </div>
    </div>
  );
}
