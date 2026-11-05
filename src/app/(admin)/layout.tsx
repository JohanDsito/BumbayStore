import type { Metadata } from "next";
import Link from "next/link";
import { LogoStore } from "@/components/logos";
import { BotonTema } from "@/components/boton-tema";

export const metadata: Metadata = {
  title: "Administración",
  // El panel nunca debe aparecer en un buscador, ni siquiera enlazado.
  robots: { index: false, follow: false, nocache: true },
};

/** Armazón del panel: sin cabecera de tienda, sin carrito, sin distracciones. */
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-fondo">
      <header className="border-b border-linea bg-superficie">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <LogoStore className="w-[96px]" />
            <span className="rotulo border-l border-borde pl-4 text-[10px] text-tinta-media">
              Administración
            </span>
          </div>

          <div className="flex items-center gap-2">
            <BotonTema />
            <Link
              href="/"
              className="rotulo text-[11px] text-tinta-suave transition-colors hover:text-acento-texto"
            >
              Ver la tienda →
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
