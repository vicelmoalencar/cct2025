import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Alert } from './ui/alert';
import { Loading } from './ui/loading';

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

interface Props {
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function LessonComments({ comments, onAddComment, onDeleteComment, loading, error }: Props) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4"><Loading /></div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comentários</h3>

      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicione um comentário..."
            rows={3}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loading /> : 'Comentar'}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm text-gray-600">
                  {comment.user?.user_metadata?.name || comment.user?.email || 'Usuário'}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
              {user?.id === comment.user_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  Excluir
                </Button>
              )}
            </div>
            <p className="mt-2 text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
