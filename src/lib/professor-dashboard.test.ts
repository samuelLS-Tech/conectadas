import { describe, expect, it } from "vitest";
import { agregarDesempenho, type AtividadeAcademica } from "./professor-dashboard";

const estudantes = new Map([
  ["a", { serie: "1ª série", turma: "A" }],
  ["b", { serie: "1ª série", turma: "B" }],
]);

const atividades: AtividadeAcademica[] = [
  { estudante_id: "a", disciplina: "Matemática", titulo: "Funções", acertos: 5, total: 5 },
  { estudante_id: "a", disciplina: "Física", titulo: "Mecânica", acertos: 1, total: 5 },
  { estudante_id: "b", disciplina: "Matemática", titulo: "Funções", acertos: 2, total: 5 },
];

describe("agregarDesempenho", () => {
  it("respeita simultaneamente turma e disciplina", () => {
    const resultado = agregarDesempenho(atividades, estudantes, {
      serie: "1ª série",
      turma: "A",
      disciplina: "Matemática",
    });

    expect(resultado.atividades).toHaveLength(1);
    expect(resultado.desempenho).toEqual([
      { disciplina: "Matemática", acertos: 5, total: 5, atividades: 1, percentual: 100 },
    ]);
    expect(resultado.facilidades[0]?.rotulo).toBe("Funções");
  });

  it("não usa dados de estudantes fora do mapa autorizado", () => {
    const resultado = agregarDesempenho(
      [...atividades, { estudante_id: "outra-escola", disciplina: "Matemática", titulo: "Geometria", acertos: 5, total: 5 }],
      estudantes,
      { serie: "Todas", turma: "Todas", disciplina: "Todas" },
    );

    expect(resultado.atividades).toHaveLength(3);
    expect(resultado.mediaGeral).toBe(53);
  });

  it("retorna estado vazio sem inventar desempenho", () => {
    const resultado = agregarDesempenho(atividades, estudantes, {
      serie: "2ª série",
      turma: "C",
      disciplina: "Química",
    });

    expect(resultado.desempenho).toEqual([]);
    expect(resultado.mediaGeral).toBeNull();
    expect(resultado.dificuldades).toEqual([]);
  });
});
