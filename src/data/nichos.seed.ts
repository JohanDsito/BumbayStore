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
    descripcion:
      "Herramienta inalámbrica profesional de 128V: taladros, pulidoras, llaves de impacto, combos y herramienta manual.",
    orden: 1,
  },
];
