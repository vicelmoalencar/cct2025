import { create } from 'zustand';
import type { User, Course, Ticket, WikiArticle, Ebook, Post } from '../types';

interface Store {
  user: User | null;
  courses: Course[];
  tickets: Ticket[];
  wikiArticles: WikiArticle[];
  ebooks: Ebook[];
  posts: Post[];
  isAdmin: boolean;
  toggleFavorite: (courseId: string) => void;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  createPost: (content: string) => void;
  addComment: (postId: string, content: string) => void;
  createCourse: (course: Omit<Course, 'id'>) => void;
  createWikiArticle: (article: Omit<WikiArticle, 'id' | 'lastUpdated'>) => void;
  createEbook: (ebook: Omit<Ebook, 'id'>) => void;
}

// Dados iniciais do usuário para teste
const initialUser: User = {
  id: '1',
  name: 'Usuário Teste',
  email: 'usuario@teste.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
};

// Dados iniciais dos cursos para teste
const initialCourses: Course[] = [
  {
    id: '1',
    title: 'Cálculo de Férias Completo',
    description: 'Aprenda a calcular férias de forma completa e profissional',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    instructor: initialUser,
    isFavorited: false,
  },
  {
    id: '2',
    title: 'Rescisão Trabalhista na Prática',
    description: 'Domine os cálculos de rescisão trabalhista',
    thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a',
    instructor: initialUser,
    isFavorited: true,
  },
];

export const useStore = create<Store>((set) => ({
  user: initialUser,
  courses: initialCourses,
  tickets: [],
  wikiArticles: [],
  ebooks: [],
  posts: [],
  isAdmin: true,

  toggleFavorite: (courseId) =>
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === courseId
          ? { ...course, isFavorited: !course.isFavorited }
          : course
      ),
    })),

  createTicket: (ticket) =>
    set((state) => ({
      tickets: [
        ...state.tickets,
        {
          id: Math.random().toString(),
          createdAt: new Date(),
          ...ticket,
        },
      ],
    })),

  createPost: (content) =>
    set((state) => ({
      posts: [
        {
          id: Math.random().toString(),
          content,
          author: state.user!,
          likes: 0,
          comments: [],
          createdAt: new Date(),
        },
        ...state.posts,
      ],
    })),

  addComment: (postId, content) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Math.random().toString(),
                  content,
                  author: state.user!,
                  createdAt: new Date(),
                },
              ],
            }
          : post
      ),
    })),

  createCourse: (course) =>
    set((state) => ({
      courses: [
        ...state.courses,
        {
          id: Math.random().toString(),
          instructor: state.user!,
          isFavorited: false,
          ...course,
        },
      ],
    })),

  createWikiArticle: (article) =>
    set((state) => ({
      wikiArticles: [
        ...state.wikiArticles,
        {
          id: Math.random().toString(),
          lastUpdated: new Date(),
          ...article,
        },
      ],
    })),

  createEbook: (ebook) =>
    set((state) => ({
      ebooks: [
        ...state.ebooks,
        {
          id: Math.random().toString(),
          ...ebook,
        },
      ],
    })),
}));