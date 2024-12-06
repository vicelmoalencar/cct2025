import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Module {
  id_bubble_modulo: string;
  ativo: boolean;
  contar_certificado: boolean;
  id_bubble_curso: string;
  descricao: string;
  ordenacao: number;
  teste_gratis: boolean;
  visibilidade: string;
  id_curso: number;
}

export function useModules(courseId: string | undefined) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchModules() {
      try {
        if (!courseId) {
          setModules([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('modulos')
          .select('*')
          .eq('id_curso', courseId)
          .order('ordenacao');

        if (error) throw error;

        setModules(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar módulos'));
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, [courseId]);

  return { modules, loading, error };
}
