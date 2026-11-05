import {
  IconoCaja,
  IconoCamion,
  IconoPago,
  IconoWhatsApp,
} from "@/components/icons";

/**
 * Lo que vale para cualquier compra, justo antes del pie: cuatro promesas
 * verdaderas en una sola franja, sin cajas. Si cambia alguna (por ejemplo,
 * una forma de pago), se cambia aquí y en FORMAS_PAGO.
 */
const PROMESAS = [
  { Icono: IconoCaja, titulo: "Importador directo", texto: "Sin intermediarios: el precio de distribuidor es para todos." },
  { Icono: IconoCamion, titulo: "Envío a toda Colombia", texto: "A cualquier municipio del país." },
  { Icono: IconoWhatsApp, titulo: "Pedido por WhatsApp", texto: "Lo armas aquí y lo cerramos hablando." },
  { Icono: IconoPago, titulo: "Paga como prefieras", texto: "Anticipado, contra entrega, Addi o Sistecrédito." },
];

export function FranjaConfianza() {
  return (
    // El espacio de arriba va dentro de un fondo sólido: si fuera margen,
    // dejaría ver el campo de luz entre la tienda y la franja.
    <div className="bg-fondo pt-14 md:pt-20">
      <section aria-label="Por qué comprar aquí" className="border-t border-linea bg-hundido">
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-7 px-4 py-9 sm:px-6 lg:grid-cols-4 lg:gap-x-10 lg:py-11">
          {PROMESAS.map(({ Icono, titulo, texto }) => (
            <li key={titulo} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Icono className="h-7 w-7 shrink-0 text-acento-texto" />
              <div>
                <p className="text-[15px] font-semibold leading-snug text-tinta-fuerte">{titulo}</p>
                <p className="mt-1 text-[13px] leading-snug text-tinta-media">{texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
