"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Heart,
  Utensils,
  TrendingUp,
  Package,
  BarChart3,
  GraduationCap,
  Share2,
  Headphones,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Thermometer,
  Droplets,
  Egg,
  Clover,
  Syringe,
  Truck,
  DollarSign,
  Phone,
  Mail,
  ChevronRight,
  Wifi,
  WifiOff,
  Loader2,
  RefreshCw,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { showToast } from "@/lib/utils"

interface AvicultureManagementProps {
  currentLanguage: string
  userRegion: string
}

// Traductions multilingues complètes
const translations = {
  fr: {
    title: "Gestion Aviculture",
    subtitle: "Outils complets pour votre élevage de volailles",
    contactSupport: "Contact support",
    newBatch: "Nouveau lot",
    dailyProgram: "Programme du jour",
    weeklyProduction: "Production de la semaine",
    quickActions: "Actions rapides",
    healthAlerts: "Alertes sanitaires",
    vaccinationSchedule: "Calendrier de vaccination",
    feedStock: "Stock d'aliments",
    nutritionTips: "Conseils du nutritionniste",
    quickOrder: "Commander des aliments",
    availableServices: "Services disponibles",
    searchService: "Rechercher un service ou prestataire...",
    filter: "Filtrer",
    available: "Disponible",
    unavailable: "Indisponible",
    book: "Réserver",
    contact: "Contacter",
    dailyTip: "Conseil avicole du jour",
    online: "En ligne",
    offline: "Hors ligne",
    refresh: "Actualiser",
    loading: "Chargement...",
    totalBirds: "Volailles totales",
    dailyEggs: "Production œufs/jour",
    mortality: "Mortalité 7j",
    avgWeight: "Poids moyen",
    share: "Partager",
    viewDetails: "Voir détails",
    provider: "Prestataire",
    service: "Service",
    price: "Prix",
    location: "Localisation",
  },
  en: {
    title: "Poultry Management",
    subtitle: "Complete tools for your poultry farm",
    contactSupport: "Contact support",
    newBatch: "New batch",
    dailyProgram: "Daily program",
    weeklyProduction: "Weekly production",
    quickActions: "Quick actions",
    healthAlerts: "Health alerts",
    vaccinationSchedule: "Vaccination schedule",
    feedStock: "Feed stock",
    nutritionTips: "Nutritionist tips",
    quickOrder: "Order feed",
    availableServices: "Available services",
    searchService: "Search service or provider...",
    filter: "Filter",
    available: "Available",
    unavailable: "Unavailable",
    book: "Book",
    contact: "Contact",
    dailyTip: "Daily poultry tip",
    online: "Online",
    offline: "Offline",
    refresh: "Refresh",
    loading: "Loading...",
    totalBirds: "Total birds",
    dailyEggs: "Daily eggs",
    mortality: "7-day mortality",
    avgWeight: "Average weight",
    share: "Share",
    viewDetails: "View details",
    provider: "Provider",
    service: "Service",
    price: "Price",
    location: "Location",
  },
  es: {
    title: "Gestión Avícola",
    subtitle: "Herramientas completas para su granja avícola",
    contactSupport: "Contactar soporte",
    newBatch: "Nuevo lote",
    dailyProgram: "Programa diario",
    weeklyProduction: "Producción semanal",
    quickActions: "Acciones rápidas",
    healthAlerts: "Alertas sanitarias",
    vaccinationSchedule: "Calendario de vacunación",
    feedStock: "Stock de alimentos",
    nutritionTips: "Consejos del nutricionista",
    quickOrder: "Pedir alimentos",
    availableServices: "Servicios disponibles",
    searchService: "Buscar servicio o proveedor...",
    filter: "Filtrar",
    available: "Disponible",
    unavailable: "No disponible",
    book: "Reservar",
    contact: "Contactar",
    dailyTip: "Consejo avícola del día",
    online: "En línea",
    offline: "Desconectado",
    refresh: "Actualizar",
    loading: "Cargando...",
    totalBirds: "Aves totales",
    dailyEggs: "Huevos diarios",
    mortality: "Mortalidad 7d",
    avgWeight: "Peso medio",
    share: "Compartir",
    viewDetails: "Ver detalles",
    provider: "Proveedor",
    service: "Servicio",
    price: "Precio",
    location: "Ubicación",
  },
  pt: {
    title: "Gestão Avícola",
    subtitle: "Ferramentas completas para sua granja avícola",
    contactSupport: "Contatar suporte",
    newBatch: "Novo lote",
    dailyProgram: "Programa diário",
    weeklyProduction: "Produção semanal",
    quickActions: "Ações rápidas",
    healthAlerts: "Alertas sanitárias",
    vaccinationSchedule: "Calendário de vacinação",
    feedStock: "Estoque de ração",
    nutritionTips: "Dicas do nutricionista",
    quickOrder: "Pedir ração",
    availableServices: "Serviços disponíveis",
    searchService: "Pesquisar serviço ou prestador...",
    filter: "Filtrar",
    available: "Disponível",
    unavailable: "Indisponível",
    book: "Reservar",
    contact: "Contatar",
    dailyTip: "Dica avícola do dia",
    online: "Online",
    offline: "Offline",
    refresh: "Atualizar",
    loading: "Carregando...",
    totalBirds: "Aves totais",
    dailyEggs: "Ovos diários",
    mortality: "Mortalidade 7d",
    avgWeight: "Peso médio",
    share: "Compartilhar",
    viewDetails: "Ver detalhes",
    provider: "Fornecedor",
    service: "Serviço",
    price: "Preço",
    location: "Localização",
  },
}

