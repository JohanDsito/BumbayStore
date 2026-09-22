"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

import { getSupabaseSesion } from "@/lib/supabase-sesion";
import { imagenUrl } from "@/lib/supabase";
import { precio } from "@/lib/format";
import {
  listaATexto,
  textoALista,
  especificacionesATexto,
  textoAEspecificaciones,
  faqATexto,
  textoAFaq,
  nombreMiniatura,
} from "@/lib/formato-campos";

/** Lo que el panel edita de cada producto. */
type Fila = {
  id: string;
  sku: string;
  nombre: string;
  precio_unitario: number;
  destacado: boolean;
  agotado: boolean;
  imagen: string | null;
  imagen_mini: string | null;
  imagenes: string[];
  ficha_tecnica: string | null;
  especificaciones: { label: string; valor: string }[];
  modo_uso: string | null;
  beneficios: string[];
  faq: { pregunta: string; respuesta: string }[];
  categoria_slug: string;
};

/** El borrador guarda los campos largos como texto, que es como se editan. */
type Borrador = {
  nombre: string;
  precio: string;
  destacado: boolean;
  agotado: boolean;
  imagen: string | null;
  ficha: string;
  especificaciones: string;
  modo: string;
  beneficios: string;
  faq: string;
};

function aBorrador(f: Fila): Borrador {
  return {
    nombre: f.nombre,
    precio: String(f.precio_unitario),
    destacado: f.destacado,
    agotado: f.agotado,
    imagen: f.imagen,
    ficha: f.ficha_tecnica ?? "",
    especificaciones: especificacionesATexto(f.especificaciones ?? []),
    modo: f.modo_uso ?? "",
    beneficios: listaATexto(f.beneficios ?? []),
    faq: faqATexto(f.faq ?? []),
  };
}

const CAMPOS = "id, sku, nombre, precio_unitario, destacado, agotado, imagen, imagen_mini, imagenes, ficha_tecnica, especificaciones, modo_uso, beneficios, faq, categoria_slug";

export function AdminProductos() {
  const sb = getSupabaseSesion();
  const [filas, setFilas] = useState<Fila[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");

  const cargar = useCallback(() => {
    if (!sb) return;
    sb.from("productos")
      .select(CAMPOS)
      .order("nombre")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setFilas((data ?? []) as Fila[]);
        setCargando(false);
      });
  }, [sb]);

  useEffect(cargar, [cargar]);

  if (cargando) {
    return <p className="py-16 text-center font-mono text-xs text-carbon-500">Cargando productos…</p>;
  }
  if (error) {
    return <p className="py-16 text-center text-[13px] text-marca-400">{error}</p>;
  }

  const q = filtro.trim().toLowerCase();
  const visibles = q
    ? filas.filter(
        (f) =>
          f.nombre.toLowerCase().includes(q) || f.sku.toLowerCase().includes(q),
      )
    : filas;

  const agotados = filas.filter((f) => f.agotado).length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-5 font-mono text-[11px] text-carbon-500">
          <span>
            <strong className="text-carbon-100">{filas.length}</strong> productos
          </span>
          <span>
            <strong className="text-carbon-100">{filas.filter((f) => f.destacado).length}</strong>{" "}
            destacados
          </span>
          <span>
            <strong className={agotados ? "text-marca-400" : "text-carbon-100"}>
              {agotados}
            </strong>{" "}
            agotados
          </span>
        </div>

        <input
          type="search"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Filtrar por nombre o código…"
          className="h-10 w-full max-w-xs border border-carbon-700 bg-carbon-850 px-3 text-[13px] text-carbon-100 placeholder:text-carbon-500 focus:border-marca-500 focus:outline-none"
        />
      </div>

      <ul className="space-y-2">
        {visibles.map((f) => (
          <FichaProducto key={f.id} fila={f} alGuardar={cargar} />
        ))}
      </ul>

      {visibles.length === 0 && (
        <p className="py-16 text-center text-[13px] text-carbon-400">
          Ningún producto coincide con “{filtro}”.
        </p>
      )}
    </div>
  );
}

