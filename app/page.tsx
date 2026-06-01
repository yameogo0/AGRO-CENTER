"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Home,
  MessageSquare,
  User,
  Wallet,
  Settings,
  Globe,
  Users,
  Briefcase,
  Bell,
  Search,
  Menu,
  X,
  MapPin,
  BarChart3,
  ShoppingBag,
  CloudSun,
  Loader2,
} from "lucide-react"

import Dashboard from "@/components/dashboard"
import MobileNavigation from "@/components/mobile-navigation"
import AvicultureManagement from "@/components/aviculture-management"
import UserProfile from "@/components/user-profile"
import PiWalletIntegration from "@/components/pi-wallet-integration"
import MessagingSystem from "@/components/messaging-system"
import ServiceManagement from "@/components/service-management"
import RegionalAdaptation from "@/components/regional-adaptation"
import LanguageManager from "@/components/language-manager"
import GeolocationManager from "@/components/geolocation-manager"

// 👇 IMPORTANT: Importer le contexte Pi
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context"

// Données statiques pour la démo (à remplacer par API)
const worldCountries = [
  { name: "Burkina Faso", code: "BF", flag: "🇧🇫", continent: "Africa" },
  { name: "Mali", code: "ML", flag: "🇲🇱", continent: "Africa" },
  { name: "Niger", code: "NE", flag: "🇳🇪", continent: "Africa" },
  { name: "Sénégal", code: "SN", flag: "🇸🇳", continent: "Africa" },
  { name: "Côte d'Ivoire", code: "CI", flag: "🇨🇮", continent: "Africa" },
  { name: "Ghana", code: "GH", flag: "🇬🇭", continent: "Africa" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬", continent: "Africa" },
  { name: "France", code: "FR", flag: "🇫🇷", continent: "Europe" },
]

const professions = [
  "Agriculteur", "Éleveur", "Vétérinaire", "Agronome",
  "Transformateur agricole", "Commerçant agricole", "Consultant agricole",
  "Formateur", "Chercheur", "Coopérative", "ONG", "Autre",
]

const specialties = [
  "Aviculture", "Bovins", "Ovins/Caprins", "Pisciculture", "Apiculture",
  "Maraîchage", "Céréales", "Légumineuses", "Fruits", "Transformation",
  "Marketing", "Finance agricole",
]

const availableLanguages = ["Français", "English", "Português", "Dioula", "Mooré", "Haoussa"]

// Nouvelle navigation unifiée (5 ongles principaux)
const mainNavigation = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "network", label: "Réseau", icon: Users },
  { id: "space", label: "Mon espace", icon: User },
  { id: "alerts", label: "Alertes", icon: Bell },
]

