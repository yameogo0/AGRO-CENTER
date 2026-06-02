import { BACKEND_CONFIG } from '@/lib/system-config'

export const BACKEND_URLS = {
  // Authentification
  LOGIN: `${BACKEND_CONFIG.BASE_URL}/v1/login`,
  REGISTER: `${BACKEND_CONFIG.BASE_URL}/v1/register`,
  LOGOUT: `${BACKEND_CONFIG.BASE_URL}/v1/logout`,
  REFRESH_TOKEN: `${BACKEND_CONFIG.BASE_URL}/v1/refresh`,
  
  // Utilisateur
  USER_PROFILE: `${BACKEND_CONFIG.BASE_URL}/v1/user/profile`,
  USER_STATS: `${BACKEND_CONFIG.BASE_URL}/v1/user/stats`,
  UPDATE_PROFILE: `${BACKEND_CONFIG.BASE_URL}/v1/user/profile/update`,
  
  // Pi Network
  PI_VERIFY: `${BACKEND_CONFIG.BASE_URL}/v1/pi/verify`,
  PI_WALLET: `${BACKEND_CONFIG.BASE_URL}/v1/pi/wallet`,
  PI_TRANSACTIONS: `${BACKEND_CONFIG.BASE_URL}/v1/pi/transactions`,
  PI_PAYMENT: `${BACKEND_CONFIG.BASE_URL}/v1/pi/payment`,
  
  // Services
  SERVICES: `${BACKEND_CONFIG.BASE_URL}/v1/services`,
  MY_SERVICES: `${BACKEND_CONFIG.BASE_URL}/v1/services/mine`,
  SERVICE_BOOKINGS: `${BACKEND_CONFIG.BASE_URL}/v1/services/bookings`,
  
  // Messagerie
  CONVERSATIONS: `${BACKEND_CONFIG.BASE_URL}/v1/messages/conversations`,
  MESSAGES: `${BACKEND_CONFIG.BASE_URL}/v1/messages`,
  
  // Géolocalisation
  GEOLOCATION: `${BACKEND_CONFIG.BASE_URL}/v1/geolocation`,
  NEARBY_USERS: `${BACKEND_CONFIG.BASE_URL}/v1/geolocation/nearby`,
  
  // Météo
  WEATHER: `${BACKEND_CONFIG.BASE_URL}/v1/weather`,
  
  // Notifications
  NOTIFICATIONS: `${BACKEND_CONFIG.BASE_URL}/v1/notifications`,
  NOTIFICATION_SETTINGS: `${BACKEND_CONFIG.BASE_URL}/v1/notifications/settings`,
  
  // Analytics
  ANALYTICS: `${BACKEND_CONFIG.BASE_URL}/v1/analytics`,
  
  // Health
  HEALTH: `${BACKEND_CONFIG.BASE_URL}/health`,
} as const

export type ApiEndpoint = keyof typeof BACKEND_URLS