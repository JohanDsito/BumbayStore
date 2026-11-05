/** Iconografía propia, de trazo fino para que combine con el dibujo técnico. */

type Props = React.SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function IconoBuscar(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconoCarrito(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M3 4h2.2l2 11.2a1.5 1.5 0 0 0 1.5 1.3h8.1a1.5 1.5 0 0 0 1.5-1.2L20 8H6" />
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

export function IconoMas(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconoMenos(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconoCerrar(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconoFlecha(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconoBasura(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </svg>
  );
}

export function IconoMenu(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** WhatsApp: logo de marca, va relleno y no de trazo. */
export function IconoWhatsApp(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.23 8.25c0 4.54-3.7 8.21-8.23 8.21Z" />
    </svg>
  );
}

/* Redes sociales: de trazo, como el resto, para no romper la familia. */

export function IconoInstagram(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.4" fill="currentColor" />
    </svg>
  );
}

export function IconoFacebook(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M16 3.5h-2.2A3.8 3.8 0 0 0 10 7.3v13.2M7 11h8" />
    </svg>
  );
}

export function IconoTiktok(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M13.5 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3" />
      <path d="M13.5 3.5c.4 2.5 2.2 4.3 5 4.6" />
    </svg>
  );
}

export function IconoSol(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  );
}

export function IconoLuna(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

/* Promesas de la tienda (FranjaConfianza). */

export function IconoCaja(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="m3.5 7.5 8.5-4 8.5 4v9l-8.5 4-8.5-4v-9Z" />
      <path d="m3.5 7.5 8.5 4 8.5-4M12 11.5v9" />
    </svg>
  );
}

export function IconoCamion(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7" />
      <circle cx="6.5" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  );
}

export function IconoPago(props: Props) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
      <path d="M2.5 10h19M6.5 14.5h4" />
    </svg>
  );
}
