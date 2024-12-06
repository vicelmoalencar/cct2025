-- Update course_modules table to set course_id based on id_bubble_curso
UPDATE course_modules cm
SET course_id = c.id
FROM courses c
WHERE c.id_bubble_curso = cm.id_bubble_curso;

-- Add a constraint to ensure course_id is not null after the update
ALTER TABLE course_modules
ALTER COLUMN course_id SET NOT NULL;

-- Create an index on id_bubble_curso for better performance
CREATE INDEX IF NOT EXISTS idx_course_modules_bubble_curso 
ON course_modules(id_bubble_curso);

-- Log the update
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % course modules with course_id', updated_count;
END $$;
