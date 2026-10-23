import Image from "next/image";

/**
 * Los logos de la marca, recortados de sus piezas originales sobre fondo
 * transparente (public/marca). Van como imagen y no redibujados: son los
 * que el negocio ya usa en redes y empaques.
 */

/** Bumbay Store: la tienda. Encabezado, pie y panel. */
export function LogoStore({ className = "", prioridad = false }: { className?: string; prioridad?: boolean }) {
  return (
    <Image
      src="/marca/bumbay-store.png"
      alt="Bumbay Store"
      width={895}
      height={380}
      priority={prioridad}
      className={`h-auto ${className}`}
    />
  );
}

/** Bumbay Tools: la submarca del nicho de herramientas. */
export function LogoTools({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/marca/bumbay-tools.png"
      alt="Bumbay Tools"
      width={1600}
      height={346}
      className={`h-auto ${className}`}
    />
  );
}
