import { site } from "@/config/sitio";
import { IconoFacebook, IconoInstagram, IconoTiktok } from "@/components/icons";

const REDES = [
  { clave: "instagram", nombre: "Instagram", Icono: IconoInstagram },
  { clave: "facebook", nombre: "Facebook", Icono: IconoFacebook },
  { clave: "tiktok", nombre: "TikTok", Icono: IconoTiktok },
] as const;

/** ¿Hay alguna red configurada? Sin ninguna, quien la usa no dibuja nada. */
export const hayRedes = REDES.some((r) => site.redes[r.clave]);

/**
 * Íconos de las redes sociales configuradas en `site.redes` (variables
 * NEXT_PUBLIC_INSTAGRAM, _FACEBOOK y _TIKTOK). Las vacías no aparecen.
 */
export function RedesSociales({ className = "" }: { className?: string }) {
  if (!hayRedes) return null;
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {REDES.filter((r) => site.redes[r.clave]).map(({ clave, nombre, Icono }) => (
        <li key={clave}>
          <a
            href={site.redes[clave]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={nombre}
            title={nombre}
            className="flex h-11 w-11 items-center justify-center text-carbon-300 transition-colors hover:text-marca-400"
          >
            <Icono className="h-5 w-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
