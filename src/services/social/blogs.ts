import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { API_ENV_HEADER } from '@/lib/api-environment';
import { type ApiEnvelope, STALE_5M, unwrap } from '@/lib/api-types';
import type {
  Blog,
  BlogFormData,
  BlogListParams,
  BlogListResult,
  BlogUpdateData,
} from '@/types/blog';

const BLOG_API_OPTIONS = {
  headers: {
    [API_ENV_HEADER]: 'Dev',
  },
} as const;

const normalizeBlogList = (payload: unknown): BlogListResult => {
  const fallback: BlogListResult = {
    blogs: [],
    meta: { page: 1, pageSize: 10, total: 0, pageCount: 0 },
  };
  if (!payload) return fallback;
  if (Array.isArray(payload))
    return { blogs: payload as Blog[], meta: fallback.meta };
  if (typeof payload !== 'object') return fallback;
  const p = payload as Record<string, unknown>;
  const data = Array.isArray(p.data) ? p.data : [];
  const meta = {
    ...fallback.meta,
    ...((p.meta as Partial<BlogListResult['meta']>) ?? {}),
  };
  return { blogs: data as Blog[], meta };
};

export const fetchBlogs = async (
  params: BlogListParams = {},
): Promise<BlogListResult> => {
  const queryParams = Object.fromEntries(
    Object.entries({ status: 'all', limit: 100, ...params }).filter(
      ([, v]) => v !== undefined,
    ),
  ) as Record<string, string | number | boolean>;
  const response = await api.get<unknown>('/blogs', { params: queryParams });
  return normalizeBlogList(unwrap(response));
};

export const fetchBlogBySlug = async (slug: string): Promise<Blog> => {
  const response = await api.get<ApiEnvelope<Blog> | Blog>(`/blogs/${slug}`);
  return unwrap(response) as Blog;
};

export const createBlog = async (data: BlogFormData): Promise<Blog> => {
  const response = await api.post<ApiEnvelope<Blog> | Blog>(
    '/blogs',
    data,
    BLOG_API_OPTIONS,
  );
  return unwrap(response) as Blog;
};

export const updateBlog = async (
  id: number,
  data: BlogUpdateData,
): Promise<Blog> => {
  const response = await api.patch<ApiEnvelope<Blog> | Blog>(
    `/blogs/${id}`,
    data as Record<string, unknown>,
    BLOG_API_OPTIONS,
  );
  return unwrap(response) as Blog;
};

export const deleteBlog = async (id: number): Promise<void> => {
  await api.delete(`/blogs/${id}`);
};

type UploadResponseObject = {
  src?: string;
  url?: string;
  path?: string;
  fileUrl?: string;
  fileName?: string;
  imageUrl?: string;
  location?: string;
  Location?: string;
};

const extractUploadedSrc = (payload: unknown): string | undefined => {
  // Some endpoints return the URL as a bare string rather than an object.
  if (typeof payload === 'string') return payload.trim() || undefined;
  if (!payload || typeof payload !== 'object') return undefined;
  const p = payload as UploadResponseObject;
  return (
    p.src ??
    p.url ??
    p.path ??
    p.fileUrl ??
    p.imageUrl ??
    p.location ??
    p.Location ??
    p.fileName
  );
};

export const uploadBlogImage = async (file: File): Promise<{ src: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<ApiEnvelope<unknown> | unknown>(
    '/blogs/uploads',
    formData,
    BLOG_API_OPTIONS,
  );
  const src = extractUploadedSrc(unwrap(response));

  if (!src) {
    throw new Error('Upload response did not include an image URL.');
  }

  return { src };
};

// ─── React Query Hooks ──────────────────────────────────────────────────────

export const useBlogs = (params: BlogListParams = {}) =>
  useQuery({
    queryKey: ['blogs', params],
    queryFn: () => fetchBlogs(params),
    staleTime: STALE_5M,
  });

export const useBlog = (slug: string) =>
  useQuery({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogBySlug(slug),
    enabled: !!slug,
    staleTime: STALE_5M,
  });

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BlogUpdateData }) =>
      updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

export const useUploadBlogImage = () =>
  useMutation({ mutationFn: uploadBlogImage });
