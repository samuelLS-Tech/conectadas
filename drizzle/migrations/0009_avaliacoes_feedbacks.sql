ALTER TABLE public.monitoria_sessoes
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS concluida_em timestamptz;
UPDATE public.monitoria_sessoes SET status = 'concluida', concluida_em = coalesce(concluida_em, created_at)
  WHERE criadora_confirmou AND monitora_confirmou AND monitora_id IS NOT NULL AND monitora_id <> criadora_id;
ALTER TABLE public.monitoria_sessoes ADD CONSTRAINT monitoria_sessoes_status_valido CHECK (status IN ('pendente','concluida','cancelada'));

DROP POLICY IF EXISTS "Criar propria sessao" ON public.monitoria_sessoes;
CREATE POLICY "Criar propria sessao" ON public.monitoria_sessoes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = criadora_id AND public.has_role(auth.uid(), 'estudante') AND criadora_confirmou = false
    AND monitora_confirmou = false AND monitora_id IS NULL AND status = 'pendente' AND concluida_em IS NULL);

CREATE OR REPLACE FUNCTION public.confirmar_monitoria(_sessao uuid)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE s public.monitoria_sessoes; uid uuid := auth.uid(); _papel text;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'nao autenticada'; END IF;
  SELECT * INTO s FROM public.monitoria_sessoes WHERE id = _sessao FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'sessao inexistente'; END IF;
  IF s.status = 'cancelada' THEN RETURN 'cancelada'; END IF;
  IF uid = s.criadora_id THEN
    IF s.criadora_confirmou THEN RETURN 'ja_confirmado'; END IF;
    UPDATE public.monitoria_sessoes SET criadora_confirmou = true WHERE id = _sessao RETURNING * INTO s;
    _papel := 'aluna';
  ELSE
    IF NOT public.has_role(uid, 'estudante') THEN RETURN 'sessao_ocupada'; END IF;
    IF s.monitora_id IS NOT NULL AND s.monitora_id <> uid THEN RETURN 'sessao_ocupada'; END IF;
    IF s.monitora_confirmou THEN RETURN 'ja_confirmado'; END IF;
    UPDATE public.monitoria_sessoes SET monitora_id = uid, monitora_confirmou = true WHERE id = _sessao RETURNING * INTO s;
    _papel := 'monitora';
  END IF;
  IF s.criadora_confirmou AND s.monitora_confirmou AND s.monitora_id IS NOT NULL AND s.monitora_id <> s.criadora_id AND s.status = 'pendente' THEN
    UPDATE public.monitoria_sessoes SET status = 'concluida', concluida_em = now() WHERE id = _sessao;
    UPDATE public.profiles SET xp = xp + 10, horas = horas + 1 WHERE id = s.criadora_id;
    UPDATE public.profiles SET xp = xp + 50, monitorias = monitorias + 1, lideranca = lideranca + 1, horas = horas + 1 WHERE id = s.monitora_id;
    INSERT INTO public.estudante_habilidades (estudante_id, habilidade_id)
    SELECT s.monitora_id, h.id FROM public.habilidades h WHERE h.criterio_tipo = 'monitoria' AND h.criterio_valor = s.materia ON CONFLICT DO NOTHING;
    INSERT INTO public.estudante_habilidades (estudante_id, habilidade_id)
    SELECT s.criadora_id, h.id FROM public.habilidades h WHERE h.criterio_tipo = 'ajuda' AND h.criterio_valor = s.materia ON CONFLICT DO NOTHING;
    PERFORM public.conceder_medalhas(s.monitora_id);
    PERFORM public.conceder_medalhas(s.criadora_id);
  END IF;
  RETURN _papel;
END $function$;

CREATE OR REPLACE FUNCTION public.cancelar_monitoria(_sessao uuid)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE s public.monitoria_sessoes; uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'nao autenticada'; END IF;
  SELECT * INTO s FROM public.monitoria_sessoes WHERE id = _sessao FOR UPDATE;
  IF NOT FOUND OR (uid <> s.criadora_id AND uid IS DISTINCT FROM s.monitora_id) THEN RAISE EXCEPTION 'sessao inexistente'; END IF;
  IF s.status <> 'pendente' THEN RETURN s.status; END IF;
  UPDATE public.monitoria_sessoes SET status = 'cancelada' WHERE id = _sessao;
  RETURN 'cancelada';
END $function$;

