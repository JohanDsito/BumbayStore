import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProducto,
  getProductos,
  getCategoria,
  getRelacionados,
} from "@/lib/products";
import { imagenUrl } from "@/lib/supabase";
import { site } from "@/lib/site-config";
import { precio, ahorroPorcentaje } from "@/lib/format";
import { enlaceConsulta } from "@/lib/whatsapp";
import { ImagenProducto } from "@/components/product-image";
import { AgregarAlPedido } from "@/components/add-to-cart";
import { TarjetaProducto } from "@/components/product-card";
import { IconoWhatsApp } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

/** Prerenderiza cada ficha en el build: HTML completo para Google y las IAs. */
export async function generateStaticParams() {
  const productos = await getProductos();
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) return { title: "Producto no encontrado" };

  const categoria = await getCategoria(producto.categoriaSlug);
  const imagen = imagenUrl(producto.imagen);

  // Descripción corta y con el dato que importa: qué es y cuánto cuesta.
  const descripcion = producto.fichaTecnica
    ? `${producto.fichaTecnica.slice(0, 150).trim()}… Desde ${precio(
        producto.precioMayor ?? producto.precioUnitario,
      )} al por mayor. Envíos a toda Colombia.`
    : `${producto.nombre} — ${precio(producto.precioUnitario)}. ${site.nombre}, ${site.ciudad}.`;

  return {
    title: `${producto.nombre} — ${producto.sku}`,
    description: descripcion,
    alternates: { canonical: `/producto/${producto.slug}` },
    openGraph: {
      type: "website",
      title: producto.nombre,
      description: descripcion,
      url: `${site.url}/producto/${producto.slug}`,
      siteName: site.nombre,
      locale: "es_CO",
      ...(imagen ? { images: [{ url: imagen, alt: producto.nombre }] } : {}),
    },
    other: {
      "product:price:amount": String(producto.precioUnitario),
      "product:price:currency": site.moneda,
      ...(categoria ? { "product:category": categoria.nombre } : {}),
    },
  };
}

