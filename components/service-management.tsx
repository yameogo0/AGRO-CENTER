"use client"

import { useState } from "react"
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
} from "lucide-react"

interface ServiceManagementProps {
  currentLanguage: string
  userRegion: string
}

export default function ServiceManagement({ currentLanguage, userRegion }: ServiceManagementProps) {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showCreateService, setShowCreateService] = useState(false)

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
    { id: "all", name: "Tous les services", count: 156 },
    { id: "veterinary", name: "Services vétérinaires", count: 23 },
    { id: "training", name: "Formation & Éducation", count: 34 },
    { id: "consulting", name: "Conseil technique", count: 28 },
    { id: "equipment", name: "Équipements & Matériel", count: 19 },
    { id: "feed", name: "Alimentation animale", count: 15 },
    { id: "processing", name: "Transformation", count: 12 },
    { id: "marketing", name: "Marketing & Vente", count: 18 },
    { id: "finance", name: "Services financiers", count: 7 },
  ]

  const availableServices = [
    {
      id: "service1",
      title: "Consultation vétérinaire aviculture",
      description: "Diagnostic et traitement des maladies aviaires. Consultation à domicile ou en ligne.",
      provider: {
        name: "Dr. Aminata Traoré",
        avatar: "/placeholder.svg?height=40&width=40&text=AT",
        rating: 4.9,
        reviews: 127,
        verified: true,
        location: "Ouagadougou, Burkina Faso",
      },
      category: "veterinary",
      price: "0.008π",
      duration: "1 heure",
      availability: "available",
      tags: ["Aviculture", "Diagnostic", "Traitement"],
      bookings: 89,
      createdAt: "2024-01-15",
    },
    {
      id: "service2",
      title: "Formation complète en aviculture moderne",
      description:
        "Formation pratique sur les techniques modernes d'élevage de volailles, de la ponte à la commercialisation.",
      provider: {
        name: "Coopérative YELEN",
        avatar: "/placeholder.svg?height=40&width=40&text=CY",
        rating: 4.7,
        reviews: 89,
        verified: true,
        location: "Bobo-Dioulasso, Burkina Faso",
      },
      category: "training",
      price: "0.025π",
      duration: "3 jours",
      availability: "available",
      tags: ["Formation", "Aviculture", "Certification"],
      bookings: 156,
      createdAt: "2024-01-10",
    },
    {
      id: "service3",
      title: "Analyse nutritionnelle des aliments",
      description: "Service d'analyse de la qualité nutritionnelle des aliments pour volailles et recommandations.",
      provider: {
        name: "TechAgri Solutions",
        avatar: "/placeholder.svg?height=40&width=40&text=TS",
        rating: 4.8,
        reviews: 67,
        verified: true,
        location: "Koudougou, Burkina Faso",
      },
      category: "consulting",
      price: "0.012π",
      duration: "2-3 jours",
      availability: "busy",
      tags: ["Nutrition", "Analyse", "Conseil"],
      bookings: 45,
      createdAt: "2024-01-08",
    },
    {
      id: "service4",
      title: "Vente d'équipements d'élevage",
      description: "Fourniture d'équipements modernes pour l'élevage : mangeoires, abreuvoirs, couveuses, etc.",
      provider: {
        name: "Agro-Équip Sahel",
        avatar: "/placeholder.svg?height=40&width=40&text=AE",
        rating: 4.6,
        reviews: 234,
        verified: true,
        location: "Kaya, Burkina Faso",
      },
      category: "equipment",
      price: "Variable",
      duration: "Livraison 2-5 jours",
      availability: "available",
      tags: ["Équipements", "Matériel", "Livraison"],
      bookings: 312,
      createdAt: "2024-01-05",
    },
  ]

  const myServices = [
    {
      id: "myservice1",
      title: "Conseil en gestion d'élevage",
      description: "Accompagnement personnalisé pour optimiser votre élevage de volailles.",
      category: "consulting",
      price: "0.015π",
      status: "active",
      bookings: 23,
      earnings: "0.345π",
      rating: 4.8,
      createdAt: "2024-01-20",
    },
    {
      id: "myservice2",
      title: "Formation pratique aviculture",
      description: "Formation sur site pour les techniques d'élevage moderne.",
      category: "training",
      price: "0.030π",
      status: "active",
      bookings: 12,
      earnings: "0.360π",
      rating: 4.9,
      createdAt: "2024-01-18",
    },
  ]

  const handleCreateService = () => {
    console.log("Nouveau service créé:", newService)
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

  const filteredServices = availableServices.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Services</h2>
          <p className="text-gray-600">Découvrez et proposez des services agricoles</p>
        </div>
        <Dialog open={showCreateService} onOpenChange={setShowCreateService}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Proposer un service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre du service</Label>
                <Input
                  id="title"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="Ex: Consultation vétérinaire aviculture"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Décrivez votre service en détail..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) => setNewService({ ...newService, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.slice(1).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Prix (π)</Label>
                  <Input
                    id="price"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    placeholder="0.000"
                    type="number"
                    step="0.001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Durée</Label>
                  <Input
                    id="duration"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                    placeholder="Ex: 2 heures, 1 jour"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={newService.location}
                    onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                    placeholder="Ville, région"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="requirements">Prérequis (optionnel)</Label>
                <Textarea
                  id="requirements"
                  value={newService.requirements}
                  onChange={(e) => setNewService({ ...newService, requirements: e.target.value })}
                  placeholder="Conditions ou prérequis pour ce service..."
                  rows={2}
                />
              </div>
              <Button onClick={handleCreateService} className="w-full">
                Créer le service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Parcourir</TabsTrigger>
          <TabsTrigger value="my-services">Mes services</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Service Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {serviceCategories.slice(1, 6).map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-colors ${
                  selectedCategory === category.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">
                    {category.id === "veterinary" && "🏥"}
                    {category.id === "training" && "🎓"}
                    {category.id === "consulting" && "💡"}
                    {category.id === "equipment" && "🔧"}
                    {category.id === "feed" && "🌾"}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count} services</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Services List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={service.provider.avatar || "/placeholder.svg"}
                        alt={service.provider.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{service.provider.name}</h4>
                          {service.provider.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                            <span>{service.provider.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{service.provider.reviews} avis</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{service.provider.location}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={service.availability === "available" ? "default" : "secondary"}>
                      {service.availability === "available" ? "Disponible" : "Occupé"}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{service.bookings} réservations</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-purple-600">{service.price}</div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" disabled={service.availability !== "available"}>
                        Réserver
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-services" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mes services ({myServices.length})</h3>
            <Button onClick={() => setShowCreateService(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau service
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myServices.map((service) => (
              <Card key={service.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{service.bookings}</div>
                      <div className="text-xs text-green-700">Réservations</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{service.earnings}</div>
                      <div className="text-xs text-purple-700">Gains totaux</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{service.rating}</span>
                      <Badge variant={service.status === "active" ? "default" : "secondary"}>
                        {service.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <div className="text-lg font-bold text-purple-600">{service.price}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Réservations récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "booking1",
                    service: "Consultation vétérinaire",
                    client: "Ibrahim Sawadogo",
                    date: "2024-02-05",
                    time: "14:00",
                    status: "confirmed",
                    amount: "0.008π",
                  },
                  {
                    id: "booking2",
                    service: "Formation aviculture",
                    client: "Marie Ouédraogo",
                    date: "2024-02-08",
                    time: "09:00",
                    status: "pending",
                    amount: "0.025π",
                  },
                  {
                    id: "booking3",
                    service: "Conseil technique",
                    client: "Paul Kaboré",
                    date: "2024-02-10",
                    time: "16:00",
                    status: "completed",
                    amount: "0.015π",
                  },
                ].map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-blue-600">{booking.client.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{booking.service}</p>
                        <p className="text-sm text-gray-600">Client: {booking.client}</p>
                        <p className="text-xs text-gray-500">
                          {booking.date} à {booking.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{booking.amount}</p>
                      <Badge
                        variant={
                          booking.status === "completed"
                            ? "default"
                            : booking.status === "confirmed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {booking.status === "completed"
                          ? "Terminé"
                          : booking.status === "confirmed"
                            ? "Confirmé"
                            : "En attente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">35</div>
                <div className="text-sm text-gray-600">Réservations totales</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">0.705π</div>
                <div className="text-sm text-gray-600">Revenus totaux</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">4.8</div>
                <div className="text-sm text-gray-600">Note moyenne</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">94%</div>
                <div className="text-sm text-gray-600">Taux de satisfaction</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance des services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myServices.map((service) => (
                  <div key={service.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{service.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{service.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Réservations:</span>
                        <span className="font-medium ml-2">{service.bookings}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenus:</span>
                        <span className="font-medium ml-2 text-green-600">{service.earnings}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Prix:</span>
                        <span className="font-medium ml-2 text-purple-600">{service.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
