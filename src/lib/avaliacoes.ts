export const criteriosAcademicos = { comprometimento: 'Comprometimento', participacao: 'Participação', evolucao: 'Evolução no aprendizado', colaboracao: 'Colaboração', iniciativa: 'Iniciativa e autonomia' };
export const criteriosProfissionais = { responsabilidade: 'Responsabilidade', comprometimento: 'Comprometimento', equipe: 'Trabalho em equipe', comunicacao: 'Comunicação', proatividade: 'Proatividade', organizacao: 'Organização' };
export const tiposExperiencia: Record<string, string> = { estagio: 'Estágio', trabalho: 'Trabalho', projeto: 'Projeto profissional', outra: 'Outra atividade' };
export function mediaMonitorias(avaliacoes: { estrelas: number }[]) {
  return avaliacoes.length ? avaliacoes.reduce((s, a) => s + a.estrelas, 0) / avaliacoes.length : null;
}
export function criteriosMonitoria(papel: string) {
  return papel === 'monitora' ? ['Clareza das explicações', 'Domínio do conteúdo', 'Paciência e colaboração'] : ['Participação e interesse', 'Colaboração', 'Comprometimento'];
}