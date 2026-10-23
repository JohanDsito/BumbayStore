---
version: 1
slug: "src-app-tienda-page-tsx"
primary_target: "src/app/(tienda)/page.tsx"
related_targets: ["src/app/(tienda)/[nicho]/page.tsx","src/app/(tienda)/layout.tsx"]
---

# Portada de Bumbay Store (y su mundo, que hereda toda la tienda)

Modo: Persuade. Audiencia: cliente final y negocios en Colombia, casi siempre en celular de gama media. Acción: agregar productos al pedido y enviarlo por WhatsApp. Prueba: catálogo real con precio único; fotos de bodega y despachos cuando el negocio las entregue (hoy no hay: no inventarlas). Restricciones: la velocidad en celular manda sobre el efecto (PRODUCT.md); Bumbay Tools conserva su rojo y su cinta de precaución dentro de su nicho; no verse plantilla, barata ni poco profesional.

Rendimiento obligatorio del campo de luz: WebGL a resolución reducida (0.5 en escritorio, 0.35 en celular), 30 fps en celular, arranca después de pintar el contenido, se congela al pasar la primera pantalla y con la pestaña oculta; sin WebGL, con ahorro de datos, poca memoria o movimiento reducido, se muestra un póster CSS con el mismo aspecto. Sin pantalla de carga con porcentaje.

Momento memorable: al pasar por un nicho su filamento se enciende; al entrar en él, el campo entero cambia a su color sin recargar.

## Direction contract

THESIS: La tienda es un portal vivo: un campo de luz respira detrás del catálogo con un filamento por cada nicho. Rechaza la tienda plantilla de banner, carrusel de ofertas y grilla blanca.

OWN-WORLD: Fondo noche casi negro azulado con grano fino; filamentos de luz en el color de cada nicho (rojo Bumbay en herramientas, ámbar en hogar, cian en tecnología); titulares en Archivo ultracondensado y enorme; rótulos diminutos en mayúsculas espaciadas; botones de borde fino con brillo interior; tarjetas de vidrio oscuro con borde de 1 px; precios y códigos en mono tabular.

STORY: El visitante entiende que es un importador directo con varias líneas y un solo precio, cree que es serio y moderno, y arma su pedido para enviarlo por WhatsApp.

FIRST VIEWPORT: Izquierda, el índice de nichos con su conteo de productos, que tiñe el campo al pasar. Centro, titular gigante en dos líneas; debajo, una línea espaciada y dos botones (Ver catálogo, Pedir por WhatsApp). Derecha, el campo con la lectura del nicho activo. Abajo, la fila de destacados con «Agregar» funcionando.

FORM: Portal de estudio experimental con campo de shader a pantalla completa, adoptado por el usuario pese al veredicto; fuera de la lista propia. seed:ccaf86b3df3ef7c8. Interacción firma: el campo persiste entre páginas y cambia de color al navegar entre nichos.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
