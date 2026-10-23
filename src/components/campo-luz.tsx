"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as campo from "@/cliente/campo/estado";

/**
 * El campo de luz: un filamento por nicho que respira detrás de la tienda.
 *
 * Es la pieza más cara del sitio, así que cada decisión de aquí es de
 * rendimiento antes que de efecto (PRODUCT.md: la velocidad en un celular de
 * gama media manda):
 *
 * - Debajo siempre hay un póster en CSS con los mismos colores. Es lo que se
 *   ve mientras carga, sin WebGL, con ahorro de datos o con poca memoria. El
 *   contenido nunca espera al campo.
 * - Con el movimiento reducido se dibuja una sola imagen quieta: se ve el
 *   mundo, pero nada se mueve.
 * - El sombreador arranca cuando el navegador está libre, después de pintar.
 * - Se dibuja a una fracción de la resolución y el navegador lo amplía: un
 *   campo difuso no necesita más píxeles. En celular, a 30 cuadros.
 * - Se congela al bajar más de una pantalla y con la pestaña oculta.
 *
 * Vive en el layout de la tienda: al navegar no se vuelve a crear, solo
 * cambia de color hacia el del nicho al que se entra.
 */

const FILAMENTOS = 4;

/** Relleno para cuando la tienda tiene menos de cuatro nichos: brasas del rojo. */
const RELLENO = ["#ff6a2a", "#9b0c2e", "#ff3b41"];

type Props = {
  /** Color de cada nicho visible, en el orden del menú. */
  colores: string[];
  /** Color de la tienda, para la portada general. */
  acentoTienda: string;
};

export function CampoLuz({ colores, acentoTienda }: Props) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const estado = useSyncExternalStore(campo.suscribir, campo.leer, campo.leer);

  // Lo que el campo debe mostrar ahora. Se recalcula al cambiar de página o
  // de foco; el bucle de dibujo se acerca a esto poco a poco.
  const meta = useMemo(
    () => calcularObjetivo(estado, colores, acentoTienda),
    [estado, colores, acentoTienda],
  );
  const objetivo = useRef<Objetivo>(meta);
  const reanudar = useRef<(() => void) | null>(null);
  useEffect(() => {
    objetivo.current = meta;
    reanudar.current?.();
  }, [meta]);

  useEffect(() => {
    const canvas = lienzo.current;
    const modo = modoDelEquipo();
    if (!canvas || modo === "poster") return;

    let cancelado = false;
    let detener: (() => void) | null = null;

    const arrancar = () => {
      if (cancelado) return;
      const motor = iniciar(canvas, objetivo, modo === "quieto", () => setVisible(true));
      if (!motor) return;
      detener = motor.detener;
      reanudar.current = motor.reanudar;
    };

    // Después de pintar y con el navegador libre: el campo nunca compite
    // con el contenido por el primer cuadro.
    // Safari no tiene requestIdleCallback: ahí basta con un respiro.
    const conInactividad = "requestIdleCallback" in window;
    const id = conInactividad
      ? window.requestIdleCallback(arrancar, { timeout: 1500 })
      : window.setTimeout(arrancar, 300);

    return () => {
      cancelado = true;
      if (conInactividad) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      detener?.();
      reanudar.current = null;
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <Poster objetivo={meta} />
      <canvas
        ref={lienzo}
        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Grano fino de película, fijo: le quita al degradado su brillo de
          pantalla y no cuesta nada porque no se mueve. */}
      <div className="absolute inset-0 opacity-[0.07] [background-image:url('data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22g%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23g)%22/%3E%3C/svg%3E')]" />
    </div>
  );
}

// --- Qué mostrar --------------------------------------------------------------

type Objetivo = {
  colores: [number, number, number][];
  pesos: number[];
  intensidad: number;
};

function calcularObjetivo(
  estado: campo.EstadoCampo,
  colores: string[],
  acentoTienda: string,
): Objetivo {
  // Dentro de un nicho, los cuatro filamentos toman su color en tonos
  // distintos: el campo entero es del nicho.
  if (estado.acento) {
    const base = hexARgb(estado.acento);
    return {
      colores: [base, aclarar(base, 0.35), oscurecer(base, 0.35), aclarar(base, 0.6)],
      pesos: [1, 0.75, 0.8, 0.45],
      intensidad: estado.intensidad,
    };
  }

  // En la portada general, un filamento por nicho; si hay menos de cuatro,
  // el resto son brasas del color de la tienda, más tenues.
  const propios = colores.slice(0, FILAMENTOS);
  const lista = [...propios, ...RELLENO].slice(0, FILAMENTOS);
  return {
    colores: lista.map((c) => hexARgb(c || acentoTienda)),
    pesos: lista.map((_, i) => {
      const deNicho = i < propios.length;
      if (estado.foco === null) return deNicho ? 0.85 : 0.35;
      return i === estado.foco ? 1.25 : 0.2;
    }),
    intensidad: estado.intensidad,
  };
}

