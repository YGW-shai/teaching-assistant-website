import request from './request'

export interface ExecuteRequest {
  code: string
}

export interface ExecuteResponse {
  stdout: string
  stderr: string
  exit_code: number
  execution_time_ms: number
}

export const executeApi = {
  run: (data: ExecuteRequest) =>
    request.post<ExecuteResponse>('/v1/execute/', data),
}
