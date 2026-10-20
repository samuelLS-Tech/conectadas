/** Régua geral de níveis: 1 a 10, linear por XP total (600 XP por nível). */
export const XP_POR_NIVEL = 600;
export const NIVEL_MAXIMO = 10;

export const TITULOS_NIVEL: Record<number, string> = {
  1: "Aspirante STEM",
  2: "Curiosa da Ciência",
  3: "Monitora Aprendiz",
  4: "Investigadora Júnior",
  5: "Pesquisadora Sênior",
  6: "Tecnóloga em Campo",
  7: "Cientista Residente",
  8: "Mentora de Elite",
  9: "Orientadora Científica",
  10: "Mestre STEM",
};

export function nivelPorXP(xp: number): number {
  return Math.min(NIVEL_MAXIMO, Math.max(1, Math.floor(xp / XP_POR_NIVEL) + 1));
}

export function tituloNivel(nivel: number): string {
  return TITULOS_NIVEL[Math.min(NIVEL_MAXIMO, Math.max(1, nivel))] ?? TITULOS_NIVEL[1]!;
}

/** XP necessário para concluir o nível atual; null no nível máximo. */
export function proximoNivelXP(nivel: number): number | null {
  return nivel >= NIVEL_MAXIMO ? null : nivel * XP_POR_NIVEL;
}