CREATE TABLE public.avaliacoes_monitoria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao_id uuid NOT NULL REFERENCES public.monitoria_sessoes(id) ON DELETE CASCADE,
  autora_id uuid NOT NULL,
  autora_nome text NOT NULL DEFAULT '',
  avaliada_id uuid NOT NULL,
  papel_avaliada text NOT NULL CHECK (papel_avaliada IN ('monitora','aluna')),
  materia text NOT NULL DEFAULT '',
  criterio_1 smallint NOT NULL CHECK (criterio_1 BETWEEN 1 AND 5),
  criterio_2 smallint NOT NULL CHECK (criterio_2 BETWEEN 1 AND 5),
  criterio_3 smallint NOT NULL CHECK (criterio_3 BETWEEN 1 AND 5),
  estrelas smallint NOT NULL CHECK (estrelas BETWEEN 1 AND 5),
  comentario text CHECK (comentario IS NULL OR length(comentario) <= 600),
  comentario_removido boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sessao_id, autora_id),
  CHECK (autora_id <> avaliada_id)
);
GRANT SELECT ON public.avaliacoes_monitoria TO authenticated;
GRANT ALL ON public.avaliacoes_monitoria TO service_role;
ALTER TABLE public.avaliacoes_monitoria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partes veem avaliacao de monitoria" ON public.avaliacoes_monitoria FOR SELECT TO authenticated
  USING (auth.uid() = autora_id OR auth.uid() = avaliada_id);

CREATE TABLE public.vinculos_academicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id uuid NOT NULL,
  professor_nome text NOT NULL DEFAULT '',
  estudante_id uuid NOT NULL,
  estudante_nome text NOT NULL DEFAULT '',
  escola_id text NOT NULL,
  disciplina text NOT NULL,
  serie text,
  turma text,
  status text NOT NULL DEFAULT 'proposto' CHECK (status IN ('proposto','ativo','recusado','encerrado')),
  created_at timestamptz NOT NULL DEFAULT now(),
  respondido_em timestamptz,
  UNIQUE (professor_id, estudante_id, disciplina)
);
GRANT SELECT ON public.vinculos_academicos TO authenticated;
GRANT ALL ON public.vinculos_academicos TO service_role;
ALTER TABLE public.vinculos_academicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partes veem vinculo academico" ON public.vinculos_academicos FOR SELECT TO authenticated
  USING (auth.uid() = professor_id OR auth.uid() = estudante_id);

CREATE TABLE public.feedbacks_academicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vinculo_id uuid NOT NULL REFERENCES public.vinculos_academicos(id) ON DELETE CASCADE,
  professor_id uuid NOT NULL,
  professor_nome text NOT NULL DEFAULT '',
  estudante_id uuid NOT NULL,
  disciplina text NOT NULL,
  criterios text[] NOT NULL DEFAULT '{}',
  comentario text CHECK (comentario IS NULL OR length(comentario) <= 1000),
  removido boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.feedbacks_academicos TO authenticated;
GRANT ALL ON public.feedbacks_academicos TO service_role;
ALTER TABLE public.feedbacks_academicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partes veem feedback ativo" ON public.feedbacks_academicos FOR SELECT TO authenticated
  USING (NOT removido AND (auth.uid() = professor_id OR auth.uid() = estudante_id));

CREATE TABLE public.experiencias_profissionais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  empresa_nome text NOT NULL DEFAULT '',
  estudante_id uuid NOT NULL,
  estudante_nome text NOT NULL DEFAULT '',
  tipo text NOT NULL CHECK (tipo IN ('estagio','trabalho','projeto','outra')),
  descricao text NOT NULL CHECK (length(descricao) BETWEEN 3 AND 300),
  inicio date NOT NULL,
  fim date,
  status text NOT NULL DEFAULT 'proposta' CHECK (status IN ('proposta','confirmada','recusada')),
  created_at timestamptz NOT NULL DEFAULT now(),
  respondida_em timestamptz,
  CHECK (fim IS NULL OR fim >= inicio)
);
GRANT SELECT ON public.experiencias_profissionais TO authenticated;
GRANT ALL ON public.experiencias_profissionais TO service_role;
ALTER TABLE public.experiencias_profissionais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partes veem experiencia" ON public.experiencias_profissionais FOR SELECT TO authenticated
  USING (auth.uid() = empresa_id OR auth.uid() = estudante_id);

