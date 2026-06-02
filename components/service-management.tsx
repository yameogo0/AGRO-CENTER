"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Wallet,
  Pi,
  RefreshCw,
  AlertTriangle,
  Shield,
  Award,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Truck,
  Landmark,
  Megaphone,
  Utensils,
  Wifi,
  WifiOff,
  Loader2,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { showToast } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface ServiceManagementProps {
  currentLanguage: string
  userRegion: string
}

// Traductions multilingues
const translations: Record<string, any> = {
  fr: {
    title: "Services & Marketplace",
    subtitle: "Offres et prestations agricoles",
    createService: "Créer un service",
    newService: "Nouveau service",
    myServices: "Mes services",
    browse: "Explorer",
    stats: "Statistiques",
    allCategories: "Toutes catégories",
    veterinary: "Vétérinaire",
    training: "Formation",
    consulting: "Conseil",
    equipment: "Matériel",
    feed: "Alimentation",
    processing: "Transformation",
    marketing: "Marketing",
    finance: "Finance",
    serviceTitle: "Titre du service",
    description: "Description",
    category: "Catégorie",
    price: "Prix",
    duration: "Durée",
    location: "Localisation",
    requirements: "Prérequis",
    availability: "Disponibilité",
    available: "Disponible",
    busy: "Occupé",
    exTitle: "Ex: Consultation avicole",
    exDescription: "Description détaillée de votre service...",
    exDuration: "Ex: 2 heures",
    exLocation: "Ex: Ouagadougou",
    exRequirements: "Ex: Aucun prérequis",
    selectCategory: "Sélectionner une catégorie",
    pricePlaceholder: "0.008",
    serviceCreated: "Service créé avec succès",
    serviceDeleted: "Service supprimé",
    serviceUpdated: "Service mis à jour",
    bookingSuccess: "Réservation confirmée",
    bookingError: "Erreur lors de la réservation",
    insufficientBalance: "Solde insuffisant",
    confirmDelete: "Confirmer la suppression",
    deleteConfirmMessage: "Cette action est irréversible",
    cancel: "Annuler",
    delete: "Supprimer",
    book: "Réserver",
    contact: "Contacter",
    viewDetails: "Voir détails",
    totalRevenue: "Chiffre d'affaires",
    totalBookings: "Réservations",
    avgRating: "Note moyenne",
    activeServices: "Services actifs",
    online: "En ligne",
    offline: "Hors ligne",
    refresh: "Actualiser",
    sync: "Synchroniser",
    loading: "Chargement...",
    noServices: "Aucun service disponible",
    noMyServices: "Vous n'avez pas encore créé de service",
  },
  en: {
    title: "Services & Marketplace",
    subtitle: "Agricultural offers and services",
    createService: "Create service",
    newService: "New service",
    myServices: "My services",
    browse: "Browse",
    stats: "Stats",
    allCategories: "All categories",
    veterinary: "Veterinary",
    training: "Training",
    consulting: "Consulting",
    equipment: "Equipment",
    feed: "Feed",
    processing: "Processing",
    marketing: "Marketing",
    finance: "Finance",
    serviceTitle: "Service title",
    description: "Description",
    category: "Category",
    price: "Price",
    duration: "Duration",
    location: "Location",
    requirements: "Requirements",
    availability: "Availability",
    available: "Available",
    busy: "Busy",
    exTitle: "Ex: Poultry consultation",
    exDescription: "Detailed description of your service...",
    exDuration: "Ex: 2 hours",
    exLocation: "Ex: Ouagadougou",
    exRequirements: "Ex: No prerequisites",
    selectCategory: "Select category",
    pricePlaceholder: "0.008",
    serviceCreated: "Service created successfully",
    serviceDeleted: "Service deleted",
    serviceUpdated: "Service updated",
    bookingSuccess: "Booking confirmed",
    bookingError: "Booking error",
    insufficientBalance: "Insufficient balance",
    confirmDelete: "Confirm deletion",
    deleteConfirmMessage: "This action is irreversible",
    cancel: "Cancel",
    delete: "Delete",
    book: "Book",
    contact: "Contact",
    viewDetails: "View details",
    totalRevenue: "Revenue",
    totalBookings: "Bookings",
    avgRating: "Avg rating",
    activeServices: "Active services",
    online: "Online",
    offline: "Offline",
    refresh: "Refresh",
    sync: "Sync",
    loading: "Loading...",
    noServices: "No services available",
    noMyServices: "You haven't created any services yet",
  },
  es: {
    title: "Servicios & Marketplace",
    subtitle: "Ofertas y servicios agrícolas",
    createService: "Crear servicio",
    newService: "Nuevo servicio",
    myServices: "Mis servicios",
    browse: "Explorar",
    stats: "Estadísticas",
    allCategories: "Todas las categorías",
    veterinary: "Veterinario",
    training: "Formación",
    consulting: "Consultoría",
    equipment: "Equipo",
    feed: "Alimentación",
    processing: "Procesamiento",
    marketing: "Marketing",
    finance: "Finanzas",
    serviceTitle: "Título del servicio",
    description: "Descripción",
    category: "Categoría",
    price: "Precio",
    duration: "Duración",
    location: "Ubicación",
    requirements: "Requisitos",
    availability: "Disponibilidad",
    available: "Disponible",
    busy: "Ocupado",
    exTitle: "Ej: Consulta avícola",
    exDescription: "Descripción detallada...",
    exDuration: "Ej: 2 horas",
    exLocation: "Ej: Ouagadougou",
    exRequirements: "Ej: Sin requisitos",
    selectCategory: "Seleccionar categoría",
    pricePlaceholder: "0.008",
    serviceCreated: "Servicio creado",
    serviceDeleted: "Servicio eliminado",
    serviceUpdated: "Servicio actualizado",
    bookingSuccess: "Reserva confirmada",
    bookingError: "Error en reserva",
    insufficientBalance: "Saldo insuficiente",
    confirmDelete: "Confirmar eliminación",
    deleteConfirmMessage: "Esta acción es irreversible",
    cancel: "Cancelar",
    delete: "Eliminar",
    book: "Reservar",
    contact: "Contactar",
    viewDetails: "Ver detalles",
    totalRevenue: "Ingresos",
    totalBookings: "Reservas",
    avgRating: "Calificación media",
    activeServices: "Servicios activos",
    online: "En línea",
    offline: "Desconectado",
    refresh: "Actualizar",
    sync: "Sincronizar",
    loading: "Cargando...",
    noServices: "No hay servicios disponibles",
    noMyServices: "No has creado ningún servicio",
  },
  pt: {
    title: "Serviços & Marketplace",
    subtitle: "Ofertas e serviços agrícolas",
    createService: "Criar serviço",
    newService: "Novo serviço",
    myServices: "Meus serviços",
    browse: "Explorar",
    stats: "Estatísticas",
    allCategories: "Todas as categorias",
    veterinary: "Veterinário",
    training: "Formação",
    consulting: "Consultoria",
    equipment: "Equipamento",
    feed: "Alimentação",
    processing: "Processamento",
    marketing: "Marketing",
    finance: "Finanças",
    serviceTitle: "Título do serviço",
    description: "Descrição",
    category: "Categoria",
    price: "Preço",
    duration: "Duração",
    location: "Localização",
    requirements: "Pré-requisitos",
    availability: "Disponibilidade",
    available: "Disponível",
    busy: "Ocupado",
    exTitle: "Ex: Consulta avícola",
    exDescription: "Descrição detalhada...",
    exDuration: "Ex: 2 horas",
    exLocation: "Ex: Ouagadougou",
    exRequirements: "Ex: Sem pré-requisitos",
    selectCategory: "Selecionar categoria",
    pricePlaceholder: "0.008",
    serviceCreated: "Serviço criado",
    serviceDeleted: "Serviço removido",
    serviceUpdated: "Serviço atualizado",
    bookingSuccess: "Reserva confirmada",
    bookingError: "Erro na reserva",
    insufficientBalance: "Saldo insuficiente",
    confirmDelete: "Confirmar exclusão",
    deleteConfirmMessage: "Esta ação é irreversível",
    cancel: "Cancelar",
    delete: "Excluir",
    book: "Reservar",
    contact: "Contatar",
    viewDetails: "Ver detalhes",
    totalRevenue: "Receita",
    totalBookings: "Reservas",
    avgRating: "Avaliação média",
    activeServices: "Serviços ativos",
    online: "Online",
    offline: "Offline",
    refresh: "Atualizar",
    sync: "Sincronizar",
    loading: "Carregando...",
    noServices: "Nenhum serviço disponível",
    noMyServices: "Você ainda não criou serviços",
  },
}

