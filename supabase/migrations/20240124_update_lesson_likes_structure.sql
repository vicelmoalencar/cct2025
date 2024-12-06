-- Primeiro remover as constraints existentes
ALTER TABLE public.lesson_likes DROP CONSTRAINT IF EXISTS lesson_likes_lesson_id_user_id_key;
ALTER TABLE public.lesson_likes DROP CONSTRAINT IF EXISTS lesson_likes_user_id_fkey;

-- Renomear colunas e alterar tipos
ALTER TABLE public.lesson_likes 
DROP COLUMN IF EXISTS lesson_id,
DROP COLUMN IF EXISTS user_id,
ADD COLUMN id_aula UUID REFERENCES public.aulas(id_aula),
ADD COLUMN id_usuario UUID REFERENCES public.usuarios(id_usuario);

-- Adicionar constraint de unicidade
ALTER TABLE public.lesson_likes 
ADD CONSTRAINT lesson_likes_id_aula_id_usuario_key UNIQUE (id_aula, id_usuario);
