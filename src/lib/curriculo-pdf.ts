import { jsPDF } from "jspdf";

type Dados = {
  nome: string;
  email: string | null;
  serie: string | null;
  turma: string | null;
  nivel: number;
  xp: number;
  monitorias: number;
  exercicios: number;
  horas: number;
  lideranca: number;
  habilidades: string[];
  medalhas: string[];
};

type Cor = [number, number, number];

const NAVY: Cor = [7, 11, 36];
const ROXO: Cor = [89, 31, 214];
const MAGENTA: Cor = [192, 38, 255];
const CIANO: Cor = [13, 202, 215];
const CINZA: Cor = [64, 77, 112];
const FUNDO_CARD: Cor = [246, 245, 253];
const LIMITE_CONTEUDO = 257;

function limitarTexto(doc: jsPDF, texto: string, largura: number) {
  if (doc.getTextWidth(texto) <= largura) return texto;
  const sufixo = "...";
  let fim = texto.length;
  while (fim > 0 && doc.getTextWidth(`${texto.slice(0, fim).trimEnd()}${sufixo}`) > largura) fim -= 1;
  return `${texto.slice(0, fim).trimEnd()}${sufixo}`;
}

function marca(doc: jsPDF) {
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setCharSpace(1.2);
  doc.text("CONECTADAS", 11, 17);
  doc.setCharSpace(0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(211, 214, 230);
  doc.text("CONECTANDO MENINAS AO CONHECIMENTO,", 11, 22);
  doc.setTextColor(...CIANO);
  doc.text("AO FUTURO E A OPORTUNIDADES REAIS.", 11, 26);
  doc.setDrawColor(...CIANO);
  doc.setLineWidth(0.4);
  doc.line(145, 12, 145, 29);
  doc.circle(155, 20, 4);
  doc.line(151, 20, 159, 20);
  doc.line(155, 16, 155, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CURRÍCULO DIGITAL", 164, 22);
}

function circuitos(doc: jsPDF) {
  doc.setLineWidth(0.25);
  doc.setDrawColor(...ROXO);
  const pontos = [
    [0, 10, 12, 10, 18, 4],
    [0, 17, 9, 17, 15, 23],
    [210, 6, 199, 6, 193, 12],
    [210, 73, 201, 73, 195, 67],
  ];
  for (const [x1, y1, x2, y2, x3, y3] of pontos) {
    doc.line(x1!, y1!, x2!, y2!);
    doc.line(x2!, y2!, x3!, y3!);
    doc.setFillColor(...CIANO);
    doc.circle(x2!, y2!, 0.8, "F");
  }
}

function avatar(doc: jsPDF, inicial: string) {
  doc.setFillColor(...MAGENTA);
  doc.circle(28, 52, 16, "F");
  doc.setFillColor(...CIANO);
  doc.circle(29, 51, 14.5, "F");
  doc.setFillColor(126, 102, 244);
  doc.circle(28.2, 51.5, 13.2, "F");
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(inicial, 28.2, 58.5, { align: "center" });
}

function secao(doc: jsPDF, titulo: string, x: number, y: number, largura: number) {
  doc.setTextColor(...ROXO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(titulo.toUpperCase(), x, y);
  const inicio = x + Math.min(largura - 8, doc.getTextWidth(titulo.toUpperCase()) + 5);
  doc.setDrawColor(...CIANO);
  doc.setLineWidth(0.35);
  doc.line(inicio, y - 1, x + largura, y - 1);
}

function metricas(doc: jsPDF, d: Dados) {
  const itens = [
    [String(d.monitorias), "monitorias", ROXO],
    [String(d.exercicios), "exercícios", CIANO],
    [`${d.horas}h`, "de estudo", ROXO],
    [String(d.lideranca), "liderança", MAGENTA],
  ] as const;
  const largura = 44;
  itens.forEach(([valor, rotulo, cor], indice) => {
    const x = 11 + indice * 49;
    doc.setFillColor(...FUNDO_CARD);
    doc.roundedRect(x, 84, largura, 22, 3.5, 3.5, "F");
    doc.setDrawColor(...cor);
    doc.setLineWidth(0.7);
    doc.circle(x + 9, 94.5, 4.1);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...cor);
    doc.text(["M", "EX", "H", "L"][indice]!, x + 9, 96.2, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...cor);
    doc.text(valor, x + 25, 94.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...CINZA);
    doc.text(rotulo, x + 25, 101, { align: "center" });
  });
}

function cabecalhoContinuacao(doc: jsPDF) {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("CONECTADAS", 11, 12);
}

function rodape(doc: jsPDF) {
  doc.setDrawColor(129, 105, 234);
  doc.setLineWidth(0.3);
  doc.line(11, 266, 199, 266);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(137, 111, 224);
  doc.text("CONECTADAS", 42, 278);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Conhecimento conecta. Meninas transformam.", 42, 283);
  doc.setDrawColor(...CIANO);
  doc.line(0, 276, 12, 276);
  doc.line(12, 276, 18, 282);
  doc.line(18, 282, 27, 282);
  doc.line(183, 282, 192, 282);
  doc.line(192, 282, 198, 276);
  doc.line(198, 276, 210, 276);
}

function novaPaginaDeSecao(doc: jsPDF, titulo: string, x: number, largura: number) {
  doc.addPage();
  cabecalhoContinuacao(doc);
  secao(doc, `${titulo} (continuação)`, x, 29, largura);
  return 41;
}

function desenharHabilidades(doc: jsPDF, itens: string[], x: number, y: number, largura: number) {
  let px = x;
  let py = y;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.3);
  for (const item of itens) {
    const rotulo = limitarTexto(doc, item, largura - 10);
    const w = Math.min(largura, doc.getTextWidth(rotulo) + 10);
    if (px + w > x + largura) {
      px = x;
      py += 10;
    }
    if (py + 2 > LIMITE_CONTEUDO) {
      py = novaPaginaDeSecao(doc, "Habilidades", x, largura);
      px = x;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.3);
    }
    doc.setFillColor(243, 241, 255);
    doc.roundedRect(px, py - 6, w, 8, 4, 4, "F");
    doc.setTextColor(...CINZA);
    doc.text(rotulo, px + 5, py - 1);
    px += w + 3;
  }
  return itens.length ? py + 7 : y;
}

