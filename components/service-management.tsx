"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
} from "lucide-react"

interface ServiceManagementProps {
  currentLanguage: string
  userRegion: string
}

// Traductions multilingues
const translations = {
  fr: {
    title: "Gestion des Services",
    subtitle: "Découvrez et proposez des services agricoles",
    createService: "Proposer un service",
    browse: "Parcourir",
    myServices: "Mes services",
    bookings: "Réservations",
    analytics: "Analyses",
    search: "Rechercher des services...",
    filters: "Filtres",
    allCategories: "Tous les services",
    veterinary: "Services vétérinaires",
    training: "Formation & Éducation",
    consulting: "Conseil technique",
    equipment: "Équipements & Matériel",
    feed: "Alimentation animale",
    processing: "Transformation",
    marketing: "Marketing & Vente",
    finance: "Services financiers",
    available: "Disponible",
    busy: "Occupé",
    unavailable: "Indisponible",
    reservations: "réservations",
    bookNow: "Réserver",
    contact: "Contacter",
    save: "Sauvegarder",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Voir",
    reviews: "avis",
    active: "Actif",
    inactive: "Inactif",
    pending: "En attente",
    confirmed: "Confirmé",
    completed: "Terminé",
    cancelled: "Annulé",
    totalBookings: "Réservations totales",
    totalRevenue: "Revenus totaux",
    averageRating: "Note moyenne",
    satisfactionRate: "Taux de satisfaction",
    servicePerformance: "Performance des services",
    newService: "Créer un nouveau service",
    serviceTitle: "Titre du service",
    description: "Description",
    category: "Catégorie",
    price: "Prix (π)",
    duration: "Durée",
    location: "Localisation",
    requirements: "Prérequis (optionnel)",
    availability: "Disponibilité",
    selectCategory: "Sélectionnez une catégorie",
    exTitle: "Ex: Consultation vétérinaire aviculture",
    exDescription: "Décrivez votre service en détail...",
    exDuration: "Ex: 2 heures, 1 jour",
    exLocation: "Ville, région",
    exRequirements: "Conditions ou prérequis pour ce service...",
    pricePlaceholder: "0.000",
    confirmDelete: "Confirmer la suppression",
    deleteWarning: "Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.",
    cancel: "Annuler",
    noServices: "Aucun service trouvé",
    noMyServices: "Vous n'avez pas encore proposé de services",
    createFirstService: "Créer mon premier service",
    earnings: "Gains totaux",
    rating: "Note",
    tags: "Tags",
    provider: "Prestataire",
    verified: "Vérifié",
    recentBookings: "Réservations récentes",
    client: "Client",
    date: "Date",
    time: "Heure",
    amount: "Montant",
    status: "Statut",
    totalEarnings: "Gains totaux",
    bookingsCount: "Réservations",
    avgPrice: "Prix moyen",
    categoryIcon: "Catégorie",
  },
  en: {
    title: "Service Management",
    subtitle: "Discover and offer agricultural services",
    createService: "Offer a service",
    browse: "Browse",
    myServices: "My services",
    bookings: "Bookings",
    analytics: "Analytics",
    search: "Search services...",
    filters: "Filters",
    allCategories: "All services",
    veterinary: "Veterinary services",
    training: "Training & Education",
    consulting: "Technical consulting",
    equipment: "Equipment & Material",
    feed: "Animal feed",
    processing: "Processing",
    marketing: "Marketing & Sales",
    finance: "Financial services",
    available: "Available",
    busy: "Busy",
    unavailable: "Unavailable",
    reservations: "bookings",
    bookNow: "Book now",
    contact: "Contact",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    reviews: "reviews",
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    totalBookings: "Total bookings",
    totalRevenue: "Total revenue",
    averageRating: "Average rating",
    satisfactionRate: "Satisfaction rate",
    servicePerformance: "Service performance",
    newService: "Create a new service",
    serviceTitle: "Service title",
    description: "Description",
    category: "Category",
    price: "Price (π)",
    duration: "Duration",
    location: "Location",
    requirements: "Requirements (optional)",
    availability: "Availability",
    selectCategory: "Select a category",
    exTitle: "Ex: Veterinary poultry consultation",
    exDescription: "Describe your service in detail...",
    exDuration: "Ex: 2 hours, 1 day",
    exLocation: "City, region",
    exRequirements: "Conditions or prerequisites for this service...",
    pricePlaceholder: "0.000",
    confirmDelete: "Confirm deletion",
    deleteWarning: "Are you sure you want to delete this service? This action is irreversible.",
    cancel: "Cancel",
    noServices: "No services found",
    noMyServices: "You haven't offered any services yet",
    createFirstService: "Create my first service",
    earnings: "Total earnings",
    rating: "Rating",
    tags: "Tags",
    provider: "Provider",
    verified: "Verified",
    recentBookings: "Recent bookings",
    client: "Client",
    date: "Date",
    time: "Time",
    amount: "Amount",
    status: "Status",
    totalEarnings: "Total earnings",
    bookingsCount: "Bookings",
    avgPrice: "Average price",
    categoryIcon: "Category",
  },
  es: {
    title: "Gestión de Servicios",
    subtitle: "Descubre y ofrece servicios agrícolas",
    createService: "Ofrecer un servicio",
    browse: "Explorar",
    myServices: "Mis servicios",
    bookings: "Reservas",
    analytics: "Análisis",
    search: "Buscar servicios...",
    filters: "Filtros",
    allCategories: "Todos los servicios",
    veterinary: "Servicios veterinarios",
    training: "Formación y Educación",
    consulting: "Asesoría técnica",
    equipment: "Equipos y Material",
    feed: "Alimentación animal",
    processing: "Transformación",
    marketing: "Marketing y Ventas",
    finance: "Servicios financieros",
    available: "Disponible",
    busy: "Ocupado",
    unavailable: "No disponible",
    reservations: "reservas",
    bookNow: "Reservar",
    contact: "Contactar",
    save: "Guardar",
    edit: "Editar",
    delete: "Eliminar",
    view: "Ver",
    reviews: "opiniones",
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    confirmed: "Confirmado",
    completed: "Completado",
    cancelled: "Cancelado",
    totalBookings: "Reservas totales",
    totalRevenue: "Ingresos totales",
    averageRating: "Calificación promedio",
    satisfactionRate: "Tasa de satisfacción",
    servicePerformance: "Rendimiento de servicios",
    newService: "Crear nuevo servicio",
    serviceTitle: "Título del servicio",
    description: "Descripción",
    category: "Categoría",
    price: "Precio (π)",
    duration: "Duración",
    location: "Ubicación",
    requirements: "Requisitos (opcional)",
    availability: "Disponibilidad",
    selectCategory: "Seleccione una categoría",
    exTitle: "Ej: Consulta veterinaria avícola",
    exDescription: "Describa su servicio en detalle...",
    exDuration: "Ej: 2 horas, 1 día",
    exLocation: "Ciudad, región",
    exRequirements: "Condiciones o requisitos para este servicio...",
    pricePlaceholder: "0.000",
    confirmDelete: "Confirmar eliminación",
    deleteWarning: "¿Está seguro de eliminar este servicio? Esta acción es irreversible.",
    cancel: "Cancelar",
    noServices: "No se encontraron servicios",
    noMyServices: "Aún no has ofrecido servicios",
    createFirstService: "Crear mi primer servicio",
    earnings: "Ganancias totales",
    rating: "Calificación",
    tags: "Etiquetas",
    provider: "Proveedor",
    verified: "Verificado",
    recentBookings: "Reservas recientes",
    client: "Cliente",
    date: "Fecha",
    time: "Hora",
    amount: "Monto",
    status: "Estado",
    totalEarnings: "Ganancias totales",
    bookingsCount: "Reservas",
    avgPrice: "Precio promedio",
    categoryIcon: "Categoría",
  },
  pt: {
    title: "Gestão de Serviços",
    subtitle: "Descubra e ofereça serviços agrícolas",
    createService: "Oferecer serviço",
    browse: "Explorar",
    myServices: "Meus serviços",
    bookings: "Reservas",
    analytics: "Análises",
    search: "Pesquisar serviços...",
    filters: "Filtros",
    allCategories: "Todos os serviços",
    veterinary: "Serviços veterinários",
    training: "Formação e Educação",
    consulting: "Consultoria técnica",
    equipment: "Equipamentos e Materiais",
    feed: "Alimentação animal",
    processing: "Transformação",
    marketing: "Marketing e Vendas",
    finance: "Serviços financeiros",
    available: "Disponível",
    busy: "Ocupado",
    unavailable: "Indisponível",
    reservations: "reservas",
    bookNow: "Reservar",
    contact: "Contatar",
    save: "Salvar",
    edit: "Editar",
    delete: "Excluir",
    view: "Ver",
    reviews: "avaliações",
    active: "Ativo",
    inactive: "Inativo",
    pending: "Pendente",
    confirmed: "Confirmado",
    completed: "Concluído",
    cancelled: "Cancelado",
    totalBookings: "Reservas totais",
    totalRevenue: "Receita total",
    averageRating: "Avaliação média",
    satisfactionRate: "Taxa de satisfação",
    servicePerformance: "Desempenho dos serviços",
    newService: "Criar novo serviço",
    serviceTitle: "Título do serviço",
    description: "Descrição",
    category: "Categoria",
    price: "Preço (π)",
    duration: "Duração",
    location: "Localização",
    requirements: "Requisitos (opcional)",
    availability: "Disponibilidade",
    selectCategory: "Selecione uma categoria",
    exTitle: "Ex: Consulta veterinária avícola",
    exDescription: "Descreva seu serviço em detalhes...",
    exDuration: "Ex: 2 horas, 1 dia",
    exLocation: "Cidade, região",
    exRequirements: "Condições ou pré-requisitos para este serviço...",
    pricePlaceholder: "0.000",
    confirmDelete: "Confirmar exclusão",
    deleteWarning: "Tem certeza que deseja excluir este serviço? Esta ação é irreversível.",
    cancel: "Cancelar",
    noServices: "Nenhum serviço encontrado",
    noMyServices: "Você ainda não ofereceu serviços",
    createFirstService: "Criar meu primeiro serviço",
    earnings: "Ganhos totais",
    rating: "Avaliação",
    tags: "Tags",
    provider: "Fornecedor",
    verified: "Verificado",
    recentBookings: "Reservas recentes",
    client: "Cliente",
    date: "Data",
    time: "Hora",
    amount: "Valor",
    status: "Status",
    totalEarnings: "Ganhos totais",
    bookingsCount: "Reservas",
    avgPrice: "Preço médio",
    categoryIcon: "Categoria",
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

export default function ServiceManagement({ currentLanguage, userRegion }: ServiceManagementProps) {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCreateService, setShowCreateService] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [language, setLanguage] = useState(currentLanguage)

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

  const serviceCategories = [
    { id: "all", name: t.allCategories, count: 156 },
    { id: "veterinary", name: t.veterinary, count: 23 },
    { id: "training", name: t.training, count: 34 },
    { id: "consulting", name: t.consulting, count: 28 },
    { id: "equipment", name: t.equipment, count: 19 },
    { id: "feed", name: t.feed, count: 15 },
    { id: "processing", name: t.processing, count: 12 },
    { id: "marketing", name: t.marketing, count: 18 },
    { id: "finance", name: t.finance, count: 7 },
  ]

  const [availableServices, setAvailableServices] = useState([
    {
      id: "service1",
      title: "Consultation vétérinaire aviculture",
      description: "Diagnostic et traitement des maladies aviaires. Consultation à domicile ou en ligne.",
      provider: {
        name: "Dr. Aminata Traoré",
        avatar: "👩‍⚕️",
        rating: 4.9,
        reviews: 127,
        verified: true,
        location: "Ouagadougou",
      },
      category: "veterinary",
      price: 0.008,
      duration: "1 heure",
      availability: "available",
      tags: ["Aviculture", "Diagnostic", "Traitement"],
      bookings: 89,
      createdAt: "2024-01-15",
    },
    {
      id: "service2",
      title: "Formation complète en aviculture moderne",
      description: "Formation pratique sur les techniques modernes d'élevage de volailles.",
      provider: {
        name: "Coopérative YELEN",
        avatar: "🏢",
        rating: 4.7,
        reviews: 89,
        verified: true,
        location: "Bobo-Dioulasso",
      },
      category: "training",
      price: 0.025,
      duration: "3 jours",
      availability: "available",
      tags: ["Formation", "Aviculture", "Certification"],
      bookings: 156,
      createdAt: "2024-01-10",
    },
    {
      id: "service3",
      title: "Analyse nutritionnelle des aliments",
      description: "Service d'analyse de la qualité nutritionnelle des aliments pour volailles.",
      provider: {
        name: "TechAgri Solutions",
        avatar: "💻",
        rating: 4.8,
        reviews: 67,
        verified: true,
        location: "Koudougou",
      },
      category: "consulting",
      price: 0.012,
      duration: "2-3 jours",
      availability: "busy",
      tags: ["Nutrition", "Analyse", "Conseil"],
      bookings: 45,
      createdAt: "2024-01-08",
    },
  ])

  const [myServices, setMyServices] = useState([
    {
      id: "myservice1",
      title: "Conseil en gestion d'élevage",
      description: "Accompagnement personnalisé pour optimiser votre élevage de volailles.",
      category: "consulting",
      price: 0.015,
      status: "active",
      bookings: 23,
      earnings: 0.345,
      rating: 4.8,
      createdAt: "2024-01-20",
    },
    {
      id: "myservice2",
      title: "Formation pratique aviculture",
      description: "Formation sur site pour les techniques d'élevage moderne.",
      category: "training",
      price: 0.03,
      status: "active",
      bookings: 12,
      earnings: 0.36,
      rating: 4.9,
      createdAt: "2024-01-18",
    },
  ])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  const handleCreateService = () => {
    if (!newService.title || !newService.category || !newService.price) return

    const service = {
      id: `service${Date.now()}`,
      title: newService.title,
      description: newService.description,
      provider: {
        name: "Vous",
        avatar: "👤",
        rating: 0,
        reviews: 0,
        verified: true,
        location: newService.location || userRegion,
      },
      category: newService.category,
      price: parseFloat(newService.price),
      duration: newService.duration,
      availability: newService.availability,
      tags: [],
      bookings: 0,
      createdAt: new Date().toISOString(),
    }

    setAvailableServices([service, ...availableServices])
    setMyServices([{
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      status: "active",
      bookings: 0,
      earnings: 0,
      rating: 0,
      createdAt: service.createdAt,
    }, ...myServices])

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
  }

  const handleDeleteService = (id: string) => {
    setMyServices(myServices.filter(s => s.id !== id))
    setAvailableServices(availableServices.filter(s => s.id !== id))
    setShowDeleteConfirm(null)
  }

  const filteredServices = availableServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalRevenue = myServices.reduce((sum, s) => sum + s.earnings, 0)
  const totalBookings = myServices.reduce((sum, s) => sum + s.bookings, 0)
  const avgRating = myServices.reduce((sum, s) => sum + s.rating, 0) / (myServices.length || 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold">{t.title}</h2>
          </div>
          <p className="text-gray-500 mt-1">{t.subtitle} - {userRegion}</p>
        </div>
        <Dialog open={showCreateService} onOpenChange={setShowCreateService}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 gap-2">
              <Plus className="h-4 w-4" />
              {t.createService}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                {t.newService}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.serviceTitle}</Label>
                <Input value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} placeholder={t.exTitle} />
              </div>
              <div>
                <Label>{t.description}</Label>
                <Textarea value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} placeholder={t.exDescription} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t.category}</Label>
                  <Select value={newService.category} onValueChange={(v) => setNewService({ ...newService, category: v })}>
                    <SelectTrigger><SelectValue placeholder={t.selectCategory} /></SelectTrigger>
                    <SelectContent>
                      {serviceCategories.slice(1).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t.price} (π)</Label>
                  <Input type="number" step="0.001" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} placeholder={t.pricePlaceholder} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t.duration}</Label>
                  <Input value={newService.duration} onChange={(e) => setNewService({ ...newService, duration: e.target.value })} placeholder={t.exDuration} />
                </div>
                <div>
                  <Label>{t.location}</Label>
                  <Input value={newService.location} onChange={(e) => setNewService({ ...newService, location: e.target.value })} placeholder={t.exLocation} />
                </div>
              </div>
              <div>
                <Label>{t.availability}</Label>
                <Select value={newService.availability} onValueChange={(v) => setNewService({ ...newService, availability: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">{t.available}</SelectItem>
                    <SelectItem value="busy">{t.busy}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateService} className="w-full bg-purple-600 hover:bg-purple-700 gap-2">
                <Pi className="h-4 w-4" />
                {t.createService}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="browse" className="gap-2"><Search className="h-4 w-4" /><span className="hidden sm:inline">{t.browse}</span></TabsTrigger>
          <TabsTrigger value="my-services" className="gap-2"><Briefcase className="h-4 w-4" /><span className="hidden sm:inline">{t.myServices}</span></TabsTrigger>
          <TabsTrigger value="bookings" className="gap-2"><Calendar className="h-4 w-4" /><span className="hidden sm:inline">{t.bookings}</span></TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2"><TrendingUp className="h-4 w-4" /><span className="hidden sm:inline">{t.analytics}</span></TabsTrigger>
        </TabsList>

        {/* Onglet Parcourir */}
        <TabsContent value="browse" className="space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder={t.search} className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {serviceCategories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name} ({cat.count})</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* Catégories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {serviceCategories.slice(0, 8).map((cat) => {
              const iconInfo = categoryIcons[cat.id] || { icon: "📦", emoji: "🔧" }
              return (
                <Card key={cat.id} className={`cursor-pointer transition-all ${selectedCategory === cat.id ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"}`} onClick={() => setSelectedCategory(cat.id)}>
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-1">{iconInfo.icon}</div>
                    <p className="text-xs font-medium truncate">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.count}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Services */}
          {filteredServices.length === 0 ? (
            <Card><CardContent className="p-8 text-center"><Search className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">{t.noServices}</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-2xl">{service.provider.avatar}</div>
                        <div>
                          <div className="flex items-center gap-1"><p className="font-medium">{service.provider.name}</p>{service.provider.verified && <CheckCircle className="h-3 w-3 text-green-500" />}</div>
                          <div className="flex items-center gap-1 text-xs"><Star className="h-3 w-3 text-yellow-400 fill-current" /><span>{service.provider.rating}</span><span className="text-gray-400">({service.provider.reviews})</span></div>
                          <div className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="h-3 w-3" />{service.provider.location}</div>
                        </div>
                      </div>
                      <Badge className={service.availability === "available" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>{service.availability === "available" ? t.available : t.busy}</Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{service.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">{service.tags.map((tag, i) => (<Badge key={i} variant="outline" className="text-xs">{tag}</Badge>))}</div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3"><div className="flex items-center gap-1"><Clock className="h-3 w-3" />{service.duration}</div><div className="flex items-center gap-1"><Users className="h-3 w-3" />{service.bookings} {t.reservations}</div></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1"><Pi className="h-4 w-4 text-purple-600" /><span className="text-lg font-bold text-purple-600">{service.price} π</span></div><div className="flex gap-2"><Button size="sm" variant="outline" className="h-8"><MessageSquare className="h-3 w-3" /></Button><Button size="sm" disabled={service.availability !== "available"} className="bg-purple-600 hover:bg-purple-700 h-8">{t.bookNow}</Button></div></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Mes services */}
        <TabsContent value="my-services" className="space-y-4 mt-6">
          {myServices.length === 0 ? (
            <Card><CardContent className="p-8 text-center"><Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">{t.noMyServices}</p><Button className="mt-4" onClick={() => setShowCreateService(true)}><Plus className="h-4 w-4 mr-2" />{t.createFirstService}</Button></CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myServices.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">{service.title}</h3><div className="flex gap-1"><Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3 w-3" /></Button><Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => setShowDeleteConfirm(service.id)}><Trash2 className="h-3 w-3" /></Button></div></div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                    <div className="grid grid-cols-3 gap-2 mb-3"><div className="text-center p-2 bg-green-50 rounded-lg"><div className="text-lg font-bold text-green-600">{service.bookings}</div><div className="text-xs text-green-700">{t.bookingsCount}</div></div><div className="text-center p-2 bg-purple-50 rounded-lg"><div className="text-lg font-bold text-purple-600">{service.earnings} π</div><div className="text-xs text-purple-700">{t.earnings}</div></div><div className="text-center p-2 bg-yellow-50 rounded-lg"><div className="flex items-center justify-center gap-0.5"><Star className="h-3 w-3 text-yellow-400 fill-current" /><span className="text-lg font-bold">{service.rating}</span></div><div className="text-xs text-yellow-700">{t.rating}</div></div></div>
                    <div className="flex items-center justify-between"><div className="flex items-center gap-1"><Pi className="h-4 w-4 text-purple-600" /><span className="font-bold text-purple-600">{service.price} π</span></div><Badge className={service.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>{service.status === "active" ? t.active : t.inactive}</Badge></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Réservations */}
        <TabsContent value="bookings" className="space-y-4 mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />{t.recentBookings}</CardTitle></CardHeader><CardContent><div className="space-y-3">{[{ service: "Consultation vétérinaire", client: "Ibrahim Sawadogo", date: "2024-02-05", time: "14:00", status: "confirmed", amount: 0.008 },{ service: "Formation aviculture", client: "Marie Ouédraogo", date: "2024-02-08", time: "09:00", status: "pending", amount: 0.025 },{ service: "Conseil technique", client: "Paul Kaboré", date: "2024-02-10", time: "16:00", status: "completed", amount: 0.015 }].map((booking, i) => (<div key={i} className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{booking.client.charAt(0)}</div><div><p className="font-medium text-sm">{booking.service}</p><p className="text-xs text-gray-500">Client: {booking.client}</p><p className="text-xs text-gray-400">{booking.date} à {booking.time}</p></div></div><div className="text-right"><p className="font-bold text-purple-600">{booking.amount} π</p><Badge className={booking.status === "completed" ? "bg-green-100 text-green-700" : booking.status === "confirmed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}>{booking.status === "completed" ? t.completed : booking.status === "confirmed" ? t.confirmed : t.pending}</Badge></div></div>))}</div></CardContent></Card>
        </TabsContent>

        {/* Onglet Analyses */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-3 text-center"><div className="text-xl font-bold text-blue-600">{totalBookings}</div><div className="text-xs text-gray-500">{t.totalBookings}</div></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><div className="text-xl font-bold text-green-600">{totalRevenue.toFixed(3)} π</div><div className="text-xs text-gray-500">{t.totalRevenue}</div></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><div className="flex items-center justify-center gap-0.5"><Star className="h-3 w-3 text-yellow-400 fill-current" /><span className="text-xl font-bold text-yellow-600">{avgRating.toFixed(1)}</span></div><div className="text-xs text-gray-500">{t.averageRating}</div></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><div className="text-xl font-bold text-purple-600">94%</div><div className="text-xs text-gray-500">{t.satisfactionRate}</div></CardContent></Card>
          </div>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />{t.servicePerformance}</CardTitle></CardHeader><CardContent><div className="space-y-3">{myServices.map((service) => (<div key={service.id} className="p-3 bg-gray-50 rounded-lg"><div className="flex items-center justify-between mb-2"><h4 className="font-medium text-sm">{service.title}</h4><div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400 fill-current" /><span>{service.rating}</span></div></div><div className="grid grid-cols-3 gap-2 text-xs"><div><span className="text-gray-500">{t.bookingsCount}:</span><span className="font-medium ml-1">{service.bookings}</span></div><div><span className="text-gray-500">{t.earnings}:</span><span className="font-medium ml-1 text-green-600">{service.earnings} π</span></div><div><span className="text-gray-500">{t.avgPrice}:</span><span className="font-medium ml-1 text-purple-600">{service.price} π</span></div></div></div>))}</div></CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Modal de confirmation suppression */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertTriangle className="h-5 w-5" />{t.confirmDelete}</DialogTitle></DialogHeader>
          <p className="text-gray-600">{t.deleteWarning}</p>
          <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(null)}>{t.cancel}</Button><Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => showDeleteConfirm && handleDeleteService(showDeleteConfirm)}>{t.delete}</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  )
}