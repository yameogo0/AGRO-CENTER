"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Edit,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  Award,
  TrendingUp,
  MessageSquare,
  Settings,
  Shield,
  Heart,
  Share2,
} from "lucide-react"

interface UserProfileProps {
  currentLanguage: string
  userRegion: string
}

export default function UserProfile({ currentLanguage, userRegion }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: "Aminata Traoré",
    bio: "Experte en aviculture moderne avec 15 ans d'expérience. Spécialisée dans l'optimisation de la production d'œufs et la gestion sanitaire des élevages.",
    location: "Ouagadougou, Burkina Faso",
    phone: "+226 70 12 34 56",
    email: "aminata.traore@agromc.com",
    website: "www.aviculture-bf.com",
    joinDate: "2023-03-15",
    profileImage: "/placeholder.svg?height=120&width=120&text=AT",
    specialties: ["Aviculture", "Gestion sanitaire", "Formation", "Conseil technique"],
    languages: ["Français", "Mooré", "Dioula", "Anglais"],
    certifications: ["Vétérinaire certifié", "Expert Pi Network", "Formateur agréé"],
  })

  const [stats, setStats] = useState({
    followers: 1247,
    following: 89,
    posts: 156,
    rating: 4.9,
    reviews: 234,
    transactions: 89,
    piEarned: 12.5847,
    servicesOffered: 5,
  })

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "service",
      title: "Nouveau service ajouté: Consultation vétérinaire",
      date: "2024-02-01",
      icon: "🐔",
    },
    {
      id: 2,
      type: "transaction",
      title: "Transaction réussie: 0.008π reçu",
      date: "2024-01-30",
      icon: "💰",
    },
    {
      id: 3,
      type: "review",
      title: "Nouvel avis 5⭐ reçu de Ibrahim S.",
      date: "2024-01-28",
      icon: "⭐",
    },
    {
      id: 4,
      type: "follow",
      title: "15 nouveaux abonnés cette semaine",
      date: "2024-01-25",
      icon: "👥",
    },
  ])

  const [badges, setBadges] = useState([
    { name: "Expert Aviculture", icon: "🐔", color: "bg-yellow-500", earned: "2023-06-15" },
    { name: "Top Prestataire", icon: "⭐", color: "bg-blue-500", earned: "2023-09-20" },
    { name: "Mentor Communauté", icon: "🎓", color: "bg-green-500", earned: "2023-12-10" },
    { name: "Pi Pioneer", icon: "π", color: "bg-purple-500", earned: "2024-01-05" },
  ])

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Ici, vous enverriez les données au backend
    console.log("Profil sauvegardé:", profileData)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={profileData.profileImage || "/placeholder.svg"}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                onClick={() => {
                  /* Ouvrir sélecteur d'image */
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{profileData.name}</h1>
                  <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Membre depuis {new Date(profileData.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Sauvegarder" : "Modifier"}
                </Button>
              </div>

              {isEditing ? (
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="mb-4"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600 mb-4">{profileData.bio}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{stats.followers}</div>
                  <div className="text-xs text-gray-500">Abonnés</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{stats.following}</div>
                  <div className="text-xs text-gray-500">Abonnements</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.rating}⭐</div>
                  <div className="text-xs text-gray-500">{stats.reviews} avis</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{stats.piEarned}π</div>
                  <div className="text-xs text-gray-500">Gains totaux</div>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button size="sm" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Suivre
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Informations de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">Téléphone</label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Site web</label>
                      <Input
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span>{profileData.website}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Languages & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Compétences & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Langues parlées</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.languages.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Certifications</h4>
                  <div className="space-y-2">
                    {profileData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Badges & Réalisations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div
                      className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <span className="text-2xl text-white">{badge.icon}</span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-500">Obtenu le {new Date(badge.earned).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Avis clients ({stats.reviews})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: "Ibrahim Sawadogo",
                    rating: 5,
                    comment: "Excellent service, très professionnel et réactif. Mes poules se portent beaucoup mieux !",
                    date: "2024-01-15",
                    service: "Consultation vétérinaire",
                  },
                  {
                    user: "Fatou Kaboré",
                    rating: 5,
                    comment: "Formation très complète, j'ai appris énormément de techniques utiles.",
                    date: "2024-01-12",
                    service: "Formation aviculture",
                  },
                  {
                    user: "Paul Ouédraogo",
                    rating: 4,
                    comment: "Bon conseil pour l'optimisation de mon élevage. Résultats visibles rapidement.",
                    date: "2024-01-08",
                    service: "Conseil technique",
                  },
                ].map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold">{review.user.charAt(0)}</span>
                        </div>
                        <span className="font-medium">{review.user}</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Service: {review.service}</span>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Paramètres du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications par email</h4>
                    <p className="text-sm text-gray-500">Recevoir les notifications importantes par email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Activé
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Profil public</h4>
                    <p className="text-sm text-gray-500">Permettre aux autres utilisateurs de voir votre profil</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Public
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Authentification à deux facteurs</h4>
                    <p className="text-sm text-gray-500">Sécuriser votre compte avec 2FA</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurer
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Langue de l'interface</h4>
                    <p className="text-sm text-gray-500">Choisir la langue d'affichage</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Français
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
