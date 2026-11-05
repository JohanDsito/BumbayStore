import Link from "next/link";
import { site } from "@/config/sitio";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { IconoWhatsApp } from "@/components/icons";
import { LogoStore } from "@/components/logos";
import { RedesSociales } from "@/components/redes-sociales";
import type { SeccionMenu } from "@/dominio/catalogo";
import { rutaCategoria, rutaNicho } from "@/dominio/rutas";

/**
 * Pie de la tienda. Es escenario: de noche en los dos temas, el marco de
 * abajo que cierra la tienda clara.
 *
 * En celular es corto: logo y WhatsApp en una fila, los nichos en línea y el
 * contacto en tres renglones. Las categorías no se ven ahí (están en el menú),
 * pero sus enlaces siguen en el HTML: el pie es la red de enlaces internos que
 * Google recorre en todas las páginas.
 */
export function PieSitio({ menu }: { menu: SeccionMenu[] }) {
  const anio = new Date().getFullYear();

  return (
    <footer className="escenario border-t border-linea bg-fondo">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 md:py-12">
        <div className="grid gap-7 md:grid-cols-[1.1fr_2fr_1fr] md:gap-10">
          <div className="flex items-center justify-between gap-4 md:block">
            <LogoStore className="w-[120px] md:w-[150px]" />
            <p className="mt-4 hidden max-w-sm text-[13px] leading-relaxed text-tinta-suave md:block">
              {site.descripcion}
            </p>
            <a
              href={enlaceGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 bg-disponible px-4 text-[13px] font-semibold tracking-tight text-sobre-disponible transition-opacity hover:opacity-90 md:mt-5 md:px-5"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Cotizar por WhatsApp
            </a>
          </div>

          <div>
            <h2 className="rotulo text-tinta-suave">Catálogo</h2>
            {/* En computador los nichos van lado a lado: con cada nicho nuevo el pie
                crece hacia el costado y no hacia abajo. */}
            <ul className="mt-2 flex flex-wrap gap-x-5 md:mt-4 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6 xl:grid-cols-3">
              {menu.map(({ nicho, categorias }) => (
                <li key={nicho.slug}>
                  <Link
                    href={rutaNicho(nicho)}
                    className="inline-block py-2.5 text-[13px] font-semibold text-tinta transition-colors hover:text-acento-texto md:py-1.5"
                  >
                    {nicho.submarca ?? nicho.nombre}
                  </Link>
                  {/* Las primeras categorías bastan: la lista completa está en el menú. */}
                  <ul className="mt-1 hidden md:block">
                    {categorias.slice(0, 6).map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={rutaCategoria(c)}
                          className="inline-block py-1.5 text-[13px] text-tinta-suave transition-colors hover:text-acento-texto"
                        >
                          {c.nombre}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="rotulo text-tinta-suave">Contacto</h2>
            {/* En celular los títulos solo los lee el lector de pantalla: cada
                dato se entiende solo y el bloque queda en tres renglones. */}
            <dl className="mt-2 space-y-1 text-[13px] md:mt-4 md:space-y-3">
              <div>
                <dt className="text-tinta-tenue max-md:sr-only">Dirección</dt>
                <dd className="text-tinta-media">{site.direccion}</dd>
              </div>
              <div>
                <dt className="text-tinta-tenue max-md:sr-only">Horario</dt>
                <dd className="text-tinta-media">{site.horario}</dd>
              </div>
              <div>
                <dt className="text-tinta-tenue max-md:sr-only">Correo</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-block py-1 text-tinta-media transition-colors hover:text-acento-texto md:py-0"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            <RedesSociales className="-ml-3 mt-2 md:mt-4" />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-1.5 border-t border-hundido pt-5 md:mt-12 md:flex-row md:items-center md:justify-between md:pt-6">
          <p className="font-mono text-[11px] text-tinta-tenue">
            © {anio} {site.nombre}. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[11px] text-tinta-tenue">
            Precios en pesos colombianos (COP) · Sujetos a cambio sin previo aviso
          </p>
        </div>
      </div>
    </footer>
  );
}
