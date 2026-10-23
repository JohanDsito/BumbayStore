"use client";

import { useState, useMemo, useRef, useEffect, useId } from "react";
import { municipios } from "@/data/municipios";

/** Quita tildes y pasa a minúscula, para que "narino" encuentre "Nariño". */
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Forma canónica que se guarda y se envía por WhatsApp. */
function etiqueta(m: { municipio: string; departamento: string }): string {
  return `${m.municipio}, ${m.departamento}`;
}

// El índice se calcula una sola vez, al cargar el módulo: normalizar 1.122
// nombres en cada pulsación sería trabajo repetido para nada.
const INDICE = municipios.map((m) => ({
  ...m,
  etiqueta: etiqueta(m),
  buscable: normalizar(`${m.municipio} ${m.departamento}`),
  inicio: normalizar(m.municipio),
}));

const VALIDAS = new Set(INDICE.map((m) => m.etiqueta));

/** ¿El texto corresponde a un municipio real del Divipola? */
export function esCiudadValida(valor: string): boolean {
  return VALIDAS.has(valor.trim());
}

const MAXIMO = 8;

function buscar(consulta: string) {
  const q = normalizar(consulta);
  if (q.length < 2) return [];
  // Si ya está elegido exactamente, no hace falta sugerir nada.
  if (VALIDAS.has(consulta.trim())) return [];

  const terminos = q.split(/\s+/).filter(Boolean);

  return INDICE.map((m) => {
    if (!terminos.every((t) => m.buscable.includes(t))) return null;
    // Que el municipio empiece por lo escrito pesa más que una coincidencia
    // suelta en el nombre del departamento.
    const puntaje = m.inicio.startsWith(q) ? 3 : m.inicio.includes(q) ? 2 : 1;
    return { m, puntaje };
  })
    .filter((x): x is { m: (typeof INDICE)[number]; puntaje: number } => x !== null)
    .sort((a, b) => b.puntaje - a.puntaje || a.m.municipio.localeCompare(b.m.municipio, "es"))
    .slice(0, MAXIMO)
    .map((x) => x.m);
}

type Props = {
  id: string;
  valor: string;
  alCambiar: (v: string) => void;
  error: string | null;
};

/**
 * Campo de ciudad con autocompletado sobre los 1.122 municipios del DANE.
 *
 * Es un solo campo en lugar de dos listas desplegables: escribir tres letras
 * es más rápido que desplegar el departamento y después buscar el municipio
 * entre 125 opciones, sobre todo en celular. La lista es local, así que
 * responde al instante y no depende de ningún servicio externo.
 */
export function CampoCiudad({ id, valor, alCambiar, error }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [resaltado, setResaltado] = useState(0);
  const contenedor = useRef<HTMLDivElement>(null);
  const idLista = useId();

  const sugerencias = useMemo(() => buscar(valor), [valor]);
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

  const elegir = (m: (typeof INDICE)[number]) => {
    alCambiar(m.etiqueta);
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
      elegir(sugerencias[Math.min(resaltado, sugerencias.length - 1)]);
    }
  };

  const elegida = esCiudadValida(valor);

  return (
    <div ref={contenedor} className="relative">
      <label
        htmlFor={id}
        className="block rotulo text-[10px] text-carbon-500"
      >
        Ciudad o municipio
      </label>

      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={visible}
        aria-controls={idLista}
        aria-autocomplete="list"
        autoComplete="off"
        value={valor}
        onChange={(e) => {
          alCambiar(e.target.value);
          setAbierto(true);
          setResaltado(0);
        }}
        onFocus={() => setAbierto(true)}
        onKeyDown={alTeclear}
        placeholder="Escribe y elige de la lista"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 h-11 w-full border px-3 text-[14px] text-carbon-100 placeholder:text-carbon-500 focus:border-marca-500 focus:outline-none ${
          error
            ? "border-marca-500 bg-marca-500/[0.10]"
            : "border-carbon-700 bg-carbon-850"
        }`}
      />

      {/* Confirmación discreta de que la ciudad salió de la lista oficial */}
      {elegida && !error && (
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
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-64 overflow-y-auto border border-carbon-700 bg-carbon-850 shadow-panel"
        >
          {sugerencias.map((m, i) => (
            <li key={m.etiqueta} role="option" aria-selected={i === resaltado}>
              <button
                type="button"
                // mousedown en vez de click: el blur del input se dispara
                // antes que el click y cerraría la lista sin elegir nada.
                onMouseDown={(e) => {
                  e.preventDefault();
                  elegir(m);
                }}
                onMouseEnter={() => setResaltado(i)}
                className={`block w-full px-3 py-2.5 text-left transition-colors ${
                  i === resaltado ? "bg-marca-500/[0.14]" : ""
                }`}
              >
                <span className="block text-[14px] leading-tight text-carbon-100">
                  {m.municipio}
                </span>
                <span className="mt-0.5 block font-mono text-[11px] text-carbon-500">
                  {m.departamento}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-marca-400">
          {error}
        </p>
      )}
    </div>
  );
}
