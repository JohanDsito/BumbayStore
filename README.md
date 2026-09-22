# Bumbay Tools

Catálogo web de herramientas inalámbricas. El cliente arma su pedido y lo
envía por WhatsApp; el pago y el envío se coordinan hablando.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · Supabase · Vercel

---

## Empezar

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev                  # http://localhost:3000
```

El sitio **funciona sin Supabase**: si no hay credenciales usa los productos de
`src/data/products.seed.ts`. Así puedes trabajar en el diseño sin depender de
la base de datos, y si Supabase se cae en producción el catálogo no desaparece.

---

## Variables de entorno

Todas van en `.env.local` (que nunca se sube a git) y en Vercel.

| Variable | Para qué sirve |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Dominio real. Sin esto el sitemap y los datos estructurados apuntan mal. |
| `NEXT_PUBLIC_WHATSAPP` | Número que recibe los pedidos. Formato `573001234567`, sin `+` ni espacios. |
| `NEXT_PUBLIC_EMAIL` · `NEXT_PUBLIC_DIRECCION` | Contacto del pie de página. |
| `NEXT_PUBLIC_INSTAGRAM` · `..._FACEBOOK` · `..._TIKTOK` | Redes. Si están vacías, no se muestran. |
| `NEXT_PUBLIC_SUPABASE_URL` · `..._ANON_KEY` | Conexión al catálogo. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo local**, para los scripts de carga. Nunca en Vercel ni en git. |

> La llave `anon` es pública por diseño: viaja al navegador. Lo que la hace
> segura son las políticas RLS de `supabase/schema.sql`, que solo permiten
> **leer**. La `service_role` sí es secreta y se salta toda la seguridad.

---

## Cargar el catálogo real

### 1. Crear las tablas

En supabase.com → tu proyecto → **SQL Editor** → pega y ejecuta
`supabase/schema.sql`. Crea las tablas, los índices, las políticas de
seguridad y el bucket de imágenes. Puedes correrlo más de una vez sin romper
nada.

### 2. Preparar el Excel

Toma el Excel que ya tienes y déjalo con estas columnas
(`datos/productos.ejemplo.csv` es la plantilla):

| Columna | Obligatoria | Notas |
|---|---|---|
| `sku` | sí | Código único. Es la llave: reimportar actualiza, no duplica. |
| `nombre` | sí | Aparece como título y en el resultado de Google. |
| `categoria` | sí | Texto normal; el slug se genera solo. |
| `marca` | no | |
| `color` | no | `Azul`, `Amarillo`… Déjala vacía si la herramienta va en un solo color. |
| `grupo` | no | Enlaza las versiones de color entre sí. Si la dejas vacía se deduce del SKU. |
| `precio_unitario` | sí | `289000` o `$ 289.000`, ambos sirven. |
| `precio_mayor` | no | Si se deja vacío, el producto no muestra badge de mayoreo. |
| `imagen` | no | Nombre exacto del archivo. Ej: `BT-TAL-2001.webp` |
| `ficha_tecnica` | no | Párrafo descriptivo. **Aquí es donde más ganas en SEO.** |
| `especificaciones` | no | `Voltaje: 20V máx \| Torque: 45 N·m` |
| `modo_uso` | no | Párrafo. |
| `beneficios` | no | `Uno \| Dos \| Tres` |
| `faq` | no | `¿Pregunta?:: Respuesta \| ¿Otra?:: Otra respuesta` |
| `destacado` | no | `si` / `no`. Los `si` salen en el carrusel de la portada. |

Guarda como **CSV UTF-8** en `datos/productos.csv`.

#### Versiones de color

Una herramienta que se vende en varios colores va como **una fila por color**,
cada una con su propio SKU y su propia foto. Lo que las une es la columna
`grupo`:

| sku | nombre | color | grupo |
|---|---|---|---|
| `BT-TAL-2001-AZ` | Taladro percutor 20V Azul | `Azul` | `BT-TAL-2001` |
| `BT-TAL-2001-AM` | Taladro percutor 20V Amarillo | `Amarillo` | `BT-TAL-2001` |

Así cada color tiene su propia página indexable en Google, y la ficha muestra
un selector para saltar entre ellos. Si dejas `grupo` vacío, el importador lo
deduce quitando el último segmento del SKU, que es justo lo que se necesita en
el ejemplo de arriba.

### 2b. Preparar las fotos de una ronda

Si tus fotos vienen organizadas por rondas desde Drive (una carpeta por
producto, y dentro `mercado libre/` con las versiones finales, a veces
separadas en `azul/` y `amarillo/`), hay un script que hace el trabajo sucio:

```bash
node scripts/preparar-ronda.mjs "datos/ronda 10" --simular
```

Recorre las carpetas, ignora el material en bruto, detecta las versiones de
color y te dice qué encontró sin tocar nada. Sin `--simular` copia la foto
principal de cada versión a `datos/fotos/` con un nombre predecible y escribe
`datos/productos.borrador.csv` con `color` y `grupo` ya resueltos.

El borrador sale con SKU provisionales y precios vacíos a propósito: esas
columnas las completas tú en Excel antes de importar.

### 3. Revisar antes de escribir

```bash
node --env-file=.env.local scripts/importar-productos.mjs datos/productos.csv --simular
```

No toca la base de datos. Reporta precios inválidos, categorías faltantes,
slugs duplicados y precios al mayor mayores que el unitario (típico error de
digitación). Si algo falla, **no importa nada**: corriges y repites.

### 4. Importar

```bash
node --env-file=.env.local scripts/importar-productos.mjs datos/productos.csv
```

### 5. Subir las fotos

Descarga las fotos de Drive a `datos/fotos/`, nómbralas igual que la columna
`imagen`, y:

```bash
node --env-file=.env.local scripts/subir-imagenes.mjs datos/fotos
```

El script avisa cuáles pesan más de 500 KB. **Conviértelas a `.webp` de unos
1000 px de lado antes de subirlas**: la velocidad de carga es un factor de
posicionamiento, y una foto de cámara sin optimizar pesa diez veces más de lo
necesario.

---

## Departamentos y municipios

El campo de ciudad del pedido autocompleta sobre la division politico-
administrativa oficial (**Divipola** del DANE): 33 departamentos y 1.122
municipios.

La lista vive en `src/data/municipios.ts` como archivo del proyecto, no como
llamada a una API. Son 20 KB, la division cambia cada varios anos, y asi el
formulario no depende de que un servicio externo responda.

Para actualizarla cuando cambie:

```bash
curl "https://www.datos.gov.co/resource/gdxc-w37w.json?\$limit=1500" -o divipola.json
```

y regenerar el archivo con los nombres capitalizados. El encabezado de
`src/data/municipios.ts` documenta la fuente y la fecha de descarga.

El campo exige que la ciudad salga de esa lista: asi llega siempre escrita
igual y los pedidos se pueden agrupar por zona para cotizar el envio.

---

## Publicar en Vercel

1. Sube el repo a GitHub.
2. En vercel.com → **New Project** → importa el repo. Detecta Next.js solo.
3. Copia las variables de entorno (**sin** `SUPABASE_SERVICE_ROLE_KEY`).
4. Deploy.
5. **Settings → Domains** → agrega tu dominio y apunta el DNS donde indique.
6. Actualiza `NEXT_PUBLIC_SITE_URL` al dominio real y vuelve a desplegar.

Después de publicar, registra el sitio en
[Google Search Console](https://search.google.com/search-console) y envía
`https://tudominio.com/sitemap.xml`. Sin ese paso Google puede tardar semanas
en encontrarte.

