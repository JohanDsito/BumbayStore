---
name: Bumbay Store
description: Un portal vivo. Un campo de luz con un filamento por nicho respira detrás del catálogo.
colors:
  # Tema claro (predeterminado). Los mismos nombres con -oscuro son el tema oscuro.
  fondo: "#ffffff"
  superficie: "#ffffff"
  hundido: "#f1f3f6"
  linea: "#e0e3ea"
  borde: "#cdd1dc"
  borde-fuerte: "#a3a9ba"
  tinta-fuerte: "#0b0c12"
  tinta: "#1c1f2b"
  tinta-media: "#363b4d"
  tinta-suave: "#454b5f"
  tinta-tenue: "#535970"
  panel-foto: "#eef0f4"
  disponible: "#0b6e3a"
  fondo-oscuro: "#07080d"
  superficie-oscuro: "#0c0e17"
  hundido-oscuro: "#11141f"
  linea-oscuro: "#191c29"
  borde-oscuro: "#2c3043"
  borde-fuerte-oscuro: "#444a63"
  tinta-fuerte-oscuro: "#f7f8fb"
  tinta-oscuro: "#e6e8f0"
  tinta-media-oscuro: "#bcc0d3"
  tinta-suave-oscuro: "#a1a7bf"
  tinta-tenue-oscuro: "#8c92ae"
  panel-foto-oscuro: "#e4e6ee"
  disponible-oscuro: "#35d07f"
  noche: "#0b0c12"
  turquesa-store: "#12acaa"
  rojo-bumbay: "#ec080f"
  ambar-hogar: "#ffb21a"
  violeta-tecnologia: "#8b5cff"
  alerta: "#ffc53d"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 11.5vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 62"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 75"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.22em"
    fontVariation: "\"wdth\" 112"
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  none: "0px"
  panel: "2px"
spacing:
  gutter-mobile: "16px"
  gutter-desktop: "24px"
  container: "1400px"
components:
  button-primary:
    backgroundColor: "{colors.turquesa-store}"
    textColor: "{colors.noche}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 28px"
  button-add-grid:
    backgroundColor: "transparent"
    textColor: "{colors.turquesa-store}"
    rounded: "{rounded.none}"
    height: "40px"
  button-whatsapp:
    backgroundColor: "{colors.disponible}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    height: "56px"
    padding: "0 32px"
  card-product:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    padding: "16px"
  input-field:
    backgroundColor: "{colors.hundido}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.none}"
    height: "40px"
    padding: "0 12px"
---

# Design System: Bumbay Store

<!--
  Construido el 2026-10-22 a partir de la dirección elegida por el dueño
  (portal con campo de luz). Desde noviembre de 2026 tiene dos temas: claro
  (el predeterminado) y oscuro (la noche original). Los componentes usan
  colores por función (`fondo`, `superficie`, `tinta`…, ver Colors), nunca un
  tono fijo; cada función tiene su valor en cada tema en src/app/globals.css.
-->

## Overview

**Creative North Star: "El portal vivo"**

La tienda es un portal: detrás del catálogo respira un campo de luz, y cada línea de negocio es un filamento de su propio color. En la portada general los filamentos conviven y el índice de nichos enciende el suyo al pasar; al entrar en un nicho, el campo entero se funde a su color sin recargar la página. La interfaz flota encima en tipografía condensada y fina, con mucho fondo noche alrededor.

El campo es el único momento de movimiento autorado del sitio, y está gobernado por el rendimiento: se dibuja a fracción de resolución, se congela al pasar la primera pantalla, se queda quieto con el movimiento reducido y se reemplaza por un póster en CSS cuando el equipo no da. El contenido nunca lo espera. Bajo la primera pantalla la tienda es un catálogo sobrio y denso: productos sobre un panel claro y suave, datos en mono, acciones de contorno.

Bumbay Tools conserva su firma dentro de su nicho: su logotipo sobre el titular y el rojo exacto del logotipo como acento. La cinta de precaución que llevaba su portada se quitó a pedido del equipo (noviembre de 2026).

