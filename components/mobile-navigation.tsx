"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onMenuToggle: () => void
  unreadCount?: number
  notificationCount?: number
  currentLanguage?: string
}

// Traductions
const translations = {
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
  },
}

export default function MobileNavigation({ 
  activeTab, 
  onTabChange, 
  onMenuToggle, 
  unreadCount = 3,
  notificationCount = 5,
  currentLanguage = "fr"
}: MobileNavigationProps) {
  const [showExtendedMenu, setShowExtendedMenu] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeItem, setActiveItem] = useState(activeTab)

  const t = translations[currentLanguage as keyof typeof translations] || translations.fr

  // Navigation principale (5 éléments)
  const mainNavigationItems = [
    { id: "home", label: t.home, icon: Home, color: "text-green-600", activeColor: "bg-green-600" },
    { id: "messages", label: t.messages, icon: MessageSquare, color: "text-blue-600", activeColor: "bg-blue-600", badge: unreadCount },
    { id: "marketplace", label: t.marketplace, icon: Store, color: "text-purple-600", activeColor: "bg-purple-600" },
    { id: "data", label: t.data, icon: BarChart3, color: "text-orange-600", activeColor: "bg-orange-600" },
    { id: "menu", label: t.menu, icon: Menu, color: "text-gray-600", activeColor: "bg-gray-600", action: "menu" },
  ]

  // Menu étendu (options supplémentaires)
  const extendedMenuItems = [
    { id: "network", label: t.network, icon: Users, color: "text-cyan-600", bgColor: "bg-cyan-50" },
    { id: "wallet", label: t.wallet, icon: Wallet, color: "text-purple-600", bgColor: "bg-purple-50", badge: "π" },
    { id: "alerts", label: t.alerts, icon: Bell, color: "text-red-600", bgColor: "bg-red-50", badge: notificationCount },
    { id: "profile", label: t.profile, icon: User, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { id: "settings", label: t.settings, icon: Settings, color: "text-gray-600", bgColor: "bg-gray-50" },
  ]

  // Gestion de la visibilité au scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Mettre à jour l'élément actif
  useEffect(() => {
    setActiveItem(activeTab)
  }, [activeTab])

  // Fermer le menu étendu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      if (showExtendedMenu) setShowExtendedMenu(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [showExtendedMenu])

  const handleTabChange = (id: string, action?: string) => {
    if (action === "menu") {
      setShowExtendedMenu(!showExtendedMenu)
    } else {
      onTabChange(id === "marketplace" ? "services" : id === "data" ? "analytics" : id)
      setActiveItem(id)
      if (showExtendedMenu) setShowExtendedMenu(false)
    }
  }

  const handleExtendedMenuClick = (id: string) => {
    onTabChange(id)
    setActiveItem(id)
    setShowExtendedMenu(false)
  }

  return (
    <>
      {/* Menu étendu flottant */}
      {showExtendedMenu && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Menu rapide</h3>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setShowExtendedMenu(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {extendedMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleExtendedMenuClick(item.id)}
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
                        {typeof item.badge === "number" ? (
                          <span className="text-xs text-red-500 font-medium">{item.badge} non lus</span>
                        ) : (
                          <span className="text-xs text-purple-500 font-medium flex items-center gap-0.5">
                            <Wallet className="h-2.5 w-2.5" />
                            {item.badge} disponible
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {isActive && <CheckIcon className="h-4 w-4 text-green-500" />}
                </button>
              )
            })}
          </div>
          <div className="p-3 border-t bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Accès rapide</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Basé sur votre position</span>
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
        {/* Indicateur de swipe pour fermer */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
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
                onClick={() => handleTabChange(item.id, item.action)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
                  isActive ? "scale-105" : "hover:scale-102"
                }`}
              >
                {/* Badge de notification */}
                {item.badge && item.badge > 0 && !isActive && (
                  <div className="absolute -top-1 right-3 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-[10px] font-bold text-white">{item.badge > 9 ? "9+" : item.badge}</span>
                  </div>
                )}

                {/* Animation de pulsation pour l'élément actif */}
                {isActive && (
                  <div className="absolute inset-0 bg-green-50 rounded-xl animate-pulse-slow"></div>
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
              <span className="text-[10px] text-gray-500">4.8</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-0.5">
              <Leaf className="h-3 w-3 text-green-600" />
              <span className="text-[10px] text-gray-500">Agriculture</span>
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            <div className="flex items-center gap-0.5">
              <Wallet className="h-3 w-3 text-purple-600" />
              <span className="text-[10px] text-gray-500">Pi prêt</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-[10px] gap-1 text-gray-500 hover:text-green-600"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ChevronUp className="h-3 w-3" />
            Haut
          </Button>
        </div>
      </div>

      {/* Overlay pour le menu étendu */}
      {showExtendedMenu && (
        <div className="lg:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setShowExtendedMenu(false)} />
      )}

      {/* Styles personnalisés */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  )
}

// Composant CheckIcon manquant
const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)