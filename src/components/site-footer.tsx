import Link from "next/link";
import { site } from "@/config/sitio";
import { enlaceGeneral } from "@/infraestructura/whatsapp";
import { Logotipo, IconoWhatsApp } from "@/components/icons";
import type { SeccionMenu } from "@/dominio/catalogo";
import { rutaCategoria, rutaNicho } from "@/dominio/rutas";

export function PieSitio({ menu }: { menu: SeccionMenu[] }) {
  const anio = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-carbon-800 bg-carbon-950">
      

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logotipo className="h-8 w-8 text-marca-500" />
              <span className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-[-0.03em] text-carbon-50">
                  BUMB<span className="text-marca-500">A</span>Y
                </span>
                <span className="rotulo mt-1 text-[8.5px] tracking-[0.42em] text-carbon-300">
                  Store
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-carbon-400">
              {site.descripcion}
            </p>
            <a
              href={enlaceGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-11 items-center gap-2 bg-disponible px-5 text-[13px] font-semibold tracking-tight text-carbon-950 transition-opacity hover:opacity-90"
            >
              <IconoWhatsApp className="h-4 w-4" />
              Cotizar por WhatsApp
            </a>
          </div>

          <div>
            <h2 className="rotulo text-carbon-400">
              Catálogo
            </h2>
            <ul className="mt-4 space-y-5">
              {menu.map(({ nicho, categorias }) => (
                <li key={nicho.slug}>
                  <Link
                    href={rutaNicho(nicho)}
                    className="text-[13px] font-semibold text-carbon-200 transition-colors hover:text-marca-400"
                  >
                    {nicho.submarca ?? nicho.nombre}
                  </Link>
                  {/* Las primeras categorías bastan: la lista completa está en el menú. */}
                  <ul className="mt-2.5 space-y-2">
                    {categorias.slice(0, 6).map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={rutaCategoria(c)}
                          className="text-[13px] text-carbon-400 transition-colors hover:text-marca-400"
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
            <h2 className="rotulo text-carbon-400">
              Contacto
            </h2>
            <dl className="mt-4 space-y-3 text-[13px]">
              <div>
                <dt className="text-carbon-500">Dirección</dt>
                <dd className="text-carbon-300">{site.direccion}</dd>
              </div>
              <div>
                <dt className="text-carbon-500">Horario</dt>
                <dd className="text-carbon-300">{site.horario}</dd>
              </div>
              <div>
                <dt className="text-carbon-500">Correo</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-carbon-300 transition-colors hover:text-marca-400"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>

            {(site.redes.instagram || site.redes.facebook || site.redes.tiktok) && (
              <ul className="mt-5 flex gap-4">
                {site.redes.instagram && (
                  <li>
                    <a
                      href={site.redes.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rotulo text-[11px] text-carbon-500 transition-colors hover:text-marca-400"
                    >
                      Instagram
                    </a>
                  </li>
                )}
                {site.redes.facebook && (
                  <li>
                    <a
                      href={site.redes.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rotulo text-[11px] text-carbon-500 transition-colors hover:text-marca-400"
                    >
                      Facebook
                    </a>
                  </li>
                )}
                {site.redes.tiktok && (
                  <li>
                    <a
                      href={site.redes.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rotulo text-[11px] text-carbon-500 transition-colors hover:text-marca-400"
                    >
                      TikTok
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-carbon-850 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-carbon-500">
            © {anio} {site.nombre}. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[11px] text-carbon-500">
            Precios en pesos colombianos (COP) · Sujetos a cambio sin previo aviso
          </p>
        </div>
      </div>
    </footer>
  );
}
