"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnlineStatus } from "@/hooks/use-online-status"

interface PiWalletIntegrationProps {
  currentLanguage: string
  userRegion: string
}

// Traductions (identiques à l'original)
const translations = {
  fr: {
    wallet: "Portefeuille",
    send: "Envoyer",
    history: "Historique",
    analytics: "Analyses",
    piWallet: "Portefeuille Pi Network",
    connected: "Connecté et sécurisé",
    refresh: "Actualiser",
    availableBalance: "Solde disponible",
    lockedBalance: "Solde bloqué",
    pendingTransactions: "Transactions en attente",
    walletAddress: "Adresse du portefeuille",
    copy: "Copier",
    quickActions: "Actions rapides",
    sendPi: "Envoyer π",
    receivePi: "Recevoir π (QR Code)",
    requestPayment: "Demander un paiement",
    security: "Sécurité du portefeuille",
    recentTransactions: "Transactions récentes",
    viewAll: "Voir tout",
    totalEarned: "Total gagné",
    totalSpent: "Total dépensé",
    netProfit: "Bénéfice net",
    recipientAddress: "Adresse du destinataire",
    amount: "Montant (π)",
    description: "Description (optionnel)",
    warning: "Vérifiez bien l'adresse du destinataire. Les transactions Pi sont irréversibles.",
    quickSend: "Envoi rapide",
    transactionHistory: "Historique des transactions",
    filter: "Filtrer",
    export: "Exporter",
    completed: "Terminé",
    pending: "En attente",
    received: "Reçu",
    sent: "Envoyé",
    monthlyEarnings: "Gains mensuels",
    topServices: "Services les plus rentables",
    financialSummary: "Résumé financier",
    totalRevenue: "Revenus totaux",
    totalExpenses: "Dépenses totales",
    roi: "ROI",
    transactions: "Transactions",
    securityLevel: "Niveau de sécurité",
    twoFactorAuth: "Authentification à deux facteurs",
    biometricAuth: "Authentification biométrique",
    transactionLimit: "Limite de transaction",
    addressBook: "Carnet d'adresses",
    savedAddresses: "Adresses sauvegardées",
    addAddress: "Ajouter une adresse",
    qrScanner: "Scanner QR Code",
    showQR: "Afficher QR Code",
    copyAddress: "Copier l'adresse",
    shareAddress: "Partager l'adresse",
    confirmSend: "Confirmer l'envoi",
    enterAmount: "Entrez un montant",
    enterRecipient: "Entrez une adresse",
    insufficientBalance: "Solde insuffisant",
    transactionSuccess: "Transaction réussie",
    transactionFailed: "Transaction échouée",
    offline: "Hors ligne",
    online: "En ligne",
    balance: "Solde",
    recentActivity: "Activité récente",
    noTransactions: "Aucune transaction",
  },
  en: {
    wallet: "Wallet",
    send: "Send",
    history: "History",
    analytics: "Analytics",
    piWallet: "Pi Network Wallet",
    connected: "Connected & secured",
    refresh: "Refresh",
    availableBalance: "Available balance",
    lockedBalance: "Locked balance",
    pendingTransactions: "Pending transactions",
    walletAddress: "Wallet address",
    copy: "Copy",
    quickActions: "Quick actions",
    sendPi: "Send π",
    receivePi: "Receive π (QR Code)",
    requestPayment: "Request payment",
    security: "Wallet security",
    recentTransactions: "Recent transactions",
    viewAll: "View all",
    totalEarned: "Total earned",
    totalSpent: "Total spent",
    netProfit: "Net profit",
    recipientAddress: "Recipient address",
    amount: "Amount (π)",
    description: "Description (optional)",
    warning: "Please verify the recipient address. Pi transactions are irreversible.",
    quickSend: "Quick send",
    transactionHistory: "Transaction history",
    filter: "Filter",
    export: "Export",
    completed: "Completed",
    pending: "Pending",
    received: "Received",
    sent: "Sent",
    monthlyEarnings: "Monthly earnings",
    topServices: "Top earning services",
    financialSummary: "Financial summary",
    totalRevenue: "Total revenue",
    totalExpenses: "Total expenses",
    roi: "ROI",
    transactions: "Transactions",
    securityLevel: "Security level",
    twoFactorAuth: "Two-factor authentication",
    biometricAuth: "Biometric authentication",
    transactionLimit: "Transaction limit",
    addressBook: "Address book",
    savedAddresses: "Saved addresses",
    addAddress: "Add address",
    qrScanner: "QR Scanner",
    showQR: "Show QR Code",
    copyAddress: "Copy address",
    shareAddress: "Share address",
    confirmSend: "Confirm send",
    enterAmount: "Enter amount",
    enterRecipient: "Enter address",
    insufficientBalance: "Insufficient balance",
    transactionSuccess: "Transaction successful",
    transactionFailed: "Transaction failed",
    offline: "Offline",
    online: "Online",
    balance: "Balance",
    recentActivity: "Recent activity",
    noTransactions: "No transactions",
  },
  es: {
    wallet: "Billetera",
    send: "Enviar",
    history: "Historial",
    analytics: "Análisis",
    piWallet: "Billetera Pi Network",
    connected: "Conectado y seguro",
    refresh: "Actualizar",
    availableBalance: "Saldo disponible",
    lockedBalance: "Saldo bloqueado",
    pendingTransactions: "Transacciones pendientes",
    walletAddress: "Dirección de la billetera",
    copy: "Copiar",
    quickActions: "Acciones rápidas",
    sendPi: "Enviar π",
    receivePi: "Recibir π (Código QR)",
    requestPayment: "Solicitar pago",
    security: "Seguridad de la billetera",
    recentTransactions: "Transacciones recientes",
    viewAll: "Ver todo",
    totalEarned: "Total ganado",
    totalSpent: "Total gastado",
    netProfit: "Beneficio neto",
    recipientAddress: "Dirección del destinatario",
    amount: "Cantidad (π)",
    description: "Descripción (opcional)",
    warning: "Verifique la dirección del destinatario. Las transacciones Pi son irreversibles.",
    quickSend: "Envío rápido",
    transactionHistory: "Historial de transacciones",
    filter: "Filtrar",
    export: "Exportar",
    completed: "Completado",
    pending: "Pendiente",
    received: "Recibido",
    sent: "Enviado",
    monthlyEarnings: "Ganancias mensuales",
    topServices: "Servicios más rentables",
    financialSummary: "Resumen financiero",
    totalRevenue: "Ingresos totales",
    totalExpenses: "Gastos totales",
    roi: "ROI",
    transactions: "Transacciones",
    securityLevel: "Nivel de seguridad",
    twoFactorAuth: "Autenticación de dos factores",
    biometricAuth: "Autenticación biométrica",
    transactionLimit: "Límite de transacción",
    addressBook: "Libro de direcciones",
    savedAddresses: "Direcciones guardadas",
    addAddress: "Agregar dirección",
    qrScanner: "Escáner QR",
    showQR: "Mostrar código QR",
    copyAddress: "Copiar dirección",
    shareAddress: "Compartir dirección",
    confirmSend: "Confirmar envío",
    enterAmount: "Ingrese un monto",
    enterRecipient: "Ingrese una dirección",
    insufficientBalance: "Saldo insuficiente",
    transactionSuccess: "Transacción exitosa",
    transactionFailed: "Transacción fallida",
    offline: "Desconectado",
    online: "En línea",
    balance: "Saldo",
    recentActivity: "Actividad reciente",
    noTransactions: "Sin transacciones",
  },
  pt: {
    wallet: "Carteira",
    send: "Enviar",
    history: "Histórico",
    analytics: "Análises",
    piWallet: "Carteira Pi Network",
    connected: "Conectado e seguro",
    refresh: "Atualizar",
    availableBalance: "Saldo disponível",
    lockedBalance: "Saldo bloqueado",
    pendingTransactions: "Transações pendentes",
    walletAddress: "Endereço da carteira",
    copy: "Copiar",
    quickActions: "Ações rápidas",
    sendPi: "Enviar π",
    receivePi: "Receber π (Código QR)",
    requestPayment: "Solicitar pagamento",
    security: "Segurança da carteira",
    recentTransactions: "Transações recentes",
    viewAll: "Ver tudo",
    totalEarned: "Total ganho",
    totalSpent: "Total gasto",
    netProfit: "Lucro líquido",
    recipientAddress: "Endereço do destinatário",
    amount: "Valor (π)",
    description: "Descrição (opcional)",
    warning: "Verifique o endereço do destinatário. Transações Pi são irreversíveis.",
    quickSend: "Envio rápido",
    transactionHistory: "Histórico de transações",
    filter: "Filtrar",
    export: "Exportar",
    completed: "Concluído",
    pending: "Pendente",
    received: "Recebido",
    sent: "Enviado",
    monthlyEarnings: "Ganhos mensais",
    topServices: "Serviços mais rentáveis",
    financialSummary: "Resumo financeiro",
    totalRevenue: "Receita total",
    totalExpenses: "Despesas totais",
    roi: "ROI",
    transactions: "Transações",
    securityLevel: "Nível de segurança",
    twoFactorAuth: "Autenticação de dois fatores",
    biometricAuth: "Autenticação biométrica",
    transactionLimit: "Limite de transação",
    addressBook: "Catálogo de endereços",
    savedAddresses: "Endereços salvos",
    addAddress: "Adicionar endereço",
    qrScanner: "Leitor QR",
    showQR: "Mostrar código QR",
    copyAddress: "Copiar endereço",
    shareAddress: "Compartilhar endereço",
    confirmSend: "Confirmar envio",
    enterAmount: "Digite um valor",
    enterRecipient: "Digite um endereço",
    insufficientBalance: "Saldo insuficiente",
    transactionSuccess: "Transação bem-sucedida",
    transactionFailed: "Transação falhou",
    offline: "Offline",
    online: "Online",
    balance: "Saldo",
    recentActivity: "Atividade recente",
    noTransactions: "Sem transações",
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
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [language, setLanguage] = useState(currentLanguage)
  const [securityLevel, setSecurityLevel] = useState(85)
  const [filterType, setFilterType] = useState<"all" | "sent" | "received">("all")

  // Hooks personnalisés
  const isOnline = useOnlineStatus()
  const [savedAddresses, setSavedAddresses] = useLocalStorage<Array<{ name: string; address: string; avatar: string; lastUsed: string }>>("piSavedAddresses", [
    { name: "Dr. Moussa Koné", address: "GCKFBEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI7", avatar: "👨‍⚕️", lastUsed: "2024-02-01" },
    { name: "Marie Ouédraogo", address: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJK", avatar: "👩‍🌾", lastUsed: "2024-01-28" },
    { name: "Coopérative YELEN", address: "YELENCOOP1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", avatar: "🏢", lastUsed: "2024-01-25" },
  ])
  const [favoriteAddresses, setFavoriteAddresses] = useLocalStorage<string[]>("piFavoriteAddresses", [])
  const [walletBalance, setWalletBalance] = useLocalStorage<number>("piWalletBalance", 15.7834)
  const [transactionHistory, setTransactionHistory] = useLocalStorage<any[]>("piTransactionHistory", [
    { id: "tx001", type: "received", amount: 0.008, from: "Dr. Moussa Koné", to: "", description: "Consultation vétérinaire", date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: "completed", txHash: "abc123def456" },
    { id: "tx002", type: "sent", amount: 0.015, from: "", to: "Formation Aviculture", description: "Cours en ligne aviculture", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: "completed", txHash: "def456ghi789" },
    { id: "tx003", type: "received", amount: 0.012, from: "Ibrahim Sawadogo", to: "", description: "Service de conseil", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: "pending", txHash: "ghi789jkl012" },
    { id: "tx004", type: "sent", amount: 0.005, from: "", to: "Marché Local", description: "Achat d'aliments", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), status: "completed", txHash: "jkl012mno345" },
  ])

  const debouncedAmount = useDebounce(sendAmount, 300)

  const t = translations[language as keyof typeof translations] || translations.fr

  const walletData = {
    balance: walletBalance,
    lockedBalance: 2.1567,
    pendingTransactions: transactionHistory.filter(tx => tx.status === "pending").length,
    totalEarned: transactionHistory.filter(tx => tx.type === "received").reduce((sum, tx) => sum + tx.amount, 0),
    totalSpent: transactionHistory.filter(tx => tx.type === "sent").reduce((sum, tx) => sum + tx.amount, 0),
    address: "GCKFBEIYTKQTIQ7VIN54JHKOQ2QZSMH6APPQPLZX2BG4O6JJZWRBTPI7",
    securityScore: 92,
    twoFactorEnabled: true,
    biometricEnabled: true,
    dailyLimit: 50,
  }

  // Filtrer les transactions
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
    setToastMessage(message)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const handleSendPi = () => {
    if (!sendAmount || !recipientAddress) return
    if (!isOnline) {
      setToastMessage("⚠️ Connexion internet requise pour envoyer des Pi")
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      return
    }
    setShowConfirmModal(true)
  }

  const confirmSend = () => {
    const amount = parseFloat(sendAmount)
    if (amount > walletData.balance) {
      setToastMessage(t.insufficientBalance)
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      return
    }
    
    // Ajouter la transaction à l'historique
    const newTransaction = {
      id: `tx${Date.now()}`,
      type: "sent",
      amount: amount,
      from: "",
      to: recipientAddress,
      description: sendDescription || "Envoi Pi",
      date: new Date().toISOString(),
      status: "completed",
      txHash: Math.random().toString(36).substring(2, 15),
    }
    
    setTransactionHistory([newTransaction, ...transactionHistory])
    setWalletBalance(walletData.balance - amount)
    
    setShowConfirmModal(false)
    setToastMessage(t.transactionSuccess)
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
    setSendAmount("")
    setRecipientAddress("")
    setSendDescription("")
  }

  const handleAddToFavorites = (address: string) => {
    if (favoriteAddresses.includes(address)) {
      setFavoriteAddresses(favoriteAddresses.filter(a => a !== address))
    } else {
      setFavoriteAddresses([...favoriteAddresses, address])
    }
  }

  const getSecurityLevelColor = () => {
    if (securityLevel >= 80) return "text-green-600"
    if (securityLevel >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {showSuccessToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className={`rounded-lg p-3 flex items-center justify-between shadow-lg ${toastMessage.includes("réussie") || toastMessage.includes("successful") ? "bg-green-600" : toastMessage.includes("insuffisant") ? "bg-red-600" : "bg-blue-600"} text-white`}>
            <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /><span>{toastMessage}</span></div>
            <button onClick={() => setShowSuccessToast(false)}><X className="h-5 w-5" /></button>
          </div>
        </div>
      )}

      {/* Wallet Overview */}
      <Card className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
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
                </div>
                <p className="text-purple-200 text-sm">{t.connected}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0" onClick={() => setShowQRModal(true)}>
                <QrCode className="h-4 w-4 mr-2" />{t.receivePi}
              </Button>
              <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <RefreshCw className="h-4 w-4 mr-2" />{t.refresh}
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
              <p className="text-3xl font-bold mt-1">{showBalance ? `${walletData.balance.toFixed(4)} π` : "•••• π"}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-purple-200 text-sm">{t.lockedBalance}</span>
              <p className="text-2xl font-bold mt-1">{walletData.lockedBalance.toFixed(4)} π</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <span className="text-purple-200 text-sm">{t.pendingTransactions}</span>
              <p className="text-2xl font-bold mt-1">{walletData.pendingTransactions}</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm text-purple-200">{t.walletAddress}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 text-xs" onClick={() => copyToClipboard(walletData.address, t.copyAddress)}>
                  <Copy className="h-3 w-3 mr-1" />{t.copy}
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 text-xs" onClick={() => setShowQRModal(true)}>
                  <ExternalLink className="h-3 w-3 mr-1" />{t.showQR}
                </Button>
              </div>
            </div>
            <p className="text-xs font-mono mt-1 break-all opacity-80">{walletData.address.substring(0, 20)}...{walletData.address.substring(walletData.address.length - 10)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="wallet" className="gap-2"><Wallet className="h-4 w-4" /><span className="hidden sm:inline">{t.wallet}</span></TabsTrigger>
          <TabsTrigger value="send" className="gap-2"><Send className="h-4 w-4" /><span className="hidden sm:inline">{t.send}</span></TabsTrigger>
          <TabsTrigger value="history" className="gap-2"><History className="h-4 w-4" /><span className="hidden sm:inline">{t.history}</span></TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2"><TrendingUp className="h-4 w-4" /><span className="hidden sm:inline">{t.analytics}</span></TabsTrigger>
        </TabsList>

        {/* Onglet Portefeuille */}
        <TabsContent value="wallet" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-purple-600" />{t.quickActions}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setActiveTab("send")} disabled={!isOnline}><Send className="h-4 w-4 mr-2" />{t.sendPi}</Button>
                <Button variant="outline" className="w-full" onClick={() => setShowQRModal(true)}><QrCode className="h-4 w-4 mr-2" />{t.receivePi}</Button>
                <Button variant="outline" className="w-full"><Plus className="h-4 w-4 mr-2" />{t.requestPayment}</Button>
                <Button variant="outline" className="w-full"><Shield className="h-4 w-4 mr-2" />{t.security}</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-green-600" />{t.securityLevel}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><span>Score de sécurité</span><span className={`font-bold ${getSecurityLevelColor()}`}>{walletData.securityScore}%</span></div>
                <div className="h-2 bg-gray-200 rounded-full"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${walletData.securityScore}%` }}></div></div>
                <div className="flex items-center justify-between"><span className="text-sm">{t.twoFactorAuth}</span><Badge className="bg-green-100 text-green-700">Activé</Badge></div>
                <div className="flex items-center justify-between"><span className="text-sm">{t.biometricAuth}</span><Badge className="bg-green-100 text-green-700">Activé</Badge></div>
                <div className="flex items-center justify-between"><span className="text-sm">{t.transactionLimit}</span><span className="font-medium">{walletData.dailyLimit} π/jour</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" />{t.addressBook}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {savedAddresses.slice(0, 3).map((contact, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group" onClick={() => { setRecipientAddress(contact.address); setActiveTab("send"); }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{contact.avatar}</span>
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-gray-400">{contact.address.substring(0, 10)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={(e) => { e.stopPropagation(); handleAddToFavorites(contact.address); }}>
                        <Star className={`h-3 w-3 ${favoriteAddresses.includes(contact.address) ? "text-yellow-500 fill-current" : "text-gray-400"}`} />
                      </Button>
                      <Send className="h-3 w-3 text-gray-400" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2 gap-1"><Plus className="h-3 w-3" />{t.addAddress}</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{walletData.totalEarned.toFixed(4)} π</div><div className="text-sm text-gray-500">{t.totalEarned}</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{walletData.totalSpent.toFixed(4)} π</div><div className="text-sm text-gray-500">{t.totalSpent}</div></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-blue-600">{(walletData.totalEarned - walletData.totalSpent).toFixed(4)} π</div><div className="text-sm text-gray-500">{t.netProfit}</div></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center justify-between"><span className="flex items-center gap-2"><History className="h-5 w-5" />{t.recentTransactions}</span><Button variant="ghost" size="sm" onClick={() => setActiveTab("history")}>{t.viewAll} →</Button></CardTitle></CardHeader>
            <CardContent><div className="space-y-3">{filteredTransactions.slice(0, 3).map((tx) => (<TransactionItem key={tx.id} tx={tx} formatDate={formatDate} t={t} />))}</div></CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Envoyer */}
        <TabsContent value="send" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-purple-600" />{t.sendPi}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-sm font-medium block mb-1">{t.recipientAddress}</label><Input placeholder="Adresse Pi ou nom d'utilisateur" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} /></div>
                <div><label className="text-sm font-medium block mb-1">{t.amount}</label><div className="relative"><Input type="number" placeholder="0.000" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} step="0.001" min="0" className="pr-16" /><div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1"><span className="text-sm text-gray-400">π</span><Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setSendAmount(walletData.balance.toString())}>Max</Button></div></div><p className="text-xs text-gray-500 mt-1">{t.availableBalance}: {walletData.balance.toFixed(4)} π</p></div>
                <div><label className="text-sm font-medium block mb-1">{t.description}</label><Input placeholder="Optionnel" value={sendDescription} onChange={(e) => setSendDescription(e.target.value)} /></div>
                <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" /><p className="text-sm text-yellow-800">{t.warning}</p></div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleSendPi} disabled={!sendAmount || !recipientAddress || !isOnline}>{t.sendPi} {sendAmount && `(${sendAmount} π)`}</Button>
                {!isOnline && <p className="text-xs text-red-500 text-center">⚠️ Connexion internet requise</p>}
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" />{t.quickSend}</CardTitle></CardHeader><CardContent><div className="space-y-3">{savedAddresses.map((contact, i) => (<div key={i} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => { setRecipientAddress(contact.address); setSendAmount(""); }}><span className="text-2xl">{contact.avatar}</span><div className="flex-1"><p className="font-medium text-sm">{contact.name}</p><p className="text-xs text-gray-400">{contact.address.substring(0, 15)}...</p></div>{favoriteAddresses.includes(contact.address) && <Star className="h-3 w-3 text-yellow-500 fill-current" />}<Send className="h-4 w-4 text-gray-400" /></div>))}</div></CardContent></Card>
          </div>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-2"><History className="h-5 w-5" />{t.transactionHistory}</span>
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <Button size="sm" variant={filterType === "all" ? "default" : "outline"} onClick={() => setFilterType("all")} className={filterType === "all" ? "bg-purple-600" : ""}>Tous</Button>
                    <Button size="sm" variant={filterType === "received" ? "default" : "outline"} onClick={() => setFilterType("received")} className={filterType === "received" ? "bg-green-600" : ""}>Reçus</Button>
                    <Button size="sm" variant={filterType === "sent" ? "default" : "outline"} onClick={() => setFilterType("sent")} className={filterType === "sent" ? "bg-red-600" : ""}>Envoyés</Button>
                  </div>
                  <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" />{t.export}</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t.noTransactions}</p>
                </div>
              ) : (
                <div className="space-y-3">{filteredTransactions.map((tx) => (<TransactionItem key={tx.id} tx={tx} formatDate={formatDate} t={t} />))}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyses */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-600" />{t.monthlyEarnings}</CardTitle></CardHeader><CardContent><div className="space-y-3">{analytics.monthlyEarnings.map((month, i) => (<div key={i} className="flex items-center gap-3"><span className="text-sm w-10 font-medium">{month.month}</span><div className="flex-1 h-2 bg-gray-200 rounded-full"><div className="h-2 bg-purple-600 rounded-full" style={{ width: `${(month.amount / 25) * 100}%` }}></div></div><span className="text-sm font-medium">{month.amount} π</span></div>))}</div></CardContent></Card>

            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500" />{t.topServices}</CardTitle></CardHeader><CardContent><div className="space-y-3">{analytics.topServices.map((service, i) => (<div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center gap-2"><span className="text-xl">{service.icon}</span><div><p className="font-medium text-sm">{service.service}</p><p className="text-xs text-gray-500">{service.transactions} transactions</p></div></div><p className="font-bold text-purple-600">{service.earnings} π</p></div>))}</div></CardContent></Card>
          </div>

          <Card><CardHeader><CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5 text-blue-600" />{t.financialSummary}</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="text-center p-4 bg-green-50 rounded-lg"><div className="text-2xl font-bold text-green-600">+{walletData.totalEarned.toFixed(2)}π</div><div className="text-sm text-green-700">{t.totalRevenue}</div></div><div className="text-center p-4 bg-red-50 rounded-lg"><div className="text-2xl font-bold text-red-600">-{walletData.totalSpent.toFixed(2)}π</div><div className="text-sm text-red-700">{t.totalExpenses}</div></div><div className="text-center p-4 bg-blue-50 rounded-lg"><div className="text-2xl font-bold text-blue-600">{((walletData.totalEarned / walletData.totalSpent - 1) * 100).toFixed(1)}%</div><div className="text-sm text-blue-700">{t.roi}</div></div><div className="text-center p-4 bg-purple-50 rounded-lg"><div className="text-2xl font-bold text-purple-600">{transactionHistory.length}</div><div className="text-sm text-purple-700">{t.transactions}</div></div></div></CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Modal de confirmation */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><AlertCircle className="h-5 w-5 text-yellow-500" />{t.confirmSend}</h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-500">✕</button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-gray-600">Destinataire:</span><span className="font-mono text-xs">{recipientAddress.substring(0, 20)}...</span></div>
              <div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-gray-600">Montant:</span><span className="font-bold text-purple-600">{sendAmount} π</span></div>
              {sendDescription && (<div className="flex justify-between p-2 bg-gray-50 rounded"><span className="text-gray-600">Description:</span><span>{sendDescription}</span></div>)}
            </div>
            <div className="flex gap-3"><Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={confirmSend} disabled={!isOnline}>Confirmer</Button><Button variant="outline" className="flex-1" onClick={() => setShowConfirmModal(false)}>Annuler</Button></div>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {showQRModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">{t.receivePi}</h3><button onClick={() => setShowQRModal(false)}><X className="h-5 w-5" /></button></div><div className="text-center"><div className="w-48 h-48 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto"><div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center"><PiIcon className="h-16 w-16 text-purple-600" /></div></div><p className="font-mono text-xs break-all mt-4 p-2 bg-gray-100 rounded-lg">{walletData.address}</p><div className="flex gap-2 mt-4"><Button variant="outline" className="flex-1" onClick={() => copyToClipboard(walletData.address, t.copyAddress)}><Copy className="h-4 w-4 mr-2" />{t.copy}</Button><Button variant="outline" className="flex-1"><Share2 className="h-4 w-4 mr-2" />{t.share}</Button></div></div></div></div>)}
    </div>
  )
}

// Composant PiIcon
const PiIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20M4 4l16 16M4 20L20 4" />
  </svg>
)

// Composant TransactionItem
const TransactionItem = ({ tx, formatDate, t }: { tx: any, formatDate: (date: string) => string, t: any }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "received" ? "bg-green-100" : "bg-red-100"}`}>
        {tx.type === "received" ? <ArrowDownLeft className="h-5 w-5 text-green-600" /> : <ArrowUpRight className="h-5 w-5 text-red-600" />}
      </div>
      <div>
        <p className="font-medium text-sm">{tx.type === "received" ? `+ ${tx.from}` : `- ${tx.to}`}</p>
        <p className="text-xs text-gray-500">{tx.description}</p>
        <p className="text-xs text-gray-400">{formatDate(tx.date)}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`font-bold ${tx.type === "received" ? "text-green-600" : "text-red-600"}`}>{tx.type === "received" ? "+" : "-"}{tx.amount} π</p>
      <Badge variant={tx.status === "completed" ? "default" : "secondary"} className={tx.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>{tx.status === "completed" ? t.completed : t.pending}</Badge>
    </div>
  </div>
)