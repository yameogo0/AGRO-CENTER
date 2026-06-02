import { useEffect, RefObject, useCallback, useRef } from 'react'

interface UseClickOutsideOptions {
  /** Événements à écouter (par défaut: ['mousedown', 'touchstart']) */
  events?: ('mousedown' | 'mouseup' | 'click' | 'touchstart' | 'touchend')[]
  /** Ignorer certains éléments (refs supplémentaires) */
  ignoreRefs?: RefObject<HTMLElement>[]
  /** Activer/désactiver le hook */
  enabled?: boolean
  /** Délai avant activation (ms) */
  delay?: number
  /** Également écouter les événements sur le document */
  listenToDocument?: boolean
}

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options?: UseClickOutsideOptions
) {
  const {
    events = ['mousedown', 'touchstart'],
    ignoreRefs = [],
    enabled = true,
    delay = 0,
    listenToDocument = true,
  } = options || {}

  const handlerRef = useRef(handler)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mettre à jour la référence du handler
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  const handleEvent = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!enabled) return
      
      // Vérifier si le clic est à l'intérieur du ref principal
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }

      // Vérifier les refs à ignorer
      const isIgnored = ignoreRefs.some(
        (ignoreRef) => ignoreRef.current && ignoreRef.current.contains(event.target as Node)
      )

      if (isIgnored) {
        return
      }

      // Exécuter le handler avec délai optionnel
      if (delay > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          handlerRef.current(event)
        }, delay)
      } else {
        handlerRef.current(event)
      }
    },
    [ref, ignoreRefs, enabled, delay]
  )

  useEffect(() => {
    if (!enabled) return

    const target = listenToDocument ? document : document.body

    // Ajouter les événements
    events.forEach((eventName) => {
      target.addEventListener(eventName, handleEvent as EventListener)
    })

    // Nettoyage
    return () => {
      events.forEach((eventName) => {
        target.removeEventListener(eventName, handleEvent as EventListener)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [events, handleEvent, enabled, listenToDocument])
}

// Version avec support pour plusieurs refs
export function useClickOutsideMulti<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  options?: Omit<UseClickOutsideOptions, 'ignoreRefs'>
) {
  useClickOutside(
    refs[0] || { current: null },
    handler,
    {
      ...options,
      ignoreRefs: refs.slice(1),
    }
  )
}

// Version avec détection d'escape key (fermeture modale)
interface UseEscapeKeyOptions {
  enabled?: boolean
  onEscape?: () => void
}

export function useEscapeKey({ enabled = true, onEscape }: UseEscapeKeyOptions) {
  useEffect(() => {
    if (!enabled || !onEscape) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onEscape])
}

// Version combinée pour les modales
export function useModalClose<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  options?: {
    closeOnClickOutside?: boolean
    closeOnEscape?: boolean
    enabled?: boolean
  }
) {
  const { closeOnClickOutside = true, closeOnEscape = true, enabled = true } = options || {}

  // Fermeture par clic extérieur
  useClickOutside(ref, onClose, {
    enabled: enabled && closeOnClickOutside,
  })

  // Fermeture par touche Échap
  useEscapeKey({
    enabled: enabled && closeOnEscape,
    onEscape: onClose,
  })
}

// Version avec animation (pour les transitions)
export function useClickOutsideWithAnimation<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  onClose: () => void,
  options?: UseClickOutsideOptions & {
    closeDelay?: number
  }
) {
  const { closeDelay = 200, ...restOptions } = options || {}
  const [isClosing, setIsClosing] = useClickOutside(false)

  const handleClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, closeDelay)
  }, [onClose, closeDelay, isClosing, setIsClosing])

  useClickOutside(ref, handleClose, restOptions)

  return { isClosing }
}

// Helper pour ignorer dynamiquement des éléments
export function useClickOutsideWithDynamicIgnore<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  getIgnoreElements?: () => HTMLElement[]
) {
  const handleEvent = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }

      // Vérifier les éléments à ignorer dynamiquement
      if (getIgnoreElements) {
        const ignoreElements = getIgnoreElements()
        const isIgnored = ignoreElements.some((el) => el && el.contains(event.target as Node))
        if (isIgnored) return
      }

      handler(event)
    },
    [ref, handler, getIgnoreElements]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleEvent)
    document.addEventListener('touchstart', handleEvent)

    return () => {
      document.removeEventListener('mousedown', handleEvent)
      document.removeEventListener('touchstart', handleEvent)
    }
  }, [handleEvent])
}

export default useClickOutside