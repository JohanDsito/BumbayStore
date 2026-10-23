import type { Category, Niche, Product } from "@/dominio/modelos";

/**
 * Nichos de EJEMPLO para ver cómo se comporta la tienda con varias líneas.
 *
 * No son productos reales ni nichos decididos: los nichos de verdad los
 * define el negocio. Solo se cargan con CATALOGO=ejemplo en .env.local, nunca
 * en la tienda publicada ni como respaldo de Supabase, porque mostrarle a un
 * cliente algo que no se vende sería peor que no mostrarle nada.
 */

export const nichosEjemplo: Niche[] = [
  {
    slug: "hogar",
    nombre: "Hogar y cocina",
    submarca: null,
    titular: "Lo que hace falta en casa,\nal precio del importador.",
    descripcion:
      "Ollas, utensilios y organizadores importados directamente, con envío a cualquier municipio de Colombia.",
    datos: [{ etiqueta: "Envío", valor: "Toda Colombia" }],
    orden: 2,
  },
  {
    slug: "tecnologia",
    nombre: "Tecnología y accesorios",
    submarca: null,
    titular: "Accesorios para el celular\ny el computador.",
    descripcion:
      "Cargadores, cables, audífonos y soportes para el día a día, importados sin intermediarios.",
    datos: [],
    orden: 3,
  },
];

export const categoriasEjemplo: Category[] = [
  { slug: "ollas-y-sartenes", nichoSlug: "hogar", nombre: "Ollas y sartenes", orden: 1, descripcion: null },
  { slug: "organizacion", nichoSlug: "hogar", nombre: "Organización", orden: 2, descripcion: null },
  { slug: "cargadores-y-cables", nichoSlug: "tecnologia", nombre: "Cargadores y cables", orden: 1, descripcion: null },
  { slug: "audio", nichoSlug: "tecnologia", nombre: "Audio", orden: 2, descripcion: null },
];

/** Producto de ejemplo: solo cambia lo que distingue a cada uno. */
function ejemplo(
  datos: Pick<Product, "sku" | "nombre" | "categoriaSlug" | "precioUnitario"> &
    Partial<Product>,
): Product {
  const slug = `${datos.nombre}-${datos.sku}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return {
    id: `ejemplo-${datos.sku}`,
    slug,
    marca: null,
    color: null,
    grupo: null,
    imagen: null,
    imagenMini: null,
    imagenes: [],
    fichaTecnica: null,
    especificaciones: [],
    modoUso: null,
    beneficios: [],
    faq: [],
    destacado: false,
    agotado: false,
    activo: true,
    ...datos,
  };
}

export const productosEjemplo: Product[] = [
  ejemplo({
    sku: "EJ-HOG-001",
    nombre: "Juego de ollas antiadherentes x 5 piezas",
    categoriaSlug: "ollas-y-sartenes",
    precioUnitario: 189000,
    destacado: true,
    fichaTecnica:
      "Producto de ejemplo. Juego de cinco ollas con recubrimiento antiadherente, tapas de vidrio templado y mangos que no se calientan.",
    especificaciones: [
      { label: "Piezas", valor: "5 ollas + 5 tapas" },
      { label: "Material", valor: "Aluminio con antiadherente" },
    ],
  }),
  ejemplo({
    sku: "EJ-HOG-002",
    nombre: "Sartén de hierro fundido 26 cm",
    categoriaSlug: "ollas-y-sartenes",
    precioUnitario: 89000,
  }),
  ejemplo({
    sku: "EJ-HOG-003",
    nombre: "Organizador de cajones con divisiones ajustables",
    categoriaSlug: "organizacion",
    precioUnitario: 45000,
    agotado: true,
  }),
  ejemplo({
    sku: "EJ-TEC-001",
    nombre: "Cargador rápido USB-C 65W con dos puertos y cable de 1,5 metros incluido",
    categoriaSlug: "cargadores-y-cables",
    precioUnitario: 79000,
    destacado: true,
  }),
  ejemplo({
    sku: "EJ-TEC-002",
    nombre: "Cable USB-C a Lightning trenzado 2 m",
    categoriaSlug: "cargadores-y-cables",
    precioUnitario: 29000,
  }),
  ejemplo({
    sku: "EJ-TEC-003",
    nombre: "Audífonos inalámbricos con estuche de carga",
    categoriaSlug: "audio",
    precioUnitario: 119000,
  }),
];
