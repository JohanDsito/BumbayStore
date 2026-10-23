import Link from "next/link";

import type { Category, DatoNicho } from "@/dominio/modelos";
import { rutaCategoria } from "@/dominio/rutas";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { IconoWhatsApp, IconoFlecha } from "@/components/icons";

/**
 * Piezas de portada que comparten la portada general y la de cada nicho.
 * Reciben el contenido ya resuelto: no consultan nada por su cuenta.
 */

/**
 * Encabezado grande. Directo: qué se vende, a quién, y cómo se compra.
 *
 * El titular admite dos líneas separadas por un salto de línea; la segunda
 * va en el color de la marca.
 */
export function Portico({
  etiqueta,
  titular,
  descripcion,
  datos,
  mensajeWhatsApp,
}: {
  etiqueta: string;
  titular: string;
  descripcion: string | null;
  datos: DatoNicho[];
  mensajeWhatsApp: string;
}) {
  const [primera, ...resto] = titular.split("\n");
  const segunda = resto.join(" ").trim();

  return (
    <section className="relative overflow-hidden border-b border-carbon-800">
      {/* Resplandor cálido detrás del texto, como la luz de un taller */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-marca-500/[0.14] blur-[100px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
            <span aria-hidden className="h-px w-8 bg-marca-500" />
            {etiqueta}
          </p>

          <h1 className="mt-5 text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-carbon-50 sm:text-6xl lg:text-7xl">
            {primera}
            {segunda && <span className="block text-marca-500">{segunda}</span>}
          </h1>

          {descripcion && (
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-carbon-400 sm:text-base">
              {descripcion}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contenido-catalogo"
              className="flex h-12 items-center justify-center gap-2 bg-marca-500 px-7 text-sm font-semibold tracking-tight text-white transition-colors hover:bg-marca-400"
            >
              Ver catálogo
              <IconoFlecha className="h-4 w-4" />
            </a>
            <a
              href={enlaceGeneral(mensajeWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 border border-carbon-700 px-7 text-sm font-semibold tracking-tight text-carbon-100 transition-colors hover:border-disponible hover:text-disponible"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Pedir lista de precios
            </a>
          </div>

          {datos.length > 0 && (
            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-carbon-800 pt-6">
              {datos.map((d) => (
                <Dato key={d.etiqueta} valor={d.valor} etiqueta={d.etiqueta} />
              ))}
            </dl>
          )}
        </div>
      </div>

      <span id="contenido-catalogo" className="sr-only" />
    </section>
  );
}

function Dato({ valor, etiqueta }: DatoNicho) {
  return (
    <div>
      <dt className="sr-only">{etiqueta}</dt>
      <dd>
        <span className="block font-mono text-xl font-bold leading-none text-carbon-50">
          {valor}
        </span>
        <span className="mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-carbon-500">
          {etiqueta}
        </span>
      </dd>
    </div>
  );
}

/** Botones para saltar a cada categoría. */
export function ExplorarCategorias({
  titulo,
  categorias,
}: {
  titulo: string;
  categorias: Category[];
}) {
  if (categorias.length === 0) return null;
  return (
    <section aria-labelledby="titulo-categorias" className="pb-12">
      <h2
        id="titulo-categorias"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-carbon-500"
      >
        {titulo}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {categorias.map((c) => (
          <li key={c.slug}>
            <Link
              href={rutaCategoria(c)}
              className="group flex items-center gap-2 border border-carbon-800 bg-carbon-900 px-4 py-2.5 text-[13px] font-medium text-carbon-300 transition-colors hover:border-marca-500 hover:text-carbon-50"
            >
              {c.nombre}
              <IconoFlecha className="h-3.5 w-3.5 text-carbon-500 transition-all group-hover:translate-x-0.5 group-hover:text-marca-500" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Llamado a la acción para el cliente mayorista, que es el que deja margen. */
export function BloqueMayorista() {
  return (
    <section className="relative my-8 overflow-hidden border border-carbon-800 bg-carbon-900">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 cinta-precaucion" />
      <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
            Compra por volumen
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-3xl">
            ¿Tienes un negocio?
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-carbon-400">
            Manejamos un solo precio, de distribuidor, igual para todos: el que
            ves en el catálogo. Arma tu pedido y escríbenos con las cantidades
            que necesitas para coordinar despacho a toda Colombia y respaldo de
            garantía.
          </p>
        </div>
        <a
          href={enlaceGeneral(
            "Hola, tengo un negocio y quisiera cotizar con precio de distribuidor.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2.5 bg-disponible px-8 text-sm font-semibold tracking-tight text-carbon-950 transition-opacity hover:opacity-90"
        >
          <IconoWhatsApp className="h-5 w-5" />
          Cotizar al por mayor
        </a>
      </div>
    </section>
  );
}

/** Encabezado de una sección de productos: etiqueta, título y conteo. */
export function EncabezadoSeccion({
  id,
  etiqueta,
  titulo,
  cantidad,
}: {
  id: string;
  etiqueta: string;
  titulo: string;
  cantidad: number;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-t border-carbon-800 pt-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
          {etiqueta}
        </p>
        <h2
          id={id}
          className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-3xl"
        >
          {titulo}
        </h2>
      </div>
      <span className="shrink-0 font-mono text-xs text-carbon-500">
        {cantidad} {cantidad === 1 ? "producto" : "productos"}
      </span>
    </div>
  );
}