export default async function FichaProducto({ params }: Props) {
  const { slug } = await params;
  const producto = await getProducto(slug);
  if (!producto) notFound();

  const [categoria, relacionados] = await Promise.all([
    getCategoria(producto.categoriaSlug),
    getRelacionados(producto, 4),
  ]);

  const imagen = imagenUrl(producto.imagen);
  const ahorro =
    producto.precioMayor !== null
      ? ahorroPorcentaje(producto.precioUnitario, producto.precioMayor)
      : 0;

  // --- Datos estructurados -------------------------------------------------
  // Esto es lo que permite que Google muestre foto y precio en el resultado,
  // y que un asistente de IA sepa qué vendes y a cuánto.
  const datosProducto = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    sku: producto.sku,
    mpn: producto.sku,
    description: producto.fichaTecnica ?? producto.nombre,
    ...(imagen ? { image: [imagen] } : {}),
    ...(producto.marca ? { brand: { "@type": "Brand", name: producto.marca } } : {}),
    ...(categoria ? { category: categoria.nombre } : {}),
    ...(producto.especificaciones.length > 0
      ? {
          additionalProperty: producto.especificaciones.map((e) => ({
            "@type": "PropertyValue",
            name: e.label,
            value: e.valor,
          })),
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: `${site.url}/producto/${producto.slug}`,
      priceCurrency: site.moneda,
      price: producto.precioUnitario,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.nombre },
    },
  };

  const datosMigas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
      ...(categoria
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: categoria.nombre,
              item: `${site.url}/categoria/${categoria.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: categoria ? 3 : 2,
        name: producto.nombre,
        item: `${site.url}/producto/${producto.slug}`,
      },
    ],
  };

  const datosFaq =
    producto.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: producto.faq.map((f) => ({
            "@type": "Question",
            name: f.pregunta,
            acceptedAnswer: { "@type": "Answer", text: f.respuesta },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosProducto) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosMigas) }}
      />
      {datosFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosFaq) }}
        />
      )}

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <nav aria-label="Ruta de navegación" className="py-4">
          <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-carbon-500">
            <li>
              <Link href="/" className="transition-colors hover:text-naranja-400">
                Inicio
              </Link>
            </li>
            {categoria && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/categoria/${categoria.slug}`}
                    className="transition-colors hover:text-naranja-400"
                  >
                    {categoria.nombre}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden>/</li>
            <li className="text-carbon-300">{producto.sku}</li>
          </ol>
        </nav>

        <div className="grid gap-8 pb-12 lg:grid-cols-2 lg:gap-12">
          {/* --- Imagen --- */}
          <div className="lg:sticky lg:top-44 lg:self-start">
            <div className="relative border border-carbon-800">
              <ImagenProducto
                imagen={producto.imagen}
                nombre={producto.nombre}
                sku={producto.sku}
                prioridad
                sizes="(max-width: 1024px) 100vw, 640px"
              />
              {producto.precioMayor !== null && (
                <span className="absolute left-0 top-4 bg-naranja-500 py-1.5 pl-3 pr-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-carbon-950">
                  Precio al mayor −{ahorro}%
                </span>
              )}
            </div>
          </div>

          {/* --- Información y compra --- */}
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-carbon-500">
              {producto.sku}
              {producto.marca && (
                <>
                  <span aria-hidden className="mx-2 text-carbon-700">
                    ·
                  </span>
                  <span className="text-carbon-400">{producto.marca}</span>
                </>
              )}
            </p>

            <h1 className="mt-2.5 text-2xl font-extrabold leading-[1.1] tracking-[-0.03em] text-carbon-50 sm:text-3xl lg:text-4xl">
              {producto.nombre}
            </h1>

            <div className="mt-6 flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-disponible" />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-disponible">
                Disponible
              </span>
            </div>

            {/* Precios: ambos a la vista, que es lo que decide la compra */}
            <div className="mt-5 border border-carbon-800 bg-carbon-900">
              <div className="flex flex-wrap items-stretch divide-carbon-800 sm:divide-x">
                <div className="flex-1 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
                    Precio unidad
                  </p>
                  <p className="mt-1.5 font-mono text-3xl font-extrabold leading-none text-carbon-50">
                    {precio(producto.precioUnitario)}
                  </p>
                </div>

                {producto.precioMayor !== null && (
                  <div className="flex-1 border-t border-carbon-800 bg-naranja-500/[0.06] p-5 sm:border-t-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-naranja-400">
                      Precio al por mayor
                    </p>
                    <p className="mt-1.5 font-mono text-3xl font-extrabold leading-none text-naranja-400">
                      {precio(producto.precioMayor)}
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-carbon-400">
                      Ahorras {precio(producto.precioUnitario - producto.precioMayor)} por
                      unidad. Consúltanos la cantidad mínima.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <AgregarAlPedido producto={producto} tamano="grande" />

              <a
                href={enlaceConsulta(producto)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 border border-carbon-700 text-[14px] font-semibold tracking-tight text-carbon-200 transition-colors hover:border-disponible hover:text-disponible"
              >
                <IconoWhatsApp className="h-4 w-4" />
                Más información por WhatsApp
              </a>

              <p className="text-center font-mono text-[10px] text-carbon-500">
                Agrega al pedido y envíanos todo junto por WhatsApp
              </p>
            </div>

            {producto.beneficios.length > 0 && (
              <ul className="mt-8 space-y-2.5 border-t border-carbon-800 pt-6">
                {producto.beneficios.map((b) => (
                  <li key={b} className="flex gap-3 text-[14px] leading-relaxed text-carbon-300">
                    <span aria-hidden className="mt-2 h-1 w-3 shrink-0 bg-naranja-500" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* --- Contenido largo: lo que Google y las IAs realmente leen --- */}
        <div className="grid gap-10 border-t border-carbon-800 py-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="space-y-12">
            {producto.fichaTecnica && (
              <Seccion titulo="Ficha técnica" id="ficha-tecnica">
                <p className="text-[15px] leading-relaxed text-carbon-300">
                  {producto.fichaTecnica}
                </p>
              </Seccion>
            )}

            {producto.modoUso && (
              <Seccion titulo="Modo de uso" id="modo-de-uso">
                <p className="text-[15px] leading-relaxed text-carbon-300">
                  {producto.modoUso}
                </p>
              </Seccion>
            )}

            {producto.faq.length > 0 && (
              <Seccion titulo="Preguntas frecuentes" id="preguntas-frecuentes">
                <div className="divide-y divide-carbon-800 border-y border-carbon-800">
                  {producto.faq.map((f) => (
                    <details key={f.pregunta} className="group py-4">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold text-carbon-100 transition-colors hover:text-naranja-400">
                        {f.pregunta}
                        <span
                          aria-hidden
                          className="mt-1 shrink-0 font-mono text-naranja-500 transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 pr-8 text-[14px] leading-relaxed text-carbon-400">
                        {f.respuesta}
                      </p>
                    </details>
                  ))}
                </div>
              </Seccion>
            )}
          </div>

          {/* Especificaciones: tabla fija, en monoespaciada, como una hoja de datos */}
          {producto.especificaciones.length > 0 && (
            <aside className="lg:sticky lg:top-44 lg:self-start">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-naranja-500">
                Especificaciones
              </h2>
              <dl className="mt-4 divide-y divide-carbon-800 border border-carbon-800 bg-carbon-900">
                {producto.especificaciones.map((e) => (
                  <div key={e.label} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-[12px] text-carbon-500">{e.label}</dt>
                    <dd className="text-right font-mono text-[12px] font-medium text-carbon-100">
                      {e.valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </div>

        {relacionados.length > 0 && (
          <section aria-labelledby="titulo-relacionados" className="border-t border-carbon-800 py-12">
            <h2
              id="titulo-relacionados"
              className="text-xl font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-2xl"
            >
              También te puede servir
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {relacionados.map((p, i) => (
                <TarjetaProducto key={p.slug} producto={p} indice={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function Seccion({
  titulo,
  id,
  children,
}: {
  titulo: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="mb-4 text-xl font-extrabold tracking-[-0.03em] text-carbon-50 sm:text-2xl"
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}
