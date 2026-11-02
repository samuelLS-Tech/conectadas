CREATE OR REPLACE FUNCTION public.salvar_feedback_academico(_vinculo uuid, _feedback uuid DEFAULT NULL, _criterios text[] DEFAULT '{}', _comentario text DEFAULT NULL)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); v public.vinculos_academicos; f public.feedbacks_academicos; _c text; _id uuid;
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'professor') THEN RAISE EXCEPTION 'apenas_professores'; END IF;
  _criterios := coalesce(_criterios, '{}');
  IF cardinality(_criterios)>5 OR array_position(_criterios,NULL) IS NOT NULL OR NOT (_criterios <@ ARRAY['comprometimento','participacao','evolucao','colaboracao','iniciativa']) THEN RAISE EXCEPTION 'criterio_invalido'; END IF;
  _c := public.texto_limpo(_comentario, 1000);
  IF cardinality(_criterios) = 0 AND _c IS NULL THEN RAISE EXCEPTION 'feedback_vazio'; END IF;
  IF _feedback = '00000000-0000-0000-0000-000000000000'::uuid THEN _feedback := NULL; END IF;
  IF _feedback IS NOT NULL THEN
    SELECT * INTO f FROM public.feedbacks_academicos WHERE id = _feedback FOR UPDATE;
    IF NOT FOUND OR f.professor_id <> uid OR f.removido THEN RAISE EXCEPTION 'sem_permissao'; END IF;
    _vinculo := f.vinculo_id;
  END IF;
  SELECT * INTO v FROM public.vinculos_academicos WHERE id = _vinculo FOR UPDATE;
  IF NOT FOUND OR v.professor_id <> uid OR v.status <> 'ativo' OR NOT EXISTS (
    SELECT 1 FROM public.profiles p JOIN public.profiles e ON e.id=v.estudante_id
    WHERE p.id=uid AND p.escola_id=v.escola_id AND e.escola_id=v.escola_id AND p.disciplina=v.disciplina
      AND e.serie IS NOT DISTINCT FROM v.serie AND e.turma IS NOT DISTINCT FROM v.turma
  ) THEN RAISE EXCEPTION 'sem_vinculo_ativo'; END IF;
  IF _feedback IS NOT NULL THEN
    INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao, conteudo_anterior)
    VALUES ('academico', f.id, uid, 'editado', jsonb_build_object('criterios', f.criterios, 'comentario', f.comentario));
    UPDATE public.feedbacks_academicos SET criterios = _criterios, comentario = _c, updated_at = now() WHERE id = f.id;
    RETURN f.id;
  END IF;
  INSERT INTO public.feedbacks_academicos (vinculo_id, professor_id, professor_nome, estudante_id, disciplina, criterios, comentario)
  VALUES (v.id, uid, v.professor_nome, v.estudante_id, v.disciplina, _criterios, _c) RETURNING id INTO _id;
  INSERT INTO public.historico_avaliacoes (categoria, registro_id, autor_id, acao) VALUES ('academico', _id, uid, 'criado');
  INSERT INTO public.notificacoes (user_id, texto) VALUES (v.estudante_id, 'Você recebeu um feedback acadêmico de ' || v.disciplina || '. Veja em Meu Portfólio.');
  RETURN _id;
END $function$;
CREATE OR REPLACE FUNCTION public.propor_experiencia(_estudante uuid, _tipo text, _descricao text, _inicio date, _fim date DEFAULT NULL)
 RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); emp public.profiles; est public.profiles; _id uuid;
BEGIN
  IF uid IS NULL OR NOT public.has_role(uid, 'empresa') THEN RAISE EXCEPTION 'apenas_empresas'; END IF;
  IF NOT public.has_role(_estudante, 'estudante') THEN RAISE EXCEPTION 'estudante_inexistente'; END IF;
  IF _tipo IS NULL OR _tipo NOT IN ('estagio','trabalho','projeto','outra') THEN RAISE EXCEPTION 'tipo_invalido'; END IF;
  IF _inicio IS NULL OR _inicio > current_date OR (_fim IS NOT NULL AND (_fim < _inicio OR _fim > current_date)) THEN RAISE EXCEPTION 'periodo_invalido'; END IF;
  SELECT * INTO emp FROM public.profiles WHERE id = uid;
  SELECT * INTO est FROM public.profiles WHERE id = _estudante;
  INSERT INTO public.experiencias_profissionais (empresa_id, empresa_nome, estudante_id, estudante_nome, tipo, descricao, inicio, fim)
  VALUES (uid, coalesce(nullif(emp.nome, ''), 'Empresa'), _estudante, coalesce(nullif(est.nome, ''), 'Estudante'), _tipo,
    coalesce(public.texto_limpo(_descricao, 300), ''), _inicio, _fim) RETURNING id INTO _id;
  INSERT INTO public.notificacoes (user_id, texto) VALUES (_estudante,
    'A empresa ' || coalesce(nullif(emp.nome, ''), '') || ' registrou uma experiência profissional com você. Confirme ou recuse em Meu Portfólio.');
  RETURN _id;
END $function$;