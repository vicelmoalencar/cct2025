-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Planos visíveis para todos" ON public.planos;
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.planos;
DROP POLICY IF EXISTS "Membros podem ver seus próprios dados" ON public.membros;
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.membros;
DROP POLICY IF EXISTS "Cursos visíveis para todos" ON public.cursos;
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.cursos;
DROP POLICY IF EXISTS "Módulos visíveis para todos" ON public.modulos;
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.modulos;
DROP POLICY IF EXISTS "Aulas visíveis para todos" ON public.aulas;
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.aulas;
DROP POLICY IF EXISTS "Membros podem ver suas próprias aulas assistidas" ON public.aulas_assistidas;
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.aulas_assistidas;

-- Políticas para planos
CREATE POLICY "Planos visíveis para todos" ON public.planos
    FOR SELECT USING (true);

CREATE POLICY "Enable all access for admin users" ON public.planos
    FOR ALL
    USING (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    )
    WITH CHECK (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    );

-- Políticas para membros
CREATE POLICY "Membros podem ver seus próprios dados" ON public.membros
    FOR SELECT USING (auth.uid() = id_usuario);

CREATE POLICY "Enable all access for admin users" ON public.membros
    FOR ALL
    USING (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    )
    WITH CHECK (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    );

-- Políticas para cursos
CREATE POLICY "Cursos visíveis para todos" ON public.cursos
    FOR SELECT USING (status = 'ativo');

CREATE POLICY "Enable all access for admin users" ON public.cursos
    FOR ALL
    USING (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    )
    WITH CHECK (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    );

-- Políticas para módulos
CREATE POLICY "Módulos visíveis para todos" ON public.modulos
    FOR SELECT USING (status = 'ativo');

CREATE POLICY "Enable all access for admin users" ON public.modulos
    FOR ALL
    USING (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    )
    WITH CHECK (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    );

-- Políticas para aulas
CREATE POLICY "Aulas visíveis para todos" ON public.aulas
    FOR SELECT USING (status = 'ativo');

CREATE POLICY "Enable all access for admin users" ON public.aulas
    FOR ALL
    USING (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    )
    WITH CHECK (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    );

-- Políticas para aulas assistidas
CREATE POLICY "Membros podem ver suas próprias aulas assistidas" ON public.aulas_assistidas
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id_usuario 
            FROM public.membros 
            WHERE id_membro = aulas_assistidas.id_membro
        )
    );

CREATE POLICY "Membros podem gerenciar suas próprias aulas assistidas" ON public.aulas_assistidas
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT id_usuario 
            FROM public.membros 
            WHERE id_membro = aulas_assistidas.id_membro
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT id_usuario 
            FROM public.membros 
            WHERE id_membro = aulas_assistidas.id_membro
        )
    );

CREATE POLICY "Enable all access for admin users" ON public.aulas_assistidas
    FOR ALL
    USING (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    )
    WITH CHECK (
        (CURRENT_USER = 'authenticated'::name) AND 
        ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role') = 'admin'
    );
