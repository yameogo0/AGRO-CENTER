"use client"

import { useState, useEffect } from "react"

interface AuthLoadingScreenProps {
  onComplete?: () => void
  language?: string
}

// Traductions multilingues
const translations = {
  fr: {
    title: "Agro Multicenter Hinos",
    loading: "Chargement de votre espace agricole...",
    initializing: "Initialisation de l'application",
    connectingPi: "Connexion au réseau Pi",
    loadingUser: "Chargement de votre profil",
    loadingServices: "Chargement des services",
    almostReady: "Préparation de votre tableau de bord",
  },
  en: {
    title: "Agro Multicenter Hinos",
    loading: "Loading your agricultural space...",
    initializing: "Initializing application",
    connectingPi: "Connecting to Pi Network",
    loadingUser: "Loading your profile",
    loadingServices: "Loading services",
    almostReady: "Preparing your dashboard",
  },
  es: {
    title: "Agro Multicenter Hinos",
    loading: "Cargando su espacio agrícola...",
    initializing: "Inicializando aplicación",
    connectingPi: "Conectando a Pi Network",
    loadingUser: "Cargando su perfil",
    loadingServices: "Cargando servicios",
    almostReady: "Preparando su tablero",
  },
  pt: {
    title: "Agro Multicenter Hinos",
    loading: "Carregando seu espaço agrícola...",
    initializing: "Inicializando aplicação",
    connectingPi: "Conectando à Pi Network",
    loadingUser: "Carregando seu perfil",
    loadingServices: "Carregando serviços",
    almostReady: "Preparando seu painel",
  },
  dioula: {
    title: "Agro Multicenter Hinos",
    loading: "I ka sɛnɛkɛ yɔrɔ bɛɛ bɛ sɔrɔ...",
    initializing: "Aplikasi bɛɛ bɛ da",
    connectingPi: "Pi Network bɛɛ bɛ se",
    loadingUser: "I ka jukɔrɔ bɛɛ bɛ sɔrɔ",
    loadingServices: "Baarakɛw bɛɛ bɛ sɔrɔ",
    almostReady: "I ka tablɛɛto bɛɛ bɛ labɛn",
  },
  mooré: {
    title: "Agro Multicenter Hinos",
    loading: "Yɑɑ koom bũmbɑ bɑ lɑ...",
    initializing: "Tʋʋm-tʋmdɑ bɑ lɑ",
    connectingPi: "Pi Network bɑ lɑ",
    loadingUser: "Yɑɑ yʋʋr bɑ lɑ",
    loadingServices: "Tʋʋm-tʋmdɑ bɑ lɑ",
    almostReady: "Yɑɑ tɑblɛɛto bɑ lɑ",
  },
}

const loadingSteps = [
  { key: "initializing", duration: 800, progress: 20 },
  { key: "connectingPi", duration: 1200, progress: 40 },
  { key: "loadingUser", duration: 1000, progress: 60 },
  { key: "loadingServices", duration: 1000, progress: 80 },
  { key: "almostReady", duration: 800, progress: 100 },
]

export function AuthLoadingScreen({ onComplete, language = "fr" }: AuthLoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("")
  const [showLogo, setShowLogo] = useState(false)

  const t = translations[language as keyof typeof translations] || translations.fr

  useEffect(() => {
    // Animation d'entrée du logo
    setTimeout(() => setShowLogo(true), 100)
  }, [])

  useEffect(() => {
    let stepIndex = 0
    let currentProgress = 0

    const advanceStep = () => {
      if (stepIndex < loadingSteps.length) {
        const step = loadingSteps[stepIndex]
        setCurrentMessage(t[step.key as keyof typeof t])
        
        // Animation de progression
        const startProgress = currentProgress
        const endProgress = step.progress
        const duration = step.duration
        const startTime = Date.now()

        const animateProgress = () => {
          const elapsed = Date.now() - startTime
          const newProgress = Math.min(startProgress + (elapsed / duration) * (endProgress - startProgress), endProgress)
          setProgress(Math.floor(newProgress))

          if (elapsed < duration) {
            requestAnimationFrame(animateProgress)
          } else {
            setProgress(endProgress)
            currentProgress = endProgress
            stepIndex++
            
            if (stepIndex < loadingSteps.length) {
              setTimeout(advanceStep, 200)
            } else {
              // Chargement terminé
              setTimeout(() => {
                if (onComplete) onComplete()
              }, 500)
            }
          }
        }

        requestAnimationFrame(animateProgress)
      }
    }

    advanceStep()
  }, [t, onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Carte principale */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-green-100">
          {/* Logo animé */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 bg-green-500/20 rounded-full blur-xl transition-opacity duration-1000 ${showLogo ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`relative w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-700 ${showLogo ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                <span className="text-4xl animate-pulse">🌾</span>
              </div>
              {/* Anneau de chargement extérieur */}
              <div className="absolute -inset-1">
                <div className="w-28 h-28 rounded-full border-4 border-green-500/20" />
                <div className="absolute inset-0 w-28 h-28 rounded-full border-4 border-green-500 border-t-transparent animate-spin" style={{ animationDuration: '1.5s' }} />
              </div>
            </div>
          </div>

          {/* Titre */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent transition-all duration-500 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {t.title}
            </h2>
            <p className={`text-sm text-gray-500 mt-1 transition-all duration-500 delay-100 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {t.loading}
            </p>
          </div>

          {/* Message de progression */}
          <div className={`space-y-4 transition-all duration-500 delay-200 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{currentMessage}</span>
              <span className="text-green-600 font-medium">{progress}%</span>
            </div>

            {/* Barre de progression */}
            <div className="relative">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Points d'animation */}
            <div className="flex justify-center gap-2 pt-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full bg-green-400 transition-all duration-300 ${
                    progress > i * 25 ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Pied de page */}
          <div className={`mt-6 pt-4 border-t border-gray-100 text-center transition-all duration-500 delay-300 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span>Pi Network • Sécurisé</span>
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              <span>Multilingue</span>
            </div>
          </div>
        </div>

        {/* Version */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400">Version 2.0.0 • © 2024 Agro Multicenter Hinos</p>
        </div>
      </div>

      {/* Styles personnalisés */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  )
}