import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import { VideoPlayer } from '../components/VideoPlayer';
import { LessonSocial } from '../components/LessonSocial';
import { Play, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Lessons() {
  const { moduleId } = useParams();
  const { lessons, currentLesson, setCurrentLesson, loading, error } = useLessons(moduleId);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Current module ID:', moduleId);
    console.log('All lessons:', lessons);
    console.log('Current lesson:', currentLesson);
  }, [moduleId, lessons, currentLesson]);

  const handleLessonClick = (lesson: any) => {
    setCurrentLesson(lesson);
    // Rola suavemente até o player
    playerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div ref={playerRef} className="lg:col-span-2 space-y-4">
          <VideoPlayer lesson={currentLesson} />
          
          {currentLesson && (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{currentLesson.descricao}</h1>
                {currentLesson.duracao && (
                  <p className="text-sm text-gray-500">
                    Duração: {currentLesson.duracao} minutos
                  </p>
                )}
              </div>
              
              {/* Social Features Section */}
              <div className="mt-6 border-t pt-4">
                <LessonSocial lessonId={currentLesson.id_bubble_aula} />
              </div>
            </>
          )}
        </div>

        {/* Lessons List Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Aulas do Módulo</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              Erro ao carregar aulas: {error.message}
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              Nenhuma aula disponível.
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson) => {
                const isCurrentLesson = currentLesson?.id_bubble_aula === lesson.id_bubble_aula;
                return (
                  <button
                    key={lesson.id_bubble_aula}
                    onClick={() => handleLessonClick(lesson)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all duration-200",
                      "flex items-start gap-3 relative",
                      isCurrentLesson 
                        ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm" 
                        : "hover:bg-gray-50 border-l-4 border-transparent"
                    )}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {isCurrentLesson ? (
                        <Play size={16} className="text-blue-500" />
                      ) : (
                        <CheckCircle2 size={16} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-medium",
                        isCurrentLesson && "text-blue-700"
                      )}>
                        {lesson.descricao}
                      </h3>
                      {lesson.duracao && (
                        <p className={cn(
                          "text-sm",
                          isCurrentLesson ? "text-blue-600" : "text-gray-500"
                        )}>
                          {lesson.duracao} minutos
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
