-- Primeiro remover as constraints existentes
ALTER TABLE public.lesson_likes DROP CONSTRAINT IF EXISTS lesson_likes_lesson_id_user_id_key;

-- Alterar o tipo da coluna lesson_id para TEXT
ALTER TABLE public.lesson_likes 
ALTER COLUMN lesson_id TYPE TEXT USING lesson_id::TEXT;

-- Recriar a constraint de unicidade
ALTER TABLE public.lesson_likes 
ADD CONSTRAINT lesson_likes_lesson_id_user_id_key UNIQUE (lesson_id, user_id);
