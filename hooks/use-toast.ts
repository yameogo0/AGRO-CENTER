'use client'

// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000
const TOAST_STACKING = true

// Types de toast avec priorité
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading'

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  type?: ToastType
  duration?: number
  progress?: number
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['UPDATE_PROGRESS']
      toastId: string
      progress: number
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
const toastProgressIntervals = new Map<string, ReturnType<typeof setInterval>>()

const addToRemoveQueue = (toastId: string, delay: number = TOAST_REMOVE_DELAY) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, delay)

  toastTimeouts.set(toastId, timeout)
}

const clearProgressInterval = (toastId: string) => {
  const interval = toastProgressIntervals.get(toastId)
  if (interval) {
    clearInterval(interval)
    toastProgressIntervals.delete(toastId)
  }
}

const startProgressAnimation = (toastId: string, duration: number) => {
  clearProgressInterval(toastId)
  
  const startTime = Date.now()
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min((elapsed / duration) * 100, 100)
    
    dispatch({
      type: 'UPDATE_PROGRESS',
      toastId,
      progress,
    })
    
    if (progress >= 100) {
      clearProgressInterval(toastId)
    }
  }, 16) // ~60fps
  
  toastProgressIntervals.set(toastId, interval)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      const newToasts = TOAST_STACKING 
        ? [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
        : [action.toast]
      
      return {
        ...state,
        toasts: newToasts,
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      }

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, progress: action.progress } : t,
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
        clearProgressInterval(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
          clearProgressInterval(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId) {
        clearProgressInterval(action.toastId)
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== action.toastId),
        }
      }
      return {
        ...state,
        toasts: [],
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, 'id'>

// Icônes par type de toast
const getToastIcon = (type?: ToastType): string => {
  switch (type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    case 'info': return 'ℹ️'
    case 'loading': return '⏳'
    default: return ''
  }
}

// Couleurs par type de toast
export const getToastColor = (type?: ToastType): string => {
  switch (type) {
    case 'success': return 'border-green-500 bg-green-50 text-green-800'
    case 'error': return 'border-red-500 bg-red-50 text-red-800'
    case 'warning': return 'border-yellow-500 bg-yellow-50 text-yellow-800'
    case 'info': return 'border-blue-500 bg-blue-50 text-blue-800'
    case 'loading': return 'border-purple-500 bg-purple-50 text-purple-800'
    default: return 'border-gray-200 bg-white text-gray-800'
  }
}

function toast({ duration = TOAST_REMOVE_DELAY, type = 'default', ...props }: Toast) {
  const id = genId()
  const icon = getToastIcon(type)

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  const titleWithIcon = icon && !props.title?.toString().includes(icon) 
    ? `${icon} ${props.title || ''}` 
    : props.title

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      title: titleWithIcon,
      id,
      type,
      duration,
      progress: 0,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // Auto-dismiss après la durée
  addToRemoveQueue(id, duration)
  
  // Animation de progression
  startProgressAnimation(id, duration)

  return {
    id: id,
    dismiss,
    update,
  }
}

// Fonctions utilitaires pour différents types de toasts
toast.success = (title: string, description?: string, options?: Partial<Toast>) => {
  return toast({ title, description, type: 'success', ...options })
}

toast.error = (title: string, description?: string, options?: Partial<Toast>) => {
  return toast({ title, description, type: 'error', ...options })
}

toast.warning = (title: string, description?: string, options?: Partial<Toast>) => {
  return toast({ title, description, type: 'warning', ...options })
}

toast.info = (title: string, description?: string, options?: Partial<Toast>) => {
  return toast({ title, description, type: 'info', ...options })
}

toast.loading = (title: string, description?: string, options?: Partial<Toast>) => {
  return toast({ title, description, type: 'loading', duration: 30000, ...options })
}

toast.promise = async <T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((err: Error) => string)
  }
): Promise<T> => {
  const id = toast.loading(loading)
  
  try {
    const result = await promise
    const successMessage = typeof success === 'function' ? success(result) : success
    toast.success(successMessage)
    id.dismiss()
    return result
  } catch (err) {
    const errorMessage = typeof error === 'function' ? error(err as Error) : error
    toast.error(errorMessage)
    id.dismiss()
    throw err
  }
}

// Traductions pour les messages par défaut
export const toastMessages = {
  fr: {
    networkError: "Erreur réseau. Vérifiez votre connexion.",
    serverError: "Erreur serveur. Veuillez réessayer plus tard.",
    success: "Opération réussie !",
    error: "Une erreur est survenue.",
    warning: "Attention !",
    info: "Information",
    saved: "Enregistré avec succès",
    deleted: "Supprimé avec succès",
    updated: "Mis à jour avec succès",
    copied: "Copié dans le presse-papier",
  },
  en: {
    networkError: "Network error. Check your connection.",
    serverError: "Server error. Please try again later.",
    success: "Operation successful!",
    error: "An error occurred.",
    warning: "Warning!",
    info: "Information",
    saved: "Saved successfully",
    deleted: "Deleted successfully",
    updated: "Updated successfully",
    copied: "Copied to clipboard",
  },
  es: {
    networkError: "Error de red. Verifique su conexión.",
    serverError: "Error del servidor. Intente más tarde.",
    success: "¡Operación exitosa!",
    error: "Ocurrió un error.",
    warning: "¡Atención!",
    info: "Información",
    saved: "Guardado exitosamente",
    deleted: "Eliminado exitosamente",
    updated: "Actualizado exitosamente",
    copied: "Copiado al portapapeles",
  },
  pt: {
    networkError: "Erro de rede. Verifique sua conexão.",
    serverError: "Erro no servidor. Tente novamente mais tarde.",
    success: "Operação bem-sucedida!",
    error: "Ocorreu um erro.",
    warning: "Atenção!",
    info: "Informação",
    saved: "Salvo com sucesso",
    deleted: "Excluído com sucesso",
    updated: "Atualizado com sucesso",
    copied: "Copiado para área de transferência",
  },
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
    // Utilitaires supplémentaires
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
    loading: toast.loading,
    promise: toast.promise,
  }
}

export { toast, getToastIcon, getToastColor }