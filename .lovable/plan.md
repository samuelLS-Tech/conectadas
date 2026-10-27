# CONECTADAS — conteúdos completos e monitoria real

## Diagnóstico confirmado

- A Biblioteca tem apenas um assunto de cinco questões em Matemática, Física, Química e Programação, além de cinco questões de vestibulares. Engenharia ainda não tem exercícios.
- A sala atual contém nomes e mensagens de exemplo. Os controles de câmera e microfone não capturam mídia; não existe compartilhamento de tela nem comunicação entre contas.
- Ofertas, interesses, notificações e confirmações de monitoria já são guardados no Lovable Cloud. As sessões são criadas apenas ao finalizar; precisam existir desde o início e vincular as duas contas.
- A função de conclusão calcula XP no banco, mas aceita referências arbitrárias e a quantidade de acertos enviada pelo navegador. A expansão precisa corrigir essa brecha, não apenas adicionar cartões.
- Ranking escolar e permissões de leitura existem no banco consultado. Exclusão de publicações próprias está autorizada; exclusão de contas não está implementada.
- Os 15 testes existentes de acesso, professor, XP e currículo passaram. Abri painel, biblioteca, sala e portfólio pela conta conectada, sem erros de execução.
- Baixei e conferi o PDF dessa conta: ele reutiliza a marca da referência e mostra seus dados reais. Não é idêntico em todos os detalhes; seções sem habilidades ou medalhas são omitidas corretamente. A referência não autoriza copiar localização, projetos ou conquistas fictícias.

## 1. Biblioteca: 250 questões autorais

Manter a aparência e a resolução atuais, com cinco disciplinas, dez assuntos por disciplina e exatamente cinco questões por assunto. Conservar os identificadores dos quatro assuntos existentes para preservar conclusões anteriores.

| Disciplina | Dez assuntos |
|---|---|
| Matemática | Funções; Equações e sistemas; Razão e proporção; Porcentagem e juros; Geometria plana; Geometria espacial; Trigonometria; Probabilidade; Estatística; Sequências e progressões |
| Física | Mecânica; Trabalho e energia; Quantidade de movimento; Gravitação; Hidrostática; Termologia; Termodinâmica; Ondulatória; Óptica; Eletricidade |
| Química | Estequiometria; Estrutura atômica; Tabela periódica; Ligações químicas; Soluções; Termoquímica; Cinética química; Equilíbrio químico; Eletroquímica; Química orgânica |
| Engenharia | Projeto e requisitos; Medidas e tolerâncias; Materiais e propriedades; Estruturas e cargas; Máquinas simples; Circuitos aplicados; Energia e eficiência; Sistemas hidráulicos; Automação e sensores; Sustentabilidade e segurança |
| Programação | Python; Variáveis e tipos; Operadores e expressões; Condicionais; Laços de repetição; Funções; Listas; Strings; Algoritmos e busca; Depuração e testes |

- Questões adequadas ao Ensino Médio, distintas, com alternativas e gabaritos revisados; Engenharia terá problemas práticos.
- Acrescentar explicações após a resposta, sem remover correção e progresso existentes.
- Verificar contagens, classificação, identificadores, alternativas e duplicatas automaticamente; revisar cálculos e ambiguidades separadamente. Esses testes não substituem revisão pedagógica profissional.
- Integrar Engenharia ao progresso e às habilidades sem revogar medalhas já concedidas ou reinterpretar conclusões antigas.

## 2. Vestibulares: bancos e rodadas

- Criar sete conjuntos: ENEM, FUVEST, UNICAMP, FATEC, UNESP, UERJ e ITA, com vinte questões cada.
- Na expansão, usar questões **autorais de preparação**, identificadas como não oficiais e não vinculadas às instituições. Não inventar prova ou ano para essas questões.
- Preservar questões oficiais existentes somente após conferir fonte, gabarito e condições de reprodução; identificar instituição, prova, ano e fonte. Se não houver autorização adequada, oferecer link à prova oficial em vez de copiar a questão.
- Cada ciclo apresenta quatro rodadas de cinco questões, sem repetição. Salvar seleção e andamento por estudante no Lovable Cloud para resistir a recarregamento e troca de aparelho.
- Após vinte questões, oferecer novo ciclo com nova ordem. Registrar o desempenho das novas tentativas sem conceder XP novamente pelas mesmas questões/conjuntos já recompensados, preservando a regra atual contra recompensas duplicadas.

## 3. Sala: comparar antes de contratar

Você pediu outra avaliação antes de autorizar Daily. Nenhum serviço será contratado ou conectado nesta etapa sem sua decisão.

| Solução | Custos publicados consultados | Configuração e limitações |
|---|---|---|
| Cloudflare Realtime SFU + TURN | Franquia de 1.000 GB compartilhada; acima dela, US$ 0,05/GB de saída | Conta Cloudflare e credenciais privadas. Não entrega uma sala pronta: exige integrar chamada, sinalização, reconexão, áudio, vídeo e tela. Mais trabalho de desenvolvimento; custo depende de tráfego, não apenas duração. |
| LiveKit Cloud | Build: US$ 0/mês; Ship: a partir de US$ 50/mês; Scale: a partir de US$ 500/mês | Conta, endereço do projeto e credenciais privadas. SDK de salas e participantes; é necessário confirmar franquias, tarifa de mídia e limites do plano antes de estimar uso. |
| Daily | 10.000 minutos por participante/mês grátis; depois, vídeo/tela a US$ 0,004 por minuto/participante | Conta e conexão segura. Menor esforço para integrar; permanece uma alternativa, não a escolha aprovada. |
| Hospedagem própria | Sem tarifa universal; servidor e tráfego cobrados separadamente | Maior responsabilidade de operação, segurança e disponibilidade. O site atual não hospeda diretamente um servidor de mídia. |

