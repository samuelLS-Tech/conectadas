CREATE TYPE public.app_role AS ENUM ('estudante', 'empresa', 'professor');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  serie text,
  turma text,
  xp integer NOT NULL DEFAULT 0,
  monitorias integer NOT NULL DEFAULT 0,
  exercicios integer NOT NULL DEFAULT 0,
  horas integer NOT NULL DEFAULT 0,
  lideranca integer NOT NULL DEFAULT 0,
  atividades_concluidas text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Own profile readable" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Professores veem estudantes" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'professor') AND public.has_role(id, 'estudante'));
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _tipo text := coalesce(NEW.raw_user_meta_data->>'tipo', 'estudante');
BEGIN
  IF _tipo NOT IN ('estudante','empresa','professor') THEN _tipo := 'estudante'; END IF;
  INSERT INTO public.profiles (id, nome, serie, turma)
  VALUES (NEW.id, coalesce(NEW.raw_user_meta_data->>'nome', ''),
          NULLIF(NEW.raw_user_meta_data->>'serie', ''), NULLIF(NEW.raw_user_meta_data->>'turma', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _tipo::public.app_role);
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.monitoria_sessoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criadora_id uuid NOT NULL DEFAULT auth.uid(),
  monitora_nome text NOT NULL,
  materia text NOT NULL,
  criadora_confirmou boolean NOT NULL DEFAULT false,
  monitora_id uuid,
  monitora_confirmou boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.monitoria_sessoes TO authenticated;
GRANT ALL ON public.monitoria_sessoes TO service_role;
ALTER TABLE public.monitoria_sessoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sessoes visiveis a usuarias logadas" ON public.monitoria_sessoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Criar propria sessao" ON public.monitoria_sessoes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = criadora_id AND criadora_confirmou = false AND monitora_confirmou = false AND monitora_id IS NULL);

CREATE OR REPLACE FUNCTION public.confirmar_monitoria(_sessao uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.monitoria_sessoes; uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'nao autenticada'; END IF;
  SELECT * INTO s FROM public.monitoria_sessoes WHERE id = _sessao FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'sessao inexistente'; END IF;
  IF uid = s.criadora_id THEN
    IF s.criadora_confirmou THEN RETURN 'ja_confirmado'; END IF;
    UPDATE public.monitoria_sessoes SET criadora_confirmou = true WHERE id = _sessao;
    UPDATE public.profiles SET xp = xp + 10, horas = horas + 1 WHERE id = uid;
    RETURN 'aluna';
  END IF;
  IF s.monitora_id IS NOT NULL AND s.monitora_id <> uid THEN RETURN 'sessao_ocupada'; END IF;
  IF s.monitora_confirmou THEN RETURN 'ja_confirmado'; END IF;
  UPDATE public.monitoria_sessoes SET monitora_id = uid, monitora_confirmou = true WHERE id = _sessao;
  UPDATE public.profiles SET xp = xp + 50, monitorias = monitorias + 1, lideranca = lideranca + 1, horas = horas + 1 WHERE id = uid;
  RETURN 'monitora';
END $$;
REVOKE EXECUTE ON FUNCTION public.confirmar_monitoria(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.confirmar_monitoria(uuid) TO authenticated;
ALTER PUBLICATION supabase_realtime ADD TABLE public.monitoria_sessoes;