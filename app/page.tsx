"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  LogOut,
  CheckCircle,
} from "lucide-react"

// Composants métier
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

// Données statiques
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

// Navigation unifiée
const mainNavigation = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "network", label: "Réseau", icon: Users },
  { id: "space", label: "Mon espace", icon: User },
  { id: "alerts", label: "Alertes", icon: Bell },
]

// Navigation secondaire (pour l'affichage des sous-onglets)
const secondaryNavigation = {
  marketplace: [
    { id: "aviculture", label: "Aviculture", icon: Briefcase },
    { id: "services", label: "Services", icon: ShoppingBag },
  ],
  network: [
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "regional", label: "Régions", icon: Globe },
    { id: "geolocation", label: "Géolocalisation", icon: MapPin },
  ],
  space: [
    { id: "wallet", label: "Portefeuille π", icon: Wallet },
    { id: "profile", label: "Profil", icon: User },
    { id: "settings", label: "Paramètres", icon: Settings },
  ],
  alerts: [
    { id: "analytics", label: "Analyses", icon: BarChart3 },
  ],
}

export default function AgroMulticenterApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [userRegion, setUserRegion] = useState("Burkina Faso")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  
  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData, login, logout, isLoading: isPiLoading } = usePiAuth()
  const [savedRegion, setSavedRegion] = useLocalStorage("userRegion", "Burkina Faso")
  const [savedLanguage, setSavedLanguage] = useLocalStorage("language", "fr")
  const [savedUserName, setSavedUserName] = useLocalStorage("userName", "")
  const [savedUserEmail, setSavedUserEmail] = useLocalStorage("userEmail", "")

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
    setIsInitializing(false)
  }, [savedRegion, savedLanguage])

  // Sauvegarder la région quand elle change
  useEffect(() => {
    if (userRegion) setSavedRegion(userRegion)
  }, [userRegion, setSavedRegion])

  // Sauvegarder la langue quand elle change
  useEffect(() => {
    if (currentLanguage) setSavedLanguage(currentLanguage)
  }, [currentLanguage, setSavedLanguage])

  const handleRegistration = async () => {
    setRegistrationSuccess(false)
    
    // Validation basique
    if (!registrationData.firstName || !registrationData.email) {
      console.error("Champs requis manquants")
      return
    }
    
    console.log("Inscription:", registrationData)
    const userNameValue = registrationData.firstName || "Agriculteur"
    setSavedUserName(userNameValue)
    setSavedUserEmail(registrationData.email)
    setUserRegion(registrationData.country || "Burkina Faso")
    
    setRegistrationSuccess(true)
    
    setTimeout(() => {
      setShowRegistration(false)
      setRegistrationSuccess(false)
      if (isOnline && !isAuthenticated) {
        login()
      }
    }, 1500)
  }

  const handleLogout = async () => {
    await logout()
    setSavedUserName("")
    setSavedUserEmail("")
    setUserRegion("Burkina Faso")
  }

  // Déterminer l'onglet parent actif
  const getParentTab = (tab: string): string => {
    if (["aviculture", "services"].includes(tab)) return "marketplace"
    if (["messages", "regional", "geolocation"].includes(tab)) return "network"
    if (["wallet", "profile", "settings"].includes(tab)) return "space"
    if (["analytics"].includes(tab)) return "alerts"
    return tab
  }

  // Obtenir le label de l'onglet actif
  const getActiveLabel = () => {
    if (activeSubTab) {
      const subNav = secondaryNavigation[activeTab as keyof typeof secondaryNavigation]
      const found = subNav?.find(item => item.id === activeSubTab)
      if (found) return found.label
    }
    const found = mainNavigation.find(item => item.id === activeTab)
    return found?.label || "Accueil"
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
        <Dialog open={showRegistration} onOpenChange={(open) => {
          if (!open) setRegistrationSuccess(false)
          setShowRegistration(open)
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl">✨ Rejoignez Agro Multicenter Hinos</DialogTitle>
              <p className="text-sm text-gray-500">Remplissez ces informations pour commencer</p>
            </DialogHeader>
            
            {registrationSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-700">Inscription réussie !</h3>
                <p className="text-gray-500 mt-1">Redirection en cours...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      placeholder="Votre prénom"
                      value={registrationData.firstName}
                      onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Votre nom"
                      value={registrationData.lastName}
                      onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    placeholder="+226 XX XX XX XX"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="country">Pays *</Label>
                  <Select
                    value={registrationData.country}
                    onValueChange={(value) => setRegistrationData({ ...registrationData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {worldCountries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Région/État</Label>
                    <Input
                      id="region"
                      placeholder="Votre région"
                      value={registrationData.region}
                      onChange={(e) => setRegistrationData({ ...registrationData, region: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      placeholder="Votre ville"
                      value={registrationData.city}
                      onChange={(e) => setRegistrationData({ ...registrationData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Select
                    value={registrationData.profession}
                    onValueChange={(value) => setRegistrationData({ ...registrationData, profession: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map((profession) => (
                        <SelectItem key={profession} value={profession}>
                          {profession}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Spécialités</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {specialties.slice(0, 8).map((specialty) => (
                      <label key={specialty} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={registrationData.specialties.includes(specialty)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRegistrationData({
                                ...registrationData,
                                specialties: [...registrationData.specialties, specialty],
                              })
                            } else {
                              setRegistrationData({
                                ...registrationData,
                                specialties: registrationData.specialties.filter((s) => s !== specialty),
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Langues parlées</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableLanguages.map((language) => (
                      <label key={language} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={registrationData.languages.includes(language)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRegistrationData({
                                ...registrationData,
                                languages: [...registrationData.languages, language],
                              })
                            } else {
                              setRegistrationData({
                                ...registrationData,
                                languages: registrationData.languages.filter((l) => l !== language),
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="piWallet">Adresse Portefeuille Pi Network</Label>
                  <Input
                    id="piWallet"
                    placeholder="Votre adresse Pi Network"
                    value={registrationData.piWalletAddress}
                    onChange={(e) => setRegistrationData({ ...registrationData, piWalletAddress: e.target.value })}
                  />
                </div>

                <Button 
                  onClick={handleRegistration} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Créer mon compte
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Composant principal de l'application connectée
  const currentParentTab = getParentTab(activeSubTab || activeTab)
  const displayTab = activeSubTab || activeTab

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🌾</span>
          </div>
          <h1 className="font-bold text-green-800">AGRO MC HINOS</h1>
        </div>
        <div className="flex items-center space-x-2">
          {!isOnline && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-300 gap-1 text-xs">
              <WifiOff className="h-3 w-3" />
              Hors ligne
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar desktop */}
        <div className={`${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transition-transform duration-300 flex flex-col h-full`}>
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
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                👋 {userData?.username || savedUserName || "Agriculteur"}
              </p>
            </div>
          </div>

          <nav className="p-3 space-y-1 flex-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const isActive = currentParentTab === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-green-50"}`}
                  onClick={() => {
                    setActiveTab(item.id)
                    setActiveSubTab(null)
                    setIsMenuOpen(false)
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {isActive && (
                    <CheckCircle className="h-3 w-3 ml-auto opacity-70" />
                  )}
                </Button>
              )
            })}
          </nav>

          {/* Bouton déconnexion */}
          <div className="p-3 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Déconnexion
            </Button>
          </div>

          <div className="p-3 pb-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-90">📍 Position</p>
                  <p className="text-sm font-semibold">{userRegion}</p>
                </div>
                <CloudSun className="h-5 w-5 opacity-90" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs opacity-80">🌡️ 32°C · Ensoleillé</p>
                {!isOnline && <WifiOff className="h-3 w-3 opacity-70" />}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 lg:ml-0 pb-20 lg:pb-6 min-h-screen">
          <div className="p-4 lg:p-6">
            {/* Header desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getActiveLabel()}
                </h2>
                <p className="text-gray-500">
                  Bonjour {userData?.username || savedUserName || "Agriculteur"} 👋
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {!isOnline && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300 gap-1">
                    <WifiOff className="h-3 w-3" />
                    Mode hors ligne
                  </Badge>
                )}
                <LanguageManager currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
                <Button variant="outline" size="sm" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Alertes</span>
                </Button>
              </div>
            </div>

            {/* Navigation secondaire (sous-onglets) */}
            {currentParentTab !== "home" && secondaryNavigation[currentParentTab as keyof typeof secondaryNavigation] && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {secondaryNavigation[currentParentTab as keyof typeof secondaryNavigation].map((item) => {
                  const Icon = item.icon
                  const isActive = displayTab === item.id
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={`gap-2 ${isActive ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => setActiveSubTab(item.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  )
                })}
              </div>
            )}

            {/* Contenu des onglets */}
            <div className="space-y-6">
              {displayTab === "home" && (
                <Dashboard 
                  currentLanguage={currentLanguage} 
                  userRegion={userRegion} 
                  onTabChange={(tab: string) => {
                    setActiveTab(tab)
                    setActiveSubTab(null)
                  }} 
                />
              )}

              {displayTab === "aviculture" && (
                <AvicultureManagement currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {displayTab === "services" && (
                <ServiceManagement currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {displayTab === "messages" && (
                <MessagingSystem currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {displayTab === "regional" && (
                <RegionalAdaptation
                  currentLanguage={currentLanguage}
                  userRegion={userRegion}
                  onRegionChange={setUserRegion}
                />
              )}

              {displayTab === "geolocation" && (
                <GeolocationManager currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {displayTab === "wallet" && (
                <PiWalletIntegration currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {displayTab === "profile" && (
                <UserProfile currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {displayTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de l'application</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Notifications push</h4>
                        <p className="text-sm text-gray-500">Recevoir les alertes météo et agricoles</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Activé</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Mode hors ligne</h4>
                        <p className="text-sm text-gray-500">Accéder aux données sans connexion</p>
                      </div>
                      <Badge variant="outline" className="text-gray-500">Désactivé</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Partage de position</h4>
                        <p className="text-sm text-gray-500">Améliorez les recommandations locales</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Activé</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {displayTab === "analytics" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analyses et Données</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold mb-2">Module d'Analyses</h3>
                      <p className="text-gray-600 mb-4 max-w-md mx-auto">
                        Visualisez vos données agricoles, analysez vos performances et optimisez vos rendements.
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Accéder aux analyses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Message si aucun contenu correspondant */}
              {!["home", "aviculture", "services", "messages", "regional", "geolocation", "wallet", "profile", "settings", "analytics"].includes(displayTab) && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">Module en cours de développement</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <MobileNavigation 
        activeTab={activeTab}
        onTabChange={(tab: string) => {
          setActiveTab(tab)
          setActiveSubTab(null)
          setIsMenuOpen(false)
        }}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        unreadCount={3}
        notificationCount={5}
        currentLanguage={currentLanguage}
      />
    </div>
  )
}