import { jsPDF } from "jspdf";
import cabecalhoAsset from "@/assets/curriculo-cabecalho.jpg.asset.json";
import rodapeAsset from "@/assets/curriculo-rodape.jpg.asset.json";
import avatarAsset from "@/assets/curriculo-avatar.png.asset.json";

type Dados = {
  nome: string;
  email: string | null;
  serie: string | null;
  turma: string | null;
  escola?: string | null;
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

const NAVY: Cor = [12, 16, 43];
const ROXO: Cor = [89, 31, 214];
const MAGENTA: Cor = [192, 38, 255];
const CIANO: Cor = [13, 202, 215];
const CINZA: Cor = [64, 77, 112];
const FUNDO_CARD: Cor = [246, 245, 253];
const LIMITE_CONTEUDO = 276;
const ALTURA_PAGINA = 315;
export type ImagensCurriculo = { cabecalho: string; rodape: string; avatar: string };

type Icone = "estrela" | "livro" | "relogio" | "medalha" | "formacao" | "habilidades" | "codigo" | "email";
function icone(doc: jsPDF, tipo: Icone, x: number, y: number, tamanho: number, cor: Cor) {
  doc.setDrawColor(...cor);
  doc.setLineWidth(tamanho * 0.065);
  const linha = (a: number, b: number, c: number, d: number) => doc.line(x + a * tamanho, y + b * tamanho, x + c * tamanho, y + d * tamanho);
  if (tipo === "estrela") {
    const pontos = Array.from({ length: 10 }, (_, i) => {
      const angulo = -Math.PI / 2 + i * Math.PI / 5;
      const raio = i % 2 ? 0.22 : 0.49;
      return [0.5 + Math.cos(angulo) * raio, 0.5 + Math.sin(angulo) * raio] as const;
    });
    pontos.forEach((p, i) => { const q = pontos[(i + 1) % pontos.length]; if (q) linha(p[0], p[1], q[0], q[1]); });
  } else if (tipo === "relogio") {
    doc.circle(x + tamanho / 2, y + tamanho / 2, tamanho * 0.46);
    linha(.5, .19, .5, .5); linha(.5, .5, .73, .59);
  } else if (tipo === "livro") {
    linha(.5,.18,.5,.94);
    for (const lado of [0,1]) {
      const a = lado ? .5 : .04, b = lado ? .96 : .5;
      linha(a,.12,b,.18); linha(a,.12,a,.83); linha(a,.83,b,.94); linha(b,.18,b,.94);
      for (const altura of [.35,.51,.67]) linha(a+.07,altura,b-.07,altura+.03);
    }
  } else if (tipo === "formacao") {
    linha(0,.26,.5,.02); linha(.5,.02,1,.26); linha(1,.26,.5,.5); linha(.5,.5,0,.26);
    linha(.18,.36,.18,.73); linha(.18,.73,.5,.88); linha(.5,.88,.83,.73); linha(.83,.73,.83,.36); linha(.97,.28,.97,.75);
  } else if (tipo === "habilidades") {
    for (let i=0;i<3;i++) doc.rect(x+tamanho*(.05+i*.34),y+tamanho*(.67-i*.3),tamanho*.18,tamanho*(.3+i*.3));
  } else if (tipo === "codigo") {
    linha(.28,.18,.02,.5); linha(.02,.5,.28,.82); linha(.72,.18,.98,.5); linha(.98,.5,.72,.82); linha(.6,.05,.4,.95);
  } else if (tipo === "email") {
    doc.rect(x,y+tamanho*.15,tamanho,tamanho*.68); linha(0,.15,.5,.56); linha(.5,.56,1,.15);
  } else {
    doc.circle(x+tamanho*.5,y+tamanho*.57,tamanho*.29);
    doc.circle(x+tamanho*.5,y+tamanho*.57,tamanho*.12);
    linha(.2,0,.43,.3); linha(.8,0,.57,.3); linha(.2,0,.41,0); linha(.8,0,.59,0);
    linha(.41,0,.5,.19); linha(.59,0,.5,.19); linha(.34,.82,.26,1); linha(.26,1,.5,.94); linha(.5,.94,.74,1); linha(.74,1,.66,.82);
  }
}

function limitarTexto(doc: jsPDF, texto: string, largura: number) {
  if (doc.getTextWidth(texto) <= largura) return texto;
  const sufixo = "...";
  let fim = texto.length;
  while (fim > 0 && doc.getTextWidth(`${texto.slice(0, fim).trimEnd()}${sufixo}`) > largura) fim -= 1;
  return `${texto.slice(0, fim).trimEnd()}${sufixo}`;
}

function marca(doc: jsPDF, imagens?: ImagensCurriculo) {
  if (imagens) {
    doc.addImage(imagens.cabecalho, "JPEG", 0, 0, 210, 36.7);
    return;
  }
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("CONECTADAS", 17, 23);
  doc.setFontSize(9);
  doc.setTextColor(...CIANO);
  doc.text("CURRÍCULO DIGITAL", 162, 24);
}

function avatar(doc: jsPDF, inicial: string, imagens?: ImagensCurriculo) {
  if (imagens) doc.addImage(imagens.avatar, "PNG", 9.5, 38.7, 37, 37);
  else { doc.setFillColor(...CIANO); doc.circle(28, 57.2, 17.5, "F"); }
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(50);
  doc.text(inicial, 28, 64, { align: "center" });
}

function secao(doc: jsPDF, titulo: string, x: number, y: number, largura: number) {
  const tipo: Icone = titulo.startsWith("Formação") ? "formacao" : titulo.startsWith("Habilidades") ? "habilidades" : titulo.startsWith("Projetos") ? "codigo" : "medalha";
  icone(doc, tipo, x, y - 5, 8, ROXO);
  doc.setTextColor(...ROXO);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  const rotulo = limitarTexto(doc, titulo.toUpperCase(), largura - 13);
  doc.text(rotulo, x + 12.5, y);
  const inicio = x + 15.5 + doc.getTextWidth(rotulo);
  if (inicio < x + largura) {
    doc.setDrawColor(...CIANO);
    doc.setLineWidth(0.25);
    doc.line(inicio, y - 1.4, x + largura, y - 1.4);
  }
}

function metricas(doc: jsPDF, d: Dados) {
  const itens = [
    [String(d.monitorias), "monitorias", ROXO, "estrela"],
    [String(d.exercicios), "exercícios", CIANO, "livro"],
    [`${d.horas}h`, "de estudo", ROXO, "relogio"],
    [String(d.lideranca), "liderança", MAGENTA, "medalha"],
  ] as const;
  itens.forEach(([valor, rotulo, cor, tipo], indice) => {
    const x = 11 + indice * 48;
    doc.setFillColor(...FUNDO_CARD);
    doc.roundedRect(x, 89.5, 44.5, 22.2, 3.5, 3.5, "F");
    icone(doc, tipo, x + 8, 95, 8, cor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(...(indice === 1 ? [0, 110, 203] as Cor : ROXO));
    doc.text(limitarTexto(doc, valor, 22), x + 23, 100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...CINZA);
    doc.text(rotulo, x + 23, 106);
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

function rodape(doc: jsPDF, imagens?: ImagensCurriculo) {
  if (imagens) {
    doc.addImage(imagens.rodape, "JPEG", 0, 280, 210, 35);
    return;
  }
  doc.setDrawColor(137, 111, 224);
  doc.setLineWidth(0.3);
  doc.line(11, 282, 199, 282);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(137, 111, 224);
  doc.text("CONECTADAS", 34, 292);
  doc.setFont("helvetica", "normal");
  doc.text("Conhecimento conecta. Meninas transformam.", 34, 297);
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
  doc.setFontSize(8.5);
  for (const item of itens) {
    const rotulo = limitarTexto(doc, item, largura - 10);
    const w = Math.min(largura, doc.getTextWidth(rotulo) + 10);
    if (px + w > x + largura) {
      px = x;
      py += 11.5;
    }
    if (py + 2 > LIMITE_CONTEUDO) {
      py = novaPaginaDeSecao(doc, "Habilidades", x, largura);
      px = x;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
    }
    doc.setFillColor(243, 241, 255);
    doc.roundedRect(px, py - 6, w, 9.5, 4, 4, "F");
    doc.setTextColor(...CINZA);
    doc.text(rotulo, px + 5, py - 1);
    px += w + 3;
  }
  return itens.length ? py + 8 : y;
}

function desenharMedalhas(doc: jsPDF, itens: string[], x: number, y: number, largura: number) {
  let py = y;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const item of itens) {
    let linhas = doc.splitTextToSize(item, largura - 12) as string[];
    let primeiroTrecho = true;
    while (linhas.length) {
      const capacidade = Math.max(1, Math.floor((LIMITE_CONTEUDO - py) / 4) + 1);
      if (py > LIMITE_CONTEUDO - 4) {
        py = novaPaginaDeSecao(doc, "Medalhas e conquistas", x, largura);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        continue;
      }
      const trecho = linhas.slice(0, capacidade);
      if (primeiroTrecho) {
        icone(doc, "estrela", x, py - 4.5, 5.5, [158, 125, 238]);
      }
      doc.setTextColor(...CINZA);
      doc.text(trecho, x + 11.5, py);
      linhas = linhas.slice(trecho.length);
      py += 9.5 + Math.max(0, trecho.length - 1) * 4;
      primeiroTrecho = false;
      if (linhas.length) py = novaPaginaDeSecao(doc, "Medalhas e conquistas", x, largura);
    }
  }
  return py;
}

export function criarCurriculoPDF(d: Dados, imagens?: ImagensCurriculo) {
  const doc = new jsPDF({ unit: "mm", format: [210, ALTURA_PAGINA] });
  const direita = 112;

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 82, "F");
  marca(doc, imagens);
  avatar(doc, (d.nome || "E").trim()[0]?.toUpperCase() ?? "E", imagens);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(23);
  doc.text(limitarTexto(doc, d.nome || "Estudante", 145), 51.5, 51);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(230, 232, 244);
  let detalheY = 59;
  if (d.email) {
    icone(doc, "email", 52, detalheY - 3.3, 4.5, [208, 98, 247]);
    doc.text(limitarTexto(doc, d.email, 139), 59.5, detalheY);
    detalheY += 7;
  }
  icone(doc, "estrela", 52, detalheY - 3.8, 4.5, [208, 98, 247]);
  doc.text(`Nível ${d.nivel} · ${d.xp.toLocaleString("pt-BR")} XP`, 59.5, detalheY);

  metricas(doc, d);

  let esquerdaY = 129;
  if (d.escola || d.serie || d.turma) {
    secao(doc, "Formação", 11, esquerdaY, 90);
    esquerdaY += 11;
    doc.setTextColor(...NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Ensino Médio", 23, esquerdaY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...CINZA);
    if (d.escola) {
      doc.text(limitarTexto(doc, d.escola, 77), 23, esquerdaY + 6);
      esquerdaY += 6;
    }
    doc.text(limitarTexto(doc, [d.serie, d.turma ? `Turma ${d.turma}` : null].filter(Boolean).join(" | "), 77), 23, esquerdaY + 6);
    esquerdaY += 6;
  }

  const experiencias = [
    d.monitorias > 0 ? `${d.monitorias} monitoria${d.monitorias === 1 ? "" : "s"} registrada${d.monitorias === 1 ? "" : "s"}` : null,
    d.exercicios > 0 ? `${d.exercicios} exercício${d.exercicios === 1 ? "" : "s"} concluído${d.exercicios === 1 ? "" : "s"}` : null,
    d.horas > 0 ? `${d.horas}h de estudo registradas` : null,
  ].filter((item): item is string => Boolean(item));
  if (experiencias.length) {
    esquerdaY += 24;
    secao(doc, "Projetos e experiências", 11, esquerdaY, 90);
    esquerdaY += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...CINZA);
    for (const experiencia of experiencias) {
      doc.setFillColor(...CIANO);
      doc.circle(13, esquerdaY - 1, 1, "F");
      doc.text(experiencia, 18, esquerdaY);
      esquerdaY += 8;
    }
  }

  let direitaY = 129;
  if (d.habilidades.length) {
    secao(doc, "Habilidades", direita, direitaY, 87);
    direitaY = desenharHabilidades(doc, d.habilidades, direita, direitaY + 12, 87);
  }
  if (d.medalhas.length) {
    direitaY += d.habilidades.length ? 14 : 0;
    if (direitaY > LIMITE_CONTEUDO - 18) {
      doc.addPage();
      cabecalhoContinuacao(doc);
      direitaY = 29;
    }
    secao(doc, "Medalhas e conquistas", direita, direitaY, 87);
    direitaY += 11;
    desenharMedalhas(doc, d.medalhas, direita, direitaY, 87);
  }

  const totalPaginas = doc.getNumberOfPages();
  for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
    doc.setPage(pagina);
    rodape(doc, imagens);
  }

  return doc;
}

async function carregarImagem(url: string): Promise<string> {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error("Não foi possível carregar o modelo do currículo.");
  const blob = await resposta.blob();
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => typeof leitor.result === "string" ? resolve(leitor.result) : reject(new Error("Imagem inválida"));
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem"));
    leitor.readAsDataURL(blob);
  });
}

export async function gerarCurriculoPDF(d: Dados) {
  const [cabecalho, rodape, avatar] = await Promise.all([
    carregarImagem(cabecalhoAsset.url), carregarImagem(rodapeAsset.url), carregarImagem(avatarAsset.url),
  ]);
  const doc = criarCurriculoPDF(d, { cabecalho, rodape, avatar });

  const arquivo = (d.nome || "estudante")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  doc.save(`curriculo-${arquivo}.pdf`);
}
