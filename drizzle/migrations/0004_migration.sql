CREATE OR REPLACE FUNCTION public.concluir_atividade(_ref text, _titulo text, _disciplina text, _acertos integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  RETURN _xp;
END $$;
REVOKE EXECUTE ON FUNCTION public.concluir_atividade(text, text, text, integer) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.concluir_atividade(text, text, text, integer) TO authenticated;

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (nome, serie, turma) ON public.profiles TO authenticated;
REVOKE INSERT ON public.atividades FROM authenticated;

CREATE OR REPLACE FUNCTION public.confirmar_monitoria(_sessao uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  -- Recompensas só quando as duas participantes confirmaram (cada uma no próprio aparelho)
  IF s.criadora_confirmou AND s.monitora_confirmou AND s.monitora_id IS NOT NULL AND s.monitora_id <> s.criadora_id THEN
    UPDATE public.profiles SET xp = xp + 10, horas = horas + 1 WHERE id = s.criadora_id;
    UPDATE public.profiles SET xp = xp + 50, monitorias = monitorias + 1, lideranca = lideranca + 1, horas = horas + 1 WHERE id = s.monitora_id;
  END IF;
  RETURN _papel;
END $$;