function FichaProducto({ fila, alGuardar }: { fila: Fila; alGuardar: () => void }) {
  const sb = getSupabaseSesion();
  const [abierto, setAbierto] = useState(false);
  const [b, setB] = useState<Borrador>(() => aBorrador(fila));
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const original = aBorrador(fila);
  const sucio = JSON.stringify(b) !== JSON.stringify(original);

  const cambiar = <K extends keyof Borrador>(k: K, v: Borrador[K]) => {
    setB((x) => ({ ...x, [k]: v }));
    setMensaje(null);
  };

  const guardar = async () => {
    if (!sb) return;
    const valor = Number(b.precio.replace(/[^\d]/g, ""));
    if (!valor) {
      setMensaje("El precio no es válido.");
      return;
    }
    setGuardando(true);

    const { data, error } = await sb
      .from("productos")
      .update({
        nombre: b.nombre.trim(),
        precio_unitario: valor,
        destacado: b.destacado,
        agotado: b.agotado,
        imagen: b.imagen,
        // El recorte de la grilla acompaña a la portada elegida.
        imagen_mini: b.imagen ? nombreMiniatura(b.imagen) : null,
        ficha_tecnica: b.ficha.trim() || null,
        especificaciones: textoAEspecificaciones(b.especificaciones),
        modo_uso: b.modo.trim() || null,
        beneficios: textoALista(b.beneficios),
        faq: textoAFaq(b.faq),
      })
      .eq("id", fila.id)
      .select("id");

    if (error) {
      setMensaje(error.message);
      setGuardando(false);
      return;
    }

    // Sin permiso, la base no devuelve error: simplemente no modifica ninguna
    // fila. Hay que mirar el resultado para no decir "Guardado" en falso.
    if (!data || data.length === 0) {
      setMensaje("No se guardó: esta cuenta no tiene permisos de escritura.");
      setGuardando(false);
      return;
    }

    // El catálogo está prerenderizado: sin esto el cambio no se vería hasta
    // la próxima reconstrucción del sitio.
    const { data: sesion } = await sb.auth.getSession();
    const token = sesion.session?.access_token;
    if (token) {
      await fetch("/api/revalidar", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      }).catch(() => undefined);
    }

    setGuardando(false);
    setMensaje("Guardado");
    alGuardar();
  };

  const portada = imagenUrl(b.imagen);

  return (
    <li className="border border-carbon-800 bg-carbon-900">
      <div className="flex items-center gap-3 p-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-carbon-50">
          {portada && (
            <Image src={portada} alt="" fill sizes="56px" className="object-contain p-0.5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-[0.14em] text-carbon-500">
            {fila.sku}
          </p>
          <p className="truncate text-[14px] font-medium text-carbon-100">{b.nombre}</p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <Interruptor
            activo={b.agotado}
            alCambiar={(v) => cambiar("agotado", v)}
            etiqueta="Agotado"
            tono="alerta"
          />
          <Interruptor
            activo={b.destacado}
            alCambiar={(v) => cambiar("destacado", v)}
            etiqueta="Destacado"
            tono="normal"
          />
        </div>

        <span className="hidden w-28 shrink-0 text-right font-mono text-[13px] text-carbon-200 md:block">
          {precio(Number(b.precio.replace(/[^\d]/g, "")) || 0)}
        </span>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          className="shrink-0 border border-carbon-700 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-carbon-300 transition-colors hover:border-marca-500 hover:text-marca-400"
        >
          {abierto ? "Cerrar" : "Editar"}
        </button>
      </div>

      {/* Interruptores en su propia fila cuando la pantalla es angosta */}
      <div className="flex gap-2 border-t border-carbon-850 px-3 py-2 sm:hidden">
        <Interruptor
          activo={b.agotado}
          alCambiar={(v) => cambiar("agotado", v)}
          etiqueta="Agotado"
          tono="alerta"
        />
        <Interruptor
          activo={b.destacado}
          alCambiar={(v) => cambiar("destacado", v)}
          etiqueta="Destacado"
          tono="normal"
        />
      </div>

      {abierto && (
        <div className="space-y-5 border-t border-carbon-800 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Nombre" valor={b.nombre} alCambiar={(v) => cambiar("nombre", v)} />
            <Campo
              etiqueta="Precio (COP)"
              valor={b.precio}
              alCambiar={(v) => cambiar("precio", v)}
              mono
            />
          </div>

          {fila.imagenes.length > 1 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
                Foto de portada
                <span className="ml-2 normal-case tracking-normal text-carbon-600">
                  la que se ve en la grilla y al compartir
                </span>
              </p>
              <div className="sin-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
                {fila.imagenes.map((img) => {
                  const u = imagenUrl(img);
                  const activa = img === b.imagen;
                  return (
                    <button
                      key={img}
                      type="button"
                      onClick={() => cambiar("imagen", img)}
                      aria-pressed={activa}
                      title={img}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-carbon-50 transition-colors ${
                        activa ? "border-marca-500" : "border-carbon-700 hover:border-carbon-500"
                      }`}
                    >
                      {u && (
                        <Image src={u} alt="" fill sizes="64px" className="object-contain p-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <AreaTexto
            etiqueta="Ficha técnica"
            valor={b.ficha}
            alCambiar={(v) => cambiar("ficha", v)}
            filas={3}
          />
          <AreaTexto
            etiqueta="Especificaciones"
            ayuda="Voltaje: 128V | Motor: Brushless"
            valor={b.especificaciones}
            alCambiar={(v) => cambiar("especificaciones", v)}
            filas={3}
          />
          <AreaTexto
            etiqueta="Modo de uso"
            valor={b.modo}
            alCambiar={(v) => cambiar("modo", v)}
            filas={3}
          />
          <AreaTexto
            etiqueta="Beneficios"
            ayuda="Uno | Dos | Tres"
            valor={b.beneficios}
            alCambiar={(v) => cambiar("beneficios", v)}
            filas={3}
          />
          <AreaTexto
            etiqueta="Preguntas frecuentes"
            ayuda="¿Pregunta?:: Respuesta | ¿Otra?:: Otra respuesta"
            valor={b.faq}
            alCambiar={(v) => cambiar("faq", v)}
            filas={4}
          />
        </div>
      )}

      {(sucio || mensaje) && (
        <div className="flex items-center justify-between gap-3 border-t border-carbon-800 bg-carbon-850 px-3 py-2">
          <span
            className={`font-mono text-[11px] ${
              mensaje === "Guardado" ? "text-disponible" : mensaje ? "text-marca-400" : "text-carbon-400"
            }`}
          >
            {mensaje ?? "Cambios sin guardar"}
          </span>
          {sucio && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setB(aBorrador(fila));
                  setMensaje(null);
                }}
                className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-carbon-400 transition-colors hover:text-carbon-100"
              >
                Descartar
              </button>
              <button
                type="button"
                onClick={guardar}
                disabled={guardando}
                className="bg-marca-500 px-4 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-marca-400 disabled:opacity-50"
              >
                {guardando ? "Guardando…" : "Guardar"}
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function Interruptor({
  activo,
  alCambiar,
  etiqueta,
  tono,
}: {
  activo: boolean;
  alCambiar: (v: boolean) => void;
  etiqueta: string;
  tono: "alerta" | "normal";
}) {
  const encendido =
    tono === "alerta"
      ? "border-marca-500 bg-marca-500/[0.15] text-marca-300"
      : "border-disponible bg-disponible/[0.12] text-disponible";
  return (
    <button
      type="button"
      onClick={() => alCambiar(!activo)}
      aria-pressed={activo}
      className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
        activo ? encendido : "border-carbon-700 text-carbon-500 hover:text-carbon-300"
      }`}
    >
      {etiqueta}
    </button>
  );
}

function Campo({
  etiqueta,
  valor,
  alCambiar,
  mono = false,
}: {
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
        {etiqueta}
        <input
          type="text"
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          className={`mt-2 h-10 w-full border border-carbon-700 bg-carbon-850 px-3 text-[14px] normal-case tracking-normal text-carbon-100 focus:border-marca-500 focus:outline-none ${
            mono ? "font-mono" : "font-sans"
          }`}
        />
      </label>
    </div>
  );
}

function AreaTexto({
  etiqueta,
  ayuda,
  valor,
  alCambiar,
  filas,
}: {
  etiqueta: string;
  ayuda?: string;
  valor: string;
  alCambiar: (v: string) => void;
  filas: number;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500">
        {etiqueta}
        {ayuda && (
          <span className="ml-2 normal-case tracking-normal text-carbon-600">{ayuda}</span>
        )}
        <textarea
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          rows={filas}
          className="mt-2 w-full resize-y border border-carbon-700 bg-carbon-850 px-3 py-2 font-sans text-[13px] normal-case leading-relaxed tracking-normal text-carbon-100 focus:border-marca-500 focus:outline-none"
        />
      </label>
    </div>
  );
}
