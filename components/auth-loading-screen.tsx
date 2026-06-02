"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Loader2, CheckCircle, Wifi, Shield, Globe, Sparkles } from "lucide-react"

interface AuthLoadingScreenProps {
  onComplete?: () => void
  language?: string
  minDuration?: number
  autoComplete?: boolean
}

// Traductions multilingues complètes
const translations = {
  fr: {
    title: "Agro Multicenter Hinos",
    subtitle: "Plateforme agricole intelligente",
    loading: "Chargement de votre espace agricole...",
    initializing: "Initialisation de l'application",
    connectingPi: "Connexion au réseau Pi",
    loadingUser: "Chargement de votre profil",
    loadingServices: "Chargement des services",
    almostReady: "Préparation de votre tableau de bord",
    verifying: "Vérification de la sécurité",
    sync: "Synchronisation des données",
    welcome: "Bienvenue !",
    secure: "Sécurisé par Pi Network",
    multilingual: "Multilingue",
  },
  en: {
    title: "Agro Multicenter Hinos",
    subtitle: "Intelligent agricultural platform",
    loading: "Loading your agricultural space...",
    initializing: "Initializing application",
    connectingPi: "Connecting to Pi Network",
    loadingUser: "Loading your profile",
    loadingServices: "Loading services",
    almostReady: "Preparing your dashboard",
    verifying: "Security verification",
    sync: "Data synchronization",
    welcome: "Welcome!",
    secure: "Secured by Pi Network",
    multilingual: "Multilingual",
  },
  es: {
    title: "Agro Multicenter Hinos",
    subtitle: "Plataforma agrícola inteligente",
    loading: "Cargando su espacio agrícola...",
    initializing: "Inicializando aplicación",
    connectingPi: "Conectando a Pi Network",
    loadingUser: "Cargando su perfil",
    loadingServices: "Cargando servicios",
    almostReady: "Preparando su tablero",
    verifying: "Verificación de seguridad",
    sync: "Sincronización de datos",
    welcome: "¡Bienvenido!",
    secure: "Asegurado por Pi Network",
    multilingual: "Multilingüe",
  },
  pt: {
    title: "Agro Multicenter Hinos",
    subtitle: "Plataforma agrícola inteligente",
    loading: "Carregando seu espaço agrícola...",
    initializing: "Inicializando aplicação",
    connectingPi: "Conectando à Pi Network",
    loadingUser: "Carregando seu perfil",
    loadingServices: "Carregando serviços",
    almostReady: "Preparando seu painel",
    verifying: "Verificação de segurança",
    sync: "Sincronização de dados",
    welcome: "Bem-vindo!",
    secure: "Protegido por Pi Network",
    multilingual: "Multilíngue",
  },
  dioula: {
    title: "Agro Multicenter Hinos",
    subtitle: "Sɛnɛkɛ yɔrɔ labɛn",
    loading: "I ka sɛnɛkɛ yɔrɔ bɛɛ bɛ sɔrɔ...",
    initializing: "Aplikasi bɛɛ bɛ da",
    connectingPi: "Pi Network bɛɛ bɛ se",
    loadingUser: "I ka jukɔrɔ bɛɛ bɛ sɔrɔ",
    loadingServices: "Baarakɛw bɛɛ bɛ sɔrɔ",
    almostReady: "I ka tablɛɛto bɛɛ bɛ labɛn",
    verifying: "Sɛbɛn bɛɛ bɛ se",
    sync: "Donnew bɛɛ bɛ se",
    welcome: "I ni ce!",
    secure: "Pi Network bɛɛ bɛ se",
    multilingual: "Kan caman",
  },
  mooré: {
    title: "Agro Multicenter Hinos",
    subtitle: "Tʋʋm-tʋmdɑ bɑ lɑ",
    loading: "Yɑɑ koom bũmbɑ bɑ lɑ...",
    initializing: "Tʋʋm-tʋmdɑ bɑ lɑ",
    connectingPi: "Pi Network bɑ lɑ",
    loadingUser: "Yɑɑ yʋʋr bɑ lɑ",
    loadingServices: "Tʋʋm-tʋmdɑ bɑ lɑ",
    almostReady: "Yɑɑ tɑblɛɛto bɑ lɑ",
    verifying: "Sɛbɛn bɑ lɑ",
    sync: "Donnew bɑ lɑ",
    welcome: "Yɑɑ koom!",
    secure: "Pi Network bɑ lɑ",
    multilingual: "Gʋls-sɛbɑ",
  },
}

// Étapes de chargement avec icônes
const loadingSteps = [
  { key: "initializing", duration: 600, progress: 10, icon: Sparkles },
  { key: "connectingPi", duration: 800, progress: 30, icon: Wifi },
  { key: "verifying", duration: 700, progress: 45, icon: Shield },
  { key: "loadingUser", duration: 800, progress: 60, icon: Loader2 },
  { key: "sync", duration: 700, progress: 75, icon: Globe },
  { key: "loadingServices", duration: 600, progress: 90, icon: Sparkles },
  { key: "almostReady", duration: 500, progress: 100, icon: CheckCircle },
]

