"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Globe,
  Shield,
  User,
  Wallet,
  Cloud,
  Droplets,
  Wind,
  AlertTriangle,
  TrendingUp,
  Users,
  Store,
  MessageSquare,
  BookOpen,
  Map,
  Activity,
  Bell,
  ChevronRight,
  Sprout,
  ShoppingCart,
  Wifi,
  WifiOff,
  RefreshCw,
  Star,
  ChevronLeft,
  Tractor,
  ChevronDown,
  Check,
  Pi,
  Loader2,
  Heart,
  Clock,
  Calendar,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { userApi } from "@/lib/api/user"
import { servicesApi } from "@/lib/api/services"
import { showToast } from "@/lib/utils"

interface DashboardProps {
  currentLanguage: string
  userRegion: string
  onTabChange: (tab: string) => void
}

// Traductions complètes
const translations: Record<string, any> = {
  fr: {
    greetings: "Bonjour",
    dashboard: "Tableau de bord",
    online: "En ligne",
    offline: "Hors ligne",
    myFarm: "Mon exploitation",
    localMarket: "Marketplace",
    farmerNetwork: "Réseau",
    knowledge: "Connaissances",
    piWallet: "Portefeuille Pi",
    maps: "Géolocalisation",
    weatherTitle: "Météo agricole",
    weatherAdvice: "Conseil météo",
    alerts: "Alertes",
    noAlerts: "Aucune alerte",
    nearbyFarmers: "Agriculteurs à proximité",
    localProducts: "Produits locaux",
    localServices: "Services à proximité",
    viewAll: "Voir tout",
    searchPlaceholder: "Rechercher un produit...",
    distance: "Distance",
    price: "Prix",
    available: "Disponible",
    unavailable: "Indisponible",
    rating: "Note",
    followers: "Abonnés",
    following: "Abonnements",
    reviews: "Avis",
    piEarned: "π gagnés",
    viewProfile: "Voir profil",
    buyNow: "Acheter",
    contact: "Contacter",
    share: "Partager",
    save: "Sauvegarder",
    dismiss: "Ignorer",
    refresh: "Actualiser",
  },
  en: {
    greetings: "Hello",
    dashboard: "Dashboard",
    online: "Online",
    offline: "Offline",
    myFarm: "My farm",
    localMarket: "Marketplace",
    farmerNetwork: "Network",
    knowledge: "Knowledge",
    piWallet: "Pi Wallet",
    maps: "Geolocation",
    weatherTitle: "Weather",
    weatherAdvice: "Weather tip",
    alerts: "Alerts",
    noAlerts: "No alerts",
    nearbyFarmers: "Nearby farmers",
    localProducts: "Local products",
    localServices: "Nearby services",
    viewAll: "View all",
    searchPlaceholder: "Search product...",
    distance: "Distance",
    price: "Price",
    available: "Available",
    unavailable: "Unavailable",
    rating: "Rating",
    followers: "Followers",
    following: "Following",
    reviews: "Reviews",
    piEarned: "π earned",
    viewProfile: "View profile",
    buyNow: "Buy now",
    contact: "Contact",
    share: "Share",
    save: "Save",
    dismiss: "Dismiss",
    refresh: "Refresh",
  },
  es: {
    greetings: "Hola",
    dashboard: "Tablero",
    online: "En línea",
    offline: "Desconectado",
    myFarm: "Mi granja",
    localMarket: "Mercado",
    farmerNetwork: "Red",
    knowledge: "Conocimiento",
    piWallet: "Billetera Pi",
    maps: "Geolocalización",
    weatherTitle: "Clima",
    weatherAdvice: "Consejo clima",
    alerts: "Alertas",
    noAlerts: "Sin alertas",
    nearbyFarmers: "Agricultores cerca",
    localProducts: "Productos locales",
    localServices: "Servicios cerca",
    viewAll: "Ver todo",
    searchPlaceholder: "Buscar producto...",
    distance: "Distancia",
    price: "Precio",
    available: "Disponible",
    unavailable: "No disponible",
    rating: "Puntuación",
    followers: "Seguidores",
    following: "Siguiendo",
    reviews: "Reseñas",
    piEarned: "π ganados",
    viewProfile: "Ver perfil",
    buyNow: "Comprar",
    contact: "Contactar",
    share: "Compartir",
    save: "Guardar",
    dismiss: "Descartar",
    refresh: "Actualizar",
  },
  pt: {
    greetings: "Olá",
    dashboard: "Painel",
    online: "Online",
    offline: "Offline",
    myFarm: "Minha fazenda",
    localMarket: "Mercado",
    farmerNetwork: "Rede",
    knowledge: "Conhecimento",
    piWallet: "Carteira Pi",
    maps: "Geolocalização",
    weatherTitle: "Clima",
    weatherAdvice: "Dica clima",
    alerts: "Alertas",
    noAlerts: "Sem alertas",
    nearbyFarmers: "Agricultores próximos",
    localProducts: "Produtos locais",
    localServices: "Serviços próximos",
    viewAll: "Ver tudo",
    searchPlaceholder: "Pesquisar produto...",
    distance: "Distância",
    price: "Preço",
    available: "Disponível",
    unavailable: "Indisponível",
    rating: "Avaliação",
    followers: "Seguidores",
    following: "Seguindo",
    reviews: "Avaliações",
    piEarned: "π ganhos",
    viewProfile: "Ver perfil",
    buyNow: "Comprar",
    contact: "Contatar",
    share: "Compartilhar",
    save: "Salvar",
    dismiss: "Dispensar",
    refresh: "Atualizar",
  },
}

