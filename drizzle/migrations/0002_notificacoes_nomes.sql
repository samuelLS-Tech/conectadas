CREATE OR REPLACE FUNCTION public.notificar_interesse_empresa() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notificacoes (user_id, texto) VALUES (NEW.estudante_id,
    'A empresa de ' || NEW.empresa_nome || ' demonstrou interesse no seu perfil' || coalesce(' (' || NEW.oportunidade || ')', '') || ' 🚀');
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.validar_atividade(_id uuid, _aprovar boolean) RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.atividades; uid uuid := auth.uid(); prof text;
BEGIN
  IF uid IS NULL OR NOT has_role(uid, 'professor') THEN RAISE EXCEPTION 'apenas professores'; END IF;
  SELECT * INTO a FROM public.atividades WHERE id = _id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'atividade inexistente'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = a.estudante_id AND p.escola_id IS NOT NULL AND p.escola_id = public.minha_escola()) THEN
    RAISE EXCEPTION 'estudante de outra escola';
  END IF;
  IF a.status <> 'pendente' THEN RETURN 'ja_validada'; END IF;
  SELECT nome INTO prof FROM public.profiles WHERE id = uid;
  UPDATE public.atividades SET status = CASE WHEN _aprovar THEN 'aprovada' ELSE 'recusada' END,
    validada_por = uid, validada_em = now() WHERE id = _id;
  INSERT INTO public.notificacoes (user_id, texto) VALUES (a.estudante_id,
    'Sua atividade "' || a.titulo || '" foi ' || CASE WHEN _aprovar THEN 'aprovada ✅' ELSE 'recusada ❌' END || ' pelo(a) professor(a) ' || coalesce(nullif(prof, ''), '') || '.');
  RETURN CASE WHEN _aprovar THEN 'aprovada' ELSE 'recusada' END;
END $$;