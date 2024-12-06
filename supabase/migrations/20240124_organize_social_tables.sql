-- Atualizar a tabela lesson_likes
ALTER TABLE lesson_likes
    DROP CONSTRAINT IF EXISTS lesson_likes_lesson_id_user_id_key,
    ADD CONSTRAINT lesson_likes_lesson_id_fkey 
        FOREIGN KEY (lesson_id) REFERENCES aulas(id)
        ON DELETE CASCADE,
    ADD CONSTRAINT lesson_likes_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    ADD CONSTRAINT lesson_likes_unique_like 
        UNIQUE (lesson_id, user_id),
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

-- Atualizar a tabela lesson_comments
ALTER TABLE lesson_comments
    ADD CONSTRAINT lesson_comments_lesson_id_fkey 
        FOREIGN KEY (lesson_id) REFERENCES aulas(id)
        ON DELETE CASCADE,
    ADD CONSTRAINT lesson_comments_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Criar trigger para atualizar updated_at em comentários
CREATE OR REPLACE FUNCTION update_lesson_comment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lesson_comment_timestamp
    BEFORE UPDATE ON lesson_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_lesson_comment_timestamp();

-- Atualizar a tabela lesson_favorites
ALTER TABLE lesson_favorites
    DROP CONSTRAINT IF EXISTS lesson_favorites_lesson_id_user_id_key,
    ADD CONSTRAINT lesson_favorites_lesson_id_fkey 
        FOREIGN KEY (lesson_id) REFERENCES aulas(id)
        ON DELETE CASCADE,
    ADD CONSTRAINT lesson_favorites_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,
    ADD CONSTRAINT lesson_favorites_unique_favorite 
        UNIQUE (lesson_id, user_id),
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_lesson_likes_lesson_id ON lesson_likes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_likes_user_id ON lesson_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_lesson_id ON lesson_comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_comments_user_id ON lesson_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_favorites_lesson_id ON lesson_favorites(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_favorites_user_id ON lesson_favorites(user_id);

-- Criar views para facilitar consultas
CREATE OR REPLACE VIEW vw_aulas_social AS
SELECT 
    a.id,
    a.id_aula,
    a.titulo,
    a.descricao,
    a.video_id,
    a.duracao,
    a.visibilidade,
    a.ativo,
    (SELECT COUNT(*) FROM lesson_likes l WHERE l.lesson_id = a.id) as likes_count,
    (SELECT COUNT(*) FROM lesson_comments c WHERE c.lesson_id = a.id) as comments_count,
    (SELECT COUNT(*) FROM lesson_favorites f WHERE f.lesson_id = a.id) as favorites_count
FROM aulas a
WHERE a.ativo = true AND a.visibilidade = true;

-- View para detalhes sociais de uma aula específica
CREATE OR REPLACE VIEW vw_aula_social_details AS
SELECT 
    a.id as aula_id,
    a.id_aula,
    a.titulo,
    l.user_id as like_user_id,
    f.user_id as favorite_user_id,
    c.id as comment_id,
    c.user_id as comment_user_id,
    c.content as comment_content,
    c.created_at as comment_created_at,
    u.nome as user_nome,
    u.foto as user_foto
FROM aulas a
LEFT JOIN lesson_likes l ON l.lesson_id = a.id
LEFT JOIN lesson_favorites f ON f.lesson_id = a.id
LEFT JOIN lesson_comments c ON c.lesson_id = a.id
LEFT JOIN usuarios u ON u.id_usuario = COALESCE(l.user_id, f.user_id, c.user_id)
WHERE a.ativo = true AND a.visibilidade = true;

-- Função para verificar se um usuário já interagiu com uma aula
CREATE OR REPLACE FUNCTION check_user_lesson_interactions(p_lesson_id bigint, p_user_id uuid)
RETURNS TABLE (
    has_liked boolean,
    has_favorited boolean,
    comments_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM lesson_likes WHERE lesson_id = p_lesson_id AND user_id = p_user_id),
        EXISTS(SELECT 1 FROM lesson_favorites WHERE lesson_id = p_lesson_id AND user_id = p_user_id),
        COUNT(DISTINCT id)::bigint FROM lesson_comments WHERE lesson_id = p_lesson_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
