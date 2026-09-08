export function ProgressoNeon({
  valor,
  cor = "var(--gradient-brand)",
  altura = "h-3",
}: {
  valor: number;
  cor?: string;
  altura?: string;
}) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-secondary/70 ${altura}`}>
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, valor))}%`,
          background: cor,
          boxShadow: "0 0 18px color-mix(in oklab, var(--neon) 60%, transparent)",
        }}
      />
    </div>
  );
}
