import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Send } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export function Social() {
  const { profile } = useAuthContext();
  const [newPost, setNewPost] = useState('');

  const posts = [
    {
      id: 1,
      author: {
        name: 'Maria Silva',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        role: 'Especialista em Direito Trabalhista',
      },
      content: 'Acabei de publicar um novo artigo sobre as mudanças nas regras de home office para 2024. O que vocês acham das novas regulamentações?',
      likes: 24,
      comments: 8,
      shares: 5,
      timestamp: '2024-03-15T10:30:00',
    },
    {
      id: 2,
      author: {
        name: 'João Santos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
        role: 'Contador',
      },
      content: 'Dica do dia: Ao calcular horas extras, não esqueçam de considerar o DSR (Descanso Semanal Remunerado). Muita gente ainda tem dúvidas sobre isso.',
      likes: 32,
      comments: 12,
      shares: 7,
      timestamp: '2024-03-14T15:45:00',
    },
  ];

  const groups = [
    {
      id: 1,
      name: 'Cálculos Trabalhistas Avançados',
      members: 1250,
      posts: 45,
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=group1',
    },
    {
      id: 2,
      name: 'eSocial na Prática',
      members: 980,
      posts: 32,
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=group2',
    },
    {
      id: 3,
      name: 'Reforma Trabalhista',
      members: 1500,
      posts: 58,
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=group3',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Criar Post */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-3 mb-4">
          {profile?.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div className="flex-1">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Compartilhe suas dúvidas ou conhecimentos..."
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="flex items-center gap-2">
            <Send size={18} />
            Publicar
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{post.author.name}</h3>
                <p className="text-sm text-gray-500">{post.author.role}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <div className="flex items-center justify-between text-gray-500 border-t pt-3">
              <button className="flex items-center gap-1 hover:text-blue-600">
                <Heart size={18} />
                {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600">
                <MessageSquare size={18} />
                {post.comments}
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600">
                <Share2 size={18} />
                {post.shares}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Grupos Populares */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Grupos Populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border rounded-lg p-3 hover:border-blue-500 transition-colors cursor-pointer"
            >
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <h3 className="font-semibold">{group.name}</h3>
              <div className="text-sm text-gray-500">
                <p>{group.members.toLocaleString()} membros</p>
                <p>{group.posts} posts esta semana</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}