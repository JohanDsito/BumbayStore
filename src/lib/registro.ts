"use client";

import type { CartLine } from "@/lib/types";

/**
 * Registro de lo que hace el cliente en el catálogo, para que el panel de
 * administración pueda mostrarlo.
 *
 * Se escribe con `fetch` contra la API REST de Supabase en vez de con la
 * librería oficial. El motivo es el peso: la librería son unos 240 KB con
 * módulos de autenticación y tiempo real que aquí no hacen falta, y viajarían
 * al navegador de cada visitante solo para registrar dos inserciones. Esto son
 * dos peticiones HTTP normales.
 *
 * Las políticas de la base solo permiten INSERT a un visitante anónimo, nunca
 * leer: son datos de negocio y salen únicamente para un administrador.
 *
 * Nada de esto puede estorbar la compra: si el registro falla, se traga el
 * error y el cliente sigue su camino.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const llave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function insertar(tabla: string, fila: unknown): Promise<void> {
  if (!url || !llave) return;
  try {
    await fetch(`${url}/rest/v1/${tabla}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: llave,
        authorization: `Bearer ${llave}`,
        // Sin esto la respuesta trae la fila insertada, que aquí no sirve
        // de nada y solo gasta datos del cliente.
        prefer: "return=minimal",
      },
      body: JSON.stringify(fila),
      // El pedido abre WhatsApp en otra pestaña, pero si el navegador
      // decidiera descargar esta página igual queremos que salga.
      keepalive: true,
    });
  } catch {
    // Es estadística: nunca puede romper lo que el cliente está haciendo.
  }
}

/**
 * Guarda el pedido en el momento en que el cliente pulsa enviar, antes de que
 * salga hacia WhatsApp. Así quedan también los pedidos que nunca llegaron al
 * chat porque se arrepintieron en el último paso.
 */
export async function registrarPedido(datos: {
  nombre: string;
  ciudad: string;
  comentario: string;
  total: number;
  lineas: CartLine[];
}): Promise<void> {
  await insertar("pedidos", {
    nombre: datos.nombre.trim(),
    ciudad: datos.ciudad.trim(),
    comentario: datos.comentario.trim() || null,
    total: datos.total,
    unidades: datos.lineas.reduce((s, l) => s + l.cantidad, 0),
    // Se congela el precio del momento: si mañana cambia, este registro
    // sigue diciendo por cuánto se pidió.
    lineas: datos.lineas.map((l) => ({
      sku: l.sku,
      nombre: l.nombre,
      cantidad: l.cantidad,
      precio: l.precioUnitario,
    })),
  });
}

/**
 * Deja constancia de lo que se busca. Las consultas sin resultados son las
 * que importan: dicen qué conviene traer en la próxima importación.
 */
export async function registrarBusqueda(
  consulta: string,
  resultados: number,
): Promise<void> {
  const limpia = consulta.trim();
  if (limpia.length < 2 || limpia.length > 120) return;
  await insertar("busquedas", { consulta: limpia, resultados });
}
