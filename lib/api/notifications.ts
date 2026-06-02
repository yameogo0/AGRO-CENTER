import { http } from './client'
import { BACKEND_URLS } from './endpoints'

export const notificationsApi = {
  getAll: () => http.get(BACKEND_URLS.NOTIFICATIONS),
  markAsRead: (id: string) => http.post(`${BACKEND_URLS.NOTIFICATIONS}/${id}/read`),
  getSettings: () => http.get(BACKEND_URLS.NOTIFICATION_SETTINGS),
  updateSettings: (data: any) => http.patch(BACKEND_URLS.NOTIFICATION_SETTINGS, data),
}