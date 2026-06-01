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
  /** Raw YYYY-MM-DD date string returned by the API. Frontend formats it for display. */
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

export type BlogUpdateData = Partial<BlogFormData>;

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

export type BlogListStatus = BlogStatus | 'all';

export interface BlogListParams {
  limit?: number;
  page?: number;
  status?: BlogListStatus;
  tag?: string;
}
