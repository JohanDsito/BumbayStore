import Image from "next/image";
import { imagenUrl } from "@/lib/imagen-url";

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
 * Las fotos de herramienta casi siempre vienen con fondo blanco, así que el
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
      className={`relative overflow-hidden bg-carbon-50 ${aspecto} ${className}`}
    >
      {url ? (
        <Image
          src={url}
          alt={nombre}
          fill
          sizes={sizes}
          priority={prioridad}
          className="object-contain p-4 transition-transform duration-500 ease-[var(--ease-salida)] group-hover:scale-[1.04]"
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
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-carbon-100">
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
        <path d="M31 11a7 7 0 0 0-9.6 8.4L11 29.8l7.2 7.2 10.4-10.4A7 7 0 0 0 37 17l-4.1 4.1-3.2-.8-.8-3.2Z" />
      </svg>
      <span className="relative font-mono text-[10px] tracking-[0.18em] text-carbon-500">
        {sku}
      </span>
    </div>
  );
}