CREATE TABLE public.recomendacoes_profissionais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiencia_id uuid NOT NULL UNIQUE REFERENCES public.experiencias_profissionais(id) ON DELETE CASCADE,
  empresa_id uuid NOT NULL,
  empresa_nome text NOT NULL DEFAULT '',
  estudante_id uuid NOT NULL,
  tipo text NOT NULL,
  criterios text[] NOT NULL DEFAULT '{}',
  comentario text CHECK (comentario IS NULL OR length(comentario) <= 1000),
  removida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.recomendacoes_profissionais TO authenticated;
GRANT ALL ON public.recomendacoes_profissionais TO service_role;
ALTER TABLE public.recomendacoes_profissionais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partes veem recomendacao ativa" ON public.recomendacoes_profissionais FOR SELECT TO authenticated
  USING (NOT removida AND (auth.uid() = empresa_id OR auth.uid() = estudante_id));

CREATE TABLE public.historico_avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL,
  registro_id uuid NOT NULL,
  autor_id uuid NOT NULL,
  acao text NOT NULL,
  conteudo_anterior jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.historico_avaliacoes TO service_role;
ALTER TABLE public.historico_avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.denuncias_avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL CHECK (categoria IN ('monitoria','academico','profissional')),
  registro_id uuid NOT NULL,
  solicitante_id uuid NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('denuncia','revisao','contestacao')),
  motivo text NOT NULL CHECK (length(motivo) BETWEEN 5 AND 600),
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (categoria, registro_id, solicitante_id, tipo)
);
GRANT SELECT ON public.denuncias_avaliacoes TO authenticated;
GRANT ALL ON public.denuncias_avaliacoes TO service_role;
ALTER TABLE public.denuncias_avaliacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver proprias solicitacoes" ON public.denuncias_avaliacoes FOR SELECT TO authenticated
  USING (auth.uid() = solicitante_id);

CREATE TABLE public.sinalizacoes_reciprocidade (
  estudante_a uuid NOT NULL,
  estudante_b uuid NOT NULL,
  sessoes_reciprocas integer NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (estudante_a, estudante_b)
);
GRANT ALL ON public.sinalizacoes_reciprocidade TO service_role;
ALTER TABLE public.sinalizacoes_reciprocidade ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.texto_limpo(_t text, _max integer)
 RETURNS text LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public'
AS $function$
BEGIN
  IF _t IS NULL OR btrim(_t) = '' THEN RETURN NULL; END IF;
  IF length(btrim(_t)) > _max THEN RAISE EXCEPTION 'texto_longo'; END IF;
  RETURN btrim(_t);
END $function$;

