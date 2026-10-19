CREATE TABLE IF NOT EXISTS public.config_privada (chave text PRIMARY KEY, valor text NOT NULL);
ALTER TABLE public.config_privada ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.config_privada FROM anon, authenticated, public;
GRANT ALL ON public.config_privada TO service_role;
INSERT INTO public.config_privada (chave, valor) VALUES ('codigo_professor', 'PROF-7Q4K-2026') ON CONFLICT (chave) DO NOTHING;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _tipo text := coalesce(NEW.raw_user_meta_data->>'tipo', 'estudante'); _codigo text;
BEGIN
  IF _tipo NOT IN ('estudante','empresa','professor') THEN _tipo := 'estudante'; END IF;
  IF _tipo = 'professor' THEN
    SELECT valor INTO _codigo FROM public.config_privada WHERE chave = 'codigo_professor';
    IF _codigo IS NULL OR coalesce(NEW.raw_user_meta_data->>'codigo_professor', '') <> _codigo THEN
      RAISE EXCEPTION 'codigo_professor_invalido';
    END IF;
  END IF;
  INSERT INTO public.profiles (id, nome, serie, turma, escola_id, disciplina)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'nome', ''),
          NULLIF(NEW.raw_user_meta_data->>'serie', ''), NULLIF(NEW.raw_user_meta_data->>'turma', ''),
          NULLIF(NEW.raw_user_meta_data->>'escola_id', ''), NULLIF(NEW.raw_user_meta_data->>'disciplina', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _tipo::public.app_role);
  RETURN NEW;
END $function$;