import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne les classes Tailwind CSS
 * @param inputs - Classes CSS à fusionner
 * @returns Classes CSS fusionnées
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un nombre en devise locale
 * @param amount - Montant à formater
 * @param currency - Devise (par défaut: 'XOF' pour FCFA)
 * @param locale - Locale (par défaut: 'fr-FR')
 * @returns Montant formaté
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'XOF',
  locale: string = 'fr-FR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formate un montant en Pi Network
 * @param amount - Montant en Pi
 * @param locale - Locale (par défaut: 'fr-FR')
 * @returns Montant formaté avec le symbole π
 */
export const formatPiAmount = (amount: number, locale: string = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 6,
  }).format(amount) + ' π'
}

/**
 * Formate une date relative (ex: "il y a 5 minutes")
 * @param date - Date à formater
 * @param locale - Locale (par défaut: 'fr')
 * @returns Date relative formatée
 */
export const formatRelativeTime = (date: Date | string, locale: string = 'fr'): string => {
  const now = new Date()
  const target = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - target.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffSec < 60) return rtf.format(-diffSec, 'second')
  if (diffMin < 60) return rtf.format(-diffMin, 'minute')
  if (diffHour < 24) return rtf.format(-diffHour, 'hour')
  if (diffDay < 7) return rtf.format(-diffDay, 'day')
  if (diffWeek < 4) return rtf.format(-diffWeek, 'week')
  if (diffMonth < 12) return rtf.format(-diffMonth, 'month')
  return rtf.format(-diffYear, 'year')
}

/**
 * Formate une date standard
 * @param date - Date à formater
 * @param locale - Locale (par défaut: 'fr-FR')
 * @param options - Options de formatage
 * @returns Date formatée
 */
export const formatDate = (
  date: Date | string,
  locale: string = 'fr-FR',
  options?: Intl.DateTimeFormatOptions
): string => {
  const target = typeof date === 'string' ? new Date(date) : date
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(target)
}

/**
 * Tronque un texte avec des points de suspension
 * @param text - Texte à tronquer
 * @param maxLength - Longueur maximale
 * @returns Texte tronqué
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Met la première lettre en majuscule
 * @param str - Chaîne à transformer
 * @returns Chaîne avec première lettre en majuscule
 */
export const capitalize = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Génère un identifiant unique
 * @param prefix - Préfixe optionnel
 * @returns Identifiant unique
 */
export const generateId = (prefix: string = ''): string => {
  const id = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
  return prefix ? `${prefix}_${id}` : id
}

/**
 * Copie du texte dans le presse-papier
 * @param text - Texte à copier
 * @returns Promise avec succès ou échec
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

/**
 * Extrait les paramètres d'une URL
 * @param url - URL à analyser
 * @returns Objet contenant les paramètres
 */
export const getUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {}
  try {
    const urlObj = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })
  } catch (error) {
    console.error('Failed to parse URL:', error)
  }
  return params
}

/**
 * Vérifie si l'utilisateur est sur un appareil mobile
 * @returns true si mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Débounce une fonction
 * @param func - Fonction à débouncer
 * @param delay - Délai en millisecondes
 * @returns Fonction débouncée
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle une fonction
 * @param func - Fonction à throttler
 * @param limit - Limite en millisecondes
 * @returns Fonction throttlée
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Convertit une distance en kilomètres en texte lisible
 * @param distance - Distance en kilomètres
 * @param locale - Locale (par défaut: 'fr')
 * @returns Distance formatée
 */
export const formatDistance = (distance: number, locale: string = 'fr'): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`
  }
  return `${distance.toFixed(1)} km`
}

/**
 * Évalue une note en étoiles
 * @param rating - Note sur 5
 * @returns Tableau d'étoiles
 */
export const getRatingStars = (rating: number): ('full' | 'half' | 'empty')[] => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  return [
    ...Array(fullStars).fill('full'),
    ...(hasHalfStar ? ['half'] : []),
    ...Array(emptyStars).fill('empty'),
  ] as ('full' | 'half' | 'empty')[]
}

/**
 * Valide une adresse email
 * @param email - Email à valider
 * @returns true si valide
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/
  return emailRegex.test(email)
}

/**
 * Valide un numéro de téléphone (format international simple)
 * @param phone - Téléphone à valider
 * @returns true si valide
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

/**
 * Extrait les initiales d'un nom
 * @param name - Nom complet
 * @returns Initiales (max 2 lettres)
 */
export const getInitials = (name: string): string => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Génère une couleur aléatoire basée sur une chaîne
 * @param str - Chaîne d'entrée
 * @returns Couleur en format hexadécimal
 */
export const stringToColor = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    // Correction : utiliser slice() au lieu de substr() (obsolète)
    color += ('00' + value.toString(16)).slice(-2)
  }
  return color
}

/**
 * Regroupe un tableau par clé
 * @param array - Tableau à grouper
 * @param key - Clé de regroupement
 * @returns Objet groupé
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key])
    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(item)
    return result
  }, {} as Record<string, T[]>)
}

/**
 * Trie un tableau par propriété
 * @param array - Tableau à trier
 * @param key - Clé de tri
 * @param order - Ordre ('asc' ou 'desc')
 * @returns Tableau trié
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Attend un certain temps (Promise sleep)
 * @param ms - Durée en millisecondes
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retourne une valeur dans une plage
 * @param value - Valeur à clamp
 * @param min - Minimum
 * @param max - Maximum
 * @returns Valeur clampée
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Formate un nombre en pourcentage
 * @param value - Valeur (ex: 0.75)
 * @param locale - Locale (par défaut: 'fr-FR')
 * @returns Pourcentage formaté
 */
export const formatPercentage = (value: number, locale: string = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)
}

/**
 * Vérifie si une chaîne est vide ou null
 * @param str - Chaîne à vérifier
 * @returns true si vide
 */
export const isEmpty = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0
}

// Export par défaut
export default {
  cn,
  formatCurrency,
  formatPiAmount,
  formatRelativeTime,
  formatDate,
  truncateText,
  capitalize,
  generateId,
  copyToClipboard,
  getUrlParams,
  isMobileDevice,
  debounce,
  throttle,
  formatDistance,
  getRatingStars,
  isValidEmail,
  isValidPhone,
  getInitials,
  stringToColor,
  groupBy,
  sortBy,
  sleep,
  clamp,
  formatPercentage,
  isEmpty,
}