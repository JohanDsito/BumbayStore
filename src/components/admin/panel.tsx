"use client";

import { useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";

import { getSupabaseSesion } from "@/infraestructura/supabase/sesion";
import { AdminProductos } from "@/components/admin/productos";
import { AdminPedidos } from "@/components/admin/pedidos";
import { AdminBusquedas } from "@/components/admin/busquedas";

type Pestana = "productos" | "pedidos" | "busquedas";

const PESTANAS: { id: Pestana; titulo: string }[] = [
  { id: "productos", titulo: "Productos" },
  { id: "pedidos", titulo: "Pedidos" },
  { id: "busquedas", titulo: "Búsquedas" },
];

export function PanelAdmin() {
  const sb = getSupabaseSesion();
  const [sesion, setSesion] = useState<Session | null>(null);
  // Sin Supabase no hay nada que cargar, así que el estado inicial ya es el
  // definitivo: fijarlo dentro del efecto provocaría un render en cascada.
  const [cargando, setCargando] = useState(Boolean(sb));
  const [pestana, setPestana] = useState<Pestana>("productos");
  // null mientras se comprueba; false si la cuenta entró pero no tiene permiso.
  const [esAdmin, setEsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!sb) return;
    // Ambas llamadas resuelven fuera del cuerpo del efecto.
    sb.auth.getSession().then(({ data }) => {
      setSesion(data.session);
      setCargando(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_evento, s) => setSesion(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  // Estar autenticado no basta: el permiso lo da la tabla `admins`. Se
  // pregunta a la base en vez de suponerlo, y así el panel puede avisar en
  // lugar de dejar que los guardados fallen en silencio.
  useEffect(() => {
    if (!sb || !sesion) {
      return;
    }
    sb.rpc("es_admin").then(({ data, error }) => {
      setEsAdmin(error ? false : Boolean(data));
    });
  }, [sb, sesion]);

  if (!sb) {
    return (
      <Aviso titulo="Supabase no está configurado">
        Faltan <code className="font-mono text-marca-400">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
        o <code className="font-mono text-marca-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
      </Aviso>
    );
  }

  if (cargando) {
    return <p className="py-20 text-center font-mono text-xs text-carbon-500">Cargando…</p>;
  }

  if (!sesion) return <FormularioAcceso />;

  if (esAdmin === null) {
    return (
      <p className="py-20 text-center font-mono text-xs text-carbon-500">
        Comprobando permisos…
      </p>
    );
  }

  if (!esAdmin) {
    return (
      <Aviso titulo="Esta cuenta no tiene permisos">
        <span className="font-mono text-carbon-100">{sesion.user.email}</span> entró
        correctamente, pero no está en la lista de administradores, así que no
        puede ver ni modificar nada. Añádela desde el SQL Editor de Supabase
        con la instrucción de la sección{" "}
        <span className="font-mono text-marca-400">Crear tu usuario</span> del README.
        <button
          type="button"
          onClick={() => sb.auth.signOut()}
          className="mt-4 block w-full border border-carbon-700 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-carbon-300 transition-colors hover:border-marca-500 hover:text-marca-400"
        >
          Salir
        </button>
      </Aviso>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-carbon-800 pb-3">
        <nav className="flex gap-1" aria-label="Secciones">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPestana(p.id)}
              aria-current={pestana === p.id ? "page" : undefined}
              className={`px-4 py-2 text-[13px] font-medium transition-colors ${
                pestana === p.id
                  ? "border-b-2 border-marca-500 text-carbon-50"
                  : "text-carbon-400 hover:text-carbon-100"
              }`}
            >
              {p.titulo}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-carbon-500">
            {sesion.user.email}
          </span>
          <button
            type="button"
            onClick={() => sb.auth.signOut()}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-carbon-400 transition-colors hover:text-marca-400"
          >
            Salir
          </button>
        </div>
      </div>

      {pestana === "productos" && <AdminProductos />}
      {pestana === "pedidos" && <AdminPedidos />}
      {pestana === "busquedas" && <AdminBusquedas />}
    </div>
  );
}

function FormularioAcceso() {
  const sb = getSupabaseSesion();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const entrar = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!sb) return;
      setEnviando(true);
      setError(null);
      const { error } = await sb.auth.signInWithPassword({
        email: correo.trim(),
        password: clave,
      });
      if (error) {
        // El mensaje de Supabase viene en inglés y es técnico.
        setError(
          /invalid/i.test(error.message)
            ? "Correo o contraseña incorrectos."
            : error.message,
        );
        setEnviando(false);
      }
      // Si entra bien, onAuthStateChange se encarga de cambiar la vista.
    },
    [sb, correo, clave],
  );

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-carbon-50">
        Entrar al panel
      </h1>
      <p className="mt-2 text-[13px] leading-relaxed text-carbon-400">
        Con el correo y la contraseña del usuario que creaste en Supabase.
      </p>

      <form onSubmit={entrar} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="admin-correo"
            className="block font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500"
          >
            Correo
          </label>
          <input
            id="admin-correo"
            type="email"
            required
            autoComplete="username"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="mt-2 h-11 w-full border border-carbon-700 bg-carbon-850 px-3 text-[14px] text-carbon-100 focus:border-marca-500 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="admin-clave"
            className="block font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500"
          >
            Contraseña
          </label>
          <input
            id="admin-clave"
            type="password"
            required
            autoComplete="current-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            className="mt-2 h-11 w-full border border-carbon-700 bg-carbon-850 px-3 text-[14px] text-carbon-100 focus:border-marca-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-[13px] text-marca-400">{error}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="h-12 w-full bg-marca-500 text-[14px] font-semibold text-white transition-colors hover:bg-marca-400 disabled:opacity-50"
        >
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function Aviso({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md border border-marca-500/40 bg-marca-500/[0.06] p-6 text-center">
      <h1 className="text-lg font-bold text-carbon-50">{titulo}</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-carbon-300">{children}</p>
    </div>
  );
}
