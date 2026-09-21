import Link from "next/link";
import { enlaceGeneral } from "@/lib/whatsapp";
import { IconoWhatsApp, IconoFlecha } from "@/components/icons";

export default function NoEncontrado() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-naranja-500">
        Error 404
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-carbon-50 sm:text-5xl">
        Esta página no existe
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-carbon-400">
        Puede que el producto ya no esté en el catálogo o que la dirección esté
        mal escrita. Si sabes qué herramienta buscas, escríbenos y te decimos si
        la tenemos.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex h-12 items-center justify-center gap-2 bg-naranja-500 px-7 text-sm font-semibold tracking-tight text-carbon-950 transition-colors hover:bg-naranja-400"
        >
          Volver al catálogo
          <IconoFlecha className="h-4 w-4" />
        </Link>
        <a
          href={enlaceGeneral()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 border border-carbon-700 px-7 text-sm font-semibold tracking-tight text-carbon-100 transition-colors hover:border-disponible hover:text-disponible"
        >
          <IconoWhatsApp className="h-4 w-4" />
          Escríbenos
        </a>
      </div>
    </div>
  );
}
