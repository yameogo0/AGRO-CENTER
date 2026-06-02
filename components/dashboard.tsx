"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
  Loader2,
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
import { formatPiAmount, formatRelativeTime, formatDistance, showToast } from "@/lib/utils"

interface DashboardProps {
  currentLanguage: string
  userRegion: string
  onTabChange: (tab: string) => void
}

// Traductions (à garder identiques)
const translations = { /* ... vos traductions ... */ }

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

  // États pour les données dynamiques avec fallback
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
        setWeatherData(prev => ({
          temperature: data.temperature ?? prev.temperature,
          condition: data.condition ?? prev.condition,
          icon: data.icon ?? prev.icon,
          humidity: data.humidity ?? prev.humidity,
          windSpeed: data.windSpeed ?? prev.windSpeed,
          advice: data.advice ?? prev.advice,
          forecast: data.forecast ?? prev.forecast,
        }))
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
    
    setIsLoadingUserStats(true)
    try {
      const { data } = await userApi.getStats()
      if (data) {
        setUserStats({
          followers: data.followers ?? userStats.followers,
          following: data.following ?? userStats.following,
          rating: data.rating ?? userStats.rating,
          reviews: data.reviews ?? userStats.reviews,
          piEarned: data.piEarned ?? userStats.piEarned,
        })
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error)
    } finally {
      setIsLoadingUserStats(false)
    }
  }, [isAuthenticated, isOnline, userStats])

  // Rafraîchir toutes les données
  const refreshAllData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setIsRefreshing(true)
    try {
      await Promise.all([
        fetchWeatherData(),
        fetchProducts(),
        fetchUserStats(),
        refreshUserData(),
      ])
      showToast("Données actualisées", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline, fetchWeatherData, fetchProducts, fetchUserStats, refreshUserData])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (isOnline) {
      fetchWeatherData()
      fetchProducts()
      if (isAuthenticated) {
        fetchUserStats()
      }
    }
  }, [isOnline, isAuthenticated, fetchWeatherData, fetchProducts, fetchUserStats])

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

  // Afficher un loader pendant le chargement initial
  if (isLoadingWeather && !weatherData.temperature) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
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
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
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
                📡 Mode hors ligne - Données en cache
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alertes et météo (identique à l'original) */}
      {/* ... garder le reste du JSX identique ... */}
    </div>
  )
}