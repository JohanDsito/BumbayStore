import Link from "next/link";

import { site } from "@/config/sitio";
import { JsonLd } from "@/components/json-ld";

export type Paso = {
  /** Nombre completo: es el que leen los buscadores. */
  nombre: string;
  ruta: string;
  /** Texto más corto para la pantalla, si hace falta. Ej: el SKU. */
  etiqueta?: string;
};

/**
 * Ruta de navegación: Inicio / Herramientas / Taladros / BT-TAL-2001.
 *
 * Pinta la versión visible y la de los buscadores (BreadcrumbList) desde la
 * misma lista, para que nunca digan cosas distintas. "Inicio" se agrega solo;
 * el último paso es la página actual y no lleva enlace.
 */
export function Migas({ pasos }: { pasos: Paso[] }) {
  const todos: Paso[] = [{ nombre: "Inicio", ruta: "/" }, ...pasos];

  const datos = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: todos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.nombre,
      item: `${site.url}${p.ruta === "/" ? "" : p.ruta}`,
    })),
  };

  return (
    <>
      <JsonLd datos={datos} />
      <nav aria-label="Ruta de navegación" className="py-4">
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-carbon-500">
          {todos.map((p, i) => {
            const ultimo = i === todos.length - 1;
            return (
              <li key={p.ruta} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {ultimo ? (
                  <span aria-current="page" className="text-carbon-300">
                    {p.etiqueta ?? p.nombre}
                  </span>
                ) : (
                  <Link href={p.ruta} className="transition-colors hover:text-marca-400">
                    {p.etiqueta ?? p.nombre}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
