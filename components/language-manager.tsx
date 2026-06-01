"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, CheckCircle, Settings, Volume2, Download, Smartphone } from "lucide-react"

interface LanguageManagerProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  speakers: number
  region: string
  status: "available" | "beta" | "coming-soon"
  completeness: number
  contributors: number
}

export default function LanguageManager({ currentLanguage, onLanguageChange }: LanguageManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [activeTab, setActiveTab] = useState("languages")

  const languages: Language[] = [
    {
      code: "fr",
      name: "Français",
      nativeName: "Français",
      flag: "🇫🇷",
      speakers: 280000000,
      region: "Global",
      status: "available",
      completeness: 100,
      contributors: 89,
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      speakers: 1500000000,
      region: "Global",
      status: "available",
      completeness: 100,
      contributors: 120,
    },
    {
      code: "pt",
      name: "Português",
      nativeName: "Português",
      flag: "🇵🇹",
      speakers: 260000000,
      region: "Global",
      status: "available",
      completeness: 100,
      contributors: 67,
    },
    {
      code: "dyu",
      name: "Dioula",
      nativeName: "Jula",
      flag: "🇨🇮",
      speakers: 12000000,
      region: "West Africa",
      status: "available",
      completeness: 95,
      contributors: 25,
    },
    {
      code: "mos",
      name: "Mooré",
      nativeName: "Mòoré",
      flag: "🇧🇫",
      speakers: 7000000,
      region: "West Africa",
      status: "available",
      completeness: 92,
      contributors: 18,
    },
    {
      code: "ha",
      name: "Haoussa",
      nativeName: "Harshen Hausa",
      flag: "🇳🇬",
      speakers: 70000000,
      region: "West Africa",
      status: "available",
      completeness: 88,
      contributors: 22,
    },
  ]

  const regions = [
    { id: "all", name: "Toutes les régions", count: languages.length },
    { id: "Global", name: "Mondial", count: languages.filter((l) => l.region === "Global").length },
    {
      id: "West Africa",
      name: "Afrique de l'Ouest",
      count: languages.filter((l) => l.region === "West Africa").length,
    },
  ]

  const filteredLanguages = languages.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "all" || lang.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "beta":
        return "bg-yellow-100 text-yellow-800"
      case "coming-soon":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "beta":
        return "Bêta"
      case "coming-soon":
        return "Bientôt"
      default:
        return "Inconnu"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Gestionnaire de Langues</h2>
              <p className="text-blue-100">
                Agro Multicenter Hinos disponible en {languages.filter((l) => l.status === "available").length} langues
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{languages.length}</div>
              <div className="text-sm text-blue-100">Langues supportées</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">
                {languages.reduce((sum, lang) => sum + lang.speakers, 0).toLocaleString()}
              </div>
              <div className="text-xs text-blue-100">Locuteurs totaux</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{languages.filter((l) => l.status === "available").length}</div>
              <div className="text-xs text-blue-100">Langues actives</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{languages.filter((l) => l.status === "beta").length}</div>
              <div className="text-xs text-blue-100">En bêta</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {Math.round(languages.reduce((sum, lang) => sum + lang.completeness, 0) / languages.length)}%
              </div>
              <div className="text-xs text-blue-100">Complétude moyenne</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="languages">Langues</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="contribute">Contribuer</TabsTrigger>
          <TabsTrigger value="download">Télécharger</TabsTrigger>
        </TabsList>

        <TabsContent value="languages" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une langue..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name} ({region.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Language */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                Langue actuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const current = languages.find((l) => l.code === currentLanguage) || languages[0] // French by default
                return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{current.flag}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{current.name}</h3>
                        <p className="text-gray-600">{current.nativeName}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{current.speakers.toLocaleString()} locuteurs</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(current.status)}>{getStatusText(current.status)}</Badge>
                      <div className="text-sm text-gray-600 mt-1">{current.completeness}% complet</div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Languages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLanguages.map((language) => (
              <Card
                key={language.code}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  language.code === currentLanguage ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => onLanguageChange(language.code)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div>
                        <h3 className="font-semibold">{language.name}</h3>
                        <p className="text-sm text-gray-600">{language.nativeName}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(language.status)}>{getStatusText(language.status)}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Locuteurs:</span>
                      <span className="font-medium">{language.speakers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Région:</span>
                      <span className="font-medium">{language.region}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Complétude:</span>
                      <span className="font-medium">{language.completeness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${language.completeness}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{language.contributors} contributeurs</span>
                      </div>
                      {language.code === currentLanguage && (
                        <div className="flex items-center text-blue-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span>Actuelle</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Paramètres de langue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Détection automatique</h4>
                    <p className="text-sm text-gray-500">Détecter automatiquement la langue du système</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Traduction automatique</h4>
                    <p className="text-sm text-gray-500">Traduire automatiquement les messages</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Synthèse vocale</h4>
                    <p className="text-sm text-gray-500">Lire les textes à haute voix</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Configurer
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Format de date</h4>
                    <p className="text-sm text-gray-500">Format d'affichage des dates</p>
                  </div>
                  <Select defaultValue="dd/mm/yyyy">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Format numérique</h4>
                    <p className="text-sm text-gray-500">Séparateur décimal et milliers</p>
                  </div>
                  <Select defaultValue="comma">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comma">1 234,56</SelectItem>
                      <SelectItem value="dot">1,234.56</SelectItem>
                      <SelectItem value="space">1 234.56</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contribute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contribuer aux traductions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Aidez-nous à améliorer Agro Multicenter Hinos en contribuant aux traductions dans votre langue.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Traducteur bénévole</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Rejoignez notre équipe de traducteurs et aidez à localiser l'application.
                  </p>
                  <Button size="sm">Devenir traducteur</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Réviseur linguistique</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Relisez et validez les traductions existantes pour améliorer leur qualité.
                  </p>
                  <Button size="sm" variant="outline">
                    Devenir réviseur
                  </Button>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Langues prioritaires</h4>
                <div className="flex flex-wrap gap-2">
                  {languages
                    .filter((l) => l.status === "coming-soon" || l.completeness < 80)
                    .slice(0, 6)
                    .map((lang) => (
                      <Badge key={lang.code} variant="outline">
                        {lang.flag} {lang.name} ({lang.completeness}%)
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Packs de langues hors ligne
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Téléchargez les packs de langues pour utiliser l'application sans connexion internet.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages
                  .filter((l) => l.status === "available")
                  .slice(0, 8)
                  .map((language) => (
                    <div key={language.code} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{language.flag}</span>
                        <div>
                          <p className="font-medium text-sm">{language.name}</p>
                          <p className="text-xs text-gray-500">12.5 MB</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Les packs de langues permettent d'utiliser l'application même sans connexion internet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
