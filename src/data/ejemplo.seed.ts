import type { Category, Niche, Product } from "@/dominio/modelos";

/**
 * Nichos de EJEMPLO para ver cómo se comporta la tienda con varias líneas.
 *
 * No son productos reales ni nichos decididos: los nichos de verdad los
 * define el negocio. Se cargan con CATALOGO=ejemplo o CATALOGO=demo en tu
 * equipo, y en las ramas `demo/*` de Vercel (ver servidor/catalogo.ts);
 * nunca en la tienda publicada, porque mostrarle a un cliente algo que no se
 * vende sería peor que no mostrarle nada.
 *
 * Las fotos son de Wikimedia Commons con licencia libre; sus autores y
 * licencias están en public/demo/credits.json. Los precios son inventados
 * pero verosímiles para Colombia.
 */

export const nichosEjemplo: Niche[] = [
  {
    slug: "hogar",
    nombre: "Hogar y cocina",
    submarca: null,
    titular: "Lo que hace falta en casa,\nal precio del importador.",
    descripcion:
      "Ollas, pequeños electrodomésticos y organización para la cocina, importados directamente y con envío a cualquier municipio de Colombia.",
    datos: [{ etiqueta: "Voltaje", valor: "110 V" }],
    acento: "#ffb21a",
    orden: 2,
  },
  {
    slug: "tecnologia",
    nombre: "Tecnología y accesorios",
    submarca: null,
    titular: "Accesorios para el celular\ny el computador.",
    descripcion:
      "Cargadores, cables, audio y soportes para el día a día, importados sin intermediarios y probados antes de despachar.",
    datos: [{ etiqueta: "Conectores", valor: "USB-C" }],
    acento: "#8b5cff",
    orden: 3,
  },
  {
    slug: "belleza",
    nombre: "Belleza y cuidado personal",
    submarca: null,
    titular: "Cuidado personal\nsin pagar de más.",
    descripcion:
      "Herramientas para el cabello, maquillaje y cuidado de la piel y las uñas, a precio de importador.",
    datos: [],
    acento: "#ff5c9a",
    orden: 4,
  },
];

export const categoriasEjemplo: Category[] = [
  { slug: "ollas-y-sartenes", nichoSlug: "hogar", nombre: "Ollas y sartenes", orden: 1, descripcion: "Ollas esmaltadas y sartenes de hierro fundido que duran años." },
  { slug: "electrodomesticos-de-cocina", nichoSlug: "hogar", nombre: "Electrodomésticos de cocina", orden: 2, descripcion: null },
  { slug: "organizacion", nichoSlug: "hogar", nombre: "Organización", orden: 3, descripcion: null },
  { slug: "cargadores-y-cables", nichoSlug: "tecnologia", nombre: "Cargadores y cables", orden: 1, descripcion: null },
  { slug: "audio", nichoSlug: "tecnologia", nombre: "Audio", orden: 2, descripcion: null },
  { slug: "accesorios-tecnologia", nichoSlug: "tecnologia", nombre: "Accesorios", orden: 3, descripcion: null },
  { slug: "cabello", nichoSlug: "belleza", nombre: "Cabello", orden: 1, descripcion: null },
  { slug: "maquillaje", nichoSlug: "belleza", nombre: "Maquillaje", orden: 2, descripcion: null },
  { slug: "unas-y-piel", nichoSlug: "belleza", nombre: "Uñas y piel", orden: 3, descripcion: null },
];

