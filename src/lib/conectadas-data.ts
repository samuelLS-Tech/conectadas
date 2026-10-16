export type Materia = {
  id: string;
  nome: string;
  emoji: string;
};

export const materias: Materia[] = [
  { id: "matematica", nome: "Matemática", emoji: "🔢" },
  { id: "fisica", nome: "Física", emoji: "⚛️" },
  { id: "quimica", nome: "Química", emoji: "🧪" },
  { id: "programacao", nome: "Programação", emoji: "💻" },
  { id: "engenharia", nome: "Engenharia", emoji: "📐" },
];

export type Monitora = {
  nome: string;
  materia: string;
  nota: number;
  xp: number;
  status: "Disponível agora" | "Disponível em 10 min";
  bio: string;
};

export const monitorasPorMateria: Record<string, Monitora[]> = {
  matematica: [
    {
      nome: "Beatriz",
      materia: "Matemática",
      nota: 4.8,
      xp: 1580,
      status: "Disponível agora",
      bio: "Funções, geometria analítica e revisão para vestibulares.",
    },
    {
      nome: "Sofia",
      materia: "Matemática",
      nota: 4.7,
      xp: 990,
      status: "Disponível em 10 min",
      bio: "Álgebra e resolução de problemas passo a passo.",
    },
    {
      nome: "Helena",
      materia: "Matemática",
      nota: 4.9,
      xp: 1310,
      status: "Disponível agora",
      bio: "Trigonometria e estatística aplicada.",
    },
  ],
  fisica: [
    {
      nome: "Lívia",
      materia: "Física",
      nota: 4.9,
      xp: 1240,
      status: "Disponível agora",
      bio: "Mecânica, cinemática e leis de Newton com simulações.",
    },
    {
      nome: "Camila",
      materia: "Física",
      nota: 4.7,
      xp: 1020,
      status: "Disponível agora",
      bio: "Eletricidade, circuitos e laboratório virtual.",
    },
    {
      nome: "Rafaela",
      materia: "Física",
      nota: 4.6,
      xp: 860,
      status: "Disponível em 10 min",
      bio: "Termodinâmica e óptica para o ensino técnico.",
    },
  ],
  quimica: [
    {
      nome: "Isadora",
      materia: "Química",
      nota: 4.8,
      xp: 1120,
      status: "Disponível agora",
      bio: "Estequiometria e química orgânica.",
    },
    {
      nome: "Manuela",
      materia: "Química",
      nota: 4.5,
      xp: 780,
      status: "Disponível em 10 min",
      bio: "Tabela periódica, ligações e reações.",
    },
    {
      nome: "Alice",
      materia: "Química",
      nota: 4.9,
      xp: 1440,
      status: "Disponível agora",
      bio: "Laboratório e relatórios científicos.",
    },
  ],
  programacao: [
    {
      nome: "Júlia",
      materia: "Programação",
      nota: 5.0,
      xp: 2120,
      status: "Disponível agora",
      bio: "Python, lógica de programação e primeiros algoritmos.",
    },
    {
      nome: "Nina",
      materia: "Programação",
      nota: 4.8,
      xp: 1650,
      status: "Disponível agora",
      bio: "Web, HTML/CSS e introdução a JavaScript.",
    },
    {
      nome: "Clara",
      materia: "Programação",
      nota: 4.6,
      xp: 940,
      status: "Disponível em 10 min",
      bio: "Robótica educacional e Arduino.",
    },
  ],
  engenharia: [
    {
      nome: "Maria",
      materia: "Engenharia",
      nota: 4.9,
      xp: 1980,
      status: "Disponível agora",
      bio: "Desenho técnico e prototipagem.",
    },
    {
      nome: "Laura",
      materia: "Engenharia",
      nota: 4.7,
      xp: 1180,
      status: "Disponível em 10 min",
      bio: "Automação e projetos de mecatrônica.",
    },
    {
      nome: "Vitória",
      materia: "Engenharia",
      nota: 4.8,
      xp: 1390,
      status: "Disponível agora",
      bio: "Materiais, estruturas e cálculo aplicado.",
    },
  ],
};

export const xpPorCategoria = [
  { nome: "Matemática", xp: 820, cor: "var(--neon)" },
  { nome: "Física", xp: 650, cor: "var(--cyan)" },
  { nome: "Programação", xp: 540, cor: "var(--mint)" },
  { nome: "Química", xp: 440, cor: "var(--magenta)" },
];

export const evolucaoMensal = [
  { mes: "Mar", xp: 320 },
  { mes: "Abr", xp: 640 },
  { mes: "Mai", xp: 980 },
  { mes: "Jun", xp: 1420 },
  { mes: "Jul", xp: 1810 },
  { mes: "Ago", xp: 2120 },
  { mes: "Set", xp: 2450 },
];

