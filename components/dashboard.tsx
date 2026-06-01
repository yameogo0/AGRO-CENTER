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
} from "lucide-react"

interface DashboardProps {
  currentLanguage: string
  userRegion: string
  onTabChange: (tab: string) => void
}

interface WeatherData {
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  advice: string
  forecast: {
    day: string
    temp: number
    icon: string
    condition: string
    advice: string
  }[]
}

interface Alert {
  id: string
  type: "weather" | "season" | "market" | "health"
  priority: "high" | "medium" | "low"
  title: string
  message: string
  actionable: boolean
  timestamp: string
  icon: string
}

interface NearbyUser {
  id: string
  name: string
  distance: number
  specialty: string
  avatar: string
  online: boolean
  rating: number
  verified: boolean
}

interface LocalProduct {
  id: string
  name: string
  price: string
  unit: string
  seller: string
  distance: number
  image: string
  available: boolean
  category: string
}

interface LocalService {
  id: string
  name: string
  provider: string
  distance: number
  price: string
  available: boolean
  category: string
}

interface RecentActivity {
  id: string
  type: "personal" | "community" | "news"
  title: string
  description: string
  timestamp: string
  icon: string
  actionable: boolean
  category: string
}

export default function Dashboard({ currentLanguage, userRegion, onTabChange }: DashboardProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0)

  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 32,
    condition: "Ensoleillé",
    icon: "☀️",
    humidity: 45,
    windSpeed: 12,
    advice: "Temps idéal pour les travaux de récolte. Évitez l'arrosage en plein soleil.",
    forecast: [
      {
        day: "Aujourd'hui",
        temp: 32,
        icon: "☀️",
        condition: "Ensoleillé",
        advice: "Parfait pour la récolte du mil",
      },
      {
        day: "Demain",
        temp: 29,
        icon: "⛅",
        condition: "Nuageux",
        advice: "Bon moment pour les semis",
      },
      {
        day: "Après-demain",
        temp: 27,
        icon: "🌧️",
        condition: "Pluie",
        advice: "Évitez les pulvérisations",
      },
    ],
  })

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "weather",
      priority: "high",
      title: "Pluies importantes prévues",
      message: "Fortes pluies attendues demain après-midi. Protégez vos récoltes et évitez les pulvérisations.",
      actionable: true,
      timestamp: "2024-02-01T08:00:00Z",
      icon: "🌧️",
    },
    {
      id: "2",
      type: "season",
      priority: "medium",
      title: "Période de semis optimale",
      message: "C'est le moment idéal pour semer le maïs dans votre région. Conditions climatiques favorables.",
      actionable: true,
      timestamp: "2024-02-01T06:00:00Z",
      icon: "🌱",
    },
    {
      id: "3",
      type: "market",
      priority: "low",
      title: "Hausse des prix du mil",
      message: "Le prix du mil a augmenté de 15% sur le marché de Bobo-Dioulasso. Opportunité de vente.",
      actionable: false,
      timestamp: "2024-01-31T18:00:00Z",
      icon: "📈",
    },
  ])

  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([
    {
      id: "1",
      name: "Koffi Asante",
      distance: 2.3,
      specialty: "Maraîchage bio",
      avatar: "/placeholder.svg?height=40&width=40&text=KA",
      online: true,
      rating: 4.8,
      verified: true,
    },
    {
      id: "2",
      name: "Aminata Traoré",
      distance: 5.1,
      specialty: "Aviculture moderne",
      avatar: "/placeholder.svg?height=40&width=40&text=AT",
      online: false,
      rating: 4.9,
      verified: true,
    },
    {
      id: "3",
      name: "Ibrahim Sawadogo",
      distance: 8.7,
      specialty: "Céréales & légumineuses",
      avatar: "/placeholder.svg?height=40&width=40&text=IS",
      online: true,
      rating: 4.6,
      verified: false,
    },
  ])

  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([
    {
      id: "1",
      name: "Mangues Kent",
      price: "500",
      unit: "kg",
      seller: "Fatou Kaboré",
      distance: 1.8,
      image: "/placeholder.svg?height=60&width=60&text=🥭",
      available: true,
      category: "fruits",
    },
    {
      id: "2",
      name: "Engrais NPK 15-15-15",
      price: "25000",
      unit: "sac 50kg",
      seller: "Coopérative YELEN",
      distance: 3.2,
      image: "/placeholder.svg?height=60&width=60&text=🌾",
      available: true,
      category: "intrants",
    },
    {
      id: "3",
      name: "Poules pondeuses ISA",
      price: "3500",
      unit: "unité",
      seller: "Moussa Koné",
      distance: 6.5,
      image: "/placeholder.svg?height=60&width=60&text=🐔",
      available: false,
      category: "animaux",
    },
    {
      id: "4",
      name: "Semences de maïs",
      price: "8000",
      unit: "kg",
      seller: "INERA Burkina",
      distance: 4.2,
      image: "/placeholder.svg?height=60&width=60&text=🌽",
      available: true,
      category: "semences",
    },
  ])

  const [localServices, setLocalServices] = useState<LocalService[]>([
    {
      id: "1",
      name: "Location tracteur",
      provider: "Coopérative Mécanisation",
      distance: 10.5,
      price: "15000 FCFA/jour",
      available: true,
      category: "équipement",
    },
    {
      id: "2",
      name: "Transport produits",
      provider: "Transport Sahel",
      distance: 7.8,
      price: "100 FCFA/kg",
      available: true,
      category: "logistique",
    },
    {
      id: "3",
      name: "Consultation vétérinaire",
      provider: "Dr. Aminata Traoré",
      distance: 5.1,
      price: "0.008π",
      available: false,
      category: "conseil",
    },
  ])

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "personal",
      title: "Nouvelle parcelle ajoutée",
      description: "Vous avez enregistré une parcelle de riz de 2 hectares dans votre exploitation",
      timestamp: "2024-02-01T10:30:00Z",
      icon: "🌾",
      actionable: true,
      category: "exploitation",
    },
    {
      id: "2",
      type: "community",
      title: "Nouveau membre du réseau",
      description: "Awa Ouédraogo (spécialiste igname) a rejoint votre réseau local",
      timestamp: "2024-02-01T09:15:00Z",
      icon: "👥",
      actionable: false,
      category: "réseau",
    },
    {
      id: "3",
      type: "news",
      title: "Formation agriculture biologique",
      description: "Formation gratuite sur l'agriculture biologique à Bobo-Dioulasso le 15 février",
      timestamp: "2024-01-31T16:45:00Z",
      icon: "🎓",
      actionable: true,
      category: "formation",
    },
    {
      id: "4",
      type: "personal",
      title: "Transaction Pi réussie",
      description: "Vous avez reçu 0.008π pour votre consultation en aviculture",
      timestamp: "2024-01-31T14:20:00Z",
      icon: "💰",
      actionable: false,
      category: "finance",
    },
  ])

  const quickAccessModules = [
    {
      id: "exploitation",
      title: "Mon Exploitation",
      icon: "🏡", // Maison/ferme culturellement appropriée
      color: "bg-green-500",
      description: "Journal, parcelles, calendrier",
      tab: "aviculture",
      culturalIcon: Sprout,
    },
    {
      id: "market",
      title: "Marché Local",
      icon: "🏪", // Boutique/marché
      color: "bg-blue-500",
      description: "Acheter, vendre, prix",
      tab: "services",
      culturalIcon: Store,
    },
    {
      id: "network",
      title: "Réseau Agriculteurs",
      icon: "👥", // Groupe de personnes
      color: "bg-purple-500",
      description: "Messages, communauté",
      tab: "messages",
      culturalIcon: Users,
    },
    {
      id: "knowledge",
      title: "Conseils & Savoir",
      icon: "📚", // Livre de connaissances
      color: "bg-orange-500",
      description: "Guides, formations",
      tab: "regional",
      culturalIcon: BookOpen,
    },
    {
      id: "wallet",
      title: "Paiement π",
      icon: "💰", // Argent/portefeuille
      color: "bg-yellow-500",
      description: "Portefeuille Pi",
      tab: "wallet",
      culturalIcon: Wallet,
    },
    {
      id: "analytics",
      title: "Cartes & Analyses",
      icon: "🗺️", // Carte géographique
      color: "bg-indigo-500",
      description: "Sols, climat, données",
      tab: "geolocation",
      culturalIcon: Map,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    // Simulate network status
    const networkTimer = setInterval(() => {
      setIsOnline(Math.random() > 0.1) // 90% online
    }, 30000)

    // Rotate advice every 10 seconds
    const adviceTimer = setInterval(() => {
      setCurrentAdviceIndex((prev) => (prev + 1) % weatherData.forecast.length)
    }, 10000)

    return () => {
      clearInterval(timer)
      clearInterval(networkTimer)
      clearInterval(adviceTimer)
    }
  }, [weatherData.forecast.length])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getAlertIcon = (type: string, priority: string) => {
    if (priority === "high") return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (type === "weather") return <Cloud className="h-4 w-4 text-blue-500" />
    if (type === "season") return <Sprout className="h-4 w-4 text-green-500" />
    if (type === "market") return <TrendingUp className="h-4 w-4 text-purple-500" />
    return <Bell className="h-4 w-4 text-gray-500" />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const currentAdvice = weatherData.forecast[currentAdviceIndex]

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header - Bannière Supérieure */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            {/* Localisation Actuelle */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium text-sm">{userRegion}</span>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-1">
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Indicateurs de statut */}
            <div className="flex items-center space-x-3">
              {/* Statut réseau */}
              <div className="flex items-center space-x-2">
                {isOnline ? <Wifi className="h-4 w-4 text-green-300" /> : <WifiOff className="h-4 w-4 text-red-300" />}
                <span className="text-xs">{isOnline ? "En ligne" : "Hors ligne"}</span>
              </div>

              {/* Sélecteur de langue */}
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2">
                <Globe className="h-4 w-4" />
              </Button>

              {/* Icône de confidentialité */}
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2">
                <Shield className="h-4 w-4" />
              </Button>

              {/* Profil utilisateur */}
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 p-2">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Salutation personnalisée */}
          <div className="text-center">
            <div className="text-lg font-bold">Bonjour ! 👋</div>
            <div className="text-sm text-green-100">{formatTime(currentTime)} • Tableau de bord personnalisé</div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Mes Alertes & Conseils du Jour */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Bell className="h-5 w-5 mr-2" />
            Mes Alertes & Conseils du Jour
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Météo Agricole avec conseil rotatif */}
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{weatherData.icon}</div>
                <div>
                  <div className="font-bold text-xl">{weatherData.temperature}°C</div>
                  <div className="text-sm text-gray-600">{weatherData.condition}</div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Droplets className="h-3 w-3 mr-1" />
                      <span>{weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-3 w-3 mr-1" />
                      <span>{weatherData.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prévisions avec navigation */}
              <div className="text-right">
                <div className="text-sm font-medium text-blue-800 mb-2">Prévisions</div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() =>
                      setCurrentAdviceIndex(
                        (prev) => (prev - 1 + weatherData.forecast.length) % weatherData.forecast.length,
                      )
                    }
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <div className="text-center min-w-[80px]">
                    <div className="text-2xl">{currentAdvice.icon}</div>
                    <div className="text-xs font-medium">{currentAdvice.temp}°</div>
                    <div className="text-xs text-gray-600">{currentAdvice.day}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => setCurrentAdviceIndex((prev) => (prev + 1) % weatherData.forecast.length)}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Conseil agricole rotatif */}
            <div className="mt-2 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center space-x-2">
                <Sprout className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-800">Conseil du jour:</p>
              </div>
              <p className="text-sm text-green-700 mt-1">{currentAdvice.advice}</p>
            </div>
          </div>

          {/* Alertes prioritaires */}
          <div className="space-y-2">
            {alerts.slice(0, 2).map((alert) => (
              <div key={alert.id} className={`p-3 border-l-4 rounded-r-lg ${getPriorityColor(alert.priority)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{alert.icon}</span>
                    <span className="font-medium text-sm">{alert.title}</span>
                  </div>
                  {alert.actionable && <ChevronRight className="h-4 w-4 text-gray-400" />}
                </div>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            ))}
          </div>

          {alerts.length > 2 && (
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Voir toutes les alertes ({alerts.length})
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Modules d'Accès Rapide */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Activity className="h-5 w-5 mr-2" />
            Accès Rapide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickAccessModules.map((module) => (
              <Card
                key={module.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200"
                onClick={() => onTabChange(module.tab)}
              >
                <CardContent className="p-4 text-center">
                  {/* Icône culturelle */}
                  <div className="text-4xl mb-3">{module.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{module.title}</h3>
                  <p className="text-xs text-gray-600">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Le Réseau à Proximité */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <Map className="h-5 w-5 mr-2" />
              Réseau à Proximité
            </div>
            <Button variant="ghost" size="sm" onClick={() => onTabChange("messages")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Carte Miniature */}
          <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-blue-200/30"></div>
            <div className="relative z-10 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Votre Position</p>
              <p className="text-xs text-gray-600">
                {nearbyUsers.length} agriculteurs • {localProducts.length} produits
              </p>
            </div>
            {/* Points d'intérêt simulés */}
            <div className="absolute top-4 right-6 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-8 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="absolute top-8 left-12 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>

          {/* Agriculteurs Proches */}
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Agriculteurs Proches
            </h4>
            <div className="space-y-2">
              {nearbyUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-10 h-10 rounded-full" />
                      {user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                      {user.verified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">
                        {user.specialty} • {user.distance}km
                      </p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-xs">{user.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Contact
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Produits Disponibles */}
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Produits Disponibles
            </h4>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {localProducts.map((product) => (
                <Card key={product.id} className="flex-shrink-0 w-48 cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-12 h-12 rounded" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.seller}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-green-600">
                          {product.price} FCFA/{product.unit}
                        </p>
                        <p className="text-xs text-gray-500">{product.distance}km</p>
                      </div>
                      <Badge variant={product.available ? "default" : "secondary"}>
                        {product.available ? "Dispo" : "Épuisé"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Services Locaux */}
          <div>
            <h4 className="font-medium text-sm mb-3 flex items-center">
              <Tractor className="h-4 w-4 mr-2" />
              Services Disponibles
            </h4>
            <div className="space-y-2">
              {localServices.slice(0, 2).map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-gray-600">
                      {service.provider} • {service.distance}km
                    </p>
                    <p className="text-xs font-medium text-blue-600">{service.price}</p>
                  </div>
                  <Badge variant={service.available ? "default" : "secondary"}>
                    {service.available ? "Disponible" : "Occupé"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Activités Récentes & Actualités */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Activity className="h-5 w-5 mr-2" />
            Activités Récentes & Actualités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</p>
                </div>
                {activity.actionable && <ChevronRight className="h-4 w-4 text-gray-400" />}
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
            Voir plus d'activités
          </Button>
        </CardContent>
      </Card>

      {/* Actualités Communautaires */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Bell className="h-5 w-5 mr-2" />
            Actualités Communautaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "🎓 Formation Agriculture Biologique",
                description: "La coopérative YELEN organise une formation gratuite le 15 février à Bobo-Dioulasso",
                type: "formation",
                urgent: false,
                icon: "🎓",
              },
              {
                title: "💰 Subvention Gouvernementale",
                description:
                  "Nouvelles subventions disponibles pour l'achat d'équipements agricoles - Dossiers à déposer avant le 28 février",
                type: "finance",
                urgent: true,
                icon: "💰",
              },
              {
                title: "🌾 Vente Groupée de Semences",
                description: "Commande groupée de semences certifiées - Prix réduits de 20% jusqu'au 20 février",
                type: "marché",
                urgent: false,
                icon: "🌾",
              },
            ].map((news, index) => (
              <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{news.icon}</span>
                    <h4 className="font-medium text-sm">{news.title}</h4>
                  </div>
                  {news.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{news.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {news.type}
                  </Badge>
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
