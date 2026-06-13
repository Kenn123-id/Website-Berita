export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  createdAt: string;
  author: string;
  image: string;
  views: number;
  likes: number;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: number;
  isApproved: boolean;
}

export type Role = 'reader' | 'publisher' | 'developer';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
}

export interface User {
  username: string;
  role: 'publisher' | 'developer';
  name: string;
}
