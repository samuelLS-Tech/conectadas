import { describe, expect, it } from "vitest";
import { resolverFluxoLogin } from "./login-flow";

describe("resolverFluxoLogin", () => {
  it("bloqueia quando a consulta falha", () => {
    expect(resolverFluxoLogin([{ role: "estudante" }], new Error("falha"))).toEqual({
      estado: "bloqueado",
      motivo: "consulta",
    });
  });

  it("abre o onboarding quando o usuário ainda não tem papel", () => {
    expect(resolverFluxoLogin([], null)).toEqual({ estado: "onboarding" });
    expect(resolverFluxoLogin(null, null)).toEqual({ estado: "onboarding" });
  });

  it.each(["estudante", "empresa", "professor"] as const)(
    "redireciona um único papel válido: %s",
    (role) => {
      expect(resolverFluxoLogin([{ role }], null)).toEqual({ estado: "redirecionar", tipo: role });
    },
  );

  it("bloqueia um único papel inválido", () => {
    expect(resolverFluxoLogin([{ role: "administrador" }], null)).toEqual({
      estado: "bloqueado",
      motivo: "papel_invalido",
    });
  });

  it("bloqueia múltiplos papéis", () => {
    expect(resolverFluxoLogin([{ role: "estudante" }, { role: "professor" }], null)).toEqual({
      estado: "bloqueado",
      motivo: "multiplos_papeis",
    });
  });
});
