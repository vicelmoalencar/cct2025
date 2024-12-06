-- Criar tabela de planos
CREATE TABLE IF NOT EXISTS public.planos (
    id_plano SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    intervalo_cobranca VARCHAR(20) NOT NULL,  -- mensal, anual, etc
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de membros
CREATE TABLE IF NOT EXISTS public.membros (
    id_membro SERIAL PRIMARY KEY,
    id_plano INTEGER REFERENCES public.planos(id_plano),
    id_usuario UUID REFERENCES auth.users(id),
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    status VARCHAR(20) DEFAULT 'ativo',  -- ativo, inativo, pendente, etc
    data_inicio DATE,
    data_fim DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de cursos
CREATE TABLE IF NOT EXISTS public.cursos (
    id_curso SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    nivel VARCHAR(50),  -- iniciante, intermediário, avançado
    duracao_estimada INTEGER,  -- em minutos
    thumbnail_url TEXT,
    status VARCHAR(20) DEFAULT 'ativo',
    ordem INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de módulos
CREATE TABLE IF NOT EXISTS public.modulos (
    id_modulo SERIAL PRIMARY KEY,
    id_curso INTEGER REFERENCES public.cursos(id_curso),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    ordem INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de aulas
CREATE TABLE IF NOT EXISTS public.aulas (
    id_aula SERIAL PRIMARY KEY,
    id_modulo INTEGER REFERENCES public.modulos(id_modulo),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    video_url TEXT,
    duracao INTEGER,  -- em minutos
    ordem INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de aulas assistidas
CREATE TABLE IF NOT EXISTS public.aulas_assistidas (
    id_aula_assistida SERIAL PRIMARY KEY,
    id_aula INTEGER REFERENCES public.aulas(id_aula),
    id_membro INTEGER REFERENCES public.membros(id_membro),
    progresso INTEGER DEFAULT 0,  -- porcentagem de conclusão
    concluida BOOLEAN DEFAULT false,
    ultima_visualizacao TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_aula, id_membro)  -- um membro só pode ter um registro por aula
);

-- Adicionar políticas RLS
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aulas_assistidas ENABLE ROW LEVEL SECURITY;

-- Políticas para planos
CREATE POLICY "Planos visíveis para todos" ON public.planos
    FOR SELECT USING (true);

-- Políticas para membros
CREATE POLICY "Membros podem ver seus próprios dados" ON public.membros
    FOR SELECT USING (auth.uid() = id_usuario);

-- Políticas para cursos
CREATE POLICY "Cursos visíveis para todos" ON public.cursos
    FOR SELECT USING (status = 'ativo');

-- Políticas para módulos
CREATE POLICY "Módulos visíveis para todos" ON public.modulos
    FOR SELECT USING (status = 'ativo');

-- Políticas para aulas
CREATE POLICY "Aulas visíveis para todos" ON public.aulas
    FOR SELECT USING (status = 'ativo');

-- Políticas para aulas assistidas
CREATE POLICY "Membros podem ver suas próprias aulas assistidas" ON public.aulas_assistidas
    FOR ALL USING (
        auth.uid() IN (
            SELECT id_usuario 
            FROM public.membros 
            WHERE id_membro = aulas_assistidas.id_membro
        )
    );

-- Funções triggers para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER set_planos_updated_at
    BEFORE UPDATE ON public.planos
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_membros_updated_at
    BEFORE UPDATE ON public.membros
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_cursos_updated_at
    BEFORE UPDATE ON public.cursos
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_modulos_updated_at
    BEFORE UPDATE ON public.modulos
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_aulas_updated_at
    BEFORE UPDATE ON public.aulas
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_aulas_assistidas_updated_at
    BEFORE UPDATE ON public.aulas_assistidas
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
