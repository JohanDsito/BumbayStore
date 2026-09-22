"use client";

import { useEffect, useState } from "react";
import { useCarrito } from "@/lib/cart-context";
import { precio } from "@/lib/format";
import { enlacePedido } from "@/lib/whatsapp";
import { imagenUrl } from "@/lib/supabase";
import { CampoCiudad, esCiudadValida } from "@/components/city-field";
import { registrarPedido } from "@/lib/registro";
import {
  IconoCerrar,
  IconoMas,
  IconoMenos,
  IconoBasura,
  IconoWhatsApp,
} from "@/components/icons";

/** Panel de resumen del pedido. Se desliza desde la derecha en escritorio y
 *  desde abajo en celular, que es donde estará la mayoría de clientes. */
export function PanelPedido() {
  const {
    lineas,
    nombre,
    ciudad,
    comentario,
    total,
    unidades,
    abierto,
    cerrar,
    fijarCantidad,
    quitar,
    vaciar,
    fijarComentario,
    fijarNombre,
    fijarCiudad,
  } = useCarrito();

  // Los errores aparecen al intentar enviar, no mientras se escribe: avisar
  // de un campo vacío que todavía no se ha tocado solo molesta.
  const [errores, setErrores] = useState({ nombre: false, ciudad: false });

  // Mientras el panel está abierto, el fondo no debe desplazarse: en celular
  // es muy fácil arrastrar la página por debajo del panel sin querer.
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [abierto, cerrar]);

  // El vendedor necesita nombre y ciudad para cotizar el envío sin tener que
  // preguntarlos por chat, así que son obligatorios. Se valida al pulsar en
  // vez de deshabilitar el botón: un botón inerte no explica qué falta.
  const alEnviar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const faltaNombre = nombre.trim().length < 2;
    // La ciudad tiene que salir de la lista del DANE: así llega siempre
    // escrita igual y se puede agrupar por zona para cotizar el envío.
    const faltaCiudad = !esCiudadValida(ciudad);

    if (!faltaNombre && !faltaCiudad) {
      // Se guarda antes de salir hacia WhatsApp. El enlace abre otra pestaña,
      // así que esta página sigue viva y da tiempo a que termine.
      void registrarPedido({ nombre, ciudad, comentario, total, lineas });
      return;
    }

    e.preventDefault();
    setErrores({ nombre: faltaNombre, ciudad: faltaCiudad });
    const id = faltaNombre ? "pedido-nombre" : "pedido-ciudad";
    document.getElementById(id)?.focus();
  };

  if (!abierto) return null;


  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Tu pedido">
      <button
        type="button"
        aria-label="Cerrar pedido"
        onClick={cerrar}
        className="absolute inset-0 bg-carbon-950/80 backdrop-blur-sm animate-[aparecer_0.2s_ease-out]"
      />

      <div className="relative flex h-full w-full max-w-md flex-col border-l border-carbon-800 bg-carbon-900 shadow-flotante animate-[subir_0.3s_var(--ease-salida)] sm:animate-[aparecer_0.25s_var(--ease-salida)]">
        <div aria-hidden className="h-1 shrink-0 cinta-precaucion" />

        <header className="flex shrink-0 items-center justify-between border-b border-carbon-800 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-carbon-50">
              Tu pedido
            </h2>
            <p className="mt-0.5 font-mono text-[11px] text-carbon-500">
              {lineas.length} {lineas.length === 1 ? "producto" : "productos"} ·{" "}
              {unidades} {unidades === 1 ? "unidad" : "unidades"}
            </p>
          </div>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center border border-carbon-700 text-carbon-400 transition-colors hover:border-carbon-500 hover:text-carbon-100"
          >
            <IconoCerrar className="h-4 w-4" />
          </button>
        </header>

        {lineas.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="text-sm text-carbon-400">Tu pedido está vacío.</p>
            <button
              type="button"
              onClick={cerrar}
              className="font-mono text-xs uppercase tracking-[0.14em] text-marca-400 hover:text-marca-300"
            >
              Seguir viendo productos
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <ul className="divide-y divide-carbon-800">
                {lineas.map((linea) => {
                  const url = imagenUrl(linea.imagen);
                  return (
                    <li key={linea.slug} className="flex gap-3 p-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden bg-carbon-50">
                        {url ? (
                          // Miniatura del carrito: img nativo basta y evita
                          // reservar layout de next/image en una lista dinámica.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={url}
                            alt=""
                            className="h-full w-full object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-carbon-100">
                            <span className="font-mono text-[8px] text-carbon-500">
                              {linea.sku.slice(-4)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] tracking-[0.14em] text-carbon-500">
                          {linea.sku}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[13px] font-medium leading-snug text-carbon-100">
                          {linea.nombre}
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center border border-carbon-700">
                            <button
                              type="button"
                              onClick={() => fijarCantidad(linea.slug, linea.cantidad - 1)}
                              aria-label="Quitar una unidad"
                              className="flex h-7 w-7 items-center justify-center text-carbon-400 transition-colors hover:bg-carbon-800 hover:text-carbon-100"
                            >
                              {linea.cantidad === 1 ? (
                                <IconoBasura className="h-3.5 w-3.5" />
                              ) : (
                                <IconoMenos className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <span className="w-8 text-center font-mono text-xs font-semibold text-carbon-50">
                              {linea.cantidad}
                            </span>
                            <button
                              type="button"
                              onClick={() => fijarCantidad(linea.slug, linea.cantidad + 1)}
                              aria-label="Agregar una unidad"
                              className="flex h-7 w-7 items-center justify-center text-carbon-400 transition-colors hover:bg-carbon-800 hover:text-carbon-100"
                            >
                              <IconoMas className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="block font-mono text-sm font-semibold text-carbon-50">
                              {precio(linea.precioUnitario * linea.cantidad)}
                            </span>
                            {linea.cantidad > 1 && (
                              <span className="font-mono text-[10px] text-carbon-500">
                                {precio(linea.precioUnitario)} c/u
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => quitar(linea.slug)}
                        aria-label={`Eliminar ${linea.nombre}`}
                        className="self-start p-1 text-carbon-500 transition-colors hover:text-marca-400"
                      >
                        <IconoCerrar className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-4 border-t border-carbon-800 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-marca-400">
                  Datos para calcular el envío
                </p>

                <Campo
                  id="pedido-nombre"
                  etiqueta="Tu nombre"
                  valor={nombre}
                  alCambiar={(v) => {
                    fijarNombre(v);
                    if (errores.nombre) setErrores((x) => ({ ...x, nombre: false }));
                  }}
                  marcador="Nombre y apellido"
                  autoComplete="name"
                  error={errores.nombre ? "Escribe tu nombre" : null}
                />

                <CampoCiudad
                  id="pedido-ciudad"
                  valor={ciudad}
                  alCambiar={(v) => {
                    fijarCiudad(v);
                    if (errores.ciudad) setErrores((x) => ({ ...x, ciudad: false }));
                  }}
                  error={errores.ciudad ? "Elige tu municipio de la lista" : null}
                />

                <div>
                  <label
                    htmlFor="comentario-pedido"
                    className="block font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500"
                  >
                    Comentarios <span className="text-carbon-600">(opcional)</span>
                  </label>
                  <textarea
                    id="comentario-pedido"
                    value={comentario}
                    onChange={(e) => fijarComentario(e.target.value)}
                    rows={3}
                    placeholder="Dirección, forma de pago, cantidades especiales…"
                    className="mt-2 w-full resize-none border border-carbon-700 bg-carbon-850 px-3 py-2 text-[13px] text-carbon-100 placeholder:text-carbon-500 focus:border-marca-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <footer className="shrink-0 border-t border-carbon-800 bg-carbon-900 p-4">
              <div className="mb-3 flex items-end justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon-500">
                  Total
                </span>
                <span className="font-mono text-2xl font-extrabold leading-none text-carbon-50">
                  {precio(total)}
                </span>
              </div>

              <a
                href={enlacePedido(lineas, total, { nombre, ciudad, comentario })}
                onClick={alEnviar}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-full items-center justify-center gap-2.5 bg-marca-500 font-semibold tracking-tight text-white transition-colors hover:bg-marca-400"
              >
                <IconoWhatsApp className="h-5 w-5" />
                Enviar pedido por WhatsApp
              </a>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={vaciar}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500 transition-colors hover:text-carbon-300"
                >
                  Vaciar pedido
                </button>
                <p className="font-mono text-[10px] text-carbon-500">
                  El pago se coordina por WhatsApp
                </p>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}


/**
 * Campo de texto del formulario de pedido, con su error debajo.
 *
 * El foco ya pinta el borde de rojo, así que el estado de error necesita algo
 * más para no confundirse con un campo simplemente seleccionado: lleva además
 * un fondo teñido, que se mantiene aunque el campo pierda el foco.
 */
function Campo({
  id,
  etiqueta,
  valor,
  alCambiar,
  marcador,
  autoComplete,
  error,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  marcador: string;
  autoComplete: string;
  error: string | null;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.14em] text-carbon-500"
      >
        {etiqueta}
      </label>
      <input
        id={id}
        type="text"
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        placeholder={marcador}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 h-11 w-full border px-3 text-[14px] text-carbon-100 placeholder:text-carbon-500 focus:outline-none focus:border-marca-500 ${
          error
            ? "border-marca-500 bg-marca-500/[0.10]"
            : "border-carbon-700 bg-carbon-850"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-marca-400">
          {error}
        </p>
      )}
    </div>
  );
}
