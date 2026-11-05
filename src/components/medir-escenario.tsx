"use client";

import { useEffect, useRef } from "react";

/**
 * Marca el final del escenario de la portada para el tema claro.
 *
 * Va al final de la portada y publica en <html> dónde termina, medido desde
 * el borde superior de la página (--alto-escenario). La capa del campo de luz
 * cubre justo hasta ahí (.campo-capa en globals.css) y data-escenario le avisa
 * a la portada que ya puede volverse transparente. Al salir de una página con
 * portada, lo quita: sin escenario, el tema claro no muestra el campo.
 */
export function MedirEscenario() {
  const marca = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = marca.current;
    const seccion = el?.parentElement;
    if (!el || !seccion) return;
    const raiz = document.documentElement;

    const publicar = () => {
      const fin = el.getBoundingClientRect().top + window.scrollY;
      raiz.style.setProperty("--alto-escenario", `${Math.round(fin)}px`);
      raiz.dataset.escenario = "";
    };
    publicar();
    const observador = new ResizeObserver(publicar);
    observador.observe(seccion);
    observador.observe(document.body);

    return () => {
      observador.disconnect();
      raiz.style.removeProperty("--alto-escenario");
      delete raiz.dataset.escenario;
    };
  }, []);

  return <span ref={marca} aria-hidden className="block" />;
}
