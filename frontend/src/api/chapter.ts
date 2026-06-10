import request from './request'

export interface KnowledgePoint {
  id: number
  key: string
  title: string
  content: string
  guide: string
  default_code: string
  sort_order: number
  chapter_id: number
}

export interface Chapter {
  id: number
  key: string
  title: string
  sort_order: number
  knowledge_points: KnowledgePoint[]
}

export const chapterApi = {
  list: () => request.get<Chapter[]>('/v1/chapters/'),
  create: (data: { key: string; title: string; sort_order?: number }) =>
    request.post<Chapter>('/v1/chapters/', data),
  update: (id: number, data: Partial<{ title: string; sort_order: number }>) =>
    request.put<Chapter>(`/v1/chapters/${id}`, data),
  delete: (id: number) => request.delete(`/v1/chapters/${id}`),

  createPoint: (chapterId: number, data: { key: string; title: string; content?: string; sort_order?: number }) =>
    request.post<KnowledgePoint>(`/v1/chapters/${chapterId}/points`, data),
  updatePoint: (pointId: number, data: Partial<{ title: string; content: string; guide: string; default_code: string; sort_order: number }>) =>
    request.put<KnowledgePoint>(`/v1/chapters/points/${pointId}`, data),
  deletePoint: (pointId: number) => request.delete(`/v1/chapters/points/${pointId}`),
}
