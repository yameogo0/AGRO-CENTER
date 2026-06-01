/**
 * Global fetch-based client for making API requests.
 *
 * - Set auth with `setApiAuthToken(token)`; it injects the Authorization header.
 * - Remove auth with `removeApiAuthToken()`.
 * - Parses JSON automatically; for 204 responses `data` is `null`.
 * - Returns `{ data, status, statusText, headers }`.
 * - On non-2xx, throws an Error with `status` and `data`.
 * - Supports retry logic, caching, and offline queue.
 *
 * @example
 * import { api } from '@/lib/api';
 *
 * const createThing = async () => {
 *   const { data } = await api.post('/api/your-endpoint', { data: 'your data' });
 *   console.log(data);
 * };
 *
 * await api.get('/api/users');
 * await api.put('/api/user/123', { name: 'Updated' });
 * await api.delete('/api/user/123');
 */

type FetchResponse<T> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
};

export interface ApiError<T = unknown> extends Error {
  status: number;
  data: T;
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

// Types pour la configuration
interface RequestConfig extends RequestInit {
  retryCount?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTTL?: number;
  skipAuth?: boolean;
  skipErrorToast?: boolean;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface QueuedRequest {
  id: string;
  url: string;
  config: RequestConfig;
  body?: any;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  retryCount: number;
}

let authToken: string | null = null;

// Headers par défaut
const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Options de configuration globales
let baseURL: string = "";
let timeout: number = 30000; // 30 secondes par défaut
let maxRetries: number = 3;
let retryDelay: number = 1000;
let enableCache: boolean = true;
let enableOfflineQueue: boolean = true;

// Cache des requêtes
const requestCache = new Map<string, CacheEntry>();

// File d'attente hors ligne
let offlineQueue: QueuedRequest[] = [];
let isProcessingQueue = false;

// Événements
type EventListener = () => void;
const connectionListeners: EventListener[] = [];

// Messages d'erreur par langue
const errorMessages = {
  fr: {
    network: "Erreur réseau. Vérifiez votre connexion internet.",
    timeout: "La requête a expiré. Veuillez réessayer.",
    server: "Erreur serveur. Veuillez réessayer plus tard.",
    unauthorized: "Session expirée. Veuillez vous reconnecter.",
    forbidden: "Accès non autorisé.",
    notFound: "Ressource non trouvée.",
    conflict: "Conflit avec les données existantes.",
    validation: "Données invalides. Veuillez vérifier.",
    unknown: "Une erreur inattendue est survenue.",
    offline: "Vous êtes hors ligne. La requête sera envoyée automatiquement quand la connexion sera rétablie.",
  },
  en: {
    network: "Network error. Please check your internet connection.",
    timeout: "Request timeout. Please try again.",
    server: "Server error. Please try again later.",
    unauthorized: "Session expired. Please log in again.",
    forbidden: "Access denied.",
    notFound: "Resource not found.",
    conflict: "Conflict with existing data.",
    validation: "Invalid data. Please check your input.",
    unknown: "An unexpected error occurred.",
    offline: "You are offline. The request will be sent automatically when connection is restored.",
  },
  es: {
    network: "Error de red. Verifique su conexión a internet.",
    timeout: "Tiempo de espera agotado. Por favor, intente de nuevo.",
    server: "Error del servidor. Por favor, intente más tarde.",
    unauthorized: "Sesión expirada. Por favor, inicie sesión nuevamente.",
    forbidden: "Acceso denegado.",
    notFound: "Recurso no encontrado.",
    conflict: "Conflicto con datos existentes.",
    validation: "Datos inválidos. Por favor, verifique.",
    unknown: "Ocurrió un error inesperado.",
    offline: "Está desconectado. La solicitud se enviará automáticamente cuando se restablezca la conexión.",
  },
  pt: {
    network: "Erro de rede. Verifique sua conexão com a internet.",
    timeout: "Tempo limite excedido. Por favor, tente novamente.",
    server: "Erro no servidor. Por favor, tente mais tarde.",
    unauthorized: "Sessão expirada. Por favor, faça login novamente.",
    forbidden: "Acesso negado.",
    notFound: "Recurso não encontrado.",
    conflict: "Conflito com dados existentes.",
    validation: "Dados inválidos. Por favor, verifique.",
    unknown: "Ocorreu um erro inesperado.",
    offline: "Você está offline. A solicitação será enviada automaticamente quando a conexão for restaurada.",
  },
  dioula: {
    network: "Sɔrɔlen tɛ jɛkulu la. I jɛkulu bɛɛ ye.",
    timeout: "Waati bana. I sɛgɛn kɛ.",
    server: "Jɛkulu ka tɔɔrɔ. I sɛgɛn kɛ kɔfɛ.",
    unauthorized: "I ka jatemɛ bana. I sɛgɛn kɛ.",
    forbidden: "I tɛ se ka don.",
    notFound: "Feni ma sɔrɔ.",
    conflict: "Banaɲɛ jɛkulu la.",
    validation: "Kunnafoni jugu. I bɛɛ lajɛ.",
    unknown: "Banaɲɛ wɛrɛ bɛɛ jɛkulu la.",
    offline: "I ka jɛkulu bana. Sɔrɔlen bɛɛ bɛna bɔ a yɛrɛ la.",
  },
  mooré: {
    network: "Lin lam tʋʋmɑ. Yɑɑ lɑ lɑm lɛ.",
    timeout: "Waoto bɑ dʋkɑ. Yɑɑ lɛb lɑ.",
    server: "Tʋʋm-tʋmdɑ tɑɑrɑ. Yɑɑ lɛb lɑ koɑ.",
    unauthorized: "Yɑɑ b sõng-yɑɑ. Yɑɑ lɛb lɑ.",
    forbidden: "Yɑɑ ka se tũ.",
    notFound: "Bũmbɑ ka be.",
    conflict: "Tɑɑb lɑɑ yɛlɛ.",
    validation: "Gomɑ b tũm. Yɑɑ lɑb nɑ.",
    unknown: "Bɑ̃ngrɑ tɑɑrɑ.",
    offline: "Yɑɑ lɑm lɛ. Bũmbɑ fɑɑ b nɑ yi.",
  },
}

let currentLanguage: keyof typeof errorMessages = "fr";

/**
 * Définit la langue des messages d'erreur
 */
export const setApiLanguage = (lang: keyof typeof errorMessages) => {
  currentLanguage = lang;
};

/**
 * Récupère le message d'erreur approprié
 */
const getErrorMessage = (status: number, type: string): string => {
  const messages = errorMessages[currentLanguage] || errorMessages.fr;
  
  const errorMap: Record<number, string> = {
    0: messages.network,
    408: messages.timeout,
    400: messages.validation,
    401: messages.unauthorized,
    403: messages.forbidden,
    404: messages.notFound,
    409: messages.conflict,
    500: messages.server,
    502: messages.server,
    503: messages.server,
  };
  
  return errorMap[status] || messages[type as keyof typeof messages] || messages.unknown;
};

/**
 * Génère une clé de cache unique pour une requête
 */
const getCacheKey = (url: string, method: string, body?: any): string => {
  return `${method}:${url}:${body ? JSON.stringify(body) : ""}`;
};

/**
 * Vérifie si une entrée de cache est valide
 */
const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < entry.ttl;
};

/**
 * Traite la file d'attente hors ligne
 */
const processOfflineQueue = async () => {
  if (isProcessingQueue || offlineQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (offlineQueue.length > 0) {
    const request = offlineQueue.shift();
    if (!request) continue;
    
    try {
      const result = await makeRequest(request.url, request.config, request.body);
      request.resolve(result);
    } catch (error) {
      if (request.retryCount < maxRetries) {
        // Remettre dans la queue avec un délai
        setTimeout(() => {
          offlineQueue.unshift({ ...request, retryCount: request.retryCount + 1 });
          processOfflineQueue();
        }, retryDelay * Math.pow(2, request.retryCount));
      } else {
        request.reject(error);
      }
    }
  }
  
  isProcessingQueue = false;
};

/**
 * Écoute les événements de connexion
 */
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    connectionListeners.forEach(listener => listener());
    processOfflineQueue();
  });
}

