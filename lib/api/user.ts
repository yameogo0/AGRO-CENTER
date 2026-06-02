import { http } from './client'
import { BACKEND_URLS } from './endpoints'
import type { User, UserStats } from './types'

export const userApi = {
  getProfile: () => http.get<User>(BACKEND_URLS.USER_PROFILE),
  getStats: () => http.get<UserStats>(BACKEND_URLS.USER_STATS),
  updateProfile: (data: Partial<User>) => http.patch<User>(BACKEND_URLS.UPDATE_PROFILE, data),
}