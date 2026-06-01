"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Navigation,
  Globe,
  Shield,
  AlertCircle,
  CheckCircle,
  Settings,
  Eye,
  EyeOff,
  RefreshCw,
  Thermometer,
  Cloud,
  Users,
  Store,
} from "lucide-react"

interface GeolocationManagerProps {
  currentLanguage: string
  userRegion: string
}

interface LocationData {
  latitude: number
  longitude: number
  country: string
  region: string
  city: string
  accuracy: number
  timestamp: number
}

interface LocalizedContent {
  weather: {
    temperature: number
    condition: string
    humidity: number
    forecast: string
  }
  agriculture: {
    season: string
    recommendations: string[]
    alerts: string[]
  }
  marketplace: {
    nearbyUsers: number
    localProducts: number
    activeServices: number
  }
}

export default function GeolocationManager({ currentLanguage, userRegion }: GeolocationManagerProps) {
  const [activeTab, setActiveTab] = useState("location")
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(false)

  // Données localisées simulées
  const localizedContent: LocalizedContent = {
    weather: {
      temperature: 32,
      condition: "Ensoleillé",
      humidity: 45,
      forecast: "Temps sec favorable aux cultures",
    },
    agriculture: {
      season: "Saison sèche",
      recommendations: [
        "Période idéale pour la récolte du mil",
        "Préparation des sols pour la prochaine saison",
        "Vaccination du bétail recommandée",
      ],
      alerts: ["Risque de sécheresse dans 2 semaines", "Prix du maïs en hausse sur les marchés locaux"],
    },
    marketplace: {
      nearbyUsers: 127,
      localProducts: 89,
      activeServices: 34,
    },
  }

  const getCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            country: userRegion,
            region: "Centre",
            city: "Ouagadougou",
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
          }
          setLocationData(newLocationData)
          setIsLoading(false)
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          setIsLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    }
  }

  useEffect(() => {
    if (locationEnabled && !locationData) {
      getCurrentLocation()
    }
  }, [locationEnabled])

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`
  }

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy <= 10) return { status: "Excellente", color: "text-green-600", bg: "bg-green-100" }
    if (accuracy <= 50) return { status: "Bonne", color: "text-blue-600", bg: "bg-blue-100" }
    if (accuracy <= 100) return { status: "Moyenne", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { status: "Faible", color: "text-red-600", bg: "bg-red-100" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Géolocalisation</h2>
                <p className="text-blue-100">Contenu personnalisé selon votre position</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${locationEnabled ? "bg-green-400" : "bg-red-400"}`}></div>
                <span className="text-sm">{locationEnabled ? "Activé" : "Désactivé"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geolocation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="location">Position</TabsTrigger>
          <TabsTrigger value="content">Contenu Local</TabsTrigger>
          <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="location" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Navigation className="h-5 w-5 mr-2" />
                    Position Actuelle
                  </span>
                  <Button size="sm" variant="outline" onClick={getCurrentLocation} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Actualiser
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {locationData ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pays:</span>
                        <span className="text-sm">{locationData.country}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Région:</span>
                        <span className="text-sm">{locationData.region}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Ville:</span>
                        <span className="text-sm">{locationData.city}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Coordonnées:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono">
                            {showCoordinates
                              ? formatCoordinates(locationData.latitude, locationData.longitude)
                              : "••••••, ••••••"}
                          </span>
                          <Button size="sm" variant="ghost" onClick={() => setShowCoordinates(!showCoordinates)}>
                            {showCoordinates ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Précision:</span>
                        <Badge
                          className={`${getAccuracyStatus(locationData.accuracy).bg} ${getAccuracyStatus(locationData.accuracy).color}`}
                        >
                          {getAccuracyStatus(locationData.accuracy).status} (±{locationData.accuracy}m)
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Dernière MAJ:</span>
                        <span className="text-sm text-gray-500">
                          {new Date(locationData.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Position non disponible</p>
                    <Button onClick={getCurrentLocation} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Localisation...
                        </>
                      ) : (
                        <>
                          <Navigation className="h-4 w-4 mr-2" />
                          Obtenir ma position
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Avantages de la Géolocalisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Thermometer className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Conseils Climatiques</h4>
                      <p className="text-sm text-blue-700">Recommandations adaptées à votre climat local</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Réseau Local</h4>
                      <p className="text-sm text-green-700">Connexion avec des agriculteurs proches</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Store className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-800">Marketplace Régional</h4>
                      <p className="text-sm text-purple-700">Produits et services de votre région</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Cloud className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-800">Alertes Météo</h4>
                      <p className="text-sm text-orange-700">Prévisions et alertes spécifiques à votre zone</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weather Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cloud className="h-5 w-5 mr-2" />
                  Météo Locale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600">{localizedContent.weather.temperature}°C</div>
                  <div className="text-sm text-gray-600">{localizedContent.weather.condition}</div>
                  <div className="text-xs text-gray-500">Humidité: {localizedContent.weather.humidity}%</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">{localizedContent.weather.forecast}</p>
                </div>
              </CardContent>
            </Card>

            {/* Agricultural Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2" />
                  Conseils Agricoles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Badge variant="outline" className="mb-3">
                    {localizedContent.agriculture.season}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {localizedContent.agriculture.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
                {localizedContent.agriculture.alerts.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {localizedContent.agriculture.alerts.map((alert, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-yellow-800">{alert}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Local Marketplace */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="h-5 w-5 mr-2" />
                  Marketplace Local
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{localizedContent.marketplace.nearbyUsers}</div>
                    <div className="text-sm text-gray-600">Utilisateurs à proximité</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-bold text-green-600">{localizedContent.marketplace.localProducts}</div>
                      <div className="text-xs text-green-700">Produits locaux</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="font-bold text-blue-600">{localizedContent.marketplace.activeServices}</div>
                      <div className="text-xs text-blue-700">Services actifs</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Protection de vos Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">🔒 Nos Engagements RGPD</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Chiffrement de bout en bout de vos coordonnées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Aucun partage avec des tiers sans consentement</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Droit à l'effacement de vos données</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Transparence totale sur l'utilisation</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Utilisation de vos Données de Localisation</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Conseils agricoles personnalisés</p>
                      <p className="text-sm text-gray-600">Recommandations basées sur votre climat</p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Connexions locales</p>
                      <p className="text-sm text-gray-600">Mise en relation avec des utilisateurs proches</p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Marketplace régional</p>
                      <p className="text-sm text-gray-600">Produits et services de votre région</p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Alertes météo locales</p>
                      <p className="text-sm text-gray-600">Notifications spécifiques à votre zone</p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Vos Droits</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• Accès à toutes vos données stockées</p>
                  <p>• Rectification des informations incorrectes</p>
                  <p>• Suppression de votre compte et données</p>
                  <p>• Portabilité de vos données</p>
                  <p>• Opposition au traitement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Paramètres de Géolocalisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Géolocalisation automatique</h4>
                    <p className="text-sm text-gray-500">Détecter automatiquement votre position</p>
                  </div>
                  <Button
                    variant={locationEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLocationEnabled(!locationEnabled)}
                  >
                    {locationEnabled ? "Activé" : "Désactivé"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Précision élevée</h4>
                    <p className="text-sm text-gray-500">Utiliser le GPS pour une meilleure précision</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Mise à jour automatique</h4>
                    <p className="text-sm text-gray-500">Actualiser la position périodiquement</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Toutes les 5 min
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Partage de position</h4>
                    <p className="text-sm text-gray-500">Permettre aux autres utilisateurs de voir votre région</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Région uniquement
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Historique des positions</h4>
                    <p className="text-sm text-gray-500">Conserver un historique de vos déplacements</p>
                  </div>
                  <Button variant="outline" size="sm">
                    7 jours
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Actions sur les Données</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir toutes mes données de localisation
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Exporter mes données
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Supprimer toutes mes données de localisation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
