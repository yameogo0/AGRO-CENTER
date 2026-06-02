"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Users,
  Wallet,
  Pi,
  CheckCircle,
  Clock,
  Copy,
  QrCode,
  Lock,
  Bell,
  Moon,
  Sun,
  Globe as GlobeIcon,
  LogOut,
  AlertTriangle,
  X,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useDebounce } from "@/hooks/use-debounce"
import { useClickOutside } from "@/hooks/use-click-outside"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { userApi } from "@/lib/api/user"
import { showToast } from "@/lib/utils"

interface UserProfileProps {
  currentLanguage: string
  userRegion: string
}

// Traductions (identiques à l'original)
const translations = { /* ... vos traductions ... */ }

export default function UserProfile({ currentLanguage, userRegion }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [language, setLanguage] = useState(currentLanguage)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData, refreshUserData } = usePiAuth()
  
  // État pour les données du profil
  const [profileData, setProfileData] = useState({
    name: "Aminata Traoré",
    bio: "Experte en aviculture moderne avec 15 ans d'expérience. Spécialisée dans l'optimisation de la production d'œufs et la gestion sanitaire des élevages.",
    location: userRegion,
    phone: "+226 70 12 34 56",
    email: "aminata.traore@agromc.com",
    website: "www.aviculture-bf.com",
    joinDate: "2023-03-15",
    profileImage: "👩‍⚕️",
    specialties: ["Aviculture", "Gestion sanitaire", "Formation", "Conseil technique"],
    languages: ["Français", "Mooré", "Dioula", "Anglais"],
    certifications: ["Vétérinaire certifié", "Expert Pi Network", "Formateur agréé"],
    walletAddress: "GCKFBEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI7",
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
  
  const [theme, setTheme] = useLocalStorage<"light" | "dark" | "system">("theme", "light")
  
  const settingsMenuRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce("", 300)
  
  useClickOutside(settingsMenuRef, () => setShowSettingsMenu(false))

  const t = translations[language as keyof typeof translations] || translations.fr

  // Données statiques (activities, badges, reviews)
  const [activities] = useState([
    { id: 1, type: "service", title: "Nouveau service ajouté: Consultation vétérinaire", date: "2024-02-01", icon: "🐔" },
    { id: 2, type: "transaction", title: "Transaction réussie: +0.008π reçu", date: "2024-01-30", icon: "💰" },
    { id: 3, type: "review", title: "Nouvel avis 5⭐ reçu de Ibrahim S.", date: "2024-01-28", icon: "⭐" },
    { id: 4, type: "follow", title: "15 nouveaux abonnés cette semaine", date: "2024-01-25", icon: "👥" },
  ])

  const [badges] = useState([
    { name: "Expert Aviculture", icon: "🐔", color: "bg-yellow-500", earned: "2023-06-15" },
    { name: "Top Prestataire", icon: "⭐", color: "bg-blue-500", earned: "2023-09-20" },
    { name: "Mentor Communauté", icon: "🎓", color: "bg-green-500", earned: "2023-12-10" },
    { name: "Pi Pioneer", icon: "π", color: "bg-purple-500", earned: "2024-01-05" },
  ])

  const [reviews] = useState([
    { user: "Ibrahim Sawadogo", rating: 5, comment: "Excellent service, très professionnel et réactif.", date: "2024-01-15", service: "Consultation vétérinaire", avatar: "I" },
    { user: "Fatou Kaboré", rating: 5, comment: "Formation très complète, j'ai appris énormément.", date: "2024-01-12", service: "Formation aviculture", avatar: "F" },
    { user: "Paul Ouédraogo", rating: 4, comment: "Bon conseil pour l'optimisation de mon élevage.", date: "2024-01-08", service: "Conseil technique", avatar: "P" },
  ])

  // Charger les données du profil depuis l'API
  const fetchProfileData = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return
    
    setIsLoading(true)
    try {
      const { data } = await userApi.getProfile()
      if (data) {
        setProfileData({
          name: data.name || profileData.name,
          bio: data.bio || profileData.bio,
          location: data.location || userRegion,
          phone: data.phone || profileData.phone,
          email: data.email || profileData.email,
          website: data.website || profileData.website,
          joinDate: data.joinDate || profileData.joinDate,
          profileImage: data.avatar || profileData.profileImage,
          specialties: data.specialties || profileData.specialties,
          languages: data.languages || profileData.languages,
          certifications: data.certifications || profileData.certifications,
          walletAddress: data.walletAddress || profileData.walletAddress,
        })
        localStorage.setItem("userProfile", JSON.stringify(profileData))
      }
    } catch (error) {
      console.error("Erreur chargement profil:", error)
      // Fallback localStorage
      const localProfile = localStorage.getItem("userProfile")
      if (localProfile) {
        setProfileData(JSON.parse(localProfile))
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, isOnline, userRegion])

  // Charger les statistiques depuis l'API
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return
    
    try {
      const { data } = await userApi.getStats()
      if (data) {
        setStats({
          followers: data.followers || stats.followers,
          following: data.following || stats.following,
          posts: data.posts || stats.posts,
          rating: data.rating || stats.rating,
          reviews: data.reviews || stats.reviews,
          transactions: data.transactions || stats.transactions,
          piEarned: data.piEarned || stats.piEarned,
          servicesOffered: data.servicesOffered || stats.servicesOffered,
        })
        localStorage.setItem("userStats", JSON.stringify(stats))
      }
    } catch (error) {
      console.error("Erreur chargement stats:", error)
      const localStats = localStorage.getItem("userStats")
      if (localStats) {
        setStats(JSON.parse(localStats))
      }
    }
  }, [isAuthenticated, isOnline])

  // Rafraîchir toutes les données
  const refreshAllData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setIsRefreshing(true)
    try {
      await Promise.all([
        fetchProfileData(),
        fetchStats(),
        refreshUserData(),
      ])
      showToast("Profil actualisé", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline, fetchProfileData, fetchStats, refreshUserData])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (isOnline && isAuthenticated) {
      fetchProfileData()
      fetchStats()
    } else {
      // Mode offline : charger depuis localStorage
      const localProfile = localStorage.getItem("userProfile")
      const localStats = localStorage.getItem("userStats")
      if (localProfile) setProfileData(JSON.parse(localProfile))
      if (localStats) setStats(JSON.parse(localStats))
    }
  }, [isOnline, isAuthenticated, fetchProfileData, fetchStats])

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemDark) document.documentElement.classList.add("dark")
      else document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const handleSaveProfile = async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setIsLoading(true)
    try {
      await userApi.updateProfile({
        name: profileData.name,
        bio: profileData.bio,
        phone: profileData.phone,
        email: profileData.email,
        website: profileData.website,
      })
      setIsEditing(false)
      showToast(t.profileUpdated, "success")
      await refreshUserData()
    } catch (error) {
      showToast("Erreur lors de la mise à jour", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    showToast(t.copied, "success")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric", month: "long", day: "numeric"
    })
  }

  const handleFollow = async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setStats({ ...stats, followers: stats.followers + 1 })
    showToast(`Vous suivez maintenant ${profileData.name}`, "success")
  }

  const languageOptions = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
  ]

  // Afficher un loader pendant le chargement
  if (isLoading && !profileData.name) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton refresh */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm">
                {profileData.profileImage}
              </div>
              {isEditing && (
                <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <h1 className="text-2xl font-bold">{profileData.name}</h1>
                    <Badge className="bg-white/20 text-white border-0">✓ {t.verified}</Badge>
                    {!isOnline && (
                      <Badge className="bg-yellow-500 text-white text-xs gap-1">
                        <WifiOff className="h-3 w-3" />
                        {t.offline}
                      </Badge>
                    )}
                    {isRefreshing && (
                      <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-green-100 mt-1">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{profileData.location}</span></div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{t.memberSince} {formatDate(profileData.joinDate)}</span></div>
                    {isOnline && (
                      <div className="flex items-center gap-1"><Wifi className="h-3 w-3 text-green-300" /><span className="text-xs">{t.online}</span></div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={refreshAllData}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Actualiser
                  </Button>
                  <Button variant={isEditing ? "default" : "secondary"} onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)} className={isEditing ? "bg-white text-green-700 hover:bg-gray-100" : "bg-white/20 hover:bg-white/30 text-white border-0"} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? t.save : t.edit}
                  </Button>
                </div>
              </div>
              {isEditing ? (
                <Textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} className="bg-white/10 text-white placeholder:text-green-200 border-white/20" rows={2} />
              ) : (
                <p className="text-green-100 text-sm mb-3">{profileData.bio}</p>
              )}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {profileData.specialties.map((spec, i) => (<Badge key={i} className="bg-white/20 text-white border-0">{spec}</Badge>))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats - le reste du JSX est identique à l'original */}
      {/* ... garder le reste du code JSX identique ... */}
      
      {/* Le reste du composant (Tabs, modals, etc.) reste identique à votre version */}
    </div>
  )
}

// Icône utilisateur
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

// RefreshCw manquant (à ajouter dans les imports)
const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)