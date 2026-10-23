import Image from "next/image";
import { imagenUrl } from "@/infraestructura/imagen-url";

type Props = {
  imagen: string | null;
  nombre: string;
  sku: string;
  /** La primera imagen visible de la página se precarga para mejorar el LCP. */
  prioridad?: boolean;
  sizes?: string;
  className?: string;
  /**
   * Clases que definen la proporción del marco. Por defecto cuadrado; la
   * vista previa lo limita en alto para que el botón de compra no quede
   * fuera de pantalla en celular.
   */
  aspecto?: string;
};

/**
 * Imagen de producto sobre panel claro.
 *
 * Las fotos de producto casi siempre vienen con fondo blanco, así que el
 * panel claro dentro del sitio oscuro no es solo estética: evita que las fotos
 * se vean como rectángulos brillantes recortados.
 */
export function ImagenProducto({
  imagen,
  nombre,
  sku,
  prioridad = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px",
  className = "",
  aspecto = "aspect-square",
}: Props) {
  const url = imagenUrl(imagen);

  return (
    <div
      className={`relative overflow-hidden bg-[#e4e6ee] ${aspecto} ${className}`}
    >
      {url ? (
        <Image
          src={url}
          alt={nombre}
          fill
          sizes={sizes}
          priority={prioridad}
          // Multiplicar funde el fondo blanco de la foto con el panel: el
          // producto queda recortado sobre un gris que no deslumbra de noche.
          className="object-contain p-4 mix-blend-multiply transition-transform duration-500 ease-[var(--ease-salida)] group-hover:scale-[1.04]"
        />
      ) : (
        <MarcadorPosicion sku={sku} />
      )}
    </div>
  );
}

/**
 * Sin foto todavía: en vez de un icono roto, dibujamos una ficha de plano
 * técnico con el código del producto. Se ve intencional, no defectuoso.
 */
function MarcadorPosicion({ sku }: { sku: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#e4e6ee]">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(10 10 11 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(10 10 11 / 0.07) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <svg
        viewBox="0 0 48 48"
        className="relative h-12 w-12 text-carbon-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* Una caja: el producto todavía viene en camino. Sirve igual para
            una herramienta que para una olla. */}
        <path d="M24 6 40 14v20L24 42 8 34V14Z" />
        <path d="M8 14l16 8 16-8M24 22v20M16 10l16 8" />
      </svg>
      <span className="relative font-mono text-[10px] tracking-[0.18em] text-carbon-500">
        {sku}
      </span>
    </div>
  );
}
