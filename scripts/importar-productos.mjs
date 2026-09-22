/**
 * Importa el catálogo desde un CSV hacia Supabase.
 *
 *   node --env-file=.env.local scripts/importar-productos.mjs datos/productos.csv
 *
 * Añade --simular para revisar qué haría sin escribir nada en la base.
 * Añade --limpiar para borrar además los productos que ya no estén en el CSV
 * (útil al renombrar un SKU: el upsert crea la fila nueva pero deja la vieja).
 *
 * Columnas esperadas (el orden no importa, los nombres sí):
 *   sku, nombre, categoria, marca, color, grupo, precio_unitario, imagen,
 *   imagen_mini, imagenes, ficha_tecnica, especificaciones, modo_uso,
 *   beneficios, faq, destacado
 *
 * Bumbay maneja un solo precio, ya a nivel de distribuidor: no hay columna de
 * precio al por mayor.
 *
 * Versiones de color: dos filas con el mismo `grupo` y distinto `color` son la
 * misma herramienta en colores diferentes; la ficha muestra un selector para
 * saltar entre ellas. Si pones `color` y dejas `grupo` vacío, el grupo se
 * deduce quitando el último segmento del SKU
 * (BT-TAL-2001-AZ y BT-TAL-2001-AM comparten el grupo BT-TAL-2001).
 *
 * Formato de las columnas compuestas:
 *   especificaciones -> "Voltaje: 20V máx | Torque: 45 N·m"
 *   beneficios       -> "Dos baterías incluidas | Luz LED integrada"
 *   faq              -> "¿Perfora concreto?:: Sí, hasta 13 mm | ¿Otra?:: Otra respuesta"
 *   destacado        -> "si" / "no"  (también acepta 1 / 0, true / false)
 */

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const RUTA = process.argv[2] ?? "datos/productos.csv";
const SIMULAR = process.argv.includes("--simular");
const LIMPIAR = process.argv.includes("--limpiar");

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const LLAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SIMULAR && (!URL || !LLAVE)) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local.\n" +
      "Ejecuta con --simular para revisar el CSV sin conectarte a Supabase.",
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Lectura del CSV (maneja comillas y saltos de línea dentro de las celdas)
// ---------------------------------------------------------------------------
function leerCsv(texto) {
  const filas = [];
  let fila = [];
  let celda = "";
  let enComillas = false;

  // El BOM que agrega Excel rompe el nombre de la primera columna.
  if (texto.charCodeAt(0) === 0xfeff) texto = texto.slice(1);

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (enComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          celda += '"';
          i++;
        } else enComillas = false;
      } else celda += c;
    } else if (c === '"') {
      enComillas = true;
    } else if (c === ",") {
      fila.push(celda);
      celda = "";
    } else if (c === "\n") {
      fila.push(celda);
      filas.push(fila);
      fila = [];
      celda = "";
    } else if (c !== "\r") {
      celda += c;
    }
  }
  if (celda || fila.length) {
    fila.push(celda);
    filas.push(fila);
  }

  const cabecera = filas.shift().map((h) => h.trim().toLowerCase());
  return filas
    .filter((f) => f.some((c) => c.trim() !== ""))
    .map((f) => Object.fromEntries(cabecera.map((h, i) => [h, (f[i] ?? "").trim()])));
}

