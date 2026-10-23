import type { Category, Niche, Product } from "@/dominio/modelos";

/**
 * Catálogo del PEOR CASO, para probar que la interfaz no se rompe con datos
 * reales incómodos. Solo se carga con CATALOGO=extremo en .env.local; nunca
 * en la tienda publicada.
 *
 * Todo es plausible: nombres largos como los que llegan del Excel, códigos
 * sin espacios, precios de un combo grande y de una lija, muchos nichos,
 * un nicho con un solo producto, comillas y "&" en los nombres. Los campos
 * de texto de la base no tienen límite, así que cualquiera puede llegar.
 */

const nicho = (
  slug: string,
  nombre: string,
  orden: number,
  extra: Partial<Niche> = {},
): Niche => ({
  slug,
  nombre,
  submarca: null,
  titular: null,
  descripcion: null,
  datos: [],
  acento: null,
  orden,
  ...extra,
});

export const nichosExtremo: Niche[] = [
  nicho("electrodomesticos", "Electrodomésticos y cuidado personal para el hogar", 1, {
    titular: "Electrodomésticos importados\npara cada rincón de la casa.",
    descripcion:
      "Licuadoras, freidoras de aire, aspiradoras, secadores, planchas y todo lo que hace falta en una casa, con garantía directa del importador y despacho a cualquier municipio de Colombia, incluidos los de difícil acceso.",
    datos: [
      { etiqueta: "Garantía directa del importador", valor: "12 meses" },
      { etiqueta: "Despacho", valor: "1.122 municipios" },
      { etiqueta: "Voltaje", valor: "110–120 V" },
      { etiqueta: "Marcas", valor: "8" },
      { etiqueta: "Soporte", valor: "WhatsApp" },
    ],
    acento: "#ffd84d",
  }),
  nicho("deportes", "Deportes", 2, { acento: "#ff5c8a" }),
  nicho("mascotas", "Mascotas", 3),
  nicho("papeleria", "Papelería y oficina", 4),
  nicho("automotriz", "Automotriz y motos", 5),
  nicho("jugueteria", "Juguetería", 6),
  nicho("belleza", "Belleza", 7),
];

export const categoriasExtremo: Category[] = [
  {
    slug: "pequenos-electrodomesticos-de-cocina-y-preparacion-de-alimentos",
    nichoSlug: "electrodomesticos",
    nombre: "Pequeños electrodomésticos de cocina y preparación de alimentos",
    orden: 1,
    descripcion:
      "Licuadoras, procesadores, batidoras, freidoras de aire, sanducheras y cafeteras para el día a día. Todos a 110 V, con manual en español y garantía directa.",
  },
  { slug: "cuidado-personal", nichoSlug: "electrodomesticos", nombre: "Cuidado personal", orden: 2, descripcion: null },
  { slug: "balones", nichoSlug: "deportes", nombre: "Balones", orden: 1, descripcion: null },
  { slug: "camas", nichoSlug: "mascotas", nombre: "Camas", orden: 1, descripcion: null },
  { slug: "cuadernos", nichoSlug: "papeleria", nombre: "Cuadernos", orden: 1, descripcion: null },
  { slug: "accesorios-moto", nichoSlug: "automotriz", nombre: "Accesorios para moto", orden: 1, descripcion: null },
  { slug: "didacticos", nichoSlug: "jugueteria", nombre: "Didácticos", orden: 1, descripcion: null },
  { slug: "maquillaje", nichoSlug: "belleza", nombre: "Maquillaje", orden: 1, descripcion: null },
];

function producto(datos: Pick<Product, "sku" | "nombre" | "categoriaSlug" | "precioUnitario"> & Partial<Product>): Product {
  const slug = `${datos.nombre}-${datos.sku}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
  return {
    id: `extremo-${datos.sku}`,
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

export const productosExtremo: Product[] = [
  producto({
    sku: "EL-FRE-AIRE-8L-DIGITAL-DOBLE-CANASTA-2026",
    nombre:
      "Freidora de aire digital 8 litros doble canasta con ventana de cocción, 12 programas, temporizador y bandejas antiadherentes aptas para lavavajillas",
    categoriaSlug: "pequenos-electrodomesticos-de-cocina-y-preparacion-de-alimentos",
    precioUnitario: 12_499_000,
    destacado: true,
    color: "Negro mate con acero inoxidable",
    grupo: "fre-aire-8l",
    marca: "Bumbay Home & Kitchen International",
    fichaTecnica:
      "Freidora de aire de 8 litros con dos canastas independientes que se pueden programar por separado o sincronizar para que terminen al mismo tiempo. ".repeat(3),
    especificaciones: [
      { label: "Capacidad total con las dos canastas", valor: "8 L (2 × 4 L)" },
      { label: "Potencia", valor: "2.400 W" },
      { label: "Voltaje", valor: "110–120 V ~ 60 Hz" },
      { label: "Dimensiones (alto × ancho × fondo)", valor: "32,5 × 38,2 × 41,0 cm" },
    ],
  }),
  producto({
    sku: "EL-FRE-AIRE-8L-DIGITAL-DOBLE-CANASTA-2026-B",
    nombre: "Freidora de aire digital 8 litros doble canasta Blanco perla",
    categoriaSlug: "pequenos-electrodomesticos-de-cocina-y-preparacion-de-alimentos",
    precioUnitario: 12_499_000,
    color: "Blanco perla",
    grupo: "fre-aire-8l",
    agotado: true,
    destacado: true,
  }),
  producto({
    sku: "EL-LIC-1",
    nombre: 'Licuadora 1,5 L con vaso de vidrio, 3 velocidades & función "pulso"',
    categoriaSlug: "pequenos-electrodomesticos-de-cocina-y-preparacion-de-alimentos",
    precioUnitario: 1_500,
  }),
  producto({
    sku: "CP",
    nombre: "Secador",
    categoriaSlug: "cuidado-personal",
    precioUnitario: 89_000,
  }),
  producto({ sku: "DEP-BAL-5", nombre: "Balón de fútbol No. 5", categoriaSlug: "balones", precioUnitario: 45_000 }),
  producto({ sku: "MAS-CAMA-L", nombre: "Cama ortopédica para perro grande", categoriaSlug: "camas", precioUnitario: 159_000 }),
  producto({ sku: "PAP-CUA-100", nombre: "Cuaderno argollado 100 hojas", categoriaSlug: "cuadernos", precioUnitario: 7_900 }),
  producto({ sku: "AUT-INT-BT", nombre: "Intercomunicador Bluetooth para casco", categoriaSlug: "accesorios-moto", precioUnitario: 189_000 }),
  producto({ sku: "JUG-ROMP-1000", nombre: "Rompecabezas 1.000 piezas", categoriaSlug: "didacticos", precioUnitario: 49_000 }),
  producto({ sku: "BEL-PAL-12", nombre: "Paleta de sombras 12 tonos", categoriaSlug: "maquillaje", precioUnitario: 39_000 }),
];