export const ranking = [
  { pos: "🥇", nome: "Ana", xp: 2450 },
  { pos: "🥈", nome: "Júlia", xp: 2120 },
  { pos: "🥉", nome: "Maria", xp: 1980 },
  { pos: "4º", nome: "Beatriz", xp: 1580 },
  { pos: "5º", nome: "Alice", xp: 1440 },
];

export type Medalha = {
  id: string;
  nome: string;
  emoji: string;
  desbloqueada: boolean;
  descricao: string;
  criterio: string;
};

export const medalhas: Medalha[] = [
  {
    id: "ada",
    nome: "Medalha Ada Lovelace",
    emoji: "🏅",
    desbloqueada: true,
    descricao: "Homenagem à primeira programadora da história.",
    criterio: "Concluir 10 desafios de lógica e programação na Biblioteca STEM.",
  },
  {
    id: "curie",
    nome: "Medalha Marie Curie",
    emoji: "⚛️",
    desbloqueada: true,
    descricao: "Reconhece dedicação em Física e Química.",
    criterio: "Acumular 1.000 XP somando as trilhas de Física e Química.",
  },
  {
    id: "franklin",
    nome: "Medalha Rosalind Franklin",
    emoji: "🧬",
    desbloqueada: true,
    descricao: "Homenagem à cientista cujas imagens revelaram a estrutura do DNA.",
    criterio: "Concluir 15 atividades de Química e Biologia na Biblioteca STEM.",
  },
  {
    id: "johnson",
    nome: "Medalha Katherine Johnson",
    emoji: "🚀",
    desbloqueada: false,
    descricao: "Homenagem à matemática da NASA que calculou trajetórias espaciais.",
    criterio: "Publicar 3 projetos de programação validados por um professor.",
  },
  {
    id: "jaqueline",
    nome: "Medalha Jaqueline Goes de Jesus",
    emoji: "🔬",
    desbloqueada: false,
    descricao: "Homenagem à cientista brasileira que sequenciou o genoma do coronavírus em 48 horas.",
    criterio: "Alcançar 5.000 XP e desbloquear todas as trilhas de habilidade.",
  },
];

export type Habilidade = {
  id: string;
  nome: string;
  categoria: string;
  x: number;
  y: number;
  desbloqueada: boolean;
  liga: string[];
};

export const arvoreHabilidades: Habilidade[] = [
  { id: "base", nome: "Base STEM", categoria: "Projetos", x: 50, y: 8, desbloqueada: true, liga: [] },
  { id: "mat1", nome: "Matemática", categoria: "Matemática", x: 16, y: 32, desbloqueada: true, liga: ["base"] },
  { id: "fis1", nome: "Física", categoria: "Física", x: 38, y: 32, desbloqueada: true, liga: ["base"] },
  { id: "qui1", nome: "Química", categoria: "Química", x: 62, y: 32, desbloqueada: true, liga: ["base"] },
  { id: "prog1", nome: "Programação", categoria: "Programação", x: 84, y: 32, desbloqueada: true, liga: ["base"] },
  { id: "mat2", nome: "Funções", categoria: "Matemática", x: 10, y: 60, desbloqueada: true, liga: ["mat1"] },
  { id: "fis2", nome: "Mecânica", categoria: "Física", x: 32, y: 60, desbloqueada: true, liga: ["fis1"] },
  { id: "qui2", nome: "Orgânica", categoria: "Química", x: 56, y: 60, desbloqueada: false, liga: ["qui1"] },
  { id: "prog2", nome: "Python", categoria: "Programação", x: 78, y: 60, desbloqueada: true, liga: ["prog1"] },
  { id: "lid1", nome: "Liderança", categoria: "Liderança", x: 24, y: 85, desbloqueada: true, liga: ["mat2", "fis2"] },
  { id: "proj1", nome: "Projetos", categoria: "Projetos", x: 50, y: 85, desbloqueada: false, liga: ["qui2", "prog2"] },
  { id: "mestre", nome: "Mestre STEM", categoria: "Projetos", x: 76, y: 85, desbloqueada: false, liga: ["prog2"] },
];

export type Material = {
  id: string;
  titulo: string;
  categoria: string;
  detalhe: string;
  xp: number;
  emoji: string;
  questoes: { pergunta: string; alternativas: string[]; correta: number }[];
};

