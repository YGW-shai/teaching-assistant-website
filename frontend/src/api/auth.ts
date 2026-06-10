import request from './request'

export interface LoginRequest {
  student_id: string
  password: string
}

export interface RegisterRequest {
  student_id: string
  name: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    username: string
    role_name: string
  }
}

export const authApi = {
  login: (data: LoginRequest) =>
    request.post<AuthResponse>('/v1/auth/login', data),
  register: (data: RegisterRequest) =>
    request.post<AuthResponse>('/v1/auth/register', data),
}
