import Link from "next/link";
import type { Product } from "@/dominio/modelos";
import { rutaProducto } from "@/dominio/rutas";

/**
 * Muestra de color para cada nombre. Si aparece un color nuevo que no esté
 * aquí, se pinta en gris y el nombre sigue leyéndose: nunca se rompe.
 */
const MUESTRAS: Record<string, string> = {
  azul: "#2563EB",
  amarill: "#ECB116",
  roj: "#DC2626",
  verde: "#16A34A",
  negr: "#18181B",
  gris: "#71717A",
  naranj: "#FF5B04",
  blanc: "#F4F4F5",
  morad: "#7C3AED",
  celeste: "#38BDF8",
  platead: "#A1A1AA",
  dorad: "#D4AF37",
};

/**
 * Busca la muestra por raíz del nombre. Las carpetas de fotos rotulan el color
 * concordando con el producto —"pulidora amarilla" pero "taladro amarillo"—
 * y comparar la palabra completa dejaba la mitad de los colores en gris.
 */
function muestra(color: string): string {
  const limpio = color
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  for (const [raiz, hex] of Object.entries(MUESTRAS)) {
    if (limpio.startsWith(raiz)) return hex;
  }
  return "#52525B";
}

type Props = {
  /** Todas las versiones de color, incluida la actual. */
  variantes: Product[];
  slugActual: string;
  /** `compacto` para la vista previa, donde hay menos espacio. */
  tamano?: "normal" | "compacto";
  /**
   * Cómo se navega al cambiar de color.
   *
   * `completa` fuerza una carga de página entera y se usa en la ficha: la
   * ruta de producto está interceptada, así que un <Link> abriría la vista
   * previa encima de la ficha actual en vez de llevarte a la del otro color.
   *
   * `previa` usa <Link> y se deja para la vista previa, donde sí queremos que
   * el cambio de color ocurra dentro del mismo panel.
   */
  navegacion?: "completa" | "previa";
};

/**
 * Selector de color.
 *
 * Cada versión es un producto con su propia URL, así que esto son enlaces
 * reales, no un control de JavaScript. Eso hace que Google indexe cada color
 * por separado y que el cliente pueda compartir el enlace del color exacto
 * que quiere.
 */
export function SelectorColor({
  variantes,
  slugActual,
  tamano = "normal",
  navegacion = "completa",
}: Props) {
  if (variantes.length < 2) return null;

  const actual = variantes.find((v) => v.slug === slugActual);
  const compacto = tamano === "compacto";
  const Enlace = navegacion === "previa" ? Link : "a";

  return (
    <div className={compacto ? "mt-3" : "mt-6"}>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
        Color
        {actual?.color && (
          <span className="ml-2 text-carbon-200">{actual.color}</span>
        )}
      </p>

      <ul className="mt-2 flex flex-wrap gap-2">
        {variantes.map((v) => {
          const activo = v.slug === slugActual;
          return (
            <li key={v.slug}>
              {activo ? (
                <span
                  aria-current="true"
                  className={`flex items-center gap-2 border-2 border-marca-500 bg-marca-500/10 pl-2 pr-3 font-medium text-carbon-50 ${
                    compacto ? "h-9 text-[12px]" : "h-11 text-[13px]"
                  }`}
                >
                  <Punto color={v.color} compacto={compacto} />
                  {v.color ?? "Único"}
                </span>
              ) : (
                <Enlace
                  href={rutaProducto(v)}
                  className={`flex items-center gap-2 border border-carbon-700 pl-2 pr-3 text-carbon-300 transition-colors hover:border-carbon-500 hover:text-carbon-50 ${
                    compacto ? "h-9 text-[12px]" : "h-11 text-[13px]"
                  }`}
                >
                  <Punto color={v.color} compacto={compacto} />
                  {v.color ?? "Único"}
                </Enlace>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Punto({ color, compacto }: { color: string | null; compacto: boolean }) {
  return (
    <span
      aria-hidden
      className={`block shrink-0 rounded-full ring-1 ring-carbon-950/40 ${
        compacto ? "h-4 w-4" : "h-5 w-5"
      }`}
      style={{ backgroundColor: color ? muestra(color) : "#52525B" }}
    />
  );
}

/** Marca de color para las tarjetas de la grilla. */
export function EtiquetaColor({ color }: { color: string }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-carbon-400">
      <span
        aria-hidden
        className="block h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-carbon-950/40"
        style={{ backgroundColor: muestra(color) }}
      />
      {color}
    </span>
  );
}