export const biblioteca: Material[] = [
  {
    id: "funcoes",
    titulo: "Funções",
    categoria: "Matemática",
    detalhe: "",
    xp: 20,
    emoji: "🔢",
    questoes: [
      {
        pergunta: "Na função f(x) = 2x + 3, qual o valor de f(4)?",
        alternativas: ["8", "11", "14", "7"],
        correta: 1,
      },
      {
        pergunta: "Qual é o coeficiente angular da reta y = -5x + 2?",
        alternativas: ["2", "5", "-5", "-2"],
        correta: 2,
      },
      {
        pergunta: "Uma função do 2º grau tem gráfico em forma de:",
        alternativas: ["Reta", "Parábola", "Hipérbole", "Circunferência"],
        correta: 1,
      },
      {
        pergunta: "Qual é a raiz da função f(x) = 3x − 12?",
        alternativas: ["3", "4", "−4", "12"],
        correta: 1,
      },
      {
        pergunta: "Se f(x) = x², qual o valor de f(−3)?",
        alternativas: ["−9", "6", "9", "−6"],
        correta: 2,
      },
    ],
  },
  {
    id: "mecanica",
    titulo: "Mecânica",
    categoria: "Física",
    detalhe: "",
    xp: 20,
    emoji: "⚛️",
    questoes: [
      {
        pergunta: "A segunda lei de Newton é expressa por:",
        alternativas: ["F = m·a", "E = m·c²", "P = m·g·h", "v = d/t"],
        correta: 0,
      },
      {
        pergunta: "A unidade de força no SI é:",
        alternativas: ["Joule", "Watt", "Newton", "Pascal"],
        correta: 2,
      },
      {
        pergunta: "Um corpo em MRU possui aceleração:",
        alternativas: ["Constante e positiva", "Nula", "Variável", "Negativa"],
        correta: 1,
      },
      {
        pergunta: "Um carro percorre 120 km em 2 h. Sua velocidade média é:",
        alternativas: ["40 km/h", "60 km/h", "80 km/h", "240 km/h"],
        correta: 1,
      },
      {
        pergunta: "Qual o peso de um corpo de 5 kg na Terra (g = 10 m/s²)?",
        alternativas: ["5 N", "15 N", "50 N", "500 N"],
        correta: 2,
      },
    ],
  },
  {
    id: "python",
    titulo: "Python",
    categoria: "Programação",
    detalhe: "",
    xp: 20,
    emoji: "💻",
    questoes: [
      {
        pergunta: "Qual comando exibe um texto na tela em Python?",
        alternativas: ["echo()", "print()", "console.log()", "write()"],
        correta: 1,
      },
      {
        pergunta: "Qual estrutura repete um bloco de código?",
        alternativas: ["if", "def", "for", "import"],
        correta: 2,
      },
      {
        pergunta: "O tipo de dado de 3.14 em Python é:",
        alternativas: ["int", "float", "str", "bool"],
        correta: 1,
      },
      {
        pergunta: "Qual palavra-chave define uma função em Python?",
        alternativas: ["func", "def", "function", "lambda"],
        correta: 1,
      },
      {
        pergunta: "Qual o resultado de 7 // 2 em Python?",
        alternativas: ["3.5", "3", "4", "1"],
        correta: 1,
      },
    ],
  },
  {
    id: "estequiometria",
    titulo: "Estequiometria",
    categoria: "Química",
    detalhe: "",
    xp: 20,
    emoji: "🧪",
    questoes: [
      {
        pergunta: "O número de Avogadro vale aproximadamente:",
        alternativas: ["6,02 × 10²³", "3,14 × 10⁸", "9,8", "1,6 × 10⁻¹⁹"],
        correta: 0,
      },
      {
        pergunta: "A massa molar da água (H₂O) é cerca de:",
        alternativas: ["12 g/mol", "18 g/mol", "32 g/mol", "44 g/mol"],
        correta: 1,
      },
      {
        pergunta: "Balanceando H₂ + O₂ → H₂O, o coeficiente de H₂O é:",
        alternativas: ["1", "2", "3", "4"],
        correta: 1,
      },
      {
        pergunta: "Quantos mols há em 36 g de água (H₂O = 18 g/mol)?",
        alternativas: ["1 mol", "2 mol", "18 mol", "0,5 mol"],
        correta: 1,
      },
      {
        pergunta: "A massa molar do CO₂ (C = 12, O = 16) é:",
        alternativas: ["28 g/mol", "32 g/mol", "44 g/mol", "60 g/mol"],
        correta: 2,
      },
    ],
  },
  {
    id: "vestibular",
    titulo: "Vestibulares",
    categoria: "Vestibulares",
    detalhe: "ENEM · FUVEST · Unicamp",
    xp: 20,
    emoji: "🎓",
    questoes: [
      {
        pergunta:
          "(ENEM – 2023) O ideal é consumir 1 grama de carboidrato para cada minuto de caminhada. Um casal realizará diariamente 30 minutos de caminhada, ingerindo antes a quantidade ideal de carboidratos, apenas por meio de pão de fôrma integral, durante 30 dias ininterruptos. Cada pacote tem 18 fatias, e cada fatia tem 15 g de carboidratos. A quantidade mínima de pacotes necessários é",
        alternativas: ["1", "4", "6", "7", "8"],
        correta: 3,
      },
      {
        pergunta:
          "(FUVEST – 2024) Para gerar hidrogênio, raspas de zinco reagem com ácido clorídrico: Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g). Foram gerados 49,8 mL de hidrogênio. Dados: volume molar do gás nas condições do experimento = 24,9 L; massa molar do Zn = 65,4 g/mol. Qual a quantidade de Zn, em gramas, que de fato reagiu?",
        alternativas: ["0,07", "0,13", "0,26", "0,29", "0,48"],
        correta: 1,
      },
      {
        pergunta:
          "(FUVEST – 2024) Um estudante perguntou a um sistema de inteligência artificial se podem existir valores negativos de pH, e a IA respondeu que sim. A resposta fornecida pela IA está",
        alternativas: [
          "errada, pois pH negativo refere-se à concentração de H⁺ maior que 1 mol/L, resultando em pH menor que zero.",
          "correta, pois pH negativo refere-se à concentração de OH⁻ maior que 1 mol/L, resultando em pH menor que zero.",
          "correta, assim como é possível existir pH maior que 14 em soluções com concentração de H⁺ maior que 14 mol/L.",
          "errada, pois a escala de pH é fixa entre 0 e 14, independentemente da concentração de H⁺.",
          "correta, pois o pH tende a diminuir e tornar-se negativo em soluções com concentração de H⁺ extremamente baixa.",
        ],
        correta: 0,
      },
      {
        pergunta:
          "(Unicamp – 2024) Um objeto de massa m = 200 g é solto a partir de certa altura e atinge a velocidade terminal após determinado tempo. Qual é o módulo da força de resistência do ar depois que o objeto atinge a velocidade terminal? (g = 10 m/s²)",
        alternativas: ["0,20 N", "2,0 N", "200 N", "2000 N"],
        correta: 1,
      },
      {
        pergunta:
          "(Unicamp – 2024) João e Maria levaram uma sacola com 100 pedrinhas: 60 brancas e 40 pretas. Retiram aleatoriamente uma pedrinha por vez para marcar o caminho. Ao pararem para lanchar, já tinham sido jogadas 35 brancas e 25 pretas. Qual a probabilidade de as próximas duas pedrinhas jogadas serem brancas?",
        alternativas: ["7/13", "5/13", "11/52", "7/52"],
        correta: 1,
      },
    ],
  },
];

