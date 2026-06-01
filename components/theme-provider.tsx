"use client"

import { ReactNode, useState, useEffect, createContext, useContext } from "react"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { LanguageProvider } from "@/components/ui/language-manager"

// Types pour le contexte global
interface AppContextType {
  isOnline: boolean
  apiStatus: "connected" | "disconnected" | "checking"
  appVersion: string
  isLowPerfMode: boolean
  setLowPerfMode: (value: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}

// Composant d'écran de chargement
function GlobalLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl text-white animate-pulse">🌾</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs animate-bounce">
            π
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">AGRO MULTICENTER HINOS</h2>
        <p className="text-gray-500 text-sm">Chargement de votre plateforme agricole...</p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.45s" }}></div>
        </div>
        <div className="mt-6 w-48 mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  )
}

// Composant de détection de performance
function PerformanceDetector({ children }: { children: ReactNode }) {
  const [isLowPerfMode, setIsLowPerfMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const checkPerformance = () => {
      // Vérifier la mémoire disponible
      const memory = (performance as any).memory
      if (memory && memory.jsHeapSizeLimit < 500 * 1024 * 1024) {
        setIsLowPerfMode(true)
        return
      }
      
      // Vérifier le nombre de cores CPU
      const cores = navigator.hardwareConcurrency
      if (cores && cores <= 2) {
        setIsLowPerfMode(true)
        return
      }
      
      // Vérifier la connexion réseau
      const connection = (navigator as any).connection
      if (connection && connection.effectiveType === "2g") {
        setIsLowPerfMode(true)
        return
      }
      
      setIsLowPerfMode(false)
    }
    
    checkPerformance()
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLowPerfMode) {
      document.documentElement.classList.add("reduce-motion")
      document.documentElement.style.setProperty("--animation-duration", "0.01s")
    } else {
      document.documentElement.classList.remove("reduce-motion")
      document.documentElement.style.setProperty("--animation-duration", "0.2s")
    }
  }, [isLowPerfMode])

  if (!mounted) return <GlobalLoadingScreen />

  return (
    <AppContext.Provider value={{ isOnline: true, apiStatus: "connected", appVersion: "2.0.0", isLowPerfMode, setLowPerfMode: setIsLowPerfMode }}>
      {children}
    </AppContext.Provider>
  )
}

// Composant de détection de connexion
function ConnectionDetector({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected" | "checking">("checking")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    const checkApi = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const response = await fetch("/api/health", {
          method: "HEAD",
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        setApiStatus(response.ok ? "connected" : "disconnected")
      } catch {
        setApiStatus("disconnected")
      }
    }
    
    checkApi()
    const interval = setInterval(checkApi, 30000)
    setMounted(true)
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  if (!mounted) return <GlobalLoadingScreen />

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">📡</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pas de connexion internet</h2>
          <p className="text-gray-500 text-sm mb-5">
            Vérifiez votre connexion et réessayez pour accéder à Agro Multicenter Hinos.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              🔄 Réessayer
            </button>
            <button
              onClick={() => setIsOnline(true)}
              className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Mode hors ligne
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (apiStatus === "disconnected") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Service temporairement indisponible</h2>
          <p className="text-gray-500 text-sm mb-5">
            Nos serveurs sont momentanément indisponibles. Veuillez réessayer dans quelques instants.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white py-2.5 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Composant de gestion des erreurs
function ErrorBoundary({ children }: { children: ReactNode }) {
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

  const handleReset = () => {
    setHasError(false)
    setError(null)
    window.location.reload()
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">🐛</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
          <p className="text-gray-500 text-sm mb-4">
            L'application a rencontré un problème inattendu.
          </p>
          {error && (
            <pre className="bg-gray-100 p-3 rounded-xl text-xs text-left overflow-auto max-h-32 mb-5 font-mono">
              {error.message}
            </pre>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              🔄 Recharger l'application
            </button>
            <button
              onClick={() => setHasError(false)}
              className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
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

// Composant de préchargement des ressources
function ResourcePreloader({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const preloadResources = async () => {
      // Simuler un chargement minimal
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsReady(true)
    }
    
    preloadResources()
  }, [])

  if (!isReady) return <GlobalLoadingScreen />

  return <>{children}</>
}

// Export du provider principal
export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <GlobalLoadingScreen />
  }

  return (
    <ErrorBoundary>
      <PerformanceDetector>
        <ConnectionDetector>
          <ResourcePreloader>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <LanguageProvider>
                {children}
              </LanguageProvider>
            </ThemeProvider>
          </ResourcePreloader>
        </ConnectionDetector>
      </PerformanceDetector>
    </ErrorBoundary>
  )
}

// Composant LanguageProvider simplifié
function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("fr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    const browserLanguage = navigator.language.split("-")[0]
    const supportedLanguages = ["fr", "en", "es", "pt", "dyu", "mos"]
    
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else if (supportedLanguages.includes(browserLanguage)) {
      setLanguage(browserLanguage)
    }
    
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)
      document.documentElement.lang = language
      document.documentElement.setAttribute("data-language", language)
    }
  }, [language, mounted])

  if (!mounted) return <GlobalLoadingScreen />

  return (
    <div data-language={language}>
      {children}
    </div>
  )
}