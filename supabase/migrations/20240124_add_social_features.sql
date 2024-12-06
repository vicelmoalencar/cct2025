-- Create comments table
CREATE TABLE lesson_comments (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create likes table
CREATE TABLE lesson_likes (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(lesson_id, user_id)
);

-- Create favorites table
CREATE TABLE lesson_favorites (
    id BIGSERIAL PRIMARY KEY,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(lesson_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX idx_lesson_comments_lesson_id ON lesson_comments(lesson_id);
CREATE INDEX idx_lesson_comments_user_id ON lesson_comments(user_id);
CREATE INDEX idx_lesson_likes_lesson_id ON lesson_likes(lesson_id);
CREATE INDEX idx_lesson_likes_user_id ON lesson_likes(user_id);
CREATE INDEX idx_lesson_favorites_lesson_id ON lesson_favorites(lesson_id);
CREATE INDEX idx_lesson_favorites_user_id ON lesson_favorites(user_id);
