import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user?: {
    email: string;
    user_metadata?: {
      name?: string;
    };
  };
}

export function useLessonInteractions(lessonId: string) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar status de favorito
  useEffect(() => {
    async function loadFavoriteStatus() {
      if (!user || !lessonId) return;

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .single();

        if (error) throw error;
        setIsFavorite(!!data);
      } catch (err) {
        console.error('Erro ao carregar status de favorito:', err);
      }
    }

    loadFavoriteStatus();
  }, [user, lessonId]);

  // Carregar comentários
  useEffect(() => {
    async function loadComments() {
      if (!lessonId) return;

      try {
        const { data, error } = await supabase
          .from('comments')
          .select(\`
            *,
            user:user_id (
              email,
              user_metadata
            )
          \`)
          .eq('lesson_id', lessonId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComments(data || []);
      } catch (err) {
        console.error('Erro ao carregar comentários:', err);
        setError('Erro ao carregar comentários');
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [lessonId]);

  // Alternar favorito
  const toggleFavorite = async () => {
    if (!user || !lessonId) return;

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([{ user_id: user.id, lesson_id: lessonId }]);

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Erro ao alternar favorito:', err);
      setError('Erro ao alternar favorito');
    }
  };

  // Adicionar comentário
  const addComment = async (content: string) => {
    if (!user || !lessonId || !content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          user_id: user.id,
          lesson_id: lessonId,
          content: content.trim()
        }])
        .select(\`
          *,
          user:user_id (
            email,
            user_metadata
          )
        \`)
        .single();

      if (error) throw error;
      setComments(prev => [data, ...prev]);
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      setError('Erro ao adicionar comentário');
    }
  };

  // Deletar comentário
  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Erro ao deletar comentário:', err);
      setError('Erro ao deletar comentário');
    }
  };

  return {
    isFavorite,
    toggleFavorite,
    comments,
    addComment,
    deleteComment,
    loading,
    error
  };
}