// Icônes par catégorie
const categoryIcons: Record<string, { icon: string; emoji: string }> = {
  veterinary: { icon: "🏥", emoji: "🐕" },
  training: { icon: "🎓", emoji: "📚" },
  consulting: { icon: "💡", emoji: "🤝" },
  equipment: { icon: "🔧", emoji: "🚜" },
  feed: { icon: "🌾", emoji: "🐔" },
  processing: { icon: "🏭", emoji: "🥫" },
  marketing: { icon: "📢", emoji: "📈" },
  finance: { icon: "💰", emoji: "💳" },
}

// Données de démonstration
const demoAvailableServices = [
  {
    id: "1",
    title: "Consultation vétérinaire avicole",
    description: "Consultation complète pour votre élevage de volailles. Diagnostic, conseils et plan de vaccination.",
    category: "veterinary",
    price: 0.008,
    duration: "2 heures",
    provider: "Dr. Aminata Traoré",
    providerAvatar: "👩‍⚕️",
    location: "Ouagadougou",
    rating: 4.9,
    reviews: 23,
    available: true,
  },
  {
    id: "2",
    title: "Formation aviculture moderne",
    description: "Formation intensive de 3 jours sur les techniques d'élevage moderne et la gestion sanitaire.",
    category: "training",
    price: 0.015,
    duration: "3 jours",
    provider: "Coopérative YELEN",
    providerAvatar: "🏢",
    location: "Bobo-Dioulasso",
    rating: 4.7,
    reviews: 15,
    available: true,
  },
  {
    id: "3",
    title: "Location tracteur agricole",
    description: "Location de tracteur avec chauffeur pour labour, semis et transport.",
    category: "equipment",
    price: 25,
    duration: "Journée",
    provider: "Coopérative Mécanisation",
    providerAvatar: "🚜",
    location: "Koudougou",
    rating: 4.6,
    reviews: 8,
    available: true,
  },
]

