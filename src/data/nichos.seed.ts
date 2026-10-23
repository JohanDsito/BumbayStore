import type { Niche } from "@/dominio/modelos";

/**
 * Nichos de Bumbay Store. En Supabase viven en la tabla `nichos`; aquí quedan
 * como respaldo y como referencia del orden del menú.
 */
export const nichosSeed: Niche[] = [
  {
    slug: "herramientas",
    nombre: "Herramientas",
    submarca: "Bumbay Tools",
    titular: "Herramienta inalámbrica\na precio de mayorista.",
    descripcion:
      "Taladros, pulidoras, combos y herramienta manual para ferreterías, talleres y contratistas en toda Colombia. Arma tu pedido en el catálogo y lo cerramos por WhatsApp.",
    datos: [
      { etiqueta: "Meses de garantía", valor: "6" },
      { etiqueta: "Plataforma de batería", valor: "128V" },
    ],
    orden: 1,
  },
];