**Key Characteristics:**
- Dos temas, con el ritmo de una vitrina (referencia del equipo: eu.neewer.com): arriba un escenario de noche con el campo de luz (cabecera y portada), en medio la tienda, y abajo el pie de noche que la cierra. En el claro (predeterminado) la tienda es blanca y la franja de confianza gris; en el oscuro, todo es noche. El campo es luz sobre la noche en los dos temas y vive en el escenario: la tienda debajo tiene fondo sólido.
- Los productos mandan: fila de categorías con la foto de uno de sus productos, tarjetas sin caja ni borde con la foto grande, títulos de sección enormes en mayúsculas condensadas.
- El color de marca cambia con el nicho: turquesa de Bumbay Store en la tienda, rojo en Bumbay Tools, el suyo en cada nicho. Todo lo demás es neutro.
- Titulares en Archivo al 62 % de ancho, en mayúsculas y enormes; rótulos al 112 % de ancho, diminutos y espaciados.
- Esquinas rectas en todo; el vidrio solo donde hay texto sobre el campo.
- Fotos de producto fundidas sobre un panel gris azulado muy claro, nunca sobre blanco puro.

## Colors

Neutros azulados casi sin color, para que los filamentos de cada nicho sean lo único saturado de la pantalla. Cada neutro es una función, con un valor por tema:

| Función | Uso | Claro | Oscuro |
|---|---|---|---|
| `fondo` | la página | #ffffff | #07080d |
| `superficie` | tarjetas, paneles, cajones | #ffffff | #0c0e17 |
| `hundido` | campos de formulario, franja de confianza | #f1f3f6 | #11141f |
| `linea` | separadores de 1 px | #e0e3ea | #191c29 |
| `borde` / `borde-fuerte` | contornos de controles; al pasar | #cdd1dc / #a3a9ba | #2c3043 / #444a63 |
| `tinta-fuerte` | titulares, precios | #0b0c12 | #f7f8fb |
| `tinta` | texto corriente | #1c1f2b | #e6e8f0 |
| `tinta-media` | párrafos secundarios | #363b4d | #bcc0d3 |
| `tinta-suave` | rótulos | #454b5f | #a1a7bf |
| `tinta-tenue` | lo mínimo: códigos, notas, marcadores | #535970 | #8c92ae |
| `panel-foto` | detrás de las fotos de producto (claro en los dos) | #eef0f4 | #e4e6ee |
| `disponible` | WhatsApp y "Disponible" | #0b6e3a, tinta blanca | #35d07f, tinta noche |
| `noche` | tinta fija: sobre amarillo, sobre fotos y sobre el panel de foto | #0b0c12 | #0b0c12 |

Todos los textos cumplen WCAG AA (4,5:1; 3:1 los grandes) contra su fondo real en los dos temas, incluido el campo de luz: medido en noviembre de 2026 sobre capturas con el texto oculto, en portada, nicho, categoría, ficha, búsqueda, pedido y acceso al panel, a 390 y 1440 px.

### Primary
- **Turquesa Store** (turquesa-store): el color de Bumbay Store, tomado de su logo. Es el acento de la portada general, del encabezado, del pie y del pedido. Tinta oscura encima.

### Secondary
- **Rojo Bumbay** (rojo-bumbay): el color de Bumbay Tools y de la "A" de su logo. Es el acento del nicho de herramientas, no de la tienda.
- **Acento de nicho** (ámbar-hogar, violeta-tecnologia y los que se creen): cada nicho trae su color desde la base de datos. Dentro del nicho reemplaza al turquesa en botones, enlaces, titulares y en el campo. La tinta sobre el acento se calcula: blanca sobre rojo o violeta, oscura sobre turquesa o ámbar.
- **Acento como texto** (`acento-texto`): el acento cuando va en letras. Es el mismo color si ya se lee sobre las superficies del tema; si no, se oscurece (claro) o aclara (oscuro) lo justo para llegar a 4,5:1 (`acentoLegible` en src/dominio/color.ts). Por eso el turquesa queda igual en el oscuro y algo más hondo en el claro, y un ámbar nuevo se lee sin que nadie lo ajuste a mano. Botones y bordes siguen usando el acento puro.
- **Verde disponible** (disponible): WhatsApp y el estado "Disponible". Nunca decora.

