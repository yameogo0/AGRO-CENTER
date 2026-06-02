"use client"

"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  Send,
  QrCode,
  History,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Lock,
  Fingerprint,
  Smartphone,
  Receipt,
  PieChart,
  Download,
  Filter,
  Star,
  Users,
  Calendar,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ExternalLink,
  Wifi,
  WifiOff,
  Loader2,
  DollarSign,
  CreditCard,
  Gift,
  Zap,
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { showToast } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface PiWalletIntegrationProps {
  currentLanguage: string
  userRegion: string
}

// Traductions multilingues
const translations: Record<string, any> = {
  fr: {
    piWallet: "Portefeuille Pi",
    connected: "Connecté au réseau Pi",
    availableBalance: "Solde disponible",
    lockedBalance: "Solde verrouillé",
    pendingTransactions: "Transactions en attente",
    walletAddress: "Adresse du portefeuille",
    copy: "Copier",
    copyAddress: "Adresse copiée",
    showQR: "QR Code",
    receivePi: "Recevoir",
    sendPi: "Envoyer",
    refresh: "Actualiser",
    online: "En ligne",
    offline: "Hors ligne",
    recentTransactions: "Transactions récentes",
    noTransactions: "Aucune transaction",
    transactionSuccess: "Transaction réussie",
    transactionFailed: "Transaction échouée",
    insufficientBalance: "Solde insuffisant",
    recipient: "Destinataire",
    amount: "Montant",
    description: "Description",
    confirm: "Confirmer",
    cancel: "Annuler",
    send: "Envoyer",
    all: "Toutes",
    sent: "Envoyées",
    received: "Reçues",
    earnings: "Gains",
    spending: "Dépenses",
    security: "Sécurité",
    twoFactorAuth: "Authentification à deux facteurs",
    biometricAuth: "Authentification biométrique",
    dailyLimit: "Limite quotidienne",
    securityScore: "Score de sécurité",
    enabled: "Activé",
    disabled: "Désactivé",
    upgrade: "Améliorer",
    viewDetails: "Voir détails",
    comingSoon: "Bientôt disponible",
    loading: "Chargement...",
  },
  en: {
    piWallet: "Pi Wallet",
    connected: "Connected to Pi Network",
    availableBalance: "Available balance",
    lockedBalance: "Locked balance",
    pendingTransactions: "Pending transactions",
    walletAddress: "Wallet address",
    copy: "Copy",
    copyAddress: "Address copied",
    showQR: "QR Code",
    receivePi: "Receive",
    sendPi: "Send",
    refresh: "Refresh",
    online: "Online",
    offline: "Offline",
    recentTransactions: "Recent transactions",
    noTransactions: "No transactions",
    transactionSuccess: "Transaction successful",
    transactionFailed: "Transaction failed",
    insufficientBalance: "Insufficient balance",
    recipient: "Recipient",
    amount: "Amount",
    description: "Description",
    confirm: "Confirm",
    cancel: "Cancel",
    send: "Send",
    all: "All",
    sent: "Sent",
    received: "Received",
    earnings: "Earnings",
    spending: "Spending",
    security: "Security",
    twoFactorAuth: "Two-factor authentication",
    biometricAuth: "Biometric authentication",
    dailyLimit: "Daily limit",
    securityScore: "Security score",
    enabled: "Enabled",
    disabled: "Disabled",
    upgrade: "Upgrade",
    viewDetails: "View details",
    comingSoon: "Coming soon",
    loading: "Loading...",
  },
  es: {
    piWallet: "Billetera Pi",
    connected: "Conectado a Pi Network",
    availableBalance: "Saldo disponible",
    lockedBalance: "Saldo bloqueado",
    pendingTransactions: "Transacciones pendientes",
    walletAddress: "Dirección de la billetera",
    copy: "Copiar",
    copyAddress: "Dirección copiada",
    showQR: "Código QR",
    receivePi: "Recibir",
    sendPi: "Enviar",
    refresh: "Actualizar",
    online: "En línea",
    offline: "Desconectado",
    recentTransactions: "Transacciones recientes",
    noTransactions: "Sin transacciones",
    transactionSuccess: "Transacción exitosa",
    transactionFailed: "Transacción fallida",
    insufficientBalance: "Saldo insuficiente",
    recipient: "Destinatario",
    amount: "Cantidad",
    description: "Descripción",
    confirm: "Confirmar",
    cancel: "Cancelar",
    send: "Enviar",
    all: "Todas",
    sent: "Enviadas",
    received: "Recibidas",
    earnings: "Ganancias",
    spending: "Gastos",
    security: "Seguridad",
    twoFactorAuth: "Autenticación de dos factores",
    biometricAuth: "Autenticación biométrica",
    dailyLimit: "Límite diario",
    securityScore: "Puntuación de seguridad",
    enabled: "Activado",
    disabled: "Desactivado",
    upgrade: "Mejorar",
    viewDetails: "Ver detalles",
    comingSoon: "Próximamente",
    loading: "Cargando...",
  },
  pt: {
    piWallet: "Carteira Pi",
    connected: "Conectado à Pi Network",
    availableBalance: "Saldo disponível",
    lockedBalance: "Saldo bloqueado",
    pendingTransactions: "Transações pendentes",
    walletAddress: "Endereço da carteira",
    copy: "Copiar",
    copyAddress: "Endereço copiado",
    showQR: "QR Code",
    receivePi: "Receber",
    sendPi: "Enviar",
    refresh: "Atualizar",
    online: "Online",
    offline: "Offline",
    recentTransactions: "Transações recentes",
    noTransactions: "Sem transações",
    transactionSuccess: "Transação bem-sucedida",
    transactionFailed: "Transação falhou",
    insufficientBalance: "Saldo insuficiente",
    recipient: "Destinatário",
    amount: "Valor",
    description: "Descrição",
    confirm: "Confirmar",
    cancel: "Cancelar",
    send: "Enviar",
    all: "Todas",
    sent: "Enviadas",
    received: "Recebidas",
    earnings: "Ganhos",
    spending: "Gastos",
    security: "Segurança",
    twoFactorAuth: "Autenticação de dois fatores",
    biometricAuth: "Autenticação biométrica",
    dailyLimit: "Limite diário",
    securityScore: "Pontuação de segurança",
    enabled: "Ativado",
    disabled: "Desativado",
    upgrade: "Melhorar",
    viewDetails: "Ver detalhes",
    comingSoon: "Em breve",
    loading: "Carregando...",
  },
}