Fontes oficiais: [Cloudflare Realtime](https://developers.cloudflare.com/realtime/sfu/pricing/), [LiveKit](https://livekit.io/pricing/) e [Daily](https://www.daily.co/pricing/video-sdk/). Valores em dólares, sujeitos a alteração; impostos, câmbio e uso do Lovable Cloud são separados. Não presumir que a franquia garante custo zero.

**Proposta para avaliar:** LiveKit Cloud, por oferecer salas e controles de mídia sem operar servidor próprio. Confirmar primeiro limites e cobrança de WebRTC do plano escolhido; apresentar a conexão segura somente depois da autorização. Cloudflare é a alternativa para reduzir custo de tráfego aceitando maior esforço de integração.

### Funcionamento da sala após escolher o serviço

- Abrir a partir de uma oferta e interesse reais, com aceite e identificação das duas contas. Retirar monitoras e respostas simuladas desse caminho.
- Criar sessão privada antes da entrada; autorizar apenas participantes vinculados e emitir credenciais temporárias para aquela sala.
- Implementar entrada, saída, áudio, vídeo, câmera/microfone, tela e chat reais. Não mostrar um controle ativo se o recurso não estiver disponível.
- Tratar permissão negada, dispositivo ausente, perda de conexão, outra participante ausente e sessão encerrada.
- Sem gravação por padrão. Documentar tratamento de mídia pelo provedor, consentimento e cuidados com menores.
- Compartilhamento de tela depende do navegador; pode não estar disponível em celulares. Mostrar a limitação, sem simular compartilhamento.
- QR identifica a sessão; não comprova sozinho presença. Manter confirmação individual e recompensa única apenas após ambas confirmarem, restringindo novas sessões às contas previamente vinculadas.

## 4. Exclusão segura e validação dos recursos existentes

- Implementar exclusão da própria conta com confirmação explícita e sessão revalidada: remover acesso e dados pessoais/próprios; anonimizar registros compartilhados, preservando o progresso da outra participante.
- Fazer a remoção pessoal e anonimização de forma consistente e permitir recuperação em caso de falha da etapa de remoção do acesso. Não confundir esconder perfil com excluir conta.
- Testar filtros escolares, série/turma/disciplina, ranking, notificações e exclusão de publicações com contas adequadas e dados reais controlados. Não alterar contas existentes para fabricar papéis de teste.
- Conferir isolamento entre escolas e participantes; empresa e professor não podem usar operações exclusivas de estudantes.
- Revalidar o download do currículo com perfil e conquistas carregados e comparar com a imagem. Corrigir somente divergências visuais verificadas, mantendo dados verdadeiros.

## Detalhes técnicos

- Reutilizar TanStack Start, componentes atuais e Lovable Cloud; alterações de banco aditivas, com permissões explícitas e RLS.
- Adicionar catálogo autoritativo de assuntos/questões, tentativas e ciclos. Gabaritos usados para pontuação não ficam em leituras abertas antes da resposta.
- Calcular correção e XP no servidor a partir das respostas e da tentativa autorizada. Bloquear referências desconhecidas, respostas fora da seleção e duplicação concorrente.
- Substituir o aumento otimista de XP por confirmação da gravação; mostrar falha e permitir tentativa novamente sem duplicar pontos.
- Preservar históricos e critérios de medalhas existentes; incluir novos critérios de Engenharia de modo compatível, sem remoções destrutivas.
- Integrações privadas usam funções autenticadas; credenciais de mídia nunca vão para código público. Tokens de entrada ficam limitados à sala e à identidade validada.
- Acrescentar testes de contagens exatas, ciclos de vinte, respostas inválidas, XP, repetição, autorização e exclusão/anonimização.

## Critérios de entrega

1. Biblioteca com cinquenta assuntos e 250 questões, incluindo cinquenta de Engenharia.
2. Sete bancos de vestibulares com vinte questões cada, rodadas de cinco e persistência do ciclo.
3. Nenhuma mudança de XP não confirmada pelo servidor; histórico anterior preservado.
4. Exclusão da própria conta testada em conta descartável autorizada, preservando histórico anonimizado da outra participante.
5. Comunicação verificada entre duas contas distintas com mídia, tela e chat — não apenas com botões ou dispositivos simulados. Testes automatizados de mídia sintética serão identificados como tais; redes/aparelhos reais precisam de verificação própria.
6. Relatório final distingue implementado, testado, não verificado e dependente de configuração externa.

## Dependências ainda abertas

- Escolha e autorização do serviço de mídia, credenciais e limites de cobrança. A implementação de áudio/vídeo/tela aguarda isso; a aprovação deste plano não contrata um provedor.
- Contas de teste de estudante, professor e empresa autorizadas, incluindo duas participantes distintas para validar a sala e uma conta descartável para exclusão.
- Revisão pedagógica humana antes de uso avaliativo formal e autorização de reprodução de questões oficiais quando necessária.