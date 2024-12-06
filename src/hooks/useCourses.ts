import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Course = {
  id: string; // uuid
  id_bubble_curso: string;
  ativo: boolean;
  breve_descricao: string;
  video_id: string;
  carga_horaria: number;
  descricao: string;
  gerar_certificado: boolean;
  gratis: boolean;
  imagem: string;
  ordenacao: number;
  nome: string;
  firebase_url: string;
};

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .eq('ativo', true)
        .order('ordenacao', { ascending: true });

      if (error) {
        console.error('Erro detalhado:', error);
        throw new Error(`${error.message} (Código: ${error.code})`);
      }

      console.log('Cursos carregados:', data);
      setCourses(data as Course[]);
    } catch (err) {
      console.error('Erro completo:', err);
      setError(err instanceof Error ? err : new Error('Erro ao buscar cursos'));
    } finally {
      setLoading(false);
    }
  }

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses
  };
}