export default function PiWalletIntegration({ currentLanguage, userRegion }: PiWalletIntegrationProps) {
  const [activeTab, setActiveTab] = useState("wallet")
  const [showBalance, setShowBalance] = useState(true)
  const [sendAmount, setSendAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [sendDescription, setSendDescription] = useState("")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [language, setLanguage] = useState(currentLanguage)
  const [filterType, setFilterType] = useState<"all" | "sent" | "received">("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData } = usePiAuth()
  
  // État pour les données du wallet
  const [walletBalance, setWalletBalance] = useState<number>(12.8456)
  const [walletAddress, setWalletAddress] = useState<string>("GCKFBEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI7")
  const [transactionHistory, setTransactionHistory] = useState<any[]>([
    {
      id: "1",
      type: "received",
      amount: 2.5,
      from: "Dr. Aminata Traoré",
      to: "Mon portefeuille",
      description: "Consultation vétérinaire",
      date: new Date(Date.now() - 3600000).toISOString(),
      status: "completed",
      txHash: "0xabc123def456",
    },
    {
      id: "2",
      type: "sent",
      amount: 0.8,
      from: "Mon portefeuille",
      to: "Coopérative YELEN",
      description: "Achat aliments",
      date: new Date(Date.now() - 86400000).toISOString(),
      status: "completed",
      txHash: "0xdef456ghi789",
    },
    {
      id: "3",
      type: "received",
      amount: 1.2,
      from: "Ibrahim Sawadogo",
      to: "Mon portefeuille",
      description: "Vente semences",
      date: new Date(Date.now() - 172800000).toISOString(),
      status: "completed",
      txHash: "0xghi789jkl012",
    },
    {
      id: "4",
      type: "sent",
      amount: 0.5,
      from: "Mon portefeuille",
      to: "Ferme Moderne",
      description: "Location matériel",
      date: new Date(Date.now() - 259200000).toISOString(),
      status: "pending",
      txHash: "0xjkl012mno345",
    },
  ])
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  
  // Stockage local
  const [savedAddresses, setSavedAddresses] = useLocalStorage<Array<{ name: string; address: string; avatar: string; lastUsed: string }>>("piSavedAddresses", [
    { name: "Dr. Aminata Traoré", address: "GBAKFEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI8", avatar: "👩‍⚕️", lastUsed: new Date(Date.now() - 3600000).toISOString() },
    { name: "Coopérative YELEN", address: "GCCKFEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI9", avatar: "🏢", lastUsed: new Date(Date.now() - 86400000).toISOString() },
  ])
  const [favoriteAddresses, setFavoriteAddresses] = useLocalStorage<string[]>("piFavoriteAddresses", ["GBAKFEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI8"])

  const debouncedAmount = useDebounce(sendAmount, 300)

  const t = translations[language as keyof typeof translations] || translations.fr

  // Rafraîchir toutes les données
  const refreshAllData = useCallback(async () => {
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    
    setIsRefreshing(true)
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800))
      setWalletBalance(prev => prev + Math.random() * 0.5 - 0.2)
      showToast("Données actualisées", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return `Aujourd'hui à ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    if (diffDays === 1) return `Hier à ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
  }

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    showToast(message, "success")
  }

  const handleSendPi = () => {
    if (!sendAmount || !recipientAddress) {
      showToast("Veuillez remplir tous les champs", "error")
      return
    }
    if (!isOnline) {
      showToast("Connexion internet requise pour envoyer des Pi", "error")
      return
    }
    if (!isAuthenticated) {
      showToast("Veuillez vous connecter avec Pi Network", "error")
      return
    }
    setShowConfirmModal(true)
  }

  const confirmSend = async () => {
    const amount = parseFloat(sendAmount)
    if (amount > walletBalance) {
      showToast(t.insufficientBalance, "error")
      return
    }
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newTransaction = {
        id: `tx${Date.now()}`,
        type: "sent",
        amount: amount,
        from: "Mon portefeuille",
        to: recipientAddress,
        description: sendDescription || "Envoi Pi",
        date: new Date().toISOString(),
        status: "completed",
        txHash: Math.random().toString(36).substring(2, 15),
      }
      
      setTransactionHistory([newTransaction, ...transactionHistory])
      setWalletBalance(walletBalance - amount)
      
      setShowConfirmModal(false)
      showToast("Transaction réussie", "success")
      setSendAmount("")
      setRecipientAddress("")
      setSendDescription("")
    } catch (error) {
      showToast("Transaction échouée", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToFavorites = (address: string) => {
    if (favoriteAddresses.includes(address)) {
      setFavoriteAddresses(favoriteAddresses.filter(a => a !== address))
      showToast("Retiré des favoris", "info")
    } else {
      setFavoriteAddresses([...favoriteAddresses, address])
      showToast("Ajouté aux favoris", "success")
    }
  }

  const walletStats = {
    balance: walletBalance,
    lockedBalance: 2.1567,
    pendingTransactions: transactionHistory.filter(tx => tx.status === "pending").length,
    totalEarned: transactionHistory.filter(tx => tx.type === "received").reduce((sum, tx) => sum + tx.amount, 0),
    totalSpent: transactionHistory.filter(tx => tx.type === "sent").reduce((sum, tx) => sum + tx.amount, 0),
    address: walletAddress,
    securityScore: 92,
    twoFactorEnabled: true,
    biometricEnabled: true,
    dailyLimit: 50,
  }

  const filteredTransactions = transactionHistory.filter(tx => {
    if (filterType === "sent") return tx.type === "sent"
    if (filterType === "received") return tx.type === "received"
    return true
  })

  const analytics = {
    monthlyEarnings: [
      { month: "Jan", amount: 12.5 }, { month: "Fév", amount: 15.8 }, { month: "Mar", amount: 18.2 },
      { month: "Avr", amount: 14.7 }, { month: "Mai", amount: 22.1 }, { month: "Juin", amount: 19.6 },
    ],
    topServices: [
      { service: "Consultation vétérinaire", earnings: 8.45, transactions: 23, icon: "👨‍⚕️" },
      { service: "Formation aviculture", earnings: 6.78, transactions: 15, icon: "🐔" },
      { service: "Conseil technique", earnings: 4.32, transactions: 18, icon: "💡" },
    ],
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Wallet Overview */}
      <Card className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{t.piWallet}</h2>
                  {!isOnline && (
                    <Badge className="bg-yellow-500 text-white text-xs gap-1">
                      <WifiOff className="h-3 w-3" />
                      {t.offline}
                    </Badge>
                  )}
                  {isOnline && (
                    <Badge className="bg-green-500 text-white text-xs gap-1">
                      <Wifi className="h-3 w-3" />
                      {t.online}
                    </Badge>
                  )}
                  {isRefreshing && (
                    <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                  )}
                </div>
                <p className="text-purple-200 text-sm">{t.connected}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-0" 
                onClick={refreshAllData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {t.refresh}
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0" onClick={() => setShowQRModal(true)}>
                <QrCode className="h-4 w-4 mr-2" />{t.receivePi}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-purple-200 text-sm">{t.availableBalance}</span>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-6 w-6 p-0" onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <p className="text-2xl md:text-3xl font-bold mt-1">{showBalance ? `${walletStats.balance.toFixed(4)} π` : "•••• π"}</p>
              <p className="text-xs text-purple-200 mt-1">≈ ${(walletStats.balance * 45).toFixed(2)} USD</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-purple-200 text-sm">{t.lockedBalance}</span>
              <p className="text-xl md:text-2xl font-bold mt-1">{walletStats.lockedBalance.toFixed(4)} π</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-purple-200 text-sm">{t.pendingTransactions}</span>
              <p className="text-xl md:text-2xl font-bold mt-1">{walletStats.pendingTransactions}</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm text-purple-200">{t.walletAddress}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 text-xs" onClick={() => copyToClipboard(walletStats.address, t.copyAddress)}>
                  <Copy className="h-3 w-3 mr-1" />{t.copy}
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 text-xs" onClick={() => setShowQRModal(true)}>
                  <ExternalLink className="h-3 w-3 mr-1" />{t.showQR}
                </Button>
              </div>
            </div>
            <p className="text-xs font-mono mt-1 break-all opacity-80">{walletStats.address.substring(0, 20)}...{walletStats.address.substring(walletStats.address.length - 10)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wallet" className="gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Portefeuille</span>
          </TabsTrigger>
          <TabsTrigger value="send" className="gap-2">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Envoyer</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Transactions</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analyses</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Portefeuille */}
        <TabsContent value="wallet" className="mt-6 space-y-4">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t.earnings}</p>
                    <p className="text-xl font-bold text-green-600">{walletStats.totalEarned.toFixed(2)} π</p>
                  </div>
                  <ArrowUpRight className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t.spending}</p>
                    <p className="text-xl font-bold text-red-600">{walletStats.totalSpent.toFixed(2)} π</p>
                  </div>
                  <ArrowDownLeft className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t.securityScore}</p>
                    <p className="text-xl font-bold text-purple-600">{walletStats.securityScore}%</p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
                <Progress value={walletStats.securityScore} className="mt-2 h-1" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{t.dailyLimit}</p>
                    <p className="text-xl font-bold text-blue-600">{walletStats.dailyLimit} π</p>
                  </div>
                  <Lock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                {t.security}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Lock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.twoFactorAuth}</p>
                    <p className="text-xs text-gray-500">Protection renforcée</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">{t.enabled}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Fingerprint className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.biometricAuth}</p>
                    <p className="text-xs text-gray-500">Empreinte digitale</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">{t.enabled}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Envoyer */}
        <TabsContent value="send" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.sendPi}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t.recipient}</label>
                <Input
                  placeholder="Adresse Pi ou @utilisateur"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>
              {savedAddresses.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Adresses récentes</p>
                  <div className="flex flex-wrap gap-2">
                    {savedAddresses.map((addr) => (
                      <Button
                        key={addr.address}
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => setRecipientAddress(addr.address)}
                      >
                        <span>{addr.avatar}</span>
                        {addr.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">{t.amount}</label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.001"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">π</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t.description}</label>
                <Input
                  placeholder="Motif du paiement"
                  value={sendDescription}
                  onChange={(e) => setSendDescription(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 gap-2"
                onClick={handleSendPi}
                disabled={!sendAmount || !recipientAddress || isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t.sendPi}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Transactions */}
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t.recentTransactions}</CardTitle>
              <div className="flex gap-2">
                <select
                  className="text-sm border rounded-lg px-2 py-1"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                >
                  <option value="all">{t.all}</option>
                  <option value="sent">{t.sent}</option>
                  <option value="received">{t.received}</option>
                </select>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-3 w-3" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{t.noTransactions}</p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "sent" ? "bg-red-100" : "bg-green-100"
                        }`}>
                          {tx.type === "sent" ? (
                            <ArrowUpRight className="h-5 w-5 text-red-600" />
                          ) : (
                            <ArrowDownLeft className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tx.description}</p>
                          <p className="text-xs text-gray-500">
                            {tx.type === "sent" ? tx.to : tx.from} • {formatDate(tx.date)}
                          </p>
                          {tx.status === "pending" && (
                            <Badge variant="outline" className="text-yellow-600 text-[10px] mt-1">En attente</Badge>
                          )}
                          {tx.txHash && (
                            <p className="text-[10px] text-gray-400 font-mono mt-1">{tx.txHash.substring(0, 10)}...</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === "sent" ? "text-red-600" : "text-green-600"}`}>
                          {tx.type === "sent" ? "-" : "+"}{tx.amount.toFixed(4)} π
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs mt-1"
                          onClick={() => copyToClipboard(tx.txHash, "Hash copié")}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Hash
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyses */}
        <TabsContent value="analytics" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Gains mensuels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-48">
                {analytics.monthlyEarnings.map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-green-500 rounded-t-lg transition-all duration-500 hover:bg-green-600"
                      style={{ height: `${(item.amount / 30) * 100}px` }}
                    />
                    <span className="text-xs text-gray-500">{item.month}</span>
                    <span className="text-[10px] font-medium">{item.amount} π</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Top services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topServices.map((service) => (
                  <div key={service.service} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{service.service}</p>
                        <p className="text-xs text-gray-500">{service.transactions} transactions</p>
                      </div>
                    </div>
                    <p className="font-bold text-purple-600">{service.earnings} π</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de confirmation d'envoi */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Confirmer l'envoi
              </h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Destinataire:</span>
                <span className="font-mono text-sm">{recipientAddress.substring(0, 15)}...</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Montant:</span>
                <span className="font-bold text-purple-600">{sendAmount} π</span>
              </div>
              {sendDescription && (
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="text-gray-600">Description:</span>
                  <span>{sendDescription}</span>
                </div>
              )}
              <div className="flex justify-between p-2 bg-yellow-50 rounded">
                <span className="text-yellow-600">Frais de réseau:</span>
                <span className="text-yellow-600">~0.001 π</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>
                {t.cancel}
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={confirmSend}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmer"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center animate-scale-in">
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowQRModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <QrCode className="h-32 w-32 text-white" />
              </div>
            </div>
            <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded-lg">{walletAddress}</p>
            <Button className="mt-4 w-full gap-2" onClick={() => copyToClipboard(walletAddress, "Adresse copiée")}>
              <Copy className="h-4 w-4" />
              {t.copyAddress}
            </Button>
            <p className="text-xs text-gray-500 mt-3">Scan pour recevoir des Pi</p>
          </div>
        </div>
      )}
    </div>
  )
}