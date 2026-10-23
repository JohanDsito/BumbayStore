---
name: Bumbay Store
description: Un portal vivo. Un campo de luz con un filamento por nicho respira detrás del catálogo.
colors:
  noche-950: "#07080d"
  noche-900: "#0c0e17"
  noche-850: "#11141f"
  noche-800: "#191c29"
  noche-750: "#212534"
  noche-700: "#2c3043"
  noche-600: "#444a63"
  noche-500: "#7b81a0"
  noche-400: "#959bb5"
  noche-300: "#bcc0d3"
  noche-200: "#d9dbe6"
  noche-100: "#edeef4"
  noche-50: "#f7f8fb"
  turquesa-store: "#12acaa"
  rojo-bumbay: "#ec080f"
  ambar-hogar: "#ffb21a"
  violeta-tecnologia: "#8b5cff"
  panel-foto: "#e4e6ee"
  disponible: "#35d07f"
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
    textColor: "{colors.noche-950}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.noche-100}"
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
    textColor: "{colors.noche-950}"
    rounded: "{rounded.none}"
    height: "56px"
    padding: "0 32px"
  card-product:
    backgroundColor: "{colors.noche-900}"
    textColor: "{colors.noche-100}"
    rounded: "{rounded.none}"
    padding: "16px"
  input-field:
    backgroundColor: "{colors.noche-950}"
    textColor: "{colors.noche-100}"
    rounded: "{rounded.none}"
    height: "40px"
    padding: "0 12px"
---

# Design System: Bumbay Store

<!--
  Construido el 2026-10-22 a partir de la dirección elegida por el dueño
  (portal con campo de luz). Los nombres de los tokens en el código siguen
  siendo `carbon-*` y `marca-*`; aquí van con su nombre de diseño (`noche-*`,
  y el color de acento de cada nicho). La identidad anterior, "catálogo
  técnico de taller", sigue viva como submarca dentro de herramientas.
-->

## Overview

**Creative North Star: "El portal vivo"**

La tienda es un portal: detrás del catálogo respira un campo de luz, y cada línea de negocio es un filamento de su propio color. En la portada general los filamentos conviven y el índice de nichos enciende el suyo al pasar; al entrar en un nicho, el campo entero se funde a su color sin recargar la página. La interfaz flota encima en tipografía condensada y fina, con mucho fondo noche alrededor.

El campo es el único momento de movimiento autorado del sitio, y está gobernado por el rendimiento: se dibuja a fracción de resolución, se congela al pasar la primera pantalla, se queda quieto con el movimiento reducido y se reemplaza por un póster en CSS cuando el equipo no da. El contenido nunca lo espera. Bajo la primera pantalla la tienda es un catálogo sobrio y denso: productos sobre un panel claro y suave, datos en mono, acciones de contorno.

Bumbay Tools conserva su firma de taller dentro de su nicho: la cinta de precaución, las esquinas técnicas de las tarjetas y el rojo exacto del logotipo.

**Key Characteristics:**
- Fondo noche casi negro azulado, sin retícula; el campo de luz es la única textura.
- El color de marca cambia con el nicho: turquesa de Bumbay Store en la tienda, rojo en Bumbay Tools, el suyo en cada nicho. Todo lo demás es noche.
- Titulares en Archivo al 62 % de ancho, en mayúsculas y enormes; rótulos al 112 % de ancho, diminutos y espaciados.
- Esquinas rectas en todo; el vidrio oscuro solo donde hay texto sobre el campo.
- Fotos de producto fundidas sobre un panel gris azulado, nunca sobre blanco puro.

## Colors

Una escala de noche azulada casi sin color, para que los filamentos de cada nicho sean lo único saturado de la pantalla.

### Primary
- **Turquesa Store** (turquesa-store): el color de Bumbay Store, tomado de su logo. Es el acento de la portada general, del encabezado, del pie y del pedido. Tinta oscura encima.

### Secondary
- **Rojo Bumbay** (rojo-bumbay): el color de Bumbay Tools y de la "A" de su logo. Es el acento del nicho de herramientas, no de la tienda.
- **Acento de nicho** (ámbar-hogar, violeta-tecnologia y los que se creen): cada nicho trae su color desde la base de datos. Dentro del nicho reemplaza al turquesa en botones, enlaces, titulares y en el campo. La tinta sobre el acento se calcula: blanca sobre rojo o violeta, oscura sobre turquesa o ámbar.
- **Verde disponible** (disponible): WhatsApp y el estado "Disponible". Nunca decora.

### Tertiary
- **Ámbar alerta** (alerta): avisos. Uso mínimo.

