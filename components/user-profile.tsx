"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  RefreshCw,
  User as UserIcon,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useDebounce } from "@/hooks/use-debounce"
import { useClickOutside } from "@/hooks/use-click-outside"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { showToast } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface UserProfileProps {
  currentLanguage: string
  userRegion: string
}

// Traductions multilingues
const translations: Record<string, any> = {
  fr: {
    profile: "Profil",
    activities: "Activités",
    settings: "Paramètres",
    verified: "Vérifié",
    online: "En ligne",
    offline: "Hors ligne",
    memberSince: "Membre depuis",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    followers: "Abonnés",
    following: "Abonnements",
    rating: "Note",
    reviews: "Avis",
    transactions: "Transactions",
    piEarned: "π gagnés",
    servicesOffered: "Services proposés",
    bio: "Bio",
    specialties: "Spécialités",
    languages: "Langues",
    certifications: "Certifications",
    walletAddress: "Adresse du portefeuille",
    copy: "Copier",
    copied: "Copié !",
    contact: "Contact",
    share: "Partager",
    report: "Signaler",
    block: "Bloquer",
    logout: "Déconnexion",
    deleteAccount: "Supprimer le compte",
    confirmDelete: "Confirmer la suppression",
    deleteConfirmMessage: "Cette action est irréversible",
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    notifications: "Notifications",
    privacy: "Confidentialité",
    language: "Langue",
    profileUpdated: "Profil mis à jour",
    qrCode: "Code QR",
    showQR: "Afficher le QR code",
    activity: "Activité",
    badges: "Badges",
    recentActivity: "Activité récente",
    recentReviews: "Avis récents",
    noActivities: "Aucune activité récente",
    noReviews: "Aucun avis",
    loading: "Chargement...",
  },
  en: {
    profile: "Profile",
    activities: "Activities",
    settings: "Settings",
    verified: "Verified",
    online: "Online",
    offline: "Offline",
    memberSince: "Member since",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    followers: "Followers",
    following: "Following",
    rating: "Rating",
    reviews: "Reviews",
    transactions: "Transactions",
    piEarned: "π earned",
    servicesOffered: "Services offered",
    bio: "Bio",
    specialties: "Specialties",
    languages: "Languages",
    certifications: "Certifications",
    walletAddress: "Wallet address",
    copy: "Copy",
    copied: "Copied!",
    contact: "Contact",
    share: "Share",
    report: "Report",
    block: "Block",
    logout: "Logout",
    deleteAccount: "Delete account",
    confirmDelete: "Confirm deletion",
    deleteConfirmMessage: "This action is irreversible",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    notifications: "Notifications",
    privacy: "Privacy",
    language: "Language",
    profileUpdated: "Profile updated",
    qrCode: "QR Code",
    showQR: "Show QR code",
    activity: "Activity",
    badges: "Badges",
    recentActivity: "Recent activity",
    recentReviews: "Recent reviews",
    noActivities: "No recent activity",
    noReviews: "No reviews",
    loading: "Loading...",
  },
  es: {
    profile: "Perfil",
    activities: "Actividades",
    settings: "Ajustes",
    verified: "Verificado",
    online: "En línea",
    offline: "Desconectado",
    memberSince: "Miembro desde",
    edit: "Editar",
    save: "Guardar",
    cancel: "Cancelar",
    followers: "Seguidores",
    following: "Siguiendo",
    rating: "Puntuación",
    reviews: "Reseñas",
    transactions: "Transacciones",
    piEarned: "π ganados",
    servicesOffered: "Servicios ofrecidos",
    bio: "Biografía",
    specialties: "Especialidades",
    languages: "Idiomas",
    certifications: "Certificaciones",
    walletAddress: "Dirección de billetera",
    copy: "Copiar",
    copied: "¡Copiado!",
    contact: "Contactar",
    share: "Compartir",
    report: "Reportar",
    block: "Bloquear",
    logout: "Cerrar sesión",
    deleteAccount: "Eliminar cuenta",
    confirmDelete: "Confirmar eliminación",
    deleteConfirmMessage: "Esta acción es irreversible",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    notifications: "Notificaciones",
    privacy: "Privacidad",
    language: "Idioma",
    profileUpdated: "Perfil actualizado",
    qrCode: "Código QR",
    showQR: "Mostrar código QR",
    activity: "Actividad",
    badges: "Insignias",
    recentActivity: "Actividad reciente",
    recentReviews: "Reseñas recientes",
    noActivities: "Sin actividad reciente",
    noReviews: "Sin reseñas",
    loading: "Cargando...",
  },
  pt: {
    profile: "Perfil",
    activities: "Atividades",
    settings: "Configurações",
    verified: "Verificado",
    online: "Online",
    offline: "Offline",
    memberSince: "Membro desde",
    edit: "Editar",
    save: "Salvar",
    cancel: "Cancelar",
    followers: "Seguidores",
    following: "Seguindo",
    rating: "Avaliação",
    reviews: "Avaliações",
    transactions: "Transações",
    piEarned: "π ganhos",
    servicesOffered: "Serviços oferecidos",
    bio: "Biografia",
    specialties: "Especialidades",
    languages: "Idiomas",
    certifications: "Certificações",
    walletAddress: "Endereço da carteira",
    copy: "Copiar",
    copied: "Copiado!",
    contact: "Contatar",
    share: "Compartilhar",
    report: "Denunciar",
    block: "Bloquear",
    logout: "Sair",
    deleteAccount: "Excluir conta",
    confirmDelete: "Confirmar exclusão",
    deleteConfirmMessage: "Esta ação é irreversível",
    theme: "Tema",
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
    notifications: "Notificações",
    privacy: "Privacidade",
    language: "Idioma",
    profileUpdated: "Perfil atualizado",
    qrCode: "Código QR",
    showQR: "Mostrar código QR",
    activity: "Atividade",
    badges: "Conquistas",
    recentActivity: "Atividade recente",
    recentReviews: "Avaliações recentes",
    noActivities: "Nenhuma atividade recente",
    noReviews: "Nenhuma avaliação",
    loading: "Carregando...",
  },
}

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
  const [profileImage, setProfileImage] = useState<string>("👩‍⚕️")
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData, refreshUserData, logout } = usePiAuth()
  
  const settingsMenuRef = useRef<HTMLDivElement>(null)
  useClickOutside(settingsMenuRef, () => setShowSettingsMenu(false))

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
  
  const [theme, setTheme] = useLocalStorage<"light" | "dark" | "system">("theme", "system")
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage("notificationsEnabled", true)

  const t = translations[language as keyof typeof translations] || translations.fr

  // Données statiques
  const activities = [
    { id: 1, type: "service", title: "Nouveau service ajouté: Consultation vétérinaire", date: new Date(Date.now() - 86400000 * 2).toISOString(), icon: "🐔" },
    { id: 2, type: "transaction", title: "Transaction réussie: +0.008π reçu", date: new Date(Date.now() - 86400000 * 4).toISOString(), icon: "💰" },
    { id: 3, type: "review", title: "Nouvel avis 5⭐ reçu de Ibrahim S.", date: new Date(Date.now() - 86400000 * 6).toISOString(), icon: "⭐" },
    { id: 4, type: "follow", title: "15 nouveaux abonnés cette semaine", date: new Date(Date.now() - 86400000 * 9).toISOString(), icon: "👥" },
  ]

  const badges = [
    { name: "Expert Aviculture", icon: "🐔", color: "bg-yellow-500", earned: "2023-06-15", progress: 100 },
    { name: "Top Prestataire", icon: "⭐", color: "bg-blue-500", earned: "2023-09-20", progress: 100 },
    { name: "Mentor Communauté", icon: "🎓", color: "bg-green-500", earned: "2023-12-10", progress: 85 },
    { name: "Pi Pioneer", icon: "π", color: "bg-purple-500", earned: "2024-01-05", progress: 100 },
    { name: "Networker", icon: "👥", color: "bg-orange-500", earned: "", progress: 60 },
  ]

  const reviews = [
    { user: "Ibrahim Sawadogo", rating: 5, comment: "Excellent service, très professionnel et réactif.", date: new Date(Date.now() - 86400000 * 7).toISOString(), service: "Consultation vétérinaire", avatar: "I" },
    { user: "Fatou Kaboré", rating: 5, comment: "Formation très complète, j'ai appris énormément.", date: new Date(Date.now() - 86400000 * 14).toISOString(), service: "Formation aviculture", avatar: "F" },
    { user: "Paul Ouédraogo", rating: 4, comment: "Bon conseil pour l'optimisation de mon élevage.", date: new Date(Date.now() - 86400000 * 21).toISOString(), service: "Conseil technique", avatar: "P" },
  ]

  // Rafraîchir toutes les données
  const refreshAllData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setIsRefreshing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      await refreshUserData()
      showToast("Profil actualisé", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline, refreshUserData])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

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
      await new Promise(resolve => setTimeout(resolve, 1000))
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
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric", month: "short", day: "numeric"
    })
  }

  const handleShare = (platform: string) => {
    const shareText = `Découvrez ${profileData.name} sur Agro Multicenter Hinos!`
    const shareUrl = window.location.href
    
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
        navigator.clipboard.writeText(shareText)
        showToast("Lien copié", "success")
    }
    setShowShareOptions(false)
  }

  const handleLogout = async () => {
    await logout()
    showToast("Déconnexion réussie", "success")
  }

  const languageOptions = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header avec bouton refresh */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-white/30 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-4xl">
                  {profileImage}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                    <h1 className="text-2xl font-bold">{profileData.name}</h1>
                    <Badge className="bg-white/20 text-white border-0 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {t.verified}
                    </Badge>
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
                    {t.refresh}
                  </Button>
                  <Button 
                    variant={isEditing ? "default" : "secondary"} 
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)} 
                    className={isEditing ? "bg-white text-green-700 hover:bg-gray-100" : "bg-white/20 hover:bg-white/30 text-white border-0"} 
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? t.save : t.edit}
                  </Button>
                </div>
              </div>
              {isEditing ? (
                <Textarea 
                  value={profileData.bio} 
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} 
                  className="bg-white/10 text-white placeholder:text-green-200 border-white/20" 
                  rows={2} 
                />
              ) : (
                <p className="text-green-100 text-sm mb-3">{profileData.bio}</p>
              )}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {profileData.specialties.map((spec, i) => (
                  <Badge key={i} className="bg-white/20 text-white border-0">{spec}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Users className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{stats.followers.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{t.followers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <UserIcon className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{stats.following}</p>
            <p className="text-xs text-gray-500">{t.following}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1 fill-current" />
            <p className="text-xl font-bold">{stats.rating}</p>
            <p className="text-xs text-gray-500">{t.rating}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <MessageSquare className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{stats.reviews}</p>
            <p className="text-xs text-gray-500">{t.reviews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{stats.transactions}</p>
            <p className="text-xs text-gray-500">{t.transactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Pi className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{stats.piEarned.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{t.piEarned}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Briefcase className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <p className="text-xl font-bold">{stats.servicesOffered}</p>
            <p className="text-xs text-gray-500">{t.servicesOffered}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1">
              <span className="text-sm">π</span>
            </div>
            <Button 
              variant="link" 
              size="sm" 
              className="text-xs p-0 h-auto"
              onClick={() => setShowQRModal(true)}
            >
              {t.showQR}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon className="h-4 w-4" />
            {t.profile}
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <Activity className="h-4 w-4" />
            {t.activities}
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            {t.settings}
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.contact}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <>
                    <div><Label>Téléphone</Label><Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} /></div>
                    <div><Label>Email</Label><Input value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} /></div>
                    <div><Label>Site web</Label><Input value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} /></div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-gray-500" /><span>{profileData.phone}</span></div>
                    <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-gray-500" /><span>{profileData.email}</span></div>
                    <div className="flex items-center gap-3"><Globe className="h-4 w-4 text-gray-500" /><a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profileData.website}</a></div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Langues et Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.languages}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.languages.map((lang, i) => (<Badge key={i} variant="outline">{lang}</Badge>))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                {t.certifications}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profileData.certifications.map((cert, i) => (
                  <Badge key={i} className="bg-yellow-100 text-yellow-800">{cert}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Wallet */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                {t.walletAddress}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                  {profileData.walletAddress.substring(0, 20)}...{profileData.walletAddress.substring(profileData.walletAddress.length - 10)}
                </code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(profileData.walletAddress)}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Activités */}
        <TabsContent value="activities" className="mt-6 space-y-4">
          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                {t.badges}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {badges.map((badge) => (
                  <div key={badge.name} className="text-center">
                    <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-2 shadow-md`}>
                      {badge.icon}
                    </div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <Progress value={badge.progress} className="h-1 mt-1" />
                    {badge.earned && <p className="text-xs text-gray-400 mt-1">{formatDate(badge.earned)}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activités récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                {t.recentActivity}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avis récents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                {t.recentReviews}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reviews.map((review, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold">
                          {review.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.user}</p>
                          <p className="text-xs text-gray-400">{review.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(review.date)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres */}
        <TabsContent value="settings" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                {t.settings}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Thème */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {theme === "light" ? <Sun className="h-5 w-5 text-yellow-500" /> : theme === "dark" ? <Moon className="h-5 w-5 text-blue-500" /> : <Sun className="h-5 w-5 text-gray-500" />}
                  <div>
                    <p className="font-medium">{t.theme}</p>
                    <p className="text-xs text-gray-500">Clair / Sombre / Système</p>
                  </div>
                </div>
                <Select value={theme} onValueChange={(v) => setTheme(v as any)}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{t.light}</SelectItem>
                    <SelectItem value="dark">{t.dark}</SelectItem>
                    <SelectItem value="system">{t.system}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{t.notifications}</p>
                    <p className="text-xs text-gray-500">Recevoir des alertes</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                  {notificationsEnabled ? t.enabled : t.disabled}
                </Button>
              </div>

              {/* Langue */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <GlobeIcon className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{t.language}</p>
                    <p className="text-xs text-gray-500">Changer la langue</p>
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">{lang.flag} {lang.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Confidentialité */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">{t.privacy}</p>
                    <p className="text-xs text-gray-500">Gérer vos données</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configurer</Button>
              </div>

              {/* Déconnexion */}
              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  {t.logout}
                </Button>
              </div>

              {/* Suppression compte */}
              <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 gap-2" onClick={() => setShowDeleteConfirm(true)}>
                <AlertTriangle className="h-4 w-4" />
                {t.deleteAccount}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal QR Code */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-purple-600" />
              {t.qrCode}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <div className="w-48 h-48 mx-auto bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center">
                <QrCode className="h-32 w-32 text-purple-600" />
              </div>
            </div>
            <code className="text-xs font-mono break-all bg-gray-100 p-2 rounded-lg block">{profileData.walletAddress}</code>
            <Button className="mt-4 w-full gap-2" onClick={() => copyToClipboard(profileData.walletAddress)}>
              <Copy className="h-4 w-4" />
              {t.copy}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation suppression */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t.confirmDelete}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{t.deleteConfirmMessage}</p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>{t.cancel}</Button>
            <Button variant="destructive" className="flex-1">Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composants manquants
const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const Activity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)