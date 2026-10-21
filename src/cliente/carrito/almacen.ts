import type { CartLine, Product } from "@/dominio/modelos";
import { LIMITES_PEDIDO, acotarCantidad } from "@/dominio/pedido";

/**
 * Almacén del pedido.
 *
 * Vive fuera de React y se consume con `useSyncExternalStore`. Se hizo así por
 * dos razones concretas:
 *
 *  1. El pedido se guarda en el navegador, así que el servidor no lo conoce.
 *     `getSnapshotServidor` devuelve un pedido vacío para que el HTML del
 *     servidor y el primer render del cliente coincidan, y React rellena los
 *     datos reales justo después de hidratar. Sin esto habría un desajuste de
 *     hidratación o un `setState` dentro de un efecto.
 *
 *  2. Si el cliente abre el catálogo en dos pestañas, el evento `storage`
 *     mantiene ambas al día sin código adicional.
 */

const CLAVE = "bumbay:pedido:v1";

export type EstadoPedido = {
  lineas: CartLine[];
  /** Nombre de quien hace el pedido. */
  nombre: string;
  /** Ciudad o municipio de entrega: sin esto no se puede cotizar el envío. */
  ciudad: string;
  comentario: string;
  /** Panel abierto. Es estado de interfaz: no se persiste. */
  abierto: boolean;
};

const VACIO: EstadoPedido = {
  lineas: [],
  nombre: "",
  ciudad: "",
  comentario: "",
  abierto: false,
};

let estado: EstadoPedido = VACIO;
let hidratado = false;
const oyentes = new Set<() => void>();

function leerAlmacen(): EstadoPedido {
  if (typeof window === "undefined") return VACIO;
  try {
    const bruto = window.localStorage.getItem(CLAVE);
    if (!bruto) return VACIO;
    const datos = JSON.parse(bruto) as Partial<EstadoPedido>;
    return {
      lineas: Array.isArray(datos.lineas) ? datos.lineas : [],
      nombre: typeof datos.nombre === "string" ? datos.nombre : "",
      ciudad: typeof datos.ciudad === "string" ? datos.ciudad : "",
      comentario: typeof datos.comentario === "string" ? datos.comentario : "",
      abierto: false,
    };
  } catch {
    // localStorage bloqueado (ventana privada) o contenido corrupto.
    return VACIO;
  }
}

function guardar(nuevo: EstadoPedido) {
  try {
    window.localStorage.setItem(
      CLAVE,
      JSON.stringify({
        lineas: nuevo.lineas,
        nombre: nuevo.nombre,
        ciudad: nuevo.ciudad,
        comentario: nuevo.comentario,
      }),
    );
  } catch {
    // Sin almacenamiento: el pedido vive solo en memoria.
  }
}

function fijar(cambio: Partial<EstadoPedido>, persistir = true) {
  estado = { ...estado, ...cambio };
  if (persistir) guardar(estado);
  for (const oyente of oyentes) oyente();
}

// --- Contrato de useSyncExternalStore ---------------------------------------

export function suscribir(alCambiar: () => void): () => void {
  oyentes.add(alCambiar);

  // Otra pestaña modificó el pedido: reflejarlo aquí.
  const alCambiarAlmacen = (e: StorageEvent) => {
    if (e.key !== CLAVE) return;
    estado = { ...leerAlmacen(), abierto: estado.abierto };
    for (const o of oyentes) o();
  };
  window.addEventListener("storage", alCambiarAlmacen);

  return () => {
    oyentes.delete(alCambiar);
    window.removeEventListener("storage", alCambiarAlmacen);
  };
}

export function getSnapshot(): EstadoPedido {
  // La lectura del almacén ocurre una sola vez, y el resultado queda cacheado:
  // getSnapshot debe devolver siempre la misma referencia si nada cambió.
  if (!hidratado) {
    estado = leerAlmacen();
    hidratado = true;
  }
  return estado;
}

export function getSnapshotServidor(): EstadoPedido {
  return VACIO;
}

// --- Acciones ---------------------------------------------------------------

export function agregar(producto: Product, cantidad = 1) {
  const existente = estado.lineas.find((l) => l.slug === producto.slug);
  // Un pedido tiene un tope de productos distintos; pasado ese punto ya es
  // una cotización que conviene hablar directamente.
  if (!existente && estado.lineas.length >= LIMITES_PEDIDO.lineasMaximas) return;
  const lineas = existente
    ? estado.lineas.map((l) =>
        l.slug === producto.slug
          ? { ...l, cantidad: acotarCantidad(l.cantidad + cantidad) }
          : l,
      )
    : [
        ...estado.lineas,
        {
          slug: producto.slug,
          sku: producto.sku,
          nombre: producto.nombre,
          precioUnitario: producto.precioUnitario,
          imagen: producto.imagen,
          cantidad: acotarCantidad(cantidad),
        },
      ];
  fijar({ lineas });
}

export function fijarCantidad(slug: string, cantidad: number) {
  const lineas =
    cantidad <= 0
      ? estado.lineas.filter((l) => l.slug !== slug)
      : estado.lineas.map((l) =>
          l.slug === slug ? { ...l, cantidad: acotarCantidad(cantidad) } : l,
        );
  fijar({ lineas });
}

export function quitar(slug: string) {
  fijar({ lineas: estado.lineas.filter((l) => l.slug !== slug) });
}

export function vaciar() {
  // El nombre y la ciudad se conservan: si el cliente vuelve a pedir, no
  // tiene por qué escribirlos otra vez.
  fijar({ lineas: [], comentario: "", abierto: false });
}

export function fijarComentario(comentario: string) {
  fijar({ comentario });
}

export function fijarNombre(nombre: string) {
  fijar({ nombre });
}

export function fijarCiudad(ciudad: string) {
  fijar({ ciudad });
}

export function abrir() {
  fijar({ abierto: true }, false);
}

export function cerrar() {
  fijar({ abierto: false }, false);
}