CREATE OR REPLACE FUNCTION public.avaliar_monitoria(_sessao uuid, _c1 integer, _c2 integer, _c3 integer, _estrelas integer, _comentario text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE s public.monitoria_sessoes; uid uuid := auth.uid(); _alvo uuid; _papel text; _id uuid; _nome text; _rec integer; _a uuid; _b uuid;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'nao autenticada'; END IF;
  IF _c1 NOT BETWEEN 1 AND 5 OR _c2 NOT BETWEEN 1 AND 5 OR _c3 NOT BETWEEN 1 AND 5 OR _estrelas NOT BETWEEN 1 AND 5 THEN
    RAISE EXCEPTION 'nota_invalida';
  END IF;
  SELECT * INTO s FROM public.monitoria_sessoes WHERE id = _sessao FOR UPDATE;
  IF NOT FOUND OR (uid <> s.criadora_id AND uid IS DISTINCT FROM s.monitora_id) THEN RAISE EXCEPTION 'nao_participante'; END IF;
  IF s.status <> 'concluida' OR NOT s.criadora_confirmou OR NOT s.monitora_confirmou OR s.monitora_id IS NULL OR s.monitora_id = s.criadora_id THEN
    RAISE EXCEPTION 'monitoria_nao_concluida';
  END IF;
  IF uid = s.criadora_id THEN _alvo := s.monitora_id; _papel := 'monitora'; ELSE _alvo := s.criadora_id; _papel := 'aluna'; END IF;
  SELECT nome INTO _nome FROM public.profiles WHERE id = uid;
  INSERT INTO public.avaliacoes_monitoria (sessao_id, autora_id, autora_nome, avaliada_id, papel_avaliada, materia, criterio_1, criterio_2, criterio_3, estrelas, comentario)
  VALUES (_sessao, uid, coalesce(nullif(_nome, ''), 'Estudante'), _alvo, _papel, s.materia, _c1, _c2, _c3, _estrelas, public.texto_limpo(_comentario, 600))
  ON CONFLICT (sessao_id, autora_id) DO NOTHING RETURNING id INTO _id;
  IF _id IS NULL THEN RAISE EXCEPTION 'avaliacao_duplicada'; END IF;
  INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao) VALUES ('monitoria', _id, uid, 'criada');
  _a := least(uid, _alvo); _b := greatest(uid, _alvo);
  SELECT count(*) INTO _rec FROM public.monitoria_sessoes ms
  WHERE ms.concluida_em > now() - interval '30 days'
    AND EXISTS (SELECT 1 FROM public.avaliacoes_monitoria x WHERE x.sessao_id = ms.id AND x.autora_id = _a AND x.avaliada_id = _b)
    AND EXISTS (SELECT 1 FROM public.avaliacoes_monitoria y WHERE y.sessao_id = ms.id AND y.autora_id = _b AND y.avaliada_id = _a);
  IF _rec >= 3 THEN
    INSERT INTO public.sinalizacoes_reciprocidade (estudante_a, estudante_b, sessoes_reciprocas)
    VALUES (_a, _b, _rec)
    ON CONFLICT (estudante_a, estudante_b) DO UPDATE SET sessoes_reciprocas = EXCLUDED.sessoes_reciprocas, atualizado_em = now();
  END IF;
  INSERT INTO public.notificacoes (user_id, texto) VALUES (_alvo, 'Você recebeu uma avaliação da monitoria de ' || s.materia || '. Veja em Meu Portfólio.');
  RETURN _id;
END $function$;

CREATE OR REPLACE FUNCTION public.editar_comentario_monitoria(_id uuid, _comentario text, _remover boolean)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE a public.avaliacoes_monitoria; uid uuid := auth.uid();
BEGIN
  SELECT * INTO a FROM public.avaliacoes_monitoria WHERE id = _id FOR UPDATE;
  IF NOT FOUND OR uid IS NULL OR a.autora_id <> uid THEN RAISE EXCEPTION 'sem_permissao'; END IF;
  INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao, conteudo_anterior)
  VALUES ('monitoria', _id, uid, CASE WHEN _remover THEN 'comentario_removido' ELSE 'comentario_editado' END,
    jsonb_build_object('comentario', a.comentario, 'removido', a.comentario_removido));
  UPDATE public.avaliacoes_monitoria SET
    comentario = CASE WHEN _remover THEN NULL ELSE public.texto_limpo(_comentario, 600) END,
    comentario_removido = _remover, updated_at = now()
  WHERE id = _id;
END $function$;

CREATE OR REPLACE FUNCTION public.propor_vinculo_academico(_estudante uuid)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); p public.profiles; e public.profiles; _id uuid;
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'professor') THEN RAISE EXCEPTION 'apenas_professores'; END IF;
  SELECT * INTO p FROM public.profiles WHERE id = uid;
  SELECT * INTO e FROM public.profiles WHERE id = _estudante;
  IF NOT FOUND OR NOT public.has_role(_estudante, 'estudante') THEN RAISE EXCEPTION 'estudante_inexistente'; END IF;
  IF p.escola_id IS NULL OR p.disciplina IS NULL OR e.escola_id IS DISTINCT FROM p.escola_id THEN RAISE EXCEPTION 'escola_diferente'; END IF;
  INSERT INTO public.vinculos_academicos (professor_id, professor_nome, estudante_id, estudante_nome, escola_id, disciplina, serie, turma)
  VALUES (uid, coalesce(nullif(p.nome, ''), 'Professor(a)'), _estudante, coalesce(nullif(e.nome, ''), 'Estudante'), p.escola_id, p.disciplina, e.serie, e.turma)
  ON CONFLICT (professor_id, estudante_id, disciplina) DO UPDATE SET status = 'proposto', respondido_em = NULL, created_at = now()
    WHERE public.vinculos_academicos.status IN ('recusado','encerrado')
  RETURNING id INTO _id;
  IF _id IS NULL THEN RAISE EXCEPTION 'vinculo_existente'; END IF;
  INSERT INTO public.notificacoes (user_id, texto) VALUES (_estudante,
    'O(a) professor(a) ' || coalesce(nullif(p.nome, ''), '') || ' pediu para confirmar o vínculo na disciplina ' || p.disciplina || '. Responda em Meu Portfólio.');
  RETURN _id;
