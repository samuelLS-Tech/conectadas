import { describe, it, expect } from "vitest";
import { calcularXPAtividade } from "./xp-regras";

describe("XP da Biblioteca STEM", () => {
  it("dá o XP cheio sem erros", () => expect(calcularXPAtividade(20, 4, 4)).toBe(20));
  it("desconta 5 XP por erro", () => expect(calcularXPAtividade(20, 4, 2)).toBe(10));
  it("nunca dá menos que 5 XP", () => expect(calcularXPAtividade(20, 4, 0)).toBe(5));
});
