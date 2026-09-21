/**
 * Sube las fotos de producto al bucket `productos` de Supabase.
 *
 *   node --env-file=.env.local scripts/subir-imagenes.mjs datos/fotos
 *
 * El nombre del archivo debe coincidir con la columna `imagen` del CSV.
 * Lo más práctico es nombrarlas con el SKU: BT-TAL-2001.webp
 *
 * Recomendación antes de subir: convierte las fotos a .webp de unos 1000px
 * de lado. Pesan la décima parte que un JPG de cámara y la página carga
 * mucho más rápido, que es algo que Google mide y premia.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { createClient } from "@supabase/supabase-js";

const CARPETA = process.argv[2] ?? "datos/fotos";
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const LLAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !LLAVE) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const TIPOS = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
};

let archivos;
try {
  archivos = readdirSync(CARPETA).filter((f) => TIPOS[extname(f).toLowerCase()]);
} catch (e) {
  console.error(`No pude leer la carpeta ${CARPETA}: ${e.message}`);
  process.exit(1);
}

if (archivos.length === 0) {
  console.error(`No hay imágenes en ${CARPETA} (busco .webp, .jpg, .png, .avif)`);
  process.exit(1);
}

const sb = createClient(URL, LLAVE, { auth: { persistSession: false } });

console.log(`Subiendo ${archivos.length} imágenes desde ${CARPETA}…\n`);

let subidas = 0;
let fallidas = 0;
const pesadas = [];

for (const archivo of archivos) {
  const ruta = join(CARPETA, archivo);
  const tam = statSync(ruta).size;
  const contenido = readFileSync(ruta);

  const { error } = await sb.storage
    .from("productos")
    .upload(archivo, contenido, {
      contentType: TIPOS[extname(archivo).toLowerCase()],
      upsert: true,
    });

  if (error) {
    console.log(`  FALLA  ${archivo} — ${error.message}`);
    fallidas++;
  } else {
    const kb = Math.round(tam / 1024);
    console.log(`  ok     ${archivo} (${kb} KB)`);
    if (tam > 500 * 1024) pesadas.push(`${archivo} (${kb} KB)`);
    subidas++;
  }
}

console.log(`\nSubidas: ${subidas}   Fallidas: ${fallidas}`);

if (pesadas.length) {
  console.log(
    `\nEstas ${pesadas.length} imágenes pesan más de 500 KB y van a ralentizar el sitio.\n` +
      "Conviene convertirlas a .webp antes de publicar:",
  );
  pesadas.forEach((p) => console.log("  · " + p));
}

console.log(
  "\nRecuerda que la columna `imagen` de cada producto debe contener el nombre\n" +
    "exacto del archivo. Por ejemplo: " +
    basename(archivos[0]),
);
