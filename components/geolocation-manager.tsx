"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
const translations = {
  fr: {
    geolocation: "Géolocalisation",
    personalizedContent: "Contenu personnalisé selon votre position",
    enabled: "Activé",
    disabled: "Désactivé",
    position: "Position",
    localContent: "Contenu Local",
    privacy: "Confidentialité",
    settings: "Paramètres",
    currentLocation: "Position Actuelle",
    refresh: "Actualiser",
    country: "Pays",
    region: "Région",
    city: "Ville",
    coordinates: "Coordonnées",
    accuracy: "Précision",
    lastUpdate: "Dernière MAJ",
    locationNotAvailable: "Position non disponible",
    getMyPosition: "Obtenir ma position",
    locating: "Localisation...",
    benefits: "Avantages de la Géolocalisation",
    climateAdvice: "Conseils Climatiques",
    localNetwork: "Réseau Local",
    regionalMarketplace: "Marketplace Régional",
    weatherAlerts: "Alertes Météo",
    localWeather: "Météo Locale",
    humidity: "Humidité",
    wind: "Vent",
    pressure: "Pression",
    agriculturalAdvice: "Conseils Agricoles",
    season: "Saison",
    soilType: "Type de sol",
    optimalCrops: "Cultures optimales",
    localMarketplace: "Marketplace Local",
    usersNearby: "Utilisateurs à proximité",
    localProducts: "Produits locaux",
    activeServices: "Services actifs",
    avgPricePi: "Prix moyen",
    dataProtection: "Protection de vos Données",
    ourCommitments: "Nos Engagements RGPD",
    encryption: "Chiffrement de bout en bout",
    noSharing: "Aucun partage sans consentement",
    rightToErase: "Droit à l'effacement",
    transparency: "Transparence totale",
    dataUsage: "Utilisation de vos Données de Localisation",
    personalizedAdvice: "Conseils agricoles personnalisés",
    localConnections: "Connexions locales",
    localAlerts: "Alertes météo locales",
    yourRights: "Vos Droits",
    accessData: "Accès à toutes vos données",
    rectification: "Rectification des informations",
    deletion: "Suppression de votre compte",
    portability: "Portabilité de vos données",
    objection: "Opposition au traitement",
    geolocationSettings: "Paramètres de Géolocalisation",
    autoGeolocation: "Géolocalisation automatique",
    highAccuracy: "Précision élevée",
    autoUpdate: "Mise à jour automatique",
    positionSharing: "Partage de position",
    positionHistory: "Historique des positions",
    dataActions: "Actions sur les Données",
    viewAllData: "Voir toutes mes données",
    exportData: "Exporter mes données",
    deleteAllData: "Supprimer toutes mes données",
    excellent: "Excellente",
    good: "Bonne",
    average: "Moyenne",
    poor: "Faible",
  },
  en: {
    geolocation: "Geolocation",
    personalizedContent: "Personalized content based on your location",
    enabled: "Enabled",
    disabled: "Disabled",
    position: "Location",
    localContent: "Local Content",
    privacy: "Privacy",
    settings: "Settings",
    currentLocation: "Current Location",
    refresh: "Refresh",
    country: "Country",
    region: "Region",
    city: "City",
    coordinates: "Coordinates",
    accuracy: "Accuracy",
    lastUpdate: "Last update",
    locationNotAvailable: "Location not available",
    getMyPosition: "Get my position",
    locating: "Locating...",
    benefits: "Geolocation Benefits",
    climateAdvice: "Climate Advice",
    localNetwork: "Local Network",
    regionalMarketplace: "Regional Marketplace",
    weatherAlerts: "Weather Alerts",
    localWeather: "Local Weather",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    agriculturalAdvice: "Agricultural Advice",
    season: "Season",
    soilType: "Soil type",
    optimalCrops: "Optimal crops",
    localMarketplace: "Local Marketplace",
    usersNearby: "Users nearby",
    localProducts: "Local products",
    activeServices: "Active services",
    avgPricePi: "Avg price",
    dataProtection: "Data Protection",
    ourCommitments: "Our GDPR Commitments",
    encryption: "End-to-end encryption",
    noSharing: "No sharing without consent",
    rightToErase: "Right to erasure",
    transparency: "Full transparency",
    dataUsage: "Use of your Location Data",
    personalizedAdvice: "Personalized agricultural advice",
    localConnections: "Local connections",
    localAlerts: "Local weather alerts",
    yourRights: "Your Rights",
    accessData: "Access to all your data",
    rectification: "Correction of information",
    deletion: "Account deletion",
    portability: "Data portability",
    objection: "Right to object",
    geolocationSettings: "Geolocation Settings",
    autoGeolocation: "Automatic geolocation",
    highAccuracy: "High accuracy",
    autoUpdate: "Automatic update",
    positionSharing: "Position sharing",
    positionHistory: "Position history",
    dataActions: "Data Actions",
    viewAllData: "View all my data",
    exportData: "Export my data",
    deleteAllData: "Delete all my data",
    excellent: "Excellent",
    good: "Good",
    average: "Average",
    poor: "Poor",
  },
  es: {
    geolocation: "Geolocalización",
    personalizedContent: "Contenido personalizado según tu ubicación",
    enabled: "Activado",
    disabled: "Desactivado",
    position: "Ubicación",
    localContent: "Contenido Local",
    privacy: "Privacidad",
    settings: "Configuración",
    currentLocation: "Ubicación Actual",
    refresh: "Actualizar",
    country: "País",
    region: "Región",
    city: "Ciudad",
    coordinates: "Coordenadas",
    accuracy: "Precisión",
    lastUpdate: "Última actualización",
    locationNotAvailable: "Ubicación no disponible",
    getMyPosition: "Obtener mi ubicación",
    locating: "Localizando...",
    benefits: "Beneficios de la Geolocalización",
    climateAdvice: "Consejos Climáticos",
    localNetwork: "Red Local",
    regionalMarketplace: "Mercado Regional",
    weatherAlerts: "Alertas Meteorológicas",
    localWeather: "Clima Local",
    humidity: "Humedad",
    wind: "Viento",
    pressure: "Presión",
    agriculturalAdvice: "Consejos Agrícolas",
    season: "Temporada",
    soilType: "Tipo de suelo",
    optimalCrops: "Cultivos óptimos",
    localMarketplace: "Mercado Local",
    usersNearby: "Usuarios cercanos",
    localProducts: "Productos locales",
    activeServices: "Servicios activos",
    avgPricePi: "Precio promedio",
    dataProtection: "Protección de Datos",
    ourCommitments: "Nuestros Compromisos RGPD",
    encryption: "Cifrado de extremo a extremo",
    noSharing: "Sin compartir sin consentimiento",
    rightToErase: "Derecho al olvido",
    transparency: "Transparencia total",
    dataUsage: "Uso de sus Datos de Ubicación",
    personalizedAdvice: "Consejos agrícolas personalizados",
    localConnections: "Conexiones locales",
    localAlerts: "Alertas meteorológicas locales",
    yourRights: "Sus Derechos",
    accessData: "Acceso a todos sus datos",
    rectification: "Rectificación de información",
    deletion: "Eliminación de cuenta",
    portability: "Portabilidad de datos",
    objection: "Derecho de oposición",
    geolocationSettings: "Configuración de Geolocalización",
    autoGeolocation: "Geolocalización automática",
    highAccuracy: "Alta precisión",
    autoUpdate: "Actualización automática",
    positionSharing: "Compartir ubicación",
    positionHistory: "Historial de ubicaciones",
    dataActions: "Acciones de Datos",
    viewAllData: "Ver todos mis datos",
    exportData: "Exportar mis datos",
    deleteAllData: "Eliminar todos mis datos",
    excellent: "Excelente",
    good: "Buena",
    average: "Media",
    poor: "Baja",
  },
  pt: {
    geolocation: "Geolocalização",
    personalizedContent: "Conteúdo personalizado com base na sua localização",
    enabled: "Ativado",
    disabled: "Desativado",
    position: "Posição",
    localContent: "Conteúdo Local",
    privacy: "Privacidade",
    settings: "Configurações",
    currentLocation: "Posição Atual",
    refresh: "Atualizar",
    country: "País",
    region: "Região",
    city: "Cidade",
    coordinates: "Coordenadas",
    accuracy: "Precisão",
    lastUpdate: "Última atualização",
    locationNotAvailable: "Posição não disponível",
    getMyPosition: "Obter minha posição",
    locating: "Localizando...",
    benefits: "Benefícios da Geolocalização",
    climateAdvice: "Conselhos Climáticos",
    localNetwork: "Rede Local",
    regionalMarketplace: "Mercado Regional",
    weatherAlerts: "Alertas Meteorológicos",
    localWeather: "Clima Local",
    humidity: "Umidade",
    wind: "Vento",
    pressure: "Pressão",
    agriculturalAdvice: "Conselhos Agrícolas",
    season: "Estação",
    soilType: "Tipo de solo",
    optimalCrops: "Culturas ideais",
    localMarketplace: "Mercado Local",
    usersNearby: "Usuários próximos",
    localProducts: "Produtos locais",
    activeServices: "Serviços ativos",
    avgPricePi: "Preço médio",
    dataProtection: "Proteção de Dados",
    ourCommitments: "Nossos Compromissos RGPD",
    encryption: "Criptografia de ponta a ponta",
    noSharing: "Sem compartilhamento sem consentimento",
    rightToErase: "Direito ao esquecimento",
    transparency: "Transparência total",
    dataUsage: "Uso dos seus Dados de Localização",
    personalizedAdvice: "Conselhos agrícolas personalizados",
    localConnections: "Conexões locais",
    localAlerts: "Alertas meteorológicos locais",
    yourRights: "Seus Direitos",
    accessData: "Acesso a todos os seus dados",
    rectification: "Retificação de informações",
    deletion: "Exclusão de conta",
    portability: "Portabilidade de dados",
    objection: "Direito de oposição",
    geolocationSettings: "Configurações de Geolocalização",
    autoGeolocation: "Geolocalização automática",
    highAccuracy: "Alta precisão",
    autoUpdate: "Atualização automática",
    positionSharing: "Compartilhamento de posição",
    positionHistory: "Histórico de posições",
    dataActions: "Ações de Dados",
    viewAllData: "Ver todos os meus dados",
    exportData: "Exportar meus dados",
    deleteAllData: "Excluir todos os meus dados",
    excellent: "Excelente",
    good: "Boa",
    average: "Média",
    poor: "Baixa",
  },
}

