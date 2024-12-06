-- Habilitar as extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Enums
create type user_role as enum ('user', 'instructor', 'admin');
create type course_level as enum ('beginner', 'intermediate', 'advanced');
create type subscription_status as enum ('active', 'cancelled', 'expired');

-- Perfis de usuário (integrado com auth.users do Supabase)
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    name varchar(255) not null,
    avatar_url varchar(255),
    role user_role default 'user',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para criar perfil automaticamente após signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, name, avatar_url)
    values (
        new.id,
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Cursos
create table courses (
    id uuid primary key default uuid_generate_v4(),
    title varchar(255) not null,
    description text,
    thumbnail_url varchar(255),
    level course_level default 'beginner',
    price decimal(10,2) not null,
    instructor_id uuid references profiles(id),
    is_published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Módulos do curso
create table course_modules (
    id uuid primary key default uuid_generate_v4(),
    course_id uuid references courses(id) on delete cascade,
    title varchar(255) not null,
    description text,
    order_index integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aulas
create table lessons (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid references course_modules(id) on delete cascade,
    title varchar(255) not null,
    content text,
    video_url varchar(255),
    duration_minutes integer,
    order_index integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inscrições nos cursos
create table course_enrollments (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references profiles(id),
    course_id uuid references courses(id),
    status subscription_status default 'active',
    enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
    expires_at timestamp with time zone,
    unique(user_id, course_id)
);

-- Progresso nas aulas
create table lesson_progress (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references profiles(id),
    lesson_id uuid references lessons(id),
    completed boolean default false,
    last_watched_position integer default 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, lesson_id)
);

-- Avaliações dos cursos
create table course_reviews (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references profiles(id),
    course_id uuid references courses(id),
    rating integer check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, course_id)
);

-- Favoritos
create table course_favorites (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references profiles(id),
    course_id uuid references courses(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, course_id)
);

-- Membros
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

-- Políticas de Segurança para Membros
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Membros são visíveis para usuários autenticados"
    ON membros FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Apenas administradores podem modificar membros"
    ON membros FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Políticas de Segurança (RLS)

-- Profiles
alter table profiles enable row level security;

create policy "Profiles são visíveis para todos os usuários autenticados"
    on profiles for select
    to authenticated
    using (true);

create policy "Usuários podem editar seus próprios perfis"
    on profiles for update
    to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- Courses
alter table courses enable row level security;

create policy "Cursos publicados são visíveis para todos"
    on courses for select
    to authenticated
    using (is_published = true);

create policy "Instrutores podem gerenciar seus próprios cursos"
    on courses for all
    to authenticated
    using (auth.uid() = instructor_id)
    with check (auth.uid() = instructor_id);

-- Course Modules
alter table course_modules enable row level security;

create policy "Módulos de cursos publicados são visíveis para todos"
    on course_modules for select
    to authenticated
    using (
        exists (
            select 1 from courses
            where courses.id = course_modules.course_id
            and (courses.is_published = true or courses.instructor_id = auth.uid())
        )
    );

-- Lessons
alter table lessons enable row level security;

create policy "Aulas de cursos publicados são visíveis para alunos matriculados"
    on lessons for select
    to authenticated
    using (
        exists (
            select 1 from course_modules
            join courses on courses.id = course_modules.course_id
            left join course_enrollments on course_enrollments.course_id = courses.id
            where course_modules.id = lessons.module_id
            and (
                courses.is_published = true
                and course_enrollments.user_id = auth.uid()
                or courses.instructor_id = auth.uid()
            )
        )
    );

-- Course Enrollments
alter table course_enrollments enable row level security;

create policy "Usuários podem ver suas próprias matrículas"
    on course_enrollments for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Sistema pode criar matrículas"
    on course_enrollments for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Lesson Progress
alter table lesson_progress enable row level security;

create policy "Usuários podem gerenciar seu próprio progresso"
    on lesson_progress for all
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Course Reviews
alter table course_reviews enable row level security;

create policy "Reviews são visíveis para todos"
    on course_reviews for select
    to authenticated
    using (true);

create policy "Usuários podem criar/editar suas próprias reviews"
    on course_reviews for all
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Course Favorites
alter table course_favorites enable row level security;

create policy "Usuários podem gerenciar seus próprios favoritos"
    on course_favorites for all
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Funções úteis

-- Função para calcular progresso do curso
create or replace function calculate_course_progress(p_user_id uuid, p_course_id uuid)
returns float as $$
declare
    total_lessons integer;
    completed_lessons integer;
begin
    -- Conta total de aulas do curso
    select count(l.id) into total_lessons
    from lessons l
    join course_modules m on l.module_id = m.id
    where m.course_id = p_course_id;

    -- Conta aulas completadas
    select count(lp.id) into completed_lessons
    from lesson_progress lp
    join lessons l on lp.lesson_id = l.id
    join course_modules m on l.module_id = m.id
    where m.course_id = p_course_id
    and lp.user_id = p_user_id
    and lp.completed = true;

    if total_lessons = 0 then
        return 0;
    end if;

    return (completed_lessons::float / total_lessons::float) * 100;
end;
$$ language plpgsql security definer;

-- View para estatísticas dos cursos
create or replace view course_stats as
select
    c.id as course_id,
    c.title as course_title,
    count(distinct ce.user_id) as total_students,
    count(distinct cr.id) as total_reviews,
    coalesce(avg(cr.rating), 0) as average_rating,
    count(distinct cf.id) as total_favorites
from courses c
left join course_enrollments ce on ce.course_id = c.id
left join course_reviews cr on cr.course_id = c.id
left join course_favorites cf on cf.course_id = c.id
group by c.id, c.title;
