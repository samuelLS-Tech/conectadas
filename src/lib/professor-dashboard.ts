export type AtividadeAcademica = {
  estudante_id: string;
  disciplina: string;
  titulo: string;
  acertos: number;
  total: number;
};

export type EstudanteAcademica = { serie: string; turma: string };

export type FiltrosAcademicos = { serie: string; turma: string; disciplina: string };

export type DesempenhoDisciplina = {
  disciplina: string;
  acertos: number;
  total: number;
  atividades: number;
  percentual: number;
};

type Assunto = { rotulo: string; percentual: number; respostas: number };

export function agregarDesempenho<T extends AtividadeAcademica>(
  atividades: T[],
  estudantes: Map<string, EstudanteAcademica>,
  filtros: FiltrosAcademicos,
) {
  const filtradas = atividades.filter((atividade) => {
    const estudante = estudantes.get(atividade.estudante_id);
    return Boolean(estudante) &&
      (filtros.serie === "Todas" || estudante?.serie === filtros.serie) &&
      (filtros.turma === "Todas" || estudante?.turma === filtros.turma) &&
      (filtros.disciplina === "Todas" || atividade.disciplina === filtros.disciplina);
  });
  const disciplinas = new Map<string, Omit<DesempenhoDisciplina, "disciplina" | "percentual">>();
  const assuntos = new Map<string, { disciplina: string; titulo: string; acertos: number; total: number; respostas: number }>();

  for (const atividade of filtradas) {
    const atual = disciplinas.get(atividade.disciplina) ?? { acertos: 0, total: 0, atividades: 0 };
    atual.acertos += atividade.acertos;
    atual.total += atividade.total;
    atual.atividades += 1;
    disciplinas.set(atividade.disciplina, atual);

    const chave = `${atividade.disciplina}\u0000${atividade.titulo}`;
    const assunto = assuntos.get(chave) ?? { disciplina: atividade.disciplina, titulo: atividade.titulo, acertos: 0, total: 0, respostas: 0 };
    assunto.acertos += atividade.acertos;
    assunto.total += atividade.total;
    assunto.respostas += 1;
    assuntos.set(chave, assunto);
  }

  const desempenho: DesempenhoDisciplina[] = [...disciplinas.entries()]
    .map(([disciplina, dados]) => ({
      disciplina,
      ...dados,
      percentual: dados.total > 0 ? Math.round((dados.acertos / dados.total) * 100) : 0,
    }))
    .sort((a, b) => b.percentual - a.percentual || a.disciplina.localeCompare(b.disciplina, "pt-BR"));
  const detalhes: Assunto[] = [...assuntos.values()]
    .filter((item) => item.total > 0)
    .map((item) => ({
      rotulo: filtros.disciplina === "Todas" ? `${item.disciplina}: ${item.titulo}` : item.titulo,
      percentual: Math.round((item.acertos / item.total) * 100),
      respostas: item.respostas,
    }));
  const total = desempenho.reduce((soma, item) => soma + item.total, 0);
  const acertos = desempenho.reduce((soma, item) => soma + item.acertos, 0);
  const ordenarMelhor = (a: Assunto, b: Assunto) => b.percentual - a.percentual || b.respostas - a.respostas || a.rotulo.localeCompare(b.rotulo, "pt-BR");

  return {
    atividades: filtradas,
    desempenho,
    mediaGeral: total > 0 ? Math.round((acertos / total) * 100) : null,
    facilidades: [...detalhes].sort(ordenarMelhor).slice(0, 3),
    dificuldades: [...detalhes].sort((a, b) => ordenarMelhor(b, a)).slice(0, 3),
  };
}