// ---------------------------------------------------------------------------
// Conversiones
// ---------------------------------------------------------------------------
const slugify = (t) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "$ 289.000" y "289000" dan lo mismo: 289000. */
const aEntero = (v) => {
  if (!v) return null;
  const n = Number(String(v).replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const aBooleano = (v) => /^(s[ií]|1|true|x|y)$/i.test(String(v ?? "").trim());

const aLista = (v) =>
  (v ?? "")
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);

const aEspecificaciones = (v) =>
  aLista(v)
    .map((par) => {
      const i = par.indexOf(":");
      if (i === -1) return null;
      return { label: par.slice(0, i).trim(), valor: par.slice(i + 1).trim() };
    })
    .filter(Boolean);

const aFaq = (v) =>
  aLista(v)
    .map((par) => {
      const i = par.indexOf("::");
      if (i === -1) return null;
      return {
        pregunta: par.slice(0, i).trim(),
        respuesta: par.slice(i + 2).trim(),
      };
    })
    .filter(Boolean);

// ---------------------------------------------------------------------------
// Proceso
// ---------------------------------------------------------------------------
let filas;
try {
  filas = leerCsv(readFileSync(RUTA, "utf8"));
} catch (e) {
  console.error(`No pude leer ${RUTA}: ${e.message}`);
  process.exit(1);
}

console.log(`Leídas ${filas.length} filas de ${RUTA}\n`);

const productos = [];
const categorias = new Map();
const errores = [];
const avisos = [];
const slugsVistos = new Set();
const skusVistos = new Set();

filas.forEach((f, i) => {
  const linea = i + 2; // +1 por la cabecera, +1 porque Excel cuenta desde 1
  const sku = f.sku?.trim();
  const nombre = f.nombre?.trim();
  const categoria = f.categoria?.trim();
  const precioUnitario = aEntero(f.precio_unitario);

  if (!sku) return errores.push(`Fila ${linea}: falta el SKU`);
  if (skusVistos.has(sku))
    return errores.push(`Fila ${linea}: el SKU "${sku}" está repetido`);
  skusVistos.add(sku);
  if (!nombre) return errores.push(`Fila ${linea} (${sku}): falta el nombre`);
  if (!categoria) return errores.push(`Fila ${linea} (${sku}): falta la categoría`);
  if (!precioUnitario)
    return errores.push(`Fila ${linea} (${sku}): precio_unitario inválido o en cero`);

  // Versión de color. Sin `grupo` explícito lo deducimos del SKU.
  const color = f.color?.trim() || null;
  let grupo = f.grupo?.trim() || null;
  if (color && !grupo) {
    const partes = sku.split("-");
    if (partes.length > 1) {
      grupo = partes.slice(0, -1).join("-");
    } else {
      avisos.push(
        `Fila ${linea} (${sku}): tiene color "${color}" pero no se pudo deducir el grupo del SKU. ` +
          `Sin grupo no se enlazará con sus otras versiones de color.`,
      );
    }
  }

  const categoriaSlug = slugify(categoria);
  if (!categorias.has(categoriaSlug)) {
    categorias.set(categoriaSlug, {
      slug: categoriaSlug,
      nombre: categoria,
      orden: categorias.size,
    });
  }

  // El SKU al final garantiza que dos productos de nombre parecido no choquen.
  const slug = `${slugify(nombre)}-${slugify(sku)}`.slice(0, 120);
  if (slugsVistos.has(slug))
    return errores.push(`Fila ${linea} (${sku}): slug duplicado "${slug}"`);
  slugsVistos.add(slug);

  productos.push({
    sku,
    nombre,
    slug,
    categoria_slug: categoriaSlug,
    marca: f.marca?.trim() || null,
    color,
    grupo,
    precio_unitario: precioUnitario,
    imagen: f.imagen?.trim() || null,
    imagen_mini: f.imagen_mini?.trim() || null,
    imagenes: aLista(f.imagenes),
    ficha_tecnica: f.ficha_tecnica?.trim() || null,
    especificaciones: aEspecificaciones(f.especificaciones),
    modo_uso: f.modo_uso?.trim() || null,
    beneficios: aLista(f.beneficios),
    faq: aFaq(f.faq),
    destacado: aBooleano(f.destacado),
    activo: true,
  });
});

if (errores.length) {
  console.error(`Se encontraron ${errores.length} problemas:\n`);
  errores.forEach((e) => console.error("  · " + e));
  console.error("\nCorrige el CSV y vuelve a ejecutar. No se escribió nada.");
  process.exit(1);
}

if (avisos.length) {
  console.log(`Avisos (${avisos.length}):`);
  avisos.forEach((a) => console.log("  · " + a));
  console.log("");
}

// Un grupo con una sola fila casi siempre es un color mal escrito.
const porGrupo = new Map();
for (const p of productos) {
  if (!p.grupo) continue;
  porGrupo.set(p.grupo, (porGrupo.get(p.grupo) ?? 0) + 1);
}
const huerfanos = [...porGrupo.entries()].filter(([, n]) => n === 1);
if (huerfanos.length) {
  console.log(`Grupos de color con una sola versión (${huerfanos.length}):`);
  huerfanos.forEach(([g]) => {
    const p = productos.find((x) => x.grupo === g);
    console.log(`  · ${p.sku} (grupo ${g}, color ${p.color}) — revisa si le falta su pareja`);
  });
  console.log("");
}

console.log(`Productos válidos:  ${productos.length}`);
console.log(`Categorías nuevas:  ${categorias.size}`);
console.log(`Destacados:         ${productos.filter((p) => p.destacado).length}`);
console.log(`Sin imagen:         ${productos.filter((p) => !p.imagen).length}`);

if (SIMULAR) {
  console.log("Modo simulación. Ejemplo del primer producto:\n");
  console.log(JSON.stringify(productos[0], null, 2));
  console.log("\nCategorías detectadas:");
  for (const c of categorias.values()) console.log(`  ${c.slug}  ←  ${c.nombre}`);
  process.exit(0);
}

const sb = createClient(URL, LLAVE, { auth: { persistSession: false } });

console.log("Subiendo categorías…");
const { error: errorCat } = await sb
  .from("categorias")
  .upsert([...categorias.values()], { onConflict: "slug" });
if (errorCat) {
  console.error("Error en categorías:", errorCat.message);
  process.exit(1);
}

console.log("Subiendo productos…");
// Por lotes: un upsert de cientos de filas de una vez puede exceder el límite.
const LOTE = 100;
for (let i = 0; i < productos.length; i += LOTE) {
  const lote = productos.slice(i, i + LOTE);
  const { error } = await sb.from("productos").upsert(lote, { onConflict: "sku" });
  if (error) {
    console.error(`
Error en el lote ${i / LOTE + 1}: ${error.message}`);
    // El caso típico: el esquema evolucionó y la tabla se creó con una versión
    // anterior. Decirlo explícitamente ahorra un rato de búsqueda a ciegas.
    if (/column|schema cache/i.test(error.message)) {
      console.error(
        `
A la tabla le falta una columna. Vuelve a ejecutar supabase/schema.sql
` +
          `en el SQL Editor de Supabase: incluye los ALTER que añaden las columnas
` +
          `nuevas y se puede correr las veces que haga falta.`,
      );
    }
    process.exit(1);
  }
  console.log(`  ${Math.min(i + LOTE, productos.length)} / ${productos.length}`);
}

// Filas que quedaron en la base y ya no estan en el CSV. Aparecen sobre todo
// al renombrar un SKU: el upsert inserta la nueva y la anterior se queda
// publicada sin que nadie lo note.
const vigentes = new Set(productos.map((p) => p.sku));
const { data: enBase } = await sb.from("productos").select("sku, nombre");
const sobrantes = (enBase ?? []).filter((p) => !vigentes.has(p.sku));

if (sobrantes.length > 0) {
  console.log(`
Hay ${sobrantes.length} productos en la base que no estan en el CSV:`);
  sobrantes.forEach((p) => console.log(`  - ${p.sku} | ${p.nombre}`));
  if (LIMPIAR) {
    const { error } = await sb
      .from("productos")
      .delete()
      .in("sku", sobrantes.map((p) => p.sku));
    console.log(error ? `  Error al borrarlos: ${error.message}` : "  Eliminados.");
  } else {
    console.log("  Siguen publicados. Vuelve a ejecutar con --limpiar para borrarlos.");
  }
}

console.log("\nListo. El catálogo quedó cargado en Supabase.");
