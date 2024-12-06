import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

type Course = {
  id_curso: string;
  nome: string;
  breve_descricao?: string;
  descricao?: string;
  firebase_url?: string;
  carga_horaria?: number;
  gratis: boolean;
};

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (course.descricao) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    } else {
      navigate(`/courses/${course.id_curso}/modules`);
    }
  };

  const handleStartCourse = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/courses/${course.id_curso}/modules`);
    setShowModal(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleCardClick}
      >
        {course.firebase_url && (
          <img
            src={course.firebase_url}
            alt={course.nome}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{course.nome}</h3>
            {course.gratis && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Grátis
              </span>
            )}
          </div>
          {course.breve_descricao && (
            <p className="text-gray-600 mt-2">{course.breve_descricao}</p>
          )}
          {course.carga_horaria && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Carga Horária: {course.carga_horaria}h
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-50"></div>

            {/* Modal content */}
            <div 
              className="relative bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>

              {/* Course image */}
              {course.firebase_url && (
                <img
                  src={course.firebase_url}
                  alt={course.nome}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Course info */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{course.nome}</h2>
                  {course.gratis && (
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
                      Grátis
                    </span>
                  )}
                </div>

                {course.carga_horaria && (
                  <div className="flex items-center text-gray-600">
                    <span>Carga Horária: {course.carga_horaria}h</span>
                  </div>
                )}

                {course.descricao && (
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: course.descricao }} />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowModal(false)}
                  >
                    Fechar
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleStartCourse}
                  >
                    Começar Curso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}