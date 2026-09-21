import type { Category } from "@/lib/types";

/**
 * Categorías del catálogo. Al migrar a Supabase esto vive en la tabla
 * `categorias`; aquí queda como respaldo y como orden de referencia del menú.
 */
export const categoriasSeed: Category[] = [
  {
    slug: "taladros-inalambricos",
    nombre: "Taladros inalámbricos",
    orden: 1,
    descripcion:
      "Taladros percutores y atornilladores a batería de 12V, 20V y 21V con portabrocas de 13 mm, control de torque y baterías de litio.",
  },
  {
    slug: "pulidoras",
    nombre: "Pulidoras",
    orden: 2,
    descripcion:
      "Pulidoras angulares eléctricas e inalámbricas de 4 1/2\" y 5\" para corte y desbaste en metal, concreto y cerámica.",
  },
  {
    slug: "combos-inalambricos",
    nombre: "Combos inalámbricos",
    orden: 3,
    descripcion:
      "Kits de herramienta inalámbrica con batería compartida, cargador y maletín. La forma más rentable de armar el taller.",
  },
  {
    slug: "pistolas-de-impacto",
    nombre: "Pistolas de impacto",
    orden: 4,
    descripcion:
      "Llaves de impacto inalámbricas de alto torque para montallantas, mecánica automotriz y montaje industrial.",
  },
  {
    slug: "rotomartillos",
    nombre: "Rotomartillos",
    orden: 5,
    descripcion:
      "Rotomartillos SDS-Plus 110V e inalámbricos para perforación en concreto, ladrillo y mampostería.",
  },
  {
    slug: "herramienta-manual",
    nombre: "Herramienta manual",
    orden: 6,
    descripcion:
      "Juegos de llaves, rachets, destornilladores, alicates y copas en acero cromo vanadio.",
  },
  {
    slug: "niveles-laser",
    nombre: "Niveles láser",
    orden: 7,
    descripcion:
      "Niveles láser autonivelantes de líneas verdes y rojas para instalación de enchapes, drywall y carpintería.",
  },
  {
    slug: "lamparas-y-linternas",
    nombre: "Lámparas y linternas",
    orden: 8,
    descripcion:
      "Iluminación LED recargable e inalámbrica para taller, obra y trabajo en exteriores.",
  },
];
