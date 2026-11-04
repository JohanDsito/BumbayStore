import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * La imagen que aparece al compartir un enlace de la tienda en WhatsApp,
 * Facebook o cualquier red: 1200 × 630, en el mundo del sitio (fondo noche,
 * filamentos de luz, titular condensado) y con el color de la página.
 *
 * La usan los `opengraph-image.tsx` de la portada y de cada nicho. Las fichas
 * de producto no: ahí la mejor imagen es la foto del producto.
 */

export const TAMANO_COMPARTIR = { width: 1200, height: 630 };

// Cada ruta va escrita completa: si se armara con variables, el empaquetador no
// sabría qué archivos hacen falta y metería todo el proyecto en el servidor.
const leerCondensada = () =>
  readFile(join(process.cwd(), "assets/fuentes/archivo-extra-condensada-700.woff"));
const leerAncha = () =>
  readFile(join(process.cwd(), "assets/fuentes/archivo-semiexpandida-500.woff"));
const leerLogoStore = () => readFile(join(process.cwd(), "public/marca/bumbay-store.png"));
const leerLogoTools = () => readFile(join(process.cwd(), "public/marca/bumbay-tools.png"));

async function logo(cual: "store" | "tools"): Promise<string> {
  const datos = await (cual === "tools" ? leerLogoTools() : leerLogoStore());
  return `data:image/png;base64,${datos.toString("base64")}`;
}

/**
 * Un filamento con brillo: tres trazos del mismo color, del más ancho y tenue
 * al más fino. Es una función y no un componente, y va en un <g> y no en un
 * fragmento: dentro de un SVG el generador solo entiende etiquetas SVG.
 */
function filamento(d: string, color: string) {
  return (
    <g key={d}>
      <path d={d} stroke={color} strokeWidth={18} strokeOpacity={0.08} fill="none" />
      <path d={d} stroke={color} strokeWidth={6} strokeOpacity={0.3} fill="none" />
      <path d={d} stroke={color} strokeWidth={1.6} strokeOpacity={0.95} fill="none" />
    </g>
  );
}

/** Medidas de los logos en public/marca, para dibujarlos sin deformar. */
const LOGOS = {
  store: { ancho: 895, alto: 380, dibujo: 230 },
  tools: { ancho: 1600, alto: 346, dibujo: 300 },
};

export async function imagenCompartir({
  titular,
  acento,
  rotulo,
  logoDe,
}: {
  /** Una o dos líneas separadas por salto de línea; la segunda va en el acento. */
  titular: string;
  acento: string;
  rotulo: string;
  logoDe: "store" | "tools";
}) {
  const [condensada, ancha, imagenLogo] = await Promise.all([
    leerCondensada(),
    leerAncha(),
    logo(logoDe),
  ]);

  const [primera, ...resto] = titular.split("\n");
  const segunda = resto.join(" ").trim();
  const largo = Math.max(primera.length, segunda.length);
  // Titulares largos bajan de tamaño para caber en dos líneas.
  const tamano = largo > 26 ? 78 : largo > 21 ? 88 : largo > 16 ? 104 : 118;
  const medida = LOGOS[logoDe];
  const altoLogo = Math.round((medida.dibujo * medida.alto) / medida.ancho);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#07080d",
          position: "relative",
        }}
      >
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {/* Arriba a la derecha: entran por el borde y no cruzan el titular. */}
          {filamento("M 560 -20 C 700 160, 900 260, 1220 200", acento)}
          {filamento("M 760 -20 C 860 120, 1000 330, 1220 330", acento)}
          {filamento("M 420 -20 C 640 200, 980 120, 1220 90", "#12acaa")}
        </svg>

        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
        <img src={imagenLogo} width={medida.dibujo} height={altoLogo} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Archivo Condensada",
              fontSize: tamano,
              lineHeight: 0.9,
              textTransform: "uppercase",
              color: "#f7f8fb",
            }}
          >
            <span>{primera}</span>
            {segunda && <span style={{ color: acento }}>{segunda}</span>}
          </div>
          <span
            style={{
              marginTop: 28,
              fontFamily: "Archivo Ancha",
              fontSize: 22,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#bcc0d3",
            }}
          >
            {rotulo}
          </span>
        </div>
      </div>
    ),
    {
      ...TAMANO_COMPARTIR,
      fonts: [
        { name: "Archivo Condensada", data: condensada, weight: 700, style: "normal" },
        { name: "Archivo Ancha", data: ancha, weight: 500, style: "normal" },
      ],
    },
  );
}
