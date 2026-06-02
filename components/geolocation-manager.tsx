"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { usePiAuth } from "@/contexts/pi-auth-context"
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
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sprout,
  Tractor,
  Leaf,
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

// Traductions multilingues
const translations: Record<string, any> = {
  fr: {
    geolocation: "Géolocalisation",
    personalizedContent: "Contenu personnalisé pour votre région",
    online: "En ligne",
    offline: "Hors ligne",
    enabled: "Activée",
    disabled: "Désactivée",
    refresh: "Actualiser",
    position: "Position",
    localContent: "Contenu local",
    privacy: "Confidentialité",
    settings: "Paramètres",
    locating: "Recherche de votre position...",
    excellent: "Excellent",
    good: "Bon",
    average: "Moyen",
    poor: "Faible",
    currentPosition: "Position actuelle",
    coordinates: "Coordonnées",
    accuracy: "Précision",
    country: "Pays",
    region: "Région",
    city: "Ville",
    lastUpdate: "Dernière mise à jour",
    shareLocation: "Partager ma position",
    locationShared: "Votre position est partagée avec les services locaux",
    locationNotShared: "Votre position n'est pas partagée",
    weather: "Météo",
    agriculture: "Agriculture",
    marketplace: "Marketplace",
    temperature: "Température",
    humidity: "Humidité",
    wind: "Vent",
    pressure: "Pression",
    forecast: "Prévisions",
    season: "Saison",
    soilType: "Type de sol",
    optimalCrops: "Cultures optimales",
    recommendations: "Recommandations",
    alerts: "Alertes",
    nearbyFarmers: "Agriculteurs proches",
    localProducts: "Produits locaux",
    activeServices: "Services actifs",
    avgPrice: "Prix moyen",
    privacyInfo: "Vos données de localisation sont sécurisées et utilisées uniquement pour personnaliser votre expérience.",
    deleteHistory: "Supprimer l'historique",
    exportData: "Exporter les données",
    permissionRequired: "Permission requise",
    enableService: "Activer le service",
  },
  en: {
    geolocation: "Geolocation",
    personalizedContent: "Content personalized for your region",
    online: "Online",
    offline: "Offline",
    enabled: "Enabled",
    disabled: "Disabled",
    refresh: "Refresh",
    position: "Position",
    localContent: "Local content",
    privacy: "Privacy",
    settings: "Settings",
    locating: "Locating your position...",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    poor: "Poor",
    currentPosition: "Current position",
    coordinates: "Coordinates",
    accuracy: "Accuracy",
    country: "Country",
    region: "Region",
    city: "City",
    lastUpdate: "Last update",
    shareLocation: "Share my location",
    locationShared: "Your location is shared with local services",
    locationNotShared: "Your location is not shared",
    weather: "Weather",
    agriculture: "Agriculture",
    marketplace: "Marketplace",
    temperature: "Temperature",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    forecast: "Forecast",
    season: "Season",
    soilType: "Soil type",
    optimalCrops: "Optimal crops",
    recommendations: "Recommendations",
    alerts: "Alerts",
    nearbyFarmers: "Nearby farmers",
    localProducts: "Local products",
    activeServices: "Active services",
    avgPrice: "Average price",
    privacyInfo: "Your location data is secure and only used to personalize your experience.",
    deleteHistory: "Delete history",
    exportData: "Export data",
    permissionRequired: "Permission required",
    enableService: "Enable service",
  },
  es: {
    geolocation: "Geolocalización",
    personalizedContent: "Contenido personalizado para su región",
    online: "En línea",
    offline: "Desconectado",
    enabled: "Activada",
    disabled: "Desactivada",
    refresh: "Actualizar",
    position: "Posición",
    localContent: "Contenido local",
    privacy: "Privacidad",
    settings: "Ajustes",
    locating: "Buscando su posición...",
    excellent: "Excelente",
    good: "Bueno",
    average: "Medio",
    poor: "Bajo",
    currentPosition: "Posición actual",
    coordinates: "Coordenadas",
    accuracy: "Precisión",
    country: "País",
    region: "Región",
    city: "Ciudad",
    lastUpdate: "Última actualización",
    shareLocation: "Compartir mi ubicación",
    locationShared: "Su ubicación está compartida",
    locationNotShared: "Su ubicación no está compartida",
    weather: "Clima",
    agriculture: "Agricultura",
    marketplace: "Mercado",
    temperature: "Temperatura",
    humidity: "Humedad",
    wind: "Viento",
    pressure: "Presión",
    forecast: "Pronóstico",
    season: "Temporada",
    soilType: "Tipo de suelo",
    optimalCrops: "Cultivos óptimos",
    recommendations: "Recomendaciones",
    alerts: "Alertas",
    nearbyFarmers: "Agricultores cercanos",
    localProducts: "Productos locales",
    activeServices: "Servicios activos",
    avgPrice: "Precio promedio",
    privacyInfo: "Sus datos de ubicación son seguros y solo se usan para personalizar su experiencia.",
    deleteHistory: "Eliminar historial",
    exportData: "Exportar datos",
    permissionRequired: "Permiso requerido",
    enableService: "Activar servicio",
  },
  pt: {
    geolocation: "Geolocalização",
    personalizedContent: "Conteúdo personalizado para sua região",
    online: "Online",
    offline: "Offline",
    enabled: "Ativada",
    disabled: "Desativada",
    refresh: "Atualizar",
    position: "Posição",
    localContent: "Conteúdo local",
    privacy: "Privacidade",
    settings: "Configurações",
    locating: "Localizando sua posição...",
    excellent: "Excelente",
    good: "Bom",
    average: "Médio",
    poor: "Baixo",
    currentPosition: "Posição atual",
    coordinates: "Coordenadas",
    accuracy: "Precisão",
    country: "País",
    region: "Região",
    city: "Cidade",
    lastUpdate: "Última atualização",
    shareLocation: "Compartilhar localização",
    locationShared: "Sua localização está compartilhada",
    locationNotShared: "Sua localização não está compartilhada",
    weather: "Clima",
    agriculture: "Agricultura",
    marketplace: "Mercado",
    temperature: "Temperatura",
    humidity: "Umidade",
    wind: "Vento",
    pressure: "Pressão",
    forecast: "Previsão",
    season: "Estação",
    soilType: "Tipo de solo",
    optimalCrops: "Culturas ideais",
    recommendations: "Recomendações",
    alerts: "Alertas",
    nearbyFarmers: "Agricultores próximos",
    localProducts: "Produtos locais",
    activeServices: "Serviços ativos",
    avgPrice: "Preço médio",
    privacyInfo: "Seus dados de localização são seguros e usados apenas para personalizar sua experiência.",
    deleteHistory: "Excluir histórico",
    exportData: "Exportar dados",
    permissionRequired: "Permissão necessária",
    enableService: "Ativar serviço",
  },
}

