"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Sprout, CloudSun, Users, ShoppingBag } from "lucide-react"

export default function Loading() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [loadingStep, setLoadingStep] = useState(0)

  const loadingMessages = [
    "Initialisation de votre espace agricole...",
    "Connexion au réseau d'agriculteurs...",
    "Chargement des données locales...",
    "Préparation de votre tableau de bord...",
  ]

  useEffect(() => {
    // Progression de la barre
    const progressInterval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return Math.min(oldProgress + 10, 100)
      })
    }, 150)

    // Changement des messages de chargement
    const messageInterval = setInterval(() => {
      setLoadingStep((oldStep) => (oldStep + 1) % loadingMessages.length)
    }, 800)

    // Redirection après 2 secondes
    const timer = setTimeout(() => {
      router.push("/")
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
      clearTimeout(timer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          {/* Logo animé */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white">🌾</span>
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent mb-2">
            AGRO MULTICENTER HINOS
          </h2>
          <p className="text-gray-500 mb-6">Plateforme agricole connectée</p>

          {/* Message de chargement dynamique */}
          <div className="min-h-[60px] mb-4">
            <p className="text-gray-600 font-medium animate-pulse">
              {loadingMessages[loadingStep]}
            </p>
          </div>

          {/* Points d'animation */}
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Pourcentage */}
          <p className="text-xs text-gray-400 mb-4">{progress}%</p>

          {/* Icônes des fonctionnalités */}
          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Sprout className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-400 mt-1">Agri</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CloudSun className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-400 mt-1">Météo</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-xs text-gray-400 mt-1">Réseau</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-xs text-gray-400 mt-1">Market</span>
            </div>
          </div>

          {/* Version */}
          <div className="mt-6 text-[10px] text-gray-300">
            Version 2.0.0 • © 2024 Agro Multicenter Hinos
          </div>
        </CardContent>
      </Card>
    </div>
  )
}