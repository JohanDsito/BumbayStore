"use client";

import { useEffect } from "react";
import * as campo from "@/cliente/campo/estado";

/**
 * Le dice al campo de luz qué color e intensidad pide esta página. No pinta
 * nada; al salir de la página el campo vuelve a su estado de portada.
 */
export function FijarCampo({
  acento,
  intensidad,
}: {
  acento: string | null;
  intensidad: number;
}) {
  useEffect(() => campo.pedir({ acento, intensidad }), [acento, intensidad]);
  return null;
}
