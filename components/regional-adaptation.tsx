"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"

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
}

// Traductions multilingues
const translations = {
  fr: {
    overview: "Aperçu",
    agriculture: "Agriculture",
    services: "Services locaux",
    change: "Changer région",
    temperature: "Température",
    humidity: "Humidité",
    rainfall: "Précipitations",
    gdpAgriculture: "PIB Agricole",
    weatherForecast: "Prévisions météo",
    regionalChallenges: "Défis régionaux",
    opportunities: "Opportunités",
    localLanguages: "Langues locales",
    mainCrops: "Cultures principales",
    localLivestock: "Élevage local",
    seasonalCalendar: "Calendrier agricole saisonnier",
    drySeason: "Saison sèche",
    rainySeason: "Saison des pluies",
    harvest: "Récoltes",
    prepareIrrigation: "Préparez vos champs pour l'irrigation",
    idealSowing: "Période idéale pour les semis",
    prepareStorage: "Préparez le stockage des récoltes",
    professionalServices: "Services professionnels à proximité",
    changeRegion: "Modifier ma région",
    searchCountry: "Rechercher un pays...",
    adaptedToClimate: "Adapté au climat",
    localBreed: "Race locale",
    population: "Population",
    climate: "Climat",
    favorablePeriod: "Période favorable pour la vaccination des volailles",
    availableLanguages: "L'application est disponible dans toutes ces langues pour une meilleure accessibilité.",
    online: "En ligne",
    offline: "Hors ligne",
    refresh: "Actualiser",
  },
  en: {
    overview: "Overview",
    agriculture: "Agriculture",
    services: "Local services",
    change: "Change region",
    temperature: "Temperature",
    humidity: "Humidity",
    rainfall: "Rainfall",
    gdpAgriculture: "GDP Agriculture",
    weatherForecast: "Weather forecast",
    regionalChallenges: "Regional challenges",
    opportunities: "Opportunities",
    localLanguages: "Local languages",
    mainCrops: "Main crops",
    localLivestock: "Local livestock",
    seasonalCalendar: "Seasonal agricultural calendar",
    drySeason: "Dry season",
    rainySeason: "Rainy season",
    harvest: "Harvest",
    prepareIrrigation: "Prepare your fields for irrigation",
    idealSowing: "Ideal period for sowing",
    prepareStorage: "Prepare harvest storage",
    professionalServices: "Professional services nearby",
    changeRegion: "Change my region",
    searchCountry: "Search for a country...",
    adaptedToClimate: "Adapted to climate",
    localBreed: "Local breed",
    population: "Population",
    climate: "Climate",
    favorablePeriod: "Favorable period for poultry vaccination",
    availableLanguages: "The app is available in all these languages for better accessibility.",
    online: "Online",
    offline: "Offline",
    refresh: "Refresh",
  },
  es: {
    overview: "Visión general",
    agriculture: "Agricultura",
    services: "Servicios locales",
    change: "Cambiar región",
    temperature: "Temperatura",
    humidity: "Humedad",
    rainfall: "Precipitaciones",
    gdpAgriculture: "PIB Agrícola",
    weatherForecast: "Pronóstico del tiempo",
    regionalChallenges: "Desafíos regionales",
    opportunities: "Oportunidades",
    localLanguages: "Idiomas locales",
    mainCrops: "Cultivos principales",
    localLivestock: "Ganadería local",
    seasonalCalendar: "Calendario agrícola estacional",
    drySeason: "Estación seca",
    rainySeason: "Estación lluviosa",
    harvest: "Cosecha",
    prepareIrrigation: "Prepare sus campos para riego",
    idealSowing: "Período ideal para siembra",
    prepareStorage: "Prepare el almacenamiento de cosechas",
    professionalServices: "Servicios profesionales cercanos",
    changeRegion: "Cambiar mi región",
    searchCountry: "Buscar país...",
    adaptedToClimate: "Adaptado al clima",
    localBreed: "Raza local",
    population: "Población",
    climate: "Clima",
    favorablePeriod: "Período favorable para vacunación avícola",
    availableLanguages: "La aplicación está disponible en todos estos idiomas para mejor accesibilidad.",
    online: "En línea",
    offline: "Desconectado",
    refresh: "Actualizar",
  },
  pt: {
    overview: "Visão geral",
    agriculture: "Agricultura",
    services: "Serviços locais",
    change: "Mudar região",
    temperature: "Temperatura",
    humidity: "Umidade",
    rainfall: "Precipitação",
    gdpAgriculture: "PIB Agrícola",
    weatherForecast: "Previsão do tempo",
    regionalChallenges: "Desafios regionais",
    opportunities: "Oportunidades",
    localLanguages: "Idiomas locais",
    mainCrops: "Culturas principais",
    localLivestock: "Pecuária local",
    seasonalCalendar: "Calendário agrícola sazonal",
    drySeason: "Estação seca",
    rainySeason: "Estação chuvosa",
    harvest: "Colheita",
    prepareIrrigation: "Prepare seus campos para irrigação",
    idealSowing: "Período ideal para semeadura",
    prepareStorage: "Prepare o armazenamento das colheitas",
    professionalServices: "Serviços profissionais próximos",
    changeRegion: "Mudar minha região",
    searchCountry: "Pesquisar país...",
    adaptedToClimate: "Adaptado ao clima",
    localBreed: "Raça local",
    population: "População",
    climate: "Clima",
    favorablePeriod: "Período favorável para vacinação de aves",
    availableLanguages: "O aplicativo está disponível em todos esses idiomas para melhor acessibilidade.",
    online: "Online",
    offline: "Offline",
    refresh: "Atualizar",
  },
}