// Types pour les services
interface Service {
  id: number
  provider: string
  service: string
  price: number
  rating: number
  location: string
  available: boolean
  phone: string
  image: string
  description?: string
  experience?: number
}

// Types pour les fermes
interface Farm {
  id: string
  name: string
  birds: number
  eggs: number
  mortalityRate?: number
  avgWeight?: number
  lastUpdated?: string
}

// Données de production
interface ProductionData {
  weeklyEggs: number[]
  mortality: number[]
  feedConsumption: number[]
  labels: string[]
}

export default function AvicultureManagement({ currentLanguage, userRegion }: AvicultureManagementProps) {
  const [activeTab, setActiveTab] = useState("gestion")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFarm, setSelectedFarm] = useState("ferme-a")
  const [language, setLanguage] = useState(currentLanguage)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData } = usePiAuth()
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [savedFarms, setSavedFarms] = useLocalStorage<Farm[]>("avicultureFarms", [
    { id: "ferme-a", name: "Ferme Principale", birds: 1250, eggs: 890, mortalityRate: 1.8, avgWeight: 2.1, lastUpdated: new Date().toISOString() },
    { id: "ferme-b", name: "Ferme Secondaire", birds: 800, eggs: 560, mortalityRate: 2.1, avgWeight: 1.9, lastUpdated: new Date().toISOString() },
  ])
  const [productionData, setProductionData] = useLocalStorage<ProductionData>("avicultureProduction", {
    weeklyEggs: [580, 620, 650, 670, 690, 710, 730],
    mortality: [2.1, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4],
    feedConsumption: [45, 47, 48, 50, 52, 53, 55],
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  })

  const t = translations[language as keyof typeof translations] || translations.fr

  const opportunities = [
    { id: "gestion", title: "Gestion", icon: Users, color: "bg-blue-500", count: 23 },
    { id: "surveillance", title: "Surveillance", icon: Heart, color: "bg-red-500", count: 18 },
    { id: "alimentation", title: "Alimentation", icon: Utensils, color: "bg-green-500", count: 15 },
    { id: "production", title: "Production", icon: TrendingUp, color: "bg-purple-500", count: 20 },
    { id: "inventaire", title: "Inventaire", icon: Package, color: "bg-orange-500", count: 12 },
    { id: "analyse", title: "Analyses", icon: BarChart3, color: "bg-indigo-500", count: 16 },
    { id: "formation", title: "Formation", icon: GraduationCap, color: "bg-pink-500", count: 25 },
    { id: "support", title: "Support", icon: Headphones, color: "bg-yellow-500", count: 8 },
  ]

  // Services disponibles avec prix Pi
  const [availableServices, setAvailableServices] = useState<Service[]>([
    { id: 1, provider: "Dr. Aminata Traoré", service: "Consultation vétérinaire", price: 0.008, rating: 4.9, location: "Ouagadougou", available: true, phone: "+226 70 12 34 56", image: "👩‍⚕️", description: "Consultation complète pour votre élevage", experience: 12 },
    { id: 2, provider: "Coopérative YELEN", service: "Formation aviculture", price: 0.015, rating: 4.7, location: "Bobo-Dioulasso", available: true, phone: "+226 70 23 45 67", image: "🏢", description: "Formation intensive de 3 jours", experience: 8 },
    { id: 3, provider: "TechAgri Solutions", service: "Analyse de données", price: 0.012, rating: 4.8, location: "Koudougou", available: false, phone: "+226 70 34 56 78", image: "📊", description: "Analyse prédictive et rapports", experience: 5 },
    { id: 4, provider: "Ferme Moderne", service: "Aliments certifiés", price: 0.025, rating: 4.9, location: "Banfora", available: true, image: "🌾", phone: "+226 70 45 67 89", description: "Alimentation biologique", experience: 15 },
    { id: 5, provider: "SantéVet", service: "Vaccination mobile", price: 0.005, rating: 4.6, location: "Ouahigouya", available: true, image: "💉", phone: "+226 70 56 78 90", description: "Vaccination à domicile", experience: 7 },
    { id: 6, provider: "AgriTech BF", service: "Système d'irrigation", price: 0.035, rating: 4.8, location: "Fada N'Gourma", available: true, image: "💧", phone: "+226 70 67 89 01", description: "Installation de goutte-à-goutte", experience: 10 },
    { id: 7, provider: "BioFarm", service: "Engrais naturels", price: 0.018, rating: 4.5, location: "Dédougou", available: true, image: "🌱", phone: "+226 70 78 90 12", description: "Fertilisants bio", experience: 6 },
  ])

  const filteredServices = availableServices.filter(s => 
    s.service.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.provider.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  // Conseils du jour
  const dailyTips = [
    { tip: "🌡️ Maintenez une température stable de 21-22°C dans le poulailler", priority: "high" },
    { tip: "💧 Assurez une eau fraîche et propre en permanence", priority: "high" },
    { tip: "🥚 Collectez les œufs 3 fois par jour pour éviter les cassures", priority: "medium" },
    { tip: "🧹 Nettoyez quotidiennement les mangeoires et abreuvoirs", priority: "high" },
    { tip: "📊 Notez les mortalités et pontes pour suivre les tendances", priority: "medium" },
    { tip: "🏠 Assurez une ventilation adéquate sans courants d'air", priority: "medium" },
    { tip: "⚕️ Isolez immédiatement les oiseaux malades", priority: "critical" },
  ]

  const [currentTip, setCurrentTip] = useState(dailyTips[0])

  // Rafraîchir les données
  const refreshData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise pour actualiser", "error")
      return
    }

    setIsRefreshing(true)
    try {
      // Simuler un appel API pour récupérer les données des fermes
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mettre à jour les données avec des valeurs aléatoires pour simuler
      const updatedFarms = savedFarms.map(farm => ({
        ...farm,
        eggs: farm.eggs + Math.floor(Math.random() * 20) - 10,
        birds: farm.birds + Math.floor(Math.random() * 30) - 15,
        lastUpdated: new Date().toISOString(),
      }))
      setSavedFarms(updatedFarms)
      
      // Mettre à jour la production
      const newWeeklyEggs = productionData.weeklyEggs.map(eggs => Math.max(500, eggs + Math.floor(Math.random() * 30) - 15))
      setProductionData({
        ...productionData,
        weeklyEggs: newWeeklyEggs,
      })
      
      showToast("Données actualisées avec succès", "success")
    } catch (error) {
      console.error("Erreur lors de l'actualisation:", error)
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline, savedFarms, setSavedFarms, productionData, setProductionData])

  // Réserver un service
  const handleBookService = async (service: Service) => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }

    if (!isAuthenticated) {
      showToast("Veuillez vous connecter avec Pi Network", "error")
      return
    }

    setIsLoading(true)
    try {
      // Simuler un paiement Pi
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast(`Service réservé pour ${service.price} π`, "success")
    } catch (error) {
      console.error("Erreur lors de la réservation:", error)
      showToast("Erreur lors de la réservation", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Partager les résultats
  const handleShare = async (platform: string) => {
    const shareText = `🐔 Mon élevage avicole: ${currentFarm?.birds || 0} volailles, ${currentFarm?.eggs || 0} œufs/jour sur Agro Multicenter Hinos!`
    const shareUrl = window.location.href
    
    try {
      switch (platform) {
        case "whatsapp":
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
          break
        case "twitter":
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")
          break
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, "_blank")
          break
        case "linkedin":
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
          break
        default:
          await navigator.clipboard.writeText(shareText)
          showToast("Lien copié dans le presse-papiers", "success")
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error)
    }
    setShowShareOptions(false)
  }

  // Changer le conseil du jour
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dailyTips.length)
    setCurrentTip(dailyTips[randomIndex])
  }, [])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  const currentFarm = savedFarms.find(f => f.id === selectedFarm) || savedFarms[0]

  // Déterminer la couleur du conseil selon la priorité
  const getTipColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-600 bg-red-50 border-red-200"
      case "high": return "text-green-600 bg-green-50 border-green-200"
      default: return "text-blue-600 bg-blue-50 border-blue-200"
    }
  }

  // Afficher un loader pendant le chargement
  if (savedFarms.length === 0 && isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-500">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* En-tête avec statut réseau et refresh */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Egg className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold">{t.title}</h2>
            {!isOnline && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-300 gap-1">
                <WifiOff className="h-3 w-3" />
                {t.offline}
              </Badge>
            )}
            {isOnline && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300 gap-1">
                <Wifi className="h-3 w-3" />
                {t.online}
              </Badge>
            )}
          </div>
          <p className="text-gray-500 mt-1">{t.subtitle} - {userRegion}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={refreshData}
            disabled={isRefreshing || !isOnline}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {t.refresh}
          </Button>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="mailto:support@agromc.com">
              <Mail className="h-4 w-4" />
              {t.contactSupport}
            </a>
          </Button>
          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
            {t.newBatch}
          </Button>
        </div>
      </div>

      {/* Onglets de navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          {opportunities.map((opp) => {
            const Icon = opp.icon
            return (
              <TabsTrigger 
                key={opp.id} 
                value={opp.id} 
                className="flex items-center gap-2 py-2 px-3 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <div className={`p-1 rounded-full ${opp.color} ${activeTab === opp.id ? 'bg-white/20' : 'bg-opacity-10'}`}>
                  <Icon className={`h-3.5 w-3.5 ${activeTab === opp.id ? 'text-white' : opp.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-xs hidden sm:inline">{opp.title}</span>
                <span className="text-[10px] text-muted-foreground hidden lg:inline">({opp.count})</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="gestion" className="mt-6">
          {/* Sélecteur de ferme avec persistance */}
          <div className="flex gap-2 flex-wrap mb-6">
            {savedFarms.map(farm => (
              <Button
                key={farm.id}
                variant={selectedFarm === farm.id ? "default" : "outline"}
                className={selectedFarm === farm.id ? "bg-green-600 hover:bg-green-700" : ""}
                onClick={() => setSelectedFarm(farm.id)}
              >
                {farm.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {farm.birds} 🐔
                </Badge>
              </Button>
            ))}
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-3 w-3" />
              Ajouter
            </Button>
          </div>

          {/* Statistiques dynamiques basées sur la ferme sélectionnée */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: t.totalBirds, value: currentFarm?.birds?.toLocaleString() || "0", icon: Users, change: "+8%", color: "text-blue-600", bgColor: "bg-blue-50" },
              { label: t.dailyEggs, value: currentFarm?.eggs?.toLocaleString() || "0", icon: Egg, change: "+5%", color: "text-yellow-600", bgColor: "bg-yellow-50" },
              { label: t.mortality, value: `${currentFarm?.mortalityRate || 1.8}%`, icon: Activity, change: "-0.3%", color: "text-green-600", bgColor: "bg-green-50" },
              { label: t.avgWeight, value: `${currentFarm?.avgWeight || 2.1} kg`, icon: TrendingUp, change: "+2%", color: "text-purple-600", bgColor: "bg-purple-50" },
            ].map((stat, i) => (
              <Card key={i} className="hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-green-600">{stat.change} vs semaine</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs gap-1"
                      onClick={() => setActiveTab("analyse")}
                    >
                      {t.viewDetails}
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions rapides */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                {t.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Button variant="outline" className="flex flex-col h-auto py-3 gap-1">
                  <Syringe className="h-5 w-5 text-green-600" />
                  <span className="text-xs">Vaccination</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-3 gap-1">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-xs">{t.quickOrder}</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-3 gap-1">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="text-xs">Rapport</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-3 gap-1">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span className="text-xs">Planning</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col h-auto py-3 gap-1 relative"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                >
                  <Share2 className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs">{t.share}</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto py-3 gap-1">
                  <ShoppingCart className="h-5 w-5 text-pink-600" />
                  <span className="text-xs">Marketplace</span>
                </Button>
              </div>
              
              {/* Options de partage */}
              {showShareOptions && (
                <div className="absolute z-10 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 flex gap-2">
                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => handleShare("whatsapp")}>
                    💬 WhatsApp
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => handleShare("twitter")}>
                    🐦 Twitter
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => handleShare("facebook")}>
                    📘 Facebook
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1" onClick={() => handleShare("copy")}>
                    📋 Copier
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Production graphique simplifiée */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{t.weeklyProduction}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-40">
                {productionData.weeklyEggs.map((eggs, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-green-500 rounded-t-lg transition-all duration-500 hover:bg-green-600"
                      style={{ height: `${(eggs / 800) * 100}px` }}
                    />
                    <span className="text-xs text-gray-500">{productionData.labels[i]}</span>
                    <span className="text-[10px] font-medium">{eggs}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveillance" className="mt-6">
          {/* Alerte sanitaire */}
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">⚠️ Alerte sanitaire dans votre région</p>
                  <p className="text-sm text-yellow-700">Cas de grippe aviaire signalés à 50km. Renforcez la biosécurité.</p>
                  <Button variant="link" className="text-yellow-800 p-0 h-auto mt-1 text-xs">
                    Voir les mesures de prévention →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statut de santé */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">État général</span>
                  <Badge className="bg-green-100 text-green-700">Bon</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Taux de mortalité normal</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Prochain rappel</span>
                  <Badge className="bg-blue-100 text-blue-700">5 jours</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Vaccination Newcastle</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Température</span>
                  <Badge className="bg-green-100 text-green-700">Normale</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-green-600" />
                  <span className="text-sm">21.5°C dans le poulailler</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alimentation" className="mt-6">
          {/* Stock d'aliments */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{t.feedStock}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Aliment croissance (2-4 semaines)</span>
                    <span className="font-medium">240 kg / 500 kg</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "48%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Aliment finition (5-8 semaines)</span>
                    <span className="font-medium">180 kg / 400 kg</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Compléments minéraux</span>
                    <span className="font-medium">85 kg / 150 kg</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "57%" }} />
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <Truck className="h-4 w-4" />
                  {t.quickOrder}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          {/* Recherche de services */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.searchService}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {t.filter}
            </Button>
          </div>

          {/* Liste des services */}
          <div className="space-y-4">
            {filteredServices.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Aucun service trouvé</p>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : (
              filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{service.image}</div>
                        <div>
                          <h4 className="font-semibold">{service.provider}</h4>
                          <p className="text-sm text-gray-600">{service.service}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span>{service.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{service.location}</span>
                            </div>
                            {service.experience && (
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                <span>{service.experience} ans</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">{service.price} π</p>
                          <p className="text-xs text-gray-500">Prix estimé</p>
                        </div>
                        <Button
                          size="sm"
                          variant={service.available ? "default" : "outline"}
                          className={service.available ? "bg-green-600 hover:bg-green-700" : ""}
                          disabled={!service.available || isLoading}
                          onClick={() => handleBookService(service)}
                        >
                          {service.available ? t.book : t.unavailable}
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`tel:${service.phone}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Conseils du jour - Footer */}
      <Card className={`border-2 ${getTipColor(currentTip.priority)} transition-all duration-300`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${getTipColor(currentTip.priority)}`}>
              <Clover className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">💡 {t.dailyTip}</p>
              <p className="text-sm mt-1">{currentTip.tip}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-shrink-0"
              onClick={() => {
                const currentIndex = dailyTips.findIndex(t => t.tip === currentTip.tip)
                const nextIndex = (currentIndex + 1) % dailyTips.length
                setCurrentTip(dailyTips[nextIndex])
              }}
            >
              Suivant →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}