// 📌 Ce composant contient TOUTE la logique de l'application
function AgroMulticenterAppContent() {
  // 👇 Utilisation du hook Pi Auth (remplace isLoggedIn)
  const { 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    userData, 
    error: piError 
  } = usePiAuth()

  const [activeTab, setActiveTab] = useState("home")
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [userRegion, setUserRegion] = useState("Burkina Faso")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [currentWeather, setCurrentWeather] = useState({ temp: "32°C", condition: "Ensoleillé" })

  const [registrationData, setRegistrationData] = useState({
    firstName: "", lastName: "", email: "", phone: "", country: "",
    region: "", city: "", profession: "", specialties: [] as string[],
    languages: [] as string[], piWalletAddress: "", latitude: null as number | null,
    longitude: null as number | null,
  })

  // Simulation météo (à remplacer par API réelle)
  useEffect(() => {
    setCurrentWeather({ temp: "32°C", condition: "Ensoleillé" })
  }, [userRegion])

  const handleRegistration = () => {
    console.log("Inscription:", registrationData)
    setShowRegistration(false)
    setUserRegion(registrationData.country || "Burkina Faso")
    // Note: L'inscription devrait aussi créer un compte sur votre backend
  }

  // 🔄 Écran de chargement (pendant que Pi SDK se charge)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de Pi Network...</p>
          <p className="text-sm text-gray-400 mt-2">Veuillez patienter</p>
        </div>
      </div>
    )
  }

  // 🔐 Écran de connexion (si non authentifié)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl text-white">🌾</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">AGRO MULTICENTER HINOS</CardTitle>
            <p className="text-gray-600 mt-1">Plateforme agricole connectée</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Affichage des erreurs Pi */}
            {piError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                ⚠️ {piError}
              </div>
            )}
            
            {/* 👇 Bouton de connexion Pi Network */}
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={login}
            >
              🔓 Se connecter avec Pi Network
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-green-500 text-green-600 hover:bg-green-50" 
              onClick={() => setShowRegistration(true)}
            >
              ✨ Créer un compte gratuit
            </Button>
          </CardContent>
        </Card>

        {/* Dialog d'inscription (inchangé) */}
        <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl">✨ Rejoignez Agro Multicenter Hinos</DialogTitle>
              <p className="text-sm text-gray-500">Remplissez ces informations pour commencer</p>
            </DialogHeader>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input id="firstName" placeholder="Votre prénom"
                    value={registrationData.firstName}
                    onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input id="lastName" placeholder="Votre nom"
                    value={registrationData.lastName}
                    onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="exemple@email.com"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" placeholder="+226 XX XX XX XX"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Pays *</Label>
                <Select value={registrationData.country} onValueChange={(value) => setRegistrationData({ ...registrationData, country: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {worldCountries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        <span className="mr-2">{country.flag}</span> {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <Label className="text-blue-800 font-medium">📍 Géolocalisation (fortement recommandée)</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2 bg-white"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => setRegistrationData({
                          ...registrationData,
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude,
                        }),
                        (error) => console.error("Erreur GPS:", error)
                      )
                    }
                  }}
                >
                  📍 Détecter ma position
                </Button>
                <p className="text-xs text-blue-600 mt-2">✓ Conseils adaptés à votre climat</p>
                <p className="text-xs text-blue-600">✓ Connexion avec des agriculteurs proches</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">Région</Label>
                  <Input id="region" placeholder="Ex: Hauts-Bassins"
                    value={registrationData.region}
                    onChange={(e) => setRegistrationData({ ...registrationData, region: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input id="city" placeholder="Ex: Bobo-Dioulasso"
                    value={registrationData.city}
                    onChange={(e) => setRegistrationData({ ...registrationData, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="profession">Profession *</Label>
                <Select value={registrationData.profession} onValueChange={(value) => setRegistrationData({ ...registrationData, profession: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((prof) => (
                      <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Spécialités (plusieurs choix possibles)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {specialties.map((spec) => (
                    <label key={spec} className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" checked={registrationData.specialties.includes(spec)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRegistrationData({ ...registrationData, specialties: [...registrationData.specialties, spec] })
                          } else {
                            setRegistrationData({ ...registrationData, specialties: registrationData.specialties.filter(s => s !== spec) })
                          }
                        }}
                      />
                      <span>{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="piWallet">Adresse Portefeuille Pi Network (optionnel)</Label>
                <Input id="piWallet" placeholder="GABC123..."
                  value={registrationData.piWalletAddress}
                  onChange={(e) => setRegistrationData({ ...registrationData, piWalletAddress: e.target.value })}
                />
              </div>

              <Button onClick={handleRegistration} className="w-full bg-green-600 hover:bg-green-700 text-white">
                🚀 Créer mon compte
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ✅ Application principale (quand l'utilisateur est connecté)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile simplifié */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🌾</span>
          </div>
          <h1 className="font-bold text-green-800">AGRO MC HINOS</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{currentWeather.temp}</span>
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar (version desktop) */}
        <div className={`${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transition-transform duration-300`}>
          <div className="p-5 border-b bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">🌾</span>
              </div>
              <div>
                <h1 className="font-bold text-green-800">AGRO MULTICENTER</h1>
                <p className="text-xs text-gray-500">HINOS</p>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id || 
                (item.id === "marketplace" && ["aviculture", "services"].includes(activeTab)) ||
                (item.id === "network" && ["messages", "regional", "geolocation"].includes(activeTab)) ||
                (item.id === "space" && ["wallet", "profile", "settings"].includes(activeTab)) ||
                (item.id === "alerts" && ["analytics"].includes(activeTab))
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50"}`}
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
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-90">📍 Position</p>
                  <p className="text-sm font-semibold">{userRegion}</p>
                </div>
                <CloudSun className="h-5 w-5 opacity-90" />
              </div>
              <p className="text-xs mt-1 opacity-80">{currentWeather.temp} · {currentWeather.condition}</p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 lg:ml-0 pb-20 lg:pb-6">
          <div className="p-4 lg:p-6">
            {/* Header desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mainNavigation.find((item) => {
                    if (activeTab === item.id) return true
                    if (activeTab === "aviculture" || activeTab === "services") return item.id === "marketplace"
                    if (["messages", "regional", "geolocation"].includes(activeTab)) return item.id === "network"
                    if (["wallet", "profile", "settings"].includes(activeTab)) return item.id === "space"
                    if (activeTab === "analytics") return item.id === "alerts"
                    return false
                  })?.label || "Accueil"}
                </h2>
                <p className="text-gray-500">
                  Bonjour {userData?.username || "Agriculteur"} 👋
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Alertes</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Rechercher</span>
                </Button>
                <LanguageManager currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
                {/* 👇 Bouton déconnexion avec Pi logout */}
                <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600">
                  Déconnexion
                </Button>
              </div>
            </div>

            {/* Contenu des onglets (inchangé) */}
            <div className="space-y-6">
              {/* Accueil */}
              {(activeTab === "home") && (
                <Dashboard currentLanguage={currentLanguage} userRegion={userRegion} onTabChange={setActiveTab} />
              )}

              {/* Marketplace */}
              {(activeTab === "marketplace") && (
                <div className="space-y-6">
                  <AvicultureManagement currentLanguage={currentLanguage} userRegion={userRegion} />
                  <ServiceManagement currentLanguage={currentLanguage} userRegion={userRegion} />
                </div>
              )}

              {/* Réseau */}
              {(activeTab === "network") && (
                <div className="space-y-6">
                  <MessagingSystem currentLanguage={currentLanguage} userRegion={userRegion} />
                  <div className="grid md:grid-cols-2 gap-6">
                    <RegionalAdaptation currentLanguage={currentLanguage} userRegion={userRegion} onRegionChange={setUserRegion} />
                    <GeolocationManager currentLanguage={currentLanguage} userRegion={userRegion} />
                  </div>
                </div>
              )}

              {/* Mon espace */}
              {(activeTab === "space") && (
                <div className="space-y-6">
                  <UserProfile currentLanguage={currentLanguage} userRegion={userRegion} />
                  <PiWalletIntegration currentLanguage={currentLanguage} userRegion={userRegion} />
                  <Card>
                    <CardHeader>
                      <CardTitle>⚙️ Paramètres</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">Notifications push</p>
                          <p className="text-sm text-gray-500">Alertes météo et conseils</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-green-50 text-green-600">Activé</Button>
                      </div>
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">Mode sombre</p>
                          <p className="text-sm text-gray-500">Pour un confort visuel</p>
                        </div>
                        <Button variant="outline" size="sm">Désactivé</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Synchronisation auto</p>
                          <p className="text-sm text-gray-500">Données à jour en temps réel</p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-green-50 text-green-600">Activé</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Alertes */}
              {(activeTab === "alerts") && (
                <div className="space-y-6">
                  <Card className="border-l-4 border-l-orange-400">
                    <CardHeader>
                      <CardTitle>🔔 Alertes du jour</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">⚠️ Pluies importantes prévues demain</p>
                        <p className="text-xs text-yellow-600">Protégez vos récoltes et vos animaux</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-green-800">✅ Période de semis optimale</p>
                        <p className="text-xs text-green-600">Conditions idéales pour le maïs et le mil</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>📊 Analyses et données</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-lg">Module d'analyses</h3>
                      <p className="text-gray-500 mt-1 mb-4">Suivez vos performances et optimisez vos rendements</p>
                      <Button className="bg-green-600 hover:bg-green-700">Accéder aux analyses</Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Compatibilité avec anciens onglets */}
              {activeTab === "aviculture" && <AvicultureManagement currentLanguage={currentLanguage} userRegion={userRegion} />}
              {activeTab === "services" && <ServiceManagement currentLanguage={currentLanguage} userRegion={userRegion} />}
              {activeTab === "messages" && <MessagingSystem currentLanguage={currentLanguage} userRegion={userRegion} />}
              {activeTab === "wallet" && <PiWalletIntegration currentLanguage={currentLanguage} userRegion={userRegion} />}
              {activeTab === "profile" && <UserProfile currentLanguage={currentLanguage} userRegion={userRegion} />}
              {activeTab === "regional" && <RegionalAdaptation currentLanguage={currentLanguage} userRegion={userRegion} onRegionChange={setUserRegion} />}
              {activeTab === "geolocation" && <GeolocationManager currentLanguage={currentLanguage} userRegion={userRegion} />}
              {activeTab === "analytics" && (
                <Card>
                  <CardHeader><CardTitle>📊 Analyses</CardTitle></CardHeader>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <Button>Accéder aux analyses</Button>
                  </CardContent>
                </Card>
              )}
              {activeTab === "settings" && (
                <Card>
                  <CardHeader><CardTitle>⚙️ Paramètres</CardTitle></CardHeader>
                  <CardContent>Options de configuration...</CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile en bas */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
    </div>
  )
}

// 📌 LE COMPOSANT PRINCIPAL - ENVELOPPE TOUT AVEC PiAuthProvider
export default function AgroMulticenterApp() {
  return (
    <PiAuthProvider>
      <AgroMulticenterAppContent />
    </PiAuthProvider>
  )
}