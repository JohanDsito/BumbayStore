# Bumbay Store

Catálogo web de varios nichos. Bumbay Tools (herramienta inalámbrica) es el
primero; los demás se agregan como datos, no como sitios nuevos. El cliente
arma su pedido y lo envía por WhatsApp; el pago y el envío se coordinan
hablando.

Qué es la tienda, para quién y qué la diferencia está en `PRODUCT.md`.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · Supabase · Vercel

---

## Empezar

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev                  # http://localhost:3000
```

El sitio **funciona sin Supabase**: si no hay credenciales usa los productos de
ejemplo de `src/data`, para trabajar en el diseño sin depender de la base de
datos.

Con Supabase configurado, el catálogo sale solo de ahí. Si Supabase no
responde (cada consulta espera 8 segundos y se reintenta una vez), **no** se
muestran productos de ejemplo como si fueran reales: las páginas ya generadas
conservan su última versión buena, una publicación fallida en Vercel deja en
línea la anterior, y la búsqueda muestra un aviso para reintentar.

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
> segura son las políticas RLS de `supabase/migrations/`, que solo permiten
> **leer** el catálogo. La `service_role` sí es secreta y se salta toda la seguridad.

---

## Cargar el catálogo real

### 1. Crear las tablas

Aplica las migraciones como se explica en [Base de datos](#base-de-datos).
Crean las tablas, los índices, las políticas de seguridad y el bucket de
imágenes.

### 2. Preparar el Excel

Toma el Excel que ya tienes y déjalo con estas columnas
(`datos/productos.ejemplo.csv` es la plantilla):

| Columna | Obligatoria | Notas |
|---|---|---|
| `sku` | sí | Código único. Es la llave: reimportar actualiza, no duplica. |
| `nombre` | sí | Aparece como título y en el resultado de Google. |
| `nicho` | no | Slug del nicho: `herramientas`, `hogar`… Tiene que existir ya en la tabla `nichos`. Si va vacía se asume `herramientas`. |
| `categoria` | sí | Texto normal; el slug se genera solo. Una categoría vive en un solo nicho. |
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

## Panel de administración

La ruta no está escrita en el código: se arma con la variable `ADMIN_RUTA`.

```
tudominio.com/acceso/<ADMIN_RUTA>
```

Cualquier otro valor devuelve el mismo 404 que una página inexistente. La
variable **no** lleva el prefijo `NEXT_PUBLIC_`, así que se queda en el
servidor y nunca viaja dentro del JavaScript que descarga el visitante. Para
cambiar la dirección basta con cambiar la variable.

Que quede claro qué consigue esto y qué no: **no es seguridad**. Quien acierte
la ruta se encuentra igual con el formulario, y sin cuenta en la tabla `admins`
no puede hacer nada. Lo que evita es el ruido de los robots que prueban
`/admin` y `/wp-admin`, y que la dirección quede a la vista en el historial de
un navegador compartido.

Está fuera del índice de Google y `/acceso` está bloqueado en `robots.txt`.

### Crear tu usuario

1. Panel de Supabase → **Authentication** → **Users** → **Add user**
2. Correo y contraseña, y marca *Auto Confirm User*
3. **SQL Editor**, cambiando el correo por el tuyo:
   ```sql
   insert into public.admins (user_id, correo)
   select id, email from auth.users where email = 'TU-CORREO@ejemplo.com'
   on conflict (user_id) do nothing;
   ```
4. Entra en `tudominio.com/acceso/<ADMIN_RUTA>` con esos datos

Sin el paso 3 el panel deja entrar pero no deja guardar nada. Es a propósito:
el registro de Supabase está abierto por defecto y cualquiera podría crearse
una cuenta, así que tener cuenta no da permisos; estar en `admins`, sí. Para
cerrar también la puerta del registro: **Authentication** → **Sign In /
Providers** → desactiva *Allow new users to sign up*.

### Qué se puede hacer

| Sección | Para qué |
|---|---|
| **Productos** | Precio, foto de portada, marcar agotado o destacado, y editar ficha técnica, especificaciones, modo de uso, beneficios y preguntas frecuentes. |
| **Nichos y categorías** | Crear nichos y categorías, mover una categoría de nicho y editar lo que muestra la portada de cada nicho: titular, presentación y cifras. Un nicho nuevo nace oculto; se muestra cuando lo marcas visible y tiene productos. |
| **Pedidos** | Cada pedido que alguien inició, aunque nunca te haya escrito. Con nombre, ciudad, productos y total, más las ciudades que más piden. |
| **Búsquedas** | Lo que la gente busca. Lo importante es la columna de las que **no** encontraron nada: es demanda medida. |

Los campos largos usan el mismo formato del CSV, para no tener dos
convenciones que recordar:

- especificaciones → `Voltaje: 128V | Motor: Brushless`
- beneficios → `Uno | Dos | Tres`
- preguntas → `¿Pregunta?:: Respuesta | ¿Otra?:: Otra`

### Por qué los cambios tardan unos segundos

El catálogo se prerenderiza para que Google reciba el HTML completo, así que
un cambio en la base no se ve solo. Al guardar, el panel pide a Next que
regenere las páginas afectadas (`/api/revalidar`), y la siguiente visita ya
trae lo nuevo. Se conserva el SEO sin renunciar a editar en vivo.

### Agotado no es despublicar

Un producto agotado sigue publicado y sigue indexado: aparece en el catálogo
en gris, con su precio tachado y sin botón de compra, e invita a escribir por
WhatsApp para que avisen cuando vuelva. Quitarlo y reponerlo cada semana
destruiría su posicionamiento, que cuesta meses construir.

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

El código está ordenado por capas, de adentro hacia afuera. Cada capa solo
conoce a las de adentro, y el lint falla si alguien rompe esa regla
(`eslint.config.mjs`):

```
src/
  dominio/            reglas del negocio, puras: producto, nicho, pedido,
                      búsqueda, variantes… Sin Next, React ni Supabase.
  aplicacion/         casos de uso del catálogo y los contratos (puertos.ts)
                      de lo que se necesita del exterior
  infraestructura/    quién cumple esos contratos: Supabase, los datos
                      locales, WhatsApp, las URLs de imagen
  servidor/           el punto de armado: elige la fuente y le pone caché
                      por visita. Las páginas importan `catalogo` de aquí.
  cliente/            estado que vive en el navegador (el pedido)
  config/sitio.ts     datos de la marca
  app/                rutas de Next (ver abajo), panel, sitemap y robots
  components/         piezas de interfaz
  data/               catálogo de ejemplo, municipios del DANE
