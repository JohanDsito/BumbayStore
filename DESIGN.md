---
name: Bumbay Tools
description: Catálogo técnico de taller. Chrome oscuro industrial, producto sobre panel claro, datos en monoespaciada.
colors:
  carbon-950: "#0a0a0b"
  carbon-900: "#0f0f11"
  carbon-850: "#141417"
  carbon-800: "#1a1a1f"
  carbon-750: "#232329"
  carbon-700: "#2e2e36"
  carbon-600: "#454551"
  carbon-500: "#6b6b78"
  carbon-400: "#8e8e9c"
  carbon-300: "#b4b4bf"
  carbon-200: "#d6d6dd"
  carbon-100: "#ebebef"
  carbon-50: "#f6f6f8"
  marca-700: "#8f0409"
  marca-600: "#c2060c"
  marca-500: "#ec080f"
  marca-400: "#ff3b41"
  marca-300: "#ff8a8e"
  disponible: "#35d07f"
  alerta: "#ffc53d"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 7vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    letterSpacing: "0.2em"
  price:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  panel: "2px"
  none: "0px"
spacing:
  gutter-mobile: "16px"
  gutter-desktop: "24px"
  container: "1400px"
components:
  button-primary:
    backgroundColor: "{colors.marca-500}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 28px"
  button-primary-hover:
    backgroundColor: "{colors.marca-400}"
  button-whatsapp:
    backgroundColor: "{colors.disponible}"
    textColor: "{colors.carbon-950}"
    rounded: "{rounded.none}"
    height: "56px"
    padding: "0 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.carbon-100}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 28px"
  chip-category:
    backgroundColor: "{colors.carbon-900}"
    textColor: "{colors.carbon-300}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  card-product:
    backgroundColor: "{colors.carbon-900}"
    textColor: "{colors.carbon-100}"
    rounded: "{rounded.none}"
    padding: "16px"
  input-field:
    backgroundColor: "{colors.carbon-850}"
    textColor: "{colors.carbon-100}"
    rounded: "{rounded.none}"
    height: "44px"
    padding: "0 12px"
---

# Design System: Bumbay Tools

<!--
  Documenta el diseño que la tienda tiene hoy, el del nicho de herramientas.
  Es la referencia de partida para Bumbay Store: lo que aquí es "el mundo de
  Bumbay Tools" se conserva como acento de su nicho aunque la tienda general
  cambie de piel.
-->

## Overview

**Creative North Star: "El catálogo técnico de taller"**

La tienda se lee como una lista de precios profesional colgada en la pared de un taller: seria, precisa y sin adornos que no informen. El cromo es oscuro e industrial, y el producto aparece sobre un panel claro, como una pieza sobre la mesa de trabajo. Los datos que importan para comprar (código, precio, especificaciones) van en letra monoespaciada y cifras tabulares, alineados en columna como en una hoja técnica.

La densidad es media-alta: el visitante viene a comparar y armar un pedido, no a pasear. La marca habla con pocos elementos repetidos con disciplina: el rojo Bumbay en acciones y acentos, la cinta de precaución como firma, las esquinas de plano técnico en las tarjetas y una retícula de papel milimetrado apenas perceptible en el fondo.

**Key Characteristics:**
- Fondo carbón casi negro con retícula milimetrada sutil (72 px).
- Rojo Bumbay reservado para acción, acento y estado activo.
- Esquinas rectas: nada redondeado, todo cortado como lámina.
- Cifras y códigos en IBM Plex Mono tabular; títulos en Archivo extra negrita y apretada.
- Verde de disponibilidad exclusivo de WhatsApp y del estado "Disponible".

## Colors

Una escala de grises fríos que va del negro de la herramienta al blanco de la ficha técnica, un rojo de marca y dos colores de estado.

