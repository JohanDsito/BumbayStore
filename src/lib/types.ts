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
  /** Precio unitario (COP, sin decimales). */
  precioUnitario: number;
  /** Precio al por mayor. null = no aplica mayoreo a este producto. */
  precioMayor: number | null;
  /** Ruta de la imagen principal en el bucket de Supabase. */
  imagen: string | null;
  imagenes: string[];
  fichaTecnica: string | null;
  especificaciones: Spec[];
  modoUso: string | null;
  beneficios: string[];
  faq: Faq[];
  destacado: boolean;
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
  precioMayor: number | null;
  imagen: string | null;
  cantidad: number;
};
