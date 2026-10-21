import type { Metadata } from "next";
import Link from "next/link";

import { catalogo } from "@/servidor/catalogo";
import { GrillaProductos } from "@/components/product-grid";
import { RegistrarBusqueda } from "@/components/search-logger";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { IconoWhatsApp } from "@/components/icons";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = {
  title: "Buscar en el catálogo",
  // Las páginas de resultados no aportan a la indexación y pueden generar
  // contenido duplicado, así que las dejamos fuera de Google.
  robots: { index: false, follow: true },
};

export default async function PaginaBusqueda({ searchParams }: Props) {
  const { q } = await searchParams;
  const consulta = (q ?? "").trim();
  const [resultados, categorias] = await Promise.all([
    consulta ? catalogo.buscar(consulta) : Promise.resolve([]),
    catalogo.categorias(),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      {consulta && (
        <RegistrarBusqueda consulta={consulta} resultados={resultados.length} />
      )}
      <header className="border-b border-carbon-800 py-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
          Búsqueda
        </p>
        <h1 className="mt-2.5 text-2xl font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-3xl">
          {consulta ? (
            <>
              Resultados para{" "}
              <span className="font-mono text-marca-400">{consulta}</span>
            </>
          ) : (
            "¿Qué herramienta necesitas?"
          )}
        </h1>
        {consulta && (
          <p className="mt-3 font-mono text-xs text-carbon-500">
            {resultados.length}{" "}
            {resultados.length === 1 ? "producto encontrado" : "productos encontrados"}
          </p>
        )}
      </header>

      <div className="py-8">
        {consulta && resultados.length === 0 ? (
          <div className="border border-dashed border-carbon-700 px-6 py-16 text-center">
            <p className="text-[15px] text-carbon-300">
              No encontramos nada para{" "}
              <span className="font-mono text-carbon-100">{consulta}</span>.
            </p>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-carbon-500">
              Prueba con una palabra más corta, con el código del producto, o
              escríbenos: si no está en el catálogo, probablemente lo
              conseguimos.
            </p>
            <a
              href={enlaceGeneral(`Hola, estoy buscando: ${consulta}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center gap-2 bg-disponible px-6 text-[13px] font-semibold tracking-tight text-carbon-950 transition-opacity hover:opacity-90"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Preguntar por WhatsApp
            </a>
          </div>
        ) : consulta ? (
          <GrillaProductos productos={resultados} prioritarias={4} />
        ) : (
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-carbon-500">
              O explora por categoría
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {categorias.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categoria/${c.slug}`}
                    className="block border border-carbon-800 bg-carbon-900 px-4 py-2.5 text-[13px] font-medium text-carbon-300 transition-colors hover:border-marca-500 hover:text-carbon-50"
                  >
                    {c.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