/** Producto de ejemplo: solo cambia lo que distingue a cada uno. */
function ejemplo(
  datos: Pick<Product, "sku" | "nombre" | "categoriaSlug" | "precioUnitario"> & Partial<Product>,
): Product {
  const slug = `${datos.nombre}-${datos.sku}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const imagen = datos.imagen ?? null;
  return {
    id: `ejemplo-${datos.sku}`,
    slug,
    marca: null,
    color: null,
    grupo: null,
    imagenMini: null,
    imagenes: imagen ? [imagen] : [],
    modoUso: null,
    beneficios: [],
    faq: [],
    destacado: false,
    agotado: false,
    activo: true,
    ...datos,
    imagen,
    // Se avisa en la ficha misma: es un ejemplo, no un producto a la venta.
    fichaTecnica: `Producto de ejemplo para la demostración de Bumbay Store. ${datos.fichaTecnica ?? ""}`.trim(),
    especificaciones: datos.especificaciones ?? [],
  };
}

export const productosEjemplo: Product[] = [
  // --- Hogar y cocina ---
  ejemplo({
    sku: "EJ-HOG-001",
    nombre: "Juego de ollas esmaltadas de hierro fundido x 3 piezas",
    categoriaSlug: "ollas-y-sartenes",
    precioUnitario: 389_000,
    imagen: "/demo/hogar-ollas.webp",
    destacado: true,
    fichaTecnica: "Hierro fundido con esmalte por dentro y por fuera: retiene el calor, no necesita curado y va del fogón al horno.",
    especificaciones: [
      { label: "Piezas", valor: "Olla 24 cm, cacerola 20 cm, fuente" },
      { label: "Material", valor: "Hierro fundido esmaltado" },
      { label: "Apta para", valor: "Gas, eléctrica, inducción y horno" },
    ],
    beneficios: ["Reparte el calor de forma pareja", "Se lava como cualquier olla esmaltada"],
  }),
  ejemplo({
    sku: "EJ-HOG-002",
    nombre: "Sartén de hierro fundido 26 cm",
    categoriaSlug: "ollas-y-sartenes",
    precioUnitario: 119_000,
    imagen: "/demo/hogar-sarten.webp",
    especificaciones: [
      { label: "Diámetro", valor: "26 cm" },
      { label: "Peso", valor: "2,3 kg" },
    ],
  }),
  ejemplo({
    sku: "EJ-HOG-003",
    nombre: "Licuadora portátil recargable 380 ml",
    categoriaSlug: "electrodomesticos-de-cocina",
    precioUnitario: 69_000,
    imagen: "/demo/hogar-licuadora.webp",
    destacado: true,
    especificaciones: [
      { label: "Capacidad", valor: "380 ml" },
      { label: "Batería", valor: "2.000 mAh, carga USB-C" },
      { label: "Cuchillas", valor: "6, en acero inoxidable" },
    ],
  }),
  ejemplo({
    sku: "EJ-HOG-004",
    nombre: "Freidora de aire 4,5 L con canasta antiadherente",
    categoriaSlug: "electrodomesticos-de-cocina",
    precioUnitario: 289_000,
    imagen: "/demo/hogar-freidora.webp",
    destacado: true,
    especificaciones: [
      { label: "Capacidad", valor: "4,5 L" },
      { label: "Potencia", valor: "1.400 W" },
      { label: "Temperatura", valor: "80–200 °C" },
    ],
  }),
  ejemplo({
    sku: "EJ-HOG-005",
    nombre: "Hervidor eléctrico 1,7 L",
    categoriaSlug: "electrodomesticos-de-cocina",
    precioUnitario: 79_000,
    imagen: "/demo/hogar-hervidor.webp",
    agotado: true,
  }),
  ejemplo({
    sku: "EJ-HOG-006",
    nombre: "Especiero giratorio con 16 frascos de vidrio",
    categoriaSlug: "organizacion",
    precioUnitario: 99_000,
    imagen: "/demo/hogar-especiero.webp",
  }),

  // --- Tecnología y accesorios ---
  ejemplo({
    sku: "EJ-TEC-001",
    nombre: "Cargador de pared USB 12 W",
    categoriaSlug: "cargadores-y-cables",
    precioUnitario: 39_000,
    imagen: "/demo/tec-cargador.webp",
  }),
  ejemplo({
    sku: "EJ-TEC-002",
    nombre: "Cable USB-A a USB-C de 1,5 m",
    categoriaSlug: "cargadores-y-cables",
    precioUnitario: 19_000,
    imagen: "/demo/tec-cable.webp",
  }),
  ejemplo({
    sku: "EJ-TEC-003",
    nombre: "Batería portátil 20.000 mAh con carga rápida",
    categoriaSlug: "cargadores-y-cables",
    precioUnitario: 119_000,
    imagen: "/demo/tec-powerbank.webp",
    destacado: true,
    especificaciones: [
      { label: "Capacidad", valor: "20.000 mAh" },
      { label: "Salidas", valor: "USB-A y USB-C" },
      { label: "Carga rápida", valor: "22,5 W" },
    ],
  }),
  ejemplo({
    sku: "EJ-TEC-004",
    nombre: "Audífonos inalámbricos con estuche de carga",
    categoriaSlug: "audio",
    precioUnitario: 129_000,
    imagen: "/demo/tec-audifonos.webp",
    destacado: true,
    especificaciones: [
      { label: "Conexión", valor: "Bluetooth 5.3" },
      { label: "Autonomía", valor: "6 h + 24 h con el estuche" },
    ],
  }),
  ejemplo({
    sku: "EJ-TEC-005",
    nombre: "Parlante Bluetooth resistente al agua",
    categoriaSlug: "audio",
    precioUnitario: 159_000,
    imagen: "/demo/tec-parlante.webp",
  }),
  ejemplo({
    sku: "EJ-TEC-006",
    nombre: "Soporte magnético de celular para carro",
    categoriaSlug: "accesorios-tecnologia",
    precioUnitario: 35_000,
    imagen: "/demo/tec-soporte.webp",
  }),
  ejemplo({
    sku: "EJ-TEC-007",
    nombre: "Mouse inalámbrico ergonómico",
    categoriaSlug: "accesorios-tecnologia",
    precioUnitario: 49_000,
    imagen: "/demo/tec-mouse.webp",
    agotado: true,
  }),

  // --- Belleza y cuidado personal ---
  ejemplo({
    sku: "EJ-BEL-001",
    nombre: "Secador de cabello compacto con difusor",
    categoriaSlug: "cabello",
    precioUnitario: 189_000,
    imagen: "/demo/bel-secador.webp",
    destacado: true,
    especificaciones: [
      { label: "Potencia", valor: "1.600 W" },
      { label: "Velocidades", valor: "3, con golpe de aire frío" },
    ],
  }),
  ejemplo({
    sku: "EJ-BEL-002",
    nombre: "Plancha alisadora de placas de cerámica",
    categoriaSlug: "cabello",
    precioUnitario: 139_000,
    imagen: "/demo/bel-plancha.webp",
  }),
  ejemplo({
    sku: "EJ-BEL-003",
    nombre: "Set de brochas de maquillaje x 12",
    categoriaSlug: "maquillaje",
    precioUnitario: 59_000,
    imagen: "/demo/bel-brochas.webp",
    destacado: true,
  }),
  ejemplo({
    sku: "EJ-BEL-004",
    nombre: "Paleta de sombras 32 tonos",
    categoriaSlug: "maquillaje",
    precioUnitario: 45_000,
    imagen: "/demo/bel-paleta.webp",
  }),
  ejemplo({
    sku: "EJ-BEL-005",
    nombre: "Esmalte de uñas de secado rápido",
    categoriaSlug: "unas-y-piel",
    precioUnitario: 15_000,
    imagen: "/demo/bel-esmalte.webp",
  }),
  ejemplo({
    sku: "EJ-BEL-006",
    nombre: "Crema hidratante facial 50 ml",
    categoriaSlug: "unas-y-piel",
    precioUnitario: 39_000,
    imagen: "/demo/bel-crema.webp",
  }),
];
