"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Home, 
  MessageSquare, 
  User, 
  Wallet, 
  Menu,
  X,
  Bell,
  Search,
  MapPin,
  ShoppingBag,
  Users,
  CloudSun,
  Sprout
} from "lucide-react"

export default function AgroMulticenterApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Forcé à true
  const [userName] = useState("Jean")
  const [userRegion] = useState("Burkina Faso")

  // Données simulées
  const products = [
    { name: "Engrais NPK 15-15-15", price: "25 000 FCFA", supplier: "Coopérative YELEN", unit: "Sac 50kg", status: "Disponible" },
    { name: "Poules pondeuses ISA", price: "3 500 FCFA", supplier: "Moussa Koné", unit: "Unité", status: "Épuisé" },
    { name: "Mangues Kent", price: "500 FCFA", supplier: "Fatou Kabaré", unit: "kg", status: "Disponible" },
    { name: "Location tracteur", price: "15 000 FCFA", supplier: "Coopérative Mécanisation", unit: "Jour", status: "Disponible" },
  ]

  const farmers = [
    { name: "Koffi Asante", activity: "Maraîchage bio", distance: "2.3 km", rating: 4.8 },
    { name: "Aminata Traoré", activity: "Aviculture moderne", distance: "5.1 km", rating: 4.9 },
    { name: "Ibrahim Sawadogo", activity: "Céréales & légumineuses", distance: "8.7 km", rating: 4.6 },
  ]

  const navigationItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "network", label: "Réseau", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "profile", label: "Profil", icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🌾</span>
          </div>
          <h1 className="font-bold text-green-800 text-lg">AGRO MC HINOS</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">32°C</span>
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transition-transform duration-300`}>
          <div className="p-5 border-b bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🌾</span>
              </div>
              <div>
                <h1 className="font-bold text-green-800">AGRO MULTICENTER</h1>
                <p className="text-xs text-gray-500">HINOS</p>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === item.id ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50"}`}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMenuOpen(false)
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-90">📍 Position</p>
                  <p className="text-sm font-semibold">{userRegion}</p>
                </div>
                <CloudSun className="h-5 w-5" />
              </div>
              <p className="text-xs mt-1 opacity-80">32°C · Ensoleillé</p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 pb-20 lg:pb-6">
          <div className="p-4">
            {/* En-tête desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Bonjour {userName} 👋
                </h2>
                <p className="text-gray-500">Bienvenue sur votre plateforme agricole</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Bell className="h-4 w-4 mr-2" />Alertes</Button>
                <Button variant="outline" size="sm"><Search className="h-4 w-4 mr-2" />Rechercher</Button>
              </div>
            </div>

            {/* Onglet Accueil */}
            {activeTab === "home" && (
              <div className="space-y-6">
                {/* Conseils météo */}
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600">Conseil du jour</p>
                        <p className="font-semibold">🌾 Parfait pour la récolte du mil</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">32°C</p>
                        <p className="text-sm text-gray-500">Ensoleillé</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Alertes importantes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🔔 Alertes importantes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium text-blue-800">🌧️ Pluies importantes prévues</p>
                      <p className="text-sm text-blue-600">Fortes pluies attendues demain après-midi. Protégez vos plantes.</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-medium text-green-800">🌱 Période de semis optimale</p>
                      <p className="text-sm text-green-600">Conditions idéales pour le maïs et le sorgho.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Produits récents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">🛒 Produits récents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {products.slice(0, 2).map((product, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.supplier}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{product.price}</p>
                          <p className="text-xs text-gray-500">{product.unit}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Agriculteurs à proximité */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">👥 Agriculteurs à proximité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {farmers.map((farmer, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">{farmer.name}</p>
                          <p className="text-sm text-gray-500">{farmer.activity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{farmer.distance}</p>
                          <p className="text-sm text-yellow-500">★ {farmer.rating}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Onglet Marketplace */}
            {activeTab === "marketplace" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Marketplace agricole</h2>
                <div className="space-y-3">
                  {products.map((product, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.supplier}</p>
                            <p className="text-sm text-gray-500">{product.unit}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{product.price}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${product.status === "Disponible" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {product.status}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Réseau */}
            {activeTab === "network" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Réseau d'agriculteurs</h2>
                <div className="space-y-3">
                  {farmers.map((farmer, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600">👨‍🌾</span>
                              </div>
                              <div>
                                <p className="font-semibold">{farmer.name}</p>
                                <p className="text-sm text-gray-500">{farmer.activity}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{farmer.distance}</p>
                            <p className="text-sm text-yellow-500">★ {farmer.rating}</p>
                            <Button size="sm" variant="outline" className="mt-1">Contacter</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Messages */}
            {activeTab === "messages" && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucun message pour le moment</p>
                  <Button variant="outline" className="mt-3">Commencer une conversation</Button>
                </CardContent>
              </Card>
            )}

            {/* Onglet Profil */}
            {activeTab === "profile" && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">👨‍🌾</span>
                    </div>
                    <h2 className="text-xl font-bold">{userName}</h2>
                    <p className="text-gray-500">Agriculteur · {userRegion}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Téléphone</span>
                      <span className="font-medium">+226 XX XX XX XX</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Spécialités</span>
                      <span className="font-medium">Aviculture, Maraîchage</span>
                    </div>
                    <Button className="w-full bg-red-500 hover:bg-red-600" variant="default">
                      Déconnexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Navigation mobile en bas */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-10">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === item.id ? "text-green-600" : "text-gray-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}