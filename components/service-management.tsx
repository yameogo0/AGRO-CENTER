"use client"

import { useState, useEffect, useCallback } from "react"
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
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { servicesApi } from "@/lib/api/services"
import { piApi } from "@/lib/api/pi"
import { formatPiAmount, showToast } from "@/lib/utils"

interface ServiceManagementProps {
  currentLanguage: string
  userRegion: string
}

// Traductions multilingues (gardez vos traductions existantes)
const translations = { /* ... vos traductions ... */ }

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
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { userData, isAuthenticated } = usePiAuth()
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  // États pour les données
  const [services, setServices] = useState<any[]>([])
  const [myServices, setMyServices] = useState<any[]>([])
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

  // Charger les services depuis l'API
  const fetchServices = useCallback(async () => {
    if (!isOnline) return
    
    setIsLoadingServices(true)
    try {
      const { data } = await servicesApi.getAll({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: debouncedSearch,
      })
      if (data && data.length > 0) {
        setServices(data)
      }
    } catch (error) {
      console.error("Erreur chargement services:", error)
      // Fallback sur localStorage si API indisponible
      const fallback = localStorage.getItem("availableServices")
      if (fallback) {
        setServices(JSON.parse(fallback))
      }
    } finally {
      setIsLoadingServices(false)
    }
  }, [isOnline, selectedCategory, debouncedSearch])

  // Charger mes services depuis l'API
  const fetchMyServices = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return
    
    setIsLoadingMyServices(true)
    try {
      const { data } = await servicesApi.getMine()
      if (data && data.length > 0) {
        setMyServices(data)
        // Sauvegarder en local
        localStorage.setItem("myServices", JSON.stringify(data))
      } else {
        // Fallback localStorage
        const fallback = localStorage.getItem("myServices")
        if (fallback) {
          setMyServices(JSON.parse(fallback))
        }
      }
    } catch (error) {
      console.error("Erreur chargement mes services:", error)
      const fallback = localStorage.getItem("myServices")
      if (fallback) {
        setMyServices(JSON.parse(fallback))
      }
    } finally {
      setIsLoadingMyServices(false)
    }
  }, [isAuthenticated, isOnline])

  // Synchroniser avec le backend
  const syncWithBackend = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise pour synchroniser", "error")
      return
    }

    setIsSyncing(true)
    try {
      await Promise.all([
        fetchServices(),
        fetchMyServices(),
      ])
      showToast("Synchronisation réussie", "success")
    } catch (error) {
      showToast("Erreur lors de la synchronisation", "error")
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline, fetchServices, fetchMyServices])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (isOnline) {
      fetchServices()
      if (isAuthenticated) {
        fetchMyServices()
      }
    } else {
      // Mode offline : charger depuis localStorage
      const localServices = localStorage.getItem("availableServices")
      if (localServices) setServices(JSON.parse(localServices))
      const localMyServices = localStorage.getItem("myServices")
      if (localMyServices) setMyServices(JSON.parse(localMyServices))
    }
  }, [isOnline, fetchServices, fetchMyServices, isAuthenticated])

  const handleCreateService = async () => {
    if (!newService.title || !newService.category || !newService.price) {
      showToast("Veuillez remplir tous les champs obligatoires", "error")
      return
    }

    if (!isOnline) {
      showToast("Connexion internet requise pour créer un service", "error")
      return
    }

    if (!isAuthenticated) {
      showToast("Veuillez vous connecter avec Pi Network", "error")
      return
    }

    setIsLoading(true)
    try {
      const serviceData = {
        title: newService.title,
        description: newService.description,
        category: newService.category,
        price: parseFloat(newService.price),
        duration: newService.duration,
        location: newService.location || userRegion,
        availability: newService.availability,
        requirements: newService.requirements,
      }

      const { data } = await servicesApi.create(serviceData)
      
      // Mettre à jour les listes
      setServices([data, ...services])
      setMyServices([{
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        status: "active",
        bookings: 0,
        earnings: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
      }, ...myServices])

      // Sauvegarder en local
      localStorage.setItem("availableServices", JSON.stringify([data, ...services]))
      localStorage.setItem("myServices", JSON.stringify([{
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        status: "active",
        bookings: 0,
        earnings: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
      }, ...myServices]))

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
    } catch (error: any) {
      console.error("Erreur création service:", error)
      showToast(error.message || "Erreur lors de la création", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    if (!isOnline) {
      showToast("Connexion internet requise pour supprimer", "error")
      return
    }

    setIsLoading(true)
    try {
      await servicesApi.delete(id)
      
      setMyServices(myServices.filter(s => s.id !== id))
      setServices(services.filter(s => s.id !== id))
      
      localStorage.setItem("myServices", JSON.stringify(myServices.filter(s => s.id !== id)))
      localStorage.setItem("availableServices", JSON.stringify(services.filter(s => s.id !== id)))
      
      setShowDeleteConfirm(null)
      showToast(t.serviceDeleted, "success")
    } catch (error) {
      console.error("Erreur suppression:", error)
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
      // Envoyer le paiement Pi
      await piApi.sendPayment(serviceId, price, `Réservation de service: ${serviceId}`)
      
      // Créer la réservation
      const { data } = await servicesApi.createBooking(serviceId)
      
      showToast(`Réservation confirmée pour ${price} π`, "success")
    } catch (error) {
      console.error("Erreur réservation:", error)
      showToast("Erreur lors de la réservation", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { id: "all", name: t.allCategories, count: services.length + myServices.length },
    { id: "veterinary", name: t.veterinary, count: services.filter(s => s.category === "veterinary").length },
    { id: "training", name: t.training, count: services.filter(s => s.category === "training").length + myServices.filter(s => s.category === "training").length },
    { id: "consulting", name: t.consulting, count: services.filter(s => s.category === "consulting").length + myServices.filter(s => s.category === "consulting").length },
    { id: "equipment", name: t.equipment, count: services.filter(s => s.category === "equipment").length },
    { id: "feed", name: t.feed, count: services.filter(s => s.category === "feed").length },
    { id: "processing", name: t.processing, count: services.filter(s => s.category === "processing").length },
    { id: "marketing", name: t.marketing, count: services.filter(s => s.category === "marketing").length },
    { id: "finance", name: t.finance, count: services.filter(s => s.category === "finance").length },
  ]

  const totalRevenue = myServices.reduce((sum, s) => sum + (s.earnings || 0), 0)
  const totalBookings = myServices.reduce((sum, s) => sum + (s.bookings || 0), 0)
  const avgRating = myServices.reduce((sum, s) => sum + (s.rating || 0), 0) / (myServices.length || 1)

  // Afficher un loader pendant le chargement
  if (isLoadingServices && services.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement des services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton synchronisation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold">{t.title}</h2>
            {!isOnline && (
              <Badge className="bg-yellow-500 text-white text-xs gap-1 ml-2">
                <WifiOff className="h-3 w-3" />
                {t.offline}
              </Badge>
            )}
            {isSyncing && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            )}
          </div>
          <p className="text-gray-500 mt-1">{t.subtitle} - {userRegion}</p>
        </div>
        <div className="flex gap-2">
          {isOnline && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncWithBackend}
              disabled={isSyncing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              Synchroniser
            </Button>
          )}
          <Dialog open={showCreateService} onOpenChange={setShowCreateService}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 gap-2" disabled={!isOnline}>
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
                      <SelectTrigger><SelectValue placeholder={t.selectCategory} /></SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <p className="text-xs text-red-500 text-center">⚠️ Connexion internet requise pour créer un service</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs - le reste du JSX est identique à l'original */}
      {/* ... garder le reste du code JSX identique ... */}
    </div>
  )
}