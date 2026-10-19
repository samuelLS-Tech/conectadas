CREATE TABLE public.habilidades (
  id text PRIMARY KEY,
  trilha text NOT NULL,
  nome text NOT NULL,
  criterio_tipo text NOT NULL,
  criterio_valor text NOT NULL,
  ordem integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.habilidades TO authenticated;
GRANT ALL ON public.habilidades TO service_role;
ALTER TABLE public.habilidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Catalogo de habilidades visivel" ON public.habilidades FOR SELECT TO authenticated USING (true);

CREATE TABLE public.estudante_habilidades (
  estudante_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  habilidade_id text NOT NULL REFERENCES public.habilidades(id) ON DELETE CASCADE,
  desbloqueada_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (estudante_id, habilidade_id)
);
GRANT SELECT ON public.estudante_habilidades TO authenticated;
GRANT ALL ON public.estudante_habilidades TO service_role;
ALTER TABLE public.estudante_habilidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Estudante ve proprias habilidades" ON public.estudante_habilidades FOR SELECT TO authenticated USING (auth.uid() = estudante_id);

CREATE TABLE public.estudante_medalhas (
  estudante_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  medalha_id text NOT NULL,
  conquistada_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (estudante_id, medalha_id)
);
GRANT SELECT ON public.estudante_medalhas TO authenticated;
GRANT ALL ON public.estudante_medalhas TO service_role;
ALTER TABLE public.estudante_medalhas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Estudante ve proprias medalhas" ON public.estudante_medalhas FOR SELECT TO authenticated USING (auth.uid() = estudante_id);

INSERT INTO public.habilidades (id, trilha, nome, criterio_tipo, criterio_valor, ordem) VALUES
  ('tec_python', 'tecnologia', 'Python', 'atividade', 'python', 1),
  ('tec_monitoria', 'tecnologia', 'Monitoria de Programação', 'monitoria', 'Programação', 2),
  ('mat_funcoes', 'matematica', 'Funções', 'atividade', 'funcoes', 1),
  ('mat_monitoria', 'matematica', 'Monitoria de Matemática', 'monitoria', 'Matemática', 2),
  ('qui_estequiometria', 'quimica', 'Estequiometria', 'atividade', 'estequiometria', 1),
  ('qui_monitoria', 'quimica', 'Monitoria de Química', 'monitoria', 'Química', 2),
  ('fis_mecanica', 'fisica', 'Mecânica', 'atividade', 'mecanica', 1),
  ('fis_monitoria', 'fisica', 'Monitoria de Física', 'monitoria', 'Física', 2),
  ('eng_ajuda', 'engenharia', 'Ajuda em Engenharia', 'ajuda', 'Engenharia', 1),
  ('eng_monitoria', 'engenharia', 'Monitoria de Engenharia', 'monitoria', 'Engenharia', 2);

CREATE OR REPLACE FUNCTION public.conceder_medalhas(_uid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.estudante_medalhas (estudante_id, medalha_id)
  SELECT _uid, t.trilha FROM (SELECT DISTINCT trilha FROM public.habilidades) t
  WHERE NOT EXISTS (
    SELECT 1 FROM public.habilidades h
    WHERE h.trilha = t.trilha
      AND NOT EXISTS (
        SELECT 1 FROM public.estudante_habilidades eh
        WHERE eh.estudante_id = _uid AND eh.habilidade_id = h.id))
  ON CONFLICT DO NOTHING;
END $function$;

CREATE OR REPLACE FUNCTION public.concluir_atividade(_ref text, _titulo text, _disciplina text, _acertos integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); _total integer := 5; _ac integer; _xp integer; _feitas text[];
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'nao autenticada'; END IF;
  IF _ref IS NULL OR length(_ref) > 100 OR length(coalesce(_titulo,'')) > 200 OR length(coalesce(_disciplina,'')) > 100 THEN
    RAISE EXCEPTION 'dados invalidos';
  END IF;
  SELECT atividades_concluidas INTO _feitas FROM public.profiles WHERE id = uid FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'perfil inexistente'; END IF;
  IF _ref = ANY(_feitas) THEN RETURN 0; END IF;
  _ac := least(greatest(coalesce(_acertos,0), 0), _total);
  _xp := greatest(5, 20 - (_total - _ac) * 5);
  UPDATE public.profiles SET xp = xp + _xp, exercicios = exercicios + _total,
    atividades_concluidas = array_append(atividades_concluidas, _ref) WHERE id = uid;
  INSERT INTO public.atividades (estudante_id, atividade_ref, titulo, disciplina, acertos, total, xp)
  VALUES (uid, _ref, coalesce(_titulo,''), coalesce(_disciplina,''), _ac, _total, _xp);
  INSERT INTO public.estudante_habilidades (estudante_id, habilidade_id)
  SELECT uid, h.id FROM public.habilidades h
  WHERE h.criterio_tipo = 'atividade' AND h.criterio_valor = _ref
  ON CONFLICT DO NOTHING;
  PERFORM public.conceder_medalhas(uid);
  RETURN _xp;
END $function$;

CREATE OR REPLACE FUNCTION public.confirmar_monitoria(_sessao uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE s public.monitoria_sessoes; uid uuid := auth.uid(); _papel text;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'nao autenticada'; END IF;
  SELECT * INTO s FROM public.monitoria_sessoes WHERE id = _sessao FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'sessao inexistente'; END IF;
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
  IF s.criadora_confirmou AND s.monitora_confirmou AND s.monitora_id IS NOT NULL AND s.monitora_id <> s.criadora_id THEN
    UPDATE public.profiles SET xp = xp + 10, horas = horas + 1 WHERE id = s.criadora_id;
    UPDATE public.profiles SET xp = xp + 50, monitorias = monitorias + 1, lideranca = lideranca + 1, horas = horas + 1 WHERE id = s.monitora_id;
    INSERT INTO public.estudante_habilidades (estudante_id, habilidade_id)
    SELECT s.monitora_id, h.id FROM public.habilidades h
    WHERE h.criterio_tipo = 'monitoria' AND h.criterio_valor = s.materia
    ON CONFLICT DO NOTHING;
    INSERT INTO public.estudante_habilidades (estudante_id, habilidade_id)
    SELECT s.criadora_id, h.id FROM public.habilidades h
    WHERE h.criterio_tipo = 'ajuda' AND h.criterio_valor = s.materia
    ON CONFLICT DO NOTHING;
    PERFORM public.conceder_medalhas(s.monitora_id);
    PERFORM public.conceder_medalhas(s.criadora_id);
  END IF;
  RETURN _papel;
END $function$;