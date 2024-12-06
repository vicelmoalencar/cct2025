-- Criar tipo enum para tipo de usuário
CREATE TYPE user_type AS ENUM ('aluno', 'professor', 'admin');

-- Criar tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_bubble_user VARCHAR(255),
    nome VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    assinatura_ativa BOOLEAN DEFAULT false,
    ativo BOOLEAN DEFAULT true,
    cpf VARCHAR(14),
    dt_expiracao TIMESTAMP WITH TIME ZONE,
    end_cep VARCHAR(9),
    end_cidade VARCHAR(255),
    end_estado VARCHAR(2),
    end_logradouro VARCHAR(255),
    end_numero VARCHAR(50),
    foto VARCHAR(255),
    id_bubble_plano_atual VARCHAR(255),
    senha_provisoria VARCHAR(255),
    suporte BOOLEAN DEFAULT false,
    telefone VARCHAR(20),
    teste_gratis BOOLEAN DEFAULT false,
    tipo user_type DEFAULT 'aluno',
    whatsapp VARCHAR(20),
    whatsapp_validacao BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_id_bubble_user ON users(id_bubble_user);

-- Trigger para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários autenticados
CREATE POLICY "Usuários podem ver seus próprios dados"
    ON users FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
    ON users FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Políticas para administradores
CREATE POLICY "Administradores podem ver todos os usuários"
    ON users FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.tipo = 'admin'
        )
    );

CREATE POLICY "Administradores podem modificar todos os usuários"
    ON users FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.tipo = 'admin'
        )
    );
