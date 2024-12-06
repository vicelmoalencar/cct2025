-- Create membros table
CREATE TABLE IF NOT EXISTS public.membros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_bubble_membro TEXT NOT NULL,
    data_expiracao TIMESTAMP WITH TIME ZONE,
    detalhe TEXT,
    origem TEXT,
    id_bubble_plano TEXT NOT NULL,
    teste_gratis BOOLEAN DEFAULT false,
    id_bubble_user TEXT NOT NULL,
    id_plano UUID REFERENCES public.planos(id),
    id_user UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_bubble_membro)
);

-- Create indexes for foreign keys and frequently searched columns
CREATE INDEX IF NOT EXISTS idx_membros_id_bubble_plano ON public.membros(id_bubble_plano);
CREATE INDEX IF NOT EXISTS idx_membros_id_bubble_user ON public.membros(id_bubble_user);
CREATE INDEX IF NOT EXISTS idx_membros_id_plano ON public.membros(id_plano);
CREATE INDEX IF NOT EXISTS idx_membros_id_user ON public.membros(id_user);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_membros_updated_at
    BEFORE UPDATE ON public.membros
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