function desenharMedalhas(doc: jsPDF, itens: string[], x: number, y: number, largura: number) {
  let py = y;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  for (const item of itens) {
    let linhas = doc.splitTextToSize(item, largura - 11) as string[];
    let primeiroTrecho = true;
    while (linhas.length) {
      const capacidade = Math.max(1, Math.floor((LIMITE_CONTEUDO - py) / 4) + 1);
      if (py > LIMITE_CONTEUDO - 4) {
        py = novaPaginaDeSecao(doc, "Medalhas e conquistas", x, largura);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        continue;
      }
      const trecho = linhas.slice(0, capacidade);
      if (primeiroTrecho) {
        doc.setDrawColor(...ROXO);
        doc.setLineWidth(0.6);
        doc.circle(x + 2, py - 1.5, 2.2);
      }
      doc.setTextColor(...CINZA);
      doc.text(trecho, x + 8, py);
      linhas = linhas.slice(trecho.length);
      py += 7 + Math.max(0, trecho.length - 1) * 4;
      primeiroTrecho = false;
      if (linhas.length) py = novaPaginaDeSecao(doc, "Medalhas e conquistas", x, largura);
    }
  }
  return py;
}

export function criarCurriculoPDF(d: Dados) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const direita = 111;

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 77, "F");
  circuitos(doc);
  marca(doc);
  avatar(doc, (d.nome || "E").trim()[0]?.toUpperCase() ?? "E");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text(limitarTexto(doc, d.nome || "Estudante", 145), 49, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(230, 232, 244);
  let detalheY = 54;
  if (d.email) {
    doc.text(limitarTexto(doc, d.email, 145), 49, detalheY);
    detalheY += 7;
  }
  doc.text(`Nível ${d.nivel} - ${d.xp.toLocaleString("pt-BR")} XP`, 49, detalheY);

  metricas(doc, d);

  let esquerdaY = 124;
  if (d.serie || d.turma) {
    secao(doc, "Formação", 11, esquerdaY, 92);
    esquerdaY += 11;
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Ensino Médio", 18, esquerdaY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...CINZA);
    doc.text(limitarTexto(doc, [d.serie, d.turma ? `Turma ${d.turma}` : null].filter(Boolean).join(" - "), 82), 18, esquerdaY + 6);
    esquerdaY += 6;
  }

  const experiencias = [
    d.monitorias > 0 ? `${d.monitorias} monitoria${d.monitorias === 1 ? "" : "s"} registrada${d.monitorias === 1 ? "" : "s"}` : null,
    d.exercicios > 0 ? `${d.exercicios} exercício${d.exercicios === 1 ? "" : "s"} concluído${d.exercicios === 1 ? "" : "s"}` : null,
    d.horas > 0 ? `${d.horas}h de estudo registradas` : null,
  ].filter((item): item is string => Boolean(item));
  if (experiencias.length) {
    esquerdaY += 19;
    secao(doc, "Projetos e experiências", 11, esquerdaY, 92);
    esquerdaY += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...CINZA);
    for (const experiencia of experiencias) {
      doc.setFillColor(...CIANO);
      doc.circle(13, esquerdaY - 1, 1, "F");
      doc.text(experiencia, 18, esquerdaY);
      esquerdaY += 8;
    }
  }

  let direitaY = 124;
  if (d.habilidades.length) {
    secao(doc, "Habilidades", direita, direitaY, 88);
    direitaY = desenharHabilidades(doc, d.habilidades, direita, direitaY + 12, 88);
  }
  if (d.medalhas.length) {
    direitaY += d.habilidades.length ? 12 : 0;
    if (direitaY > LIMITE_CONTEUDO - 18) {
      doc.addPage();
      cabecalhoContinuacao(doc);
      direitaY = 29;
    }
    secao(doc, "Medalhas e conquistas", direita, direitaY, 88);
    direitaY += 11;
    desenharMedalhas(doc, d.medalhas, direita, direitaY, 88);
  }

  const totalPaginas = doc.getNumberOfPages();
  for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
    doc.setPage(pagina);
    rodape(doc);
  }

  return doc;
}

export function gerarCurriculoPDF(d: Dados) {
  const doc = criarCurriculoPDF(d);

  const arquivo = (d.nome || "estudante")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  doc.save(`curriculo-${arquivo}.pdf`);
}
