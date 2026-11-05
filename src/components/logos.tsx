import Image from "next/image";

/**
 * Los logos de la marca, recortados de sus piezas originales sobre fondo
 * transparente (public/marca). Van como imagen y no redibujados: son los
 * que el negocio ya usa en redes y empaques.
 *
 * Cada uno tiene dos versiones: la original, con letras blancas, para el tema
 * oscuro, y una con las letras en tinta noche para el claro (`-claro.png`,
 * mismo color de acento). La que no corresponde al tema queda oculta por CSS.
 * Las de fondo claro se sacaron de las originales mientras llega el logo
 * oficial en SVG con sus dos versiones.
 */

type Props = { className?: string; prioridad?: boolean };

function Logo({
  archivo,
  alt,
  ancho,
  alto,
  className = "",
  prioridad = false,
}: Props & { archivo: string; alt: string; ancho: number; alto: number }) {
  return (
    <>
      <Image
        src={`/marca/${archivo}-claro.png`}
        alt={alt}
        width={ancho}
        height={alto}
        priority={prioridad}
        className={`h-auto oscuro:hidden ${className}`}
      />
      <Image
        src={`/marca/${archivo}.png`}
        alt={alt}
        width={ancho}
        height={alto}
        priority={prioridad}
        className={`hidden h-auto oscuro:block ${className}`}
      />
    </>
  );
}

/** Bumbay Store: la tienda. Encabezado, pie y panel. */
export function LogoStore(props: Props) {
  return <Logo archivo="bumbay-store" alt="Bumbay Store" ancho={895} alto={380} {...props} />;
}

/** Bumbay Tools: la submarca del nicho de herramientas. */
export function LogoTools(props: Props) {
  return <Logo archivo="bumbay-tools" alt="Bumbay Tools" ancho={1600} alto={346} {...props} />;
}
