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
    id: "ciencia-delas",
    nome: "Ciência Delas",
    emoji: "🔬",
    desbloqueada: true,
    descricao: "Participação ativa na comunidade científica da escola.",
    criterio: "Apresentar um projeto em feira científica e registrar no portfólio.",
  },
  {
    id: "codigo",
    nome: "Código em Ação",
    emoji: "💻",
    desbloqueada: false,
    descricao: "Para quem transforma código em solução real.",
    criterio: "Publicar 3 projetos de programação validados por um professor.",
  },
  {
    id: "mestre",
    nome: "Mestre STEM",
    emoji: "👑",
    desbloqueada: false,
    descricao: "O nível mais alto da trajetória CONECTADAS.",
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
    titulo: "Funções — Revisão rápida",
    categoria: "Matemática",
    detalhe: "15 exercícios",
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
    ],
  },
  {
    id: "mecanica",
    titulo: "Mecânica — Simulado",
    categoria: "Física",
    detalhe: "20 questões",
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
    ],
  },
  {
    id: "python",
    titulo: "Python — Primeiros passos",
    categoria: "Programação",
    detalhe: "10 desafios",
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
    ],
  },
  {
    id: "estequiometria",
    titulo: "Estequiometria — Prática guiada",
    categoria: "Química",
    detalhe: "12 exercícios",
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
    ],
  },
  {
    id: "vestibular",
    titulo: "Vestibulares — Simulado STEM",
    categoria: "Vestibulares",
    detalhe: "25 questões",
    xp: 20,
    emoji: "🎓",
    questoes: [
      {
        pergunta: "Efeito Matilda descreve:",
        alternativas: [
          "Um fenômeno da física quântica",
          "O apagamento das contribuições de mulheres na ciência",
          "Um teorema matemático",
          "Uma reação química",
        ],
        correta: 1,
      },
      {
        pergunta: "Marie Curie recebeu o Nobel em quais áreas?",
        alternativas: ["Física e Química", "Medicina e Paz", "Química e Literatura", "Apenas Física"],
        correta: 0,
      },
      {
        pergunta: "Ada Lovelace é reconhecida por:",
        alternativas: [
          "Descobrir o rádio",
          "Criar o primeiro algoritmo para máquina",
          "Formular a relatividade",
          "Inventar o telescópio",
        ],
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

export const talentos = [
  { nome: "Ana Silva", nivel: 5, titulo: "Pesquisadora Sênior", xp: 2450, areas: ["Tecnologia", "Ciência", "Matemática"] },
  { nome: "Júlia Moraes", nivel: 4, titulo: "Engenheira de Ideias", xp: 2120, areas: ["Tecnologia", "Engenharia"] },
  { nome: "Maria Duarte", nivel: 4, titulo: "Exploradora STEM", xp: 1980, areas: ["Engenharia", "Ciência"] },
  { nome: "Beatriz Nunes", nivel: 3, titulo: "Analista Júnior", xp: 1580, areas: ["Matemática", "Ciência"] },
  { nome: "Alice Rocha", nivel: 3, titulo: "Cientista em Formação", xp: 1440, areas: ["Ciência", "Matemática"] },
  { nome: "Nina Prado", nivel: 3, titulo: "Dev Iniciante", xp: 1650, areas: ["Tecnologia"] },
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
    titulo: "Feira Ciência Delas",
    descricao: "Apresentação de experimento sobre energia limpa.",
    emoji: "🔬",
  },
];

export const estudantesEscola = [
  { nome: "Ana Silva", turma: "3º Técnico", atividade: "Monitoria de Física — 45 min", xp: 2450, pendente: true },
  { nome: "Júlia Moraes", turma: "3º Técnico", atividade: "Desafio Python — 10 exercícios", xp: 2120, pendente: true },
  { nome: "Maria Duarte", turma: "2º Ano", atividade: "Projeto de automação", xp: 1980, pendente: true },
  { nome: "Beatriz Nunes", turma: "2º Ano", atividade: "Monitoria de Matemática — 30 min", xp: 1580, pendente: false },
  { nome: "Alice Rocha", turma: "1º Ano", atividade: "Relatório de laboratório", xp: 1440, pendente: true },
  { nome: "Nina Prado", turma: "1º Ano", atividade: "Simulado de Vestibular", xp: 1650, pendente: false },
];

export const comoFunciona = [
  { n: 1, titulo: "Aprenda", texto: "Você pede ajuda ou utiliza a Biblioteca STEM.", emoji: "🧠" },
  { n: 2, titulo: "Ensine", texto: "Você compartilha seu conhecimento com outra estudante.", emoji: "👩‍🏫" },
  { n: 3, titulo: "Valide", texto: "A monitoria é confirmada através de QR Code ou token temporário.", emoji: "✅" },
  { n: 4, titulo: "Conquiste", texto: "Você recebe XP, medalhas e experiência.", emoji: "🏆" },
  { n: 5, titulo: "Conecte-se", texto: "Sua trajetória vira um portfólio digital.", emoji: "💜" },
  { n: 6, titulo: "Encontre oportunidades", texto: "Empresas podem encontrar talentos com base em potencial e experiências.", emoji: "🚀" },
];
