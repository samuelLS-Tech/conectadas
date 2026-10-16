ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS escola_id text, ADD COLUMN IF NOT EXISTS disciplina text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _tipo text := coalesce(NEW.raw_user_meta_data->>'tipo', 'estudante');
BEGIN
  IF _tipo NOT IN ('estudante','empresa','professor') THEN _tipo := 'estudante'; END IF;
  INSERT INTO public.profiles (id, nome, serie, turma, escola_id, disciplina)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'nome', ''),
          NULLIF(NEW.raw_user_meta_data->>'serie', ''), NULLIF(NEW.raw_user_meta_data->>'turma', ''),
          NULLIF(NEW.raw_user_meta_data->>'escola_id', ''), NULLIF(NEW.raw_user_meta_data->>'disciplina', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _tipo::public.app_role);
  RETURN NEW;
END $function$;

CREATE OR REPLACE FUNCTION public.minha_escola() RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT escola_id FROM public.profiles WHERE id = auth.uid() $$;

DROP POLICY IF EXISTS "Professores veem estudantes" ON public.profiles;
CREATE POLICY "Professores veem estudantes da escola" ON public.profiles FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'professor') AND has_role(id, 'estudante') AND escola_id IS NOT NULL AND escola_id = public.minha_escola());

-- Notificações internas
CREATE TABLE public.notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  texto text NOT NULL,
  lida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notificacoes TO authenticated;
GRANT ALL ON public.notificacoes TO service_role;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver proprias notificacoes" ON public.notificacoes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Marcar proprias como lidas" ON public.notificacoes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Atividades enviadas
CREATE TABLE public.atividades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estudante_id uuid NOT NULL DEFAULT auth.uid(),
  atividade_ref text NOT NULL,
  titulo text NOT NULL,
  disciplina text NOT NULL,
  acertos integer NOT NULL,
  total integer NOT NULL,
  xp integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','aprovada','recusada')),
  validada_por uuid,
  validada_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (estudante_id, atividade_ref)
);
GRANT SELECT, INSERT ON public.atividades TO authenticated;
GRANT ALL ON public.atividades TO service_role;
ALTER TABLE public.atividades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Estudante envia propria" ON public.atividades FOR INSERT TO authenticated
WITH CHECK (auth.uid() = estudante_id AND status = 'pendente' AND validada_por IS NULL);
CREATE POLICY "Estudante ve propria" ON public.atividades FOR SELECT TO authenticated USING (auth.uid() = estudante_id);
CREATE POLICY "Professor ve da escola" ON public.atividades FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'professor') AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = estudante_id AND p.escola_id IS NOT NULL AND p.escola_id = public.minha_escola()));

CREATE OR REPLACE FUNCTION public.validar_atividade(_id uuid, _aprovar boolean) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE a public.atividades; uid uuid := auth.uid();
BEGIN
  IF uid IS NULL OR NOT has_role(uid, 'professor') THEN RAISE EXCEPTION 'apenas professores'; END IF;
  SELECT * INTO a FROM public.atividades WHERE id = _id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'atividade inexistente'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = a.estudante_id AND p.escola_id IS NOT NULL AND p.escola_id = public.minha_escola()) THEN
    RAISE EXCEPTION 'estudante de outra escola';
  END IF;
  IF a.status <> 'pendente' THEN RETURN 'ja_validada'; END IF;
  UPDATE public.atividades SET status = CASE WHEN _aprovar THEN 'aprovada' ELSE 'recusada' END,
    validada_por = uid, validada_em = now() WHERE id = _id;
  INSERT INTO public.notificacoes (user_id, texto) VALUES (a.estudante_id,
    'Sua atividade "' || a.titulo || '" foi ' || CASE WHEN _aprovar THEN 'aprovada ✅' ELSE 'recusada ❌' END || ' pelo professor.');
  RETURN CASE WHEN _aprovar THEN 'aprovada' ELSE 'recusada' END;
END $$;

-- Monitorias: ofertas e pedidos
CREATE TABLE public.monitoria_ofertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autora_id uuid NOT NULL DEFAULT auth.uid(),
  autora_nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('oferta','pedido')),
  disciplina text NOT NULL,
  assunto text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.monitoria_ofertas TO authenticated;
