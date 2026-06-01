"use client"

import { useState } from "react"
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
} from "lucide-react"

interface AvicultureManagementProps {
  currentLanguage: string
  userRegion: string
}

export default function AvicultureManagement({ currentLanguage, userRegion }: AvicultureManagementProps) {
  const [activeTab, setActiveTab] = useState("gestion")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFarm, setSelectedFarm] = useState("ferme-a")

  const farms = [
    { id: "ferme-a", name: "Ferme Principale", birds: 1250, eggs: 890 },
    { id: "ferme-b", name: "Ferme Secondaire", birds: 800, eggs: 560 },
  ]

  const opportunities = [
    { id: "gestion", title: "Gestion de l'élevage", icon: Users, color: "bg-blue-500", count: 23 },
    { id: "surveillance", title: "Surveillance sanitaire", icon: Heart, color: "bg-red-500", count: 18 },
    { id: "alimentation", title: "Alimentation", icon: Utensils, color: "bg-green-500", count: 15 },
    { id: "production", title: "Production", icon: TrendingUp, color: "bg-purple-500", count: 20 },
    { id: "inventaire", title: "Inventaire", icon: Package, color: "bg-orange-500", count: 12 },
    { id: "analyse", title: "Analyses", icon: BarChart3, color: "bg-indigo-500", count: 16 },
    { id: "formation", title: "Formation", icon: GraduationCap, color: "bg-pink-500", count: 25 },
    { id: "support", title: "Support", icon: Headphones, color: "bg-yellow-500", count: 8 },
  ]

  // Données de production
  const productionData = {
    weeklyEggs: [580, 620, 650, 670, 690, 710, 730],
    mortality: [2.1, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4],
    feedConsumption: [45, 47, 48, 50, 52, 53, 55],
  }

  // Services disponibles
  const availableServices = [
    { id: 1, provider: "Dr. Aminata Traoré", service: "Consultation vétérinaire", price: "0.008π", rating: 4.9, location: "Ouagadougou", available: true, phone: "+226 70 12 34 56", image: "👩‍⚕️" },
    { id: 2, provider: "Coopérative YELEN", service: "Formation aviculture", price: "0.015π", rating: 4.7, location: "Bobo-Dioulasso", available: true, phone: "+226 70 23 45 67", image: "🏢" },
    { id: 3, provider: "TechAgri Solutions", service: "Analyse de données", price: "0.012π", rating: 4.8, location: "Koudougou", available: false, phone: "+226 70 34 56 78", image: "📊" },
    { id: 4, provider: "Ferme Moderne", service: "Aliments certifiés", price: "0.025π", rating: 4.9, location: "Banfora", available: true, image: "🌾" },
    { id: 5, provider: "SantéVet", service: "Vaccination mobile", price: "0.005π", rating: 4.6, location: "Ouahigouya", available: true, image: "💉" },
  ]

  const filteredServices = availableServices.filter(s => 
    s.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.provider.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Conseils du jour
  const dailyTips = [
    "🌡️ Maintenez une température stable de 21-22°C dans le poulailler",
    "💧 Assurez une eau fraîche et propre en permanence",
    "🥚 Collectez les œufs 3 fois par jour pour éviter les cassures",
    "🧹 Nettoyez quotidiennement les mangeoires et abreuvoirs",
    "📊 Notez les mortalités et pontes pour suivre les tendances",
  ]

  const renderGestionContent = () => (
    <div className="space-y-6">
      {/* Sélecteur de ferme */}
      <div className="flex gap-2 flex-wrap">
        {farms.map(farm => (
          <Button
            key={farm.id}
            variant={selectedFarm === farm.id ? "default" : "outline"}
            className={selectedFarm === farm.id ? "bg-green-600" : ""}
            onClick={() => setSelectedFarm(farm.id)}
          >
            {farm.name}
          </Button>
        ))}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Volailles totales", value: "2 050", icon: Users, change: "+8%", color: "text-blue-600" },
          { label: "Production œufs/jour", value: "1 450", icon: Egg, change: "+5%", color: "text-yellow-600" },
          { label: "Mortalité 7j", value: "1.8%", icon: Activity, change: "-0.3%", color: "text-green-600" },
          { label: "Poids moyen", value: "2.1 kg", icon: TrendingUp, change: "+2%", color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">{stat.change} vs semaine dernière</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activités du jour */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Programme du jour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "06:00", task: "Ouverture des poulaillers", status: "done", priority: "high" },
              { time: "08:00", task: "Distribution alimentation", status: "done", priority: "high" },
              { time: "10:00", task: "Collecte des œufs", status: "done", priority: "medium" },
              { time: "14:00", task: "Contrôle sanitaire", status: "pending", priority: "high" },
              { time: "16:00", task: "Nettoyage des équipements", status: "pending", priority: "medium" },
              { time: "18:00", task: "Fermeture et rapport", status: "pending", priority: "low" },
            ].map((activity, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${activity.status === 'done' ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-14 text-sm font-medium text-gray-600">{activity.time}</div>
                  <div className="flex items-center gap-2">
                    {activity.status === 'done' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-500" />
                    )}
                    <span className={activity.status === 'done' ? 'text-gray-500 line-through' : 'font-medium'}>
                      {activity.task}
                    </span>
                  </div>
                </div>
                {activity.priority === 'high' && activity.status !== 'done' && (
                  <Badge variant="destructive" className="text-xs">Prioritaire</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Production semaine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Production de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {productionData.weeklyEggs.map((eggs, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                  style={{ height: `${(eggs / 800) * 100}px` }}
                />
                <span className="text-xs mt-1">J{i+1}</span>
                <span className="text-xs font-medium">{eggs}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Ajouter lot", icon: Plus, color: "bg-green-500" },
          { label: "Contrôle santé", icon: Heart, color: "bg-red-500" },
          { label: "Nourrir", icon: Utensils, color: "bg-blue-500" },
          { label: "Générer rapport", icon: BarChart3, color: "bg-purple-500" },
        ].map((action, i) => (
          <Button key={i} variant="outline" className="h-20 flex flex-col gap-1 hover:shadow-md">
            <action.icon className="h-5 w-5" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )

  const renderSurveillanceContent = () => (
    <div className="space-y-6">
      {/* Métriques santé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { metric: "Température", value: "22°C", status: "normal", icon: Thermometer, color: "text-blue-600" },
          { metric: "Humidité", value: "65%", status: "normal", icon: Droplets, color: "text-cyan-600" },
          { metric: "Mortalité", value: "1.8%", status: "warning", icon: Activity, color: "text-orange-600" },
          { metric: "Vaccination", value: "95%", status: "good", icon: Syringe, color: "text-green-600" },
        ].map((metric, i) => (
          <Card key={i}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${metric.color} bg-opacity-10`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{metric.metric}</p>
                  <p className="font-bold text-sm">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertes sanitaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "warning", message: "Température élevée détectée - Poulailler A", time: "Il y a 30 min", urgent: true },
              { type: "info", message: "Vaccination Newcastle programmée demain", time: "Il y a 2h", urgent: false },
              { type: "success", message: "Tous les tests vétérinaires sont conformes", time: "Il y a 5h", urgent: false },
            ].map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-l-yellow-400' :
                alert.type === 'success' ? 'bg-green-50 border-l-green-400' :
                'bg-blue-50 border-l-blue-400'
              }`}>
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">{alert.message}</p>
                  {alert.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                </div>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendrier de vaccination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-green-600" />
            Calendrier de vaccination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { vaccine: "Newcastle", date: "15 Février 2024", status: "À venir", color: "bg-yellow-100 text-yellow-700" },
              { vaccine: "Gumboro", date: "22 Février 2024", status: "Programmé", color: "bg-blue-100 text-blue-700" },
              { vaccine: "Bronchite", date: "28 Janvier 2024", status: "Effectué", color: "bg-green-100 text-green-700" },
            ].map((v, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{v.vaccine}</p>
                  <p className="text-xs text-gray-500">{v.date}</p>
                </div>
                <Badge className={v.color}>{v.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAlimentationContent = () => (
    <div className="space-y-6">
      {/* Stock d'aliments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Stock d'aliments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "Pondeuses", stock: "450 kg", consommation: "45 kg/jour", autonomie: "10 jours" },
              { type: "Démarrage", stock: "280 kg", consommation: "30 kg/jour", autonomie: "9 jours" },
              { type: "Croissance", stock: "320 kg", consommation: "35 kg/jour", autonomie: "9 jours" },
            ].map((feed, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{feed.type}</p>
                  <p className="text-xs text-gray-500">Consommation: {feed.consommation}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{feed.stock}</p>
                  <p className="text-xs text-gray-500">Autonomie: {feed.autonomie}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conseils nutrition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clover className="h-5 w-5 text-green-600" />
            Conseils du nutritionniste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dailyTips.slice(0, 3).map((tip, i) => (
              <div key={i} className="flex items-start gap-2 p-2 hover:bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commande rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            Commander des aliments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type d'aliment</label>
              <select className="w-full p-2 border rounded-lg mt-1">
                <option>Pondeuses</option>
                <option>Démarrage</option>
                <option>Croissance</option>
                <option>Finition</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantité (kg)</label>
              <Input placeholder="Ex: 500" type="number" />
            </div>
          </div>
          <Button className="w-full mt-4 gap-2">
            <ShoppingCart className="h-4 w-4" />
            Commander avec Pi
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderServicesContent = () => (
    <div className="space-y-6">
      {/* Services disponibles */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un service ou prestataire..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{service.image}</div>
                  <div>
                    <p className="font-semibold">{service.provider}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm">{service.rating}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={service.available ? "default" : "secondary"} className={service.available ? "bg-green-600" : ""}>
                  {service.available ? "Disponible" : "Indisponible"}
                </Badge>
              </div>
              <h4 className="font-medium mb-2">{service.service}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <MapPin className="h-3 w-3" />
                <span>{service.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-purple-600 font-bold">
                  <DollarSign className="h-4 w-4" />
                  <span>{service.price}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button size="sm" className="h-8 px-3" disabled={!service.available}>
                    Réserver
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Egg className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold">Gestion Aviculture</h2>
          </div>
          <p className="text-gray-500 mt-1">Outils complets pour votre élevage de volailles - {userRegion}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Contact support
          </Button>
          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
            Nouveau lot
          </Button>
        </div>
      </div>

      {/* Onglets de navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          {opportunities.map((opp) => {
            const Icon = opp.icon
            return (
              <TabsTrigger key={opp.id} value={opp.id} className="flex flex-col items-center py-3">
                <div className={`p-1.5 rounded-full ${opp.color} bg-opacity-10 mb-1`}>
                  <Icon className={`h-4 w-4 ${opp.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-xs hidden lg:inline">{opp.title}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="gestion" className="mt-6">
          {renderGestionContent()}
        </TabsContent>

        <TabsContent value="surveillance" className="mt-6">
          {renderSurveillanceContent()}
        </TabsContent>

        <TabsContent value="alimentation" className="mt-6">
          {renderAlimentationContent()}
        </TabsContent>

        <TabsContent value="production" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Module Production</h3>
              <p className="text-gray-500">Suivi détaillé de la ponte et croissance</p>
              <Button className="mt-4">Explorer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventaire" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Gestion d'inventaire</h3>
              <p className="text-gray-500">Suivez vos stocks et équipements</p>
              <Button className="mt-4">Voir l'inventaire</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyse" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Analyses et rapports</h3>
              <p className="text-gray-500">Visualisez vos performances</p>
              <Button className="mt-4">Générer rapport</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formation" className="mt-6">
          {renderServicesContent()}
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Headphones className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Support technique 24/7</h3>
              <p className="text-gray-500">Une équipe dédiée pour vous assister</p>
              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline">📞 Appeler</Button>
                <Button variant="outline">💬 Chat</Button>
                <Button variant="outline">✉️ Email</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Conseils du jour - Footer */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Clover className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">💡 Conseil avicole du jour</p>
              <p className="text-sm text-green-700">{dailyTips[Math.floor(Math.random() * dailyTips.length)]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}