supabase/
  migrations/         la base de datos, cambio por cambio
  config.toml         configuración del CLI de Supabase
scripts/              importación de datos e imágenes
```

Para cambiar de base de datos o de proveedor basta con escribir otra
implementación en `infraestructura/` y elegirla en `servidor/`: las páginas y
las reglas no se enteran.

---

## Base de datos

Los cambios de la base viven en `supabase/migrations/`, numerados por fecha.
Ya no se pega SQL a mano en el editor: cada cambio queda en git, se aplica en
orden y una sola vez.

La primera vez, en una terminal en la carpeta del proyecto:

```bash
npx supabase login                       # abre el navegador para iniciar sesión
npx supabase link --project-ref <ref>    # el <ref> sale de la URL del proyecto
```

`link` pide la contraseña de la base de datos (Project Settings → Database).
Después, cada vez que haya migraciones nuevas:

```bash
npx supabase db push
```

La migración inicial (`..._esquema_inicial.sql`) repite lo que antes se
ejecutaba a mano y es idempotente: aplicarla sobre una base que ya lo tenía no
cambia nada.

---

## Direcciones

| Página | Dirección |
|---|---|
| Portada de la tienda | `/` |
| Portada de un nicho | `/herramientas` |
| Categoría | `/herramientas/taladros` |
| Ficha de producto | `/producto/taladro-percutor-…` (sin nicho: si el producto cambia de categoría, su dirección no cambia) |

Las direcciones viejas `/categoria/taladros` redirigen de forma permanente a la
nueva. Todas se arman en `src/dominio/rutas.ts`; ningún componente las escribe
a mano.

## Ver la tienda con varios nichos

Mientras los nichos reales no existan, se puede ver la tienda con dos nichos
de ejemplo (`src/data/ejemplo.seed.ts`) agregando a `.env.local`:

```
CATALOGO=ejemplo
```

Solo en tu equipo: con esa variable se ignora Supabase. Nunca la pongas en
Vercel.

## Pruebas

```bash
npm test
```

Prueban las reglas del dominio (búsqueda, variantes, destacados, límites del
pedido). Son funciones puras, así que corren en menos de un segundo y sin
base de datos.

## Cambiar la marca

- **Textos, teléfono, horario:** `src/config/sitio.ts` y `.env.local`
- **Colores y tipografías:** el bloque `@theme` de `src/app/globals.css`
- **Logo:** `Logotipo` en `src/components/icons.tsx`
