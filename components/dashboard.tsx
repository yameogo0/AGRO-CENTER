"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { weatherApi } from "@/lib/api/weather"
import { formatPiAmount, formatRelativeTime, formatDistance } from "@/lib/utils"

interface DashboardProps {
  currentLanguage: string
  userRegion: string
  onTabChange: (tab: string) => void
}

// Traductions multilingues (idem à l'original)
const translations = { /* ... vos traductions ... */ }

export default function Dashboard({ currentLanguage, userRegion, onTabChange }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0)
  const [language, setLanguage] = useState(currentLanguage)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { userData, isAuthenticated } = usePiAuth()
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

  // État pour les données dynamiques
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
  ])

  const [localServices] = useState([
    { id: "1", name: "Location tracteur", provider: "Coopérative Mécanisation", distance: 10.5, pricePi: 15, available: true, category: "équipement" },
    { id: "2", name: "Transport produits", provider: "Transport Sahel", distance: 7.8, pricePi: 0.1, unit: "kg", available: true, category: "logistique" },
    { id: "3", name: "Consultation vétérinaire", provider: "Dr. Aminata Traoré", distance: 5.1, pricePi: 0.008, available: false, category: "conseil" },
  ])

  const quickAccessModules = [
    { id: "exploitation", title: t.myFarm, icon: "🏡", color: "bg-green-500", tab: "aviculture" },
    { id: "market", title: t.localMarket, icon: "🏪", color: "bg-blue-500", tab: "services" },
    { id: "network", title: t.farmerNetwork, icon: "👥", color: "bg-purple-500", tab: "messages" },
    { id: "knowledge", title: t.knowledge, icon: "📚", color: "bg-orange-500", tab: "regional" },
    { id: "wallet", title: t.piWallet, icon: "💰", color: "bg-yellow-500", tab: "wallet" },
    { id: "analytics", title: t.maps, icon: "🗺️", color: "bg-indigo-500", tab: "geolocation" },
  ]

  const languageOptions = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "dioula", name: "Dioula", flag: "🌍" },
    { code: "mooré", name: "Mooré", flag: "🌾" },
  ]

  // Charger les données météo
  const fetchWeatherData = useCallback(async () => {
    if (!isOnline) return
    
    setIsLoadingWeather(true)
    try {
      const { data } = await weatherApi.getCurrent()
      if (data) {
        setWeatherData({
          temperature: data.temperature,
          condition: data.condition,
          icon: data.icon,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          advice: data.advice,
          forecast: data.forecast || weatherData.forecast,
        })
      }
    } catch (error) {
      console.error("Erreur chargement météo:", error)
    } finally {
      setIsLoadingWeather(false)
    }
  }, [isOnline])

  // Charger les produits depuis l'API
  const fetchProducts = useCallback(async () => {
    if (!isOnline) return
    
    setIsLoadingProducts(true)
    try {
      const { data } = await servicesApi.getAll({ limit: 10 })
      if (data && data.length > 0) {
        const formattedProducts = data.map((service: any) => ({
          id: service.id,
          name: service.title,
          pricePi: service.price,
          unit: service.duration || "service",
          seller: service.provider?.name || "Prestataire",
          distance: Math.random() * 10,
          available: service.availability === "available",
          category: service.category,
          image: getCategoryIcon(service.category),
        }))
        setLocalProducts(formattedProducts)
      }
    } catch (error) {
      console.error("Erreur chargement produits:", error)
    } finally {
      setIsLoadingProducts(false)
    }
  }, [isOnline])

  // Charger les statistiques utilisateur
  const fetchUserStats = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return
    
    try {
      const { data } = await userApi.getStats()
      if (data) {
        setUserStats({
          followers: data.followers || userStats.followers,
          following: data.following || userStats.following,
          rating: data.rating || userStats.rating,
          reviews: data.reviews || userStats.reviews,
          piEarned: data.piEarned || userStats.piEarned,
        })
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error)
    }
  }, [isAuthenticated, isOnline])

  // Rafraîchir toutes les données
  const refreshAllData = async () => {
    setIsRefreshing(true)
    await Promise.all([
      fetchWeatherData(),
      fetchProducts(),
      fetchUserStats(),
    ])
    setIsRefreshing(false)
  }

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (isOnline) {
      refreshAllData()
    }
  }, [isOnline])

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

  // Obtenir l'icône par catégorie
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      fruits: "🍎",
      legumes: "🥕",
      intrants: "🌾",
      animaux: "🐔",
      semences: "🌽",
      default: "📦",
    }
    return icons[category] || icons.default
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header avec statut réseau et bouton refresh */}
      <Card className={`bg-gradient-to-r from-green-600 to-blue-700 text-white ${!isOnline ? "opacity-95" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-sm">{userRegion}</span>
            </div>
            <div className="flex items-center gap-3">
              {isOnline ? (
                <div className="flex items-center gap-1">
                  <Wifi className="h-4 w-4 text-green-300" />
                  <span className="text-xs">{t.online}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <WifiOff className="h-4 w-4 text-red-300" />
                  <span className="text-xs">{t.offline}</span>
                </div>
              )}

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={refreshAllData}
                disabled={isRefreshing || !isOnline}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 gap-1">
                    <Globe className="h-4 w-4" />
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

              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2" onClick={() => onTabChange("profile")}>
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold">
              {t.greetings} {userData?.username?.split(" ")[0] || "Agriculteur"} ! 👋
            </div>
            <div className="text-sm text-green-100">{formatTime(currentTime)} • {t.dashboard}</div>
            {!isOnline && (
              <div className="mt-2 text-xs text-yellow-200 bg-yellow-500/20 rounded-lg p-1">
                Mode hors ligne - Données en cache
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alertes et météo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Bell className="h-5 w-5 mr-2" />
            {t.alerts} & {t.tips}
            {dismissedAlerts.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {visibleAlerts.length}/{alerts.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Météo */}
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{weatherData.icon}</div>
                <div>
                  <div className="font-bold text-xl">{weatherData.temperature}°C</div>
                  <div className="text-sm text-gray-600">{weatherData.condition}</div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <div className="flex items-center"><Droplets className="h-3 w-3 mr-1" />{weatherData.humidity}%</div>
                    <div className="flex items-center"><Wind className="h-3 w-3 mr-1" />{weatherData.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-800 mb-2">{t.forecast}</div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="p-1" onClick={() => setCurrentAdviceIndex((prev) => (prev - 1 + 3) % 3)}>
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <div className="text-center min-w-[70px]">
                    <div className="text-2xl">{currentAdvice.icon}</div>
                    <div className="text-xs font-medium">{currentAdvice.temp}°</div>
                    <div className="text-xs text-gray-600">{currentAdvice.day}</div>
                  </div>
                  <Button size="sm" variant="ghost" className="p-1" onClick={() => setCurrentAdviceIndex((prev) => (prev + 1) % 3)}>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-2 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">{t.tips}:</p>
              </div>
              <p className="text-sm text-green-700 mt-1">{currentAdvice.advice}</p>
            </div>
          </div>

          {/* Alertes avec bouton masquer */}
          <div className="space-y-2">
            {visibleAlerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className="p-3 border-l-4 border-l-red-500 bg-red-50 rounded-r-lg group relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{alert.icon}</span>
                    <span className="font-medium text-sm">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.actionable && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      <span className="text-xs text-gray-400">✕</span>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            ))}
          </div>

          {dismissedAlerts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-gray-400"
              onClick={() => setDismissedAlerts([])}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {t.show} {dismissedAlerts.length} alertes masquées
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Statistiques utilisateur */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTabChange("profile")}>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{userStats.followers.toLocaleString()}</div>
            <div className="text-xs text-gray-500">{t.followers}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTabChange("profile")}>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-green-600">{userStats.following}</div>
            <div className="text-xs text-gray-500">{t.following}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTabChange("services")}>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <span className="text-xl font-bold text-yellow-600">{userStats.rating}</span>
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>
            <div className="text-xs text-gray-500">{userStats.reviews} {t.reviewsCount}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onTabChange("wallet")}>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <Pi className="h-4 w-4 text-purple-600" />
              <span className="text-xl font-bold text-purple-600">{userStats.piEarned.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500">{t.totalEarnings}</div>
          </CardContent>
        </Card>
      </div>

      {/* Accès rapide */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Activity className="h-5 w-5 mr-2" />
            {t.quickAccess}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickAccessModules.map((module) => (
              <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => onTabChange(module.tab)}>
                <CardContent className="p-3 text-center">
                  <div className="text-3xl mb-1">{module.icon}</div>
                  <h3 className="font-semibold text-xs">{module.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Réseau à proximité - (le reste du code identique à l'original) */}
      {/* ... garder le reste du JSX identique ... */}
    </div>
  )
}