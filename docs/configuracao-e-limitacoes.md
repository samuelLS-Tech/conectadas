# Configuração externa e limitações

## Aplicar o banco

Execute a migration `drizzle/migrations/0007_seguranca_ranking_contato_oauth.sql` no projeto Supabase antes de publicar o frontend. Ela adiciona a exclusão segura de publicações, o ranking escolar, o contato profissional consentido e o onboarding usado pelo Google OAuth.

## Login com Google

1. No Google Cloud Console, crie credenciais OAuth 2.0 do tipo aplicação web.
2. No provedor Google do Supabase Auth, informe o Client ID e o Client Secret; o secret deve permanecer apenas no painel do Supabase.
3. No Google, autorize a URL de callback exibida pelo Supabase, normalmente `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Em Supabase Auth > URL Configuration, cadastre a URL pública da aplicação e os redirects de desenvolvimento e produção terminados em `/login`.
5. Mantenha a vinculação automática de identidades por e-mail confirmada conforme a política do projeto e valide o fluxo com uma conta que já exista por e-mail e senha.

O primeiro acesso Google sem perfil abre o onboarding para escolher estudante, empresa ou professor. O perfil e a permissão são criados juntos pela função protegida `concluir_onboarding`; professor continua exigindo o código da escola.

## Entregas que dependem de decisão ou infraestrutura

- Exclusão de conta: não foi exposta porque exige política de retenção/anonimização, definição legal e uma operação privilegiada no backend para remover `auth.users`; esconder o perfil não atende ao requisito.
- Sala de áudio e vídeo: não foi simulada como pronta; uma implantação real precisa definir provedor WebRTC/SFU, TURN, moderação, gravação e orçamento operacional.
- Biblioteca e vestibulares: a expansão editorial de aproximadamente 390 questões precisa de autoria/revisão pedagógica e licenciamento das provas oficiais antes de entrar no produto.
- Currículo: o PDF foi redesenhado conforme a referência oficial; seções sem dados reais são omitidas e não são preenchidas com localização, escola ou projetos fictícios.

