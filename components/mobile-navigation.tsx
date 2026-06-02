"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  MessageSquare, 
  Store, 
  BarChart3, 
  Menu,
  Users,
  Wallet,
  Bell,
  User,
  Settings,
  Grid3x3,
  Leaf,
  ShoppingCart,
  TrendingUp,
  CircleHelp,
  X,
  ChevronUp,
  Sparkles,
  Clock,
  MapPin,
  Star,
  Wifi,
  WifiOff,
  ChevronDown,
  Heart,
  Gift,
  Calendar,
  HelpCircle,
  LogOut,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { showToast } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onMenuToggle: () => void
  unreadCount?: number
  notificationCount?: number
  currentLanguage?: string
}

// Traductions multilingues
const translations: Record<string, any> = {
  fr: {
    home: "Accueil",
    messages: "Messages",
    marketplace: "Marché",
    data: "Données",
    menu: "Menu",
    network: "Réseau",
    wallet: "Portefeuille",
    alerts: "Alertes",
    profile: "Profil",
    settings: "Paramètres",
    new: "Nouveau",
    close: "Fermer",
    online: "En ligne",
    offline: "Hors ligne",
    quickAccess: "Accès rapide",
    backToTop: "Haut",
    farming: "Agriculture",
    piReady: "Pi prêt",
    basedOnLocation: "Basé sur votre position",
    promotions: "Promotions",
    help: "Aide",
    logout: "Déconnexion",
    premium: "Premium",
    discover: "Découvrir",
    events: "Événements",
  },
  en: {
    home: "Home",
    messages: "Messages",
    marketplace: "Market",
    data: "Data",
    menu: "Menu",
    network: "Network",
    wallet: "Wallet",
    alerts: "Alerts",
    profile: "Profile",
    settings: "Settings",
    new: "New",
    close: "Close",
    online: "Online",
    offline: "Offline",
    quickAccess: "Quick access",
    backToTop: "Top",
    farming: "Farming",
    piReady: "Pi ready",
    basedOnLocation: "Based on your location",
    promotions: "Promotions",
    help: "Help",
    logout: "Logout",
    premium: "Premium",
    discover: "Discover",
    events: "Events",
  },
  es: {
    home: "Inicio",
    messages: "Mensajes",
    marketplace: "Mercado",
    data: "Datos",
    menu: "Menú",
    network: "Red",
    wallet: "Billetera",
    alerts: "Alertas",
    profile: "Perfil",
    settings: "Ajustes",
    new: "Nuevo",
    close: "Cerrar",
    online: "En línea",
    offline: "Desconectado",
    quickAccess: "Acceso rápido",
    backToTop: "Arriba",
    farming: "Agricultura",
    piReady: "Pi listo",
    basedOnLocation: "Basado en tu ubicación",
    promotions: "Promociones",
    help: "Ayuda",
    logout: "Cerrar sesión",
    premium: "Premium",
    discover: "Descubrir",
    events: "Eventos",
  },
  pt: {
    home: "Início",
    messages: "Mensagens",
    marketplace: "Mercado",
    data: "Dados",
    menu: "Menu",
    network: "Rede",
    wallet: "Carteira",
    alerts: "Alertas",
    profile: "Perfil",
    settings: "Configurações",
    new: "Novo",
    close: "Fechar",
    online: "Online",
    offline: "Offline",
    quickAccess: "Acesso rápido",
    backToTop: "Topo",
    farming: "Agricultura",
    piReady: "Pi pronto",
    basedOnLocation: "Baseado na sua localização",
    promotions: "Promoções",
    help: "Ajuda",
    logout: "Sair",
    premium: "Premium",
    discover: "Descobrir",
    events: "Eventos",
  },
  dioula: {
    home: "Soforo",
    messages: "Kumaw",
    marketplace: "Sugu",
    data: "Kunw",
    menu: "Menu",
    network: "Jekalaw",
    wallet: "Bɔlɔfanga",
    alerts: "Kununnakanw",
    profile: "Jatigila",
    settings: "Labɛnw",
    new: "Kura",
    close: "Dabɔ",
    online: "Ɛ ye",
    offline: "Ɛ tɛ ye",
    quickAccess: "Fara ka da",
    backToTop: "Sɛgɛn",
    farming: "Senekɛ",
    piReady: "Pi bɛ se",
    basedOnLocation: "I ka yɔrɔ la",
    promotions: "Jago",
    help: "Dɛmɛ",
    logout: "Bɔ",
    premium: "Gɛrɛn",
    discover: "Lafi",
    events: "Ko",
  },
}

