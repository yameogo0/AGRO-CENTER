import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook personnalisé pour débouncer une valeur.
 * Utile pour les recherches en temps réel, les filtres, etc.
 * 
 * @param value - La valeur à débouncer
 * @param delay - Le délai en millisecondes (défaut: 500ms)
 * @returns La valeur débouncée
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearch = useDebounce(searchTerm, 300)
 * 
 * useEffect(() => {
 *   // Appel API avec debouncedSearch
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Nettoyer le timer précédent
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Démarrer un nouveau timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Nettoyage lors du démontage ou changement de dépendances
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Version avec callback pour exécuter une fonction après le debounce
 * 
 * @param callback - La fonction à exécuter après le délai
 * @param delay - Le délai en millisecondes
 * @returns Une fonction debouncée
 * 
 * @example
 * const debouncedSearch = useDebounceCallback((term: string) => {
 *   console.log('Recherche:', term)
 * }, 300)
 * 
 * debouncedSearch('ma recherche')
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args)
        timerRef.current = null
      }, delay)
    },
    [delay]
  )
}

/**
 * Hook pour debouncer une promesse (utile pour les appels API)
 * 
 * @param fn - La fonction asynchrone à exécuter
 * @param delay - Le délai en millisecondes
 * @returns Un objet avec execute, loading, error, cancelled
 * 
 * @example
 * const { execute, loading, error } = useDebouncePromise(searchAPI, 500)
 * 
 * useEffect(() => {
 *   execute(searchTerm)
 * }, [searchTerm])
 */
export function useDebouncePromise<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delay: number = 500
): {
  execute: (...args: Parameters<T>) => Promise<ReturnType<T> | null>
  loading: boolean
  error: Error | null
  cancelled: boolean
} {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        setCancelled(true)
      }

      // Créer un nouveau controller
      abortControllerRef.current = new AbortController()

      return new Promise((resolve, reject) => {
        // Nettoyer le timer précédent
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }

        setLoading(true)
        setError(null)
        setCancelled(false)

        timerRef.current = setTimeout(async () => {
          try {
            const result = await fn(...args)
            setLoading(false)
            setCancelled(false)
            resolve(result)
          } catch (err) {
            const error = err as Error
            if (error.name !== 'AbortError') {
              setError(error)
              reject(error)
            } else {
              setCancelled(true)
            }
            setLoading(false)
          } finally {
            abortControllerRef.current = null
            timerRef.current = null
          }
        }, delay)
      }) as ReturnType<T>
    },
    [fn, delay]
  )

  // Annuler la requête en cours si le composant est démonté
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return { execute, loading, error, cancelled }
}

/**
 * Hook pour debouncer avec état de chargement
 * 
 * @param defaultValue - La valeur par défaut
 * @param delay - Le délai en millisecondes
 * @returns Un tuple [value, setValue, isDebouncing, debouncedValue]
 * 
 * @example
 * const [search, setSearch, isDebouncing, debouncedSearch] = useDebounceState('', 300)
 */
export function useDebounceState<T>(
  defaultValue: T,
  delay: number = 500
): [T, (value: T) => void, boolean, T] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isDebouncing, setIsDebouncing] = useState(false)
  const debouncedValue = useDebounce(value, delay)

  // Mettre à jour l'état de debounce
  useEffect(() => {
    setIsDebouncing(true)
    const timer = setTimeout(() => {
      setIsDebouncing(false)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return [value, setValue, isDebouncing, debouncedValue]
}

/**
 * Hook pour debouncer avec annulation manuelle
 * 
 * @param value - La valeur à débouncer
 * @param delay - Le délai en millisecondes
 * @returns Un objet avec la valeur débouncée et une fonction d'annulation
 * 
 * @example
 * const { debouncedValue, cancel } = useDebounceWithCancel(searchTerm, 300)
 */
export function useDebounceWithCancel<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
      timerRef.current = null
    }, delay)

    return cancel
  }, [value, delay, cancel])

  return { debouncedValue, cancel }
}

/**
 * Hook pour debouncer avec option leading et trailing
 * 
 * @param value - La valeur à débouncer
 * @param delay - Le délai en millisecondes
 * @param options - Options de configuration
 * @returns La valeur débouncée
 * 
 * @example
 * const debouncedValue = useDebounceAdvanced(searchTerm, 300, { leading: true, trailing: true })
 */
export function useDebounceAdvanced<T>(
  value: T,
  delay: number = 500,
  options?: {
    leading?: boolean
    trailing?: boolean
    maxWait?: number
  }
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const leadingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const maxWaitRef = useRef<NodeJS.Timeout | null>(null)
  const valueRef = useRef<T>(value)
  const leadingExecutedRef = useRef(false)

  const { leading = false, trailing = true, maxWait } = options || {}

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (leadingTimerRef.current) {
      clearTimeout(leadingTimerRef.current)
      leadingTimerRef.current = null
    }
    if (maxWaitRef.current) {
      clearTimeout(maxWaitRef.current)
      maxWaitRef.current = null
    }
  }, [])

  useEffect(() => {
    // Leading edge execution
    if (leading && !leadingTimerRef.current && !timerRef.current && !leadingExecutedRef.current) {
      setDebouncedValue(value)
      leadingExecutedRef.current = true
      leadingTimerRef.current = setTimeout(() => {
        leadingTimerRef.current = null
        leadingExecutedRef.current = false
      }, delay)
    }

    // Trailing edge execution
    if (trailing) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        setDebouncedValue(valueRef.current)
        timerRef.current = null
      }, delay)
    }

    // Max wait execution
    if (maxWait && !maxWaitRef.current) {
      maxWaitRef.current = setTimeout(() => {
        if (timerRef.current) {
          setDebouncedValue(valueRef.current)
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        maxWaitRef.current = null
      }, maxWait)
    }

    return clearTimers
  }, [value, delay, leading, trailing, maxWait, clearTimers])

  return debouncedValue
}

/**
 * Fonction utilitaire pour créer une fonction debouncée (non-hook)
 * 
 * @param func - La fonction à débouncer
 * @param delay - Le délai en millisecondes
 * @param options - Options de configuration
 * @returns Une fonction debouncée avec méthode cancel
 * 
 * @example
 * const debouncedSearch = debounce((term: string) => {
 *   console.log('Recherche:', term)
 * }, 300)
 * 
 * debouncedSearch('test')
 * debouncedSearch.cancel() // Annule la requête en attente
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 500,
  options?: { leading?: boolean; trailing?: boolean }
): T & { cancel: () => void; flush: () => void } {
  let timeoutId: NodeJS.Timeout | null = null
  let leadingTimerId: NodeJS.Timeout | null = null
  let lastArgs: Parameters<T> | null = null
  let lastThis: any = null
  const { leading = false, trailing = true } = options || {}

  const invoke = () => {
    if (lastArgs && lastThis) {
      func.apply(lastThis, lastArgs)
      lastArgs = null
      lastThis = null
    }
  }

  const debounced = function (this: any, ...args: Parameters<T>) {
    lastArgs = args
    lastThis = this

    if (leading && !timeoutId && !leadingTimerId) {
      invoke()
      leadingTimerId = setTimeout(() => {
        leadingTimerId = null
      }, delay)
    }

    if (trailing) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        invoke()
        timeoutId = null
      }, delay)
    }
  } as T & { cancel: () => void; flush: () => void }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    if (leadingTimerId) {
      clearTimeout(leadingTimerId)
      leadingTimerId = null
    }
    lastArgs = null
    lastThis = null
  }

  debounced.flush = () => {
    debounced.cancel()
    invoke()
  }

  return debounced
}

export default useDebounce