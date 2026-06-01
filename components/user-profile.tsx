"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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
  Facebook,
  Twitter,
  Linkedin,
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
} from "lucide-react"

interface UserProfileProps {
  currentLanguage: string
  userRegion: string
}

// Traductions multilingues
const translations = {
  fr: {
    profile: "Profil",
    activity: "Activité",
    badges: "Badges",
    reviews: "Avis",
    settings: "Paramètres",
    edit: "Modifier",
    save: "Sauvegarder",
    message: "Message",
    follow: "Suivre",
    share: "Partager",
    followers: "Abonnés",
    following: "Abonnements",
    reviewsCount: "avis",
    totalEarnings: "Gains totaux",
    contactInfo: "Informations de contact",
    phone: "Téléphone",
    email: "Email",
    website: "Site web",
    skills: "Compétences & Certifications",
    languages: "Langues parlées",
    certifications: "Certifications",
    recentActivity: "Activité récente",
    badgesAchievements: "Badges & Réalisations",
    earned: "Obtenu",
    clientReviews: "Avis clients",
    service: "Service",
    accountSettings: "Paramètres du compte",
    emailNotifications: "Notifications par email",
    publicProfile: "Profil public",
    twoFactorAuth: "Authentification à deux facteurs",
    interfaceLanguage: "Langue de l'interface",
    appearance: "Apparence",
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    system: "Système",
    dangerZone: "Zone dangereuse",
    deleteAccount: "Supprimer mon compte",
    deleteAccountWarning: "Cette action est irréversible. Toutes vos données seront supprimées.",
    confirmDelete: "Confirmer la suppression",
    cancel: "Annuler",
    walletAddress: "Adresse du portefeuille",
    copy: "Copier",
    copied: "Copié !",
    qrCode: "QR Code",
    piBalance: "Solde Pi",
    transactions: "Transactions",
    servicesOffered: "Services proposés",
    memberSince: "Membre depuis",
    public: "Public",
    private: "Privé",
    enabled: "Activé",
    disabled: "Désactivé",
    configure: "Configurer",
    followingYou: "Vous suit",
    verified: "Vérifié",
  },
  en: {
    profile: "Profile",
    activity: "Activity",
    badges: "Badges",
    reviews: "Reviews",
    settings: "Settings",
    edit: "Edit",
    save: "Save",
    message: "Message",
    follow: "Follow",
    share: "Share",
    followers: "Followers",
    following: "Following",
    reviewsCount: "reviews",
    totalEarnings: "Total earnings",
    contactInfo: "Contact information",
    phone: "Phone",
    email: "Email",
    website: "Website",
    skills: "Skills & Certifications",
    languages: "Languages spoken",
    certifications: "Certifications",
    recentActivity: "Recent activity",
    badgesAchievements: "Badges & Achievements",
    earned: "Earned",
    clientReviews: "Client reviews",
    service: "Service",
    accountSettings: "Account settings",
    emailNotifications: "Email notifications",
    publicProfile: "Public profile",
    twoFactorAuth: "Two-factor authentication",
    interfaceLanguage: "Interface language",
    appearance: "Appearance",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    system: "System",
    dangerZone: "Danger zone",
    deleteAccount: "Delete my account",
    deleteAccountWarning: "This action is irreversible. All your data will be deleted.",
    confirmDelete: "Confirm deletion",
    cancel: "Cancel",
    walletAddress: "Wallet address",
    copy: "Copy",
    copied: "Copied!",
    qrCode: "QR Code",
    piBalance: "Pi Balance",
    transactions: "Transactions",
    servicesOffered: "Services offered",
    memberSince: "Member since",
    public: "Public",
    private: "Private",
    enabled: "Enabled",
    disabled: "Disabled",
    configure: "Configure",
    followingYou: "Follows you",
    verified: "Verified",
  },
  es: {
    profile: "Perfil",
    activity: "Actividad",
    badges: "Insignias",
    reviews: "Reseñas",
    settings: "Ajustes",
    edit: "Editar",
    save: "Guardar",
    message: "Mensaje",
    follow: "Seguir",
    share: "Compartir",
    followers: "Seguidores",
    following: "Siguiendo",
    reviewsCount: "reseñas",
    totalEarnings: "Ganancias totales",
    contactInfo: "Información de contacto",
    phone: "Teléfono",
    email: "Correo",
    website: "Sitio web",
    skills: "Habilidades y Certificaciones",
    languages: "Idiomas hablados",
    certifications: "Certificaciones",
    recentActivity: "Actividad reciente",
    badgesAchievements: "Insignias y Logros",
    earned: "Obtenido",
    clientReviews: "Reseñas de clientes",
    service: "Servicio",
    accountSettings: "Configuración de cuenta",
    emailNotifications: "Notificaciones por correo",
    publicProfile: "Perfil público",
    twoFactorAuth: "Autenticación de dos factores",
    interfaceLanguage: "Idioma de interfaz",
    appearance: "Apariencia",
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    system: "Sistema",
    dangerZone: "Zona peligrosa",
    deleteAccount: "Eliminar mi cuenta",
    deleteAccountWarning: "Esta acción es irreversible. Todos tus datos serán eliminados.",
    confirmDelete: "Confirmar eliminación",
    cancel: "Cancelar",
    walletAddress: "Dirección de billetera",
    copy: "Copiar",
    copied: "¡Copiado!",
    qrCode: "Código QR",
    piBalance: "Saldo Pi",
    transactions: "Transacciones",
    servicesOffered: "Servicios ofrecidos",
    memberSince: "Miembro desde",
    public: "Público",
    private: "Privado",
    enabled: "Activado",
    disabled: "Desactivado",
    configure: "Configurar",
    followingYou: "Te sigue",
    verified: "Verificado",
  },
  pt: {
    profile: "Perfil",
    activity: "Atividade",
    badges: "Distintivos",
    reviews: "Avaliações",
    settings: "Configurações",
    edit: "Editar",
    save: "Salvar",
    message: "Mensagem",
    follow: "Seguir",
    share: "Compartilhar",
    followers: "Seguidores",
    following: "Seguindo",
    reviewsCount: "avaliações",
    totalEarnings: "Ganhos totais",
    contactInfo: "Informações de contato",
    phone: "Telefone",
    email: "Email",
    website: "Site",
    skills: "Habilidades e Certificações",
    languages: "Idiomas falados",
    certifications: "Certificações",
    recentActivity: "Atividade recente",
    badgesAchievements: "Distintivos e Conquistas",
    earned: "Obtido",
    clientReviews: "Avaliações de clientes",
    service: "Serviço",
    accountSettings: "Configurações da conta",
    emailNotifications: "Notificações por email",
    publicProfile: "Perfil público",
    twoFactorAuth: "Autenticação de dois fatores",
    interfaceLanguage: "Idioma da interface",
    appearance: "Aparência",
    lightMode: "Modo claro",
    darkMode: "Modo escuro",
    system: "Sistema",
    dangerZone: "Zona de perigo",
    deleteAccount: "Excluir minha conta",
    deleteAccountWarning: "Esta ação é irreversível. Todos os seus dados serão excluídos.",
    confirmDelete: "Confirmar exclusão",
    cancel: "Cancelar",
    walletAddress: "Endereço da carteira",
    copy: "Copiar",
    copied: "Copiado!",
    qrCode: "Código QR",
    piBalance: "Saldo Pi",
    transactions: "Transações",
    servicesOffered: "Serviços oferecidos",
    memberSince: "Membro desde",
    public: "Público",
    private: "Privado",
    enabled: "Ativado",
    disabled: "Desativado",
    configure: "Configurar",
    followingYou: "Segue você",
    verified: "Verificado",
  },
}

