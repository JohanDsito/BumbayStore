/**
 * Prepara una ronda de fotos para el catálogo.
 *
 *   node scripts/preparar-ronda.mjs "datos/ronda 10"
 *
 * Añade --simular para ver qué haría sin copiar ni escribir nada.
 *
 * Espera la estructura que sale de Drive:
 *
 *   ronda 10/
 *     Taladro percutor 20V/
 *       DSC_0001.jpg              <- material en bruto, se ignora
 *       mercado libre/
 *         azul/     foto1.webp    <- estas sí se usan
 *         amarillo/ foto1.webp
 *     Pulidora angular/
 *       mercado libre/
 *         foto1.webp              <- sin carpeta de color: producto de un solo color
 *
 * Hace tres cosas:
 *
 *   1. Convierte la imagen principal de cada versión a .webp. Las piezas de
 *      marca pesan 1-2 MB en PNG; en webp bajan a una fracción, y la
 *      velocidad de carga es un factor de posicionamiento.
 *   2. Genera además un recorte cuadrado para la grilla. Las piezas vienen en
 *      proporciones muy distintas y llevan titulares y sellos que a tamaño de
 *      miniatura son ruido; el recorte busca la zona con más detalle, que en
 *      estas piezas es siempre la herramienta.
 *   3. Escribe datos/productos.borrador.csv con una fila por versión, ya con
 *      color y grupo resueltos.
 *
 * El CSV sale a medias a propósito: los SKU son provisionales y los precios
 * van vacíos. Ábrelo en Excel, completa esas columnas y pásalo por
 * `importar-productos.mjs --simular` antes de subirlo.
 */

