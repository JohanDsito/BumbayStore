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
 * Hace dos cosas:
 *
 *   1. Copia la foto principal de cada versión a datos/fotos/, renombrada de
 *      forma predecible.
 *   2. Escribe datos/productos.borrador.csv con una fila por versión, ya con
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
  copyFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join, extname } from "node:path";

const RAIZ = process.argv[2] ?? "datos/ronda 10";
const SIMULAR = process.argv.includes("--simular");
const DESTINO_FOTOS = "datos/fotos";
const DESTINO_CSV = "datos/productos.borrador.csv";

const EXTENSIONES = [".webp", ".jpg", ".jpeg", ".png", ".avif"];
/** Carpeta donde viven las fotos ya editadas. */
const CARPETA_FINALES = "mercado libre";

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

/** Encuentra la carpeta de fotos finales sin importar mayúsculas ni tildes. */
const buscarCarpeta = (ruta, nombre) =>
  carpetas(ruta).find((c) => slugify(c) === slugify(nombre)) ?? null;

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
const copias = [];
let indice = 0;

for (const producto of productos.sort((a, b) => a.localeCompare(b, "es"))) {
  const rutaProducto = join(RAIZ, producto);
  const slugProducto = slugify(producto);

  const finales = buscarCarpeta(rutaProducto, CARPETA_FINALES);
  if (!finales) {
    avisos.push(
      `"${producto}": no tiene carpeta "${CARPETA_FINALES}". Se omite; ` +
        `las fotos sin editar no se publican.`,
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
    const principal = fotos[0];
    const ext = extname(principal).toLowerCase();

    const colorLimpio = version.color
      ? version.color.trim().charAt(0).toUpperCase() +
        version.color.trim().slice(1).toLowerCase()
      : null;

    const sufijo = colorLimpio
      ? (ABREV_COLOR[colorLimpio.toLowerCase()] ?? slugify(colorLimpio).slice(0, 2).toUpperCase())
      : null;

    const sku = sufijo ? `${skuBase}-${sufijo}` : skuBase;
    const nombreArchivo = colorLimpio
      ? `${slugProducto}-${slugify(colorLimpio)}${ext}`
      : `${slugProducto}${ext}`;

    const tam = statSync(join(version.ruta, principal)).size;
    if (tam > 500 * 1024) {
      avisos.push(
        `"${producto}"${colorLimpio ? ` (${colorLimpio})` : ""}: la foto pesa ` +
          `${Math.round(tam / 1024)} KB. Conviértela a .webp antes de publicar.`,
      );
    }
    if (fotos.length > 1) {
      avisos.push(
        `"${producto}"${colorLimpio ? ` (${colorLimpio})` : ""}: hay ${fotos.length} fotos, ` +
          `se toma "${principal}" como principal.`,
      );
    }

    copias.push({ desde: join(version.ruta, principal), hacia: join(DESTINO_FOTOS, nombreArchivo) });

    filas.push({
      sku,
      nombre: colorLimpio ? `${producto} ${colorLimpio}` : producto,
      categoria: "",
      marca: "Bumbay",
      color: colorLimpio ?? "",
      grupo: hayVariantes ? skuBase : "",
      precio_unitario: "",
      precio_mayor: "",
      imagen: nombreArchivo,
      ficha_tecnica: "",
      especificaciones: "",
      modo_uso: "",
      beneficios: "",
      faq: "",
      destacado: "",
    });

    console.log(
      `  ${sku.padEnd(10)} ${(colorLimpio ?? "único").padEnd(10)} ${nombreArchivo}`,
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
for (const c of copias) copyFileSync(c.desde, c.hacia);
console.log(`\n${copias.length} fotos copiadas a ${DESTINO_FOTOS}/`);

const columnas = Object.keys(filas[0]);
const csv = [
  columnas.join(","),
  ...filas.map((f) => columnas.map((c) => celda(f[c])).join(",")),
].join("\n");
// El BOM hace que Excel abra el archivo con las tildes correctas.
writeFileSync(DESTINO_CSV, "﻿" + csv, "utf8");

console.log(`Borrador escrito en ${DESTINO_CSV}

Siguientes pasos:
  1. Abre ${DESTINO_CSV} en Excel.
  2. Completa categoria, precio_unitario y precio_mayor (obligatorias las tres
     primeras; el resto del contenido mejora tu posicionamiento).
  3. Ajusta los SKU provisionales (BT-001, BT-002…) por los tuyos reales.
     Si cambias un SKU con color, mantén el mismo valor en la columna grupo
     para las dos versiones, o se dejarán de enlazar entre sí.
  4. Guarda como CSV UTF-8 en datos/productos.csv
  5. node --env-file=.env.local scripts/importar-productos.mjs datos/productos.csv --simular
  6. Si no hay errores, repite sin --simular
  7. node --env-file=.env.local scripts/subir-imagenes.mjs datos/fotos`);
