"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Loading() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page principale après 1.5 secondes
    const timer = setTimeout(() => {
      router.push("/")
    }, 1500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            <span className="text-2xl text-white">🌾</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">AGRO MULTICENTER HINOS</h2>
          <p className="text-gray-600 mb-6">Chargement de votre plateforme agricole...</p>

          {/* Animation de chargement */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Préparation de votre espace...</span>
            </div>
            <p>🌍 Adaptation régionale en cours</p>
            <p>🤝 Connexion au réseau d'agriculteurs</p>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: "90%" }}
            ></div>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            🌾 Agro Multicenter Hinos • Plateforme agricole connectée
          </div>
        </CardContent>
      </Card>
    </div>
  )
}