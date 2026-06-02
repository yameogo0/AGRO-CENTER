"use client"

import { useState } from "react"
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
} from "lucide-react"

import Dashboard from "@/components/dashboard"
import MobileNavigation from "@/components/mobile-navigation"
import AvicultureManagement from "@/components/aviculture-management"
import UserProfile from "@/components/user-profile"
import PiWalletIntegration from "@/components/pi-wallet-integration"
import MessagingSystem from "@/components/messaging-system"
import ServiceManagement from "@/components/service-management"
import LanguageManager from "@/components/language-manager"
import GeolocationManager from "@/components/geolocation-manager"
import RegionalAdaptation from "@/components/regional-adaptation"

export default function AgroMulticenterApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [currentLanguage, setCurrentLanguage] = useState("fr")
  const [userRegion, setUserRegion] = useState("Burkina Faso")  // ✅ Ajouté
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    region: "",
    city: "",
    profession: "",
    specialties: [] as string[],
    languages: [] as string[],
    piWalletAddress: "",
    latitude: null as number | null,
    longitude: null as number | null,
  })

  const worldCountries = [
    { name: "Afghanistan", code: "AF", flag: "🇦🇫", continent: "Asia" },
    { name: "Albania", code: "AL", flag: "🇦🇱", continent: "Europe" },
    { name: "Algeria", code: "DZ", flag: "🇩🇿", continent: "Africa" },
    { name: "Burkina Faso", code: "BF", flag: "🇧🇫", continent: "Africa" },
    { name: "Mali", code: "ML", flag: "🇲🇱", continent: "Africa" },
    { name: "Niger", code: "NE", flag: "🇳🇪", continent: "Africa" },
    { name: "Senegal", code: "SN", flag: "🇸🇳", continent: "Africa" },
    { name: "Côte d'Ivoire", code: "CI", flag: "🇨🇮", continent: "Africa" },
    { name: "Ghana", code: "GH", flag: "🇬🇭", continent: "Africa" },
    { name: "Nigeria", code: "NG", flag: "🇳🇬", continent: "Africa" },
    { name: "France", code: "FR", flag: "🇫🇷", continent: "Europe" },
    { name: "United States", code: "US", flag: "🇺🇸", continent: "North America" },
    { name: "Brazil", code: "BR", flag: "🇧🇷", continent: "South America" },
    { name: "India", code: "IN", flag: "🇮🇳", continent: "Asia" },
    { name: "China", code: "CN", flag: "🇨🇳", continent: "Asia" },
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

  const handleRegistration = () => {
    console.log("Données d'inscription:", registrationData)
    setIsLoggedIn(true)
    setShowRegistration(false)
    if (registrationData.country) {
      setUserRegion(registrationData.country)
    }
  }

  const navigationItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "aviculture", label: "Aviculture", icon: Users },
    { id: "services", label: "Services", icon: Briefcase },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "wallet", label: "Portefeuille π", icon: Wallet },
    { id: "profile", label: "Profil", icon: User },
    { id: "regional", label: "Régions", icon: Globe },
    { id: "geolocation", label: "Géolocalisation", icon: MapPin },
    { id: "analytics", label: "Analyses", icon: BarChart3 },
    { id: "settings", label: "Paramètres", icon: Settings },
  ]

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white font-bold">🌾</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">AGRO MULTICENTER HINOS</CardTitle>
            <p className="text-gray-600">Plateforme agricole mondiale</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsLoggedIn(true)}>
              Se connecter avec Pi Network
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowRegistration(true)}>
              Créer un compte
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Inscription à Agro Multicenter Hinos</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={registrationData.firstName}
                    onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={registrationData.lastName}
                    onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="country">Pays</Label>
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
                    value={registrationData.region}
                    onChange={(e) => setRegistrationData({ ...registrationData, region: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
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
                  value={registrationData.piWalletAddress}
                  onChange={(e) => setRegistrationData({ ...registrationData, piWalletAddress: e.target.value })}
                  placeholder="Votre adresse Pi Network"
                />
              </div>

              <Button onClick={handleRegistration} className="w-full bg-green-600 hover:bg-green-700">
                Créer mon compte
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🌾</span>
          </div>
          <h1 className="font-bold text-lg">AGRO MC HINOS</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 ease-in-out`}
        >
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🌾</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">AGRO MULTICENTER</h1>
                <p className="text-xs text-gray-500">HINOS</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
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
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-3 rounded-lg text-center">
              <p className="text-sm font-medium">Région actuelle: {userRegion}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find((item) => item.id === activeTab)?.label}
                </h2>
                <p className="text-gray-600">Bienvenue sur votre plateforme agricole mondiale</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <LanguageManager currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "home" && (
                <Dashboard 
                  currentLanguage={currentLanguage} 
                  userRegion={userRegion} 
                  onTabChange={setActiveTab} 
                />
              )}

              {activeTab === "aviculture" && (
                <AvicultureManagement currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {activeTab === "services" && (
                <ServiceManagement currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {activeTab === "messages" && (
                <MessagingSystem currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {activeTab === "wallet" && (
                <PiWalletIntegration currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {activeTab === "profile" && (
                <UserProfile currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {activeTab === "regional" && (
                <RegionalAdaptation
                  currentLanguage={currentLanguage}
                  userRegion={userRegion}
                  onRegionChange={setUserRegion}
                />
              )}

              {activeTab === "geolocation" && (
                <GeolocationManager currentLanguage={currentLanguage} userRegion={userRegion} />
              )}

              {activeTab === "analytics" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analyses et Données</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Module d'Analyses</h3>
                      <p className="text-gray-600 mb-4">
                        Visualisez vos données agricoles, analysez vos performances et optimisez vos rendements.
                      </p>
                      <Button>Accéder aux analyses</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de l'application</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Notifications push</h4>
                          <p className="text-sm text-gray-500">Recevoir les notifications sur votre appareil</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Activé
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Mode sombre</h4>
                          <p className="text-sm text-gray-500">Utiliser le thème sombre</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Désactivé
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Synchronisation automatique</h4>
                          <p className="text-sm text-gray-500">Synchroniser automatiquement vos données</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Activé
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
    </div>
  )
}