END $function$;

CREATE OR REPLACE FUNCTION public.responder_vinculo_academico(_id uuid, _aceitar boolean)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE v public.vinculos_academicos; uid uuid := auth.uid();
BEGIN
  SELECT * INTO v FROM public.vinculos_academicos WHERE id = _id FOR UPDATE;
  IF NOT FOUND OR uid IS NULL OR (v.estudante_id <> uid AND v.professor_id <> uid) THEN RAISE EXCEPTION 'sem_permissao'; END IF;
  IF v.professor_id = uid THEN
    IF _aceitar THEN RAISE EXCEPTION 'sem_permissao'; END IF;
    UPDATE public.vinculos_academicos SET status = 'encerrado', respondido_em = now() WHERE id = _id;
    RETURN 'encerrado';
  END IF;
  IF v.status <> 'proposto' AND _aceitar THEN RETURN v.status; END IF;
  UPDATE public.vinculos_academicos SET status = CASE WHEN _aceitar THEN 'ativo' WHEN v.status = 'ativo' THEN 'encerrado' ELSE 'recusado' END, respondido_em = now() WHERE id = _id;
  RETURN CASE WHEN _aceitar THEN 'ativo' ELSE 'recusado' END;
END $function$;

CREATE OR REPLACE FUNCTION public.salvar_feedback_academico(_vinculo uuid, _feedback uuid, _criterios text[], _comentario text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); v public.vinculos_academicos; f public.feedbacks_academicos; _c text; _id uuid;
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'professor') THEN RAISE EXCEPTION 'apenas_professores'; END IF;
  _criterios := coalesce(_criterios, '{}');
  IF NOT (_criterios <@ ARRAY['comprometimento','participacao','evolucao','colaboracao','iniciativa']) THEN RAISE EXCEPTION 'criterio_invalido'; END IF;
  _c := public.texto_limpo(_comentario, 1000);
  IF cardinality(_criterios) = 0 AND _c IS NULL THEN RAISE EXCEPTION 'feedback_vazio'; END IF;
  IF _feedback IS NOT NULL THEN
    SELECT * INTO f FROM public.feedbacks_academicos WHERE id = _feedback FOR UPDATE;
    IF NOT FOUND OR f.professor_id <> uid OR f.removido THEN RAISE EXCEPTION 'sem_permissao'; END IF;
    INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao, conteudo_anterior)
    VALUES ('academico', f.id, uid, 'editado', jsonb_build_object('criterios', f.criterios, 'comentario', f.comentario));
    UPDATE public.feedbacks_academicos SET criterios = _criterios, comentario = _c, updated_at = now() WHERE id = f.id;
    RETURN f.id;
  END IF;
  SELECT * INTO v FROM public.vinculos_academicos WHERE id = _vinculo;
  IF NOT FOUND OR v.professor_id <> uid OR v.status <> 'ativo' THEN RAISE EXCEPTION 'sem_vinculo_ativo'; END IF;
  INSERT INTO public.feedbacks_academicos (vinculo_id, professor_id, professor_nome, estudante_id, disciplina, criterios, comentario)
  VALUES (v.id, uid, v.professor_nome, v.estudante_id, v.disciplina, _criterios, _c) RETURNING id INTO _id;
  INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao) VALUES ('academico', _id, uid, 'criado');
  INSERT INTO public.notificacoes (user_id, texto) VALUES (v.estudante_id, 'Você recebeu um feedback acadêmico de ' || v.disciplina || '. Veja em Meu Portfólio.');
  RETURN _id;
END $function$;

CREATE OR REPLACE FUNCTION public.remover_feedback_academico(_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE f public.feedbacks_academicos; uid uuid := auth.uid();
BEGIN
  SELECT * INTO f FROM public.feedbacks_academicos WHERE id = _id FOR UPDATE;
  IF NOT FOUND OR uid IS NULL OR f.professor_id <> uid OR f.removido THEN RAISE EXCEPTION 'sem_permissao'; END IF;
  INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao, conteudo_anterior)
  VALUES ('academico', _id, uid, 'removido', jsonb_build_object('criterios', f.criterios, 'comentario', f.comentario));
  UPDATE public.feedbacks_academicos SET removido = true, updated_at = now() WHERE id = _id;