import {
  readdirSync,
  statSync,
  mkdirSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const RAIZ = process.argv[2] ?? "datos/ronda 10";
const SIMULAR = process.argv.includes("--simular");
const DESTINO_FOTOS = "datos/fotos";
const DESTINO_CSV = "datos/productos.borrador.csv";

const EXTENSIONES = [".webp", ".jpg", ".jpeg", ".png", ".avif"];
/** Lado mayor en la ficha, y lado del recorte cuadrado de la grilla. */
const LADO_FICHA = 1400;
const LADO_MINI = 800;
const CALIDAD = 82;
/**
 * Carpetas donde pueden vivir las piezas ya editadas. Se acepta más de un
 * nombre porque en la práctica no siempre se rotulan igual, y descartar un
 * producto entero por el nombre de una carpeta sería absurdo.
 */
const CARPETAS_FINALES = ["mercado libre", "fondo blanco", "finales", "editadas"];

const ABREV_COLOR = { azul: "AZ", amarillo: "AM", rojo: "RJ", verde: "VD", negro: "NG" };

// ---------------------------------------------------------------------------

const slugify = (t) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const esImagen = (f) => EXTENSIONES.includes(extname(f).toLowerCase());

const carpetas = (ruta) => {
  try {
    return readdirSync(ruta, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return [];
  }
};

const imagenes = (ruta) => {
  try {
    return readdirSync(ruta)
      .filter(esImagen)
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  } catch {
    return [];
  }
};

/** Busca la carpeta de piezas finales, sin importar mayúsculas ni tildes. */
const buscarCarpetaFinales = (ruta) => {
  const dentro = carpetas(ruta);
  for (const candidata of CARPETAS_FINALES) {
    const hallada = dentro.find((c) => slugify(c) === slugify(candidata));
    if (hallada) return hallada;
  }
  return null;
};

/** Escapa un valor para CSV. */
const celda = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// ---------------------------------------------------------------------------

if (!existsSync(RAIZ)) {
  console.error(`No encuentro la carpeta "${RAIZ}".

Descarga la carpeta desde Drive y déjala dentro de datos/, por ejemplo:
  ${RAIZ}/
Luego vuelve a ejecutar este script.`);
  process.exit(1);
}

const productos = carpetas(RAIZ);
if (productos.length === 0) {
  console.error(`"${RAIZ}" no tiene carpetas de producto dentro.`);
  process.exit(1);
}

console.log(`Revisando "${RAIZ}" — ${productos.length} carpetas de producto\n`);

const filas = [];
const avisos = [];
const conversiones = [];   // toda la secuencia, para la galería
const miniaturas = [];     // una por versión, el recorte de la grilla
let pesoOriginal = 0;
let indice = 0;

for (const producto of productos.sort((a, b) => a.localeCompare(b, "es"))) {
  const rutaProducto = join(RAIZ, producto);
  const slugProducto = slugify(producto);

  const finales = buscarCarpetaFinales(rutaProducto);
  if (!finales) {
    avisos.push(
      `"${producto}": no encontré ninguna carpeta de piezas finales ` +
        `(${CARPETAS_FINALES.join(", ")}). Se omite; las fotos en bruto no se publican.`,
    );
    continue;
  }
  const rutaFinales = join(rutaProducto, finales);

  // ¿Versiones de color, o un solo color?
  const subcarpetas = carpetas(rutaFinales);
  const versiones =
    subcarpetas.length > 0
      ? subcarpetas.map((c) => ({ color: c, ruta: join(rutaFinales, c) }))
      : [{ color: null, ruta: rutaFinales }];

  const conFotos = versiones.filter((v) => imagenes(v.ruta).length > 0);
  if (conFotos.length === 0) {
    avisos.push(`"${producto}": la carpeta "${finales}" no tiene imágenes.`);
    continue;
  }

  // El número solo avanza con los productos que de verdad entran al catálogo,
  // para que la numeración no deje huecos por las carpetas descartadas.
  indice++;
  const skuBase = `BT-${String(indice).padStart(3, "0")}`;
  const hayVariantes = conFotos.length > 1;

  for (const version of conFotos) {
    const fotos = imagenes(version.ruta);

    const colorLimpio = version.color
      ? version.color.trim().charAt(0).toUpperCase() +
        version.color.trim().slice(1).toLowerCase()
      : null;

    const sufijo = colorLimpio
      ? (ABREV_COLOR[colorLimpio.toLowerCase()] ?? slugify(colorLimpio).slice(0, 2).toUpperCase())
      : null;

    const sku = sufijo ? `${skuBase}-${sufijo}` : skuBase;
    const base = colorLimpio
      ? `${slugProducto}-${slugify(colorLimpio)}`
      : slugProducto;
    // La secuencia completa alimenta la galería de la ficha. Cada pieza de
    // Bumbay explica algo distinto del producto, así que desperdiciarlas
    // sería tirar material de venta ya hecho.
    const archivos = fotos.map((_, i) => `${base}-${i + 1}.webp`);
    const nombreMini = `${base}-mini.webp`;

    fotos.forEach((f, i) => {
      const ruta = join(version.ruta, f);
      pesoOriginal += statSync(ruta).size;
      conversiones.push({ desde: ruta, hacia: join(DESTINO_FOTOS, archivos[i]) });
    });

    // El recorte de la grilla sale siempre de la portada.
    miniaturas.push({
      desde: join(version.ruta, fotos[0]),
      hacia: join(DESTINO_FOTOS, nombreMini),
    });

    filas.push({
      sku,
      nombre: colorLimpio ? `${producto} ${colorLimpio}` : producto,
      categoria: "",
      marca: "Bumbay",
      color: colorLimpio ?? "",
      grupo: hayVariantes ? skuBase : "",
      precio_unitario: "",
      precio_mayor: "",
      imagen: archivos[0],
      imagen_mini: nombreMini,
      imagenes: archivos.join(" | "),
      ficha_tecnica: "",
      especificaciones: "",
      modo_uso: "",
      beneficios: "",
      faq: "",
      destacado: "",
    });

    console.log(
      `  ${sku.padEnd(10)} ${(colorLimpio ?? "único").padEnd(10)} ` +
        `${String(fotos.length).padStart(2)} piezas -> ${base}-1..${fotos.length}.webp`,
    );
  }
}

console.log(`\nVersiones encontradas: ${filas.length}`);
console.log(`Con variante de color: ${filas.filter((f) => f.color).length}`);

if (avisos.length) {
  console.log(`\nAvisos (${avisos.length}):`);
  avisos.forEach((a) => console.log("  · " + a));
}

if (SIMULAR) {
  console.log("\nModo simulación: no se copió ni escribió nada.");
  process.exit(0);
}

if (filas.length === 0) {
  console.error("\nNo hay nada que preparar.");
  process.exit(1);
}

mkdirSync(DESTINO_FOTOS, { recursive: true });

console.log(`
Convirtiendo ${conversiones.length} imagenes...`);

for (const c of conversiones) {
  await sharp(c.desde)
    .resize(LADO_FICHA, LADO_FICHA, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: CALIDAD })
    .toFile(c.hacia);
}

console.log(`Recortando ${miniaturas.length} miniaturas...`);

for (const m of miniaturas) {
  // La regla depende de la orientacion porque estas piezas se maquetan
  // siempre igual. En las horizontales el texto va a la izquierda y la
  // herramienta a la derecha, asi que recortamos por la derecha. En las
  // verticales el titular va arriba y el producto ocupa el centro, y ahi
  // `attention` acierta. Para las horizontales no sirve: el bloque de texto
  // tiene mas detalle que la herramienta y se queda con el.
  const meta = await sharp(m.desde).metadata();
  const proporcion = meta.width / meta.height;
  const posicion =
    proporcion > 1.1 ? "right" : proporcion < 0.9 ? sharp.strategy.attention : "centre";

  await sharp(m.desde)
    .resize(LADO_MINI, LADO_MINI, { fit: "cover", position: posicion })
    .webp({ quality: CALIDAD })
    .toFile(m.hacia);
}

const pesoFinal = [...conversiones, ...miniaturas].reduce(
  (t, x) => t + statSync(x.hacia).size,
  0,
);
const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `${conversiones.length + miniaturas.length} archivos en ${DESTINO_FOTOS}/ ` +
    `(${mb(pesoOriginal)} MB -> ${mb(pesoFinal)} MB, ` +
    `${Math.round((1 - pesoFinal / pesoOriginal) * 100)}% menos)`,
);

const columnas = Object.keys(filas[0]);
const csv = [
  columnas.join(","),
  ...filas.map((f) => columnas.map((c) => celda(f[c])).join(",")),
].join("\n");
// El BOM hace que Excel abra el archivo con las tildes correctas.
writeFileSync(DESTINO_CSV, "﻿" + csv, "utf8");

console.log(`Borrador escrito en ${DESTINO_CSV}

Siguientes pasos:
  1. Abre ${DESTINO_CSV} en Excel. Revisa los nombres: salen del nombre de la
     carpeta, que no siempre es el nombre comercial del producto.
  2. Completa categoria, precio_unitario y precio_mayor (obligatorias las tres
     primeras; el resto del contenido mejora tu posicionamiento).
  3. Ajusta los SKU provisionales (BT-001, BT-002…) por los tuyos reales.
     Si cambias un SKU con color, mantén el mismo valor en la columna grupo
     para las dos versiones, o se dejarán de enlazar entre sí.
  4. Guarda como CSV UTF-8 en datos/productos.csv
  5. node --env-file=.env.local scripts/importar-productos.mjs datos/productos.csv --simular
  6. Si no hay errores, repite sin --simular
  7. node --env-file=.env.local scripts/subir-imagenes.mjs datos/fotos`);