### Tertiary
- **Ámbar alerta** (alerta): avisos. Uso mínimo.

### Neutral
Ver la tabla de funciones arriba. `tinta-tenue` es el texto más tenue permitido: cumple 4,5:1 sobre todas las superficies de su tema.

### Tema
- El claro es el predeterminado. El botón de la cabecera (tienda y panel) cambia al otro y la elección se guarda en el navegador (`bumbay:tema`).
- Un script en el `<head>` pone `data-tema="oscuro"` antes de pintar: nunca se ve un cuadro del tema equivocado.
- Lo que no es color (qué versión del logo se ve) usa la variante `oscuro:`. Los colores nunca se duplican con ella: para eso están las funciones.
- Los logos tienen versión para fondo claro (letras en tinta noche, mismo turquesa y rojo) mientras llega el oficial en SVG.

### Named Rules
**La Regla del Filamento Propio.** Un color saturado en pantalla pertenece a un nicho. Si no es el acento de la página ni el verde de WhatsApp, no va.

**La Regla de la Tinta Calculada.** Nunca se escribe `text-white` sobre el acento: la tinta sale de `--acento-tinta`, que el servidor calcula por contraste para cada nicho.

## Typography

**Display Font:** Archivo variable, ancho 62 % (con ui-sans-serif, system-ui)
**Body Font:** Archivo, ancho 100 %
**Label Font:** Archivo, ancho 112 %
**Data Font:** IBM Plex Mono (con ui-monospace)

**Character:** Una sola familia variable hace tres voces: el titular estrecho y alto del portal, el texto normal y el rótulo ancho y espaciado. El mono queda para datos que se comparan o se copian.

### Hierarchy
- **Display** (700, 44 → 96 px, interlínea 0.86, mayúsculas, ancho 62 %): el titular de cada portada y el nombre de una categoría. Dos líneas; la segunda va en el acento.
- **Section** (700, 40 → 60 px, interlínea 0.86, mayúsculas, ancho 62 %, la clase `titular`): títulos de sección de la tienda ("Destacados", "Todo el catálogo"). Marcan dónde empieza cada parte, como un rótulo de vitrina.
- **Headline** (800, 30 → 48 px, ancho 75 %): nombre del producto en su ficha y el bloque mayorista. Sin mayúsculas.
- **Title** (600, 14–15 px): nombres en tarjetas y en el índice.
- **Body** (400, 15–16 px, interlínea 1.625): presentaciones y fichas técnicas; máximo 52–60 caracteres por línea.
- **Label** (500, 11 px, tracking 0.22em, mayúsculas, ancho 112 %): navegación, rótulos de sección, etiquetas de campo, lecturas del campo.
- **Data** (Plex Mono 600, cifras tabulares): precios, SKU, conteos.

### Named Rules
**La Regla del Rótulo Encabezado.** Un rótulo puede encabezar una lista o una sección, nunca ir encima de un titular como etiqueta. El titular habla solo.

**La Regla del Dato en Mono.** Plex Mono solo para lo que se compara o se copia. Una etiqueta escrita en mono para parecer técnica es un disfraz.

## Layout

Contenedor de 1400 px como máximo, margen lateral de 16 px en celular y 24 px desde 640 px. La primera pantalla de cada portada es una retícula de dos columnas: a la izquierda el índice (200 px) con la lectura del campo debajo, y a la derecha el titular con todo el ancho. La lectura no flota sobre el titular: con titulares largos o muchas cifras chocaban. En celular se apila: titular, línea clave, acciones, índice. Bajo la primera pantalla, grillas de 2 columnas en celular y 3–4 en escritorio, con secciones separadas por un borde fino y 40–64 px de aire. El encabezado tiene una fila de nichos y, dentro de un nicho, una segunda fila con sus categorías.

## Elevation & Depth

Profundidad por capas tonales de la noche y por el campo detrás de todo. Los paneles que flotan sobre el campo con texto encima (precio, especificaciones, bloque mayorista) son vidrio oscuro: noche al 72 % con desenfoque de 14 px, porque es lo que deja leer sobre los filamentos. El encabezado es casi opaco (92 %) para que las fotos claras no se transparenten al bajar.

