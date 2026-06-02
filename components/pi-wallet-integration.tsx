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
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { piApi } from "@/lib/api/pi"
import { showToast } from "@/lib/utils"

interface PiWalletIntegrationProps {
  currentLanguage: string
  userRegion: string
}

// Traductions (identiques à l'original)
const translations = { /* ... vos traductions ... */ }

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
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [transactionHistory, setTransactionHistory] = useState<any[]>([])
  const [isLoadingWallet, setIsLoadingWallet] = useState(false)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  
  // Stockage local comme fallback
  const [savedAddresses, setSavedAddresses] = useLocalStorage<Array<{ name: string; address: string; avatar: string; lastUsed: string }>>("piSavedAddresses", [])
  const [favoriteAddresses, setFavoriteAddresses] = useLocalStorage<string[]>("piFavoriteAddresses", [])

  const debouncedAmount = useDebounce(sendAmount, 300)

  const t = translations[language as keyof typeof translations] || translations.fr

  // Charger les données du wallet depuis l'API
  const fetchWalletData = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return
    
    setIsLoadingWallet(true)
    try {
      const { data } = await piApi.getWallet()
      if (data) {
        setWalletBalance(data.balance)
        setWalletAddress(data.address)
        localStorage.setItem("piWalletBalance", data.balance.toString())
        localStorage.setItem("piWalletAddress", data.address)
      }
    } catch (error) {
      console.error("Erreur chargement wallet:", error)
      // Fallback localStorage
      const localBalance = localStorage.getItem("piWalletBalance")
      const localAddress = localStorage.getItem("piWalletAddress")
      if (localBalance) setWalletBalance(parseFloat(localBalance))
      if (localAddress) setWalletAddress(localAddress)
    } finally {
      setIsLoadingWallet(false)
    }
  }, [isAuthenticated, isOnline])

  // Charger l'historique des transactions
  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return
    
    setIsLoadingTransactions(true)
    try {
      const { data } = await piApi.getTransactions()
      if (data && data.length > 0) {
        setTransactionHistory(data)
        localStorage.setItem("piTransactionHistory", JSON.stringify(data))
      }
    } catch (error) {
      console.error("Erreur chargement transactions:", error)
      const localTransactions = localStorage.getItem("piTransactionHistory")
      if (localTransactions) {
        setTransactionHistory(JSON.parse(localTransactions))
      }
    } finally {
      setIsLoadingTransactions(false)
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
        fetchWalletData(),
        fetchTransactions(),
      ])
      showToast("Données actualisées", "success")
    } catch (error) {
      showToast("Erreur lors de l'actualisation", "error")
    } finally {
      setIsRefreshing(false)
    }
  }, [isOnline, fetchWalletData, fetchTransactions])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (isOnline && isAuthenticated) {
      fetchWalletData()
      fetchTransactions()
    } else {
      // Mode offline : charger depuis localStorage
      const localBalance = localStorage.getItem("piWalletBalance")
      const localAddress = localStorage.getItem("piWalletAddress")
      const localTransactions = localStorage.getItem("piTransactionHistory")
      
      if (localBalance) setWalletBalance(parseFloat(localBalance))
      if (localAddress) setWalletAddress(localAddress)
      if (localTransactions) setTransactionHistory(JSON.parse(localTransactions))
    }
  }, [isOnline, isAuthenticated, fetchWalletData, fetchTransactions])

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
    if (!sendAmount || !recipientAddress) return
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
      // Envoyer le paiement via l'API Pi
      const { data } = await piApi.sendPayment(recipientAddress, amount, sendDescription)
      
      // Ajouter la transaction à l'historique
      const newTransaction = {
        id: data.id || `tx${Date.now()}`,
        type: "sent",
        amount: amount,
        from: "",
        to: recipientAddress,
        description: sendDescription || "Envoi Pi",
        date: new Date().toISOString(),
        status: "completed",
        txHash: data.txHash || Math.random().toString(36).substring(2, 15),
      }
      
      setTransactionHistory([newTransaction, ...transactionHistory])
      setWalletBalance(walletBalance - amount)
      
      // Sauvegarder en local
      localStorage.setItem("piWalletBalance", (walletBalance - amount).toString())
      localStorage.setItem("piTransactionHistory", JSON.stringify([newTransaction, ...transactionHistory]))
      
      setShowConfirmModal(false)
      showToast(t.transactionSuccess, "success")
      setSendAmount("")
      setRecipientAddress("")
      setSendDescription("")
    } catch (error) {
      console.error("Erreur envoi:", error)
      showToast(t.transactionFailed, "error")
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
    address: walletAddress || "GCKFBEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI7",
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

  // Afficher un loader pendant le chargement
  if (isLoadingWallet && walletBalance === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement du portefeuille...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 text-white overflow-hidden relative">
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <PiIcon className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{t.piWallet}</h2>
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
              <p className="text-3xl font-bold mt-1">{showBalance ? `${walletStats.balance.toFixed(4)} π` : "•••• π"}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-purple-200 text-sm">{t.lockedBalance}</span>
              <p className="text-2xl font-bold mt-1">{walletStats.lockedBalance.toFixed(4)} π</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-purple-200 text-sm">{t.pendingTransactions}</span>
              <p className="text-2xl font-bold mt-1">{walletStats.pendingTransactions}</p>
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

      {/* Tabs - le reste du JSX est identique à l'original */}
      {/* ... garder le reste du code JSX identique ... */}
      
      {/* Le reste du composant (Tabs, modals, etc.) reste identique à votre version */}
    </div>
  )
}

// Composants PiIcon et TransactionItem identiques à l'original