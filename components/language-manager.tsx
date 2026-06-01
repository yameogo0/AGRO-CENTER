"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Users,
  CheckCircle,
  Settings,
  Volume2,
  Download,
  Smartphone,
  Globe,
  Languages,
  Trophy,
  Star,
  TrendingUp,
  Clock,
  Award,
  Heart,
  Share2,
  BookOpen,
  Mic,
  MessageSquare,
  Zap,
  Coffee,
  Target,
  MapPin, // ← Ajoutez cette ligne
} from "lucide-react"

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
  popularity: number
  fileSize?: string
}

// Traductions du gestionnaire lui-même
const managerTranslations = {
  fr: {
    title: "Gestionnaire de Langues",
    subtitle: "Agro Multicenter Hinos disponible en",
    languages: "langues",
    supportedLanguages: "Langues supportées",
    totalSpeakers: "Locuteurs totaux",
    activeLanguages: "Langues actives",
    inBeta: "En bêta",
    averageCompleteness: "Complétude moyenne",
    searchPlaceholder: "Rechercher une langue...",
    currentLanguage: "Langue actuelle",
    speakers: "locuteurs",
    complete: "complet",
    contributors: "contributeurs",
    current: "Actuelle",
    languageSettings: "Paramètres de langue",
    autoDetection: "Détection automatique",
    autoDetectionDesc: "Détecter automatiquement la langue du système",
    autoTranslation: "Traduction automatique",
    autoTranslationDesc: "Traduire automatiquement les messages",
    textToSpeech: "Synthèse vocale",
    textToSpeechDesc: "Lire les textes à haute voix",
    dateFormat: "Format de date",
    numberFormat: "Format numérique",
    enabled: "Activé",
    disabled: "Désactivé",
    configure: "Configurer",
    contribute: "Contribuer aux traductions",
    contributeDesc: "Aidez-nous à améliorer Agro Multicenter Hinos en contribuant aux traductions",
    volunteerTranslator: "Traducteur bénévole",
    volunteerTranslatorDesc: "Rejoignez notre équipe de traducteurs",
    becomeTranslator: "Devenir traducteur",
    languageReviewer: "Réviseur linguistique",
    languageReviewerDesc: "Relisez et validez les traductions existantes",
    becomeReviewer: "Devenir réviseur",
    priorityLanguages: "Langues prioritaires",
    offlinePacks: "Packs de langues hors ligne",
    offlinePacksDesc: "Téléchargez les packs de langues pour utiliser l'application sans connexion internet",
    download: "Télécharger",
    offlineInfo: "Les packs de langues permettent d'utiliser l'application même sans connexion internet",
    popular: "Populaire",
    topContributor: "Top contributeur",
    translationProgress: "Progression des traductions",
    leaderboard: "Classement des traducteurs",
    quickSwitch: "Changement rapide",
    recentlyAdded: "Ajouts récents",
    mostTranslated: "Les plus traduites",
  },
  en: {
    title: "Language Manager",
    subtitle: "Agro Multicenter Hinos available in",
    languages: "languages",
    supportedLanguages: "Supported languages",
    totalSpeakers: "Total speakers",
    activeLanguages: "Active languages",
    inBeta: "In beta",
    averageCompleteness: "Average completeness",
    searchPlaceholder: "Search for a language...",
    currentLanguage: "Current language",
    speakers: "speakers",
    complete: "complete",
    contributors: "contributors",
    current: "Current",
    languageSettings: "Language settings",
    autoDetection: "Auto detection",
    autoDetectionDesc: "Automatically detect system language",
    autoTranslation: "Auto translation",
    autoTranslationDesc: "Automatically translate messages",
    textToSpeech: "Text to speech",
    textToSpeechDesc: "Read texts aloud",
    dateFormat: "Date format",
    numberFormat: "Number format",
    enabled: "Enabled",
    disabled: "Disabled",
    configure: "Configure",
    contribute: "Contribute to translations",
    contributeDesc: "Help us improve Agro Multicenter Hinos by contributing translations",
    volunteerTranslator: "Volunteer translator",
    volunteerTranslatorDesc: "Join our team of translators",
    becomeTranslator: "Become a translator",
    languageReviewer: "Language reviewer",
    languageReviewerDesc: "Review and validate existing translations",
    becomeReviewer: "Become a reviewer",
    priorityLanguages: "Priority languages",
    offlinePacks: "Offline language packs",
    offlinePacksDesc: "Download language packs to use the app without internet connection",
    download: "Download",
    offlineInfo: "Language packs allow you to use the app even without internet connection",
    popular: "Popular",
    topContributor: "Top contributor",
    translationProgress: "Translation progress",
    leaderboard: "Translator leaderboard",
    quickSwitch: "Quick switch",
    recentlyAdded: "Recently added",
    mostTranslated: "Most translated",
  },
  es: {
    title: "Gestor de Idiomas",
    subtitle: "Agro Multicenter Hinos disponible en",
    languages: "idiomas",
    supportedLanguages: "Idiomas soportados",
    totalSpeakers: "Hablantes totales",
    activeLanguages: "Idiomas activos",
    inBeta: "En beta",
    averageCompleteness: "Integridad promedio",
    searchPlaceholder: "Buscar idioma...",
    currentLanguage: "Idioma actual",
    speakers: "hablantes",
    complete: "completo",
    contributors: "colaboradores",
    current: "Actual",
    languageSettings: "Configuración de idioma",
    autoDetection: "Detección automática",
    autoDetectionDesc: "Detectar automáticamente el idioma del sistema",
    autoTranslation: "Traducción automática",
    autoTranslationDesc: "Traducir mensajes automáticamente",
    textToSpeech: "Texto a voz",
    textToSpeechDesc: "Leer textos en voz alta",
    dateFormat: "Formato de fecha",
    numberFormat: "Formato numérico",
    enabled: "Activado",
    disabled: "Desactivado",
    configure: "Configurar",
    contribute: "Contribuir a traducciones",
    contributeDesc: "Ayúdanos a mejorar Agro Multicenter Hinos contribuyendo traducciones",
    volunteerTranslator: "Traductor voluntario",
    volunteerTranslatorDesc: "Únete a nuestro equipo de traductores",
    becomeTranslator: "Ser traductor",
    languageReviewer: "Revisor lingüístico",
    languageReviewerDesc: "Revisar y validar traducciones existentes",
    becomeReviewer: "Ser revisor",
    priorityLanguages: "Idiomas prioritarios",
    offlinePacks: "Paquetes de idiomas sin conexión",
    offlinePacksDesc: "Descarga paquetes de idiomas para usar la app sin internet",
    download: "Descargar",
    offlineInfo: "Los paquetes de idiomas permiten usar la app incluso sin conexión",
    popular: "Popular",
    topContributor: "Mejor colaborador",
    translationProgress: "Progreso de traducción",
    leaderboard: "Tabla de clasificación",
    quickSwitch: "Cambio rápido",
    recentlyAdded: "Agregados recientemente",
    mostTranslated: "Más traducidos",
  },
  pt: {
    title: "Gestor de Idiomas",
    subtitle: "Agro Multicenter Hinos disponível em",
    languages: "idiomas",
    supportedLanguages: "Idiomas suportados",
    totalSpeakers: "Total de falantes",
    activeLanguages: "Idiomas ativos",
    inBeta: "Em beta",
    averageCompleteness: "Integridade média",
    searchPlaceholder: "Pesquisar idioma...",
    currentLanguage: "Idioma atual",
    speakers: "falantes",
    complete: "completo",
    contributors: "colaboradores",
    current: "Atual",
    languageSettings: "Configurações de idioma",
    autoDetection: "Detecção automática",
    autoDetectionDesc: "Detectar automaticamente o idioma do sistema",
    autoTranslation: "Tradução automática",
    autoTranslationDesc: "Traduzir mensagens automaticamente",
    textToSpeech: "Texto para voz",
    textToSpeechDesc: "Ler textos em voz alta",
    dateFormat: "Formato de data",
    numberFormat: "Formato numérico",
    enabled: "Ativado",
    disabled: "Desativado",
    configure: "Configurar",
    contribute: "Contribuir com traduções",
    contributeDesc: "Ajude-nos a melhorar o Agro Multicenter Hinos contribuindo com traduções",
    volunteerTranslator: "Tradutor voluntário",
    volunteerTranslatorDesc: "Junte-se à nossa equipe de tradutores",
    becomeTranslator: "Ser tradutor",
    languageReviewer: "Revisor linguístico",
    languageReviewerDesc: "Revisar e validar traduções existentes",
    becomeReviewer: "Ser revisor",
    priorityLanguages: "Idiomas prioritários",
    offlinePacks: "Pacotes de idiomas offline",
    offlinePacksDesc: "Baixe pacotes de idiomas para usar o app sem internet",
    download: "Baixar",
    offlineInfo: "Pacotes de idiomas permitem usar o app mesmo sem conexão",
    popular: "Popular",
    topContributor: "Melhor colaborador",
    translationProgress: "Progresso da tradução",
    leaderboard: "Classificação",
    quickSwitch: "Troca rápida",
    recentlyAdded: "Adicionados recentemente",
    mostTranslated: "Mais traduzidos",
  },
}

