"use client"

import { ReactNode, useState, useEffect, createContext, useContext, useCallback } from "react"

interface ProvidersProps {
  children: ReactNode
}

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
function GlobalLoadingScreen({ message }: { message?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 20, 100))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm w-full">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl text-white animate-pulse">🌾</span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
            π
          </div>
          <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-green-400 rounded-full animate-ping" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent mb-2">
          AGRO MULTICENTER HINOS
        </h2>
        <p className="text-gray-500 text-sm">{message || "Chargement de votre plateforme agricole..."}</p>
        
        {/* Barre de progression */}
        <div className="mt-6 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>

        {/* Points d'animation */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.6s" }}
            />
          ))}
        </div>

        {/* Version */}
        <p className="text-[10px] text-gray-400 mt-6">Version 2.1.0 • © 2024</p>
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
        console.log("⚠️ Mode basse performance activé (mémoire limitée)")
        setIsLowPerfMode(true)
        return
      }
      
      // Vérifier le nombre de cores CPU
      const cores = navigator.hardwareConcurrency
      if (cores && cores <= 2) {
        console.log("⚠️ Mode basse performance activé (CPU limité)")
        setIsLowPerfMode(true)
        return
      }
      
      // Vérifier la connexion réseau
      const connection = (navigator as any).connection
      if (connection && connection.effectiveType === "2g") {
        console.log("⚠️ Mode basse performance activé (réseau lent)")
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

  if (!mounted) return <GlobalLoadingScreen message="Analyse des performances..." />

  return (
    <AppContext.Provider value={{ 
      isOnline: true, 
      apiStatus: "connected", 
      appVersion: "2.1.0", 
      isLowPerfMode, 
      setLowPerfMode: setIsLowPerfMode 
    }}>
      {children}
    </AppContext.Provider>
  )
}

// Composant de détection de connexion
function ConnectionDetector({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected" | "checking">("checking")
  const [mounted, setMounted] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setOfflineMode(false)
      // Notification de reconnexion
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white rounded-lg p-3 shadow-lg z-50 animate-in slide-in-from-right-5'
      toast.innerHTML = '✅ Connexion rétablie'
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 3000)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      // Notification de déconnexion
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-yellow-500 text-white rounded-lg p-3 shadow-lg z-50 animate-in slide-in-from-right-5'
      toast.innerHTML = '📡 Connexion perdue - Mode hors ligne'
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 4000)
    }
    
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
    setIsOnline(navigator.onLine)
    setMounted(true)
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(interval)
    }
  }, [])

  const handleOfflineMode = () => {
    setOfflineMode(true)
    setApiStatus("connected")
  }

  if (!mounted) return <GlobalLoadingScreen message="Vérification de la connexion..." />

  if (!isOnline && !offlineMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">📡</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pas de connexion internet</h2>
          <p className="text-gray-500 text-sm mb-2">
            Vérifiez votre connexion et réessayez pour accéder à Agro Multicenter Hinos.
          </p>
          <p className="text-xs text-gray-400 mb-5">
            Mode hors ligne: données limitées, synchronisation différée.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              🔄 Réessayer
            </button>
            <button
              onClick={handleOfflineMode}
              className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              📱 Mode hors ligne
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (apiStatus === "disconnected" && !offlineMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Service temporairement indisponible</h2>
          <p className="text-gray-500 text-sm mb-2">
            Nos serveurs sont momentanément indisponibles.
          </p>
          <p className="text-xs text-gray-400 mb-5">
            Vous pouvez continuer en mode hors ligne avec les données en cache.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              🔄 Réessayer
            </button>
            <button
              onClick={() => setApiStatus("connected")}
              className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              📱 Mode hors ligne
            </button>
          </div>
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

  const handleIgnore = () => {
    setHasError(false)
    setError(null)
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">🐛</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
          <p className="text-gray-500 text-sm mb-4">
            L'application a rencontré un problème inattendu.
          </p>
          {error && process.env.NODE_ENV === "development" && (
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
              onClick={handleIgnore}
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
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const preloadResources = async () => {
      // Simuler le chargement des ressources
      const steps = [
        { name: "Initialisation", duration: 300 },
        { name: "Chargement des modules", duration: 400 },
        { name: "Connexion aux services", duration: 300 },
      ]
      
      let currentProgress = 0
      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.duration))
        currentProgress += 100 / steps.length
        setProgress(currentProgress)
      }
      
      setIsReady(true)
    }
    
    preloadResources()
  }, [])

  if (!isReady) {
    return <GlobalLoadingScreen message={`Chargement des ressources... ${Math.round(progress)}%`} />
  }

  return <>{children}</>
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

  if (!mounted) return <GlobalLoadingScreen message="Configuration de la langue..." />

  return (
    <div data-language={language}>
      {children}
    </div>
  )
}

// Export du provider principal
export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <GlobalLoadingScreen message="Démarrage de l'application..." />
  }

  return (
    <ErrorBoundary>
      <PerformanceDetector>
        <ConnectionDetector>
          <ResourcePreloader>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="agro-theme">
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