### Neutral
- **Noche vacío** (noche-950): el fondo y el campo.
- **Noche panel** (noche-900, noche-850): tarjetas, cajones, campos de formulario.
- **Noche línea** (noche-800, noche-700, noche-600): bordes de 1 px y divisores.
- **Gris lavanda** (noche-500, noche-400): texto secundario y rótulos. noche-500 es el más tenue que cumple 4.5:1 sobre el fondo.
- **Niebla** (noche-300, noche-200): párrafos.
- **Blanco luna** (noche-100, noche-50): titulares y texto principal.
- **Panel de foto** (panel-foto): el fondo donde se apoyan las fotos de producto.

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
- **Headline** (800, 30 → 48 px, ancho 75 %): títulos de sección y nombre del producto en su ficha. Sin mayúsculas.
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
- **Panel** (`0 1px 2px rgb(0 0 0 / 0.4), 0 8px 24px -12px rgb(0 0 0 / 0.6)`): paneles superpuestos como la vista rápida.
- **Flotante** (`0 -1px 0 rgb(255 255 255 / 0.06), 0 -12px 40px -8px rgb(0 0 0 / 0.7)`): la barra de pedido y el cajón, que suben desde abajo.

### Named Rules
**La Regla del Vidrio con Motivo.** El desenfoque existe solo donde hay texto sobre el campo. Un panel de vidrio sobre fondo liso es adorno.

## Shapes

Esquinas rectas en todo (0 px; 2 px como máximo en paneles). Bordes de 1 px. El único círculo es el punto de estado (disponible, línea activa). Las tarjetas de producto de Bumbay Tools llevan las esquinas técnicas, que se encienden en el acento al pasar.

## Components

### Buttons
- **Shape:** rectos.
- **Primary:** fondo del acento, tinta calculada, rótulo de 11 px, alto 48 px (56 px en la ficha), sombra de brillo. Hover al acento aclarado; al presionar, 0.98.
- **Secondary:** borde noche-600 sobre noche al 40 %; se enciende en verde si lleva a WhatsApp.
- **Agregar en grillas:** contorno del acento al 70 %, texto en el acento aclarado; se llena al pasar el cursor. Lleno solo en la ficha: veinte botones llenos seguidos son una pared de color.
- **WhatsApp:** verde disponible con tinta noche; alto 56 px en los bloques de cierre.

### Cards / Containers
- **Corner Style:** rectas.
- **Background:** noche panel; la foto va sobre el panel de foto, fundida con `mix-blend-mode: multiply`.
- **Border:** 1 px noche-800, a noche-600 al pasar.
- **Internal Padding:** 14–16 px.

### Inputs / Fields
- **Style:** noche al 60 %, borde 1 px noche-700, alto 40–44 px, rectos.
- **Focus:** borde en el acento aclarado; el cursor de texto también.
- **Error:** borde en el acento y fondo teñido al 10 %, mensaje bajo el campo.

### Navigation
- **Style:** encabezado casi opaco; nichos en rótulo, con una raya de 1 px en el acento bajo el activo que crece desde la izquierda.
- **Mobile:** buscador en su fila; menú desplegable agrupado por nicho.

### Campo de luz
La firma del sistema: un lienzo WebGL fijo en el layout de la tienda, detrás de todo. Un filamento por nicho (núcleo fino, halo y partículas que solo se encienden cerca del filamento); el puntero los curva al pasar. Se funde al color del nicho al navegar. Presupuesto: 50 % de la resolución en escritorio y 35 % en celular, 30 cuadros en celular, congelado bajo la primera pantalla y con la pestaña oculta, una imagen quieta con el movimiento reducido, y póster CSS sin WebGL, con ahorro de datos o con poca memoria.

### Titular animado
Al cargar una portada, las letras del titular suben y se enderezan una a una (CSS puro, `letra-entra`), y la segunda línea entra justo después. El ritmo vive en tres variables de `globals.css`: `--letra-duracion` (760 ms), `--letra-paso` (26 ms entre letras) y `--linea-pausa` (140 ms). Con movimiento reducido el titular aparece entero de inmediato. Para los lectores de pantalla el título es una sola frase.

### Índice de portada
Lista de nichos (o de categorías, dentro de un nicho) con su conteo en mono, a la izquierda del titular. En la portada general, pasar por una entrada enciende su filamento y la lectura del campo dice su nombre.

### Logos
Los dos logos son imágenes del negocio, recortadas sobre fondo transparente en `public/marca/` y nunca redibujadas: Bumbay Store (letra manuscrita blanca con sombra turquesa) en el encabezado, el pie y el panel; Bumbay Tools (bloque blanco con la "A" roja) sobre el titular de su nicho.

### Cinta de precaución (Bumbay Tools)
Franjas en el acento a 45°, 4 px de alto, sobre la portada del nicho de herramientas. Solo ahí.

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
- **Don't** usar la cinta de precaución fuera de Bumbay Tools.
- **Don't** agregar un segundo efecto animado de fondo o entradas escalonadas en cada grilla.
- **Don't** poner una pantalla de carga ni hacer esperar el contenido al campo.
