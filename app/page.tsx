"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"  // Ajouté
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
  WifiOff,
} from "lucide-react"

// Composants métier (dans /components directement)
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

// Hooks et contextes
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"

// Données statiques (simplifiées)
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

// Navigation unifiée
const mainNavigation = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "network", label: "Réseau", icon: Users },
  { id: "space", label: "Mon espace", icon: User },
  { id: "alerts", label: "Alertes", icon: Bell },
]

export default function AgroMulticenterApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [userRegion, setUserRegion] = useState("Burkina Faso")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  
  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData, login, logout, isLoading: isPiLoading } = usePiAuth()
  const [savedRegion, setSavedRegion] = useLocalStorage("userRegion", "Burkina Faso")
  const [savedLanguage, setSavedLanguage] = useLocalStorage("language", "fr")
  const [savedUserName, setSavedUserName] = useLocalStorage("userName", "")

  const [registrationData, setRegistrationData] = useState({
    firstName: "", lastName: "", email: "", phone: "", country: "",
    region: "", city: "", profession: "", specialties: [] as string[],
    languages: [] as string[], piWalletAddress: "", latitude: null as number | null,
    longitude: null as number | null,
  })

  // Initialisation
  useEffect(() => {
    if (savedRegion) setUserRegion(savedRegion)
    if (savedLanguage) setCurrentLanguage(savedLanguage)
    if (savedUserName) setSavedUserName(savedUserName)
    setIsInitializing(false)
  }, [])

  // Sauvegarder la région quand elle change
  useEffect(() => {
    if (userRegion) setSavedRegion(userRegion)
  }, [userRegion, setSavedRegion])

  // Sauvegarder la langue quand elle change
  useEffect(() => {
    if (currentLanguage) setSavedLanguage(currentLanguage)
  }, [currentLanguage, setSavedLanguage])

  const handleRegistration = async () => {
    console.log("Inscription:", registrationData)
    const userNameValue = registrationData.firstName || "Agriculteur"
    setSavedUserName(userNameValue)
    setUserRegion(registrationData.country || "Burkina Faso")
    setShowRegistration(false)
    if (isOnline && !isAuthenticated) {
      await login()
    }
  }

  const handleLogout = async () => {
    await logout()
    setSavedUserName("")
    setUserRegion("Burkina Faso")
  }

  // Écran de chargement initial
  if (isInitializing || isPiLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <span className="text-3xl text-white">🌾</span>
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Chargement...</h2>
          <p className="text-gray-500 mt-1">Préparation de votre espace agricole</p>
        </div>
      </div>
    )
  }

  // Écran de connexion
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
            {!isOnline && (
              <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 rounded-lg p-2">
                ⚠️ Connexion internet requise pour l'authentification
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={login}
              disabled={!isOnline}
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

        {/* Dialog d'inscription */}
        <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl">✨ Rejoignez Agro Multicenter Hinos</DialogTitle>
              <p className="text-sm text-gray-500">Remplissez ces informations pour commencer</p>
            </DialogHeader>
            <div className="space-y-5">
              {/* ... contenu du formulaire d'inscription ... */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🌾</span>
          </div>
          <h1 className="font-bold text-green-800">AGRO MC HINOS</h1>
        </div>
        <div className="flex items-center space-x-2">
          {!isOnline && (
            <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
              📡 Hors ligne
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar desktop */}
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
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs opacity-80">🌡️ 32°C · Ensoleillé</p>
                {!isOnline && <WifiOff className="h-3 w-3 opacity-70" />}
              </div>
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
                <p className="text-gray-500">Bonjour {userData?.username || savedUserName || "Agriculteur"} 👋</p>
              </div>
              <div className="flex items-center gap-3">
                {!isOnline && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300 gap-1">
                    <WifiOff className="h-3 w-3" />
                    Hors ligne
                  </Badge>
                )}
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab("alerts")}>
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Alertes</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab("search")}>
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Rechercher</span>
                </Button>
                <LanguageManager currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600">
                  Déconnexion
                </Button>
              </div>
            </div>

            {/* Contenu des onglets - à compléter avec votre JSX existant */}
            <div className="space-y-6">
              {(activeTab === "home") && (
                <Dashboard currentLanguage={currentLanguage} userRegion={userRegion} onTabChange={setActiveTab} />
              )}
              {/* ... autres onglets ... */}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <MobileNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        unreadCount={3}
        notificationCount={5}
        currentLanguage={currentLanguage}
      />
    </div>
  )
}