/**
 * Définit l'URL de base pour toutes les requêtes API
 */
export const setBaseURL = (url: string) => {
  baseURL = url;
};

/**
 * Définit le timeout global pour les requêtes (en millisecondes)
 */
export const setGlobalTimeout = (ms: number) => {
  timeout = ms;
};

/**
 * Définit le nombre maximum de tentatives
 */
export const setMaxRetries = (retries: number) => {
  maxRetries = retries;
};

/**
 * Active ou désactive le cache
 */
export const setEnableCache = (enabled: boolean) => {
  enableCache = enabled;
};

/**
 * Vide le cache
 */
export const clearCache = () => {
  requestCache.clear();
};

/**
 * Promise avec timeout améliorée
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      const error = new Error(`Request timeout after ${timeoutMs}ms`) as ApiError<T>;
      error.status = 408;
      error.isTimeout = true;
      reject(error);
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};

/**
 * Construit l'URL complète avec baseURL si définie
 */
const buildUrl = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return baseURL ? `${baseURL}${url}` : url;
};

/**
 * Ajoute des paramètres de requête à l'URL
 */
export const addQueryParams = (url: string, params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${url}${url.includes("?") ? "&" : "?"}${queryString}` : url;
};

/**
 * Effectue une requête avec délai exponentiel pour les retries
 */
const makeRequest = async <T = any>(
  url: string,
  config: RequestConfig,
  body?: any
): Promise<FetchResponse<T>> => {
  const fullUrl = buildUrl(url);
  const method = config.method || "GET";
  
  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(config.headers as Record<string, string> | undefined),
  };
  
  if (authToken && !config.skipAuth) {
    const tokenValue = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;
    headers["Authorization"] = tokenValue;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await withTimeout(
      fetch(fullUrl, {
        ...config,
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : config.body,
        signal: controller.signal,
      }),
      timeout
    );

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    
    let data: any;
    
    if (response.status === 204) {
      data = null;
    } else if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = data?.message || getErrorMessage(response.status, "unknown");
      const error = new Error(errorMessage) as ApiError<T>;
      error.status = response.status;
      error.data = data as T;
      throw error;
    }

    return {
      data: data as T,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    // Gérer l'abort (timeout)
    if (error.name === "AbortError") {
      const timeoutError = new Error(getErrorMessage(408, "timeout")) as ApiError<T>;
      timeoutError.status = 408;
      timeoutError.isTimeout = true;
      timeoutError.data = null as T;
      throw timeoutError;
    }
    
    // Ré-throw les erreurs ApiError déjà formatées
    if (error.status) {
      throw error;
    }
    
    // Erreur réseau
    const networkError = new Error(getErrorMessage(0, "network")) as ApiError<T>;
    networkError.status = 0;
    networkError.isNetworkError = true;
    networkError.data = null as T;
    throw networkError;
  }
};

/**
 * Requête principale avec retry, cache et offline queue
 */
const request = async <T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<FetchResponse<T>> => {
  const method = config.method || "GET";
  const isReadOnly = method === "GET";
  const cacheKey = getCacheKey(url, method, config.body);
  
  // Vérifier le cache pour les requêtes GET
  if (isReadOnly && enableCache && config.cache !== false) {
    const cached = requestCache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      return {
        data: cached.data as T,
        status: 200,
        statusText: "OK (cached)",
        headers: new Headers(),
      };
    }
  }
  
  // Vérifier si offline et mettre en queue
  if (typeof navigator !== "undefined" && !navigator.onLine && enableOfflineQueue && !isReadOnly) {
    if (!config.skipErrorToast) {
      console.warn(getErrorMessage(0, "offline"));
    }
    
    return new Promise((resolve, reject) => {
      offlineQueue.push({
        id: `${Date.now()}-${Math.random()}`,
        url,
        config,
        body: config.body,
        resolve,
        reject,
        retryCount: 0,
      });
    });
  }
  
  let lastError: any;
  let retries = config.retryCount ?? (isReadOnly ? maxRetries : 1);
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Délai exponentiel pour les retries
      if (attempt > 0) {
        const delay = (config.retryDelay ?? retryDelay) * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const result = await makeRequest<T>(url, config, config.body);
      
      // Mettre en cache les résultats des requêtes GET
      if (isReadOnly && enableCache) {
        const ttl = config.cacheTTL ?? 60000; // 1 minute par défaut
        requestCache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now(),
          ttl,
        });
      }
      
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Ne pas réessayer pour certaines erreurs
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        break;
      }
      
      // Ne pas réessayer si le timeout est atteint et que c'est la dernière tentative
      if (error.isTimeout && attempt === retries) {
        break;
      }
    }
  }
  
  throw lastError;
};

export const api = {
  get: <T = any>(url: string, config?: Omit<RequestConfig, "method" | "body">) =>
    request<T>(url, { ...config, method: "GET" }),

  delete: <T = any>(url: string, config?: Omit<RequestConfig, "method">) =>
    request<T>(url, { ...config, method: "DELETE" }),

  post: <T = any>(url: string, body?: any, config?: Omit<RequestConfig, "method" | "body">) =>
    request<T>(url, { ...config, method: "POST", body }),

  put: <T = any>(url: string, body?: any, config?: Omit<RequestConfig, "method" | "body">) =>
    request<T>(url, { ...config, method: "PUT", body }),

  patch: <T = any>(url: string, body?: any, config?: Omit<RequestConfig, "method" | "body">) =>
    request<T>(url, { ...config, method: "PATCH", body }),
};

/**
 * Définit le token d'authentification pour toutes les requêtes
 * @param token - Le token JWT ou la chaîne d'authentification
 * @param prefix - Si true, ajoute automatiquement "Bearer " (défaut: true)
 */
export const setApiAuthToken = (token: string, prefix: boolean = true) => {
  authToken = prefix && !token.startsWith("Bearer ") ? `Bearer ${token}` : token;
};

/**
 * Supprime le token d'authentification
 */
export const removeApiAuthToken = () => {
  authToken = null;
};

/**
 * Récupère le token d'authentification actuel
 */
export const getApiAuthToken = (): string | null => {
  return authToken;
};

/**
 * Vérifie si un token d'authentification est présent
 */
export const hasApiAuthToken = (): boolean => {
  return authToken !== null;
};

/**
 * Récupère le nombre de requêtes en attente dans la file d'attente hors ligne
 */
export const getOfflineQueueLength = (): number => {
  return offlineQueue.length;
};

/**
 * Vide la file d'attente hors ligne
 */
export const clearOfflineQueue = () => {
  offlineQueue = [];
};

/**
 * Ajoute un écouteur d'événement de connexion
 */
export const onConnectionRestored = (listener: EventListener) => {
  connectionListeners.push(listener);
  return () => {
    const index = connectionListeners.indexOf(listener);
    if (index > -1) connectionListeners.splice(index, 1);
  };
};

// Export des utilitaires de configuration
export const apiConfig = {
  setBaseURL,
  setGlobalTimeout,
  setMaxRetries,
  setEnableCache,
  setApiLanguage,
  clearCache,
  clearOfflineQueue,
  getOfflineQueueLength,
  onConnectionRestored,
  getBaseURL: () => baseURL,
  getTimeout: () => timeout,
  getMaxRetries: () => maxRetries,
  isCacheEnabled: () => enableCache,
  isOfflineQueueEnabled: () => enableOfflineQueue,
};

export default api;