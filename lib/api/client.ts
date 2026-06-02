import { BACKEND_CONFIG } from '@/lib/system-config'
import { BACKEND_URLS } from './endpoints'
import type { ApiResponse, ApiError } from './types'

let authToken: string | null = null
let baseURL = BACKEND_CONFIG.BASE_URL
let timeout = BACKEND_CONFIG.TIMEOUT
let maxRetries = BACKEND_CONFIG.MAX_RETRIES
let retryDelay = BACKEND_CONFIG.RETRY_DELAY
let enableCache = true
let enableOfflineQueue = true

// Cache et file d'attente
const requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>()
let offlineQueue: Array<{
  id: string
  url: string
  method: string
  body?: any
  resolve: (value: any) => void
  reject: (reason: any) => void
  retryCount: number
}> = []
let isProcessingQueue = false

// Messages d'erreur multilingues (simplifié ici, mais vous pouvez importer vos traductions)
const errorMessages: Record<string, Record<number, string>> = {
  fr: { 0: 'Erreur réseau', 408: 'Délai dépassé', 401: 'Non autorisé' },
  en: { 0: 'Network error', 408: 'Timeout', 401: 'Unauthorized' },
}
let currentLang = 'fr'

export const setApiAuthToken = (token: string) => { authToken = token }
export const removeApiAuthToken = () => { authToken = null }
export const setApiLanguage = (lang: string) => { currentLang = lang }

const buildUrl = (url: string): string => {
  if (url.startsWith('http')) return url
  return `${baseURL}${url}`
}

const getCacheKey = (method: string, url: string, body?: any) =>
  `${method}:${url}:${body ? JSON.stringify(body) : ''}`

async function makeRequest<T>(
  url: string,
  method: string,
  body?: any,
  config?: RequestInit
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config?.headers as Record<string, string>),
  }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  try {
    const response = await fetch(buildUrl(url), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      ...config,
    })
    clearTimeout(timeoutId)

    const isJson = response.headers.get('content-type')?.includes('application/json')
    const data = response.status === 204 ? null : isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const err = new Error(data?.message || response.statusText) as ApiError<T>
      err.status = response.status
      err.data = data
      throw err
    }
    return { data, status: response.status, statusText: response.statusText, headers: response.headers }
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      const err = new Error(errorMessages[currentLang]?.[408] || 'Timeout') as ApiError<T>
      err.status = 408
      err.isTimeout = true
      throw err
    }
    if (!error.status) {
      const err = new Error(errorMessages[currentLang]?.[0] || 'Network error') as ApiError<T>
      err.status = 0
      err.isNetworkError = true
      throw err
    }
    throw error
  }
}

async function request<T>(
  url: string,
  method: string,
  body?: any,
  config?: RequestInit & { retryCount?: number; cache?: boolean; cacheTTL?: number }
): Promise<ApiResponse<T>> {
  const isReadOnly = method === 'GET'
  const cacheKey = getCacheKey(method, url, body)

  // Cache pour GET
  if (isReadOnly && enableCache && config?.cache !== false) {
    const cached = requestCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < (config?.cacheTTL ?? 60000)) {
      return { data: cached.data, status: 200, statusText: 'OK (cached)', headers: new Headers() }
    }
  }

  // Hors ligne : mettre en queue pour POST/PUT/DELETE
  if (typeof navigator !== 'undefined' && !navigator.onLine && enableOfflineQueue && !isReadOnly) {
    return new Promise((resolve, reject) => {
      offlineQueue.push({
        id: `${Date.now()}-${Math.random()}`,
        url,
        method,
        body,
        resolve,
        reject,
        retryCount: 0,
      })
    })
  }

  let lastError: any
  const retries = config?.retryCount ?? (isReadOnly ? maxRetries : 1)
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await new Promise(r => setTimeout(r, retryDelay * Math.pow(2, attempt - 1)))
    }
    try {
      const result = await makeRequest<T>(url, method, body, config)
      if (isReadOnly && enableCache) {
        requestCache.set(cacheKey, { data: result.data, timestamp: Date.now(), ttl: config?.cacheTTL ?? 60000 })
      }
      return result
    } catch (err) {
      lastError = err
      if (err.status === 401 || err.status === 403 || err.status === 404) break
    }
  }
  throw lastError
}

// Fonctions HTTP
export const http = {
  get: <T>(url: string, config?: any) => request<T>(url, 'GET', undefined, config),
  post: <T>(url: string, body?: any, config?: any) => request<T>(url, 'POST', body, config),
  put: <T>(url: string, body?: any, config?: any) => request<T>(url, 'PUT', body, config),
  patch: <T>(url: string, body?: any, config?: any) => request<T>(url, 'PATCH', body, config),
  delete: <T>(url: string, config?: any) => request<T>(url, 'DELETE', undefined, config),
}

// Gestion file d'attente offline
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const queue = [...offlineQueue]
    offlineQueue = []
    isProcessingQueue = false
    queue.forEach(req => {
      request(req.url, req.method, req.body)
        .then(req.resolve)
        .catch(req.reject)
    })
  })
}

export const apiConfig = {
  setBaseURL: (url: string) => { baseURL = url },
  setGlobalTimeout: (ms: number) => { timeout = ms },
  setMaxRetries: (n: number) => { maxRetries = n },
  setEnableCache: (b: boolean) => { enableCache = b },
  setApiLanguage,
  clearCache: () => requestCache.clear(),
  clearOfflineQueue: () => { offlineQueue = [] },
}