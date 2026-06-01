import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-2xl text-white">🌾</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">AGRO MULTICENTER HINOS</h2>
          <p className="text-gray-600 mb-6">Chargement de votre plateforme agricole...</p>

          {/* Loading Animation */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>

          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Initialisation des services...</span>
            </div>
            <p>Connexion sécurisée Pi Network</p>
            <p>Adaptation régionale en cours</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: "75%" }}
            ></div>
          </div>

          <div className="mt-4 text-xs text-gray-400">Plateforme agricole mondiale • Paiements Pi • Multilingue</div>
        </CardContent>
      </Card>
    </div>
  )
}