export default function UserProfile({ currentLanguage, userRegion }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState(currentLanguage)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")

  const t = translations[language as keyof typeof translations] || translations.fr

  const [profileData, setProfileData] = useState({
    name: "Aminata Traoré",
    bio: "Experte en aviculture moderne avec 15 ans d'expérience. Spécialisée dans l'optimisation de la production d'œufs et la gestion sanitaire des élevages.",
    location: "Ouagadougou, Burkina Faso",
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

  const handleSaveProfile = () => {
    setIsEditing(false)
    console.log("Profil sauvegardé:", profileData)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric", month: "long", day: "numeric"
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm">
                {profileData.profileImage}
              </div>
              <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <h1 className="text-2xl font-bold">{profileData.name}</h1>
                    <Badge className="bg-white/20 text-white border-0">✓ {t.verified}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-green-100 mt-1">
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{profileData.location}</span></div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{t.memberSince} {formatDate(profileData.joinDate)}</span></div>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button variant={isEditing ? "default" : "secondary"} onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)} className={isEditing ? "bg-white text-green-700 hover:bg-gray-100" : "bg-white/20 hover:bg-white/30 text-white border-0"}>
                    <Edit className="h-4 w-4 mr-2" />{isEditing ? t.save : t.edit}
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3 text-center"><div className="text-xl font-bold text-blue-600">{stats.followers.toLocaleString()}</div><div className="text-xs text-gray-500">{t.followers}</div></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><div className="text-xl font-bold text-green-600">{stats.following}</div><div className="text-xs text-gray-500">{t.following}</div></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><div className="flex items-center justify-center gap-0.5"><span className="text-xl font-bold text-yellow-600">{stats.rating}</span><Star className="h-4 w-4 text-yellow-500 fill-current" /></div><div className="text-xs text-gray-500">{stats.reviews} {t.reviewsCount}</div></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><div className="flex items-center justify-center gap-0.5"><Pi className="h-4 w-4 text-purple-600" /><span className="text-xl font-bold text-purple-600">{stats.piEarned.toFixed(2)}</span></div><div className="text-xs text-gray-500">{t.totalEarnings}</div></CardContent></Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2"><MessageSquare className="h-4 w-4" />{t.message}</Button>
        <Button variant="outline" className="gap-2"><Heart className="h-4 w-4" />{t.follow}</Button>
        <Button variant="outline" className="gap-2"><Share2 className="h-4 w-4" />{t.share}</Button>
        <Button variant="outline" className="gap-2" onClick={() => setShowQRModal(true)}><QrCode className="h-4 w-4" />{t.qrCode}</Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="profile" className="gap-1"><UserIcon className="h-4 w-4" /><span className="hidden sm:inline">{t.profile}</span></TabsTrigger>
          <TabsTrigger value="activity" className="gap-1"><TrendingUp className="h-4 w-4" /><span className="hidden sm:inline">{t.activity}</span></TabsTrigger>
          <TabsTrigger value="badges" className="gap-1"><Award className="h-4 w-4" /><span className="hidden sm:inline">{t.badges}</span></TabsTrigger>
          <TabsTrigger value="reviews" className="gap-1"><Star className="h-4 w-4" /><span className="hidden sm:inline">{t.reviews}</span></TabsTrigger>
          <TabsTrigger value="settings" className="gap-1"><Settings className="h-4 w-4" /><span className="hidden sm:inline">{t.settings}</span></TabsTrigger>
        </TabsList>

        {/* Profil */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" />{t.contactInfo}</CardTitle></CardHeader><CardContent className="space-y-3">
              {isEditing ? (<><div><Label>{t.phone}</Label><Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} /></div><div><Label>{t.email}</Label><Input value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} /></div><div><Label>{t.website}</Label><Input value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} /></div></>) : (<><div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /><span>{profileData.phone}</span></div><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /><span>{profileData.email}</span></div><div className="flex items-center gap-2"><Globe className="h-4 w-4 text-gray-400" /><span>{profileData.website}</span></div></>)}
            </CardContent></Card>

            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />{t.skills}</CardTitle></CardHeader><CardContent className="space-y-4"><div><h4 className="font-medium mb-2 text-sm">{t.languages}</h4><div className="flex flex-wrap gap-1">{profileData.languages.map((l, i) => (<Badge key={i} variant="outline">{l}</Badge>))}</div></div><div><h4 className="font-medium mb-2 text-sm">{t.certifications}</h4><div className="space-y-1">{profileData.certifications.map((cert, i) => (<div key={i} className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-500" /><span className="text-sm">{cert}</span></div>))}</div></div></CardContent></Card>
          </div>
        </TabsContent>

        {/* Activité */}
        <TabsContent value="activity" className="space-y-4 mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />{t.recentActivity}</CardTitle></CardHeader><CardContent><div className="space-y-3">{activities.map((act) => (<div key={act.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><span className="text-2xl">{act.icon}</span><div className="flex-1"><p className="text-sm font-medium">{act.title}</p><p className="text-xs text-gray-400">{formatDate(act.date)}</p></div></div>))}</div></CardContent></Card>
        </TabsContent>

        {/* Badges */}
        <TabsContent value="badges" className="space-y-4 mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />{t.badgesAchievements}</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{badges.map((badge, i) => (<div key={i} className="text-center p-3 bg-gray-50 rounded-lg"><div className={`w-14 h-14 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-2`}><span className="text-2xl text-white">{badge.icon}</span></div><h4 className="font-medium text-xs">{badge.name}</h4><p className="text-[10px] text-gray-400 mt-1">{t.earned} {formatDate(badge.earned)}</p></div>))}</div></CardContent></Card>
        </TabsContent>

        {/* Avis */}
        <TabsContent value="reviews" className="space-y-4 mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500" />{t.clientReviews} ({stats.reviews})</CardTitle></CardHeader><CardContent><div className="space-y-4">{reviews.map((rev, i) => (<div key={i} className="border-b pb-3 last:border-0"><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{rev.avatar}</div><span className="font-medium text-sm">{rev.user}</span></div><div className="flex items-center gap-0.5">{Array(rev.rating).fill(0).map((_, i) => (<Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />))}</div></div><p className="text-sm text-gray-600 mb-1">{rev.comment}</p><div className="flex justify-between text-xs text-gray-400"><span>{t.service}: {rev.service}</span><span>{formatDate(rev.date)}</span></div></div>))}</div></CardContent></Card>
        </TabsContent>

        {/* Paramètres */}
        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />{t.accountSettings}</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg"><div><h4 className="font-medium">{t.emailNotifications}</h4><p className="text-xs text-gray-400">Recevoir les notifications importantes</p></div><Badge className="bg-green-100 text-green-700">{t.enabled}</Badge></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><div><h4 className="font-medium">{t.publicProfile}</h4><p className="text-xs text-gray-400">Permettre aux autres de voir votre profil</p></div><Badge className="bg-green-100 text-green-700">{t.public}</Badge></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><div><h4 className="font-medium">{t.twoFactorAuth}</h4><p className="text-xs text-gray-400">Sécuriser votre compte</p></div><Button variant="outline" size="sm">{t.configure}</Button></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><div><h4 className="font-medium">{t.interfaceLanguage}</h4><p className="text-xs text-gray-400">Choisir la langue d'affichage</p></div><Select defaultValue={language} onValueChange={setLanguage}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fr">Français</SelectItem><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem><SelectItem value="pt">Português</SelectItem></SelectContent></Select></div>
            <div className="flex items-center justify-between p-3 border rounded-lg"><div><h4 className="font-medium">{t.appearance}</h4><p className="text-xs text-gray-400">Thème de l'application</p></div><div className="flex gap-1"><Button size="sm" variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")} className={theme === "light" ? "bg-green-600" : ""}><Sun className="h-3 w-3" /></Button><Button size="sm" variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")} className={theme === "dark" ? "bg-green-600" : ""}><Moon className="h-3 w-3" /></Button><Button size="sm" variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")} className={theme === "system" ? "bg-green-600" : ""}><GlobeIcon className="h-3 w-3" /></Button></div></div>
          </CardContent></Card>

          <Card className="border-red-200"><CardHeader><CardTitle className="flex items-center gap-2 text-red-600"><AlertTriangle className="h-5 w-5" />{t.dangerZone}</CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600 mb-4">{t.deleteAccountWarning}</p><Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => setShowDeleteConfirm(true)}><LogOut className="h-4 w-4 mr-2" />{t.deleteAccount}</Button></CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* QR Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-sm"><DialogHeader><DialogTitle className="text-center">{t.qrCode}</DialogTitle></DialogHeader><div className="text-center"><div className="w-48 h-48 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto"><div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center"><Pi className="h-16 w-16 text-purple-600" /></div></div><p className="font-mono text-xs break-all mt-4 p-2 bg-gray-100 rounded-lg">{profileData.walletAddress}</p><div className="flex gap-2 mt-4"><Button variant="outline" className="flex-1" onClick={() => copyToClipboard(profileData.walletAddress)}><Copy className="h-4 w-4 mr-2" />{copied ? t.copied : t.copy}</Button><Button variant="outline" className="flex-1"><Share2 className="h-4 w-4 mr-2" />{t.share}</Button></div></div></DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><AlertTriangle className="h-5 w-5" />{t.confirmDelete}</DialogTitle></DialogHeader><p className="text-gray-600">{t.deleteAccountWarning}</p><div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>{t.cancel}</Button><Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => setShowDeleteConfirm(false)}>{t.deleteAccount}</Button></div></DialogContent>
      </Dialog>
    </div>
  )
}

// Icône utilisateur
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)