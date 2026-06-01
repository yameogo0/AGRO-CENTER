/"use client"

import { useState, useEffect } from "react"
import { PiAuthProvider } from "@/contexts/pi-auth-context"
import { AppWrapper } from "@/components/ui/app-wrapper"
import { setBaseURL, setGlobalTimeout } from "@/lib/api"

// Configuration API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.agromc.com"
const TIMEOUT = 45000

if (typeof window !== "undefined") {
  setBaseURL(API_URL)
  setGlobalTimeout(TIMEOUT)
}

// Composant de chargement global
function GlobalLoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
          <span className="text-3xl text-white">🌾</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">AGRO MULTICENTER HINOS</h2>
        <p className="text-gray-500">Chargement de votre plateforme agricole...</p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}

// Gestionnaire d'erreurs
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global error caught:", event.error)
      setError(event.error)
      setHasError(true)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)
      setError(new Error(event.reason?.message || "Promise rejection"))
      setHasError(true)
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
          <p className="text-gray-500 text-sm mb-4">
            L'application a rencontré un problème. Veuillez réessayer.
          </p>
          {error && (
            <pre className="bg-gray-100 p-3 rounded-lg text-xs text-left overflow-auto mb-4 max-h-32">
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

// Provider de thème amélioré
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else if (systemPrefersDark) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme)
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [theme, mounted])

  if (!mounted) {
    return <GlobalLoadingScreen />
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {children}
    </div>
  )
}

// Provider de langue amélioré
function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("fr")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language")
    const browserLanguage = navigator.language.split("-")[0]
    
    const supportedLanguages = ["fr", "en", "es", "pt", "dyu", "mos"]
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else if (supportedLanguages.includes(browserLanguage)) {
      setLanguage(browserLanguage)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)
      document.documentElement.lang = language
    }
  }, [language, mounted])

  if (!mounted) {
    return <GlobalLoadingScreen />
  }

  return (
    <div data-language={language}>
      {children}
    </div>
  )
}

// Provider d'API avec gestion d'erreurs
function ApiProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected" | "checking">("checking")

  useEffect(() => {
    // Vérifier la connexion réseau
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    // Vérifier l'API
    const checkApi = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, {
          method: "HEAD",
          signal: AbortSignal.timeout(5000),
        })
        setApiStatus(response.ok ? "connected" : "disconnected")
      } catch {
        setApiStatus("disconnected")
      }
    }
    
    checkApi()
    const interval = setInterval(checkApi, 30000)
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  // Afficher un avertissement si hors ligne
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📡</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pas de connexion internet</h2>
          <p className="text-gray-500 text-sm mb-4">
            Vérifiez votre connexion et réessayez.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            🔄 Réessayer
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Provider de performance
function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [isLowPerfMode, setIsLowPerfMode] = useState(false)

  useEffect(() => {
    // Détecter les appareils à faible performance
    const checkPerformance = () => {
      // Vérifier la mémoire (si disponible)
      const memory = (performance as any).memory
      if (memory && memory.jsHeapSizeLimit < 500 * 1024 * 1024) {
        setIsLowPerfMode(true)
        return
      }
      
      // Vérifier les cores CPU
      const cores = navigator.hardwareConcurrency
      if (cores && cores <= 2) {
        setIsLowPerfMode(true)
        return
      }
      
      // Vérifier l'écran tactile et la taille
      const isMobile = window.innerWidth < 768
      const isSlowConnection = (navigator as any).connection?.effectiveType === "2g"
      
      setIsLowPerfMode(isMobile && isSlowConnection)
    }
    
    checkPerformance()
  }, [])

  // Appliquer des classes CSS pour les animations réduites
  if (isLowPerfMode) {
    document.documentElement.classList.add("reduce-motion")
  }

  return <>{children}</>
}

// Export du provider principal
export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <GlobalLoadingScreen />
  }

  return (
    <ErrorBoundary>
      <PerformanceProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ApiProvider>
              <PiAuthProvider>
                <AppWrapper>
                  {children}
                </AppWrapper>
              </PiAuthProvider>
            </ApiProvider>
          </LanguageProvider>
        </ThemeProvider>
      </PerformanceProvider>
    </ErrorBoundary>
  )
}