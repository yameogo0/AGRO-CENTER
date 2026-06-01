"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"

interface AvicultureManagementProps {
  currentLanguage: string
  userRegion: string
}

export default function AvicultureManagement({ currentLanguage, userRegion }: AvicultureManagementProps) {
  const [activeOpportunity, setActiveOpportunity] = useState("gestion")
  const [searchQuery, setSearchQuery] = useState("")

  const opportunities = [
    {
      id: "gestion",
      title: "Gestion de l'élevage",
      icon: Users,
      description: "Outils complets pour gérer votre élevage de volailles",
      color: "bg-blue-500",
      services: 23,
    },
    {
      id: "surveillance",
      title: "Surveillance sanitaire",
      icon: Heart,
      description: "Suivi de la santé et prévention des maladies",
      color: "bg-red-500",
      services: 18,
    },
    {
      id: "alimentation",
      title: "Optimisation de l'alimentation",
      icon: Utensils,
      description: "Conseils nutritionnels et formulation d'aliments",
      color: "bg-green-500",
      services: 15,
    },
    {
      id: "production",
      title: "Suivi de la production",
      icon: TrendingUp,
      description: "Monitoring des performances de ponte et croissance",
      color: "bg-purple-500",
      services: 20,
    },
    {
      id: "inventaire",
      title: "Inventaire et logistique",
      icon: Package,
      description: "Gestion des stocks et approvisionnements",
      color: "bg-orange-500",
      services: 12,
    },
    {
      id: "analyse",
      title: "Analyse des données",
      icon: BarChart3,
      description: "Tableaux de bord et analyses prédictives",
      color: "bg-indigo-500",
      services: 16,
    },
    {
      id: "formation",
      title: "E-Learning et formation",
      icon: GraduationCap,
      description: "Cours en ligne et certifications",
      color: "bg-pink-500",
      services: 25,
    },
    {
      id: "partage",
      title: "Connectivité et partages",
      icon: Share2,
      description: "Réseau social et partage d'expériences",
      color: "bg-teal-500",
      services: 30,
    },
    {
      id: "support",
      title: "Support technique",
      icon: Headphones,
      description: "Assistance technique 24/7",
      color: "bg-yellow-500",
      services: 8,
    },
    {
      id: "marketing",
      title: "Marketing et ventes",
      icon: ShoppingCart,
      description: "Commercialisation et vente de produits",
      color: "bg-cyan-500",
      services: 14,
    },
  ]

  const currentOpportunity = opportunities.find((opp) => opp.id === activeOpportunity)

  const mockData = {
    gestion: {
      stats: [
        { label: "Poules pondeuses", value: "1,250", change: "+5%" },
        { label: "Poulets de chair", value: "800", change: "+12%" },
        { label: "Taux de mortalité", value: "2.1%", change: "-0.3%" },
        { label: "Âge moyen", value: "18 sem", change: "stable" },
      ],
      activities: [
        { time: "08:00", task: "Nettoyage des poulaillers", status: "completed" },
        { time: "10:00", task: "Distribution d'aliments", status: "completed" },
        { time: "14:00", task: "Collecte des œufs", status: "pending" },
        { time: "16:00", task: "Contrôle sanitaire", status: "pending" },
      ],
    },
    surveillance: {
      alerts: [
        { type: "warning", message: "Température élevée dans le poulailler A", time: "Il y a 2h" },
        { type: "info", message: "Vaccination programmée demain", time: "Il y a 4h" },
        { type: "success", message: "Tous les contrôles sanitaires OK", time: "Il y a 6h" },
      ],
      healthMetrics: [
        { metric: "Température", value: "22°C", status: "normal", icon: Thermometer },
        { metric: "Humidité", value: "65%", status: "normal", icon: Droplets },
        { metric: "Ventilation", value: "Optimal", status: "good", icon: Activity },
        { metric: "Éclairage", value: "14h/jour", status: "normal", icon: Clock },
      ],
    },
    alimentation: {
      feedData: [
        { type: "Pondeuses", quantity: "50kg", cost: "0.025π", lastOrder: "2024-01-15" },
        { type: "Démarrage", quantity: "30kg", cost: "0.018π", lastOrder: "2024-01-10" },
        { type: "Croissance", quantity: "40kg", cost: "0.022π", lastOrder: "2024-01-12" },
        { type: "Finition", quantity: "35kg", cost: "0.020π", lastOrder: "2024-01-14" },
      ],
      nutritionTips: [
        "Augmenter le calcium pour améliorer la qualité de la coquille",
        "Ajouter des probiotiques pour renforcer l'immunité",
        "Réduire les protéines en période de chaleur",
      ],
    },
  }

  const renderOpportunityContent = () => {
    switch (activeOpportunity) {
      case "gestion":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {mockData.gestion.stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <Badge variant={stat.change.includes("+") ? "default" : "secondary"}>{stat.change}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Daily Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Activités du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.gestion.activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium">{activity.time}</div>
                        <div className="text-sm">{activity.task}</div>
                      </div>
                      <div>
                        {activity.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col">
                    <Plus className="h-6 w-6 mb-2" />
                    <span className="text-sm">Ajouter lot</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                    <Heart className="h-6 w-6 mb-2" />
                    <span className="text-sm">Contrôle santé</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                    <Utensils className="h-6 w-6 mb-2" />
                    <span className="text-sm">Nourrir</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span className="text-sm">Rapport</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "surveillance":
        return (
          <div className="space-y-6">
            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {mockData.surveillance.healthMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            metric.status === "good"
                              ? "bg-green-100 text-green-600"
                              : metric.status === "normal"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-red-100 text-red-600"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{metric.metric}</p>
                          <p className="font-semibold">{metric.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Alertes et notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.surveillance.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.type === "warning"
                          ? "bg-yellow-50 border-yellow-400"
                          : alert.type === "success"
                            ? "bg-green-50 border-green-400"
                            : "bg-blue-50 border-blue-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vaccination Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Programme de vaccination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { vaccine: "Newcastle", nextDate: "2024-02-15", status: "À venir" },
                    { vaccine: "Gumboro", nextDate: "2024-02-20", status: "Programmé" },
                    { vaccine: "Bronchite", nextDate: "2024-01-30", status: "Effectué" },
                  ].map((vaccination, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{vaccination.vaccine}</p>
                        <p className="text-sm text-gray-600">Prochaine date: {vaccination.nextDate}</p>
                      </div>
                      <Badge
                        variant={
                          vaccination.status === "Effectué"
                            ? "default"
                            : vaccination.status === "À venir"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {vaccination.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "alimentation":
        return (
          <div className="space-y-6">
            {/* Feed Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Stock d'aliments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.alimentation.feedData.map((feed, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{feed.type}</p>
                        <p className="text-sm text-gray-600">Stock: {feed.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{feed.cost}</p>
                        <p className="text-xs text-gray-500">Dernière commande: {feed.lastOrder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Conseils nutritionnels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockData.alimentation.nutritionTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feed Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Calculateur d'aliments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre de volailles</label>
                    <Input placeholder="Ex: 1000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Âge (semaines)</label>
                    <Input placeholder="Ex: 20" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type d'élevage</label>
                    <select className="w-full p-2 border rounded">
                      <option>Pondeuses</option>
                      <option>Poulets de chair</option>
                      <option>Reproducteurs</option>
                    </select>
                  </div>
                </div>
                <Button className="mt-4">Calculer les besoins</Button>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold mb-2">Fonctionnalité en développement</h3>
            <p className="text-gray-600">Cette section sera bientôt disponible avec des outils avancés.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion Aviculture</h2>
          <p className="text-gray-600">Outils complets pour votre élevage de volailles</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {opportunities.map((opportunity) => {
          const Icon = opportunity.icon
          return (
            <Card
              key={opportunity.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeOpportunity === opportunity.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setActiveOpportunity(opportunity.id)}
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-12 h-12 ${opportunity.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{opportunity.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{opportunity.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {opportunity.services} services
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Current Opportunity Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {currentOpportunity && (
              <>
                <div
                  className={`w-8 h-8 ${currentOpportunity.color} rounded-full flex items-center justify-center mr-3`}
                >
                  <currentOpportunity.icon className="h-4 w-4 text-white" />
                </div>
                {currentOpportunity.title}
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderOpportunityContent()}</CardContent>
      </Card>

      {/* Available Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Services disponibles</span>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Proposer un service
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                provider: "Dr. Aminata Traoré",
                service: "Consultation vétérinaire",
                price: "0.008π",
                rating: 4.9,
                location: "Ouagadougou",
                available: true,
              },
              {
                provider: "Coopérative YELEN",
                service: "Formation aviculture",
                price: "0.015π",
                rating: 4.7,
                location: "Bobo-Dioulasso",
                available: true,
              },
              {
                provider: "TechAgri Solutions",
                service: "Analyse de données",
                price: "0.012π",
                rating: 4.8,
                location: "Koudougou",
                available: false,
              },
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">{service.provider.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{service.provider}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span className="text-xs">{service.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={service.available ? "default" : "secondary"}>
                      {service.available ? "Disponible" : "Occupé"}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-2">{service.service}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{service.location}</span>
                    </div>
                    <span className="font-bold text-purple-600">{service.price}</span>
                  </div>
                  <Button className="w-full mt-3" size="sm" disabled={!service.available}>
                    {service.available ? "Réserver" : "Non disponible"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