/** Respaldo en CSS: los mismos colores como luces difusas, sin animar. */
function Poster({ objetivo }: { objetivo: Objetivo }) {
  const [a, b, c] = objetivo.colores.map(
    ([r, g, bl]) => `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(bl * 255)})`,
  );
  return (
    <div
      className="absolute inset-0 transition-[background] duration-1000"
      style={{
        opacity: 0.55 * objetivo.intensidad,
        background: `radial-gradient(60% 40% at 78% 38%, color-mix(in oklab, ${a} 34%, transparent), transparent 70%),
          radial-gradient(45% 35% at 92% 70%, color-mix(in oklab, ${b} 26%, transparent), transparent 70%),
          radial-gradient(55% 30% at 55% 85%, color-mix(in oklab, ${c} 18%, transparent), transparent 70%)`,
      }}
    />
  );
}

/**
 * Qué puede mostrar este equipo:
 * - "poster": nada de WebGL. Ahorro de datos o un equipo muy justo; ante la
 *   duda, el póster, porque un campo que va a saltos es peor que uno quieto.
 * - "quieto": el campo dibujado una vez y sin moverse (movimiento reducido).
 * - "animado": el campo vivo.
 */
function modoDelEquipo(): "poster" | "quieto" | "animado" {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return "poster";
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return "poster";
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) return "poster";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "quieto";
  return "animado";
}

// --- El sombreador -------------------------------------------------------------

const VERTICES = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

// Cada filamento es una curva de senos con un poco de ruido. Su luz tiene un
// núcleo fino, un halo y partículas: píxeles fijos que se encienden solo
// cuando el filamento pasa cerca. El puntero lo curva al pasar.
const FRAGMENTOS = `
precision mediump float;
uniform vec2 u_res;
uniform float u_t;
uniform vec2 u_mouse;
uniform vec3 u_col[4];
uniform float u_w[4];
uniform float u_int;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float ruido(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 m = vec2(u_mouse.x * asp, u_mouse.y);
  float cerca = exp(-pow(distance(p, m) * 2.4, 2.0));

  // En pantallas anchas el texto va a la izquierda: los filamentos nacen
  // casi apagados ahí y crecen hacia la derecha. En celular el texto ocupa
  // todo el ancho, así que cruzan parejos pero tenues.
  float ancho = step(1.2, asp);
  float entrada = mix(0.42, 0.08 + 0.92 * smoothstep(0.3, 0.92, uv.x), ancho);

  vec3 col = vec3(0.027, 0.031, 0.051);
  float semilla = hash(floor(gl_FragCoord.xy));

  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float y = 0.26 + fi * 0.15
      + 0.15 * sin(p.x * (1.05 + fi * 0.21) + u_t * (0.09 + fi * 0.025) + fi * 1.7)
      + 0.06 * sin(p.x * (2.6 + fi * 0.37) - u_t * (0.14 + fi * 0.02))
      + 0.08 * (ruido(vec2(p.x * 1.3 + fi * 9.0, u_t * 0.11)) - 0.5)
      + 0.07 * cerca * sin(u_t * 0.7 + fi * 2.1);
    float d = abs(p.y - y);
    float nucleo = exp(-d * 95.0);
    float halo = exp(-d * 13.0) * 0.26;
    float particulas = step(0.9, semilla) * exp(-d * 26.0) * 0.85;
    col += u_col[i] * (nucleo + halo + particulas) * u_w[i] * entrada * u_int;
  }

  col *= 1.0 - 0.4 * length(uv - vec2(0.62, 0.48));
  gl_FragColor = vec4(col, 1.0);
}
`;

