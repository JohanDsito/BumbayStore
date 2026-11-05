import Link from "next/link";

import { fotoDeCategoria } from "@/dominio/catalogo";
import type { Category, Product } from "@/dominio/modelos";
import { rutaCategoria } from "@/dominio/rutas";

import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { IconoWhatsApp, IconoFlecha } from "@/components/icons";
import { ImagenProducto } from "@/components/product-image";
import { MedirEscenario } from "@/components/medir-escenario";
import { IndicePortal, type EntradaIndice } from "@/components/indice-portal";
import { BOTON_PRINCIPAL, BOTON_SECUNDARIO } from "@/components/botones";
import { TitularAnimado } from "@/components/titular-animado";

/**
 * Piezas de portada que comparten la portada general y la de cada nicho.
 * Reciben el contenido ya resuelto: no consultan nada por su cuenta.
 */

/** Id de la sección del catálogo, adonde lleva "Ver catálogo". */
export const ANCLA_CATALOGO = "catalogo";

/**
 * La primera pantalla de una portada, sobre el campo de luz: a la izquierda
 * el índice y, debajo, la lectura del campo; a la derecha el titular, con
 * todo el ancho para él. En celular van solo el titular y las acciones.
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
  /** Logo de la submarca, sobre el titular. */
  logo?: React.ReactNode;
}) {
  return (
    // El escenario: noche en los dos temas, con el campo de luz detrás.
    <section className="portico escenario relative">
      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14 lg:pb-16 lg:pt-20">
        {/* La lectura del campo va bajo el índice que la enciende. Flotando en
            la esquina chocaba con titulares largos y nichos con muchas cifras.
            En celular no se muestra: nichos y categorías ya están en el menú.
            Los enlaces siguen en el HTML y en el pie, así que Google los ve. */}
        <div className="hidden lg:order-1 lg:block lg:pt-3">
          <IndicePortal {...indice} />
          <div className="mt-8 hidden lg:block">{lectura}</div>
        </div>

        <div className="order-1 lg:order-2">
          {logo && <div className="mb-8">{logo}</div>}
          <TitularAnimado
            texto={titular}
            className="titular text-[clamp(2.75rem,11.5vw,6rem)] text-tinta-fuerte"
            acentoClassName="text-acento-texto"
          />

          <p className="rotulo mt-7 text-tinta">{lineaClave}</p>

          {descripcion && (
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-tinta-media sm:text-base">
              {descripcion}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={`#${ANCLA_CATALOGO}`} className={BOTON_PRINCIPAL}>
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
      <MedirEscenario />
    </section>
  );
}

/** Las entradas de FilaCategorias: cada categoría con su foto y su conteo. */
export function entradasCategorias(
  categorias: readonly Category[],
  productos: readonly Product[],
): EntradaCategoria[] {
  return categorias.map((c) => {
    const n = productos.filter((p) => p.categoriaSlug === c.slug).length;
    return {
      nombre: c.nombre,
      href: rutaCategoria(c),
      foto: fotoDeCategoria(c.slug, productos),
      detalle: `${n} ${n === 1 ? "producto" : "productos"}`,
    };
  });
}

export type EntradaCategoria = {
  nombre: string;
  href: string;
  /** Foto de uno de sus productos (fotoDeCategoria). */
  foto: string | null;
  /** "6 productos". */
  detalle: string;
};

/**
 * Fila de categorías con la foto de uno de sus productos, justo debajo del
 * escenario: se ve qué se vende antes de leer. En celular se desliza con el
 * dedo; en computador cabe entera o se desliza si hay muchas.
 */
export function FilaCategorias({
  titulo,
  entradas,
}: {
  titulo: string;
  entradas: EntradaCategoria[];
}) {
  if (entradas.length === 0) return null;
  return (
    <nav aria-label={titulo} className="pt-8 sm:pt-10">
      <ul className="sin-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:gap-4 sm:px-0">
        {entradas.map((e) => (
          <li key={e.href} className="w-[112px] shrink-0 snap-start sm:w-[148px]">
            <Link href={e.href} className="group block">
              <ImagenProducto
                imagen={e.foto}
                nombre=""
                sku=""
                sizes="148px"
              />
              <span className="mt-2.5 line-clamp-2 block text-[13px] font-semibold leading-snug text-tinta transition-colors group-hover:text-acento-texto">
                {e.nombre}
              </span>
              <span className="mt-0.5 block font-mono text-[11px] text-tinta-suave">
                {e.detalle}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Llamado a la acción para el cliente que compra por volumen. */
export function BloqueMayorista() {
  return (
    <section className="vidrio relative my-12 border border-borde">
      <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <h2 className="condensada text-3xl font-extrabold tracking-[-0.02em] text-tinta-fuerte sm:text-4xl">
            ¿Compras para tu negocio?
          </h2>
          <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-tinta-media">
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
          className="rotulo flex h-14 items-center justify-center gap-3 bg-disponible px-8 text-sobre-disponible transition-opacity hover:opacity-90"
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
    <div className="mb-6 flex items-end justify-between gap-4 pt-12 sm:pt-16">
      <h2 id={id} className="titular text-[2.5rem] text-tinta-fuerte sm:text-6xl">
        {titulo}
      </h2>
      <span className="shrink-0 font-mono text-xs text-tinta-suave">
        {cantidad} {cantidad === 1 ? "producto" : "productos"}
      </span>
    </div>
  );
}
