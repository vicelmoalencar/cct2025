export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: User;
  isFavorited: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  user: User;
  createdAt: Date;
}

export interface WikiArticle {
  id: string;
  title: string;
  content: string;
  author: User;
  lastUpdated: Date;
}

export interface Ebook {
  id: string;
  title: string;
  cover: string;
  author: string;
  description: string;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  likes: number;
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}