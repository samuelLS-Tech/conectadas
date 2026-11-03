import { describe, expect, it } from "vitest";
import { assuntosNovos } from "./biblioteca-conteudo";
import { biblioteca } from "./conectadas-data";
const todos = [...biblioteca.filter((m) => m.categoria !== "Vestibulares"), ...assuntosNovos];
describe("biblioteca", () => {
  it("tem 10 assuntos por disciplina", () => {
    for (const c of ["Matemática", "Física", "Química", "Programação", "Engenharia"])
      expect(todos.filter((m) => m.categoria === c)).toHaveLength(10);
  });
  it("cada assunto tem 5 questões válidas", () => {
    for (const m of todos) {
      expect(m.questoes).toHaveLength(5);
      for (const q of m.questoes) { expect(q.correta).toBeLessThan(q.alternativas.length); expect(new Set(q.alternativas).size).toBe(q.alternativas.length); }
    }
  });
  it("ids únicos", () => { expect(new Set(todos.map((m) => m.id)).size).toBe(todos.length); });
});
