import type { Metadata } from "next";
import Link from "next/link";
import { LogoStore } from "@/components/logos";

export const metadata: Metadata = {
  title: "Administración",
  // El panel nunca debe aparecer en un buscador, ni siquiera enlazado.
  robots: { index: false, follow: false, nocache: true },
};

/** Armazón del panel: sin cabecera de tienda, sin carrito, sin distracciones. */
export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-carbon-950">
      <header className="border-b border-carbon-800 bg-carbon-900">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <LogoStore className="w-[96px]" />
            <span className="rotulo border-l border-carbon-700 pl-4 text-[10px] text-carbon-300">
              Administración
            </span>
          </div>

          <Link
            href="/"
            className="rotulo text-[11px] text-carbon-400 transition-colors hover:text-marca-400"
          >
            Ver la tienda →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
