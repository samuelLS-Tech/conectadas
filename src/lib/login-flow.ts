import type { TipoConta } from "@/lib/xp-store";

export type ResultadoLogin =
  | { estado: "onboarding" }
  | { estado: "redirecionar"; tipo: TipoConta }
  | { estado: "bloqueado"; motivo: "consulta" | "papel_invalido" | "multiplos_papeis" };

export function ehTipoConta(valor: unknown): valor is TipoConta {
  return valor === "estudante" || valor === "empresa" || valor === "professor";
}

export function resolverFluxoLogin(
  papeis: readonly { role: unknown }[] | null,
  erro: unknown,
): ResultadoLogin {
  if (erro) return { estado: "bloqueado", motivo: "consulta" };
  if (!papeis?.length) return { estado: "onboarding" };
  if (papeis.length > 1) return { estado: "bloqueado", motivo: "multiplos_papeis" };
  if (!ehTipoConta(papeis[0]?.role)) return { estado: "bloqueado", motivo: "papel_invalido" };
  return { estado: "redirecionar", tipo: papeis[0].role };
}