function iniciar(
  canvas: HTMLCanvasElement,
  objetivo: { current: Objetivo },
  quieto: boolean,
  alPrimerCuadro: () => void,
): { detener: () => void; reanudar: () => void } | null {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  const programa = compilar(gl);
  if (!programa) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Un triángulo que cubre toda la pantalla.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const atributo = gl.getAttribLocation(programa, "p");
  gl.enableVertexAttribArray(atributo);
  gl.vertexAttribPointer(atributo, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(programa, "u_res"),
    t: gl.getUniformLocation(programa, "u_t"),
    mouse: gl.getUniformLocation(programa, "u_mouse"),
    col: gl.getUniformLocation(programa, "u_col"),
    w: gl.getUniformLocation(programa, "u_w"),
    int: gl.getUniformLocation(programa, "u_int"),
  };

  const tactil = window.matchMedia("(pointer: coarse)").matches;
  const escala = tactil ? 0.35 : 0.5;
  const intervalo = tactil ? 1000 / 30 : 0;

  // Valores que se mueven hacia el objetivo, para que los cambios de color
  // sean un fundido y no un salto.
  const actual: Objetivo = structuredClone(objetivo.current);
  const raton = { x: 0.7, y: 0.5, ax: 0.7, ay: 0.5 };

  const ajustar = () => {
    const w = Math.min(Math.round(window.innerWidth * escala), 960);
    const h = Math.round(w * (window.innerHeight / window.innerWidth));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };
  ajustar();

  let marco = 0;
  let previo = 0;
  let ultimoDibujo = 0;
  // Quieto, los filamentos se dibujan a media corriente y no recién nacidos.
  let tiempo = quieto ? 14 : 0;
  let primero = true;
  let corriendo = false;

  // Pasada la primera pantalla el campo ya casi no se ve: se congela.
  const debeCorrer = () =>
    document.visibilityState === "visible" && window.scrollY < window.innerHeight * 1.1;

  const cuadro = (ahora: number) => {
    marco = 0;
    if (!debeCorrer()) {
      corriendo = false;
      return;
    }
    marco = requestAnimationFrame(cuadro);
    if (intervalo && ahora - ultimoDibujo < intervalo) return;
    const dt = previo ? Math.min((ahora - previo) / 1000, 0.1) : 0.016;
    previo = ahora;
    ultimoDibujo = ahora;
    tiempo += dt;

    // Quieto: salta directo al objetivo, sin fundido, y no pide más cuadros.
    const k = quieto ? 1 : 1 - Math.exp(-dt * 3.5);
    const meta = objetivo.current;
    for (let i = 0; i < FILAMENTOS; i++) {
      for (let c = 0; c < 3; c++) {
        actual.colores[i][c] += (meta.colores[i][c] - actual.colores[i][c]) * k;
      }
      actual.pesos[i] += (meta.pesos[i] - actual.pesos[i]) * k;
    }
    actual.intensidad += (meta.intensidad - actual.intensidad) * k;
    raton.ax += (raton.x - raton.ax) * k;
    raton.ay += (raton.y - raton.ay) * k;

    gl.useProgram(programa);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.t, tiempo);
    gl.uniform2f(u.mouse, raton.ax, raton.ay);
    gl.uniform3fv(u.col, actual.colores.flat());
    gl.uniform1fv(u.w, actual.pesos);
    gl.uniform1f(u.int, actual.intensidad);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (primero) {
      primero = false;
      alPrimerCuadro();
    }
    if (quieto) {
      cancelAnimationFrame(marco);
      marco = 0;
      corriendo = false;
    }
  };

  const reanudar = () => {
    if (corriendo || !debeCorrer()) return;
    corriendo = true;
    previo = 0;
    marco = requestAnimationFrame(cuadro);
  };

  const alMover = (e: PointerEvent) => {
    raton.x = e.clientX / window.innerWidth;
    raton.y = 1 - e.clientY / window.innerHeight;
  };
  const alRedimensionar = () => {
    ajustar();
    reanudar();
  };
  const alPerderContexto = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(marco);
    corriendo = false;
  };

  // Quieto no necesita seguir el scroll ni la pestaña: solo redibuja si
  // cambia el tamaño o el color.
  if (!quieto) {
    window.addEventListener("scroll", reanudar, { passive: true });
    document.addEventListener("visibilitychange", reanudar);
  }
  window.addEventListener("resize", alRedimensionar);
  if (!tactil && !quieto) window.addEventListener("pointermove", alMover, { passive: true });
  canvas.addEventListener("webglcontextlost", alPerderContexto);

  reanudar();

  return {
    reanudar,
    detener: () => {
      cancelAnimationFrame(marco);
      window.removeEventListener("scroll", reanudar);
      window.removeEventListener("resize", alRedimensionar);
      document.removeEventListener("visibilitychange", reanudar);
      window.removeEventListener("pointermove", alMover);
      canvas.removeEventListener("webglcontextlost", alPerderContexto);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

function compilar(gl: WebGLRenderingContext): WebGLProgram | null {
  const crear = (tipo: number, fuente: string) => {
    const s = gl.createShader(tipo);
    if (!s) return null;
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("[campo]", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const v = crear(gl.VERTEX_SHADER, VERTICES);
  const f = crear(gl.FRAGMENT_SHADER, FRAGMENTOS);
  const p = gl.createProgram();
  if (!v || !f || !p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("[campo]", gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

// --- Color ----------------------------------------------------------------------

function hexARgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  if (Number.isNaN(n)) return [0.93, 0.03, 0.06];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const aclarar = (c: [number, number, number], t: number): [number, number, number] =>
  [c[0] + (1 - c[0]) * t, c[1] + (1 - c[1]) * t, c[2] + (1 - c[2]) * t];

const oscurecer = (c: [number, number, number], t: number): [number, number, number] =>
  [c[0] * (1 - t), c[1] * (1 - t), c[2] * (1 - t)];
