import { describe, expect, it } from "vitest";
import { tintaSobre } from "./color";

describe("tintaSobre", () => {
  it("usa tinta blanca sobre el rojo Bumbay", () => {
    expect(tintaSobre("#ec080f")).toBe("#ffffff");
  });

  it("usa tinta oscura sobre un ámbar claro", () => {
    expect(tintaSobre("#ffb21a")).toBe("#0b0c12");
  });

  it("si el color no se entiende, queda en blanco", () => {
    expect(tintaSobre("rojo")).toBe("#ffffff");
  });
});