export default function LanguageManager({ currentLanguage, onLanguageChange }: LanguageManagerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [activeTab, setActiveTab] = useState("languages")
  const [uiLanguage, setUiLanguage] = useState(currentLanguage)

  const t = managerTranslations[uiLanguage as keyof typeof managerTranslations] || managerTranslations.fr

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
      popularity: 98,
      fileSize: "12.5 MB",
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
      popularity: 99,
      fileSize: "12.5 MB",
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
      popularity: 95,
      fileSize: "12.5 MB",
    },
    {
      code: "es",
      name: "Español",
      nativeName: "Español",
      flag: "🇪🇸",
      speakers: 550000000,
      region: "Global",
      status: "beta",
      completeness: 85,
      contributors: 45,
      popularity: 90,
      fileSize: "11.2 MB",
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
      popularity: 85,
      fileSize: "8.5 MB",
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
      popularity: 82,
      fileSize: "7.8 MB",
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
      popularity: 88,
      fileSize: "9.2 MB",
    },
    {
      code: "wo",
      name: "Wolof",
      nativeName: "Wolof",
      flag: "🇸🇳",
      speakers: 12000000,
      region: "West Africa",
      status: "beta",
      completeness: 75,
      contributors: 12,
      popularity: 78,
      fileSize: "7.5 MB",
    },
    {
      code: "ff",
      name: "Peul",
      nativeName: "Fulfulde",
      flag: "🇬🇳",
      speakers: 40000000,
      region: "West Africa",
      status: "coming-soon",
      completeness: 45,
      contributors: 8,
      popularity: 70,
      fileSize: "6.8 MB",
    },
  ]

  const regions = [
    { id: "all", name: "Toutes les régions", icon: Globe, count: languages.length },
    { id: "Global", name: "Mondial", icon: Languages, count: languages.filter((l) => l.region === "Global").length },
    {
      id: "West Africa",
      name: "Afrique de l'Ouest",
      icon: MapPin,
      count: languages.filter((l) => l.region === "West Africa").length,
    },
  ]

  const topContributors = [
    { name: "Dr. Amadou Diallo", languages: 5, translations: 1250, rank: 1, avatar: "👨‍🏫" },
    { name: "Fatoumata Sy", languages: 4, translations: 890, rank: 2, avatar: "👩‍🌾" },
    { name: "Ibrahim Traoré", languages: 3, translations: 720, rank: 3, avatar: "👨‍💻" },
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
        return "bg-green-100 text-green-800 border-green-200"
      case "beta":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "coming-soon":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string, uiLang: string) => {
    const texts = {
      fr: { available: "Disponible", beta: "Bêta", "coming-soon": "Bientôt" },
      en: { available: "Available", beta: "Beta", "coming-soon": "Coming soon" },
      es: { available: "Disponible", beta: "Beta", "coming-soon": "Próximamente" },
      pt: { available: "Disponível", beta: "Beta", "coming-soon": "Em breve" },
    }
    return texts[uiLang as keyof typeof texts]?.[status as keyof typeof texts.fr] || status
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "text-green-600"
    if (popularity >= 80) return "text-blue-600"
    if (popularity >= 70) return "text-yellow-600"
    return "text-gray-600"
  }

  useEffect(() => {
    setUiLanguage(currentLanguage)
  }, [currentLanguage])

  const currentLang = languages.find((l) => l.code === uiLanguage) || languages[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Languages className="h-6 w-6" />
                <h2 className="text-2xl font-bold">{t.title}</h2>
              </div>
              <p className="text-green-100">
                {t.subtitle} {languages.filter((l) => l.status === "available").length} {t.languages}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <Globe className="h-5 w-5" />
              <div className="text-right">
                <div className="text-2xl font-bold">{languages.length}</div>
                <div className="text-xs text-green-100">{t.supportedLanguages}</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">{languages.reduce((sum, lang) => sum + lang.speakers, 0).toLocaleString()}</div>
              <div className="text-xs text-green-100">{t.totalSpeakers}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">{languages.filter((l) => l.status === "available").length}</div>
              <div className="text-xs text-green-100">{t.activeLanguages}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">{languages.filter((l) => l.status === "beta").length}</div>
              <div className="text-xs text-green-100">{t.inBeta}</div>
            </div>
            <div className="text-center bg-white/10 rounded-lg p-3">
              <div className="text-lg font-bold">
                {Math.round(languages.reduce((sum, lang) => sum + lang.completeness, 0) / languages.length)}%
              </div>
              <div className="text-xs text-green-100">{t.averageCompleteness}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="languages" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Langues</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
          <TabsTrigger value="contribute" className="gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Contribuer</span>
          </TabsTrigger>
          <TabsTrigger value="download" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Hors ligne</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Langues */}
        <TabsContent value="languages" className="space-y-4 mt-6">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t.searchPlaceholder}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => {
                  const Icon = region.icon
                  return (
                    <SelectItem key={region.id} value={region.id} className="gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{region.name}</span>
                        <Badge variant="secondary" className="ml-auto">{region.count}</Badge>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Langue actuelle */}
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                {t.currentLanguage}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{currentLang.flag}</span>
                  <div>
                    <h3 className="font-bold text-xl">{currentLang.name}</h3>
                    <p className="text-gray-600">{currentLang.nativeName}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>👥 {currentLang.speakers.toLocaleString()} {t.speakers}</span>
                      <span>📊 {currentLang.completeness}% {t.complete}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(currentLang.status)}>
                    {getStatusText(currentLang.status, uiLanguage)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <Users className="h-3 w-3" />
                    <span>{currentLang.contributors} {t.contributors}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des langues */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLanguages.map((language) => (
              <Card
                key={language.code}
                className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                  language.code === uiLanguage ? "ring-2 ring-green-500 bg-green-50" : ""
                }`}
                onClick={() => onLanguageChange(language.code)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{language.flag}</span>
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="font-semibold">{language.name}</h3>
                          {language.popularity >= 90 && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-xs text-gray-500">{language.nativeName}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(language.status)}>
                      {getStatusText(language.status, uiLanguage)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">👥 Locuteurs:</span>
                      <span className="font-medium">{language.speakers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">📍 Région:</span>
                      <span className="font-medium">{language.region === "West Africa" ? "🌍 Afrique de l'Ouest" : language.region}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">📊 Complétude:</span>
                      <span className="font-medium">{language.completeness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          language.completeness >= 90 ? "bg-green-500" : language.completeness >= 70 ? "bg-blue-500" : "bg-yellow-500"
                        }`}
                        style={{ width: `${language.completeness}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{language.contributors} contributeurs</span>
                      </div>
                      {language.code === uiLanguage && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>{t.current}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Paramètres */}
        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t.languageSettings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3 p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{t.autoDetection}</h4>
                  <p className="text-sm text-gray-500">{t.autoDetectionDesc}</p>
                </div>
                <Button variant="outline" size="sm" className="bg-green-50 text-green-600 border-green-200">
                  {t.enabled}
                </Button>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{t.autoTranslation}</h4>
                  <p className="text-sm text-gray-500">{t.autoTranslationDesc}</p>
                </div>
                <Button variant="outline" size="sm" className="bg-green-50 text-green-600 border-green-200">
                  {t.enabled}
                </Button>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{t.textToSpeech}</h4>
                  <p className="text-sm text-gray-500">{t.textToSpeechDesc}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Volume2 className="h-4 w-4" />
                  {t.configure}
                </Button>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{t.dateFormat}</h4>
                  <p className="text-sm text-gray-500">DD/MM/YYYY</p>
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

              <div className="flex items-center justify-between flex-wrap gap-3 p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{t.numberFormat}</h4>
                  <p className="text-sm text-gray-500">1 234,56</p>
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
            </CardContent>
          </Card>

          {/* Classement des traducteurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                {t.leaderboard}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topContributors.map((contributor) => (
                  <div key={contributor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        contributor.rank === 1 ? "bg-yellow-500" : contributor.rank === 2 ? "bg-gray-400" : "bg-orange-500"
                      } text-white font-bold`}>
                        {contributor.rank}
                      </div>
                      <div>
                        <p className="font-medium">{contributor.name}</p>
                        <p className="text-xs text-gray-500">{contributor.translations} traductions • {contributor.languages} langues</p>
                      </div>
                    </div>
                    <div className="text-2xl">{contributor.avatar}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Contribuer */}
        <TabsContent value="contribute" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                {t.contribute}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{t.contributeDesc}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold">{t.volunteerTranslator}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{t.volunteerTranslatorDesc}</p>
                  <Button size="sm" className="w-full gap-2">
                    <Heart className="h-4 w-4" />
                    {t.becomeTranslator}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold">{t.languageReviewer}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{t.languageReviewerDesc}</p>
                  <Button size="sm" variant="outline" className="w-full gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {t.becomeReviewer}
                  </Button>
                </div>
              </div>

              {/* Langues prioritaires */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-yellow-600" />
                  {t.priorityLanguages}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {languages
                    .filter((l) => l.status === "coming-soon" || l.completeness < 80)
                    .map((lang) => (
                      <Badge key={lang.code} variant="outline" className="gap-1 py-1.5">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        <span className="text-gray-400">({lang.completeness}%)</span>
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Progression */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t.translationProgress}
                </h4>
                <div className="space-y-2">
                  {languages.slice(0, 5).map((lang) => (
                    <div key={lang.code} className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm w-20">{lang.name}</span>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 rounded-full bg-green-500 transition-all"
                            style={{ width: `${lang.completeness}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 w-12">{lang.completeness}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Téléchargement */}
        <TabsContent value="download" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                {t.offlinePacks}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{t.offlinePacksDesc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {languages
                  .filter((l) => l.status === "available" || l.status === "beta")
                  .map((language) => (
                    <div key={language.code} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <p className="font-medium text-sm">{language.name}</p>
                          <p className="text-xs text-gray-500">{language.fileSize}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Download className="h-3 w-3" />
                        {t.download}
                      </Button>
                    </div>
                  ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">{t.offlineInfo}</p>
                    <p className="text-xs text-blue-600 mt-1">Espace total estimé : ~120 MB pour toutes les langues</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Mode économique</p>
                    <p className="text-xs text-green-600 mt-1">Téléchargez uniquement les langues que vous utilisez fréquemment pour économiser de l'espace</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}