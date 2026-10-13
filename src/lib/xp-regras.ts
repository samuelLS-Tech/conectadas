/** Cada erro desconta 5 XP do valor da atividade; a recompensa mínima é 5 XP. */
export const DESCONTO_POR_ERRO = 5;
export const XP_MINIMO = 5;

export function calcularXPAtividade(xpBase: number, total: number, acertos: number): number {
  const erros = Math.max(0, total - acertos);
  return Math.max(XP_MINIMO, xpBase - erros * DESCONTO_POR_ERRO);
}
