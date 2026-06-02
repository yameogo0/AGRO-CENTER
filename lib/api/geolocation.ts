import { http } from './client'
import { BACKEND_URLS } from './endpoints'

export const geolocationApi = {
  updatePosition: (lat: number, lng: number) =>
    http.post(BACKEND_URLS.GEOLOCATION, { latitude: lat, longitude: lng }),
  getNearbyUsers: (radiusKm: number = 10) =>
    http.get(`${BACKEND_URLS.NEARBY_USERS}?radius=${radiusKm}`),
}