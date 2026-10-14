import { Link } from "@tanstack/react-router";
import { useXP } from "@/lib/xp-store";

export function Marca({ to = "/", usuario = false }: { to?: string; usuario?: boolean }) {
  const { usuario: nome } = useXP();
  const mostrarNome = usuario && nome.length > 0;
  const texto = mostrarNome ? nome : "CONECTADAS";
  const inicial = mostrarNome ? nome[0]!.toUpperCase() : "C";
  return (
    <Link to={to} className="group flex min-w-0 items-center gap-2.5">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand shadow-[var(--shadow-neon)]">
        <span className="text-sm font-black text-background">{inicial}</span>
      </span>
      <span
        className={`truncate font-display text-lg font-extrabold text-gradient ${
          mostrarNome ? "tracking-wide" : "tracking-[0.18em]"
        }`}
      >
        {texto}
      </span>
    </Link>
  );
}
