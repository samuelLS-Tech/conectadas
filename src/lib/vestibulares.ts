import type { Material } from "@/lib/conectadas-data";

type Q = { pergunta: string; alternativas: string[]; correta: number; oficial?: boolean };
type T = [string, string[], number];

export type Vestibular = { id: string; nome: string; questoes: Q[] };

const q = (lista: T[]): Q[] => lista.map(([pergunta, alternativas, correta]) => ({ pergunta, alternativas, correta }));
const of = (pergunta: string, alternativas: string[], correta: number): Q => ({ pergunta, alternativas, correta, oficial: true });

// Questões oficiais são citadas com instituição e ano; as demais são autorais, no estilo de cada exame.
export const vestibulares: Vestibular[] = [
  {
    id: "enem",
    nome: "ENEM",
    questoes: [
      of("(ENEM – 2023) O ideal é consumir 1 grama de carboidrato para cada minuto de caminhada. Um casal realizará diariamente 30 minutos de caminhada, ingerindo antes a quantidade ideal de carboidratos, apenas por meio de pão de fôrma integral, durante 30 dias ininterruptos. Cada pacote tem 18 fatias, e cada fatia tem 15 g de carboidratos. A quantidade mínima de pacotes necessários é", ["1", "4", "6", "7", "8"], 3),
      ...q([
        ["Uma conta de luz subiu de R$ 120 para R$ 150. O aumento percentual foi de", ["20%", "25%", "30%", "35%", "50%"], 1],
        ["Um mapa usa escala 1:50 000. Uma distância de 4 cm no mapa corresponde, na realidade, a", ["200 m", "2 km", "20 km", "500 m", "5 km"], 1],
        ["Uma torneira pinga 2 mL por minuto. Em um dia, o desperdício aproximado é de", ["0,48 L", "1,44 L", "2,88 L", "14,4 L", "28,8 L"], 2],
        ["A média de cinco notas é 7. Se quatro delas somam 27, a quinta nota é", ["6", "7", "8", "9", "10"], 2],
        ["Um carro percorre 300 km com 25 L de combustível. O consumo médio é de", ["10 km/L", "12 km/L", "15 km/L", "8 km/L", "7,5 km/L"], 1],
        ["Um chuveiro de 5 000 W ligado 30 minutos por dia consome, em 30 dias,", ["75 kWh", "150 kWh", "15 kWh", "750 kWh", "7,5 kWh"], 0],
        ["Painéis solares convertem principalmente energia", ["térmica em química", "luminosa em elétrica", "elétrica em luminosa", "química em elétrica", "nuclear em elétrica"], 1],
        ["O principal gás associado à intensificação do efeito estufa por queima de combustíveis fósseis é", ["O₂", "N₂", "CO₂", "He", "Ar"], 2],
        ["Ao adicionar sal à água, sua temperatura de ebulição", ["diminui", "aumenta", "não muda", "vai a 0 °C", "depende só da panela"], 1],
        ["A reciclagem de alumínio é vantajosa principalmente porque", ["aumenta a extração de bauxita", "economiza muita energia", "produz metal mais pesado", "elimina a coleta seletiva", "torna o metal radioativo"], 1],
        ["Uma rampa sobe 1 m a cada 12 m horizontais. Sua inclinação percentual é cerca de", ["1,2%", "8,3%", "12%", "83%", "10%"], 1],
        ["Num gráfico, a produção foi 200, 250 e 300 toneladas em três anos seguidos. O crescimento anual é", ["constante de 50 t", "constante de 25%", "decrescente", "exponencial", "nulo"], 0],
        ["Lâmpadas LED são mais eficientes que incandescentes porque", ["dissipam mais calor", "convertem mais energia em luz", "usam mais potência", "funcionam sem corrente", "emitem só infravermelho"], 1],
        ["Um terreno retangular de 20 m por 15 m tem área de", ["35 m²", "70 m²", "300 m²", "150 m²", "3 000 m²"], 2],
        ["Uma receita para 4 pessoas usa 300 g de farinha. Para 10 pessoas, usa-se", ["600 g", "750 g", "900 g", "1 000 g", "1 200 g"], 1],
        ["Vacinas protegem porque", ["matam todos os vírus do ambiente", "estimulam a produção de memória imunológica", "substituem o sangue", "são antibióticos", "impedem a respiração do vírus"], 1],
        ["Em um sorteio com 40 bilhetes, quem compra 6 tem probabilidade de ganhar igual a", ["6%", "12%", "15%", "20%", "40%"], 2],
        ["Uma caixa-d'água cúbica de 2 m de aresta comporta", ["4 000 L", "6 000 L", "8 000 L", "2 000 L", "800 L"], 2],
        ["O pH de uma solução ácida é", ["maior que 7", "igual a 7", "menor que 7", "sempre 14", "negativo sempre"], 2],
      ]),
    ],
  },
  {
    id: "fuvest",
    nome: "FUVEST",
    questoes: [
      of("(FUVEST – 2024) Para gerar hidrogênio, raspas de zinco reagem com ácido clorídrico: Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g). Foram gerados 49,8 mL de hidrogênio. Dados: volume molar do gás nas condições do experimento = 24,9 L; massa molar do Zn = 65,4 g/mol. Qual a quantidade de Zn, em gramas, que de fato reagiu?", ["0,07", "0,13", "0,26", "0,29", "0,48"], 1),
      of("(FUVEST – 2024) Um estudante perguntou a um sistema de inteligência artificial se podem existir valores negativos de pH, e a IA respondeu que sim. A resposta fornecida pela IA está", ["errada, pois pH negativo refere-se à concentração de H⁺ maior que 1 mol/L, resultando em pH menor que zero.", "correta, pois pH negativo refere-se à concentração de OH⁻ maior que 1 mol/L, resultando em pH menor que zero.", "correta, assim como é possível existir pH maior que 14 em soluções com concentração de H⁺ maior que 14 mol/L.", "errada, pois a escala de pH é fixa entre 0 e 14, independentemente da concentração de H⁺.", "correta, pois o pH tende a diminuir e tornar-se negativo em soluções com concentração de H⁺ extremamente baixa."], 0),
      ...q([
        ["Se log₂ x = 5, então x vale", ["10", "25", "32", "64", "7"], 2],
        ["A soma dos ângulos internos de um hexágono convexo é", ["540°", "720°", "900°", "360°", "1 080°"], 1],
        ["As raízes de x² − 5x + 6 = 0 são", ["1 e 6", "2 e 3", "−2 e −3", "−1 e 6", "3 e 5"], 1],
        ["Um corpo de 2 kg sob força resultante de 10 N tem aceleração de", ["2 m/s²", "5 m/s²", "10 m/s²", "20 m/s²", "0,2 m/s²"], 1],
        ["A energia cinética de 4 kg a 3 m/s é", ["6 J", "12 J", "18 J", "36 J", "24 J"], 2],
        ["Em uma PA, a₁ = 3 e r = 4. O 10º termo é", ["39", "40", "43", "36", "37"], 0],
        ["O número de anagramas da palavra AMOR é", ["12", "16", "24", "4", "8"], 2],
        ["A ligação entre Na e Cl no sal de cozinha é", ["covalente apolar", "iônica", "metálica", "de hidrogênio", "covalente dativa"], 1],
        ["Quantos mols há em 88 g de CO₂ (44 g/mol)?", ["0,5", "1", "2", "4", "44"], 2],
        ["Um resistor de 10 Ω sob 20 V é percorrido por", ["0,5 A", "2 A", "10 A", "200 A", "30 A"], 1],
        ["Uma onda de frequência 50 Hz e comprimento 2 m tem velocidade de", ["25 m/s", "52 m/s", "100 m/s", "48 m/s", "200 m/s"], 2],
        ["sen 30° vale", ["1/2", "√2/2", "√3/2", "1", "0"], 0],
        ["Uma função f(x) = 3x − 2 tem raiz em", ["x = 2/3", "x = −2/3", "x = 3/2", "x = 2", "x = −2"], 0],
        ["A distância entre (0,0) e (6,8) é", ["10", "14", "12", "7", "48"], 0],
        ["Isótopos são átomos com mesmo número de", ["nêutrons", "massa", "prótons", "elétrons de valência apenas", "camadas"], 2],
        ["Num gás ideal a volume constante, dobrar a temperatura absoluta faz a pressão", ["cair pela metade", "dobrar", "quadruplicar", "não mudar", "zerar"], 1],
        ["A probabilidade de obter duas caras em dois lançamentos de moeda é", ["1/2", "1/3", "1/4", "1/8", "3/4"], 2],
        ["O volume de um cilindro de raio 2 e altura 5 é", ["10π", "20π", "25π", "40π", "4π"], 1],
      ]),
    ],
  },
  {
    id: "unicamp",
    nome: "UNICAMP",
    questoes: [
      of("(Unicamp – 2024) Um objeto de massa m = 200 g é solto a partir de certa altura e atinge a velocidade terminal após determinado tempo. Qual é o módulo da força de resistência do ar depois que o objeto atinge a velocidade terminal? (g = 10 m/s²)", ["0,20 N", "2,0 N", "200 N", "2000 N"], 1),
      of("(Unicamp – 2024) João e Maria levaram uma sacola com 100 pedrinhas: 60 brancas e 40 pretas. Retiram aleatoriamente uma pedrinha por vez para marcar o caminho. Ao pararem para lanchar, já tinham sido jogadas 35 brancas e 25 pretas. Qual a probabilidade de as próximas duas pedrinhas jogadas serem brancas?", ["7/13", "5/13", "11/52", "7/52"], 1),
      ...q([
        ["Um app de mobilidade cobra R$ 5 fixos mais R$ 2 por km. Uma corrida de 8 km custa", ["R$ 16", "R$ 21", "R$ 26", "R$ 13", "R$ 40"], 1],
        ["Um satélite em órbita circular está sujeito a uma força resultante", ["nula", "tangente à órbita", "apontada para o centro da Terra", "para fora da órbita", "vertical para cima"], 2],
        ["A fotossíntese consome principalmente", ["O₂ e glicose", "CO₂ e água", "N₂ e água", "CO e O₂", "metano"], 1],
        ["Uma população de bactérias dobra a cada hora. Partindo de 100, após 5 horas haverá", ["500", "1 000", "3 200", "1 600", "6 400"], 2],
        ["Um sinal de wi-fi é uma onda", ["mecânica longitudinal", "eletromagnética", "sonora", "sísmica", "de pressão"], 1],
        ["A mediana de 3, 9, 4, 7, 5 é", ["4", "5", "7", "5,6", "9"], 1],
        ["Um bloco desce plano sem atrito de 5 m de altura (g = 10 m/s²). Sua velocidade final é", ["5 m/s", "10 m/s", "50 m/s", "25 m/s", "√5 m/s"], 1],
        ["Em 500 mL de solução há 20 g de soluto. A concentração é", ["10 g/L", "20 g/L", "40 g/L", "4 g/L", "100 g/L"], 2],
        ["Um círculo de raio 3 cm tem área (π ≈ 3,14) de cerca de", ["9,4 cm²", "18,8 cm²", "28,3 cm²", "56,5 cm²", "3,1 cm²"], 2],
        ["Uma lente convergente pode formar imagem", ["somente virtual", "real e invertida", "sempre do mesmo tamanho", "nunca nítida", "apenas em espelhos"], 1],
        ["Combustão completa do metano produz", ["CO e H₂", "CO₂ e H₂O", "C e H₂O", "O₂ e H₂", "CH₃OH"], 1],
        ["Se 3 impressoras imprimem 600 páginas em 2 h, 6 impressoras iguais imprimem em 2 h", ["600", "900", "1 200", "1 800", "300"], 2],
        ["A unidade de potência no SI é", ["joule", "newton", "watt", "pascal", "volt"], 2],
        ["Um sistema x + y = 10 e x − y = 2 tem x igual a", ["4", "5", "6", "8", "2"], 2],
        ["O DNA é formado por unidades chamadas", ["aminoácidos", "nucleotídeos", "lipídios", "glicoses", "íons"], 1],
        ["Um desconto de 10% seguido de outro de 10% equivale a", ["20%", "19%", "21%", "10%", "18%"], 1],
        ["Ao aquecer um gás a pressão constante, seu volume", ["diminui", "aumenta", "não muda", "zera", "fica negativo"], 1],
        ["A velocidade média de quem percorre 120 km em 1,5 h é", ["60 km/h", "80 km/h", "90 km/h", "180 km/h", "100 km/h"], 1],
      ]),
    ],
  },
  {
    id: "fatec",
    nome: "FATEC",
    questoes: q([
      ["Em binário, o número decimal 10 é escrito como", ["1010", "1100", "1001", "0110", "1110"], 0],
      ["1 kB corresponde, no sistema decimal, a", ["100 bytes", "1 000 bytes", "10 000 bytes", "1 bit", "8 bytes"], 1],
      ["Uma peça custa R$ 80 e é vendida com lucro de 25%. O preço de venda é", ["R$ 90", "R$ 100", "R$ 105", "R$ 120", "R$ 85"], 1],
      ["Num circuito em série com resistores de 4 Ω e 6 Ω, a resistência equivalente é", ["2,4 Ω", "10 Ω", "24 Ω", "5 Ω", "1,5 Ω"], 1],
      ["Uma máquina produz 45 peças por hora. Em 8 horas produz", ["320", "360", "400", "450", "540"], 1],
      ["A estrutura que repete instruções enquanto uma condição é verdadeira é", ["if", "while", "print", "return", "import"], 1],
      ["A densidade de 200 g de material ocupando 50 cm³ é", ["2 g/cm³", "4 g/cm³", "10 g/cm³", "250 g/cm³", "0,25 g/cm³"], 1],
      ["Uma polia transmite movimento por meio de", ["correia", "imã", "solda", "lente", "pistão hidráulico apenas"], 0],
      ["Converter 72 km/h em m/s resulta em", ["7,2", "20", "36", "259", "12"], 1],
      ["O operador lógico E (AND) é verdadeiro quando", ["uma entrada é verdadeira", "as duas entradas são verdadeiras", "as duas são falsas", "sempre", "nunca"], 1],
      ["Uma escala de 1:100 em planta: 5 cm representam", ["5 m", "50 cm", "50 m", "500 m", "0,5 m"], 0],
      ["A potência de um aparelho de 220 V e 5 A é", ["44 W", "225 W", "1 100 W", "2 200 W", "110 W"], 2],
      ["Qual material é melhor condutor elétrico?", ["borracha", "vidro", "cobre", "madeira seca", "plástico"], 2],
      ["Em uma planilha, a fórmula que soma A1 a A5 é", ["=SOMA(A1:A5)", "=A1-A5", "=MÉDIA(A1)", "=CONT(A5)", "=A1*A5"], 0],
      ["A área de um triângulo de base 10 e altura 6 é", ["16", "30", "60", "36", "20"], 1],
      ["Ferrugem é resultado da", ["oxidação do ferro", "fusão do ferro", "evaporação do ferro", "neutralização", "sublimação"], 0],
      ["Um algoritmo é", ["um componente físico", "uma sequência finita de passos", "um tipo de cabo", "um vírus", "uma linguagem única"], 1],
      ["Se 15% de um lote de 400 peças tem defeito, as defeituosas são", ["15", "40", "60", "75", "85"], 2],
      ["A alavanca em que o apoio fica entre força e resistência é", ["interfixa", "inter-resistente", "interpotente", "roldana", "plano inclinado"], 0],
      ["Um tanque enche 3 000 L a 50 L/min em", ["30 min", "60 min", "90 min", "150 min", "6 min"], 1],
    ]),
  },
  {
    id: "unesp",
    nome: "UNESP",
    questoes: q([
      ["O valor de 2³ × 2² é", ["2⁵", "2⁶", "4⁵", "2¹", "6⁵"], 0],
      ["Uma reação exotérmica", ["absorve calor", "libera calor", "não troca calor", "só ocorre no gelo", "não tem produtos"], 1],
      ["Um objeto em queda livre por 3 s (g = 10 m/s²) atinge velocidade de", ["10 m/s", "30 m/s", "45 m/s", "90 m/s", "3 m/s"], 1],
      ["O 5º termo da PG 2, 6, 18, ... é", ["54", "162", "486", "108", "72"], 1],
      ["A molécula de água tem geometria", ["linear", "angular", "tetraédrica plana", "trigonal plana", "octaédrica"], 1],
      ["Num triângulo retângulo de catetos 5 e 12, a hipotenusa é", ["13", "17", "15", "11", "60"], 0],
      ["Ondas sonoras não se propagam no", ["ar", "água", "vácuo", "aço", "madeira"], 2],
      ["Uma solução com pH 3 comparada a outra com pH 5 é", ["10 vezes mais ácida", "100 vezes mais ácida", "2 vezes mais ácida", "menos ácida", "neutra"], 1],
      ["Em 120 alunos, 30% praticam esporte. São", ["30", "36", "40", "90", "12"], 1],
      ["O trabalho de uma força de 20 N deslocando 3 m na mesma direção é", ["23 J", "60 J", "6,7 J", "17 J", "600 J"], 1],
      ["Na tabela periódica, os gases nobres ficam no grupo", ["1", "2", "17", "18", "14"], 3],
      ["cos 60° vale", ["1/2", "√3/2", "√2/2", "0", "1"], 0],
      ["Em um espelho plano, a imagem é", ["real e invertida", "virtual e do mesmo tamanho", "maior", "menor", "real e direita"], 1],
      ["A função f(x) = x² tem vértice em", ["(0,0)", "(1,1)", "(0,1)", "(−1,1)", "(1,0)"], 0],
      ["O processo de separar areia de água é", ["destilação", "filtração", "sublimação", "fusão", "eletrólise"], 1],
      ["Uma combinação de 5 elementos tomados 2 a 2 resulta em", ["10", "20", "25", "5", "15"], 0],
      ["A força peso de um corpo de 50 kg (g = 10 m/s²) é", ["50 N", "500 N", "5 N", "5 000 N", "60 N"], 1],
      ["O número de oxidação do oxigênio na maioria dos compostos é", ["+2", "−2", "0", "−1", "+1"], 1],
      ["Se f(x) = 2x + 1, f(f(1)) vale", ["3", "5", "7", "9", "4"], 2],
      ["Calor se propaga no vácuo por", ["condução", "convecção", "irradiação", "atrito", "compressão"], 2],
    ]),
  },
  {
    id: "uerj",
    nome: "UERJ",
    questoes: q([
      ["Um celular custa R$ 1 200 à vista ou 12 × R$ 110. O acréscimo no parcelado é de", ["R$ 100", "R$ 120", "R$ 132", "R$ 1 320", "R$ 10"], 1],
      ["A razão entre 45 minutos e 1 hora é", ["3/4", "4/5", "1/2", "4/3", "2/3"], 0],
      ["Um ímã atrai fortemente", ["alumínio", "ferro", "cobre", "vidro", "ouro"], 1],
      ["Mudança do estado sólido diretamente para gasoso é", ["fusão", "sublimação", "condensação", "solidificação", "vaporização"], 1],
      ["A soma dos 10 primeiros números naturais positivos é", ["45", "50", "55", "100", "110"], 2],
      ["Um carro freia de 20 m/s até parar em 4 s. A desaceleração média é", ["4 m/s²", "5 m/s²", "80 m/s²", "16 m/s²", "2 m/s²"], 1],
      ["Ácido + base produzem, em geral,", ["sal e água", "gás nobre", "metal puro", "apenas água", "óxido e hidrogênio"], 0],
      ["Um quadrado de perímetro 36 cm tem área de", ["36 cm²", "72 cm²", "81 cm²", "144 cm²", "9 cm²"], 2],
      ["A energia potencial gravitacional de 3 kg a 10 m de altura (g = 10) é", ["30 J", "300 J", "130 J", "3 000 J", "13 J"], 1],
      ["O elemento de símbolo K é o", ["criptônio", "cálcio", "potássio", "carbono", "cobalto"], 2],
      ["Se 2x − 7 = 11, então x é", ["2", "7", "9", "18", "4"], 2],
      ["Para dobrar a corrente em um resistor fixo, deve-se", ["dobrar a tensão", "reduzir a tensão à metade", "manter a tensão", "quadruplicar a resistência", "retirar o resistor"], 0],
      ["A moda de 2, 4, 4, 5, 7, 4, 2 é", ["2", "4", "5", "7", "4,5"], 1],
      ["Em 2 L de solução 0,5 mol/L há", ["0,25 mol", "1 mol", "2 mol", "4 mol", "0,5 mol"], 1],
      ["Uma escada de 5 m encostada a 3 m da parede alcança altura de", ["2 m", "4 m", "6 m", "8 m", "3,5 m"], 1],
      ["O arco-íris resulta principalmente da", ["reflexão total no espelho", "dispersão da luz", "difração do som", "interferência magnética", "polarização da água"], 1],
      ["log 1 000 (base 10) vale", ["2", "3", "10", "100", "30"], 1],
      ["O gás mais abundante na atmosfera é", ["O₂", "CO₂", "N₂", "Ar", "H₂"], 2],
      ["Quantos números de dois algarismos distintos podem ser formados com 1, 2, 3 e 4?", ["8", "12", "16", "6", "24"], 1],
      ["Um movimento uniforme tem", ["aceleração constante não nula", "velocidade constante", "velocidade crescente", "força resultante crescente", "trajetória sempre circular"], 1],
    ]),
  },
  {
    id: "ita",
    nome: "ITA",
    questoes: q([
      ["O número complexo i² vale", ["1", "−1", "i", "−i", "0"], 1],
      ["A derivada de f(x) = x³ é", ["x²", "3x²", "3x", "x⁴/4", "3"], 1],
      ["O determinante da matriz [[2, 3], [1, 4]] é", ["5", "8", "11", "−5", "14"], 0],
      ["Um projétil lançado a 45° tem alcance máximo, sem resistência do ar, porque", ["sen 90° = 1", "cos 0° = 0", "tg 45° = 0", "o tempo de voo é nulo", "a gravidade some"], 0],
      ["A quantidade de movimento de 2 kg a 6 m/s é", ["3 kg·m/s", "8 kg·m/s", "12 kg·m/s", "36 kg·m/s", "4 kg·m/s"], 2],
      ["A soma das raízes de 2x² − 8x + 3 = 0 é", ["−4", "4", "3/2", "8", "−8"], 1],
      ["Num capacitor, a capacitância é a razão entre", ["carga e tensão", "tensão e carga", "corrente e tempo", "potência e carga", "resistência e tensão"], 0],
      ["O limite de (sen x)/x quando x → 0 é", ["0", "1", "∞", "−1", "não existe"], 1],
      ["A hibridização do carbono no metano é", ["sp", "sp²", "sp³", "sp³d", "d²sp³"], 2],
      ["|3 + 4i| vale", ["5", "7", "1", "25", "√7"], 0],
      ["Um pêndulo simples tem período que depende do", ["comprimento e gravidade", "massa apenas", "material do fio apenas", "ângulo grande apenas", "volume da massa"], 0],
      ["log₃ 81 vale", ["3", "4", "9", "27", "2"], 1],
      ["Em uma colisão perfeitamente elástica conserva-se", ["só a massa", "momento e energia cinética", "só a energia térmica", "apenas a velocidade", "nada"], 1],
      ["A integral de 2x dx é", ["x² + C", "2 + C", "x + C", "2x² + C", "x³ + C"], 0],
      ["A configuração eletrônica do neônio (Z = 10) termina em", ["2s²", "2p⁶", "3s¹", "2p⁴", "1s²"], 1],
      ["O número de diagonais de um octógono é", ["16", "20", "24", "28", "8"], 1],
      ["A primeira lei da termodinâmica expressa a conservação da", ["massa", "energia", "carga", "entropia", "pressão"], 1],
      ["Se a matriz A é 2×3 e B é 3×4, o produto AB é", ["2×4", "3×3", "4×2", "não existe", "2×3"], 0],
      ["Uma carga em movimento dentro de campo magnético sofre força", ["paralela à velocidade", "perpendicular à velocidade", "sempre nula", "igual ao peso", "na direção do campo"], 1],
      ["A equação x² + y² = 25 representa", ["reta", "parábola", "circunferência de raio 5", "elipse de eixo 25", "hipérbole"], 2],
    ]),
  },
];