// Données par défaut pour le fallback
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

export default function GeolocationManager({ currentLanguage, userRegion }: GeolocationManagerProps) {
  const [activeTab, setActiveTab] = useState("location")
  const [showCoordinates, setShowCoordinates] = useState(false)
  const [language, setLanguage] = useState(currentLanguage)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [weatherData, setWeatherData] = useState<LocalizedContent['weather'] | null>(null)
  const [agricultureData, setAgricultureData] = useState<LocalizedContent['agriculture'] | null>(null)
  const [marketplaceData, setMarketplaceData] = useState<LocalizedContent['marketplace'] | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  
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
  const [locationHistory, setLocationHistory] = useLocalStorage<LocationData[]>("locationHistory", [])

  const t = translations[language as keyof typeof translations] || translations.fr

  // Charger les données météo simulées
  const fetchWeatherData = useCallback(async (lat?: number, lng?: number) => {
    if (!isOnline) {
      setWeatherData(defaultLocalizedContent.weather)
      return
    }
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500))
      setWeatherData({
        ...defaultLocalizedContent.weather,
        temperature: Math.floor(25 + Math.random() * 15),
        humidity: Math.floor(30 + Math.random() * 50),
        windSpeed: Math.floor(5 + Math.random() * 20),
      })
    } catch (error) {
      console.error("Erreur chargement météo:", error)
      setWeatherData(defaultLocalizedContent.weather)
    }
  }, [isOnline])

  // Charger les données agricoles simulées
  const fetchAgricultureData = useCallback(async () => {
    if (!isOnline) {
      setAgricultureData(defaultLocalizedContent.agriculture)
      return
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setAgricultureData(defaultLocalizedContent.agriculture)
    } catch (error) {
      console.error("Erreur chargement données agricoles:", error)
      setAgricultureData(defaultLocalizedContent.agriculture)
    }
  }, [isOnline])

  // Charger les données du marketplace simulées
  const fetchMarketplaceData = useCallback(async () => {
    if (!isOnline) {
      setMarketplaceData(defaultLocalizedContent.marketplace)
      return
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setMarketplaceData({
        nearbyUsers: Math.floor(50 + Math.random() * 150),
        localProducts: Math.floor(30 + Math.random() * 100),
        activeServices: Math.floor(10 + Math.random() * 50),
        priceInPi: 0.3 + Math.random() * 0.7,
      })
    } catch (error) {
      console.error("Erreur chargement marketplace:", error)
      setMarketplaceData(defaultLocalizedContent.marketplace)
    }
  }, [isOnline])

  // Envoyer la position au backend (simulé)
  const updatePositionOnServer = useCallback(async (lat: number, lng: number) => {
    if (!isAuthenticated || !isOnline) return
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 300))
      console.log("Position envoyée:", lat, lng)
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
        ])
      }
      showToast("Données actualisées", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline, latitude, longitude, refreshGeolocation, fetchWeatherData, fetchAgricultureData, fetchMarketplaceData])

  // Exporter les données de localisation
  const exportLocationData = useCallback(async () => {
    setIsExporting(true)
    try {
      const exportData = {
        currentLocation: locationData,
        history: locationHistory,
        preferences: { locationEnabled, userRegion, language },
        exportDate: new Date().toISOString(),
      }
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = `agro-location-data-${Date.now()}.json`
      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
      showToast("Données exportées avec succès", "success")
    } catch (error) {
      showToast("Erreur lors de l'export", "error")
    } finally {
      setIsExporting(false)
    }
  }, [locationData, locationHistory, locationEnabled, userRegion, language])

  // Supprimer l'historique
  const deleteHistory = useCallback(() => {
    setLocationHistory([])
    showToast("Historique supprimé", "success")
  }, [setLocationHistory])

  // Sauvegarder la position dans l'historique
  const saveToHistory = useCallback((location: LocationData) => {
    setLocationHistory(prev => [location, ...prev].slice(0, 50))
  }, [setLocationHistory])

  // Construction des données de localisation
  const locationData: LocationData | null = latitude && longitude ? {
    latitude,
    longitude,
    country: userRegion,
    region: userRegion,
    city: "Ouagadougou",
    accuracy: accuracy || 0,
    timestamp: Date.now(),
    address: `${userRegion}, Ouagadougou`,
  } : savedLocation

  // Sauvegarder la position et envoyer au backend
  useEffect(() => {
    if (locationData && locationEnabled && latitude && longitude) {
      setSavedLocation(locationData)
      saveToHistory(locationData)
      updatePositionOnServer(latitude, longitude)
    }
  }, [locationData, locationEnabled, latitude, longitude, setSavedLocation, updatePositionOnServer, saveToHistory])

  // Charger les données au montage
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(language === "fr" ? "fr-FR" : "en-US")
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

  // Si la géolocalisation est désactivée
  if (!locationEnabled) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t.permissionRequired}</h3>
            <p className="text-gray-500 text-sm mb-4">{t.privacyInfo}</p>
            <Button onClick={() => setLocationEnabled(true)} className="gap-2">
              <Globe className="h-4 w-4" />
              {t.enableService}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header avec statut réseau et bouton refresh */}
      <Card className={`bg-gradient-to-r from-blue-600 to-green-600 text-white ${!isOnline ? "opacity-90" : ""}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
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
            <div className="flex items-center gap-3 flex-wrap">
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="location" className="gap-2">
            <Navigation className="h-4 w-4" />
            <span className="hidden sm:inline">{t.position}</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{t.localContent}</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t.privacy}</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{t.settings}</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Position */}
        <TabsContent value="location" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carte de position */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {t.currentPosition}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {geoError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{geoError}</span>
                  </div>
                )}
                
                {locationData && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{t.coordinates}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={() => setShowCoordinates(!showCoordinates)}
                        >
                          {showCoordinates ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <code className="block bg-gray-100 p-2 rounded text-sm">
                        {showCoordinates 
                          ? formatCoordinates(locationData.latitude, locationData.longitude)
                          : "••••••••"}
                      </code>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">{t.accuracy}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{Math.round(locationData.accuracy)} m</span>
                          <Badge className={getAccuracyStatus(locationData.accuracy).bg}>
                            <span className={getAccuracyStatus(locationData.accuracy).color}>
                              {getAccuracyStatus(locationData.accuracy).status}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{t.lastUpdate}</p>
                        <p className="font-medium text-sm">{formatDate(locationData.timestamp)}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Home className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Adresse estimée</span>
                      </div>
                      <p className="text-sm text-gray-600">{locationData.address || `${locationData.city}, ${locationData.region}`}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Carte météo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  {t.weather}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <span className="text-5xl">{currentWeather.icon}</span>
                  <div className="text-3xl font-bold mt-1">{currentWeather.temperature}°C</div>
                  <p className="text-gray-500">{currentWeather.condition}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <Droplets className="h-4 w-4 mx-auto text-blue-500" />
                    <span className="text-xs">{currentWeather.humidity}%</span>
                    <p className="text-xs text-gray-500">{t.humidity}</p>
                  </div>
                  <div>
                    <Wind className="h-4 w-4 mx-auto text-gray-500" />
                    <span className="text-xs">{currentWeather.windSpeed} km/h</span>
                    <p className="text-xs text-gray-500">{t.wind}</p>
                  </div>
                  <div>
                    <Thermometer className="h-4 w-4 mx-auto text-red-500" />
                    <span className="text-xs">{currentWeather.pressure} hPa</span>
                    <p className="text-xs text-gray-500">{t.pressure}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">{currentWeather.forecast}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Contenu local */}
        <TabsContent value="content" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agriculture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  {t.agriculture}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentAgriculture.seasonIcon}</span>
                  <span className="font-semibold text-lg">{currentAgriculture.season}</span>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">{t.soilType}</p>
                  <p className="text-sm text-gray-600">{currentAgriculture.soilType}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">{t.optimalCrops}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentAgriculture.optimalCrops.map((crop, i) => (
                      <Badge key={i} variant="secondary" className="bg-green-100 text-green-700">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">{t.recommendations}</p>
                  <ul className="space-y-1">
                    {currentAgriculture.recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Alertes agricoles */}
                {currentAgriculture.alerts.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm font-medium text-yellow-800">{t.alerts}</p>
                    </div>
                    {currentAgriculture.alerts.map((alert, i) => (
                      <p key={i} className="text-xs text-yellow-700">{alert}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Marketplace */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Store className="h-5 w-5 text-orange-600" />
                  {t.marketplace}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                      <p className="text-2xl font-bold text-blue-700">{currentMarketplace.nearbyUsers}</p>
                      <p className="text-xs text-gray-600">{t.nearbyFarmers}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <ShoppingCart className="h-6 w-6 mx-auto text-green-600 mb-1" />
                      <p className="text-2xl font-bold text-green-700">{currentMarketplace.localProducts}</p>
                      <p className="text-xs text-gray-600">{t.localProducts}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Store className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                      <p className="text-2xl font-bold text-purple-700">{currentMarketplace.activeServices}</p>
                      <p className="text-xs text-gray-600">{t.activeServices}</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Pi className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
                      <p className="text-2xl font-bold text-yellow-700">{currentMarketplace.priceInPi} π</p>
                      <p className="text-xs text-gray-600">{t.avgPrice}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => onTabChange("services")}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Explorer le marketplace local
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Confidentialité */}
        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                {t.privacy}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.shareLocation}</p>
                  <p className="text-sm text-gray-500">{locationEnabled ? t.locationShared : t.locationNotShared}</p>
                </div>
                <Switch 
                  checked={locationEnabled} 
                  onCheckedChange={setLocationEnabled}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t.privacyInfo}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Vos données ne sont jamais vendues à des tiers. Vous pouvez désactiver le partage à tout moment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-sm mb-3">Historique des positions ({locationHistory.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {locationHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">Aucun historique</p>
                  ) : (
                    locationHistory.slice(0, 5).map((loc, i) => (
                      <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                        <span>{formatDate(loc.timestamp)}</span>
                        <span className="text-gray-500">{loc.address || `${loc.city}, ${loc.region}`}</span>
                      </div>
                    ))
                  )}
                </div>
                {locationHistory.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="gap-2" onClick={deleteHistory}>
                      <Trash2 className="h-4 w-4" />
                      {t.deleteHistory}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={exportLocationData}
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      {t.exportData}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                {t.settings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Haute précision</p>
                  <p className="text-sm text-gray-500">Utiliser le GPS pour une meilleure précision</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mise à jour automatique</p>
                  <p className="text-sm text-gray-500">Actualiser la position automatiquement</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications locales</p>
                  <p className="text-sm text-gray-500">Recevoir des alertes basées sur votre région</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">Langue de l'interface</p>
                <select 
                  className="mt-1 w-full p-2 border rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}