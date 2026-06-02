"use client"

import { useState, useEffect, useCallback } from "react"
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
  Loader2,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { weatherApi } from "@/lib/api/weather"
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
}

// Traductions multilingues (identiques à l'original)
const translations = { /* ... vos traductions ... */ }

export default function RegionalAdaptation({ currentLanguage, userRegion, onRegionChange }: RegionalAdaptationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [language, setLanguage] = useState(currentLanguage)
  const [refreshing, setRefreshing] = useState(false)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [favoriteRegions, setFavoriteRegions] = useLocalStorage<string[]>("favoriteRegions", [])
  const [lastViewedRegion, setLastViewedRegion] = useLocalStorage("lastViewedRegion", userRegion)

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

  // Charger les données météo depuis l'API
  const fetchWeatherForRegion = useCallback(async (region: string) => {
    if (!isOnline) return
    
    setIsLoadingWeather(true)
    try {
      const { data } = await weatherApi.getCurrent()
      if (data) {
        setWeatherData({
          temperature: data.temperature || 32,
          humidity: data.humidity || 45,
          rainfall: data.rainfall || 12,
          season: data.season || t.drySeason,
          forecast: data.forecast || weatherData.forecast,
        })
      }
    } catch (error) {
      console.error("Erreur chargement météo:", error)
    } finally {
      setIsLoadingWeather(false)
    }
  }, [isOnline, t.drySeason])

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

  // Sauvegarder la dernière région vue
  useEffect(() => {
    if (userRegion) {
      setLastViewedRegion(userRegion)
    }
  }, [userRegion, setLastViewedRegion])

  // Charger les données météo au changement de région
  useEffect(() => {
    if (isOnline) {
      fetchWeatherForRegion(userRegion)
    }
  }, [userRegion, isOnline, fetchWeatherForRegion])

  const currentRegionData = regions[userRegion] || regions["Burkina Faso"]

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
      showToast(`${regionName} retiré des favoris`, "info")
    } else {
      setFavoriteRegions([...favoriteRegions, regionName])
      showToast(`${regionName} ajouté aux favoris`, "success")
    }
  }

  const filteredCountries = Object.keys(regions).filter((country) =>
    country.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  // Afficher un loader pendant le chargement
  if (isLoadingWeather && !weatherData.temperature) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement des données régionales...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status bar avec bouton refresh */}
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
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={refreshAllData} 
          disabled={refreshing || !isOnline}
        >
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

      {/* Regional Tabs - le reste du JSX est identique à l'original */}
      {/* ... garder le reste du code JSX identique ... */}
    </div>
  )
}

// Composant Star (étoile)
const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)