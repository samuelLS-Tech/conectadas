GRANT DELETE ON public.monitoria_ofertas TO authenticated;
DROP POLICY IF EXISTS "Excluir propria oferta" ON public.monitoria_ofertas;
CREATE POLICY "Excluir propria oferta" ON public.monitoria_ofertas FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = autora_id);

CREATE INDEX IF NOT EXISTS profiles_ranking_escola_idx
ON public.profiles (escola_id, xp DESC, created_at, id)
WHERE escola_id IS NOT NULL;

DROP FUNCTION IF EXISTS public.ranking_minha_escola();
CREATE FUNCTION public.ranking_minha_escola()
RETURNS TABLE (posicao bigint, id uuid, nome text, xp integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _uid uuid := auth.uid(); _escola text;
BEGIN
  IF _uid IS NULL OR NOT public.has_role(_uid, 'estudante') THEN
    RAISE EXCEPTION 'apenas estudantes';
  END IF;
  SELECT p.escola_id INTO _escola FROM public.profiles p WHERE p.id = _uid;
  IF _escola IS NULL THEN RETURN; END IF;
  RETURN QUERY
  SELECT row_number() OVER (ORDER BY p.xp DESC, p.created_at, p.id), p.id, p.nome, p.xp
  FROM public.profiles p
  WHERE p.escola_id = _escola AND public.has_role(p.id, 'estudante')
  ORDER BY p.xp DESC, p.created_at, p.id;
END
$function$;
REVOKE EXECUTE ON FUNCTION public.ranking_minha_escola() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ranking_minha_escola() TO authenticated;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_contato text,
  ADD COLUMN IF NOT EXISTS compartilhar_email_contato boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_contato_valido;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_contato_valido CHECK (
  email_contato IS NULL OR (
    length(email_contato) <= 254 AND
    email_contato ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  )
);
GRANT UPDATE (nome, serie, turma, email_contato, compartilhar_email_contato) ON public.profiles TO authenticated;

ALTER TABLE public.empresa_interesses ADD COLUMN IF NOT EXISTS empresa_email text;
ALTER TABLE public.empresa_interesses ALTER COLUMN empresa_nome SET DEFAULT '';
ALTER TABLE public.notificacoes
  ADD COLUMN IF NOT EXISTS contato_email text,
  ADD COLUMN IF NOT EXISTS empresa_interesse_id uuid REFERENCES public.empresa_interesses(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS empresa_interesses_empresa_id_idx ON public.empresa_interesses (empresa_id);
CREATE INDEX IF NOT EXISTS notificacoes_empresa_interesse_id_idx ON public.notificacoes (empresa_interesse_id)
WHERE empresa_interesse_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.preparar_interesse_empresa()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE empresa public.profiles;
BEGIN
  IF auth.uid() IS NULL OR NEW.empresa_id <> auth.uid() OR NOT public.has_role(auth.uid(), 'empresa') THEN
    RAISE EXCEPTION 'apenas empresas';
  END IF;
  IF NOT public.has_role(NEW.estudante_id, 'estudante') THEN
    RAISE EXCEPTION 'estudante inexistente';
  END IF;
  SELECT * INTO empresa FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN RAISE EXCEPTION 'perfil da empresa inexistente'; END IF;
  NEW.empresa_nome := coalesce(nullif(trim(empresa.nome), ''), 'Empresa');
  NEW.empresa_email := CASE
    WHEN empresa.compartilhar_email_contato THEN empresa.email_contato
    ELSE NULL
  END;
  RETURN NEW;
END
$function$;
DROP TRIGGER IF EXISTS trg_preparar_interesse_empresa ON public.empresa_interesses;
CREATE TRIGGER trg_preparar_interesse_empresa
BEFORE INSERT ON public.empresa_interesses
FOR EACH ROW EXECUTE FUNCTION public.preparar_interesse_empresa();
REVOKE ALL ON FUNCTION public.preparar_interesse_empresa() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.notificar_interesse_empresa()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.notificacoes (user_id, texto, contato_email, empresa_interesse_id) VALUES (
    NEW.estudante_id,
    'A empresa ' || NEW.empresa_nome || ' demonstrou interesse no seu perfil' ||
      coalesce(' (' || NEW.oportunidade || ')', '') || '. 🚀',
    NEW.empresa_email,
    NEW.id
  );
  RETURN NEW;
END
$function$;
REVOKE ALL ON FUNCTION public.notificar_interesse_empresa() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.sincronizar_contato_empresa()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.empresa_interesses
  SET empresa_email = CASE WHEN NEW.compartilhar_email_contato THEN NEW.email_contato ELSE NULL END
  WHERE empresa_id = NEW.id;

  UPDATE public.notificacoes n
  SET contato_email = i.empresa_email
  FROM public.empresa_interesses i
  WHERE n.empresa_interesse_id = i.id AND i.empresa_id = NEW.id;
  RETURN NEW;
END
$function$;
DROP TRIGGER IF EXISTS trg_sincronizar_contato_empresa ON public.profiles;
CREATE TRIGGER trg_sincronizar_contato_empresa
AFTER UPDATE OF email_contato, compartilhar_email_contato ON public.profiles
FOR EACH ROW
WHEN (OLD.email_contato IS DISTINCT FROM NEW.email_contato OR OLD.compartilhar_email_contato IS DISTINCT FROM NEW.compartilhar_email_contato)
EXECUTE FUNCTION public.sincronizar_contato_empresa();
REVOKE ALL ON FUNCTION public.sincronizar_contato_empresa() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.concluir_onboarding(
  _tipo public.app_role,
  _nome text,
  _serie text DEFAULT NULL,
  _turma text DEFAULT NULL,
  _escola_id text DEFAULT NULL,
  _disciplina text DEFAULT NULL,
  _codigo_professor text DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _uid uuid := auth.uid(); _codigo text;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'nao autenticada'; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _uid)
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = _uid) THEN
    RAISE EXCEPTION 'onboarding_ja_concluido';
  END IF;
  IF nullif(trim(_nome), '') IS NULL OR length(trim(_nome)) > 120 THEN
    RAISE EXCEPTION 'nome_invalido';
  END IF;
  IF _tipo = 'professor' THEN
    SELECT valor INTO _codigo FROM public.config_privada WHERE chave = 'codigo_professor';
    IF _codigo IS NULL OR coalesce(_codigo_professor, '') <> _codigo THEN
      RAISE EXCEPTION 'codigo_professor_invalido';
    END IF;
  END IF;
  INSERT INTO public.profiles (id, nome, serie, turma, escola_id, disciplina)
  VALUES (
    _uid,
    trim(_nome),
    CASE WHEN _tipo = 'estudante' THEN nullif(_serie, '') END,
    CASE WHEN _tipo = 'estudante' THEN nullif(_turma, '') END,
    CASE WHEN _tipo <> 'empresa' THEN nullif(_escola_id, '') END,
    CASE WHEN _tipo = 'professor' THEN nullif(_disciplina, '') END
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, _tipo);
END
$function$;
REVOKE EXECUTE ON FUNCTION public.concluir_onboarding(public.app_role, text, text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.concluir_onboarding(public.app_role, text, text, text, text, text, text) TO authenticated;