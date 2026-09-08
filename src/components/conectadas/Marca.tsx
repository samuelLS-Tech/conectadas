import { Link } from "@tanstack/react-router";

export function Marca({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="group flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--gradient-brand)] shadow-[var(--shadow-neon)]">
        <span className="text-sm font-black text-background">C</span>
      </span>
      <span className="font-display text-lg font-extrabold tracking-[0.18em] text-gradient">
        CONECTADAS
      </span>
    </Link>
  );
}
