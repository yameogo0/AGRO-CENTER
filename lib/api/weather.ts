import { http } from './client'
import { BACKEND_URLS } from './endpoints'

export const weatherApi = {
  getCurrent: (lat?: number, lng?: number) =>
    http.get(BACKEND_URLS.WEATHER, { params: { lat, lng } }),
}