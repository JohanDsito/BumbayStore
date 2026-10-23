/**
 * El titular de una portada, con entrada letra por letra.
 *
 * Solo CSS: cada letra es un `span` con su número de orden (`--n`), y la
 * animación `letra-entra` de globals.css la sube y la aparece con un retraso
 * proporcional. No hay JavaScript que esperar, así que corre aunque la página
 * esté ocupada cargando, y con el movimiento reducido las letras aparecen
 * sin desplazarse.
 *
 * Para los lectores de pantalla el título es una sola frase (`aria-label`);
 * las letras sueltas van ocultas para no leerse una por una.
 *
 * El ritmo se ajusta en globals.css (--letra-duracion, --letra-paso,
 * --linea-pausa) sin tocar este componente.
 */
export function TitularAnimado({
  texto,
  className = "",
  acentoClassName = "",
}: {
  /** Una o dos líneas separadas por salto de línea; la segunda va en el acento. */
  texto: string;
  className?: string;
  acentoClassName?: string;
}) {
  const [primera, ...resto] = texto.split("\n");
  const segunda = resto.join(" ").trim();
  const lineas = segunda ? [primera, segunda] : [primera];

  // Cada letra lleva su posición en el título entero, para que la segunda
  // línea siga donde terminó la primera.
  let n = 0;

  return (
    <h1 aria-label={lineas.join(" ")} className={className}>
      {lineas.map((linea, l) => (
        <span
          key={l}
          aria-hidden
          className={`block ${l === 1 ? acentoClassName : ""}`}
          style={{ "--linea": l } as React.CSSProperties}
        >
          {linea.split(" ").map((palabra, p, palabras) => (
            <span key={p}>
              {/* La palabra no se parte entre renglones. */}
              <span className="inline-block whitespace-nowrap">
                {[...palabra].map((letra, i) => (
                  <span
                    key={i}
                    className="letra-entra"
                    style={{ "--n": n++ } as React.CSSProperties}
                  >
                    {letra}
                  </span>
                ))}
              </span>
              {p < palabras.length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
