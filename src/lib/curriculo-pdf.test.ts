import { describe, expect, it } from "vitest";
import { criarCurriculoPDF } from "./curriculo-pdf";

describe("criarCurriculoPDF", () => {
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
