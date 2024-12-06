-- Lista todas as tabelas
SELECT 
    tablename 
FROM pg_catalog.pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Lista colunas e constraints de uma tabela específica
CREATE OR REPLACE FUNCTION show_table_details(p_table_name text)
RETURNS TABLE (
    column_name text,
    data_type text,
    is_nullable text,
    column_default text,
    constraints text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.column_name::text,
        CASE 
            WHEN c.character_maximum_length IS NOT NULL 
            THEN c.data_type || '(' || c.character_maximum_length || ')'
            WHEN c.numeric_precision IS NOT NULL AND c.numeric_scale IS NOT NULL 
            THEN c.data_type || '(' || c.numeric_precision || ',' || c.numeric_scale || ')'
            ELSE c.data_type::text
        END,
        c.is_nullable::text,
        COALESCE(c.column_default, '')::text,
        (
            SELECT string_agg(
                CASE 
                    WHEN tc.constraint_type = 'PRIMARY KEY' THEN 'PK'
                    WHEN tc.constraint_type = 'FOREIGN KEY' THEN 'FK -> ' || ccu.table_name || '(' || ccu.column_name || ')'
                    WHEN tc.constraint_type = 'UNIQUE' THEN 'UNIQUE'
                    ELSE tc.constraint_type
                END,
                ', '
            )
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu 
                ON tc.constraint_name = kcu.constraint_name 
                AND tc.table_schema = kcu.table_schema
            LEFT JOIN information_schema.constraint_column_usage ccu 
                ON ccu.constraint_name = tc.constraint_name 
                AND ccu.table_schema = tc.table_schema
            WHERE tc.table_schema = 'public'
            AND tc.table_name = p_table_name
            AND kcu.column_name = c.column_name
        )::text as constraints
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
    AND c.table_name = p_table_name
    ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql;

-- Mostrar triggers
SELECT 
    event_object_table as table_name,
    trigger_name,
    event_manipulation as trigger_event,
    action_statement as trigger_definition
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY 
    event_object_table,
    trigger_name;

-- Mostrar políticas RLS
SELECT
    tablename,
    policyname,
    permissive,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY
    tablename,
    policyname;
