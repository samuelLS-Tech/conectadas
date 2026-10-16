export const SERIES = ["1º ano", "2º ano", "3º ano"] as const;
export const TURMAS = ["A", "B", "C", "D"] as const;

/** Cadastro padronizado de escolas: o banco guarda só o id. */
export const ESCOLAS = [
  { id: "ee-feceg", nome: "Escola Estadual Ciência Delas" },
  { id: "etec-centro", nome: "ETEC Centro" },
  { id: "if-campus", nome: "Instituto Federal — Campus Local" },
  { id: "colegio-futuro", nome: "Colégio Futuro" },
] as const;

export const DISCIPLINAS = ["Matemática", "Física", "Química", "Programação", "Engenharia"] as const;

export const nomeEscola = (id: string | null | undefined) => ESCOLAS.find((e) => e.id === id)?.nome ?? "Escola não informada";