const demoMyServices = [
  {
    id: "m1",
    title: "Conseil en agriculture durable",
    description: "Accompagnement personnalisé pour l'adoption de pratiques agricoles durables.",
    category: "consulting",
    price: 0.012,
    status: "active",
    bookings: 12,
    earnings: 0.144,
    rating: 4.8,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
]

export default function ServiceManagement({ currentLanguage, userRegion }: ServiceManagementProps) {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCreateService, setShowCreateService] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [language, setLanguage] = useState(currentLanguage)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { userData, isAuthenticated } = usePiAuth()
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  // États pour les données
  const [services, setServices] = useState<any[]>(demoAvailableServices)
  const [myServices, setMyServices] = useState<any[]>(demoMyServices)
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [isLoadingMyServices, setIsLoadingMyServices] = useState(false)

  const t = translations[language as keyof typeof translations] || translations.fr

  const [newService, setNewService] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    location: "",
    requirements: "",
    availability: "available",
  })

  // Rafraîchir les données
  const refreshData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setIsSyncing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      showToast("Données actualisées", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  const handleCreateService = async () => {
    if (!newService.title || !newService.category || !newService.price) {
      showToast("Veuillez remplir tous les champs obligatoires", "error")
      return
    }

    if (!isOnline) {
      showToast("Connexion internet requise pour créer un service", "error")
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newServiceData = {
        id: `m${Date.now()}`,
        title: newService.title,
        description: newService.description,
        category: newService.category,
        price: parseFloat(newService.price),
        status: "active",
        bookings: 0,
        earnings: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
      }
      
      setMyServices([newServiceData, ...myServices])
      setShowCreateService(false)
      setNewService({
        title: "",
        description: "",
        category: "",
        price: "",
        duration: "",
        location: "",
        requirements: "",
        availability: "available",
      })
      
      showToast(t.serviceCreated, "success")
    } catch (error) {
      showToast("Erreur lors de la création", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setMyServices(myServices.filter(s => s.id !== id))
      setShowDeleteConfirm(null)
      showToast(t.serviceDeleted, "success")
    } catch (error) {
      showToast("Erreur lors de la suppression", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookService = async (serviceId: string, price: number) => {
    if (!isOnline) {
      showToast("Connexion internet requise pour réserver", "error")
      return
    }

    if (!isAuthenticated) {
      showToast("Veuillez vous connecter avec Pi Network", "error")
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast(`Réservation confirmée pour ${price} π`, "success")
    } catch (error) {
      showToast("Erreur lors de la réservation", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { id: "all", name: t.allCategories, icon: "📋", count: services.length + myServices.length },
    { id: "veterinary", name: t.veterinary, icon: "🏥", count: services.filter(s => s.category === "veterinary").length + myServices.filter(s => s.category === "veterinary").length },
    { id: "training", name: t.training, icon: "🎓", count: services.filter(s => s.category === "training").length + myServices.filter(s => s.category === "training").length },
    { id: "consulting", name: t.consulting, icon: "💡", count: services.filter(s => s.category === "consulting").length + myServices.filter(s => s.category === "consulting").length },
    { id: "equipment", name: t.equipment, icon: "🔧", count: services.filter(s => s.category === "equipment").length },
    { id: "feed", name: t.feed, icon: "🌾", count: services.filter(s => s.category === "feed").length },
    { id: "processing", name: t.processing, icon: "🏭", count: services.filter(s => s.category === "processing").length },
    { id: "marketing", name: t.marketing, icon: "📢", count: services.filter(s => s.category === "marketing").length },
    { id: "finance", name: t.finance, icon: "💰", count: services.filter(s => s.category === "finance").length },
  ]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      service.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalRevenue = myServices.reduce((sum, s) => sum + (s.earnings || 0), 0)
  const totalBookings = myServices.reduce((sum, s) => sum + (s.bookings || 0), 0)
  const avgRating = myServices.length > 0 ? myServices.reduce((sum, s) => sum + (s.rating || 0), 0) / myServices.length : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header avec statut réseau */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Briefcase className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold">{t.title}</h2>
            {!isOnline && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 gap-1">
                <WifiOff className="h-3 w-3" />
                {t.offline}
              </Badge>
            )}
            {isOnline && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 gap-1">
                <Wifi className="h-3 w-3" />
                {t.online}
              </Badge>
            )}
            {isSyncing && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle} - {userRegion}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isSyncing || !isOnline}
            className="gap-1"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            {t.refresh}
          </Button>
          <Dialog open={showCreateService} onOpenChange={setShowCreateService}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 gap-1 text-sm" disabled={!isOnline}>
                <Plus className="h-4 w-4" />
                {t.createService}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Plus className="h-5 w-5 text-green-600" />
                  {t.newService}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t.serviceTitle} *</Label>
                  <Input 
                    value={newService.title} 
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })} 
                    placeholder={t.exTitle} 
                  />
                </div>
                <div>
                  <Label>{t.description} *</Label>
                  <Textarea 
                    value={newService.description} 
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })} 
                    placeholder={t.exDescription} 
                    rows={3} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.category} *</Label>
                    <Select value={newService.category} onValueChange={(v) => setNewService({ ...newService, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectCategory} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span>{cat.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t.price} (π) *</Label>
                    <Input 
                      type="number" 
                      step="0.001" 
                      value={newService.price} 
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })} 
                      placeholder={t.pricePlaceholder} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.duration}</Label>
                    <Input 
                      value={newService.duration} 
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })} 
                      placeholder={t.exDuration} 
                    />
                  </div>
                  <div>
                    <Label>{t.location}</Label>
                    <Input 
                      value={newService.location} 
                      onChange={(e) => setNewService({ ...newService, location: e.target.value })} 
                      placeholder={t.exLocation} 
                    />
                  </div>
                </div>
                <div>
                  <Label>{t.requirements}</Label>
                  <Textarea 
                    value={newService.requirements} 
                    onChange={(e) => setNewService({ ...newService, requirements: e.target.value })} 
                    placeholder={t.exRequirements} 
                    rows={2} 
                  />
                </div>
                <div>
                  <Label>{t.availability}</Label>
                  <Select value={newService.availability} onValueChange={(v) => setNewService({ ...newService, availability: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">{t.available}</SelectItem>
                      <SelectItem value="busy">{t.busy}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleCreateService} 
                  className="w-full bg-purple-600 hover:bg-purple-700 gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pi className="h-4 w-4" />
                  )}
                  {t.createService}
                </Button>
                {!isOnline && (
                  <p className="text-xs text-red-500 text-center">⚠️ {t.offline}</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse" className="gap-2">
            <Search className="h-4 w-4" />
            {t.browse}
          </TabsTrigger>
          <TabsTrigger value="my-services" className="gap-2">
            <Briefcase className="h-4 w-4" />
            {t.myServices}
          </TabsTrigger>
          <TabsTrigger value="stats" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            {t.stats}
          </TabsTrigger>
        </TabsList>

        {/* Onglet Explorer */}
        <TabsContent value="browse" className="mt-6 space-y-4">
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  className={`gap-1 whitespace-nowrap ${selectedCategory === cat.id ? "bg-green-600" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">{cat.count}</Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Liste des services */}
          {isLoadingServices ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{t.noServices}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredServices.map((service) => {
                const categoryIcon = categoryIcons[service.category] || { icon: "📦", emoji: "📦" }
                return (
                  <Card key={service.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl">
                            {service.providerAvatar || categoryIcon.emoji}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{service.title}</h3>
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                {service.available ? t.available : t.busy}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span>{service.rating}</span>
                                <span>({service.reviews})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{service.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{service.duration}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{service.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-600">{service.price} π</p>
                            <p className="text-xs text-gray-500">Prix estimé</p>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700 gap-1"
                            onClick={() => handleBookService(service.id, service.price)}
                            disabled={!service.available || isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Pi className="h-3 w-3" />
                            )}
                            {t.book}
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {t.contact}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Onglet Mes services */}
        <TabsContent value="my-services" className="mt-6 space-y-4">
          {isLoadingMyServices ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : myServices.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{t.noMyServices}</p>
              <Button 
                variant="outline" 
                className="mt-4 gap-2"
                onClick={() => setShowCreateService(true)}
              >
                <Plus className="h-4 w-4" />
                {t.createService}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                          {categoryIcons[service.category]?.emoji || "📦"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{service.title}</h3>
                            <Badge className={service.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                              {service.status === "active" ? t.available : t.busy}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">{service.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span>{service.rating || "Nouveau"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{service.bookings} réservations</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">{service.price} π</p>
                          <p className="text-xs text-gray-500">Gagné: {service.earnings} π</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="gap-1"
                          onClick={() => setShowDeleteConfirm(service.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          {t.delete}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Statistiques */}
        <TabsContent value="stats" className="mt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-purple-600">{totalRevenue.toFixed(4)} π</p>
                <p className="text-xs text-gray-500">{t.totalRevenue}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{totalBookings}</p>
                <p className="text-xs text-gray-500">{t.totalBookings}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">{t.avgRating}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">{myServices.length}</p>
                <p className="text-xs text-gray-500">{t.activeServices}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progression mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Janvier</span>
                    <span className="font-medium">2.5 π</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Février</span>
                    <span className="font-medium">4.2 π</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mars</span>
                    <span className="font-medium">6.8 π</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de confirmation de suppression */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t.confirmDelete}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{t.deleteConfirmMessage}</p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(null)}>
              {t.cancel}
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1 gap-2"
              onClick={() => showDeleteConfirm && handleDeleteService(showDeleteConfirm)}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {t.delete}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}