---

## Cómo está armado el SEO

Esto es lo que diferencia el sitio de un catálogo SaaS como el de la
competencia, donde Google solo alcanza a ver el nombre del negocio:

- **HTML completo desde el servidor.** Cada producto y cada categoría se
  prerenderizan en el build. Google y los bots de IA reciben el texto ya
  escrito, no un `<div>` vacío que se llena con JavaScript.
- **Una URL por producto**, descriptiva: `/producto/taladro-percutor-inalambrico-20v-...`
- **Título y descripción únicos** por página, generados del contenido real.
- **Datos estructurados JSON-LD**: `Product` con precio y disponibilidad,
  `FAQPage` con tus preguntas frecuentes, `BreadcrumbList`, `ItemList` en las
  categorías y `Store` en todo el sitio.
- **Sitemap automático** en `/sitemap.xml`: cada producto nuevo aparece solo.
- Las páginas de búsqueda quedan fuera del índice para no generar contenido
  duplicado.

Entre más completas estén las columnas `ficha_tecnica`, `beneficios` y `faq`,
mejor te va a ir. Los buscadores y los asistentes premian el contenido útil y
detallado, y tú ya lo tienes escrito.

---

## Estructura

```
src/
  app/
    page.tsx                  portada
    categoria/[slug]/         listado por categoría
    producto/[slug]/          ficha (JSON-LD de producto y FAQ)
    buscar/                   resultados (fuera del índice)
    sitemap.ts · robots.ts    SEO automático
    globals.css               tema y sistema de diseño
  components/                 header, tarjetas, carrito, carrusel…
  lib/
    products.ts               capa de datos (Supabase o local)
    cart-context.tsx          carrito, persistido en el navegador
    whatsapp.ts               armado del mensaje de pedido
    site-config.ts            datos de la marca
  data/                       catálogo de respaldo
supabase/schema.sql           tablas, seguridad y bucket
scripts/                      importación de datos e imágenes
```

## Cambiar la marca

- **Textos, teléfono, horario:** `src/lib/site-config.ts` y `.env.local`
- **Colores y tipografías:** el bloque `@theme` de `src/app/globals.css`
- **Logo:** `Logotipo` en `src/components/icons.tsx`