export function AuthLoadingScreen({ 
  onComplete, 
  language = "fr",
  minDuration = 2000,
  autoComplete = true 
}: AuthLoadingScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("")
  const [showLogo, setShowLogo] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())
  
  const animationRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const t = translations[language as keyof typeof translations] || translations.fr
  const currentStep = loadingSteps[currentStepIndex]
  const CurrentIcon = currentStep?.icon || Loader2

  // Animation d'entrée du logo
  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Animation de progression
  useEffect(() => {
    let stepIndex = 0
    let currentProgressValue = 0
    let animationActive = true

    const animateProgress = () => {
      if (!animationActive) return

      if (stepIndex < loadingSteps.length) {
        const step = loadingSteps[stepIndex]
        setCurrentMessage(t[step.key as keyof typeof t] || t.loading)
        
        const startProgress = currentProgressValue
        const endProgress = step.progress
        const duration = step.duration
        const startTimeStep = Date.now()

        const updateProgress = () => {
          if (!animationActive) return
          
          const elapsed = Date.now() - startTimeStep
          const newProgress = Math.min(
            startProgress + (elapsed / duration) * (endProgress - startProgress),
            endProgress
          )
          setProgress(Math.floor(newProgress))

          if (elapsed < duration && animationActive) {
            animationRef.current = requestAnimationFrame(updateProgress)
          } else {
            setProgress(endProgress)
            currentProgressValue = endProgress
            stepIndex++
            setCurrentStepIndex(stepIndex)

            if (stepIndex < loadingSteps.length && animationActive) {
              timeoutRef.current = setTimeout(() => {
                animateProgress()
              }, 150)
            } else if (stepIndex >= loadingSteps.length && animationActive) {
              // Chargement terminé
              const elapsedTotal = Date.now() - startTime
              const remainingTime = Math.max(0, minDuration - elapsedTotal)
              
              timeoutRef.current = setTimeout(() => {
                if (animationActive) {
                  setIsComplete(true)
                  if (autoComplete && onComplete) {
                    onComplete()
                  }
                }
              }, remainingTime)
            }
          }
        }

        updateProgress()
      }
    }

    animateProgress()

    return () => {
      animationActive = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [t, onComplete, minDuration, autoComplete, startTime])

  // Message de bienvenue à la fin
  const finalMessage = isComplete ? t.welcome : currentMessage
  const isFinalStep = progress >= 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Carte principale */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-green-100 transition-all duration-500 hover:shadow-3xl">
          {/* Logo animé */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl transition-opacity duration-1000 ${showLogo ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`relative w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-700 ${showLogo ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                <span className={`text-4xl transition-all duration-300 ${isFinalStep ? 'scale-110' : 'scale-100'}`}>
                  🌾
                </span>
              </div>
              {/* Anneau de chargement extérieur */}
              {!isComplete && (
                <div className="absolute -inset-1">
                  <div className="w-28 h-28 rounded-full border-4 border-green-500/20" />
                  <div className="absolute inset-0 w-28 h-28 rounded-full border-4 border-green-500 border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
                </div>
              )}
              {/* Coche de complétion */}
              {isComplete && (
                <div className="absolute -inset-1 animate-scale-in">
                  <div className="w-28 h-28 rounded-full border-4 border-green-500 bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Titre */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent transition-all duration-500 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {t.title}
            </h2>
            <p className={`text-sm text-gray-500 mt-1 transition-all duration-500 delay-100 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {t.subtitle}
            </p>
          </div>

          {/* Message de progression */}
          <div className={`space-y-4 transition-all duration-500 delay-200 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                {!isComplete && !isFinalStep && (
                  <CurrentIcon className="h-3 w-3 animate-spin text-green-500" />
                )}
                {isFinalStep && !isComplete && (
                  <Loader2 className="h-3 w-3 animate-spin text-green-500" />
                )}
                {isComplete && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                {finalMessage}
              </span>
              <span className={`font-medium transition-colors duration-300 ${progress >= 100 ? 'text-green-600' : 'text-gray-500'}`}>
                {progress}%
              </span>
            </div>

            {/* Barre de progression */}
            <div className="relative">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            </div>

            {/* Points d'animation */}
            <div className="flex justify-center gap-2 pt-2">
              {loadingSteps.map((step, i) => (
                <div
                  key={step.key}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    progress >= step.progress 
                      ? 'w-4 bg-gradient-to-r from-green-500 to-blue-500' 
                      : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Pied de page */}
          <div className={`mt-6 pt-4 border-t border-gray-100 text-center transition-all duration-500 delay-300 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-400 flex-wrap">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-500" />
                <span>{t.secure}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-blue-500" />
                <span>{t.multilingual}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Version */}
        <div className={`text-center mt-4 transition-all duration-500 delay-400 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs text-gray-400">Version 2.1.0 • © 2024 Agro Multicenter Hinos</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// Version avec gestion du timeout automatique
export function AutoAuthLoadingScreen(props: AuthLoadingScreenProps) {
  return <AuthLoadingScreen {...props} minDuration={2500} autoComplete />
}

// Version légère pour les chargements rapides
export function MinimalAuthLoadingScreen({ language = "fr" }: { language?: string }) {
  const t = translations[language as keyof typeof translations] || translations.fr
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-2xl">🌾</span>
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-green-600 mx-auto mb-3" />
        <p className="text-gray-600 text-sm">{t.loading}</p>
      </div>
    </div>
  )
}

export default AuthLoadingScreen