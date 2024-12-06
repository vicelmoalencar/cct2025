-- Criar tabela de usuários autorizados
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar o updated_at
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_usuarios_updated_at();

-- Políticas de segurança
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Permitir leitura para todos (necessário para verificar emails autorizados)
CREATE POLICY "Permitir leitura da tabela usuarios"
    ON usuarios FOR SELECT
    USING (true);

-- Inserir alguns usuários de teste
INSERT INTO usuarios (email, nome)
VALUES ('ramon.trafego@gmail.com', 'Ramon')
ON CONFLICT (email) DO NOTHING;
