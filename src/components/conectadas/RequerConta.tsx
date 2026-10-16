import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useXP, type TipoConta } from "@/lib/xp-store";

/** Mostra o conteúdo só para quem entrou com o tipo de conta certo. */
export function RequerConta({ tipo, children }: { tipo?: TipoConta; children: ReactNode }) {
  const { carregando, userId, tipo: atual } = useXP();
  const local = useLocation();

  if (carregando) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Carregando…</div>;
  }
  if (!userId || (tipo && atual !== tipo)) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div className="glass max-w-sm p-8 text-center">
          <p className="text-4xl">🔒</p>
          <h1 className="mt-3 text-xl font-bold">
            {userId ? "Esta área é de outro tipo de conta" : "Entre na sua conta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {userId
              ? `Esta página é para contas de ${tipo}.`
              : "Você precisa entrar para ver esta página."}
          </p>
          <Link
            to="/login"
            search={{ redirect: local.href }}
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background"
          >
            Ir para entrar
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
