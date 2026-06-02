import { http } from './client'
import { BACKEND_URLS } from './endpoints'

export const analyticsApi = {
  getDashboardStats: () => http.get(BACKEND_URLS.ANALYTICS),
}