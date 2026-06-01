// System Configuration
// This file contains configuration values that should not be modified during normal app customization.
// These values are set during app creation.

/**
 * Détermine l'environnement actuel
 */
export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
} as const;

export type Environment = typeof ENVIRONMENT[keyof typeof ENVIRONMENT];

/**
 * Détecte l'environnement actuel
 */
const getCurrentEnvironment = (): Environment => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return ENVIRONMENT.DEVELOPMENT;
    }
    if (hostname.includes("staging") || hostname.includes("test")) {
      return ENVIRONMENT.STAGING;
    }
  }
  if (process.env.NODE_ENV === "development") {
    return ENVIRONMENT.DEVELOPMENT;
  }
  return ENVIRONMENT.PRODUCTION;
};

export const CURRENT_ENV = getCurrentEnvironment();

/**
 * Pi Network Configuration
 */
export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: CURRENT_ENV !== ENVIRONMENT.PRODUCTION, // Mode sandbox en développement/staging
  VERSION: "2.0",
  API_BASE_URL: CURRENT_ENV === ENVIRONMENT.PRODUCTION 
    ? "https://api.minepi.com"
    : "https://sandbox-api.minepi.com",
  SCOPES: ["username", "wallet_address", "payments"],
} as const;

/**
 * Backend Configuration par environnement
 */
const BACKEND_URLS_BY_ENV = {
  [ENVIRONMENT.DEVELOPMENT]: "https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com",
  [ENVIRONMENT.STAGING]: "https://staging-api.agromc.com",
  [ENVIRONMENT.PRODUCTION]: "https://api.agromc.com",
};

export const BACKEND_CONFIG = {
  BASE_URL: BACKEND_URLS_BY_ENV[CURRENT_ENV] || BACKEND_URLS_BY_ENV[ENVIRONMENT.PRODUCTION],
  TIMEOUT: 30000, // 30 secondes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Backend URLs
 */
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
  
  // Health check
  HEALTH: `${BACKEND_CONFIG.BASE_URL}/health`,
} as const;

/**
 * Frontend Configuration
 */
export const FRONTEND_CONFIG = {
  APP_NAME: "Agro Multicenter Hinos",
  APP_VERSION: "2.0.0",
  APP_DESCRIPTION: "Plateforme agricole connectée pour l'Afrique",
  SUPPORT_EMAIL: "support@agromc.com",
  SUPPORT_PHONE: "+226 70 00 00 00",
  WEBSITE: "https://www.agromc.com",
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  ENABLE_PI_PAYMENTS: true,
  ENABLE_GEOLOCATION: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: true,
  ENABLE_ANALYTICS: CURRENT_ENV !== ENVIRONMENT.DEVELOPMENT,
  ENABLE_DEBUG_MODE: CURRENT_ENV === ENVIRONMENT.DEVELOPMENT,
} as const;

/**
 * Storage Keys (localStorage / sessionStorage)
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "agro_auth_token",
  REFRESH_TOKEN: "agro_refresh_token",
  USER_DATA: "agro_user_data",
  LANGUAGE: "agro_language",
  THEME: "agro_theme",
  NOTIFICATIONS_ENABLED: "agro_notifications_enabled",
  OFFLINE_QUEUE: "agro_offline_queue",
  CACHED_SERVICES: "agro_cached_services",
  FAVORITE_PRODUCTS: "agro_favorite_products",
  DISMISSED_ALERTS: "agro_dismissed_alerts",
  PINNED_CONVERSATIONS: "agro_pinned_conversations",
  ARCHIVED_CONVERSATIONS: "agro_archived_conversations",
} as const;

/**
 * Validation des URLs
 */
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!BACKEND_CONFIG.BASE_URL) {
    errors.push("BACKEND_CONFIG.BASE_URL is not defined");
  }
  
  if (!PI_NETWORK_CONFIG.SDK_URL) {
    errors.push("PI_NETWORK_CONFIG.SDK_URL is not defined");
  }
  
  // Vérifier que les URLs essentielles sont définies
  const essentialUrls = [
    "LOGIN",
    "USER_PROFILE",
    "SERVICES",
  ];
  
  for (const urlName of essentialUrls) {
    if (!BACKEND_URLS[urlName as keyof typeof BACKEND_URLS]) {
      errors.push(`BACKEND_URLS.${urlName} is not defined`);
    }
  }
  
  return { valid: errors.length === 0, errors };
};

/**
 * Affiche les informations de configuration dans la console (debug)
 */
export const logConfig = (): void => {
  if (CURRENT_ENV === ENVIRONMENT.DEVELOPMENT) {
    console.group("📋 Agro MultiCenter Hinos - Configuration");
    console.log("🌍 Environment:", CURRENT_ENV);
    console.log("🔧 Backend URL:", BACKEND_CONFIG.BASE_URL);
    console.log("π Pi Network Sandbox:", PI_NETWORK_CONFIG.SANDBOX);
    console.log("⚙️ Features:", FEATURES);
    console.log("✅ Config valid:", validateConfig().valid);
    console.groupEnd();
  }
};

// Auto-validation et logging en développement
if (typeof window !== "undefined" && CURRENT_ENV === ENVIRONMENT.DEVELOPMENT) {
  const { valid, errors } = validateConfig();
  if (!valid) {
    console.error("❌ Configuration errors:", errors);
  }
  logConfig();
}

/**
 * Récupère l'URL complète avec les paramètres
 */
export const getApiUrl = (endpoint: keyof typeof BACKEND_URLS, params?: Record<string, string>): string => {
  let url = BACKEND_URLS[endpoint];
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  return url;
};

/**
 * Vérifie si l'API est accessible
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(BACKEND_URLS.HEALTH, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
};

export default {
  ENVIRONMENT,
  CURRENT_ENV,
  PI_NETWORK_CONFIG,
  BACKEND_CONFIG,
  BACKEND_URLS,
  FRONTEND_CONFIG,
  FEATURES,
  STORAGE_KEYS,
  validateConfig,
  getApiUrl,
  checkApiHealth,
};