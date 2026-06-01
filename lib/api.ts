/**
 * Global fetch-based client for making API requests.
 *
 * - Set auth with `setApiAuthToken(token)`; it injects the Authorization header.
 * - Remove auth with `removeApiAuthToken()`.
 * - Parses JSON automatically; for 204 responses `data` is `null`.
 * - Returns `{ data, status, statusText, headers }`.
 * - On non-2xx, throws an Error with `status` and `data`.
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
}

let authToken: string | null = null;

// Headers par défaut
const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

// Options de configuration globales
let baseURL: string = "";
let timeout: number = 30000; // 30 secondes par défaut

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
 * Promise avec timeout
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs}ms`));
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

const request = async <T = any>(
  url: string,
  init: RequestInit = {}
): Promise<FetchResponse<T>> => {
  const fullUrl = buildUrl(url);
  
  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(init.headers as Record<string, string> | undefined),
  };
  
  if (authToken) {
    // S'assurer que le token a le bon format (Bearer)
    const tokenValue = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;
    headers["Authorization"] = tokenValue;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await withTimeout(
      fetch(fullUrl, {
        ...init,
        headers,
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
      const error = new Error(
        typeof data === "object" && data?.message 
          ? data.message 
          : response.statusText || "Request failed"
      ) as ApiError<T>;
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
      const timeoutError = new Error(`Request timeout after ${timeout}ms`) as ApiError<T>;
      timeoutError.status = 408;
      timeoutError.data = null as T;
      throw timeoutError;
    }
    
    // Ré-throw les erreurs ApiError déjà formatées
    if (error.status) {
      throw error;
    }
    
    // Erreur réseau ou autre
    const networkError = new Error(
      error.message || "Network error - please check your connection"
    ) as ApiError<T>;
    networkError.status = 0;
    networkError.data = null as T;
    throw networkError;
  }
};

export const api = {
  get: <T = any>(url: string, init?: RequestInit) =>
    request<T>(url, { ...init, method: "GET" }),

  delete: <T = any>(url: string, init?: RequestInit) =>
    request<T>(url, { ...init, method: "DELETE" }),

  post: <T = any>(url: string, body?: any, init?: RequestInit) =>
    request<T>(url, {
      ...init,
      method: "POST",
      body: body === undefined ? init?.body : JSON.stringify(body),
    }),

  put: <T = any>(url: string, body?: any, init?: RequestInit) =>
    request<T>(url, {
      ...init,
      method: "PUT",
      body: body === undefined ? init?.body : JSON.stringify(body),
    }),

  patch: <T = any>(url: string, body?: any, init?: RequestInit) =>
    request<T>(url, {
      ...init,
      method: "PATCH",
      body: body === undefined ? init?.body : JSON.stringify(body),
    }),
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

// Export des utilitaires de configuration
export const apiConfig = {
  setBaseURL,
  setGlobalTimeout,
  getBaseURL: () => baseURL,
  getTimeout: () => timeout,
};