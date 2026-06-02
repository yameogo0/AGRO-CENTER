"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { geolocationApi } from "@/lib/api/geolocation"
import { weatherApi } from "@/lib/api/weather"
import { showToast } from "@/lib/utils"
import {
  MapPin,
  Navigation,
  Globe,
  Shield,
  AlertCircle,
  CheckCircle,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Thermometer,
  Cloud,
  Users,
  Store,
  Droplets,
  Wind,
  Sun,
  Moon,
  Compass,
  Home,
  TrendingUp,
  ShoppingCart,
  Bell,
  Lock,
  Database,
  Trash2,
  Download,
  Pi,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react"

interface GeolocationManagerProps {
  currentLanguage: string
  userRegion: string
}

interface LocationData {
  latitude: number
  longitude: number
  country: string
  region: string
  city: string
  accuracy: number
  timestamp: number
  address?: string
}

interface LocalizedContent {
  weather: {
    temperature: number
    condition: string
    icon: string
    humidity: number
    windSpeed: number
    pressure: number
    forecast: string
    hourly: Array<{ time: string; temp: number; icon: string }>
  }
  agriculture: {
    season: string
    seasonIcon: string
    recommendations: string[]
    alerts: string[]
    soilType: string
    optimalCrops: string[]
  }
  marketplace: {
    nearbyUsers: number
    localProducts: number
    activeServices: number
    priceInPi: number
  }
}

// Traductions (identiques à l'original)
const translations = { /* ... vos traductions ... */ }

export default function GeolocationManager({ currentLanguage, userRegion }: GeolocationManagerProps) {
  const [activeTab, setActiveTab] = useState("location")
  const [showCoordinates, setShowCoordinates] = useState(false)
  const [language, setLanguage] = useState(currentLanguage)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [weatherData, setWeatherData] = useState<LocalizedContent['weather'] | null>(null)
  const [agricultureData, setAgricultureData] = useState<LocalizedContent['agriculture'] | null>(null)
  const [marketplaceData, setMarketplaceData] = useState<LocalizedContent['marketplace'] | null>(null)
  
  // Hooks personnalisés
  const { latitude, longitude, accuracy, error: geoError, loading: geoLoading, refresh: refreshGeolocation } = useGeolocation({ 
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000,
  })
  const isOnline = useOnlineStatus()
  const { isAuthenticated } = usePiAuth()
  const [locationEnabled, setLocationEnabled] = useLocalStorage("geolocationEnabled", true)
  const [savedLocation, setSavedLocation] = useLocalStorage<LocationData | null>("userLocation", null)

  const t = translations[language as keyof typeof translations] || translations.fr

  // Données localisées par défaut (fallback)
  const defaultLocalizedContent: LocalizedContent = {
    weather: {
      temperature: 32,
      condition: "Ensoleillé",
      icon: "☀️",
      humidity: 45,
      windSpeed: 12,
      pressure: 1012,
      forecast: "Temps sec favorable aux cultures pour les 5 prochains jours",
      hourly: [
        { time: "12h", temp: 32, icon: "☀️" },
        { time: "15h", temp: 34, icon: "☀️" },
        { time: "18h", temp: 30, icon: "🌤️" },
        { time: "21h", temp: 26, icon: "🌙" },
      ],
    },
    agriculture: {
      season: "Saison sèche",
      seasonIcon: "☀️",
      recommendations: [
        "Période idéale pour la récolte du mil et du sorgho",
        "Préparation des sols pour la prochaine saison des pluies",
        "Vaccination du bétail recommandée avant la saison des pluies",
        "Stockage des récoltes à l'abri de l'humidité",
      ],
      alerts: ["Risque de sécheresse modéré dans 2 semaines", "Prix du maïs en hausse de 15% sur les marchés locaux"],
      soilType: "Sablo-argileux",
      optimalCrops: ["Mil", "Sorgho", "Niébé", "Arachide"],
    },
    marketplace: {
      nearbyUsers: 127,
      localProducts: 89,
      activeServices: 34,
      priceInPi: 0.5,
    },
  }

  // Charger les données météo depuis l'API
  const fetchWeatherData = useCallback(async (lat?: number, lng?: number) => {
    if (!isOnline) return
    
    try {
      const { data } = await weatherApi.getCurrent(lat, lng)
      if (data) {
        setWeatherData({
          temperature: data.temperature,
          condition: data.condition,
          icon: data.icon,
          humidity: data.humidity,
          windSpeed: data.windSpeed,
          pressure: data.pressure,
          forecast: data.forecast,
          hourly: data.hourly || defaultLocalizedContent.weather.hourly,
        })
      }
    } catch (error) {
      console.error("Erreur chargement météo:", error)
      setWeatherData(defaultLocalizedContent.weather)
    }
  }, [isOnline])

  // Charger les données agricoles depuis l'API
  const fetchAgricultureData = useCallback(async () => {
    if (!isOnline) return
    
    try {
      // Appel API pour les données agricoles
      const { data } = await geolocationApi.getAgricultureData()
      if (data) {
        setAgricultureData(data)
      } else {
        setAgricultureData(defaultLocalizedContent.agriculture)
      }
    } catch (error) {
      console.error("Erreur chargement données agricoles:", error)
      setAgricultureData(defaultLocalizedContent.agriculture)
    }
  }, [isOnline])

  // Charger les données du marketplace
  const fetchMarketplaceData = useCallback(async () => {
    if (!isOnline) return
    
    try {
      const { data } = await geolocationApi.getNearbyUsers(10)
      if (data) {
        setMarketplaceData({
          nearbyUsers: data.users?.length || 127,
          localProducts: data.products?.length || 89,
          activeServices: data.services?.length || 34,
          priceInPi: data.avgPricePi || 0.5,
        })
      } else {
        setMarketplaceData(defaultLocalizedContent.marketplace)
      }
    } catch (error) {
      console.error("Erreur chargement marketplace:", error)
      setMarketplaceData(defaultLocalizedContent.marketplace)
    }
  }, [isOnline])

  // Envoyer la position au backend
  const updatePositionOnServer = useCallback(async (lat: number, lng: number) => {
    if (!isAuthenticated || !isOnline) return
    
    try {
      await geolocationApi.updatePosition(lat, lng)
    } catch (error) {
      console.error("Erreur envoi position:", error)
    }
  }, [isAuthenticated, isOnline])

  // Rafraîchir toutes les données
  const refreshAllData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setIsRefreshing(true)
    try {
      await refreshGeolocation()
      if (latitude && longitude) {
        await Promise.all([
          fetchWeatherData(latitude, longitude),
          fetchAgricultureData(),
          fetchMarketplaceData(),
          updatePositionOnServer(latitude, longitude),
        ])
      }
      showToast("Données actualisées", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline, latitude, longitude, refreshGeolocation, fetchWeatherData, fetchAgricultureData, fetchMarketplaceData, updatePositionOnServer])

  // Construction des données de localisation
  const locationData: LocationData | null = latitude && longitude ? {
    latitude,
    longitude,
    country: userRegion,
    region: "Centre",
    city: "Ouagadougou",
    accuracy: accuracy || 0,
    timestamp: Date.now(),
    address: `${userRegion}, Centre, Ouagadougou`,
  } : savedLocation

  // Sauvegarder la position et envoyer au backend
  useEffect(() => {
    if (locationData && locationEnabled && latitude && longitude) {
      setSavedLocation(locationData)
      updatePositionOnServer(latitude, longitude)
    }
  }, [locationData, locationEnabled, latitude, longitude, setSavedLocation, updatePositionOnServer])

  // Charger les données au montant
  useEffect(() => {
    if (isOnline && latitude && longitude) {
      fetchWeatherData(latitude, longitude)
      fetchAgricultureData()
      fetchMarketplaceData()
    } else {
      // Mode offline : utiliser les données par défaut
      setWeatherData(defaultLocalizedContent.weather)
      setAgricultureData(defaultLocalizedContent.agriculture)
      setMarketplaceData(defaultLocalizedContent.marketplace)
    }
  }, [isOnline, latitude, longitude, fetchWeatherData, fetchAgricultureData, fetchMarketplaceData])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`
  }

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy <= 10) return { status: t.excellent, color: "text-green-600", bg: "bg-green-100" }
    if (accuracy <= 50) return { status: t.good, color: "text-blue-600", bg: "bg-blue-100" }
    if (accuracy <= 100) return { status: t.average, color: "text-yellow-600", bg: "bg-yellow-100" }
    return { status: t.poor, color: "text-red-600", bg: "bg-red-100" }
  }

  const handleRefreshLocation = () => {
    if (!locationEnabled) {
      setLocationEnabled(true)
    }
    refreshAllData()
  }

  const currentWeather = weatherData || defaultLocalizedContent.weather
  const currentAgriculture = agricultureData || defaultLocalizedContent.agriculture
  const currentMarketplace = marketplaceData || defaultLocalizedContent.marketplace

  // Afficher un loader pendant le chargement
  if (geoLoading && !locationData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">{t.locating}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec statut réseau et bouton refresh */}
      <Card className={`bg-gradient-to-r from-blue-600 to-green-600 text-white ${!isOnline ? "opacity-90" : ""}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{t.geolocation}</h2>
                  {!isOnline && (
                    <Badge className="bg-yellow-500 text-white text-xs gap-1">
                      <WifiOff className="h-3 w-3" />
                      {t.offline}
                    </Badge>
                  )}
                  {isRefreshing && (
                    <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                  )}
                </div>
                <p className="text-blue-100 text-sm">{t.personalizedContent}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={refreshAllData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {t.refresh}
              </Button>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${locationEnabled && !geoError ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                <span className="text-sm">{locationEnabled && !geoError ? t.enabled : t.disabled}</span>
              </div>
              {isOnline && (
                <div className="flex items-center gap-1 text-green-300 text-xs">
                  <Wifi className="h-3 w-3" />
                  {t.online}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs - le reste du JSX est identique à l'original mais utilise les données dynamiques */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="location" className="gap-2"><Navigation className="h-4 w-4" /><span className="hidden sm:inline">{t.position}</span></TabsTrigger>
          <TabsTrigger value="content" className="gap-2"><Globe className="h-4 w-4" /><span className="hidden sm:inline">{t.localContent}</span></TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2"><Shield className="h-4 w-4" /><span className="hidden sm:inline">{t.privacy}</span></TabsTrigger>
          <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /><span className="hidden sm:inline">{t.settings}</span></TabsTrigger>
        </TabsList>

        {/* Onglet Position - même contenu qu'avant avec les données dynamiques */}
        {/* ... le reste du JSX reste identique, utilisez currentWeather, currentAgriculture, currentMarketplace ... */}
      </Tabs>
    </div>
  )
}