import { NextResponse, type NextRequest } from "next/server";

/**
 * Una clave equivocada en /acceso/… se sirve exactamente como cualquier
 * página que no existe en la tienda: mismo 404, misma cabecera, mismo pie y
 * mismo título. Si no, el 404 llevaría el marco del panel ("Administración")
 * y delataría que ahí hay algo.
 *
 * La página del panel vuelve a comprobar la clave por su cuenta: esto solo
 * cuida cómo se ve el error. La seguridad la pone la base de datos.
 */
export function proxy(request: NextRequest) {
  const clave = request.nextUrl.pathname.split("/")[2];
  const esperada = process.env.ADMIN_RUTA;
  if (esperada && clave === esperada) return NextResponse.next();
  // Una dirección que la tienda no tiene: responde su 404 de siempre.
  return NextResponse.rewrite(new URL("/pagina-que-no-existe", request.url));
}

export const config = {
  matcher: "/acceso/:path*",
};
