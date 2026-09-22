/** Modelo de datos del catálogo. Refleja 1:1 las tablas de Supabase. */

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

export type Category = {
  slug: string;
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
