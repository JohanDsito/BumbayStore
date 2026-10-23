/**
 * Datos de la marca. Todo lo que cambia al ajustar la identidad del negocio
 * vive aquí, no disperso por los componentes.
 */
export const site = {
  nombre: "Bumbay Store",
  /**
   * Lo que es la tienda entera, no un nicho: sale en Google, en el pie y en
   * los datos del negocio. Lo propio de cada nicho vive en su tabla.
   */
  descripcion:
    "Importador directo con envío a toda Colombia. Herramienta inalámbrica profesional y nuevas líneas en un solo catálogo: arma tu pedido y lo cerramos por WhatsApp.",
  /** Ciudad de operación. Sale del mismo sitio que la dirección del pie. */
  ciudad: process.env.NEXT_PUBLIC_CIUDAD ?? "Pasto",
  pais: "Colombia",
  /** Se configura en Vercel como NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bumbaystore.vercel.app",
  /** Formato internacional sin + ni espacios. Ej: 573001234567 */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "573000000000",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "ventas@bumbaytools.com",
  direccion: process.env.NEXT_PUBLIC_DIRECCION ?? "Bogotá, Colombia",
  horario: "Lunes a sábado, 9:00 am a 6:00 pm",
  redes: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK ?? "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK ?? "",
  },
  moneda: "COP",
  /**
   * Nicho que conserva la identidad de taller de Bumbay Tools (la cinta de
   * precaución). Los demás nichos usan solo el mundo de Bumbay Store.
   */
  nichoTaller: "herramientas",
} as const;
