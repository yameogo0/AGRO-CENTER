import { http } from './client'
import { BACKEND_URLS } from './endpoints'
import type { User } from './types'

export const authApi = {
  login: (email: string, password: string) =>
    http.post<{ user: User; token: string }>(BACKEND_URLS.LOGIN, { email, password }),

  register: (data: any) =>
    http.post<{ user: User; token: string }>(BACKEND_URLS.REGISTER, data),

  logout: () => http.post(BACKEND_URLS.LOGOUT),

  refreshToken: () => http.post<{ token: string }>(BACKEND_URLS.REFRESH_TOKEN),
}