### Shadow Vocabulary
- **Brillo** (`inset 0 1px 0 rgb(255 255 255 / 0.28), inset 0 -1px 0 rgb(0 0 0 / 0.18)`): el botón principal. La luz del campo reflejada en su canto, sin halo de color alrededor.
- **Panel**: paneles superpuestos como la vista rápida. Oscuro: `0 1px 2px rgb(0 0 0 / 0.4), 0 8px 24px -12px rgb(0 0 0 / 0.6)`; claro, la misma forma en noche azulada al 6 % y 18 %.
- **Flotante**: la barra de pedido y el cajón, que suben desde abajo. Oscuro: `0 -1px 0 rgb(255 255 255 / 0.06), 0 -12px 40px -8px rgb(0 0 0 / 0.7)`; claro, más suave (22 %).
- **Halo del titular**: el titular lleva un `text-shadow` del color del fondo (0,08 y 0,3 em) para que un filamento no pase pegado a las letras.

### Named Rules
**La Regla del Vidrio con Motivo.** El desenfoque existe solo donde hay texto sobre el campo. Un panel de vidrio sobre fondo liso es adorno.

## Shapes

Esquinas rectas en todo (0 px; 2 px como máximo en paneles). Bordes de 1 px. El único círculo es el punto de estado (disponible, línea activa).

## Components

### Buttons
- **Shape:** rectos.
- **Primary:** fondo del acento, tinta calculada, rótulo de 11 px, alto 48 px (56 px en la ficha), sombra de brillo. Hover al acento aclarado; al presionar, 0.98.
- **Secondary:** borde `borde-fuerte` sobre el fondo al 40 %; se enciende en verde si lleva a WhatsApp.
- **Agregar en grillas:** contorno del acento al 70 %, texto en `acento-texto`; se llena al pasar el cursor. Lleno solo en la ficha: veinte botones llenos seguidos son una pared de color.
- **WhatsApp:** verde `disponible` con su tinta (`sobre-disponible`); alto 56 px en los bloques de cierre.

### Cards / Containers
- **Corner Style:** rectas.
- **Tarjeta de producto:** sin caja ni borde. La foto sobre el panel de foto, fundida con `mix-blend-mode: multiply` (el panel es claro en los dos temas, así la mezcla funciona igual), crece un 4 % al pasar; debajo, código, nombre, precio y "Agregar". El fondo de la tarjeta es `fondo`: invisible, pero tapa el campo donde la tarjeta va sobre él. El enlace del nombre cubre la tarjeta entera, foto incluida: entre él y el `<article>` no puede haber otro bloque posicionado.
- **Etiquetas sobre fotos:** noche al 70 % con texto blanco.
- **Paneles** (vista rápida, pedido, bloque mayorista): `superficie` o vidrio, borde 1 px `linea` o `borde`.

### Inputs / Fields
- **Style:** `hundido`, borde 1 px `borde`, alto 40–44 px, rectos.
- **Focus:** borde en el acento; el anillo de foco y el cursor de texto en `acento-texto`.
- **Error:** borde en el acento y fondo teñido al 10 %, mensaje bajo el campo.

### Navigation
- **Style:** encabezado casi opaco; nichos en rótulo, con una raya de 1 px en el acento bajo el activo que crece desde la izquierda.
- **Mobile (bajo 1024 px):** tres columnas: menú a la izquierda, logo centrado de 148 px, pedido a la derecha; el buscador va en su propia fila. El menú despliega bajo la cabecera, fuera del flujo, con un velo noche al 75 % detrás: solo los nichos, uno por fila (56 px de alto), y al tocar uno se abren sus categorías y "Ver todo en {nicho} →", uno abierto a la vez. Al final, las redes configuradas y WhatsApp. Se cierra al navegar, al tocar fuera y con Escape, y devuelve el foco al botón.
- **Footer:** en celular, logo y WhatsApp en una fila, los nichos en línea (sin categorías) y el contacto en tres renglones con las redes como íconos. En computador, los nichos van en columnas de dos o tres, para que el pie crezca hacia el costado y no hacia abajo.

