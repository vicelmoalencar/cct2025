import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../components/VideoPlayer';
import { useLessons } from '../hooks/useLessons';
import { Loading } from '../components/ui/loading';
import { Alert } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { LessonComments } from '../components/LessonComments';
import { useLessonInteractions } from '../hooks/useLessonInteractions';
import { Heart, HeartOff } from 'lucide-react';

export function Lessons() {
  const { moduleId, lessonId } = useParams();
  const { lessons, loading: lessonsLoading, error: lessonsError } = useLessons(moduleId);
  const currentLesson = lessons?.find(lesson => lesson.id_bubble_aula === lessonId);
  const {
    isFavorite,
    toggleFavorite,
    comments,
    addComment,
    deleteComment,
    loading: interactionsLoading,
    error: interactionsError
  } = useLessonInteractions(currentLesson?.id?.toString() || '');

  if (lessonsLoading) {
    return <div className="flex justify-center p-4"><Loading /></div>;
  }

  if (lessonsError) {
    return (
      <Alert variant="destructive">
        <p>Erro ao carregar aula: {lessonsError}</p>
      </Alert>
    );
  }

  if (!currentLesson) {
    return (
      <Alert variant="destructive">
        <p>Aula não encontrada</p>
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{currentLesson.descricao}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={isFavorite ? 'text-red-500' : 'text-gray-500'}
            >
              {isFavorite ? <Heart className="w-5 h-5" /> : <HeartOff className="w-5 h-5" />}
            </Button>
          </div>

          <div className="aspect-video">
            <VideoPlayer lesson={currentLesson} />
          </div>

          <div className="mt-8">
            <LessonComments
              comments={comments}
              onAddComment={addComment}
              onDeleteComment={deleteComment}
              loading={interactionsLoading}
              error={interactionsError}
            />
          </div>
        </div>

        {/* Lessons List Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Aulas do Módulo</h2>
          
          {lessonsLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : lessonsError ? (
            <div className="text-red-500 text-center p-4">
              Erro ao carregar aulas: {lessonsError}
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

const handleLessonClick = (lesson: any) => {
  // setCurrentLesson(lesson);
  // Rola suavemente até o player
  // playerRef.current?.scrollIntoView({ behavior: 'smooth' });
};
