

"use client"

import { useState, useEffect } from "react"
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

interface DashboardProps {
  currentLanguage: string
  userRegion: string
  onTabChange: (tab: string) => void
}

// Traductions multilingues (identiques à l'original)
const translations = {
  fr: {
    greetings: "Bonjour",
    dashboard: "Tableau de bord",
    online: "En ligne",
    offline: "Hors ligne",
    alerts: "Alertes",
    tips: "Conseils du jour",
    weather: "Météo agricole",
    forecast: "Prévisions",
    quickAccess: "Accès rapide",
    nearbyNetwork: "Réseau à proximité",
    products: "Produits",
    services: "Services",
    activities: "Activités récentes",
    news: "Actualités",
    viewAll: "Voir tout",
    contact: "Contacter",
    available: "Disponible",
    soldOut: "Épuisé",
    busy: "Occupé",
    urgent: "Urgent",
    payWithPi: "Payer avec Pi",
    priceInPi: "Prix en Pi",
    myFarm: "Mon exploitation",
    localMarket: "Marché local",
    farmerNetwork: "Réseau agriculteurs",
    knowledge: "Conseils & savoir",
    piWallet: "Portefeuille Pi",
    maps: "Cartes & analyses",
    temperature: "Température",
    humidity: "Humidité",
    wind: "Vent",
    location: "Position",
    farmers: "agriculteurs",
    productsCount: "produits",
    recommended: "Recommandé",
    distance: "km",
    day: "jour",
    days: "jours",
    dismissed: "Masqué",
    show: "Afficher",
  },
  en: {
    greetings: "Hello",
    dashboard: "Dashboard",
    online: "Online",
    offline: "Offline",
    alerts: "Alerts",
    tips: "Daily tips",
    weather: "Weather",
    forecast: "Forecast",
    quickAccess: "Quick access",
    nearbyNetwork: "Nearby network",
    products: "Products",
    services: "Services",
    activities: "Recent activities",
    news: "News",
    viewAll: "View all",
    contact: "Contact",
    available: "Available",
    soldOut: "Sold out",
    busy: "Busy",
    urgent: "Urgent",
    payWithPi: "Pay with Pi",
    priceInPi: "Price in Pi",
    myFarm: "My farm",
    localMarket: "Local market",
    farmerNetwork: "Farmer network",
    knowledge: "Tips & knowledge",
    piWallet: "Pi Wallet",
    maps: "Maps & analytics",
    temperature: "Temperature",
    humidity: "Humidity",
    wind: "Wind",
    location: "Location",
    farmers: "farmers",
    productsCount: "products",
    recommended: "Recommended",
    distance: "km",
    day: "day",
    days: "days",
    dismissed: "Dismissed",
    show: "Show",
  },
  es: {
    greetings: "Hola",
    dashboard: "Tablero",
    online: "En línea",
    offline: "Desconectado",
    alerts: "Alertas",
    tips: "Consejos del día",
    weather: "Clima agrícola",
    forecast: "Pronóstico",
    quickAccess: "Acceso rápido",
    nearbyNetwork: "Red cercana",
    products: "Productos",
    services: "Servicios",
    activities: "Actividades recientes",
    news: "Noticias",
    viewAll: "Ver todo",
    contact: "Contactar",
    available: "Disponible",
    soldOut: "Agotado",
    busy: "Ocupado",
    urgent: "Urgente",
    payWithPi: "Pagar con Pi",
    priceInPi: "Precio en Pi",
    myFarm: "Mi granja",
    localMarket: "Mercado local",
    farmerNetwork: "Red de agricultores",
    knowledge: "Consejos y saber",
    piWallet: "Billetera Pi",
    maps: "Mapas y análisis",
    temperature: "Temperatura",
    humidity: "Humedad",
    wind: "Viento",
    location: "Ubicación",
    farmers: "agricultores",
    productsCount: "productos",
    recommended: "Recomendado",
    distance: "km",
    day: "día",
    days: "días",
    dismissed: "Descartado",
    show: "Mostrar",
  },
  pt: {
    greetings: "Olá",
    dashboard: "Painel",
    online: "Online",
    offline: "Offline",
    alerts: "Alertas",
    tips: "Dicas do dia",
    weather: "Clima agrícola",
    forecast: "Previsão",
    quickAccess: "Acesso rápido",
    nearbyNetwork: "Rede próxima",
    products: "Produtos",
    services: "Serviços",
    activities: "Atividades recentes",
    news: "Notícias",
    viewAll: "Ver tudo",
    contact: "Contatar",
    available: "Disponível",
    soldOut: "Esgotado",
    busy: "Ocupado",
    urgent: "Urgente",
    payWithPi: "Pagar com Pi",
    priceInPi: "Preço em Pi",
    myFarm: "Minha fazenda",
    localMarket: "Mercado local",
    farmerNetwork: "Rede de agricultores",
    knowledge: "Dicas e conhecimento",
    piWallet: "Carteira Pi",
    maps: "Mapas e análises",
    temperature: "Temperatura",
    humidity: "Umidade",
    wind: "Vento",
    location: "Localização",
    farmers: "agricultores",
    productsCount: "produtos",
    recommended: "Recomendado",
    distance: "km",
    day: "dia",
    days: "dias",
    dismissed: "Descartado",
    show: "Mostrar",
  },
  dioula: {
    greetings: "I ni ce",
    dashboard: "Jatigila",
    online: "Ɛ ye",
    offline: "Ɛ tɛ ye",
    alerts: "Kununnakanw",
    tips: "Halikimɔgɔya",
    weather: "Jɛkulu",
    forecast: "Sini fɛ",
    quickAccess: "Fara ka da",
    nearbyNetwork: "Surunyaw",
    products: "Fenigw",
    services: "Jɛkuluw",
    activities: "Baarakɛw",
    news: "Kunnafonw",
    viewAll: "Bɛɛ ye",
    contact: "Se ka jatemɛ",
    available: "Sɔrɔlen",
    soldOut: "Ban",
    busy: "Sɔrɔlen tɛ",
    urgent: "Surunya",
    payWithPi: "Sara Pi ye",
    priceInPi: "Saro Pi la",
    myFarm: "N ka foroba",
    localMarket: "Sigida sugu",
    farmerNetwork: "Demɛsɔnw",
    knowledge: "Haliki & dɔnniya",
    piWallet: "Pi Portefeuille",
    maps: "Karatigɛ & analiziw",
    temperature: "Kalan",
    humidity: "Jiɲa",
    wind: "Finyɛ",
    location: "Bɔyɔrɔ",
    farmers: "senekɛlaw",
    productsCount: "fenigw",
    recommended: "Aɲinɛ",
    distance: "km",
    day: "don",
    days: "donw",
    dismissed: "Labana",
    show: "Jira",
  },
  mooré: {
    greetings: "Yelé maanega",
    dashboard: "Tablɛɛto",
    online: "Lin lam",
    offline: "Lin ka lam ye",
    alerts: "Gʋlsgɑ tʋʋmɩ",
    tips: "Daasgɑ wilma",
    weather: "Tɩɩsgɑ",
    forecast: "Beoogo wilma",
    quickAccess: "Sõms-yɛng tũum",
    nearbyNetwork: "Mam n pungẽ nebɑ",
    products: "Biz-ɑtɑlɑ",
    services: "Tʋʋm-tʋmdba",
    activities: "Rɩklɑ tʋʋmba",
    news: "Goam sɛb-nɑ-tɑmbɑ",
    viewAll: "Fɑa yɑɑ",
    contact: "Gomd-bi-bɑlɑ",
    available: "Be yɑɑm",
    soldOut: "Ka be ye",
    busy: "Tʋʋmɑ dʋkɑ",
    urgent: "Sõng-n-wʋsgɑ",
    payWithPi: "Feef Pi rɩ",
    priceInPi: "Pees Pi pugɑ",
    myFarm: "Mɑm koom",
    localMarket: "Raooodgɑ",
    farmerNetwork: "Koos-yɑɑmbɑ",
    knowledge: "Wilma & bãngrɑ",
    piWallet: "Pi Portefeuille",
    maps: "Kɑɑrtɑ & tɑɑb-lɑɑ",
    temperature: "Tɩɩsgɑ",
    humidity: "Mɑɑsgɑ",
    wind: "Sɑɑɩsgɑ",
    location: "Tengɑ",
    farmers: "koos-yɑɑmbɑ",
    productsCount: "Biz-ɑtɑlɑ",
    recommended: "Pɑɑʋgɑ",
    distance: "km",
    day: "dɑɑbɑ",
    days: "dɑɑbɑ",
    dismissed: "Lɑ dɑbɑ",
    show: "Wilma",
  },
}

