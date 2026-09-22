/**
 * Datos de la marca. Todo lo que cambia al ajustar la identidad del negocio
 * vive aquí, no disperso por los componentes.
 */
export const site = {
  nombre: "Bumbay Tools",
  nombreLargo: "Bumbay Tools — Herramientas inalámbricas",
  descripcion:
    "Importador y distribuidor de herramientas inalámbricas profesionales. Taladros, pulidoras, combos y herramienta manual con precio al por mayor.",
  ciudad: "Bogotá",
  pais: "Colombia",
  /** Se configura en Vercel como NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bumbaytools.com",
  /** Formato internacional sin + ni espacios. Ej: 573001234567 */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "573000000000",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "ventas@bumbaytools.com",
  direccion: process.env.NEXT_PUBLIC_DIRECCION ?? "Bogotá, Colombia",
  horario: "Lunes a sábado, 9:00 am a 6:00 pm",
  /** Meses de garantía que se anuncian en la portada. */
  garantiaMeses: 6,
  /** Plataforma de batería de la línea inalámbrica. */
  plataforma: "128V",
  redes: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK ?? "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK ?? "",
  },
  moneda: "COP",
} as const;

/** Texto del badge de mayoreo en las tarjetas. */
export const LABEL_MAYOR = "Precio al mayor";