GRANT ALL ON public.monitoria_ofertas TO service_role;
ALTER TABLE public.monitoria_ofertas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ofertas visiveis" ON public.monitoria_ofertas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Criar propria oferta" ON public.monitoria_ofertas FOR INSERT TO authenticated WITH CHECK (auth.uid() = autora_id);

CREATE TABLE public.monitoria_interesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oferta_id uuid NOT NULL REFERENCES public.monitoria_ofertas(id) ON DELETE CASCADE,
  interessada_id uuid NOT NULL DEFAULT auth.uid(),
  interessada_nome text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (oferta_id, interessada_id)
);
GRANT SELECT, INSERT ON public.monitoria_interesses TO authenticated;
GRANT ALL ON public.monitoria_interesses TO service_role;
ALTER TABLE public.monitoria_interesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Manifestar interesse" ON public.monitoria_interesses FOR INSERT TO authenticated WITH CHECK (auth.uid() = interessada_id);
CREATE POLICY "Ver interesses envolvidos" ON public.monitoria_interesses FOR SELECT TO authenticated
USING (auth.uid() = interessada_id OR EXISTS (SELECT 1 FROM public.monitoria_ofertas o WHERE o.id = oferta_id AND o.autora_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.notificar_interesse_monitoria() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE o public.monitoria_ofertas;
BEGIN
  SELECT * INTO o FROM public.monitoria_ofertas WHERE id = NEW.oferta_id;
  IF o.autora_id <> NEW.interessada_id THEN
    INSERT INTO public.notificacoes (user_id, texto) VALUES (o.autora_id,
      NEW.interessada_nome || ' tem interesse na sua monitoria de ' || o.disciplina || ' (' || o.assunto || ').');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_interesse_monitoria AFTER INSERT ON public.monitoria_interesses FOR EACH ROW EXECUTE FUNCTION public.notificar_interesse_monitoria();

-- Interesse empresarial
CREATE TABLE public.empresa_interesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL DEFAULT auth.uid(),
  empresa_nome text NOT NULL,
  estudante_id uuid NOT NULL,
  oportunidade text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (empresa_id, estudante_id)
);
GRANT SELECT, INSERT ON public.empresa_interesses TO authenticated;
GRANT ALL ON public.empresa_interesses TO service_role;
ALTER TABLE public.empresa_interesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Empresa manifesta" ON public.empresa_interesses FOR INSERT TO authenticated
WITH CHECK (auth.uid() = empresa_id AND has_role(auth.uid(), 'empresa') AND has_role(estudante_id, 'estudante'));
CREATE POLICY "Partes veem interesse" ON public.empresa_interesses FOR SELECT TO authenticated
USING (auth.uid() = empresa_id OR auth.uid() = estudante_id);

CREATE OR REPLACE FUNCTION public.notificar_interesse_empresa() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  INSERT INTO public.notificacoes (user_id, texto) VALUES (NEW.estudante_id,
    'A empresa ' || NEW.empresa_nome || ' demonstrou interesse no seu perfil' || coalesce(' (' || NEW.oportunidade || ')', '') || ' 🚀');
  RETURN NEW;
END $$;
CREATE TRIGGER trg_interesse_empresa AFTER INSERT ON public.empresa_interesses FOR EACH ROW EXECUTE FUNCTION public.notificar_interesse_empresa();

-- Lista de talentos reais para empresas (sem e-mail)
CREATE OR REPLACE FUNCTION public.listar_talentos() RETURNS TABLE (id uuid, nome text, serie text, turma text, escola_id text, xp integer, monitorias integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT has_role(auth.uid(), 'empresa') THEN RETURN; END IF;
  RETURN QUERY SELECT p.id, p.nome, p.serie, p.turma, p.escola_id, p.xp, p.monitorias
    FROM public.profiles p WHERE has_role(p.id, 'estudante') ORDER BY p.xp DESC;
END $$;
REVOKE EXECUTE ON FUNCTION public.listar_talentos() FROM anon;
REVOKE EXECUTE ON FUNCTION public.validar_atividade(uuid, boolean) FROM anon;