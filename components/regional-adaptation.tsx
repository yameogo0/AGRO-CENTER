"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Thermometer,
  Droplets,
  Sun,
  Cloud,
  Sprout,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Search,
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
  Loader2,
  Star as StarIcon,
  Heart,
  Shield,
  Calendar,
  Clock,
  Leaf,
  Tractor,
  Droplet,
  Wind,
  CloudRain,
  SunDim,
  Moon,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { showToast } from "@/lib/utils"

interface RegionalAdaptationProps {
  currentLanguage: string
  userRegion: string
  onRegionChange: (region: string) => void
}

interface RegionData {
  name: string
  flag: string
  climate: string
  mainCrops: string[]
  livestock: string[]
  challenges: string[]
  opportunities: string[]
  languages: string[]
  currency: string
  cities: string[]
  population?: number
  gdpAgriculture?: number
  area?: number
  capital?: string
}

// Traductions multilingues
const translations: Record<string, any> = {
  fr: {
    title: "Adaptation Régionale",
    subtitle: "Données adaptées à votre région",
    online: "En ligne",
    offline: "Hors ligne",
    refresh: "Actualiser",
    climate: "Climat",
    population: "Population",
    temperature: "Température",
    humidity: "Humidité",
    rainfall: "Pluviométrie",
    gdpAgriculture: "PIB Agricole",
    overview: "Aperçu",
    agriculture: "Agriculture",
    challenges: "Défis",
    opportunities: "Opportunités",
    localServices: "Services locaux",
    mainCrops: "Cultures principales",
    livestock: "Élevage",
    cities: "Villes principales",
    languages: "Langues",
    currency: "Monnaie",
    searchPlaceholder: "Rechercher une région...",
    favoriteRegions: "Régions favorites",
    noFavorites: "Aucune région favorite",
    addToFavorites: "Ajouter aux favoris",
    removeFromFavorites: "Retirer des favoris",
    loading: "Chargement...",
    drySeason: "Saison sèche",
    rainySeason: "Saison des pluies",
    contact: "Contacter",
    viewDetails: "Voir détails",
    recommendations: "Recommandations",
    upcomingEvents: "Événements à venir",
  },
  en: {
    title: "Regional Adaptation",
    subtitle: "Data adapted to your region",
    online: "Online",
    offline: "Offline",
    refresh: "Refresh",
    climate: "Climate",
    population: "Population",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    gdpAgriculture: "GDP Agriculture",
    overview: "Overview",
    agriculture: "Agriculture",
    challenges: "Challenges",
    opportunities: "Opportunities",
    localServices: "Local services",
    mainCrops: "Main crops",
    livestock: "Livestock",
    cities: "Main cities",
    languages: "Languages",
    currency: "Currency",
    searchPlaceholder: "Search region...",
    favoriteRegions: "Favorite regions",
    noFavorites: "No favorite regions",
    addToFavorites: "Add to favorites",
    removeFromFavorites: "Remove from favorites",
    loading: "Loading...",
    drySeason: "Dry season",
    rainySeason: "Rainy season",
    contact: "Contact",
    viewDetails: "View details",
    recommendations: "Recommendations",
    upcomingEvents: "Upcoming events",
  },
  es: {
    title: "Adaptación Regional",
    subtitle: "Datos adaptados a su región",
    online: "En línea",
    offline: "Desconectado",
    refresh: "Actualizar",
    climate: "Clima",
    population: "Población",
    temperature: "Temperatura",
    humidity: "Humedad",
    rainfall: "Precipitación",
    gdpAgriculture: "PIB Agrícola",
    overview: "Resumen",
    agriculture: "Agricultura",
    challenges: "Desafíos",
    opportunities: "Oportunidades",
    localServices: "Servicios locales",
    mainCrops: "Cultivos principales",
    livestock: "Ganadería",
    cities: "Ciudades principales",
    languages: "Idiomas",
    currency: "Moneda",
    searchPlaceholder: "Buscar región...",
    favoriteRegions: "Regiones favoritas",
    noFavorites: "Sin regiones favoritas",
    addToFavorites: "Añadir a favoritos",
    removeFromFavorites: "Quitar de favoritos",
    loading: "Cargando...",
    drySeason: "Estación seca",
    rainySeason: "Estación lluviosa",
    contact: "Contactar",
    viewDetails: "Ver detalles",
    recommendations: "Recomendaciones",
    upcomingEvents: "Próximos eventos",
  },
  pt: {
    title: "Adaptação Regional",
    subtitle: "Dados adaptados à sua região",
    online: "Online",
    offline: "Offline",
    refresh: "Atualizar",
    climate: "Clima",
    population: "População",
    temperature: "Temperatura",
    humidity: "Umidade",
    rainfall: "Pluviosidade",
    gdpAgriculture: "PIB Agrícola",
    overview: "Visão geral",
    agriculture: "Agricultura",
    challenges: "Desafios",
    opportunities: "Oportunidades",
    localServices: "Serviços locais",
    mainCrops: "Culturas principais",
    livestock: "Pecuária",
    cities: "Cidades principais",
    languages: "Idiomas",
    currency: "Moeda",
    searchPlaceholder: "Pesquisar região...",
    favoriteRegions: "Regiões favoritas",
    noFavorites: "Nenhuma região favorita",
    addToFavorites: "Adicionar aos favoritos",
    removeFromFavorites: "Remover dos favoritos",
    loading: "Carregando...",
    drySeason: "Estação seca",
    rainySeason: "Estação chuvosa",
    contact: "Contatar",
    viewDetails: "Ver detalhes",
    recommendations: "Recomendações",
    upcomingEvents: "Próximos eventos",
  },
}

