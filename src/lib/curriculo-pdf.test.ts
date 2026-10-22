import { describe, expect, it } from "vitest";
import { criarCurriculoPDF } from "./curriculo-pdf";

describe("criarCurriculoPDF", () => {
  it("mantém os dados de progresso exclusivos do perfil recebido", () => {
    const gerar = (nome: string, xp: number, monitorias: number, habilidades: string[], medalhas: string[]) => criarCurriculoPDF({
      nome, email: null, serie: "2º ano", turma: "B", escola: "Escola da estudante",
      nivel: 2, xp, monitorias, exercicios: 5, horas: 2, lideranca: 1, habilidades, medalhas,
    }).output();
    const primeiro = gerar("Estudante Um", 650, 3, ["Python"], ["Medalha Ada Lovelace"]);
    const segundo = gerar("Estudante Dois", 780, 7, [], []);
    expect(primeiro).toContain("Estudante Um");
    expect(primeiro).toContain("650 XP");
    expect(primeiro).toContain("3 monitorias registradas");
    expect(primeiro).toContain("Python");
    expect(primeiro).toContain("Medalha Ada Lovelace");
    expect(segundo).toContain("780 XP");
    expect(segundo).toContain("7 monitorias registradas");
    expect(segundo).not.toContain("Estudante Um");
    expect(segundo).not.toContain("Python");
    expect(segundo).not.toContain("Medalha Ada Lovelace");
  });
  it("acomoda dados longos em múltiplas páginas sem falhar", () => {
    const doc = criarCurriculoPDF({
      nome: "Estudante com nome profissional excepcionalmente longo ".repeat(4),
      email: `${"contato-profissional-muito-longo-".repeat(4)}@empresa-exemplo.com.br`,
      serie: "3ª série",
      turma: "Turma com identificação longa",
      nivel: 8,
      xp: 12345,
      monitorias: 14,
      exercicios: 85,
      horas: 120,
      lideranca: 9,
      habilidades: Array.from({ length: 90 }, (_, indice) => `Habilidade ${indice + 1} com descrição extensa e específica`),
      medalhas: Array.from({ length: 24 }, (_, indice) => `Conquista ${indice + 1}: ${"resultado acadêmico comprovado ".repeat(8)}`),
    });

    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
    expect(doc.output("arraybuffer").byteLength).toBeGreaterThan(10_000);
  });
});
