"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

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

export default function RegionalAdaptation({ currentLanguage, userRegion, onRegionChange }: RegionalAdaptationProps) {
  const [selectedContinent, setSelectedContinent] = useState("Africa")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

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

  const currentRegionData = regions[userRegion] || regions["Burkina Faso"]

  const weatherData = {
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

  const filteredCountries = Object.keys(regions).filter((country) =>
    country.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Current Region Overview */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">{currentRegionData.flag}</span>
              <div>
                <h2 className="text-2xl font-bold">{currentRegionData.name}</h2>
                <p className="text-green-100">Climat: {currentRegionData.climate}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100">Population</div>
              <div className="text-xl font-bold">{currentRegionData.population?.toLocaleString() || "N/A"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Thermometer className="h-6 w-6 mx-auto mb-1" />
              <div className="text-lg font-bold">{weatherData.temperature}°C</div>
              <div className="text-xs text-green-100">Température</div>
            </div>
            <div className="text-center">
              <Droplets className="h-6 w-6 mx-auto mb-1" />
              <div className="text-lg font-bold">{weatherData.humidity}%</div>
              <div className="text-xs text-green-100">Humidité</div>
            </div>
            <div className="text-center">
              <Cloud className="h-6 w-6 mx-auto mb-1" />
              <div className="text-lg font-bold">{weatherData.rainfall}mm</div>
              <div className="text-xs text-green-100">Précipitations</div>
            </div>
            <div className="text-center">
              <Sprout className="h-6 w-6 mx-auto mb-1" />
              <div className="text-lg font-bold">{currentRegionData.gdpAgriculture}%</div>
              <div className="text-xs text-green-100">PIB Agricole</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
          <TabsTrigger value="services">Services locaux</TabsTrigger>
          <TabsTrigger value="change">Changer région</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weather Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  Prévisions météo
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
                    <p className="text-sm text-blue-800">Période favorable pour la vaccination des volailles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Défis régionaux
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
                  Opportunités
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
                  Langues locales
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
                  <p className="text-sm text-blue-800">
                    L'application est disponible dans toutes ces langues pour une meilleure accessibilité.
                  </p>
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
                  Cultures principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentRegionData.mainCrops.map((crop, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{crop}</span>
                      <Badge variant="secondary">Adapté au climat</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Élevage local
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentRegionData.livestock.map((animal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">{animal}</span>
                      <Badge variant="secondary">Race locale</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calendrier agricole saisonnier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Saison sèche</h4>
                  <p className="text-sm text-gray-600 mb-2">Novembre à Mai</p>
                  <p className="text-sm">💡 Préparez vos champs pour l'irrigation</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Saison des pluies</h4>
                  <p className="text-sm text-gray-600 mb-2">Juin à Octobre</p>
                  <p className="text-sm">💡 Période idéale pour les semis</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Récoltes</h4>
                  <p className="text-sm text-gray-600 mb-2">Septembre à Décembre</p>
                  <p className="text-sm">💡 Préparez le stockage des récoltes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services professionnels à proximité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {localServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
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
                      <div className="text-sm font-medium">{service.distance}</div>
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
              <CardTitle>Modifier ma région</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un pays..."
                    className="w-full p-2 border rounded-lg"
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
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <span className="text-2xl">{regions[country]?.flag || "🌍"}</span>
                      <span className="font-medium">{country}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}