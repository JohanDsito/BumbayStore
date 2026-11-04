import type { CartLine } from "./modelos";
import { ubicacionValida, type Divipola } from "./ubicacion";

/**
 * Reglas del pedido.
 *
 * Los límites existen para que un pedido absurdo —miles de líneas, un nombre
 * de diez páginas— no llegue a la base de datos. La base tiene las mismas
 * restricciones (ver supabase/migrations): estas solo evitan que el cliente
 * escriba algo que de todas formas se rechazaría.
 */
export const LIMITES_PEDIDO = {
  /** Unidades de un mismo producto en una línea. */
  cantidadMaxima: 999,
  /** Productos distintos en un pedido. */
  lineasMaximas: 100,
  /** Valen igual para el nombre y para el apellido. */
  nombreMinimo: 2,
  nombreMaximo: 80,
  comentarioMaximo: 1000,
} as const;

/** Lo que se registra de cada búsqueda: ni muy corta para decir algo, ni un párrafo. */
export const LIMITES_BUSQUEDA = { minimo: 2, maximo: 120 } as const;

export function totalesPedido(lineas: readonly CartLine[]): {
  unidades: number;
  total: number;
} {
  return lineas.reduce(
    (acc, l) => ({
      unidades: acc.unidades + l.cantidad,
      total: acc.total + l.precioUnitario * l.cantidad,
    }),
    { unidades: 0, total: 0 },
  );
}

/** Lleva una cantidad al rango permitido para una línea del pedido. */
export function acotarCantidad(cantidad: number): number {
  return Math.min(LIMITES_PEDIDO.cantidadMaxima, Math.max(0, Math.floor(cantidad)));
}

export function nombreValido(nombre: string): boolean {
  const limpio = nombre.trim();
  return (
    limpio.length >= LIMITES_PEDIDO.nombreMinimo &&
    limpio.length <= LIMITES_PEDIDO.nombreMaximo
  );
}

/**
 * Formas de pago que el cliente puede elegir. El `id` es lo que se guarda en
 * la base (ver la restricción `pedidos_forma`); el `nombre`, lo que se lee.
 * Addi y Sistecrédito por ahora solo se eligen: el asesor gestiona el
 * crédito por WhatsApp.
 */
export const FORMAS_PAGO = [
  { id: "anticipado", nombre: "Pago anticipado" },
  { id: "contra_entrega", nombre: "Pago contra entrega" },
  { id: "addi", nombre: "Addi" },
  { id: "sistecredito", nombre: "Sistecrédito" },
] as const;

export type FormaPago = (typeof FORMAS_PAGO)[number]["id"];

export function esFormaPago(valor: string): valor is FormaPago {
  return FORMAS_PAGO.some((f) => f.id === valor);
}

/** "contra_entrega" → "Pago contra entrega". Devuelve el texto tal cual si no la conoce. */
export function nombreFormaPago(id: string): string {
  return FORMAS_PAGO.find((f) => f.id === id)?.nombre ?? id;
}

/**
 * Celular colombiano en sus 10 dígitos, sin espacios ni guiones. Acepta el
 * indicativo (+57) porque mucha gente lo escribe así; lo quita. Si lo escrito
 * no es un celular, devuelve los dígitos que encontró, y `celularValido` lo
 * rechazará.
 */
export function normalizarCelular(texto: string): string {
  const digitos = texto.replace(/\D/g, "");
  return digitos.length === 12 && digitos.startsWith("573") ? digitos.slice(2) : digitos;
}

/** 10 dígitos que empiezan por 3: así son todos los celulares en Colombia. */
export function celularValido(texto: string): boolean {
  return /^3\d{9}$/.test(normalizarCelular(texto));
}

/** "3001234567" → "300 123 4567", para leerlo en el mensaje y en el panel. */
export function formatearCelular(texto: string): string {
  const d = normalizarCelular(texto);
  return d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : texto.trim();
}

/** Lo que el cliente escribe en el formulario del pedido. */
export type DatosCliente = {
  nombre: string;
  apellido: string;
  celular: string;
  departamento: string;
  municipio: string;
  formaPago: string;
};

/**
 * Campos que impiden enviar el pedido, en el orden del formulario: el primero
 * es el que recibe el foco. Vacío si todo está bien.
 */
export function camposInvalidos(
  datos: DatosCliente,
  divipola: Divipola,
): (keyof DatosCliente)[] {
  const malos: (keyof DatosCliente)[] = [];
  if (!nombreValido(datos.nombre)) malos.push("nombre");
  if (!nombreValido(datos.apellido)) malos.push("apellido");
  if (!celularValido(datos.celular)) malos.push("celular");
  if (!divipola[datos.departamento]) malos.push("departamento");
  if (!ubicacionValida(datos.departamento, datos.municipio, divipola)) malos.push("municipio");
  if (!esFormaPago(datos.formaPago)) malos.push("formaPago");
  return malos;
}

export function busquedaRegistrable(consulta: string): boolean {
  const limpia = consulta.trim();
  return (
    limpia.length >= LIMITES_BUSQUEDA.minimo &&
    limpia.length <= LIMITES_BUSQUEDA.maximo
  );
}