END $function$;

CREATE OR REPLACE FUNCTION public.propor_experiencia(_estudante uuid, _tipo text, _descricao text, _inicio date, _fim date)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); emp public.profiles; est public.profiles; _id uuid;
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'empresa') THEN RAISE EXCEPTION 'apenas_empresas'; END IF;
  IF NOT public.has_role(_estudante, 'estudante') THEN RAISE EXCEPTION 'estudante_inexistente'; END IF;
  IF _tipo NOT IN ('estagio','trabalho','projeto','outra') THEN RAISE EXCEPTION 'tipo_invalido'; END IF;
  IF _inicio IS NULL OR _inicio > current_date OR (_fim IS NOT NULL AND (_fim < _inicio OR _fim > current_date)) THEN RAISE EXCEPTION 'periodo_invalido'; END IF;
  SELECT * INTO emp FROM public.profiles WHERE id = uid;
  SELECT * INTO est FROM public.profiles WHERE id = _estudante;
  INSERT INTO public.experiencias_profissionais (empresa_id, empresa_nome, estudante_id, estudante_nome, tipo, descricao, inicio, fim)
  VALUES (uid, coalesce(nullif(emp.nome, ''), 'Empresa'), _estudante, coalesce(nullif(est.nome, ''), 'Estudante'), _tipo,
    coalesce(public.texto_limpo(_descricao, 300), ''), _inicio, _fim)
  RETURNING id INTO _id;
  INSERT INTO public.notificacoes (user_id, texto) VALUES (_estudante,
    'A empresa ' || coalesce(nullif(emp.nome, ''), '') || ' registrou uma experiência profissional com você. Confirme ou recuse em Meu Portfólio.');
  RETURN _id;
END $function$;

CREATE OR REPLACE FUNCTION public.responder_experiencia(_id uuid, _confirmar boolean)
 RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE x public.experiencias_profissionais; uid uuid := auth.uid();
BEGIN
  SELECT * INTO x FROM public.experiencias_profissionais WHERE id = _id FOR UPDATE;
  IF NOT FOUND OR uid IS NULL OR x.estudante_id <> uid THEN RAISE EXCEPTION 'sem_permissao'; END IF;
  IF x.status <> 'proposta' THEN RETURN x.status; END IF;
  UPDATE public.experiencias_profissionais SET status = CASE WHEN _confirmar THEN 'confirmada' ELSE 'recusada' END, respondida_em = now() WHERE id = _id;
  RETURN CASE WHEN _confirmar THEN 'confirmada' ELSE 'recusada' END;
END $function$;

CREATE OR REPLACE FUNCTION public.salvar_recomendacao(_experiencia uuid, _criterios text[], _comentario text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); x public.experiencias_profissionais; r public.recomendacoes_profissionais; _c text; _id uuid;
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'empresa') THEN RAISE EXCEPTION 'apenas_empresas'; END IF;
  _criterios := coalesce(_criterios, '{}');
  IF NOT (_criterios <@ ARRAY['responsabilidade','comprometimento','equipe','comunicacao','proatividade','organizacao']) THEN RAISE EXCEPTION 'criterio_invalido'; END IF;
  _c := public.texto_limpo(_comentario, 1000);
  IF cardinality(_criterios) = 0 AND _c IS NULL THEN RAISE EXCEPTION 'recomendacao_vazia'; END IF;
  SELECT * INTO x FROM public.experiencias_profissionais WHERE id = _experiencia;
  IF NOT FOUND OR x.empresa_id <> uid OR x.status <> 'confirmada' THEN RAISE EXCEPTION 'sem_experiencia_confirmada'; END IF;
  SELECT * INTO r FROM public.recomendacoes_profissionais WHERE experiencia_id = _experiencia FOR UPDATE;
  IF FOUND THEN
    INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao, conteudo_anterior)
    VALUES ('profissional', r.id, uid, CASE WHEN r.removida THEN 'restaurada' ELSE 'editada' END, jsonb_build_object('criterios', r.criterios, 'comentario', r.comentario, 'removida', r.removida));
    UPDATE public.recomendacoes_profissionais SET criterios = _criterios, comentario = _c, removida = false, updated_at = now() WHERE id = r.id;
    RETURN r.id;
  END IF;
  INSERT INTO public.recomendacoes_profissionais (experiencia_id, empresa_id, empresa_nome, estudante_id, tipo, criterios, comentario)
  VALUES (x.id, uid, x.empresa_nome, x.estudante_id, x.tipo, _criterios, _c) RETURNING id INTO _id;
  INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao) VALUES ('profissional', _id, uid, 'criada');
  INSERT INTO public.notificacoes (user_id, texto) VALUES (x.estudante_id, 'A empresa ' || x.empresa_nome || ' registrou uma recomendação profissional. Veja em Meu Portfólio.');
  RETURN _id;
