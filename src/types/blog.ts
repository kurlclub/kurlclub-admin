// src/types/blog.ts

export interface BlogCoverImage {
  src: string;
  alt: string;
}

export interface BlogSection {
  heading?: string;
  paragraphs: string[];
  quote?: string;
}

export interface BlogAuthor {
  name: string;
  bio: string;
}

export type BlogStatus = 'draft' | 'published';

export interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  tagLabel: string;
  displayDate: string;
  coverImage: BlogCoverImage;
  mainHeading: string;
  sections: BlogSection[];
  author: BlogAuthor;
  metaTitle?: string;
  metaDescription?: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  tagLabel: string;
  displayDate: string;
  coverImage: BlogCoverImage;
  mainHeading: string;
  sections: BlogSection[];
  author: BlogAuthor;
  metaTitle?: string;
  metaDescription?: string;
  status: BlogStatus;
}

export interface BlogListMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface BlogListResult {
  blogs: Blog[];
  meta: BlogListMeta;
}

export interface BlogListParams {
  limit?: number;
  page?: number;
  status?: 'draft' | 'published' | 'all';
  tag?: string;
}
