import { describe, expect, it } from "vitest";
import { mensajeDeError } from "./errores";

describe("mensajeDeError", () => {
  it("explica la falta de internet y tranquiliza sobre lo escrito", () => {
    const m = mensajeDeError(new TypeError("Failed to fetch"));
    expect(m).toMatch(/Sin conexión/);
    expect(m).toMatch(/sigue aquí/);
  });

  it("reconoce la sesión vencida", () => {
    expect(mensajeDeError({ message: "JWT expired" })).toMatch(/sesión venció/);
  });

  it("reconoce la falta de permisos de la base", () => {
    expect(mensajeDeError({ message: 'new row violates row-level security policy for table "nichos"' })).toMatch(
      /permisos/,
    );
  });

  it("reconoce duplicados y formato", () => {
    expect(mensajeDeError({ message: "duplicate key value violates unique constraint" })).toMatch(/Ya existe/);
    expect(mensajeDeError({ message: 'violates check constraint "pedidos_forma"' })).toMatch(/formato/);
  });

  it("usa la acción pedida y conserva el original si no lo conoce", () => {
    expect(mensajeDeError(new Error("algo raro"), "cargar los pedidos")).toBe(
      "No se pudo cargar los pedidos. Intenta de nuevo en un momento (algo raro).",
    );
  });
});
