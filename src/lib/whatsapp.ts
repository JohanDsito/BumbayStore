import { site } from "@/lib/site-config";
import { precio } from "@/lib/format";
import type { CartLine, Product } from "@/lib/types";

/**
 * Arma el enlace de WhatsApp con el pedido ya redactado.
 *
 * Aquí termina el rol de la web: el cliente llega al chat con todo escrito y
 * la venta se cierra hablando. Por eso el mensaje tiene que leerse bien en el
 * celular, sin tablas ni caracteres raros.
 */
type DatosPedido = {
  nombre: string;
  ciudad: string;
  comentario: string;
};

export function enlacePedido(
  lineas: CartLine[],
  total: number,
  datos: DatosPedido,
): string {
  const items = lineas.map((l) => {
    const importe = precio(l.precioUnitario * l.cantidad);
    return `• ${l.cantidad} x ${l.nombre}\n  ${l.sku} — ${precio(l.precioUnitario)} c/u = ${importe}`;
  });

  const partes = [
    `*Nuevo pedido — ${site.nombre}*`,
    "",
    `*Cliente:* ${datos.nombre.trim()}`,
    `*Ciudad:* ${datos.ciudad.trim()}`,
    "",
    items.join("\n"),
    "",
    `*Total: ${precio(total)}*`,
    `${lineas.length} ${lineas.length === 1 ? "producto" : "productos"} · ${sumaUnidades(lineas)} ${sumaUnidades(lineas) === 1 ? "unidad" : "unidades"}`,
  ];

  if (datos.comentario.trim()) {
    partes.push("", `*Comentarios:*`, datos.comentario.trim());
  }

  return construirEnlace(partes.join("\n"));
}

/** Enlace para consultar por un producto puntual, desde su ficha. */
export function enlaceConsulta(producto: Product): string {
  const texto = [
    producto.agotado
      ? `Hola, quiero que me avisen cuando vuelva a entrar:`
      : `Hola, quiero más información sobre:`,
    "",
    `*${producto.nombre}*`,
    `Código: ${producto.sku}`,
    `${site.url}/producto/${producto.slug}`,
  ].join("\n");
  return construirEnlace(texto);
}

/** Enlace genérico, para el header y el footer. */
export function enlaceGeneral(texto = "Hola, quisiera información sobre sus herramientas."): string {
  return construirEnlace(texto);
}

function construirEnlace(texto: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}

function sumaUnidades(lineas: CartLine[]): number {
  return lineas.reduce((suma, l) => suma + l.cantidad, 0);
}