export default function RegionalAdaptation({ currentLanguage, userRegion, onRegionChange }: RegionalAdaptationProps) {
  const [selectedContinent, setSelectedContinent] = useState("Africa")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [language, setLanguage] = useState(currentLanguage)
  const [refreshing, setRefreshing] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [favoriteRegions, setFavoriteRegions] = useLocalStorage<string[]>("favoriteRegions", [])
  const [lastViewedRegion, setLastViewedRegion] = useLocalStorage("lastViewedRegion", userRegion)

  const t = translations[language as keyof typeof translations] || translations.fr

  const regions: Record<string, RegionData> = {
    "Burkina Faso": {
      name: "Burkina Faso",
      flag: "🇧🇫",
      climate: "Sahélien",
      mainCrops: ["Mil", "Sorgho", "Maïs", "Arachide", "Coton"],
      livestock: ["Zébu", "Chèvres Mossi", "Moutons Djallonké", "Volaille locale"],
      challenges: ["Sécheresse", "Désertification", "Accès à l'eau", "Changement climatique"],
      opportunities: ["Agriculture pluviale", "Élevage extensif", "Transformation locale", "Coopératives"],
      languages: ["Français", "Mooré", "Dioula", "Fulfuldé"],
      currency: "CFA",
      cities: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora"],
      population: 22673762,
      gdpAgriculture: 31.2,
    },
    Mali: {
      name: "Mali",
      flag: "🇲🇱",
      climate: "Sahélien/Soudanien",
      mainCrops: ["Riz", "Mil", "Coton", "Arachide", "Fonio"],
      livestock: ["Zébu Peul", "Chèvres du Sahel", "Moutons Touareg", "Dromadaires"],
      challenges: ["Conflit", "Changement climatique", "Accès aux marchés"],
      opportunities: ["Irrigation", "Pêche", "Élevage transhumant"],
      languages: ["Français", "Bambara", "Peul", "Soninké"],
      currency: "CFA",
      cities: ["Bamako", "Sikasso", "Mopti", "Ségou"],
      population: 21904983,
      gdpAgriculture: 38.5,
    },
    Senegal: {
      name: "Sénégal",
      flag: "🇸🇳",
      climate: "Sahélien/Soudanien",
      mainCrops: ["Arachide", "Riz", "Mil", "Mangue"],
      livestock: ["Zébu Gobra", "Ndama", "Chèvres du Sahel", "Volaille"],
      challenges: ["Salinisation", "Exode rural", "Accès au crédit"],
      opportunities: ["Pêche", "Horticulture", "Tourisme rural"],
      languages: ["Français", "Wolof", "Peul", "Serer"],
      currency: "CFA",
      cities: ["Dakar", "Thiès", "Kaolack", "Saint-Louis"],
      population: 17316449,
      gdpAgriculture: 16.9,
    },
    Niger: {
      name: "Niger",
      flag: "🇳🇪",
      climate: "Sahélien/Saharien",
      mainCrops: ["Mil", "Niébé", "Oignon", "Moringa"],
      livestock: ["Zébu Azawak", "Chèvres rousses", "Dromadaires", "Ânes"],
      challenges: ["Désertification", "Insécurité", "Pauvreté"],
      opportunities: ["Cultures irriguées", "Élevage nomade", "Mines"],
      languages: ["Français", "Haoussa", "Zarma", "Peul"],
      currency: "CFA",
      cities: ["Niamey", "Zinder", "Maradi", "Tahoua"],
      population: 25130817,
      gdpAgriculture: 40.2,
    },
  }

  const continents = {
    Africa: {
      name: "Afrique",
      countries: Object.keys(regions).filter((country) =>
        ["Burkina Faso", "Mali", "Senegal", "Niger"].includes(country),
      ),
    },
    Asia: {
      name: "Asie",
      countries: ["China", "India", "Japan", "Thailand"],
    },
    Europe: {
      name: "Europe",
      countries: ["France", "Germany", "Italy", "Spain"],
    },
    Americas: {
      name: "Amériques",
      countries: ["Brazil", "USA", "Mexico", "Argentina"],
    },
  }

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  // Sauvegarder la dernière région vue
  useEffect(() => {
    if (userRegion) {
      setLastViewedRegion(userRegion)
    }
  }, [userRegion, setLastViewedRegion])

  const currentRegionData = regions[userRegion] || regions["Burkina Faso"]

  const weatherData = {
    temperature: 32,
    humidity: 45,
    rainfall: 12,
    season: t.drySeason,
    forecast: [
      { day: "Lun", temp: 34, icon: "☀️" },
      { day: "Mar", temp: 31, icon: "⛅" },
      { day: "Mer", temp: 29, icon: "🌧️" },
      { day: "Jeu", temp: 33, icon: "☀️" },
      { day: "Ven", temp: 35, icon: "☀️" },
    ],
  }

  const localServices = [
    {
      name: "Coopérative YELEN",
      type: "Formation",
      distance: "2.3 km",
      rating: 4.8,
      specialties: ["Aviculture", "Maraîchage"],
    },
    {
      name: "Dr. Aminata Traoré",
      type: "Vétérinaire",
      distance: "5.1 km",
      rating: 4.9,
      specialties: ["Volaille", "Petits ruminants"],
    },
    {
      name: "Marché de Rood-Woko",
      type: "Marché",
      distance: "1.8 km",
      rating: 4.2,
      specialties: ["Vente intrants", "Équipements"],
    },
  ]

  const handleAddToFavorites = (regionName: string) => {
    if (favoriteRegions.includes(regionName)) {
      setFavoriteRegions(favoriteRegions.filter(r => r !== regionName))
    } else {
      setFavoriteRegions([...favoriteRegions, regionName])
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const filteredCountries = Object.keys(regions).filter((country) =>
    country.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-xs">{t.online}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-600">
              <WifiOff className="h-4 w-4" />
              <span className="text-xs">{t.offline}</span>
            </div>
          )}
        </div>
        <Button size="sm" variant="ghost" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
          {t.refresh}
        </Button>
      </div>

      {/* Current Region Overview */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{currentRegionData.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{currentRegionData.name}</h2>
                  <button
                    onClick={() => handleAddToFavorites(currentRegionData.name)}
                    className="text-white/70 hover:text-yellow-400 transition-colors"
                  >
                    <Star className={`h-4 w-4 ${favoriteRegions.includes(currentRegionData.name) ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </button>
                </div>
                <p className="text-green-100">{t.climate}: {currentRegionData.climate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100">{t.population}</div>
              <div className="text-xl font-bold">{currentRegionData.population?.toLocaleString() || "N/A"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-white/10 rounded-lg p-2">
              <Thermometer className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{weatherData.temperature}°C</div>
              <div className="text-xs text-green-100">{t.temperature}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2">
              <Droplets className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{weatherData.humidity}%</div>
              <div className="text-xs text-green-100">{t.humidity}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2">
              <Cloud className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{weatherData.rainfall}mm</div>
              <div className="text-xs text-green-100">{t.rainfall}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-2">
              <Sprout className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{currentRegionData.gdpAgriculture}%</div>
              <div className="text-xs text-green-100">{t.gdpAgriculture}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="agriculture">{t.agriculture}</TabsTrigger>
          <TabsTrigger value="services">{t.services}</TabsTrigger>
          <TabsTrigger value="change">{t.change}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  {t.weatherForecast}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-lg font-semibold mb-2">{weatherData.season}</div>
                  <div className="grid grid-cols-5 gap-2">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="text-center p-2 bg-gray-50 rounded">
                        <div className="text-xs font-medium">{day.day}</div>
                        <div className="text-lg my-1">{day.icon}</div>
                        <div className="text-sm font-bold">{day.temp}°</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-blue-800">{t.favorablePeriod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {t.regionalChallenges}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentRegionData.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">{challenge}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  {t.opportunities}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentRegionData.opportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{opportunity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  {t.localLanguages}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentRegionData.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {language}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{t.availableLanguages}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agriculture" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sprout className="h-5 w-5 mr-2" />
                  {t.mainCrops}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentRegionData.mainCrops.map((crop, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{crop}</span>
                      <Badge variant="secondary">{t.adaptedToClimate}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {t.localLivestock}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentRegionData.livestock.map((animal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">{animal}</span>
                      <Badge variant="secondary">{t.localBreed}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.seasonalCalendar}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">{t.drySeason}</h4>
                  <p className="text-sm text-gray-600 mb-2">Novembre à Mai</p>
                  <p className="text-sm">💡 {t.prepareIrrigation}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">{t.rainySeason}</h4>
                  <p className="text-sm text-gray-600 mb-2">Juin à Octobre</p>
                  <p className="text-sm">💡 {t.idealSowing}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">{t.harvest}</h4>
                  <p className="text-sm text-gray-600 mb-2">Septembre à Décembre</p>
                  <p className="text-sm">💡 {t.prepareStorage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.professionalServices}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {localServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div>
                      <h4 className="font-semibold">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.type}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.specialties.map((spec, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {service.distance}
                      </div>
                      <div className="text-sm text-yellow-500">★ {service.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="change" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.changeRegion}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder={t.searchCountry}
                    className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      onClick={() => {
                        onRegionChange(country)
                        setActiveTab("overview")
                      }}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-green-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{regions[country]?.flag || "🌍"}</span>
                        <span className="font-medium">{country}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToFavorites(country)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Star className={`h-4 w-4 ${favoriteRegions.includes(country) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                      </button>
                    </button>
                  ))}
                </div>
                {favoriteRegions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-600 mb-2">⭐ Régions favorites</p>
                    <div className="flex flex-wrap gap-2">
                      {favoriteRegions.map((region) => (
                        <button
                          key={region}
                          onClick={() => {
                            onRegionChange(region)
                            setActiveTab("overview")
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full text-sm hover:bg-yellow-100 transition-colors"
                        >
                          <span>{regions[region]?.flag || "🌍"}</span>
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Composant Star (étoile)
const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)