export default function GeolocationManager({ currentLanguage, userRegion }: GeolocationManagerProps) {
  const [activeTab, setActiveTab] = useState("location")
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(false)
  const [language, setLanguage] = useState(currentLanguage)

  const t = translations[language as keyof typeof translations] || translations.fr

  // Données localisées enrichies
  const localizedContent: LocalizedContent = {
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

  const getCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            country: userRegion,
            region: "Centre",
            city: "Ouagadougou",
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
            address: `${userRegion}, Centre, Ouagadougou`,
          }
          setLocationData(newLocationData)
          setIsLoading(false)
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      )
    }
  }

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (locationEnabled && !locationData) {
      getCurrentLocation()
    }
  }, [locationEnabled])

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`
  }

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy <= 10) return { status: t.excellent, color: "text-green-600", bg: "bg-green-100" }
    if (accuracy <= 50) return { status: t.good, color: "text-blue-600", bg: "bg-blue-100" }
    if (accuracy <= 100) return { status: t.average, color: "text-yellow-600", bg: "bg-yellow-100" }
    return { status: t.poor, color: "text-red-600", bg: "bg-red-100" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t.geolocation}</h2>
                <p className="text-blue-100 text-sm">{t.personalizedContent}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${locationEnabled ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              <span className="text-sm">{locationEnabled ? t.enabled : t.disabled}</span>
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
        <TabsContent value="location" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carte de position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-blue-600" />
                    {t.currentLocation}
                  </span>
                  <Button size="sm" variant="outline" onClick={getCurrentLocation} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    {isLoading ? t.locating : t.refresh}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {locationData ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">{t.country}</p>
                        <p className="font-medium">{locationData.country}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">{t.region}</p>
                        <p className="font-medium">{locationData.region}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">{t.city}</p>
                        <p className="font-medium">{locationData.city}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">{t.accuracy}</p>
                        <Badge className={`${getAccuracyStatus(locationData.accuracy).bg} ${getAccuracyStatus(locationData.accuracy).color}`}>
                          {getAccuracyStatus(locationData.accuracy).status} (±{Math.round(locationData.accuracy)}m)
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">{t.coordinates}</p>
                        <Button size="sm" variant="ghost" onClick={() => setShowCoordinates(!showCoordinates)} className="h-6 px-2">
                          {showCoordinates ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <p className="font-mono text-sm mt-1">
                        {showCoordinates ? formatCoordinates(locationData.latitude, locationData.longitude) : "••••••, ••••••"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">{t.lastUpdate}</p>
                      <p className="text-sm">{new Date(locationData.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">{t.locationNotAvailable}</p>
                    <Button onClick={getCurrentLocation} disabled={isLoading} className="gap-2">
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                      {isLoading ? t.locating : t.getMyPosition}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Avantages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  {t.benefits}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: Thermometer, title: t.climateAdvice, desc: "Recommandations adaptées à votre climat local", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Users, title: t.localNetwork, desc: "Connexion avec des agriculteurs proches", color: "text-green-600", bg: "bg-green-50" },
                  { icon: Store, title: t.regionalMarketplace, desc: "Produits et services de votre région", color: "text-purple-600", bg: "bg-purple-50" },
                  { icon: Cloud, title: t.weatherAlerts, desc: "Prévisions et alertes spécifiques à votre zone", color: "text-orange-600", bg: "bg-orange-50" },
                ].map((benefit, i) => {
                  const Icon = benefit.icon
                  return (
                    <div key={i} className={`flex items-start gap-3 p-3 ${benefit.bg} rounded-lg`}>
                      <div className={`p-1.5 rounded-full ${benefit.bg}`}>
                        <Icon className={`h-4 w-4 ${benefit.color}`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${benefit.color}`}>{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Contenu Local */}
        <TabsContent value="content" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Météo locale */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  {t.localWeather}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{localizedContent.weather.icon}</div>
                  <div className="text-3xl font-bold text-blue-600">{localizedContent.weather.temperature}°C</div>
                  <div className="text-sm text-gray-600">{localizedContent.weather.condition}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <Droplets className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t.humidity}</p>
                    <p className="font-medium text-sm">{localizedContent.weather.humidity}%</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <Wind className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t.wind}</p>
                    <p className="font-medium text-sm">{localizedContent.weather.windSpeed} km/h</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <Thermometer className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">{t.pressure}</p>
                    <p className="font-medium text-sm">{localizedContent.weather.pressure} hPa</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">{localizedContent.weather.forecast}</p>
                </div>
                {/* Prévisions horaires */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Prévisions horaires</p>
                  <div className="flex justify-between">
                    {localizedContent.weather.hourly.map((h, i) => (
                      <div key={i} className="text-center">
                        <p className="text-xs text-gray-500">{h.time}</p>
                        <div className="text-lg">{h.icon}</div>
                        <p className="text-xs font-medium">{h.temp}°</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conseils agricoles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-green-600" />
                  {t.agriculturalAdvice}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="outline" className="gap-1">
                    <span>{localizedContent.agriculture.seasonIcon}</span>
                    <span>{localizedContent.agriculture.season}</span>
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Home className="h-3 w-3" />
                    {localizedContent.agriculture.soilType}
                  </Badge>
                </div>
                <div className="space-y-2 mb-4">
                  {localizedContent.agriculture.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
                {localizedContent.agriculture.optimalCrops.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">{t.optimalCrops}</p>
                    <div className="flex flex-wrap gap-1">
                      {localizedContent.agriculture.optimalCrops.map((crop, i) => (
                        <Badge key={i} variant="secondary" className="bg-green-100 text-green-700">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {localizedContent.agriculture.alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{alert}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Marketplace local */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-purple-600" />
                  {t.localMarketplace}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-blue-600">{localizedContent.marketplace.nearbyUsers}</div>
                    <div className="text-xs text-gray-600">{t.usersNearby}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-green-600">{localizedContent.marketplace.localProducts}</div>
                    <div className="text-xs text-gray-600">{t.localProducts}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Store className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                    <div className="text-xl font-bold text-purple-600">{localizedContent.marketplace.activeServices}</div>
                    <div className="text-xs text-gray-600">{t.activeServices}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Pi className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-xl font-bold text-purple-600">{localizedContent.marketplace.priceInPi} π</div>
                    <div className="text-xs text-gray-600">{t.avgPricePi}</div>
                  </div>
                </div>
                <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                  <ShoppingCart className="h-4 w-4" />
                  Explorer le marché local
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Confidentialité */}
        <TabsContent value="privacy" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                {t.dataProtection}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t.ourCommitments}
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  {[
                    t.encryption,
                    t.noSharing,
                    t.rightToErase,
                    t.transparency,
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">{t.dataUsage}</h4>
                <div className="space-y-3">
                  {[
                    { title: t.personalizedAdvice, active: true },
                    { title: t.localConnections, active: true },
                    { title: t.regionalMarketplace, active: true },
                    { title: t.localAlerts, active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">Basé sur votre position</p>
                      </div>
                      <Badge variant={item.active ? "default" : "secondary"} className={item.active ? "bg-green-600" : ""}>
                        {item.active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  {t.yourRights}
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  {[
                    t.accessData,
                    t.rectification,
                    t.deletion,
                    t.portability,
                    t.objection,
                  ].map((right, i) => (
                    <p key={i}>• {right}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres */}
        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                {t.geolocationSettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { label: t.autoGeolocation, desc: "Détecter automatiquement votre position", value: locationEnabled, setter: setLocationEnabled, type: "toggle" },
                  { label: t.highAccuracy, desc: "Utiliser le GPS pour une meilleure précision", value: true, type: "toggle" },
                  { label: t.autoUpdate, desc: "Actualiser la position périodiquement", value: "Toutes les 5 min", type: "select" },
                  { label: t.positionSharing, desc: "Permettre aux autres de voir votre région", value: "Région uniquement", type: "select" },
                  { label: t.positionHistory, desc: "Conserver un historique de vos déplacements", value: "7 jours", type: "select" },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between flex-wrap gap-3 p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{setting.label}</h4>
                      <p className="text-sm text-gray-500">{setting.desc}</p>
                    </div>
                    {setting.type === "toggle" ? (
                      <Button
                        variant={setting.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setting.setter && setting.setter(!setting.value)}
                        className={setting.value ? "bg-green-600" : ""}
                      >
                        {setting.value ? t.enabled : t.disabled}
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        {setting.value}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  {t.dataActions}
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    {t.viewAllData}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    {t.exportData}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                    {t.deleteAllData}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}