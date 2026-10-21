/**
 * Modelo del negocio: qué es un producto, una categoría, un nicho y una línea
 * del pedido.
 *
 * Es la capa más interna. No sabe de dónde vienen los datos ni cómo se
 * pintan: no importa nada de Next, React ni Supabase, y nada de aquí debe
 * cambiar porque cambie la base de datos o el diseño.
 */

export type Spec = {
  label: string;
  valor: string;
};

export type Faq = {
  pregunta: string;
  respuesta: string;
};

export type Product = {
  id: string;
  sku: string;
  nombre: string;
  slug: string;
  categoriaSlug: string;
  marca: string | null;
  /**
   * Color de esta versión ("Azul", "Amarillo"). null si la herramienta se
   * vende en un solo color.
   */
  color: string | null;
  /**
   * Agrupa las versiones de color de una misma herramienta. Dos productos con
   * el mismo `grupo` son el mismo modelo en distinto color, y la ficha muestra
   * un selector para saltar entre ellos.
   */
  grupo: string | null;
  /**
   * Precio de venta (COP, sin decimales). Es el único precio: Bumbay maneja
   * una sola tarifa, ya a nivel mayorista, igual para todos.
   */
  precioUnitario: number;
  /** Ruta de la imagen principal en el bucket de Supabase. */
  imagen: string | null;
  /**
   * Recorte cuadrado para la grilla. Las piezas de marca vienen en
   * proporciones muy distintas y con texto que a tamaño de miniatura no se
   * lee; el recorte deja el producto centrado y legible. Si falta, la grilla
   * usa `imagen`.
   */
  imagenMini: string | null;
  imagenes: string[];
  fichaTecnica: string | null;
  especificaciones: Spec[];
  modoUso: string | null;
  beneficios: string[];
  faq: Faq[];
  destacado: boolean;
  /**
   * Sin existencias. No es lo mismo que `activo`: un producto agotado sigue
   * publicado e indexado —despublicarlo y republicarlo cada semana arruina su
   * posicionamiento— pero no se puede agregar al pedido.
   */
  agotado: boolean;
  activo: boolean;
};

/**
 * Una línea de negocio dentro de Bumbay Store: herramientas, hogar… Agrupa
 * categorías y puede llevar el nombre de una submarca propia, como
 * "Bumbay Tools" en herramientas.
 */
export type Niche = {
  slug: string;
  nombre: string;
  /** Marca con la que se presenta el nicho. null si usa solo Bumbay Store. */
  submarca: string | null;
  descripcion: string | null;
  orden: number;
};

export type Category = {
  slug: string;
  /** Nicho al que pertenece. Los productos llegan al nicho por su categoría. */
  nichoSlug: string;
  nombre: string;
  orden: number;
  descripcion: string | null;
};

export type CartLine = {
  slug: string;
  sku: string;
  nombre: string;
  precioUnitario: number;
  imagen: string | null;
  cantidad: number;
};