export const oportunidades = [
  {
    id: "aprendiz",
    emoji: "💻",
    titulo: "Jovem Aprendiz — Tecnologia",
    area: "Tecnologia",
    xpMinimo: 1000,
    habilidades: ["Lógica", "Programação"],
    empresa: "NovaTech",
  },
  {
    id: "robotica",
    emoji: "🤖",
    titulo: "Estágio — Robótica",
    area: "Engenharia",
    xpMinimo: 2000,
    habilidades: ["Física", "Programação"],
    empresa: "MecaLab",
  },
  {
    id: "iniciacao",
    emoji: "🔬",
    titulo: "Programa de Iniciação Científica",
    area: "Ciência",
    xpMinimo: 1500,
    habilidades: ["Ciências", "Projetos"],
    empresa: "Instituto Aurora",
  },
  {
    id: "dados",
    emoji: "📊",
    titulo: "Trainee — Dados e Estatística",
    area: "Matemática",
    xpMinimo: 500,
    habilidades: ["Matemática", "Análise"],
    empresa: "DataFuturo",
  },
];

export type Talento = {
  nome: string;
  nivel: number;
  titulo: string;
  xp: number;
  areas: string[];
  escola: string;
  monitorias: number;
  destaques: string[];
};

export const talentos: Talento[] = [
  { nome: "Ana Silva", nivel: 5, titulo: "Pesquisadora Sênior", xp: 2450, areas: ["Tecnologia", "Ciência", "Matemática"], escola: "ETEC Centro", monitorias: 37, destaques: ["37 monitorias validadas", "Projeto de Robótica 2026", "Medalha Ada Lovelace"] },
  { nome: "Júlia Moraes", nivel: 4, titulo: "Engenheira de Ideias", xp: 2120, areas: ["Tecnologia", "Engenharia"], escola: "Colégio Horizonte", monitorias: 29, destaques: ["Líder de equipe de robótica", "Top 3 em Programação", "Medalha Marie Curie"] },
  { nome: "Maria Duarte", nivel: 4, titulo: "Exploradora STEM", xp: 1980, areas: ["Engenharia", "Ciência"], escola: "IF Campus Norte", monitorias: 24, destaques: ["Protótipo de energia solar", "Monitora de Física", "Simulado FUVEST 100%"] },
  { nome: "Nina Prado", nivel: 3, titulo: "Dev Iniciante", xp: 1650, areas: ["Tecnologia"], escola: "ETEC Centro", monitorias: 15, destaques: ["App de estudos em Python", "10 desafios de código", "Hackathon escolar"] },
  { nome: "Beatriz Nunes", nivel: 3, titulo: "Analista Júnior", xp: 1580, areas: ["Matemática", "Ciência"], escola: "Escola Estadual Aurora", monitorias: 18, destaques: ["Olimpíada de Matemática", "Monitora de Estatística", "Simulado ENEM 90%"] },
  { nome: "Alice Rocha", nivel: 3, titulo: "Cientista em Formação", xp: 1440, areas: ["Ciência", "Matemática"], escola: "Colégio Horizonte", monitorias: 12, destaques: ["Iniciação científica júnior", "Feira de Ciências 2026", "Medalha Rosalind Franklin"] },
  { nome: "Larissa Campos", nivel: 2, titulo: "Aprendiz Curiosa", xp: 1120, areas: ["Tecnologia", "Matemática"], escola: "IF Campus Norte", monitorias: 8, destaques: ["Lógica de programação", "Monitora de Funções", "5 atividades seguidas"] },
  { nome: "Sofia Lima", nivel: 2, titulo: "Exploradora", xp: 760, areas: ["Matemática", "Engenharia"], escola: "Escola Estadual Aurora", monitorias: 5, destaques: ["Desafio de geometria", "Primeira monitoria", "Clube de Engenharia"] },
];