export default function Dashboard({ currentLanguage, userRegion, onTabChange }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0)
  const [language, setLanguage] = useState(currentLanguage)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllProducts, setShowAllProducts] = useState(false)

  // Utilisation des hooks personnalisés
  const isOnline = useOnlineStatus()
  const [dismissedAlerts, setDismissedAlerts] = useLocalStorage<string[]>("dismissedAlerts", [])
  const [favoriteProducts, setFavoriteProducts] = useLocalStorage<string[]>("favoriteProducts", [])
  const debouncedSearch = useDebounce(searchQuery, 300)

  const t = translations[language as keyof typeof translations] || translations.fr

  const [weatherData] = useState({
    temperature: 32,
    condition: "Ensoleillé",
    icon: "☀️",
    humidity: 45,
    windSpeed: 12,
    advice: "Temps idéal pour les travaux de récolte",
    forecast: [
      { day: t.day === "jour" ? "Aujourd'hui" : "Today", temp: 32, icon: "☀️", condition: "Ensoleillé", advice: "Parfait pour la récolte" },
      { day: t.day === "jour" ? "Demain" : "Tomorrow", temp: 29, icon: "⛅", condition: "Nuageux", advice: "Bon moment pour les semis" },
      { day: t.day === "jour" ? "Après-demain" : "Day after", temp: 27, icon: "🌧️", condition: "Pluie", advice: "Évitez les pulvérisations" },
    ],
  })

  const [alerts] = useState([
    { id: "1", type: "weather", priority: "high", title: "Pluies importantes prévues", message: "Fortes pluies attendues demain après-midi", icon: "🌧️", actionable: true },
    { id: "2", type: "season", priority: "medium", title: "Période de semis optimale", message: "C'est le moment idéal pour semer le maïs", icon: "🌱", actionable: true },
    { id: "3", type: "market", priority: "low", title: "Hausse des prix", message: "Le prix du maïs a augmenté de 15%", icon: "📈", actionable: true },
  ])

  // Filtrer les alertes non masquées
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

  const [nearbyUsers] = useState([
    { id: "1", name: "Koffi Asante", distance: 2.3, specialty: "Maraîchage bio", online: true, rating: 4.8, verified: true },
    { id: "2", name: "Aminata Traoré", distance: 5.1, specialty: "Aviculture moderne", online: false, rating: 4.9, verified: true },
    { id: "3", name: "Ibrahim Sawadogo", distance: 8.7, specialty: "Céréales", online: true, rating: 4.6, verified: false },
  ])

  const [localProducts] = useState([
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

  const quickAccessModules = [
    { id: "exploitation", title: t.myFarm, icon: "🏡", color: "bg-green-500", tab: "aviculture" },
    { id: "market", title: t.localMarket, icon: "🏪", color: "bg-blue-500", tab: "services" },
    { id: "network", title: t.farmerNetwork, icon: "👥", color: "bg-purple-500", tab: "messages" },
    { id: "knowledge", title: t.knowledge, icon: "📚", color: "bg-orange-500", tab: "regional" },
    { id: "wallet", title: t.piWallet, icon: "💰", color: "bg-yellow-500", tab: "wallet" },
    { id: "analytics", title: t.maps, icon: "🗺️", color: "bg-indigo-500", tab: "geolocation" },
  ]

  const languageOptions = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "dioula", name: "Dioula", flag: "🌍" },
    { code: "mooré", name: "Mooré", flag: "🌾" },
  ]

  // Filtrer les produits par recherche
  const filteredProducts = localProducts.filter(product =>
    product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    product.seller.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 3)

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

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
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header avec statut réseau */}
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

              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold">{t.greetings} ! 👋</div>
            <div className="text-sm text-green-100">{formatTime(currentTime)} • {t.dashboard}</div>
            {!isOnline && (
              <div className="mt-2 text-xs text-yellow-200 bg-yellow-500/20 rounded-lg p-1">
                Mode hors ligne - Données en cache
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alertes et météo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Bell className="h-5 w-5 mr-2" />
            {t.alerts} & {t.tips}
            {dismissedAlerts.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {visibleAlerts.length}/{alerts.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Météo */}
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{weatherData.icon}</div>
                <div>
                  <div className="font-bold text-xl">{weatherData.temperature}°C</div>
                  <div className="text-sm text-gray-600">{weatherData.condition}</div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <div className="flex items-center"><Droplets className="h-3 w-3 mr-1" />{weatherData.humidity}%</div>
                    <div className="flex items-center"><Wind className="h-3 w-3 mr-1" />{weatherData.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-800 mb-2">{t.forecast}</div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="p-1" onClick={() => setCurrentAdviceIndex((prev) => (prev - 1 + 3) % 3)}>
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <div className="text-center min-w-[70px]">
                    <div className="text-2xl">{currentAdvice.icon}</div>
                    <div className="text-xs font-medium">{currentAdvice.temp}°</div>
                    <div className="text-xs text-gray-600">{currentAdvice.day}</div>
                  </div>
                  <Button size="sm" variant="ghost" className="p-1" onClick={() => setCurrentAdviceIndex((prev) => (prev + 1) % 3)}>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-2 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2">
                <Sprout className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">{t.tips}:</p>
              </div>
              <p className="text-sm text-green-700 mt-1">{currentAdvice.advice}</p>
            </div>
          </div>

          {/* Alertes avec bouton masquer */}
          <div className="space-y-2">
            {visibleAlerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className="p-3 border-l-4 border-l-red-500 bg-red-50 rounded-r-lg group relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{alert.icon}</span>
                    <span className="font-medium text-sm">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.actionable && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      <span className="text-xs text-gray-400">✕</span>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            ))}
          </div>

          {dismissedAlerts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-gray-400"
              onClick={() => setDismissedAlerts([])}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              {t.show} {dismissedAlerts.length} alertes masquées
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Accès rapide */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Activity className="h-5 w-5 mr-2" />
            {t.quickAccess}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickAccessModules.map((module) => (
              <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => onTabChange(module.tab)}>
                <CardContent className="p-3 text-center">
                  <div className="text-3xl mb-1">{module.icon}</div>
                  <h3 className="font-semibold text-xs">{module.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Réseau à proximité */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Map className="h-5 w-5 mr-2" />
              {t.nearbyNetwork}
            </CardTitle>
            <div className="relative w-32">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full px-2 py-1 text-xs border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-28 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-medium">{t.location}</p>
              <p className="text-xs text-gray-600">{nearbyUsers.length} {t.farmers} • {localProducts.length} {t.productsCount}</p>
            </div>
            <div className="absolute top-2 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-6 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          </div>

          {/* Agriculteurs */}
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center"><Users className="h-4 w-4 mr-1" /> {t.farmers}</h4>
            <div className="space-y-2">
              {nearbyUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
                        {user.name.charAt(0)}
                      </div>
                      {user.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.specialty} • {user.distance}km</p>
                      <div className="flex items-center"><Star className="h-3 w-3 text-yellow-400 fill-current" /><span className="text-xs ml-1">{user.rating}</span></div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1"><MessageSquare className="h-3 w-3" />{t.contact}</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Produits avec prix Pi et favoris */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm flex items-center"><ShoppingCart className="h-4 w-4 mr-1" /> {t.products}</h4>
              {filteredProducts.length > 3 && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowAllProducts(!showAllProducts)}>
                  {showAllProducts ? "Voir moins" : `+${filteredProducts.length - 3}`}
                </Button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {displayedProducts.map((product) => (
                <Card key={product.id} className="flex-shrink-0 w-44 cursor-pointer hover:shadow-md relative group">
                  <CardContent className="p-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleToggleFavorite(product.id)}
                    >
                      <Star className={`h-3 w-3 ${favoriteProducts.includes(product.id) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                    </Button>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-2xl">{product.image}</div>
                      <div className="flex-1">
                        <p className="font-medium text-xs">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.seller}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <div className="flex items-center gap-0.5">
                          <Pi className="h-3 w-3 text-purple-600" />
                          <p className="font-bold text-sm text-purple-600">{product.pricePi} π</p>
                        </div>
                        <p className="text-xs text-gray-400">{product.unit}</p>
                      </div>
                      <Badge variant={product.available ? "default" : "secondary"} className={product.available ? "bg-green-600 text-xs" : "text-xs"}>
                        {product.available ? t.available : t.soldOut}
                      </Badge>
                    </div>
                    {favoriteProducts.includes(product.id) && (
                      <div className="absolute -top-1 -left-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Services avec prix Pi */}
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center"><Tractor className="h-4 w-4 mr-1" /> {t.services}</h4>
            <div className="space-y-2">
              {localServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-gray-600">{service.provider} • {service.distance}km</p>
                    <div className="flex items-center gap-0.5">
                      <Pi className="h-3 w-3 text-purple-600" />
                      <p className="text-xs font-medium text-purple-600">{service.pricePi} π{service.unit && `/${service.unit}`}</p>
                    </div>
                  </div>
                  <Button size="sm" disabled={!service.available} className={service.available ? "bg-purple-600 hover:bg-purple-700 gap-1" : ""}>
                    <Pi className="h-3 w-3" />
                    {t.payWithPi}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activités récentes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Activity className="h-5 w-5 mr-2" />
            {t.activities}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { icon: "🌾", title: "Nouvelle parcelle ajoutée", desc: "Parcelle de riz de 2 hectares", category: "exploitation" },
              { icon: "👥", title: "Nouveau membre", desc: "Awa Ouédraogo a rejoint votre réseau", category: "réseau" },
              { icon: "💰", title: "Transaction Pi réussie", desc: "Vous avez reçu 0.008π", category: "finance" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">{t.viewAll}</Button>
        </CardContent>
      </Card>
    </div>
  )
}