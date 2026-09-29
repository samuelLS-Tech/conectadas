const pontos = [
  [8, 18],
  [22, 44],
  [15, 72],
  [36, 26],
  [44, 62],
  [58, 14],
  [66, 48],
  [78, 30],
  [88, 66],
  [72, 82],
  [50, 88],
  [30, 92],
];

const ligacoes: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [3, 4],
  [4, 6],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [2, 11],
  [4, 10],
  [3, 5],
];

export function NeuralBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="grid-lines absolute inset-0 opacity-40" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {ligacoes.map(([a, b], i) => (
          <line
            key={i}
            x1={pontos[a]![0]}
            y1={pontos[a]![1]}
            x2={pontos[b]![0]}
            y2={pontos[b]![1]}
            stroke="var(--cyan)"
            strokeWidth="0.12"
            strokeOpacity="0.35"
          />
        ))}
        {pontos.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 0.7 : 0.45}
            fill={i % 2 === 0 ? "var(--neon)" : "var(--mint)"}
            className="animate-pulse-glow"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
