import { useState, useCallback, useRef, useEffect } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface ApiOptions extends RequestInit {
  skipAuth?: boolean
  baseUrl?: string
  timeout?: number
  retryCount?: number
  retryDelay?: number
}

interface UseApiReturn<T> extends ApiState<T> {
  request: <R = T>(
    url: string,
    options?: ApiOptions
  ) => Promise<R>
  reset: () => void
  abort: () => void
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

// Intercepteur pour ajouter les headers d'authentification
const getAuthHeaders = (skipAuth?: boolean): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  if (!skipAuth) {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('pi_access_token') 
      : null
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

// Timeout personnalisé pour fetch
const fetchWithTimeout = (
  url: string,
  options: RequestInit,
  timeout: number = 30000
): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout dépassé (${timeout}ms)`)), timeout)
    ),
  ]) as Promise<Response>
}

// Retry logic
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retryCount: number = 0,
  retryDelay: number = 1000
): Promise<Response> => {
  try {
    return await fetch(url, options)
  } catch (error) {
    if (retryCount <= 0) throw error
    
    console.log(`⚠️ Tentative échouée, nouvelle tentative dans ${retryDelay}ms... (${retryCount} restantes)`)
    
    await new Promise(resolve => setTimeout(resolve, retryDelay))
    
    return fetchWithRetry(url, options, retryCount - 1, retryDelay * 1.5)
  }
}

export function useApi<T = any>(): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  // Annuler la requête en cours
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  // Réinitialiser l'état
  const reset = useCallback(() => {
    abort()
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [abort])

  // Nettoyage automatique
  useEffect(() => {
    return () => {
      abort()
    }
  }, [abort])

  const request = useCallback(
    async <R = T>(
      url: string,
      options?: ApiOptions
    ): Promise<R> => {
      // Annuler la requête précédente si elle existe
      abort()
      
      // Créer un nouvel AbortController
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      const {
        skipAuth = false,
        baseUrl = '',
        timeout = 30000,
        retryCount = 0,
        retryDelay = 1000,
        ...fetchOptions
      } = options || {}

      setState({ data: null, loading: true, error: null })

      try {
        const fullUrl = baseUrl ? `${baseUrl}${url}` : url
        
        const headers = {
          ...getAuthHeaders(skipAuth),
          ...fetchOptions.headers,
        }

        const requestOptions: RequestInit = {
          ...fetchOptions,
          headers,
          signal: abortController.signal,
        }

        // Requête avec timeout et retry
        let response: Response
        
        if (retryCount > 0) {
          response = await fetchWithRetry(fullUrl, requestOptions, retryCount, retryDelay)
        } else {
          response = await fetchWithTimeout(fullUrl, requestOptions, timeout)
        }

        // Gestion des erreurs HTTP
        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`
          
          try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorData.error || errorMessage
          } catch {
            // Ignorer l'erreur de parsing JSON
          }
          
          throw new Error(errorMessage)
        }

        // Gestion de la réponse vide
        const contentType = response.headers.get('content-type')
        let data: any = null
        
        if (contentType?.includes('application/json')) {
          data = await response.json()
        } else if (contentType?.includes('text/')) {
          data = await response.text()
        }

        setState({ data, loading: false, error: null })
        abortControllerRef.current = null
        return data as R
      } catch (err: any) {
        // Ignorer les erreurs d'abort
        if (err.name === 'AbortError') {
          console.log('Requête annulée')
          return null as R
        }
        
        const errorMessage = err.message || 'Une erreur est survenue'
        setState({ data: null, loading: false, error: errorMessage })
        abortControllerRef.current = null
        throw err
      }
    },
    [abort]
  )

  // Méthodes helper pour les différents verbes HTTP
  const get = useCallback(
    <R = T>(url: string, options?: ApiOptions): Promise<R> => {
      return request<R>(url, { ...options, method: 'GET' })
    },
    [request]
  )

  const post = useCallback(
    <R = T>(url: string, body?: any, options?: ApiOptions): Promise<R> => {
      return request<R>(url, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      })
    },
    [request]
  )

  const put = useCallback(
    <R = T>(url: string, body?: any, options?: ApiOptions): Promise<R> => {
      return request<R>(url, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      })
    },
    [request]
  )

  const patch = useCallback(
    <R = T>(url: string, body?: any, options?: ApiOptions): Promise<R> => {
      return request<R>(url, {
        ...options,
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      })
    },
    [request]
  )

  const del = useCallback(
    <R = T>(url: string, options?: ApiOptions): Promise<R> => {
      return request<R>(url, { ...options, method: 'DELETE' })
    },
    [request]
  )

  // Export des méthodes utiles
  return {
    ...state,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
    abort,
    isLoading: state.loading,
    isSuccess: !!state.data && !state.loading && !state.error,
    isError: !!state.error,
  }
}

// Hook simplifié pour les requêtes individuelles
export function useApiRequest<T = any>() {
  const { request, ...rest } = useApi<T>()
  
  const execute = useCallback(
    async (
      url: string,
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
      body?: any,
      options?: ApiOptions
    ): Promise<T> => {
      return request(url, { ...options, method, body })
    },
    [request]
  )
  
  return { execute, ...rest }
}

// Types pour les réponses API courantes
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default useApi