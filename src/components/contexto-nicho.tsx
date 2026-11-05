import { variablesAcento } from "@/config/tema";
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
  const estilo = acento ? (variablesAcento(acento) as React.CSSProperties) : undefined;

  // La clase hace que --acento-texto se resuelva aquí, con el color del nicho
  // (ver .contexto-nicho en globals.css).
  return (
    <div style={estilo} className={acento ? "contexto-nicho" : undefined}>
      <FijarCampo acento={acento} intensidad={intensidad} />
      {children}
    </div>
  );
}