export default function MobileNavigation({ 
  activeTab, 
  onTabChange, 
  onMenuToggle, 
  unreadCount: externalUnreadCount = 0,
  notificationCount: externalNotificationCount = 0,
  currentLanguage = "fr"
}: MobileNavigationProps) {
  const [showExtendedMenu, setShowExtendedMenu] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeItem, setActiveItem] = useState(activeTab)
  const [localUnreadCount, setLocalUnreadCount] = useState(externalUnreadCount)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const menuRef = useRef<HTMLDivElement>(null)
  const extendedMenuRef = useRef<HTMLDivElement>(null)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData, logout } = usePiAuth()
  const [savedUnreadCount] = useLocalStorage<number>("unreadMessagesCount", 0)
  const [savedNotificationCount] = useLocalStorage<number>("unreadNotificationsCount", 0)

  const t = translations[currentLanguage as keyof typeof translations] || translations.fr

  // Heure actuelle
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Navigation principale (5 éléments)
  const mainNavigationItems = [
    { id: "home", label: t.home, icon: Home, color: "text-green-600", activeColor: "bg-green-600", tab: "home" },
    { id: "messages", label: t.messages, icon: MessageSquare, color: "text-blue-600", activeColor: "bg-blue-600", badge: localUnreadCount || savedUnreadCount, tab: "messages" },
    { id: "marketplace", label: t.marketplace, icon: Store, color: "text-purple-600", activeColor: "bg-purple-600", tab: "services" },
    { id: "data", label: t.data, icon: BarChart3, color: "text-orange-600", activeColor: "bg-orange-600", tab: "analytics" },
    { id: "menu", label: t.menu, icon: Menu, color: "text-gray-600", activeColor: "bg-gray-600", action: "menu" },
  ]

  // Menu étendu (options supplémentaires)
  const extendedMenuItems = [
    { id: "network", label: t.network, icon: Users, color: "text-cyan-600", bgColor: "bg-cyan-50", tab: "messages" },
    { id: "wallet", label: t.wallet, icon: Wallet, color: "text-purple-600", bgColor: "bg-purple-50", badge: "π", tab: "wallet" },
    { id: "alerts", label: t.alerts, icon: Bell, color: "text-red-600", bgColor: "bg-red-50", badge: savedNotificationCount || externalNotificationCount, tab: "alerts" },
    { id: "profile", label: t.profile, icon: User, color: "text-emerald-600", bgColor: "bg-emerald-50", tab: "profile" },
    { id: "settings", label: t.settings, icon: Settings, color: "text-gray-600", bgColor: "bg-gray-50", tab: "settings" },
    { id: "premium", label: t.premium, icon: Crown, color: "text-yellow-600", bgColor: "bg-yellow-50", tab: "subscription" },
    { id: "discover", label: t.discover, icon: Compass, color: "text-indigo-600", bgColor: "bg-indigo-50", tab: "discover" },
    { id: "events", label: t.events, icon: Calendar, color: "text-pink-600", bgColor: "bg-pink-50", tab: "events" },
  ]

  // Formater l'heure
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Mettre à jour le compteur de messages non lus
  useEffect(() => {
    setLocalUnreadCount(externalUnreadCount || savedUnreadCount)
  }, [externalUnreadCount, savedUnreadCount])

  // Gestion de la visibilité au scroll avec debounce
  useEffect(() => {
    let ticking = false
    let scrollTimeout: NodeJS.Timeout
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false)
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true)
          }
          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
      
      // Afficher automatiquement après un arrêt du scroll
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [lastScrollY])

  // Mettre à jour l'élément actif
  useEffect(() => {
    setActiveItem(activeTab)
  }, [activeTab])

  // Fermer le menu étendu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (showExtendedMenu && extendedMenuRef.current && !extendedMenuRef.current.contains(target)) {
        setShowExtendedMenu(false)
      }
      if (showUserMenu && menuRef.current && !menuRef.current.contains(target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [showExtendedMenu, showUserMenu])

  const handleTabChange = (id: string, action?: string, tab?: string) => {
    if (action === "menu") {
      setShowExtendedMenu(!showExtendedMenu)
    } else {
      let targetTab = tab || id
      if (id === "marketplace") targetTab = "services"
      else if (id === "data") targetTab = "analytics"
      else if (id === "network") targetTab = "messages"
      else if (id === "premium") targetTab = "subscription"
      else if (id === "discover") targetTab = "discover"
      else if (id === "events") targetTab = "events"
      
      onTabChange(targetTab)
      setActiveItem(id)
      if (showExtendedMenu) setShowExtendedMenu(false)
      if (showUserMenu) setShowUserMenu(false)
    }
  }

  const handleExtendedMenuClick = (item: typeof extendedMenuItems[0]) => {
    let targetTab = item.tab
    if (item.id === "network") targetTab = "messages"
    if (item.id === "premium") targetTab = "subscription"
    if (item.id === "discover") targetTab = "discover"
    if (item.id === "events") targetTab = "events"
    
    onTabChange(targetTab)
    setActiveItem(item.id)
    setShowExtendedMenu(false)
    onMenuToggle()
  }

  const handleLogout = async () => {
    await logout()
    showToast("Déconnexion réussie", "success")
    setShowUserMenu(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Nom d'utilisateur pour l'affichage
  const userName = userData?.username?.split(" ")[0] || "Agriculteur"
  const userAvatar = userData?.avatar || userData?.username?.charAt(0).toUpperCase() || "🌾"

  return (
    <>
      {/* Menu utilisateur flottant (en haut à droite) */}
      {showUserMenu && (
        <div 
          ref={menuRef}
          className="fixed top-16 right-4 w-64 bg-white rounded-2xl shadow-2xl border z-50 animate-in slide-in-from-top-5 duration-200"
        >
          <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                <AvatarFallback className="bg-green-500 text-white text-lg">
                  {userAvatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">Membre Agro MC</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge className="bg-green-100 text-green-700 text-[10px]">
                    {isOnline ? t.online : t.offline}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button 
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => handleTabChange("profile", undefined, "profile")}
            >
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Mon profil</span>
            </button>
            <button 
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => handleTabChange("wallet", undefined, "wallet")}
            >
              <Wallet className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Mon portefeuille</span>
            </button>
            <button 
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => handleTabChange("settings", undefined, "settings")}
            >
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Paramètres</span>
            </button>
            <div className="border-t my-2" />
            <button 
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">{t.logout}</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu étendu flottant */}
      {showExtendedMenu && (
        <div 
          ref={extendedMenuRef}
          className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border z-50 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">{t.quickAccess}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={() => setShowExtendedMenu(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
            {extendedMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleExtendedMenuClick(item)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive ? item.bgColor + " ring-2 ring-offset-1 ring-green-500" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{item.label}</p>
                    {item.badge && (
                      <div className="flex items-center gap-1 mt-0.5">
                        {typeof item.badge === "number" && item.badge > 0 ? (
                          <span className="text-xs text-red-500 font-medium">{item.badge} non lus</span>
                        ) : item.badge === "π" ? (
                          <span className="text-xs text-purple-500 font-medium flex items-center gap-0.5">
                            <Wallet className="h-2.5 w-2.5" />
                            Pi actif
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
          <div className="p-3 border-t bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{t.quickAccess}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{t.basedOnLocation}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barre de navigation principale */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t shadow-lg transition-transform duration-300 z-40 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Indicateur de swipe */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Statut réseau et utilisateur */}
        <div className="flex items-center justify-between px-3 pt-1 pb-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {isOnline ? (
                <Wifi className="h-3 w-3 text-green-500" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-500" />
              )}
              <span className="text-[10px] text-gray-400">
                {isOnline ? t.online : t.offline}
              </span>
            </div>
            <div className="w-px h-3 bg-gray-300" />
            <div className="flex items-center gap-1">
              <Leaf className="h-3 w-3 text-green-600" />
              <span className="text-[10px] text-gray-400">{t.farming}</span>
            </div>
          </div>
          <button 
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-green-600 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-green-100 text-green-600 text-[10px]">
                {userAvatar}
              </AvatarFallback>
            </Avatar>
            <span>{userName}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-0 p-2 pb-3">
          {mainNavigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id || 
              (item.id === "marketplace" && activeTab === "services") ||
              (item.id === "data" && activeTab === "analytics")

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id, item.action, item.tab)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
                  isActive ? "scale-105" : "hover:scale-102"
                }`}
              >
                {/* Badge de notification */}
                {item.badge && item.badge > 0 && !isActive && (
                  <div className="absolute -top-1 right-3 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center animate-pulse z-10 shadow-sm">
                    <span className="text-[10px] font-bold text-white">{item.badge > 9 ? "9+" : item.badge}</span>
                  </div>
                )}

                {/* Animation de pulsation pour l'élément actif */}
                {isActive && (
                  <div className="absolute inset-0 bg-green-50 rounded-xl animate-pulse-slow" />
                )}

                <div className={`relative z-10 transition-all duration-200 ${isActive ? "transform -translate-y-0.5" : ""}`}>
                  <Icon className={`h-6 w-6 transition-all ${isActive ? item.color + " drop-shadow-md" : "text-gray-500"}`} />
                </div>

                <span className={`text-xs mt-1 transition-all font-medium ${isActive ? item.color : "text-gray-500"}`}>
                  {item.label}
                </span>

                {/* Indicateur actif */}
                {isActive && (
                  <div className={`absolute -bottom-2 w-8 h-1 ${item.activeColor} rounded-full transition-all duration-200`} />
                )}
              </button>
            )
          })}
        </div>

        {/* Barre d'information supplémentaire */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 text-yellow-500 fill-current" />
              <span className="text-[10px] text-gray-600">4.8</span>
            </div>
            <div className="w-px h-3 bg-gray-300" />
            <div className="flex items-center gap-0.5">
              <Heart className="h-3 w-3 text-red-500" />
              <span className="text-[10px] text-gray-600">1.2k</span>
            </div>
            <div className="w-px h-3 bg-gray-300" />
            <div className="flex items-center gap-0.5">
              <Wallet className="h-3 w-3 text-purple-600" />
              <span className="text-[10px] text-gray-600">{t.piReady}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-[10px] gap-1 text-gray-500 hover:text-green-600"
              onClick={scrollToTop}
            >
              <ChevronUp className="h-3 w-3" />
              {t.backToTop}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay pour le menu étendu */}
      {showExtendedMenu && (
        <div className="lg:hidden fixed inset-0 bg-black/20 z-40 animate-fade-in" onClick={() => setShowExtendedMenu(false)} />
      )}

      {/* Styles personnalisés */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes slide-in-bottom {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slide-in-top {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-in {
          animation: slide-in-bottom 0.2s ease-out;
        }
        .slide-in-from-top-5 {
          animation: slide-in-top 0.2s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .hover\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  )
}

// Composant Crown pour premium
const Crown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z" />
  </svg>
)

// Composant Compass pour découvrir
const Compass = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4v4m-4 4H4m8 0v4m4-4h4" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)