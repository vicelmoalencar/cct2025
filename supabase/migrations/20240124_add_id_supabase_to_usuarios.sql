-- Adicionar coluna id_supabase à tabela usuarios
ALTER TABLE public.usuarios
ADD COLUMN id_supabase UUID REFERENCES auth.users(id);

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_usuarios_id_supabase ON usuarios(id_supabase);

-- Adicionar constraint de unicidade
ALTER TABLE public.usuarios
ADD CONSTRAINT usuarios_id_supabase_key UNIQUE (id_supabase);

-- Atualizar a função de criação de perfil para incluir id_supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (id_usuario, id_supabase, email, nome)
    VALUES (
        uuid_generate_v4(),
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
END;
$$ language plpgsql security definer;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
