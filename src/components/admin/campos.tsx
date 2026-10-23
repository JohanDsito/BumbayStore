"use client";

/**
 * Piezas de formulario que comparten las pestañas del panel.
 */

/**
 * Franja que aparece cuando hay cambios sin guardar o un resultado que
 * mostrar. "Guardado" va en verde; cualquier otro mensaje es un problema.
 */
export function BarraGuardado({
  sucio,
  mensaje,
  guardando,
  alDescartar,
  alGuardar,
}: {
  sucio: boolean;
  mensaje: string | null;
  guardando: boolean;
  alDescartar: () => void;
  alGuardar: () => void;
}) {
  if (!sucio && !mensaje) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-carbon-800 bg-carbon-850 px-3 py-2">
      <span
        className={`font-mono text-[11px] ${
          mensaje === "Guardado" ? "text-disponible" : mensaje ? "text-marca-400" : "text-carbon-400"
        }`}
      >
        {mensaje ?? "Cambios sin guardar"}
      </span>
      {sucio && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={alDescartar}
            className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-carbon-400 transition-colors hover:text-carbon-100"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={alGuardar}
            disabled={guardando}
            className="bg-marca-500 px-4 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-marca-400 disabled:opacity-50"
          >
            {guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      )}
    </div>
  );
}

export function Interruptor({
  activo,
  alCambiar,
  etiqueta,
  tono,
}: {
  activo: boolean;
  alCambiar: (v: boolean) => void;
  etiqueta: string;
  tono: "alerta" | "normal";
}) {
  const encendido =
    tono === "alerta"
      ? "border-marca-500 bg-marca-500/[0.15] text-marca-300"
      : "border-disponible bg-disponible/[0.12] text-disponible";
  return (
    <button
      type="button"
      onClick={() => alCambiar(!activo)}
      aria-pressed={activo}
      className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
        activo ? encendido : "border-carbon-700 text-carbon-500 hover:text-carbon-300"
      }`}
    >
      {etiqueta}
    </button>
  );
}

export function Campo({
  etiqueta,
  valor,
  alCambiar,
  mono = false,
}: {
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
        {etiqueta}
        <input
          type="text"
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          className={`mt-2 h-10 w-full border border-carbon-700 bg-carbon-850 px-3 text-[14px] normal-case tracking-normal text-carbon-100 focus:border-marca-500 focus:outline-none ${
            mono ? "font-mono" : "font-sans"
          }`}
        />
      </label>
    </div>
  );
}

export function AreaTexto({
  etiqueta,
  ayuda,
  valor,
  alCambiar,
  filas,
}: {
  etiqueta: string;
  ayuda?: string;
  valor: string;
  alCambiar: (v: string) => void;
  filas: number;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
        {etiqueta}
        {ayuda && (
          <span className="ml-2 normal-case tracking-normal text-carbon-600">{ayuda}</span>
        )}
        <textarea
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          rows={filas}
          className="mt-2 w-full resize-y border border-carbon-700 bg-carbon-850 px-3 py-2 font-sans text-[13px] normal-case leading-relaxed tracking-normal text-carbon-100 focus:border-marca-500 focus:outline-none"
        />
      </label>
    </div>
  );
}
