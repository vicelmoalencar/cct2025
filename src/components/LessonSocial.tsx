import React, { useState } from 'react';
import { Heart, Star, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLessonSocial } from '../hooks/useLessonSocial';
import { cn } from '../lib/utils';

interface LessonSocialProps {
  lessonId: number;
}

export function LessonSocial({ lessonId }: LessonSocialProps) {
  const {
    comments,
    likesCount,
    isLiked,
    isFavorited,
    loading,
    addComment,
    toggleLike,
    toggleFavorite
  } = useLessonSocial(lessonId);

  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment.trim());
      setNewComment('');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-20 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="space-y-4">
      {/* Interaction buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLike}
          className="flex items-center gap-1 text-sm"
        >
          <Heart
            size={20}
            className={cn(
              "transition-colors",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"
            )}
          />
          <span className="text-gray-600">{likesCount}</span>
        </button>

        <button
          onClick={toggleFavorite}
          className="flex items-center gap-1 text-sm"
        >
          <Star
            size={20}
            className={cn(
              "transition-colors",
              isFavorited ? "fill-yellow-500 text-yellow-500" : "text-gray-500 hover:text-yellow-500"
            )}
          />
          {isFavorited ? 'Favorited' : 'Favorite'}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm"
        >
          <MessageCircle size={20} className="text-gray-500 hover:text-blue-500" />
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-2">
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
              Comment
            </button>
          </form>
          <ul className="space-y-1">
            {comments.map((comment, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-lg">
                <p className="text-sm">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.date), { addSuffix: true, locale: ptBR })}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
