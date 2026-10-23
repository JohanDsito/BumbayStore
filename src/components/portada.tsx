import Link from "next/link";

import type { Category } from "@/dominio/modelos";
import { rutaCategoria } from "@/dominio/rutas";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { IconoWhatsApp, IconoFlecha } from "@/components/icons";
import { IndicePortal, type EntradaIndice } from "@/components/indice-portal";
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO } from "@/components/botones";
import { TitularAnimado } from "@/components/titular-animado";

/**
 * Piezas de portada que comparten la portada general y la de cada nicho.
 * Reciben el contenido ya resuelto: no consultan nada por su cuenta.
 */

/**
 * La primera pantalla de una portada, sobre el campo de luz: a la izquierda
 * el índice y, debajo, la lectura del campo; a la derecha el titular, con
 * todo el ancho para él. En celular se apilan: titular, acciones e índice.
 *
 * El titular admite dos líneas separadas por un salto de línea; la segunda
 * va en el color del nicho.
 */
export function Portico({
  titular,
  descripcion,
  lineaClave,
  indice,
  lectura,
  mensajeWhatsApp,
  cinta = false,
  logo,
}: {
  titular: string;
  descripcion: string | null;
  /** Una línea corta y espaciada bajo el titular: lo que no se puede olvidar. */
  lineaClave: string;
  indice: { titulo: string; entradas: EntradaIndice[]; enciende: boolean };
  /** La columna derecha: qué está mostrando el campo. */
  lectura: React.ReactNode;
  mensajeWhatsApp: string;
  /** La cinta de precaución de Bumbay Tools, solo en su nicho. */
  cinta?: boolean;
  /** Logo de la submarca, sobre el titular. */
  logo?: React.ReactNode;
}) {
  return (
    <section className="relative">
      {cinta && <div aria-hidden className="cinta-precaucion h-1 opacity-80" />}
      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14 lg:pb-16 lg:pt-20">
        {/* La lectura del campo va bajo el índice que la enciende. Flotando en
            la esquina chocaba con titulares largos y nichos con muchas cifras. */}
        <div className="order-2 lg:order-1 lg:pt-3">
          <IndicePortal {...indice} />
          <div className="mt-8 hidden lg:block">{lectura}</div>
        </div>

        <div className="order-1 lg:order-2">
          {logo && <div className="mb-8">{logo}</div>}
          <TitularAnimado
            texto={titular}
            className="titular text-[clamp(2.75rem,11.5vw,6rem)] text-carbon-50"
            acentoClassName="text-marca-500"
          />

          <p className="rotulo mt-7 text-carbon-200">{lineaClave}</p>

          {descripcion && (
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-carbon-300 sm:text-base">
              {descripcion}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#contenido-catalogo" className={BOTON_PRINCIPAL}>
              Ver catálogo
              <IconoFlecha className="h-4 w-4" />
            </a>
            <a
              href={enlaceGeneral(mensajeWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className={BOTON_SECUNDARIO}
            >
              <IconoWhatsApp className="h-4 w-4" />
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </div>

      <span id="contenido-catalogo" className="sr-only" />
    </section>
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
      <h2 id="titulo-categorias" className="rotulo text-carbon-400">
        {titulo}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {categorias.map((c) => (
          <li key={c.slug}>
            <Link
              href={rutaCategoria(c)}
              className="group flex items-center gap-2 border border-carbon-700 bg-carbon-950/50 px-4 py-2.5 text-[13px] font-medium text-carbon-200 transition-colors hover:border-marca-400 hover:text-carbon-50"
            >
              {c.nombre}
              <IconoFlecha className="h-3.5 w-3.5 text-carbon-500 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-marca-400" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Llamado a la acción para el cliente que compra por volumen. */
export function BloqueMayorista() {
  return (
    <section className="vidrio relative my-12 border border-carbon-700">
      <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <h2 className="condensada text-3xl font-extrabold tracking-[-0.02em] text-carbon-50 sm:text-4xl">
            ¿Compras para tu negocio?
          </h2>
          <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-carbon-300">
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
          className="rotulo flex h-14 items-center justify-center gap-3 bg-disponible px-8 text-carbon-950 transition-opacity hover:opacity-90"
        >
          <IconoWhatsApp className="h-5 w-5" />
          Cotizar al por mayor
        </a>
      </div>
    </section>
  );
}

/** Encabezado de una sección de productos: título y conteo. */
export function EncabezadoSeccion({
  id,
  titulo,
  cantidad,
}: {
  id: string;
  titulo: string;
  cantidad: number;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-t border-carbon-800 pt-10">
      <h2
        id={id}
        className="condensada text-3xl font-extrabold tracking-[-0.02em] text-carbon-50 sm:text-4xl"
      >
        {titulo}
      </h2>
      <span className="shrink-0 font-mono text-xs text-carbon-400">
        {cantidad} {cantidad === 1 ? "producto" : "productos"}
      </span>
    </div>
  );
}
