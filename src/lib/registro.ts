"use client";

import { getSupabase } from "@/lib/supabase";
import type { CartLine } from "@/lib/types";

/**
 * Registro de lo que hace el cliente en el catálogo, para que el panel de
 * administración pueda mostrarlo.
 *
 * Todo esto se escribe con la llave pública. Las políticas de la base solo
 * permiten INSERT a un visitante anónimo, nunca leer: son datos de negocio y
 * salen únicamente para un usuario autenticado. El permiso es justo el inverso
 * al del catálogo, que se lee en público y se escribe autenticado.
 *
 * Nada de esto puede hacer fallar la compra: si el registro no se puede
 * guardar, se traga el error y el cliente sigue su camino.
 */

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
  const sb = getSupabase();
  if (!sb) return;

  try {
    await sb.from("pedidos").insert({
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
  } catch {
    // El pedido va a WhatsApp igual. Perder la estadística no es motivo
    // para estorbarle la compra a nadie.
  }
}

/**
 * Deja constancia de lo que se busca. Las consultas sin resultados son las
 * que importan: dicen qué conviene traer en la próxima importación.
 */
export async function registrarBusqueda(
  consulta: string,
  resultados: number,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;

  const limpia = consulta.trim();
  if (limpia.length < 2 || limpia.length > 120) return;

  try {
    await sb.from("busquedas").insert({ consulta: limpia, resultados });
  } catch {
    // Igual que arriba: es estadística, no puede romper la búsqueda.
  }
}
