import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Lesson {
  id_aula: string;
  id_bubble_aula: string;
  id_bubble_modulo: string;
  id_modulo: string;
  descricao: string;
  video_fonte: string;
  video_id: string;
  ordenacao: number;
  duracao?: number;
  ativo: boolean;
  created_at?: string;
}

export function useLessons(moduleId: string | undefined) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    async function fetchLessons() {
      try {
        if (!moduleId) {
          console.log('No moduleId provided');
          setLessons([]);
          setLoading(false);
          return;
        }

        console.log('Fetching lessons for module:', moduleId);

        const { data, error: supabaseError } = await supabase
          .from('aulas')
          .select(`
            id_aula,
            id_bubble_aula,
            id_bubble_modulo,
            id_modulo,
            descricao,
            video_fonte,
            video_id,
            ordenacao,
            duracao,
            ativo,
            created_at
          `)
          .eq('id_bubble_modulo', moduleId)
          .eq('ativo', true)
          .order('ordenacao');

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw new Error(`Erro do Supabase: ${supabaseError.message} (Código: ${supabaseError.code})`);
        }

        if (!data) {
          console.log('No data returned from Supabase');
          setLessons([]);
        } else {
          console.log('Fetched lessons:', data);
          
          // Converte os dados para o formato esperado
          const formattedLessons = data.map(lesson => ({
            ...lesson,
            video_fonte: lesson.video_fonte?.toLowerCase() || 'youtube', // Garante que seja minúsculo
          }));
          
          setLessons(formattedLessons);
          
          // Set the first lesson as current if available
          if (formattedLessons.length > 0 && !currentLesson) {
            console.log('Setting initial lesson:', formattedLessons[0]);
            setCurrentLesson(formattedLessons[0]);
          }
        }
      } catch (err) {
        console.error('Error in fetchLessons:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [moduleId]);

  const handleSetCurrentLesson = (lesson: Lesson) => {
    console.log('Setting current lesson:', lesson);
    setCurrentLesson(lesson);
  };

  return { 
    lessons, 
    currentLesson, 
    setCurrentLesson: handleSetCurrentLesson, 
    loading, 
    error 
  };
}
