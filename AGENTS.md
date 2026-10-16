<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Accounts and progress live in Lovable Cloud (profiles + user_roles for account type); XP for monitorias is granted only through the confirmar_monitoria database function, so each participant must confirm on their own device.
- Schools are a fixed list in src/lib/turmas.ts; the database stores only escola_id, so teacher/student matching never compares typed names. Activity approval (validar_atividade) records the decision only; XP is counted once at completion to avoid double rewards. In-app notifications are created by database functions/triggers.
