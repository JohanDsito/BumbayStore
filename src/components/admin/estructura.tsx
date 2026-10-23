"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseSesion } from "@/infraestructura/supabase/sesion";
import {
  contarProductosPorCategoria,
  crearCategoria,
  crearNicho,
  guardarCategoria,
  guardarNicho,
  listarCategorias,
  listarNichos,
  pedirRegeneracion,
  type CategoriaAdmin,
  type NichoAdmin,
} from "@/infraestructura/supabase/admin-catalogo";
import { slugify } from "@/dominio/formato";
import { datosATexto, textoADatos } from "@/dominio/campos-texto";
import { slugDeNichoValido } from "@/dominio/rutas";
import { AreaTexto, BarraGuardado, Campo, Interruptor } from "@/components/admin/campos";

/**
 * Pestaña de estructura: los nichos de la tienda y sus categorías.
 *
 * Lo que no se puede hacer aquí, a propósito:
 * - Cambiar la dirección (slug) de un nicho o una categoría: rompería los
 *   enlaces compartidos y lo ganado en buscadores.
 * - Borrar: un nicho se apaga; una categoría vacía simplemente no se muestra.
 */
export function AdminEstructura() {
  const sb = getSupabaseSesion();
  const [nichos, setNichos] = useState<NichoAdmin[]>([]);
  const [categorias, setCategorias] = useState<CategoriaAdmin[]>([]);
  const [conteo, setConteo] = useState<Map<string, number>>(new Map());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!sb) return;
    Promise.all([listarNichos(sb), listarCategorias(sb), contarProductosPorCategoria(sb)])
      .then(([n, c, k]) => {
        setNichos(n);
        setCategorias(c);
        setConteo(k);
        setError(null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setCargando(false));
  }, [sb]);

  useEffect(cargar, [cargar]);

  if (!sb) return null;
  if (cargando) {
    return <p className="py-16 text-center font-mono text-xs text-carbon-500">Cargando estructura…</p>;
  }
  if (error) {
    return <p className="py-16 text-center text-[13px] text-marca-400">{error}</p>;
  }

  // Al guardar se regenera la tienda y se recarga la lista desde la base.
  const alGuardar = () => {
    void pedirRegeneracion(sb);
    cargar();
  };

  const productosDeNicho = (slug: string) =>
    categorias
      .filter((c) => c.nicho_slug === slug)
      .reduce((s, c) => s + (conteo.get(c.slug) ?? 0), 0);

  return (
    <div className="space-y-12">
      <section aria-labelledby="titulo-nichos">
        <Encabezado
          id="titulo-nichos"
          titulo="Nichos"
          ayuda="Cada línea de la tienda. Un nicho solo aparece si está visible y tiene productos."
        />
        <ul className="space-y-2">
          {nichos.map((n) => (
            <FilaNicho
              key={n.slug}
              sb={sb}
              nicho={n}
              productos={productosDeNicho(n.slug)}
              alGuardar={alGuardar}
            />
          ))}
        </ul>
        <NuevoNicho
          sb={sb}
          siguienteOrden={Math.max(0, ...nichos.map((n) => n.orden)) + 1}
          alCrear={alGuardar}
        />
      </section>

      <section aria-labelledby="titulo-categorias">
        <Encabezado
          id="titulo-categorias"
          titulo="Categorías"
          ayuda="Cada categoría vive en un nicho. Las vacías no se muestran en la tienda."
        />
        <div className="space-y-6">
          {nichos.map((n) => {
            const propias = categorias.filter((c) => c.nicho_slug === n.slug);
            return (
              <div key={n.slug}>
                <h3 className="mb-2 rotulo text-[11px] text-carbon-400">
                  {n.nombre}
                  <span className="ml-2 text-carbon-600">/{n.slug}</span>
                </h3>
                {propias.length === 0 ? (
                  <p className="border border-dashed border-carbon-800 px-4 py-3 text-[13px] text-carbon-500">
                    Sin categorías todavía.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {propias.map((c) => (
                      <FilaCategoria
                        key={c.slug}
                        sb={sb}
                        categoria={c}
                        nichos={nichos}
                        productos={conteo.get(c.slug) ?? 0}
                        alGuardar={alGuardar}
                      />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <NuevaCategoria sb={sb} nichos={nichos} categorias={categorias} alCrear={alGuardar} />
      </section>
    </div>
  );
}

function Encabezado({ id, titulo, ayuda }: { id: string; titulo: string; ayuda: string }) {
  return (
    <div className="mb-4">
      <h2 id={id} className="text-xl font-extrabold tracking-[-0.03em] text-carbon-50">
        {titulo}
      </h2>
      <p className="mt-1 text-[13px] text-carbon-400">{ayuda}</p>
    </div>
  );
}

// --- Nichos -----------------------------------------------------------------

type BorradorNicho = {
  nombre: string;
  submarca: string;
  titular: string;
  descripcion: string;
  datos: string;
  acento: string;
  orden: string;
  activo: boolean;
};

/** Color que propone el panel mientras el nicho no tenga uno propio. */
const ACENTO_INICIAL = "#ec080f";

const aBorradorNicho = (n: NichoAdmin): BorradorNicho => ({
  nombre: n.nombre,
  submarca: n.submarca ?? "",
  titular: n.titular ?? "",
  descripcion: n.descripcion ?? "",
  datos: datosATexto(n.datos ?? []),
  acento: n.acento ?? "",
  orden: String(n.orden),
  activo: n.activo,
});

function FilaNicho({
  sb,
  nicho,
  productos,
  alGuardar,
}: {
  sb: SupabaseClient;
  nicho: NichoAdmin;
  productos: number;
  alGuardar: () => void;
}) {
  const [b, setB] = useState(() => aBorradorNicho(nicho));
  const [abierto, setAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const sucio = JSON.stringify(b) !== JSON.stringify(aBorradorNicho(nicho));
  const cambiar = <K extends keyof BorradorNicho>(campo: K, valor: BorradorNicho[K]) => {
    setB((x) => ({ ...x, [campo]: valor }));
    setMensaje(null);
  };

  const guardar = async () => {
    if (!b.nombre.trim()) return setMensaje("El nombre no puede quedar vacío.");
    setGuardando(true);
    const { error } = await guardarNicho(sb, nicho.slug, {
      nombre: b.nombre.trim(),
      submarca: b.submarca.trim() || null,
      titular: b.titular.trim() || null,
      descripcion: b.descripcion.trim() || null,
      datos: textoADatos(b.datos),
      acento: /^#[0-9a-f]{6}$/i.test(b.acento) ? b.acento.toLowerCase() : null,
      orden: Number.parseInt(b.orden, 10) || 0,
      activo: b.activo,
    });
    setGuardando(false);
    setMensaje(error ?? "Guardado");
    if (!error) alGuardar();
  };

  // Visible pero vacío: no aparece en la tienda y conviene decirlo.
  const aviso = b.activo && productos === 0 ? "Sin productos: aún no aparece" : null;

  return (
    <li className="border border-carbon-800 bg-carbon-900">
      <div className="flex flex-wrap items-center gap-3 p-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-[0.14em] text-carbon-500">
            /{nicho.slug} · {productos} {productos === 1 ? "producto" : "productos"}
            {aviso && <span className="ml-2 text-marca-400">{aviso}</span>}
          </p>
          <p className="truncate text-[14px] font-medium text-carbon-100">
            {b.nombre}
            {b.submarca && <span className="ml-2 text-carbon-500">{b.submarca}</span>}
          </p>
        </div>
        <Interruptor
          activo={b.activo}
          alCambiar={(v) => cambiar("activo", v)}
          etiqueta="Visible"
          tono="normal"
        />
        <BotonEditar abierto={abierto} alCambiar={setAbierto} />
      </div>

      {abierto && (
        <div className="space-y-4 border-t border-carbon-800 p-4">
          <div className="grid gap-4 sm:grid-cols-[2fr_2fr_1fr]">
            <Campo etiqueta="Nombre" valor={b.nombre} alCambiar={(v) => cambiar("nombre", v)} />
            <Campo
              etiqueta="Submarca (opcional)"
              valor={b.submarca}
              alCambiar={(v) => cambiar("submarca", v)}
            />
            <Campo etiqueta="Orden" valor={b.orden} alCambiar={(v) => cambiar("orden", v)} mono />
          </div>
          <div>
            <label className="flex items-center gap-3 rotulo text-[10px] text-carbon-500">
              Color del nicho
              <input
                type="color"
                value={b.acento || ACENTO_INICIAL}
                onChange={(e) => cambiar("acento", e.target.value)}
                className="h-9 w-14 cursor-pointer border border-carbon-700 bg-carbon-850 p-0.5"
              />
              <span className="normal-case tracking-normal text-carbon-600">
                {b.acento ? b.acento : "sin color propio: usa el de la tienda"}
              </span>
            </label>
          </div>
          <AreaTexto
            etiqueta="Titular de la portada"
            ayuda="dos líneas: la segunda sale resaltada"
            valor={b.titular}
            alCambiar={(v) => cambiar("titular", v)}
            filas={2}
          />
          <AreaTexto
            etiqueta="Presentación"
            valor={b.descripcion}
            alCambiar={(v) => cambiar("descripcion", v)}
            filas={3}
          />
          <AreaTexto
            etiqueta="Cifras de la portada"
            ayuda="Plataforma de batería: 128V | Meses de garantía: 6"
            valor={b.datos}
            alCambiar={(v) => cambiar("datos", v)}
            filas={2}
          />
        </div>
      )}

      <BarraGuardado
        sucio={sucio}
        mensaje={mensaje}
        guardando={guardando}
        alDescartar={() => {
          setB(aBorradorNicho(nicho));
          setMensaje(null);
        }}
        alGuardar={guardar}
      />
    </li>
  );
}

function NuevoNicho({
  sb,
  siguienteOrden,
  alCrear,
}: {
  sb: SupabaseClient;
  siguienteOrden: number;
  alCrear: () => void;
}) {
  const [nombre, setNombre] = useState("");
  // null mientras el slug se deduce del nombre; texto si se escribió a mano.
  const [slugManual, setSlugManual] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);

  const slug = slugManual ?? slugify(nombre);

  const crear = async () => {
    if (!nombre.trim()) return setMensaje("Escribe el nombre del nicho.");
    if (!slugDeNichoValido(slug)) {
      return setMensaje(
        "La dirección solo admite minúsculas, números y guiones, y no puede ser buscar, producto, categoria, acceso ni api.",
      );
    }
    setCreando(true);
    const { error } = await crearNicho(sb, { slug, nombre: nombre.trim(), orden: siguienteOrden });
    setCreando(false);
    if (error) return setMensaje(error);
    setNombre("");
    setSlugManual(null);
    setMensaje(`Creado. Queda oculto hasta que lo marques como visible y tenga productos.`);
    alCrear();
  };

  return (
    <Formulario titulo="Nuevo nicho" mensaje={mensaje}>
      <Campo etiqueta="Nombre" valor={nombre} alCambiar={(v) => { setNombre(v); setMensaje(null); }} />
      <Campo
        etiqueta="Dirección"
        valor={slug}
        alCambiar={(v) => { setSlugManual(v); setMensaje(null); }}
        mono
      />
      <BotonCrear ocupado={creando} alPulsar={crear} />
    </Formulario>
  );
}

// --- Categorías -------------------------------------------------------------

type BorradorCategoria = {
  nombre: string;
  nicho_slug: string;
  descripcion: string;
  orden: string;
};

const aBorradorCategoria = (c: CategoriaAdmin): BorradorCategoria => ({
  nombre: c.nombre,
  nicho_slug: c.nicho_slug,
  descripcion: c.descripcion ?? "",
  orden: String(c.orden),
});

function FilaCategoria({
  sb,
  categoria,
  nichos,
  productos,
  alGuardar,
}: {
  sb: SupabaseClient;
  categoria: CategoriaAdmin;
  nichos: NichoAdmin[];
  productos: number;
  alGuardar: () => void;
}) {
  const [b, setB] = useState(() => aBorradorCategoria(categoria));
  const [abierto, setAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const sucio = JSON.stringify(b) !== JSON.stringify(aBorradorCategoria(categoria));
  const cambiar = <K extends keyof BorradorCategoria>(campo: K, valor: BorradorCategoria[K]) => {
    setB((x) => ({ ...x, [campo]: valor }));
    setMensaje(null);
  };

  const guardar = async () => {
    if (!b.nombre.trim()) return setMensaje("El nombre no puede quedar vacío.");
    setGuardando(true);
    const { error } = await guardarCategoria(sb, categoria.slug, {
      nombre: b.nombre.trim(),
      nicho_slug: b.nicho_slug,
      descripcion: b.descripcion.trim() || null,
      orden: Number.parseInt(b.orden, 10) || 0,
    });
    setGuardando(false);
    setMensaje(error ?? "Guardado");
    if (!error) alGuardar();
  };

  return (
    <li className="border border-carbon-800 bg-carbon-900">
      <div className="flex items-center gap-3 p-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-[0.14em] text-carbon-500">
            /{b.nicho_slug}/{categoria.slug} · {productos}{" "}
            {productos === 1 ? "producto" : "productos"}
          </p>
          <p className="truncate text-[14px] font-medium text-carbon-100">{b.nombre}</p>
        </div>
        <BotonEditar abierto={abierto} alCambiar={setAbierto} />
      </div>

      {abierto && (
        <div className="space-y-4 border-t border-carbon-800 p-4">
          <div className="grid gap-4 sm:grid-cols-[2fr_2fr_1fr]">
            <Campo etiqueta="Nombre" valor={b.nombre} alCambiar={(v) => cambiar("nombre", v)} />
            <SelectorNicho
              nichos={nichos}
              valor={b.nicho_slug}
              alCambiar={(v) => cambiar("nicho_slug", v)}
            />
            <Campo etiqueta="Orden" valor={b.orden} alCambiar={(v) => cambiar("orden", v)} mono />
          </div>
          {b.nicho_slug !== categoria.nicho_slug && productos > 0 && (
            <p className="text-[12px] text-marca-400">
              Sus {productos} productos se mudan con ella. La dirección vieja de la
              categoría redirige sola a la nueva.
            </p>
          )}
          <AreaTexto
            etiqueta="Descripción"
            ayuda="sale bajo el título y en Google"
            valor={b.descripcion}
            alCambiar={(v) => cambiar("descripcion", v)}
            filas={3}
          />
        </div>
      )}

      <BarraGuardado
        sucio={sucio}
        mensaje={mensaje}
        guardando={guardando}
        alDescartar={() => {
          setB(aBorradorCategoria(categoria));
          setMensaje(null);
        }}
        alGuardar={guardar}
      />
    </li>
  );
}

function NuevaCategoria({
  sb,
  nichos,
  categorias,
  alCrear,
}: {
  sb: SupabaseClient;
  nichos: NichoAdmin[];
  categorias: CategoriaAdmin[];
  alCrear: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [nichoSlug, setNichoSlug] = useState(nichos[0]?.slug ?? "");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);

  const slug = slugify(nombre);

  const crear = async () => {
    if (!slug) return setMensaje("Escribe el nombre de la categoría.");
    if (!nichoSlug) return setMensaje("Primero crea un nicho.");
    setCreando(true);
    const orden =
      Math.max(0, ...categorias.filter((c) => c.nicho_slug === nichoSlug).map((c) => c.orden)) + 1;
    const { error } = await crearCategoria(sb, {
      slug,
      nicho_slug: nichoSlug,
      nombre: nombre.trim(),
      descripcion: null,
      orden,
    });
    setCreando(false);
    if (error) return setMensaje(error);
    setNombre("");
    setMensaje("Creada. Aparece en la tienda cuando tenga productos.");
    alCrear();
  };

  return (
    <Formulario titulo="Nueva categoría" mensaje={mensaje}>
      <Campo etiqueta="Nombre" valor={nombre} alCambiar={(v) => { setNombre(v); setMensaje(null); }} />
      <SelectorNicho nichos={nichos} valor={nichoSlug} alCambiar={setNichoSlug} />
      <BotonCrear ocupado={creando} alPulsar={crear} />
    </Formulario>
  );
}

// --- Piezas -----------------------------------------------------------------

function SelectorNicho({
  nichos,
  valor,
  alCambiar,
}: {
  nichos: NichoAdmin[];
  valor: string;
  alCambiar: (v: string) => void;
}) {
  return (
    <div>
      <label className="block rotulo text-[10px] text-carbon-500">
        Nicho
        <select
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          className="mt-2 h-10 w-full border border-carbon-700 bg-carbon-850 px-2 font-sans text-[14px] normal-case tracking-normal text-carbon-100 focus:border-marca-500 focus:outline-none"
        >
          {nichos.map((n) => (
            <option key={n.slug} value={n.slug}>
              {n.nombre}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function Formulario({
  titulo,
  mensaje,
  children,
}: {
  titulo: string;
  mensaje: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 border border-dashed border-carbon-700 p-4">
      <p className="rotulo text-[10px] text-marca-400">{titulo}</p>
      <div className="mt-3 grid items-end gap-4 sm:grid-cols-[2fr_2fr_auto]">{children}</div>
      {mensaje && <p className="mt-3 text-[12px] text-carbon-300">{mensaje}</p>}
    </div>
  );
}

function BotonCrear({ ocupado, alPulsar }: { ocupado: boolean; alPulsar: () => void }) {
  return (
    <button
      type="button"
      onClick={alPulsar}
      disabled={ocupado}
      className="h-10 bg-marca-500 px-5 text-[13px] font-semibold text-sobre-marca transition-colors hover:bg-marca-400 disabled:opacity-50"
    >
      {ocupado ? "Creando…" : "Crear"}
    </button>
  );
}

function BotonEditar({
  abierto,
  alCambiar,
}: {
  abierto: boolean;
  alCambiar: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => alCambiar(!abierto)}
      aria-expanded={abierto}
      className="shrink-0 border border-carbon-700 px-3 py-2 rotulo text-[10px] text-carbon-300 transition-colors hover:border-marca-500 hover:text-marca-400"
    >
      {abierto ? "Cerrar" : "Editar"}
    </button>
  );
}