export default function RegionalAdaptation({ currentLanguage, userRegion, onRegionChange }: RegionalAdaptationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [language, setLanguage] = useState(currentLanguage)
  const [refreshing, setRefreshing] = useState(false)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [favoriteRegions, setFavoriteRegions] = useLocalStorage<string[]>("favoriteRegions", [])
  const [lastViewedRegion, setLastViewedRegion] = useLocalStorage("lastViewedRegion", userRegion)
  const { isAuthenticated, userData } = usePiAuth()

  // Données météo dynamiques
  const [weatherData, setWeatherData] = useState({
    temperature: 32,
    humidity: 45,
    rainfall: 12,
    season: "Saison sèche",
    forecast: [
      { day: "Lun", temp: 34, icon: "☀️" },
      { day: "Mar", temp: 31, icon: "⛅" },
      { day: "Mer", temp: 29, icon: "🌧️" },
      { day: "Jeu", temp: 33, icon: "☀️" },
      { day: "Ven", temp: 35, icon: "☀️" },
    ],
  })

  const t = translations[language as keyof typeof translations] || translations.fr

  const regions: Record<string, RegionData> = {
    "Burkina Faso": {
      name: "Burkina Faso",
      flag: "🇧🇫",
      climate: "Sahélien",
      mainCrops: ["Mil", "Sorgho", "Maïs", "Arachide", "Coton", "Niébé", "Sésame"],
      livestock: ["Zébu", "Chèvres Mossi", "Moutons Djallonké", "Volaille locale", "Porcins"],
      challenges: ["Sécheresse", "Désertification", "Accès à l'eau", "Changement climatique", "Déforestation"],
      opportunities: ["Agriculture pluviale", "Élevage extensif", "Transformation locale", "Coopératives", "Exportation coton"],
      languages: ["Français", "Mooré", "Dioula", "Fulfuldé", "Gourmantché"],
      currency: "CFA",
      cities: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora", "Ouahigouya"],
      population: 22673762,
      gdpAgriculture: 31.2,
      area: 274200,
      capital: "Ouagadougou",
    },
    Mali: {
      name: "Mali",
      flag: "🇲🇱",
      climate: "Sahélien/Soudanien",
      mainCrops: ["Riz", "Mil", "Coton", "Arachide", "Fonio", "Maïs"],
      livestock: ["Zébu Peul", "Chèvres du Sahel", "Moutons Touareg", "Dromadaires", "Volaille"],
      challenges: ["Conflit armé", "Changement climatique", "Accès aux marchés", "Désertification"],
      opportunities: ["Irrigation", "Pêche", "Élevage transhumant", "Mines", "Tourisme"],
      languages: ["Français", "Bambara", "Peul", "Soninké", "Tamasheq"],
      currency: "CFA",
      cities: ["Bamako", "Sikasso", "Mopti", "Ségou", "Gao"],
      population: 21904983,
      gdpAgriculture: 38.5,
      area: 1241000,
      capital: "Bamako",
    },
    Sénégal: {
      name: "Sénégal",
      flag: "🇸🇳",
      climate: "Sahélien/Soudanien",
      mainCrops: ["Arachide", "Riz", "Mil", "Mangue", "Pastèque", "Tomate"],
      livestock: ["Zébu Gobra", "Ndama", "Chèvres du Sahel", "Volaille", "Moutons"],
      challenges: ["Salinisation", "Exode rural", "Accès au crédit", "Pêche illégale"],
      opportunities: ["Pêche", "Horticulture", "Tourisme rural", "Énergie solaire", "Transformation"],
      languages: ["Français", "Wolof", "Peul", "Serer", "Diola"],
      currency: "CFA",
      cities: ["Dakar", "Thiès", "Kaolack", "Saint-Louis", "Ziguinchor"],
      population: 17316449,
      gdpAgriculture: 16.9,
      area: 196722,
      capital: "Dakar",
    },
    Niger: {
      name: "Niger",
      flag: "🇳🇪",
      climate: "Sahélien/Saharien",
      mainCrops: ["Mil", "Niébé", "Oignon", "Moringa", "Sorgho", "Blé"],
      livestock: ["Zébu Azawak", "Chèvres rousses", "Dromadaires", "Ânes", "Moutons"],
      challenges: ["Désertification", "Insécurité", "Pauvreté", "Accès à l'eau", "Inondations"],
      opportunities: ["Cultures irriguées", "Élevage nomade", "Mines d'uranium", "Artisanat"],
      languages: ["Français", "Haoussa", "Zarma", "Peul", "Touareg"],
      currency: "CFA",
      cities: ["Niamey", "Zinder", "Maradi", "Tahoua", "Agadez"],
      population: 25130817,
      gdpAgriculture: 40.2,
      area: 1267000,
      capital: "Niamey",
    },
    "Côte d'Ivoire": {
      name: "Côte d'Ivoire",
      flag: "🇨🇮",
      climate: "Tropical",
      mainCrops: ["Cacao", "Café", "Huile de palme", "Hévéa", "Ananas", "Banane"],
      livestock: ["Zébu", "Chèvres", "Moutons", "Volaille", "Porcins"],
      challenges: ["Déforestation", "Prix des matières premières", "Conflits fonciers"],
      opportunities: ["Agro-industrie", "Exportation", "Transformation locale", "Bio"],
      languages: ["Français", "Dioula", "Baoulé", "Bété", "Sénoufo"],
      currency: "CFA",
      cities: ["Abidjan", "Bouaké", "Yamoussoukro", "Daloa", "San-Pédro"],
      population: 29389301,
      gdpAgriculture: 22.1,
      area: 322463,
      capital: "Yamoussoukro",
    },
  }

  // Météo par région
  const regionWeather: Record<string, any> = {
    "Burkina Faso": { temp: 32, humidity: 45, rainfall: 12, season: "Saison sèche" },
    "Mali": { temp: 33, humidity: 38, rainfall: 8, season: "Saison sèche" },
    "Sénégal": { temp: 28, humidity: 65, rainfall: 15, season: "Saison des pluies" },
    "Niger": { temp: 36, humidity: 35, rainfall: 5, season: "Saison sèche" },
    "Côte d'Ivoire": { temp: 28, humidity: 70, rainfall: 20, season: "Saison des pluies" },
  }

  // Services locaux par région
  const localServices: Record<string, any[]> = {
    "Burkina Faso": [
      { name: "Coopérative YELEN", type: "Formation", distance: "2.3 km", rating: 4.8, phone: "+226 70 12 34 56", specialties: ["Aviculture", "Maraîchage"] },
      { name: "Dr. Aminata Traoré", type: "Vétérinaire", distance: "5.1 km", rating: 4.9, phone: "+226 70 23 45 67", specialties: ["Volaille", "Petits ruminants"] },
      { name: "Marché de Rood-Woko", type: "Marché", distance: "1.8 km", rating: 4.2, phone: "+226 70 34 56 78", specialties: ["Vente intrants", "Équipements"] },
    ],
    "Mali": [
      { name: "Coopérative Siguida", type: "Formation", distance: "3.1 km", rating: 4.6, phone: "+223 70 12 34 56", specialties: ["Coton", "Céréales"] },
    ],
    "Sénégal": [
      { name: "AgriTech Sénégal", type: "Conseil", distance: "4.2 km", rating: 4.7, phone: "+221 70 12 34 56", specialties: ["Horticulture", "Irrigation"] },
    ],
  }

  // Charger les données météo
  const fetchWeatherForRegion = useCallback(async (region: string) => {
    if (!isOnline) return
    
    setIsLoadingWeather(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const weather = regionWeather[region] || regionWeather["Burkina Faso"]
      setWeatherData({
        temperature: weather.temp,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
        season: weather.season,
        forecast: weatherData.forecast,
      })
    } catch (error) {
      console.error("Erreur chargement météo:", error)
    } finally {
      setIsLoadingWeather(false)
    }
  }, [isOnline])

  // Rafraîchir toutes les données
  const refreshAllData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setRefreshing(true)
    try {
      await fetchWeatherForRegion(userRegion)
      showToast("Données actualisées", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setRefreshing(false)
    }
  }, [isOnline, userRegion, fetchWeatherForRegion])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (userRegion) {
      setLastViewedRegion(userRegion)
    }
  }, [userRegion, setLastViewedRegion])

  useEffect(() => {
    if (isOnline) {
      fetchWeatherForRegion(userRegion)
    }
  }, [userRegion, isOnline, fetchWeatherForRegion])

  const currentRegionData = regions[userRegion] || regions["Burkina Faso"]
  const currentServices = localServices[userRegion] || localServices["Burkina Faso"]

  const handleAddToFavorites = (regionName: string) => {
    if (favoriteRegions.includes(regionName)) {
      setFavoriteRegions(favoriteRegions.filter(r => r !== regionName))
      showToast(`${regionName} retiré des favoris`, "info")
    } else {
      setFavoriteRegions([...favoriteRegions, regionName])
      showToast(`${regionName} ajouté aux favoris`, "success")
    }
  }

  const filteredCountries = Object.keys(regions).filter((country) =>
    country.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const recommendations = [
    "🌱 Plantez du niébé après les céréales pour fixer l'azote dans le sol",
    "💧 Utilisez le paillage pour réduire l'évaporation et conserver l'humidité",
    "🐔 Vaccinez vos volailles contre Newcastle à 4 semaines",
    "🌾 Stockez vos récoltes à l'abri de l'humidité pour éviter les moisissures",
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Barre de statut et bouton refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <span className="font-medium">{t.title}</span>
          {isOnline ? (
            <Badge variant="outline" className="text-green-600 border-green-200 gap-1">
              <Wifi className="h-3 w-3" />
              {t.online}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-yellow-600 border-yellow-200 gap-1">
              <WifiOff className="h-3 w-3" />
              {t.offline}
            </Badge>
          )}
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={refreshAllData} 
          disabled={refreshing || !isOnline}
          className="gap-1"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {t.refresh}
        </Button>
      </div>

      {/* Sélecteur de région */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="w-full sm:w-64 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          value={userRegion}
          onChange={(e) => onRegionChange(e.target.value)}
        >
          {filteredCountries.map((country) => (
            <option key={country} value={country}>
              {regions[country].flag} {country}
            </option>
          ))}
        </select>
      </div>

      {/* Régions favorites */}
      {favoriteRegions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">{t.favoriteRegions}:</span>
          {favoriteRegions.map(region => (
            <button
              key={region}
              onClick={() => onRegionChange(region)}
              className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition-colors"
            >
              {regions[region]?.flag} {region}
            </button>
          ))}
        </div>
      )}

      {/* Vue d'ensemble de la région */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{currentRegionData.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold">{currentRegionData.name}</h2>
                  <button
                    onClick={() => handleAddToFavorites(currentRegionData.name)}
                    className="text-white/70 hover:text-yellow-400 transition-colors"
                  >
                    {favoriteRegions.includes(currentRegionData.name) ? (
                      <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-green-100 text-sm">{t.climate}: {currentRegionData.climate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100">{t.population}</div>
              <div className="text-lg md:text-xl font-bold">{currentRegionData.population?.toLocaleString() || "N/A"}</div>
              <div className="text-xs text-green-100">Capitale: {currentRegionData.capital}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Thermometer className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg md:text-xl font-bold">{weatherData.temperature}°C</div>
              <div className="text-xs text-green-100">{t.temperature}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Droplets className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg md:text-xl font-bold">{weatherData.humidity}%</div>
              <div className="text-xs text-green-100">{t.humidity}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <CloudRain className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg md:text-xl font-bold">{weatherData.rainfall}mm</div>
              <div className="text-xs text-green-100">{t.rainfall}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Leaf className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg md:text-xl font-bold">{currentRegionData.gdpAgriculture}%</div>
              <div className="text-xs text-green-100">{t.gdpAgriculture}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">{t.overview}</span>
          </TabsTrigger>
          <TabsTrigger value="agriculture" className="gap-2">
            <Sprout className="h-4 w-4" />
            <span className="hidden sm:inline">{t.agriculture}</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">{t.challenges}</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t.localServices}</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {t.cities}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentRegionData.cities.map((city) => (
                    <Badge key={city} variant="secondary" className="bg-gray-100">
                      {city}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  {t.languages}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentRegionData.languages.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-600">💱 {t.currency}: {currentRegionData.currency}</p>
                <p className="text-sm text-gray-600">📐 Superficie: {currentRegionData.area?.toLocaleString()} km²</p>
              </CardContent>
            </Card>
          </div>

          {/* Recommandations */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                {t.recommendations}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(showAllRecommendations ? recommendations : recommendations.slice(0, 2)).map((rec, i) => (
                  <p key={i} className="text-sm text-green-800">• {rec}</p>
                ))}
                {recommendations.length > 2 && (
                  <Button
                    variant="link"
                    className="text-green-600 p-0 h-auto"
                    onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                  >
                    {showAllRecommendations ? "Voir moins" : "Voir plus"}
                    {showAllRecommendations ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Agriculture */}
        <TabsContent value="agriculture" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  {t.mainCrops}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentRegionData.mainCrops.map((crop) => (
                    <Badge key={crop} className="bg-green-100 text-green-800">
                      {crop}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tractor className="h-5 w-5 text-blue-600" />
                  {t.livestock}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentRegionData.livestock.map((animal) => (
                    <Badge key={animal} variant="outline">
                      {animal}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Opportunités */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                {t.opportunities}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRegionData.opportunities.map((opp, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{opp}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Défis */}
        <TabsContent value="challenges" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                {t.challenges}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentRegionData.challenges.map((challenge, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-sm">{challenge}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Solutions proposées: Accès aux crédits agricoles, formations en agroécologie, 
                    mise en place de systèmes d'irrigation goutte-à-goutte, et coopératives locales.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Services locaux */}
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                {t.localServices}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentServices.map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {service.type === "Vétérinaire" ? "👩‍⚕️" : service.type === "Marché" ? "🏪" : "🏢"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.type}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            <StarIcon className="h-2.5 w-2.5 text-yellow-500 fill-current" />
                            <span className="text-xs">{service.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">• {service.distance}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <MessageSquare className="h-3 w-3" />
                      {t.contact}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prédictions météo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Prévisions 5 jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {weatherData.forecast.map((day, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-gray-500">{day.day}</p>
                <div className="text-xl my-1">{day.icon}</div>
                <p className="text-sm font-medium">{day.temp}°C</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}