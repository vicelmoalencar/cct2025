-- Create modulos table
CREATE TABLE IF NOT EXISTS modulos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_bubble_curso TEXT NOT NULL,
    id_curso UUID REFERENCES cursos(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    ordem INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_modulos_id_curso ON modulos(id_curso);
CREATE INDEX IF NOT EXISTS idx_modulos_id_bubble_curso ON modulos(id_bubble_curso);

-- Create trigger for updated_at
CREATE TRIGGER update_modulos_updated_at
    BEFORE UPDATE ON modulos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE modulos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Módulos são visíveis para usuários autenticados"
    ON modulos FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Apenas administradores podem modificar módulos"
    ON modulos FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM perfis
            WHERE perfis.id = auth.uid()
            AND perfis.role = 'admin'
        )
    );
