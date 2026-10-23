/**
 * Datos estructurados para buscadores (JSON-LD).
 *
 * `JSON.stringify` no escapa `<`, y este texto va dentro de una etiqueta
 * <script>. Una ficha técnica que contuviera `</script>` cerraría la etiqueta
 * antes de tiempo, rompería la página y dejaría ejecutar lo que viniera
 * detrás. Escapar `<` como `<` sigue siendo JSON válido y lo impide.
 */
export function JsonLd({ datos }: { datos: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(datos).replace(/</g, "\u003c"),
      }}
    />
  );
}