### Primary
- **Rojo Bumbay** (marca-500): el rojo exacto del logotipo. Botones de acción principal ("Agregar", "Ver catálogo"), la segunda línea de los titulares, la cinta de precaución, la selección de texto y el anillo de foco.
- **Rojo Bumbay claro** (marca-400): el mismo rojo levantado para texto pequeño y enlaces activos sobre fondo oscuro, donde marca-500 se queda corto de contraste; también el hover del botón principal.
- **Rojo profundo** (marca-600, marca-700): reservas para estados presionados y fondos teñidos.

### Secondary
- **Verde disponible** (disponible): WhatsApp y el indicador "Disponible". Nunca decora.

### Tertiary
- **Ámbar alerta** (alerta): avisos. Uso mínimo.

### Neutral
- **Carbón profundo** (carbon-950): fondo de página.
- **Carbón panel** (carbon-900, carbon-850): superficies de tarjetas, encabezado, pie y campos de formulario.
- **Carbón línea** (carbon-800, carbon-700): bordes de tarjeta, divisores y contorno de botones secundarios.
- **Gris acero** (carbon-500, carbon-400): etiquetas, códigos y texto secundario.
- **Gris claro** (carbon-300, carbon-200): texto de párrafo y navegación.
- **Blanco ficha** (carbon-100, carbon-50): texto principal, titulares, y el panel claro donde se apoya la foto del producto.

### Named Rules
**La Regla del Rojo con Propósito.** El rojo marca lo que se puede hacer (comprar, ver, enviar) o dónde se está (pestaña activa). Un rojo que no es acción ni estado sobra.

**La Regla del Verde de WhatsApp.** El verde existe para un solo destino: hablar por WhatsApp o confirmar que algo está disponible. Cualquier otro uso confunde la llamada principal del negocio.

## Typography

**Display Font:** Archivo (con ui-sans-serif, system-ui)
**Body Font:** Archivo (con ui-sans-serif, system-ui)
**Label/Mono Font:** IBM Plex Mono (con ui-monospace)

**Character:** Archivo en extra negrita y apretada hace de señalética de taller; IBM Plex Mono hace de etiqueta de inventario. La sans habla, la mono informa.

### Hierarchy
- **Display** (800, 36 → 72 px según pantalla, interlínea 0.95, tracking -0.04em): titular de portada. Admite dos líneas; la segunda va en rojo Bumbay.
- **Headline** (800, 24 → 30 px, tracking -0.03em): títulos de sección ("Todos los productos", "Destacados", "Ficha técnica").
- **Title** (600, 13–14 px, interlínea 1.375): nombre del producto en la tarjeta.
- **Body** (400, 15 px, interlínea 1.625): párrafos de presentación y fichas; máximo unos 70 caracteres por línea.
- **Label** (Plex Mono 400, 10 px, mayúsculas, tracking 0.2em): rótulos sobre los títulos, SKU, etiquetas de campos y cifras pequeñas.
- **Price** (Plex Mono 600, 18 px en tarjeta y 36 px en ficha, cifras tabulares): precio.

### Named Rules
**La Regla del Dato en Mono.** Todo lo que se compara o se copia (precio, SKU, cantidades, especificaciones) va en Plex Mono con cifras tabulares. Los nombres y las frases van en Archivo.

## Layout

Contenedor centrado de 1400 px como máximo, con margen lateral de 16 px en celular y 24 px desde 640 px. Las grillas de productos van a 2 columnas en celular y suben a 3–4 en escritorio; los carruseles usan desplazamiento nativo con anclaje para que funcionen con el dedo. Las secciones se separan con bordes finos (carbon-800) y bloques de 32–64 px de aire vertical. La barra de pedido queda fija abajo y el pie reserva su alto para no quedar tapado.

## Elevation & Depth

Sistema plano: la profundidad se da por capas tonales del carbón (950 de fondo, 900 de panel, 850 de campo) y bordes finos, no por sombras. Hay solo dos sombras, ambas para piezas que flotan sobre el contenido.

