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
  trajetoria: { ano: string; titulo: string; descricao: string }[];
  medalhas: string[];
};

const NAVY: [number, number, number] = [7, 11, 26];
const ROXO: [number, number, number] = [139, 92, 246];
const MAGENTA: [number, number, number] = [192, 38, 255];
const CIANO: [number, number, number] = [34, 211, 238];
const VERDE: [number, number, number] = [46, 242, 166];
const CINZA: [number, number, number] = [100, 116, 139];

function logo(doc: jsPDF, x: number, y: number) {
  // quadrado com degradê roxo → ciano (faixas)
  const t = 14;
  for (let i = 0; i < t; i++) {
    const f = i / t;
    doc.setFillColor(
      Math.round(MAGENTA[0] + (CIANO[0] - MAGENTA[0]) * f),
      Math.round(MAGENTA[1] + (CIANO[1] - MAGENTA[1]) * f),
      Math.round(MAGENTA[2] + (CIANO[2] - MAGENTA[2]) * f),
    );
    doc.rect(x + i, y, 1.05, t, "F");
  }
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("C", x + t / 2, y + t / 2 + 1.6, { align: "center" });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setCharSpace(1.5);
  doc.text("CONECTADAS", x + t + 4, y + t / 2 + 2);
  doc.setCharSpace(0);
}

export function gerarCurriculoPDF(d: Dados) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const L = 210;
  const m = 18;

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, L, 52, "F");
  logo(doc, m, 12);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...CIANO);
  doc.text("CURRÍCULO DIGITAL", L - m, 21, { align: "right" });

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(d.nome || "Estudante", m, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  const sub = [d.serie && d.turma ? `${d.serie} · Turma ${d.turma}` : null, d.email, `Nível ${d.nivel} · ${d.xp.toLocaleString("pt-BR")} XP`]
    .filter(Boolean)
    .join("   |   ");
  doc.text(sub, m, 47);

  let y = 66;
  const titulo = (t: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...ROXO);
    doc.text(t.toUpperCase(), m, y);
    doc.setDrawColor(...CIANO);
    doc.setLineWidth(0.6);
    doc.line(m, y + 2, m + 18, y + 2);
    y += 10;
  };

  titulo("Indicadores");
  const stats = [
    [String(d.monitorias), "monitorias"],
    [String(d.exercicios), "exercícios"],
    [`${d.horas}h`, "de estudo"],
    [String(d.lideranca), "liderança"],
  ];
  const w = (L - 2 * m - 9) / 4;
  stats.forEach(([v, l], i) => {
    const x = m + i * (w + 3);
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(x, y, w, 20, 3, 3, "F");
    doc.setTextColor(...MAGENTA);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(v!, x + w / 2, y + 10, { align: "center" });
    doc.setTextColor(...CINZA);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(l!, x + w / 2, y + 16, { align: "center" });
  });
  y += 32;

  titulo("Trajetória");
  for (const t of d.trajetoria) {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFillColor(...VERDE);
    doc.circle(m + 1.5, y - 1.3, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(`${t.ano} — ${t.titulo}`, m + 6, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...CINZA);
    const linhas = doc.splitTextToSize(t.descricao, L - 2 * m - 6) as string[];
    doc.text(linhas, m + 6, y + 5);
    y += 8 + linhas.length * 4.5;
  }

  y += 4;
  if (y > 250) { doc.addPage(); y = 20; }
  titulo("Medalhas");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text(d.medalhas.length ? d.medalhas.map((x) => `• ${x}`) : ["Nenhuma medalha ainda"], m, y);

  doc.setFontSize(7.5);
  doc.setTextColor(...CINZA);
  doc.text(
    `Gerado pelo CONECTADAS em ${new Date().toLocaleDateString("pt-BR")}. O XP indica participação e desenvolvimento e não substitui avaliações acadêmicas ou profissionais.`,
    L / 2,
    288,
    { align: "center", maxWidth: L - 2 * m },
  );

  doc.save(`curriculo-${(d.nome || "estudante").toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
