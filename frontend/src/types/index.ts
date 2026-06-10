export interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
}

export interface User {
  id: number
  username: string
  email: string
  full_name: string | null
  is_active: boolean
  role_id: number
  role_name: string
}

export interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

export interface KnowledgePoint {
  id: string
  title: string
  content: string
}

export interface Chapter {
  id: string
  title: string
  children: KnowledgePoint[]
}

export interface CourseData {
  id: string
  title: string
  chapters: Chapter[]
}