### Shadow Vocabulary
- **Panel** (`0 1px 2px rgb(0 0 0 / 0.4), 0 8px 24px -12px rgb(0 0 0 / 0.6)`): paneles superpuestos como la vista rápida.
- **Flotante** (`0 -1px 0 rgb(255 255 255 / 0.06), 0 -12px 40px -8px rgb(0 0 0 / 0.7)`): la barra de pedido y el panel del carrito, que suben desde abajo.

### Named Rules
**La Regla de la Lámina.** Las superficies en reposo son planas. Una sombra significa "esto flota sobre la página", nunca "esto es importante".

## Shapes

Esquinas rectas en todo: botones, tarjetas, campos y chips usan 0 px (2 px como máximo en paneles). Las tarjetas de producto llevan marcas de esquina de plano técnico (10 px, 1 px de trazo) que se vuelven rojas al pasar el cursor. La cinta de precaución (franjas a 45°, 8 px) corona el encabezado, la barra del pedido y los bloques de llamada a la acción.

## Components

### Buttons
- **Shape:** rectos (0 px).
- **Primary:** fondo rojo Bumbay, texto blanco en Archivo seminegrita de 14 px, alto 48 px (40–44 px en tarjetas). Hover a marca-400; al presionar se reduce a 0.98.
- **WhatsApp:** fondo verde disponible con texto carbón y el ícono de WhatsApp; alto 56 px en los bloques de cierre.
- **Outline:** borde carbon-700 sin relleno; el hover cambia borde y texto al verde si lleva a WhatsApp, o al rojo si es navegación.

### Chips
- **Style:** fondo carbón panel, borde carbon-800, texto gris claro de 13 px y flecha a la derecha.
- **State:** el hover enciende el borde en rojo Bumbay y mueve la flecha 2 px.

### Cards / Containers
- **Corner Style:** rectas, con marcas de esquina técnicas.
- **Background:** carbón panel; la foto del producto va sobre un panel blanco ficha.
- **Shadow Strategy:** ninguna (ver La Regla de la Lámina).
- **Border:** 1 px carbon-800, a carbon-600 en hover.
- **Internal Padding:** 14–16 px.

### Inputs / Fields
- **Style:** fondo carbon-850, borde 1 px carbon-700, rectos, alto 40–44 px.
- **Focus:** el borde pasa a rojo Bumbay.
- **Error:** borde rojo y fondo teñido de rojo al 10 %, con el mensaje debajo del campo; el tinte se mantiene sin foco para no confundirse con un campo seleccionado.

### Navigation
- **Style:** franja superior de contacto en Plex Mono 11 px; fila de catálogo en Archivo 12.5 px gris. Los nichos van en blanco seminegrita y sus categorías en gris.
- **States:** la página activa se pinta en marca-400 con una barra roja de 2 px abajo.
- **Mobile:** buscador en su propia fila y menú desplegable agrupado por nicho.

### Cinta de precaución
La firma del sistema: franjas rojas a 45° sobre transparente. Aparece bajo el encabezado, sobre la barra del pedido y en el borde superior de los bloques de llamada a la acción. Nunca como fondo de un área grande.

## Do's and Don'ts

### Do:
- **Do** usar Plex Mono tabular para todo precio, SKU y cifra.
- **Do** dejar la foto del producto sobre el panel blanco ficha (carbon-50).
- **Do** usar marca-400, no marca-500, para texto rojo pequeño sobre carbón.
- **Do** mantener las esquinas rectas y las marcas de esquina técnicas en las tarjetas de producto.
- **Do** respetar `prefers-reduced-motion`: el sistema ya reduce todas las animaciones a casi cero.

### Don't:
- **Don't** redondear botones, tarjetas ni campos.
- **Don't** usar el verde fuera de WhatsApp y del estado "Disponible".
- **Don't** usar sombras para jerarquía; solo para lo que flota.
- **Don't** extender la cinta de precaución a superficies grandes: es un filete, no un fondo.
