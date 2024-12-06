import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../components/CourseCard';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';

export function Courses() {
  const { courses, loading, error } = useCourses();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cursos</h1>
        <div className="flex space-x-2">
          <input
            type="search"
            placeholder="Buscar cursos..."
            className="px-4 py-2 border rounded-lg"
          />
          <select className="px-4 py-2 border rounded-lg">
            <option value="">Todos os níveis</option>
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
          <Button onClick={() => navigate('/courses/new')} className="flex items-center gap-2">
            <Plus size={20} />
            Novo Curso
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>Erro ao carregar cursos: {error.message}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <p>Nenhum curso encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}