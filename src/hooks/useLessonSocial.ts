import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  };
}

export function useLessonSocial(lessonId: string | undefined) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Buscar o id_usuario do usuário logado
  useEffect(() => {
    async function fetchUserId() {
      if (user) {
        console.log('Buscando id_usuario para auth.id:', user.id);
        const { data, error } = await supabase
          .from('usuarios')
          .select('id_usuario')
          .eq('id_usuario', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar id_usuario:', error);
          return;
        }

        if (data) {
          console.log('Id_usuario encontrado:', data.id_usuario);
          setCurrentUserId(data.id_usuario);
        }
      }
    }

    fetchUserId();
  }, [user]);

  useEffect(() => {
    if (lessonId && currentUserId) {
      console.log('Carregando dados sociais...', { lessonId, currentUserId });
      fetchSocialData();
    } else {
      console.log('Não foi possível carregar dados sociais:', { lessonId, currentUserId });
    }
  }, [lessonId, currentUserId]);

  const fetchSocialData = async () => {
    try {
      setLoading(true);
      console.log('Iniciando fetchSocialData...', { lessonId, currentUserId });
      
      // Fetch comments with proper join
      const { data: commentsData, error: commentsError } = await supabase
        .from('lesson_comments')
        .select(`
          id,
          content,
          created_at,
          profiles (
            name,
            avatar_url
          )
        `)
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: false });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        throw commentsError;
      }

      const validComments = (commentsData || []).filter(comment => comment.profiles?.name);
      console.log('Comments fetched:', validComments);
      setComments(validComments as Comment[]);

      // Fetch likes count
      const { count: likesCountData, error: likesError } = await supabase
        .from('lesson_likes')
        .select('*', { count: 'exact' })
        .eq('id_aula', lessonId);

      if (likesError) {
        console.error('Error fetching likes count:', likesError);
        throw likesError;
      }

      setLikesCount(likesCountData || 0);

      // Check if user liked
      if (currentUserId) {
        const { data: userLike, error: userLikeError } = await supabase
          .from('lesson_likes')
          .select('id')
          .eq('id_aula', lessonId)
          .eq('id_usuario', currentUserId)
          .maybeSingle();

        if (userLikeError) {
          console.error('Error checking if user liked:', userLikeError);
          throw userLikeError;
        }

        setIsLiked(!!userLike);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching social data:', error);
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user || !lessonId) {
      console.error('Não é possível adicionar comentário: usuário não autenticado ou lessonId não fornecido');
      return;
    }

    try {
      console.log('Tentando adicionar comentário...', { user, lessonId, content });
      const { data, error } = await supabase
        .from('lesson_comments')
        .insert([
          {
            lesson_id: lessonId,
            user_id: user.id,
            content
          }
        ])
        .select(`
          id,
          content,
          created_at,
          profiles (
            name,
            avatar_url
          )
        `)
        .maybeSingle();

      if (error) {
        console.error('Erro ao adicionar comentário:', error);
        throw error;
      }

      if (data) {
        setComments(prev => [data as Comment, ...prev]);
      }

      return data;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      throw error;
    }
  };

  const toggleLike = async () => {
    if (!currentUserId || !lessonId) {
      console.error('Não é possível dar like: usuário não autenticado ou lessonId não fornecido');
      return;
    }

    try {
      console.log('Tentando alternar like...', { currentUserId, lessonId, isLiked });
      if (isLiked) {
        const { error } = await supabase
          .from('lesson_likes')
          .delete()
          .eq('id_aula', lessonId)
          .eq('id_usuario', currentUserId);

        if (error) {
          console.error('Erro ao remover like:', error);
          throw error;
        }

        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        const { error } = await supabase
          .from('lesson_likes')
          .insert([
            {
              id_aula: lessonId,
              id_usuario: currentUserId
            }
          ]);

        if (error) {
          console.error('Erro ao adicionar like:', error);
          throw error;
        }

        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Erro ao alternar like:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !lessonId) return;

    try {
      if (isFavorited) {
        await supabase
          .from('lesson_favorites')
          .delete()
          .eq('lesson_id', lessonId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('lesson_favorites')
          .insert([
            {
              lesson_id: lessonId,
              user_id: user.id
            }
          ]);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return {
    comments,
    likesCount,
    isLiked,
    isFavorited,
    loading,
    addComment,
    toggleLike,
    toggleFavorite
  };
}
