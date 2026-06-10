import request from './request'

export interface LoginRequest {
  student_id: string
  password: string
}

export interface RegisterRequest {
  student_id: string
  full_name: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    student_id: string
    full_name: string
    role_name: string
  }
}

export const authApi = {
  login: (data: LoginRequest) =>
    request.post<AuthResponse>('/v1/auth/login', new URLSearchParams({
      username: data.student_id,
      password: data.password,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),
  register: (data: RegisterRequest) =>
    request.post<AuthResponse>('/v1/auth/register', data),
}