export const RODADA = 5;
export const RODADAS = 4;

/** Rodada (0–3) vira uma atividade de 5 questões; o XP é dado uma única vez por rodada. */
export function rodadaMaterial(v: Vestibular, rodada: number): Material {
  return {
    id: `vest-${v.id}-r${rodada + 1}`,
    titulo: `${v.nome} · Rodada ${rodada + 1}/${RODADAS}`,
    categoria: "Vestibulares",
    detalhe: "",
    xp: 20,
    emoji: "🎓",
    questoes: v.questoes.slice(rodada * RODADA, rodada * RODADA + RODADA),
  };
}

export type ProgressoVest = { ciclo: number; rodada: number };
const chave = (uid: string, id: string) => `conectadas-vest-${uid}-${id}`;

export function lerProgresso(uid: string, id: string): ProgressoVest {
  try {
    const p = JSON.parse(localStorage.getItem(chave(uid, id)) ?? "");
    if (typeof p.ciclo === "number" && typeof p.rodada === "number") return p;
  } catch {}
  return { ciclo: 1, rodada: 0 };
}

export function avancar(p: ProgressoVest): ProgressoVest {
  return p.rodada + 1 >= RODADAS ? { ciclo: p.ciclo + 1, rodada: 0 } : { ciclo: p.ciclo, rodada: p.rodada + 1 };
}

export function salvarProgresso(uid: string, id: string, p: ProgressoVest) {
  localStorage.setItem(chave(uid, id), JSON.stringify(p));
}