export const trajetoria = [
  {
    ano: "2026",
    titulo: "Projeto de Robótica",
    descricao: "Participação em projeto escolar de automação.",
    emoji: "🤖",
  },
  {
    ano: "2026",
    titulo: "Monitoria de Física",
    descricao: "37 estudantes auxiliadas.",
    emoji: "👩‍🏫",
  },
  {
    ano: "2026",
    titulo: "Desafio de Programação",
    descricao: "Desenvolvimento de solução utilizando Python.",
    emoji: "💻",
  },
  {
    ano: "2025",
    titulo: "Feira de Ciências",
    descricao: "Apresentação de experimento sobre energia limpa.",
    emoji: "🔬",
  },
];

export const estudantesEscola = [
  { nome: "Ana Silva", serie: "3º ano", turma: "A", atividade: "Monitoria de Física — 45 min", xp: 2450, pendente: true },
  { nome: "Júlia Moraes", serie: "3º ano", turma: "A", atividade: "Desafio Python — 10 exercícios", xp: 2120, pendente: true },
  { nome: "Maria Duarte", serie: "2º ano", turma: "B", atividade: "Projeto de automação", xp: 1980, pendente: true },
  { nome: "Beatriz Nunes", serie: "2º ano", turma: "A", atividade: "Monitoria de Matemática — 30 min", xp: 1580, pendente: false },
  { nome: "Alice Rocha", serie: "1º ano", turma: "A", atividade: "Relatório de laboratório", xp: 1440, pendente: true },
  { nome: "Nina Prado", serie: "1º ano", turma: "C", atividade: "Simulado de Vestibular", xp: 1650, pendente: false },
];

export const comoFunciona = [
  { n: 1, titulo: "Aprenda", texto: "Você pede ajuda ou utiliza a Biblioteca STEM.", emoji: "🧠" },
  { n: 2, titulo: "Ensine", texto: "Você compartilha seu conhecimento com outra estudante.", emoji: "👩‍🏫" },
  { n: 3, titulo: "Valide", texto: "A monitoria é confirmada através de QR Code ou token temporário.", emoji: "✅" },
  { n: 4, titulo: "Conquiste", texto: "Você recebe XP, medalhas e experiência.", emoji: "🏆" },
  { n: 5, titulo: "Conecte-se", texto: "Sua trajetória vira um portfólio digital.", emoji: "💜" },
  { n: 6, titulo: "Encontre oportunidades", texto: "Empresas podem encontrar talentos com base em potencial e experiências.", emoji: "🚀" },
];
