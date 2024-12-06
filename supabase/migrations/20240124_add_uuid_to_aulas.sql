-- Enable the uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add new UUID column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'aulas' 
        AND column_name = 'id_aula'
    ) THEN
        ALTER TABLE public.aulas 
        ADD COLUMN id_aula UUID;
    END IF;
END $$;

-- Update existing rows with new UUIDs if they are NULL
UPDATE public.aulas
SET id_aula = uuid_generate_v4()
WHERE id_aula IS NULL;

-- Now we can safely make id_aula NOT NULL
ALTER TABLE public.aulas 
ALTER COLUMN id_aula SET NOT NULL;

-- Add a unique constraint to id_aula if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'aulas_id_aula_key'
    ) THEN
        ALTER TABLE public.aulas
        ADD CONSTRAINT aulas_id_aula_key UNIQUE (id_aula);
    END IF;
END $$;

-- Create a trigger function to automatically set id_aula for new rows
CREATE OR REPLACE FUNCTION public.set_aula_uuid()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_aula IS NULL THEN
        NEW.id_aula = uuid_generate_v4();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_aula_uuid_trigger'
    ) THEN
        CREATE TRIGGER set_aula_uuid_trigger
        BEFORE INSERT ON public.aulas
        FOR EACH ROW
        EXECUTE FUNCTION public.set_aula_uuid();
    END IF;
END $$;

-- Set default for new rows
ALTER TABLE public.aulas
ALTER COLUMN id_aula SET DEFAULT uuid_generate_v4();