END $function$;

CREATE OR REPLACE FUNCTION public.remover_recomendacao(_id uuid)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE r public.recomendacoes_profissionais; uid uuid := auth.uid();
BEGIN
  SELECT * INTO r FROM public.recomendacoes_profissionais WHERE id = _id FOR UPDATE;
  IF NOT FOUND OR uid IS NULL OR r.empresa_id <> uid OR r.removida THEN RAISE EXCEPTION 'sem_permissao'; END IF;
  INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao, conteudo_anterior)
  VALUES ('profissional', _id, uid, 'removida', jsonb_build_object('criterios', r.criterios, 'comentario', r.comentario));
  UPDATE public.recomendacoes_profissionais SET removida = true, updated_at = now() WHERE id = _id;
END $function$;

CREATE OR REPLACE FUNCTION public.solicitar_revisao_avaliacao(_categoria text, _registro uuid, _tipo text, _motivo text)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); _ok boolean; _id uuid; _m text;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'nao autenticada'; END IF;
  _m := public.texto_limpo(_motivo, 600);
  IF _m IS NULL OR length(_m) < 5 THEN RAISE EXCEPTION 'motivo_curto'; END IF;
  IF _tipo NOT IN ('denuncia','revisao','contestacao') THEN RAISE EXCEPTION 'tipo_invalido'; END IF;
  _ok := CASE _categoria
    WHEN 'monitoria' THEN EXISTS (SELECT 1 FROM public.avaliacoes_monitoria WHERE id = _registro AND avaliada_id = uid)
    WHEN 'academico' THEN EXISTS (SELECT 1 FROM public.feedbacks_academicos WHERE id = _registro AND estudante_id = uid AND NOT removido)
    WHEN 'profissional' THEN EXISTS (SELECT 1 FROM public.recomendacoes_profissionais WHERE id = _registro AND estudante_id = uid AND NOT removida)
    ELSE false END;
  IF NOT _ok THEN RAISE EXCEPTION 'sem_permissao'; END IF;
  INSERT INTO public.denuncias_avaliacoes (categoria, registro_id, solicitante_id, tipo, motivo)
  VALUES (_categoria, _registro, uid, _tipo, _m)
  ON CONFLICT (categoria, registro_id, solicitante_id, tipo) DO NOTHING RETURNING id INTO _id;
  IF _id IS NULL THEN RAISE EXCEPTION 'solicitacao_existente'; END IF;
  RETURN _id;
END $function$;

REVOKE ALL ON FUNCTION public.cancelar_monitoria(uuid), public.avaliar_monitoria(uuid, integer, integer, integer, integer, text),
  public.editar_comentario_monitoria(uuid, text, boolean), public.propor_vinculo_academico(uuid), public.responder_vinculo_academico(uuid, boolean),
  public.salvar_feedback_academico(uuid, uuid, text[], text), public.remover_feedback_academico(uuid), public.propor_experiencia(uuid, text, text, date, date),
  public.responder_experiencia(uuid, boolean), public.salvar_recomendacao(uuid, text[], text), public.remover_recomendacao(uuid),
  public.solicitar_revisao_avaliacao(text, uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancelar_monitoria(uuid), public.avaliar_monitoria(uuid, integer, integer, integer, integer, text),
  public.editar_comentario_monitoria(uuid, text, boolean), public.propor_vinculo_academico(uuid), public.responder_vinculo_academico(uuid, boolean),
  public.salvar_feedback_academico(uuid, uuid, text[], text), public.remover_feedback_academico(uuid), public.propor_experiencia(uuid, text, text, date, date),
  public.responder_experiencia(uuid, boolean), public.salvar_recomendacao(uuid, text[], text), public.remover_recomendacao(uuid),
  public.solicitar_revisao_avaliacao(text, uuid, text, text) TO authenticated;