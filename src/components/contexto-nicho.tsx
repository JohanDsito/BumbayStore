import { tintaSobre } from "@/dominio/color";
import { FijarCampo } from "@/components/fijar-campo";

/**
 * Pinta lo que contiene con el color de un nicho.
 *
 * Las variables se ponen en el HTML del servidor, así que los botones y
 * enlaces salen ya del color correcto, sin un parpadeo rojo al cargar. El
 * campo de luz se entera aparte y hace su fundido.
 *
 * `intensidad` baja el campo donde hay texto largo encima (fichas,
 * categorías) y lo deja entero en las portadas.
 */
export function ContextoNicho({
  acento,
  intensidad,
  children,
}: {
  acento: string | null;
  intensidad: number;
  children: React.ReactNode;
}) {
  const estilo = acento
    ? ({ "--acento": acento, "--acento-tinta": tintaSobre(acento) } as React.CSSProperties)
    : undefined;

  return (
    <div style={estilo}>
      <FijarCampo acento={acento} intensidad={intensidad} />
      {children}
    </div>
  );
}
