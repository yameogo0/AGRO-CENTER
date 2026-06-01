import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Au chargement, récupérer la valeur depuis localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error('Erreur lecture localStorage', error)
    }
  }, [key])

  // Fonction pour sauvegarder la valeur
  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Erreur écriture localStorage', error)
    }
  }

  return [storedValue, setValue]
}