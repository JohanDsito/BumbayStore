import type { Metadata } from "next";
import Link from "next/link";
import { Logotipo } from "@/components/icons";

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
        <div aria-hidden className="h-1 cinta-precaucion" />
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logotipo className="h-7 w-7 text-marca-500" />
            <div className="leading-none">
              <span className="block text-[15px] font-extrabold tracking-[-0.03em] text-carbon-50">
                BUMB<span className="text-marca-500">A</span>Y
              </span>
              <span className="mt-0.5 block rotulo text-[9px] text-carbon-400">
                Administración
              </span>
            </div>
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
