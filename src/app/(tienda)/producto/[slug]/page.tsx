import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getProducto,
  getProductos,
  getCategoria,
  getRelacionados,
  getVariantes,
} from "@/lib/products";
import { imagenUrl } from "@/lib/imagen-url";
import { site } from "@/lib/site-config";
import { precio } from "@/lib/format";
import { enlaceConsulta } from "@/lib/whatsapp";
import { GaleriaProducto } from "@/components/product-gallery";
import { AgregarAlPedido } from "@/components/add-to-cart";
import { TarjetaProducto } from "@/components/product-card";
import { SelectorColor } from "@/components/color-selector";
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
    ? `${producto.fichaTecnica.slice(0, 150).trim()}… ${precio(
        producto.precioUnitario,
      )}. Envíos a toda Colombia.`
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

  const [categoria, relacionados, variantes] = await Promise.all([
    getCategoria(producto.categoriaSlug),
    getRelacionados(producto, 4),
    getVariantes(producto),
  ]);

  // La galería usa la secuencia completa de piezas; si un producto solo tiene
  // portada, cae a esa sola imagen.
  const galeria =
    producto.imagenes.length > 0
      ? producto.imagenes
      : producto.imagen
        ? [producto.imagen]
        : [];

  const imagen = imagenUrl(producto.imagen ?? galeria[0] ?? null);
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
    ...(galeria.length > 0
      ? { image: galeria.map((i) => imagenUrl(i)).filter(Boolean) }
      : imagen
        ? { image: [imagen] }
        : {}),
    ...(producto.marca ? { brand: { "@type": "Brand", name: producto.marca } } : {}),
    ...(producto.color ? { color: producto.color } : {}),
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
      availability: producto.agotado
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
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
              <Link href="/" className="transition-colors hover:text-marca-400">
                Inicio
              </Link>
            </li>
            {categoria && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/categoria/${categoria.slug}`}
                    className="transition-colors hover:text-marca-400"
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
            <div className="relative">
              <GaleriaProducto
                imagenes={galeria}
                nombre={producto.nombre}
                sku={producto.sku}
              />
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
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full ${
                  producto.agotado ? "bg-carbon-500" : "bg-disponible"
                }`}
              />
              <span
                className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                  producto.agotado ? "text-carbon-400" : "text-disponible"
                }`}
              >
                {producto.agotado ? "Agotado por ahora" : "Disponible"}
              </span>
            </div>

            {/* Precio único: Bumbay maneja una sola tarifa para todos. */}
            <div className="mt-5 border border-carbon-800 bg-carbon-900 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
                Precio
              </p>
              <p className="mt-1.5 font-mono text-4xl font-extrabold leading-none text-carbon-50">
                {precio(producto.precioUnitario)}
              </p>
              <p className="mt-2.5 text-[12px] leading-relaxed text-carbon-400">
                Precio de distribuidor, igual para todos. Envíos a toda Colombia.
              </p>
            </div>

            <SelectorColor variantes={variantes} slugActual={producto.slug} />

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
                {producto.agotado
                  ? "Escríbenos y te avisamos cuando vuelva a entrar"
                  : "Agrega al pedido y envíanos todo junto por WhatsApp"}
              </p>
            </div>

            {producto.beneficios.length > 0 && (
              <ul className="mt-8 space-y-2.5 border-t border-carbon-800 pt-6">
                {producto.beneficios.map((b) => (
                  <li key={b} className="flex gap-3 text-[14px] leading-relaxed text-carbon-300">
                    <span aria-hidden className="mt-2 h-1 w-3 shrink-0 bg-marca-500" />
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
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-semibold text-carbon-100 transition-colors hover:text-marca-400">
                        {f.pregunta}
                        <span
                          aria-hidden
                          className="mt-1 shrink-0 font-mono text-marca-500 transition-transform group-open:rotate-45"
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
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-marca-500">
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
