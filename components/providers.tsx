"use client"

import { ReactNode, useState, useEffect } from "react"
import { PiAuthProvider } from "@/contexts/pi-auth-context"
import { AppWrapper } from "@/components/ui/app-wrapper"
import { setBaseURL, setGlobalTimeout, setApiLanguage, apiConfig } from "@/lib/api"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthLoadingScreen } from "@/components/ui/auth-loading-screen"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"

// Configuration API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.agromc.com"
const API_TIMEOUT = 45000
const MAX_RETRIES = 3
const ENABLE_CACHE = true

// Configuration API au chargement
if (typeof window !== "undefined") {
  setBaseURL(API_URL)
  setGlobalTimeout(API_TIMEOUT)
  
  // Vérifier si apiConfig existe avant d'appeler les méthodes
  if (apiConfig) {
    if (typeof apiConfig.setMaxRetries === 'function') {
      apiConfig.setMaxRetries(MAX_RETRIES)
    }
    if (typeof apiConfig.setEnableCache === 'function') {
      apiConfig.setEnableCache(ENABLE_CACHE)
    }
  }
  
  // Log configuration en développement
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 API Configuration:", {
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      maxRetries: MAX_RETRIES,
      cache: ENABLE_CACHE,
    })
  }
}

interface ProvidersProps {
  children: ReactNode
}

// Props pour AuthLoadingScreen
interface AuthLoadingScreenProps {
  language?: string
}

// Composant d'initialisation
function AppInitializer({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [language, setLanguage] = useState("fr")

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Récupérer la langue sauvegardée
        const savedLanguage = localStorage.getItem("language") || "fr"
        setLanguage(savedLanguage)
        
        if (typeof setApiLanguage === 'function') {
          setApiLanguage(savedLanguage)
        }
        
        // Récupérer le thème sauvegardé
        const savedTheme = localStorage.getItem("theme")
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else if (savedTheme === "light") {
          document.documentElement.classList.remove("dark")
        } else {
          // Détection du thème système
          const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          if (systemDark) {
            document.documentElement.classList.add("dark")
          }
        }

        // Simuler un temps de chargement minimal
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setIsInitialized(true)
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error)
        setIsInitialized(true) // Continuer même en cas d'erreur
      }
    }

    initializeApp()
  }, [])

  if (!isInitialized) {
    return <AuthLoadingScreen language={language} />
  }

  return <>{children}</>
}

// Composant de gestion des erreurs globales
function GlobalErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error:", event.error)
      setError(event.error)
      setHasError(true)
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled rejection:", event.reason)
      setError(new Error(event.reason?.message || "Promise rejection"))
      setHasError(true)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
          <p className="text-gray-500 text-sm mb-4">
            L'application a rencontré un problème inattendu.
          </p>
          {error && process.env.NODE_ENV === "development" && (
            <pre className="bg-gray-100 p-3 rounded-lg text-xs text-left overflow-auto max-h-32 mb-4">
              {error.message}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              🔄 Recharger
            </button>
            <button
              onClick={() => setHasError(false)}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ignorer
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Composant de détection de connexion
function ConnectionProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineToast, setShowOfflineToast] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setIsReconnecting(false)
      setShowOfflineToast(false)
      
      // Notification de reconnexion
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300'
      toast.innerHTML = `
        <div class="bg-green-500 text-white rounded-lg p-3 flex items-center justify-between shadow-lg">
          <div class="flex items-center gap-2">
            <span class="text-lg">✅</span>
            <span>Connexion rétablie !</span>
          </div>
        </div>
      `
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 3000)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineToast(true)
      setTimeout(() => setShowOfflineToast(false), 5000)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <>
      {!isOnline && showOfflineToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-yellow-500 text-white rounded-lg p-3 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">📡</span>
              <span>Connexion internet perdue. Mode hors ligne actif.</span>
            </div>
            {isReconnecting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>
      )}
      {children}
    </>
  )
}

// Provider de performance
function PerformanceProvider({ children }: { children: ReactNode }) {
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (isReducedMotion) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }, [isReducedMotion])

  return <>{children}</>
}

// Export du provider principal
export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <AuthLoadingScreen />
  }

  return (
    <GlobalErrorBoundary>
      <PerformanceProvider>
        <ConnectionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="theme"
          >
            <TooltipProvider>
              <PiAuthProvider>
                <AppWrapper>
                  <AppInitializer>
                    {children}
                  </AppInitializer>
                </AppWrapper>
              </PiAuthProvider>
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#fff',
                    color: '#1f2937',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                  },
                }}
              />
            </TooltipProvider>
          </ThemeProvider>
        </ConnectionProvider>
      </PerformanceProvider>
    </GlobalErrorBoundary>
  )
}

// Hook pour accéder à l'état de connexion
export function useConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(true)
      setTimeout(() => setWasOffline(false), 5000)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}

// Hook pour les préférences utilisateur
export function useUserPreferences() {
  const [language, setLanguage] = useState("fr")
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "fr"
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
    
    setLanguage(savedLanguage)
    setTheme(savedTheme)
  }, [])

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    if (typeof setApiLanguage === 'function') {
      setApiLanguage(newLanguage)
    }
  }

  const updateTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  return { language, theme, updateLanguage, updateTheme }
}