export default function Dashboard({ currentLanguage, userRegion, onTabChange }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0)
  const [language, setLanguage] = useState(currentLanguage)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingUserStats, setIsLoadingUserStats] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { userData, isAuthenticated, refreshUserData } = usePiAuth()
  const [dismissedAlerts, setDismissedAlerts] = useLocalStorage<string[]>("dismissedAlerts", [])
  const [favoriteProducts, setFavoriteProducts] = useLocalStorage<string[]>("favoriteProducts", [])
  const [userStats, setUserStats] = useLocalStorage("userStats", {
    followers: 1247,
    following: 89,
    rating: 4.9,
    reviews: 234,
    piEarned: 12.5847,
  })
  const debouncedSearch = useDebounce(searchQuery, 300)

  const t = translations[language as keyof typeof translations] || translations.fr

  // États pour les données dynamiques
  const [weatherData, setWeatherData] = useState({
    temperature: 32,
    condition: "Ensoleillé",
    icon: "☀️",
    humidity: 45,
    windSpeed: 12,
    advice: "Temps idéal pour les travaux de récolte",
    forecast: [
      { day: "Aujourd'hui", temp: 32, icon: "☀️", condition: "Ensoleillé", advice: "Parfait pour la récolte" },
      { day: "Demain", temp: 29, icon: "⛅", condition: "Nuageux", advice: "Bon moment pour les semis" },
      { day: "Après-demain", temp: 27, icon: "🌧️", condition: "Pluie", advice: "Évitez les pulvérisations" },
    ],
  })

  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  const [alerts] = useState([
    { id: "1", type: "weather", priority: "high", title: "Pluies importantes prévues", message: "Fortes pluies attendues demain après-midi", icon: "🌧️", actionable: true },
    { id: "2", type: "season", priority: "medium", title: "Période de semis optimale", message: "C'est le moment idéal pour semer le maïs", icon: "🌱", actionable: true },
    { id: "3", type: "market", priority: "low", title: "Hausse des prix", message: "Le prix du maïs a augmenté de 15%", icon: "📈", actionable: true },
  ])

  const [nearbyUsers] = useState([
    { id: "1", name: "Koffi Asante", distance: 2.3, specialty: "Maraîchage bio", online: true, rating: 4.8, verified: true },
    { id: "2", name: "Aminata Traoré", distance: 5.1, specialty: "Aviculture moderne", online: false, rating: 4.9, verified: true },
    { id: "3", name: "Ibrahim Sawadogo", distance: 8.7, specialty: "Céréales", online: true, rating: 4.6, verified: false },
  ])

  const [localProducts, setLocalProducts] = useState([
    { id: "1", name: "Mangues Kent", pricePi: 0.5, unit: "kg", seller: "Fatou Kaboré", distance: 1.8, available: true, category: "fruits", image: "🥭" },
    { id: "2", name: "Engrais NPK", pricePi: 25, unit: "sac 50kg", seller: "Coopérative YELEN", distance: 3.2, available: true, category: "intrants", image: "🌾" },
    { id: "3", name: "Poules pondeuses", pricePi: 3.5, unit: "unité", seller: "Moussa Koné", distance: 6.5, available: false, category: "animaux", image: "🐔" },
    { id: "4", name: "Semences maïs", pricePi: 8, unit: "kg", seller: "INERA", distance: 4.2, available: true, category: "semences", image: "🌽" },
    { id: "5", name: "Tomates fraîches", pricePi: 0.3, unit: "kg", seller: "Mariam Diallo", distance: 2.5, available: true, category: "legumes", image: "🍅" },
    { id: "6", name: "Miel local", pricePi: 2.5, unit: "500g", seller: "Apiculteurs du Sahel", distance: 12.3, available: true, category: "produits", image: "🍯" },
  ])

  const [localServices] = useState([
    { id: "1", name: "Location tracteur", provider: "Coopérative Mécanisation", distance: 10.5, pricePi: 15, available: true, category: "équipement" },
    { id: "2", name: "Transport produits", provider: "Transport Sahel", distance: 7.8, pricePi: 0.1, unit: "kg", available: true, category: "logistique" },
    { id: "3", name: "Consultation vétérinaire", provider: "Dr. Aminata Traoré", distance: 5.1, pricePi: 0.008, available: false, category: "conseil" },
  ])

  const quickAccessModules = useMemo(() => [
    { id: "exploitation", title: t.myFarm, icon: "🏡", color: "bg-green-500", tab: "aviculture" },
    { id: "market", title: t.localMarket, icon: "🏪", color: "bg-blue-500", tab: "services" },
    { id: "network", title: t.farmerNetwork, icon: "👥", color: "bg-purple-500", tab: "messages" },
    { id: "knowledge", title: t.knowledge, icon: "📚", color: "bg-orange-500", tab: "regional" },
    { id: "wallet", title: t.piWallet, icon: "💰", color: "bg-yellow-500", tab: "wallet" },
    { id: "analytics", title: t.maps, icon: "🗺️", color: "bg-indigo-500", tab: "geolocation" },
  ], [t])

  const languageOptions = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
  ]

  // Rafraîchir toutes les données
  const refreshAllData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setIsRefreshing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      // Mettre à jour les données simulées
      setWeatherData(prev => ({
        ...prev,
        temperature: Math.floor(25 + Math.random() * 15),
        humidity: Math.floor(30 + Math.random() * 50),
      }))
      showToast("Données actualisées", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline])

  // Charger les statistiques utilisateur
  const fetchUserStats = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return
    
    setIsLoadingUserStats(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      // Simuler des données
      setUserStats({
        followers: Math.floor(1000 + Math.random() * 500),
        following: Math.floor(50 + Math.random() * 100),
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(100 + Math.random() * 300),
        piEarned: 5 + Math.random() * 20,
      })
    } catch (error) {
      console.error("Erreur chargement stats:", error)
    } finally {
      setIsLoadingUserStats(false)
    }
  }, [isAuthenticated, isOnline, setUserStats])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (isOnline && isAuthenticated) {
      fetchUserStats()
    }
  }, [isOnline, isAuthenticated, fetchUserStats])

  useEffect(() => {
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 60000)
    const adviceTimer = setInterval(() => {
      setCurrentAdviceIndex((prev) => (prev + 1) % weatherData.forecast.length)
    }, 10000)
    return () => {
      clearInterval(timeTimer)
      clearInterval(adviceTimer)
    }
  }, [weatherData.forecast.length])

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const currentAdvice = weatherData.forecast[currentAdviceIndex]

  const handleLanguageChange = (code: string) => {
    setLanguage(code)
    localStorage.setItem("language", code)
  }

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id))

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId])
  }

  const handleToggleFavorite = (productId: string) => {
    if (favoriteProducts.includes(productId)) {
      setFavoriteProducts(favoriteProducts.filter(id => id !== productId))
    } else {
      setFavoriteProducts([...favoriteProducts, productId])
    }
  }

  // Filtrer les produits par recherche
  const filteredProducts = localProducts.filter(product =>
    product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    product.seller.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 3)

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      {/* Header avec statut réseau */}
      <Card className={`bg-gradient-to-r from-green-600 to-blue-700 text-white ${!isOnline ? "opacity-95" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-sm">{userRegion}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isOnline ? (
                <div className="flex items-center gap-1 bg-green-500/20 rounded-full px-2 py-0.5">
                  <Wifi className="h-3 w-3 text-green-300" />
                  <span className="text-xs">{t.online}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-red-500/20 rounded-full px-2 py-0.5">
                  <WifiOff className="h-3 w-3 text-red-300" />
                  <span className="text-xs">{t.offline}</span>
                </div>
              )}

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 px-2"
                onClick={refreshAllData}
                disabled={isRefreshing || !isOnline}
              >
                {isRefreshing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-8 gap-1 px-2">
                    <Globe className="h-3.5 w-3.5" />
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {languageOptions.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {language === lang.code && <Check className="h-4 w-4 ml-auto text-green-600" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2 h-8 w-8" onClick={() => onTabChange("profile")}>
                <User className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <div className="text-base md:text-lg font-bold">
              {t.greetings} {userData?.username?.split(" ")[0] || "Agriculteur"} ! 👋
            </div>
            <div className="text-xs text-green-100 mt-1">{formatTime(currentTime)} • {t.dashboard}</div>
            {!isOnline && (
              <div className="mt-2 text-xs text-yellow-200 bg-yellow-500/20 rounded-lg p-1 inline-block px-3">
                📡 Mode hors ligne - Données en cache
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {quickAccessModules.map((module) => (
          <Button
            key={module.id}
            variant="outline"
            className="flex flex-col h-auto py-3 gap-1 hover:border-green-500 hover:bg-green-50 transition-all"
            onClick={() => onTabChange(module.tab)}
          >
            <span className="text-2xl">{module.icon}</span>
            <span className="text-xs font-medium">{module.title}</span>
          </Button>
        ))}
      </div>

      {/* Météo et conseils */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              {t.weatherTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <span className="text-4xl">{weatherData.icon}</span>
                <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
                <div className="text-sm text-gray-500">{weatherData.condition}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>Humidité: {weatherData.humidity}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span>Vent: {weatherData.windSpeed} km/h</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{t.weatherAdvice}:</span>
                <span className="text-sm text-gray-600">{currentAdvice.advice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              {t.alerts}
              {visibleAlerts.length > 0 && (
                <Badge variant="secondary" className="ml-2">{visibleAlerts.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visibleAlerts.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">{t.noAlerts}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleAlerts.slice(0, 2).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg ${
                    alert.priority === "high" ? "bg-red-50 border border-red-200" :
                    alert.priority === "medium" ? "bg-yellow-50 border border-yellow-200" :
                    "bg-blue-50 border border-blue-200"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{alert.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs text-gray-600">{alert.message}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDismissAlert(alert.id)}
                      >
                        <span className="sr-only">Fermer</span>
                        ✕
                      </Button>
                    </div>
                    {alert.actionable && (
                      <Button variant="link" size="sm" className="text-xs p-0 h-auto mt-1">
                        En savoir plus →
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cartes de statistiques utilisateur */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{isLoadingUserStats ? "..." : userStats.followers.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{t.followers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <User className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{userStats.following}</p>
            <p className="text-xs text-gray-500">{t.following}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{userStats.rating}</p>
            <p className="text-xs text-gray-500">{t.rating}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <MessageSquare className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{userStats.reviews}</p>
            <p className="text-xs text-gray-500">{t.reviews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Pi className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{userStats.piEarned.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{t.piEarned}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche de produits */}
      <div className="relative">
        <Input
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Produits locaux */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            {t.localProducts}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowAllProducts(!showAllProducts)}>
            {showAllProducts ? "Voir moins" : t.viewAll}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingProducts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {displayedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{product.image}</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{product.seller}</span>
                        <span>📍 {product.distance} km</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{product.pricePi} π / {product.unit}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {product.available ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">{t.available}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">{t.unavailable}</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => handleToggleFavorite(product.id)}
                      >
                        <Heart className={`h-3.5 w-3.5 ${favoriteProducts.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agriculteurs à proximité */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            {t.nearbyFarmers}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nearbyUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    {user.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-medium">{user.name}</p>
                      {user.verified && <Check className="h-3 w-3 text-blue-500" />}
                    </div>
                    <p className="text-xs text-gray-500">{user.specialty}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{user.rating}</span>
                      <span className="text-xs text-gray-400">• {user.distance} km</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {t.contact}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Citation inspirante du jour */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium text-amber-800">Citation du jour</p>
              <p className="text-sm text-amber-700 italic">
                "L'agriculture n'est pas seulement une affaire de culture, c'est aussi une affaire de cœur et de persévérance."
              </p>
              <p className="text-xs text-amber-600 mt-1">— Proverbe paysan</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}