### Escenario
La clase `.escenario` le pone la noche a una zona en cualquier tema: la cabecera, la portada (y sus migas), la franja de arriba de cada categoría (migas, nombre, descripción y conteo) y el pie. Las fichas de producto no llevan escenario: en el claro son enteras claras. En el tema claro la tienda queda enmarcada por esas dos bandas de noche; en el oscuro no cambia nada. La capa del campo cubre en el claro solo hasta el final de la portada (`--alto-escenario`, que publica `MedirEscenario`); antes de medir, la portada pinta su propia noche, así nunca se ve texto claro sobre fondo claro. El campo se dibuja a la medida de su capa (la pantalla en el oscuro, el escenario en el claro), así los filamentos cruzan también una franja baja. Dentro del escenario, el CSS propio usa `--t-*` y no `--color-*`, que se calculan en la raíz; y los textos secundarios que van sobre el campo (índice, migas, lectura) usan `tinta-media` o `tinta-suave`, nunca `tinta-tenue`.

### Fila de categorías
Justo debajo del escenario: cada categoría con la foto de uno de sus productos (`fotoDeCategoria`: disponible y destacado primero), su nombre y su conteo. 112 px en celular y 148 px en computador, deslizable con el dedo. Se ve qué se vende antes de leer.

### Franja de confianza
Antes del pie, en una sola franja gris sin cajas: cuatro promesas verdaderas con su ícono (importador directo, envío a toda Colombia, pedido por WhatsApp, formas de pago). Si cambia una forma de pago, se cambia también aquí.

### Campo de luz
La firma del sistema: un lienzo WebGL en el layout de la tienda, detrás de todo; vive en el escenario (ver Escenario). Un filamento por nicho (núcleo fino, halo y partículas que solo se encienden cerca del filamento); el puntero los curva al pasar. Se funde al color del nicho al navegar. Presupuesto: 50 % de la resolución en escritorio y 35 % en celular, 30 cuadros en celular, congelado bajo la primera pantalla y con la pestaña oculta, una imagen quieta con el movimiento reducido, y póster CSS sin WebGL, con ahorro de datos o con poca memoria.

### Titular animado
Al cargar una portada, las letras del titular suben y se enderezan una a una (CSS puro, `letra-entra`), y la segunda línea entra justo después. El ritmo vive en tres variables de `globals.css`: `--letra-duracion` (760 ms), `--letra-paso` (26 ms entre letras) y `--linea-pausa` (140 ms). Con movimiento reducido el titular aparece entero de inmediato. Para los lectores de pantalla el título es una sola frase.

### Índice de portada
Lista de nichos (o de categorías, dentro de un nicho) con su conteo en mono, a la izquierda del titular. En la portada general, pasar por una entrada enciende su filamento y la lectura del campo dice su nombre. Solo en computador: en celular repetía lo que ya está en el menú.

### Logos
Los dos logos son imágenes del negocio, recortadas sobre fondo transparente en `public/marca/` y nunca redibujadas: Bumbay Store (letra manuscrita blanca con sombra turquesa) en el encabezado, el pie y el panel; Bumbay Tools (bloque blanco con la "A" roja) sobre el titular de su nicho.

## Do's and Don'ts

### Do:
- **Do** sacar el color de una página del nicho al que pertenece, con `ContextoNicho`, nunca escribirlo a mano.
- **Do** dejar el titular en dos líneas, con la segunda en el acento.
- **Do** apoyar las fotos de producto en el panel de foto con mezcla multiplicar.
- **Do** usar el contorno para "Agregar" en las grillas y el botón lleno solo en la ficha.
- **Do** mantener la entrada del titular y el campo como los únicos movimientos autorados de la página.
- **Do** dar a todo control táctil al menos 44 px de alto, y a todo texto funcional al menos 11 px.

### Don't:
- **Don't** poner un rótulo encima de un titular ni números de sección decorativos.
- **Don't** escribir `text-white` sobre el acento: usa la tinta calculada.
- **Don't** posicionar (`relative`) ningún bloque de la tarjeta de producto entre el `<article>` y el enlace del nombre: el enlace dejaría de cubrir la foto.
- **Don't** agregar un segundo efecto animado de fondo o entradas escalonadas en cada grilla.
- **Don't** poner una pantalla de carga ni hacer esperar el contenido al campo.
