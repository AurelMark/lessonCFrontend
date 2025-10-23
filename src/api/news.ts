import { typedFetch } from '@/lib/typedFetch'
import { NewsListParamsSchema, NewsListParams, NewsListEventSchema, NewsDeleteByIdSchema, NewsEvent } from '@/validation/news'

export const getNews = (
  tag?: string | null,
  page?: number,
): Promise<NewsListParams> => {
  const params = new URLSearchParams()
  if (tag) params.set('tags', tag)
  if (page) params.set('page', page.toString())

  return typedFetch(`/blog?${params.toString()}`, NewsListParamsSchema)
}

export const getNewsAdmin = (
  tag?: string | null,
  page?: number,
): Promise<NewsListParams> => {
  const params = new URLSearchParams()
  if (tag) params.set('tags', tag)
  if (page) params.set('page', page.toString())

  return typedFetch(`/news?${params.toString()}`, NewsListParamsSchema)
}

export const getBlogBySlug = (slug: string) => {
  return typedFetch(`/blog/${slug}`, NewsListEventSchema)
}

export const deleteNewsById = (id: string) => {
  return typedFetch(`/news/${id}`, NewsDeleteByIdSchema, { method: 'delete' })
}

export const editNewsById = (data: NewsEvent) => {
  console.log('data3333', data)
  return typedFetch(`/news/${data.id}`, NewsListEventSchema, { method: 'patch', data })
}

export const createNewsById = (data: NewsEvent) => {
  return typedFetch('/news', NewsListEventSchema, { method: 'post', data })
}

export const getNewsBySlug = (slug: string) => {
  return typedFetch(`/news/slug/${slug}`, NewsListEventSchema)
}

