DROP POLICY IF EXISTS "Sessoes visiveis a usuarias logadas" ON public.monitoria_sessoes;
CREATE POLICY "Participantes veem sessao" ON public.monitoria_sessoes FOR SELECT TO authenticated
  USING (auth.uid() = criadora_id OR auth.uid() = monitora_id);

DROP POLICY IF EXISTS "Ofertas visiveis" ON public.monitoria_ofertas;
CREATE POLICY "Estudantes veem ofertas" ON public.monitoria_ofertas FOR SELECT TO authenticated
  USING (auth.uid() = autora_id OR public.has_role(auth.uid(), 'estudante'::app_role));