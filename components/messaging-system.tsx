"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  UserPlus,
  Star,
  Circle,
  CheckCircle2,
  MapPin,
  Users,
  Bell,
  Settings,
  Filter,
  ImageIcon,
  File,
  Mic,
  Pi,
  Wallet,
  Check,
  Clock,
  Reply,
  Copy,
  Trash2,
  Pin,
  Archive,
  Flag,
  Volume2,
  VolumeX,
  Download,
  Share2,
  ExternalLink,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { showToast } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  read: boolean
  delivered: boolean
  type: "text" | "image" | "file" | "audio" | "payment"
  fileUrl?: string
  fileName?: string
  fileSize?: string
  amount?: number
  paymentStatus?: "pending" | "completed" | "failed"
  replyTo?: Message
}

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar: string
    online: boolean
    lastSeen?: string
    location?: string
    profession?: string
    rating?: number
    verified?: boolean
  }[]
  lastMessage: Message
  unreadCount: number
  pinned: boolean
  archived: boolean
  isGroup?: boolean
  groupName?: string
  groupAvatar?: string
  groupMembers?: number
}

interface MessagingSystemProps {
  currentLanguage: string
  userRegion: string
}

// Traductions multilingues
const translations: Record<string, any> = {
  fr: {
    messages: "Messages",
    discover: "Découvrir",
    settings: "Paramètres",
    searchPlaceholder: "Rechercher une conversation...",
    noConversations: "Aucune conversation",
    noMessages: "Aucun message",
    typeMessage: "Écrivez votre message...",
    typeFirstMessage: "Envoyez votre premier message",
    selectConversation: "Sélectionnez une conversation",
    selectConversationDesc: "Choisissez un contact pour commencer à discuter",
    discoverUsers: "Découvrir des utilisateurs",
    online: "En ligne",
    offline: "Hors ligne",
    yesterday: "Hier",
    copied: "Copié dans le presse-papiers",
    paymentRequest: "Demande de paiement",
    amount: "Montant",
    payWithPi: "Payer avec Pi",
    cancel: "Annuler",
    send: "Envoyer",
    loading: "Chargement...",
    messageDeleted: "Message supprimé",
    conversationPinned: "Conversation épinglée",
    conversationUnpinned: "Conversation désépinglée",
    conversationArchived: "Conversation archivée",
    conversationUnarchived: "Conversation désarchivée",
    paymentSent: "Paiement envoyé",
    paymentError: "Erreur de paiement",
    typing: "est en train d'écrire...",
    today: "Aujourd'hui",
    thisWeek: "Cette semaine",
    thisMonth: "Ce mois-ci",
    older: "Plus ancien",
  },
  en: {
    messages: "Messages",
    discover: "Discover",
    settings: "Settings",
    searchPlaceholder: "Search conversations...",
    noConversations: "No conversations",
    noMessages: "No messages",
    typeMessage: "Type your message...",
    typeFirstMessage: "Send your first message",
    selectConversation: "Select a conversation",
    selectConversationDesc: "Choose a contact to start chatting",
    discoverUsers: "Discover users",
    online: "Online",
    offline: "Offline",
    yesterday: "Yesterday",
    copied: "Copied to clipboard",
    paymentRequest: "Payment request",
    amount: "Amount",
    payWithPi: "Pay with Pi",
    cancel: "Cancel",
    send: "Send",
    loading: "Loading...",
    messageDeleted: "Message deleted",
    conversationPinned: "Conversation pinned",
    conversationUnpinned: "Conversation unpinned",
    conversationArchived: "Conversation archived",
    conversationUnarchived: "Conversation unarchived",
    paymentSent: "Payment sent",
    paymentError: "Payment error",
    typing: "is typing...",
    today: "Today",
    thisWeek: "This week",
    thisMonth: "This month",
    older: "Older",
  },
  es: {
    messages: "Mensajes",
    discover: "Descubrir",
    settings: "Ajustes",
    searchPlaceholder: "Buscar conversaciones...",
    noConversations: "Sin conversaciones",
    noMessages: "Sin mensajes",
    typeMessage: "Escribe tu mensaje...",
    typeFirstMessage: "Envía tu primer mensaje",
    selectConversation: "Selecciona una conversación",
    selectConversationDesc: "Elige un contacto para empezar a chatear",
    discoverUsers: "Descubrir usuarios",
    online: "En línea",
    offline: "Desconectado",
    yesterday: "Ayer",
    copied: "Copiado al portapapeles",
    paymentRequest: "Solicitud de pago",
    amount: "Cantidad",
    payWithPi: "Pagar con Pi",
    cancel: "Cancelar",
    send: "Enviar",
    loading: "Cargando...",
    messageDeleted: "Mensaje eliminado",
    conversationPinned: "Conversación fijada",
    conversationUnpinned: "Conversación desfijada",
    conversationArchived: "Conversación archivada",
    conversationUnarchived: "Conversación desarchivada",
    paymentSent: "Pago enviado",
    paymentError: "Error de pago",
    typing: "está escribiendo...",
    today: "Hoy",
    thisWeek: "Esta semana",
    thisMonth: "Este mes",
    older: "Más antiguo",
  },
  pt: {
    messages: "Mensagens",
    discover: "Descobrir",
    settings: "Configurações",
    searchPlaceholder: "Pesquisar conversas...",
    noConversations: "Sem conversas",
    noMessages: "Sem mensagens",
    typeMessage: "Digite sua mensagem...",
    typeFirstMessage: "Envie sua primeira mensagem",
    selectConversation: "Selecione uma conversa",
    selectConversationDesc: "Escolha um contato para começar a conversar",
    discoverUsers: "Descobrir usuários",
    online: "Online",
    offline: "Offline",
    yesterday: "Ontem",
    copied: "Copiado para área de transferência",
    paymentRequest: "Solicitação de pagamento",
    amount: "Valor",
    payWithPi: "Pagar com Pi",
    cancel: "Cancelar",
    send: "Enviar",
    loading: "Carregando...",
    messageDeleted: "Mensagem excluída",
    conversationPinned: "Conversa fixada",
    conversationUnpinned: "Conversa desafixada",
    conversationArchived: "Conversa arquivada",
    conversationUnarchived: "Conversa desarquivada",
    paymentSent: "Pagamento enviado",
    paymentError: "Erro no pagamento",
    typing: "está digitando...",
    today: "Hoje",
    thisWeek: "Esta semana",
    thisMonth: "Este mês",
    older: "Mais antigo",
  },
}

export default function MessagingSystem({ currentLanguage, userRegion }: MessagingSystemProps) {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("messages")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null)
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null)
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [language, setLanguage] = useState(currentLanguage)
  const [isTyping, setIsTyping] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Hooks personnalisés
  const debouncedSearch = useDebounce(searchQuery, 300)
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData } = usePiAuth()
  const [pinnedConversations, setPinnedConversations] = useLocalStorage<string[]>("pinnedConversations", [])
  const [archivedConversations, setArchivedConversations] = useLocalStorage<string[]>("archivedConversations", [])
  const [draftMessages, setDraftMessages] = useLocalStorage<Record<string, string>>("draftMessages", {})
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      participants: [{
        id: "user1",
        name: "Dr. Aminata Traoré",
        avatar: "👩‍⚕️",
        online: true,
        location: "Ouagadougou",
        profession: "Vétérinaire",
        rating: 4.9,
        verified: true,
      }],
      lastMessage: {
        id: "msg1",
        senderId: "user1",
        senderName: "Dr. Aminata Traoré",
        content: "Bonjour, comment puis-je vous aider avec votre élevage ?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        delivered: true,
        type: "text",
      },
      unreadCount: 2,
      pinned: false,
      archived: false,
    },
    {
      id: "2",
      participants: [{
        id: "user2",
        name: "Coopérative YELEN",
        avatar: "🏢",
        online: false,
        lastSeen: new Date(Date.now() - 1800000).toISOString(),
        location: "Bobo-Dioulasso",
        profession: "Coopérative agricole",
        rating: 4.7,
        verified: true,
      }],
      lastMessage: {
        id: "msg2",
        senderId: "current",
        senderName: "Vous",
        content: "Quels sont vos prix pour les aliments ?",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
      unreadCount: 0,
      pinned: true,
      archived: false,
      isGroup: true,
      groupName: "Coopérative YELEN",
      groupMembers: 12,
    },
    {
      id: "3",
      participants: [{
        id: "user3",
        name: "Ibrahim Sawadogo",
        avatar: "👨‍🌾",
        online: true,
        location: "Koudougou",
        profession: "Agriculteur",
        rating: 4.6,
        verified: false,
      }],
      lastMessage: {
        id: "msg3",
        senderId: "user3",
        senderName: "Ibrahim Sawadogo",
        content: "Merci pour les semences, très bonne qualité !",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
      unreadCount: 0,
      pinned: false,
      archived: false,
    },
  ])
  const [messages, setMessages] = useState<Message[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageActionsRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const t = translations[language as keyof typeof translations] || translations.fr

  useClickOutside(messageActionsRef, () => setShowMessageActions(null))

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768 && activeConversation) {
        setShowSidebar(false)
      } else if (window.innerWidth >= 768) {
        setShowSidebar(true)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [activeConversation])

  // Charger les messages d'une conversation
  const loadMessages = useCallback((conversationId: string) => {
    setIsLoadingMessages(true)
    // Simuler des messages
    const demoMessages: Message[] = [
      {
        id: "m1",
        senderId: "user1",
        senderName: "Dr. Aminata Traoré",
        content: "Bonjour ! Comment puis-je vous aider ?",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
      {
        id: "m2",
        senderId: "current",
        senderName: "Vous",
        content: "J'ai besoin de conseils pour la vaccination de mes poules.",
        timestamp: new Date(Date.now() - 82800000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
      {
        id: "m3",
        senderId: "user1",
        senderName: "Dr. Aminata Traoré",
        content: "Je vous conseille de vacciner contre Newcastle à 4 semaines.",
        timestamp: new Date(Date.now() - 72000000).toISOString(),
        read: true,
        delivered: true,
        type: "text",
      },
      {
        id: "m4",
        senderId: "user1",
        senderName: "Dr. Aminata Traoré",
        content: "Voici une facture pour la consultation à domicile :",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        delivered: true,
        type: "payment",
        amount: 0.008,
        paymentStatus: "pending",
      },
    ]
    setMessages(demoMessages)
    setTimeout(() => setIsLoadingMessages(false), 500)
  }, [])

  // Envoyer un message
  const sendMessage = useCallback(async (content: string, type: string = "text", replyTo?: Message) => {
    if (!activeConversation || !content.trim()) return
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }

    setIsSending(true)
    try {
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: "current",
        senderName: userData?.username || "Vous",
        content,
        timestamp: new Date().toISOString(),
        read: true,
        delivered: isOnline,
        type: type as any,
        amount: type === "payment" ? parseFloat(content) : undefined,
        replyTo,
      }
      
      setMessages(prev => [...prev, newMsg])
      setNewMessage("")
      setReplyToMessage(null)
      
      // Mettre à jour la dernière conversation
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversation 
          ? { ...conv, lastMessage: newMsg, unreadCount: 0 }
          : conv
      ))
    } catch (error) {
      console.error("Erreur envoi message:", error)
      showToast("Erreur lors de l'envoi", "error")
    } finally {
      setIsSending(false)
    }
  }, [activeConversation, isOnline, userData])

  // Envoyer un paiement Pi
  const handleSendPayment = useCallback(async () => {
    if (!paymentAmount) return
    
    setIsSending(true)
    try {
      const amount = parseFloat(paymentAmount)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const paymentMsg = `💰 Paiement de ${amount} π`
      await sendMessage(paymentMsg, "payment")
      
      setShowPaymentModal(false)
      setPaymentAmount("")
      setSelectedUser(null)
      showToast("Paiement envoyé avec succès", "success")
    } catch (error) {
      console.error("Erreur paiement:", error)
      showToast("Erreur lors du paiement", "error")
    } finally {
      setIsSending(false)
    }
  }, [paymentAmount, sendMessage])

  // Polling pour les nouveaux messages
  useEffect(() => {
    if (activeConversation && isOnline) {
      loadMessages(activeConversation)
      
      pollingIntervalRef.current = setInterval(() => {
        loadMessages(activeConversation)
      }, 5000)
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
        }
      }
    }
  }, [activeConversation, isOnline, loadMessages])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Sauvegarder le brouillon
  useEffect(() => {
    if (activeConversation) {
      if (newMessage.trim()) {
        setDraftMessages({ ...draftMessages, [activeConversation]: newMessage })
      } else {
        const { [activeConversation]: _, ...rest } = draftMessages
        setDraftMessages(rest)
      }
    }
  }, [newMessage, activeConversation, draftMessages, setDraftMessages])

  // Charger le brouillon
  useEffect(() => {
    if (activeConversation && draftMessages[activeConversation]) {
      setNewMessage(draftMessages[activeConversation])
    } else if (activeConversation && !draftMessages[activeConversation]) {
      setNewMessage("")
    }
  }, [activeConversation, draftMessages])

  // Indicateur de frappe
  useEffect(() => {
    if (newMessage.trim() && !isTyping) {
      setIsTyping(true)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [newMessage, isTyping])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return t.yesterday
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    }
    return date.toLocaleDateString()
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    sendMessage(newMessage, "text", replyToMessage || undefined)
  }

  const handlePinConversation = (convId: string) => {
    if (pinnedConversations.includes(convId)) {
      setPinnedConversations(pinnedConversations.filter(id => id !== convId))
      showToast(t.conversationUnpinned, "info")
    } else {
      setPinnedConversations([...pinnedConversations, convId])
      showToast(t.conversationPinned, "success")
    }
  }

  const handleArchiveConversation = (convId: string) => {
    if (archivedConversations.includes(convId)) {
      setArchivedConversations(archivedConversations.filter(id => id !== convId))
      showToast(t.conversationUnarchived, "info")
    } else {
      setArchivedConversations([...archivedConversations, convId])
      showToast(t.conversationArchived, "success")
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    setShowMessageActions(null)
    showToast(t.copied, "success")
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
    setShowMessageActions(null)
    showToast(t.messageDeleted, "info")
  }

  const handleSelectConversation = (convId: string) => {
    setActiveConversation(convId)
    if (isMobile) {
      setShowSidebar(false)
    }
    // Marquer comme lu
    setConversations(prev => prev.map(conv =>
      conv.id === convId ? { ...conv, unreadCount: 0 } : conv
    ))
  }

  const handleBackToList = () => {
    setShowSidebar(true)
    setActiveConversation(null)
  }

  // Filtrer et trier les conversations
  const filteredConversations = conversations.filter(conv => {
    if (conv.archived && activeTab !== "archived") return false
    if (!conv.archived && activeTab === "archived") return false
    
    const name = conv.isGroup ? conv.groupName : conv.participants[0]?.name
    return name?.toLowerCase().includes(debouncedSearch.toLowerCase())
  })

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  })

  const activeConvData = conversations.find(c => c.id === activeConversation)

  return (
    <div className="h-[700px] flex bg-white rounded-xl border shadow-lg overflow-hidden relative">
      {/* Sidebar */}
      {(showSidebar || !isMobile) && (
        <div className={`${isMobile ? 'absolute inset-0 z-10 bg-white' : 'w-80'} border-r flex flex-col transition-all duration-300`}>
          {/* Header Sidebar */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              {t.messages}
            </h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2 grid grid-cols-2">
              <TabsTrigger value="messages" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="archived" className="gap-1">
                <Archive className="h-3 w-3" />
                Archivés
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="flex-1 overflow-y-auto mt-0">
              {sortedConversations.filter(c => !c.archived).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{t.noConversations}</p>
                </div>
              ) : (
                sortedConversations.filter(c => !c.archived).map((conv) => {
                  const participant = conv.participants[0]
                  const name = conv.isGroup ? conv.groupName : participant?.name
                  const avatar = conv.isGroup ? conv.groupAvatar : participant?.avatar
                  const isOnline_status = !conv.isGroup && participant?.online
                  
                  return (
                    <div
                      key={conv.id}
                      className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-all ${
                        activeConversation === conv.id ? "bg-green-50 border-r-2 border-green-500" : ""
                      }`}
                      onClick={() => handleSelectConversation(conv.id)}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                          {avatar || "👤"}
                        </div>
                        {isOnline_status && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{name}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {formatTime(conv.lastMessage.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-sm text-gray-500 truncate flex-1">
                            {conv.lastMessage.senderId === "current" && "Vous: "}
                            {conv.lastMessage.type === "payment" ? "💰 Paiement" : conv.lastMessage.content}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-green-500 text-white ml-2 flex-shrink-0">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (conv.pinned) handlePinConversation(conv.id)
                          else handleArchiveConversation(conv.id)
                        }}
                      >
                        {conv.pinned ? <Pin className="h-3 w-3" /> : <Archive className="h-3 w-3" />}
                      </Button>
                    </div>
                  )
                })
              )}
            </TabsContent>

            <TabsContent value="archived" className="flex-1 overflow-y-auto mt-0">
              {sortedConversations.filter(c => c.archived).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Archive className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Aucune conversation archivée</p>
                </div>
              ) : (
                sortedConversations.filter(c => c.archived).map((conv) => {
                  const participant = conv.participants[0]
                  const name = conv.isGroup ? conv.groupName : participant?.name
                  const avatar = conv.isGroup ? conv.groupAvatar : participant?.avatar
                  
                  return (
                    <div
                      key={conv.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-all opacity-70"
                      onClick={() => handleSelectConversation(conv.id)}
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                        {avatar || "👤"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleArchiveConversation(conv.id)
                        }}
                      >
                        <Archive className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleBackToList}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    {activeConvData?.isGroup ? activeConvData.groupAvatar?.[0] || "👥" : activeConvData?.participants[0]?.avatar || "👤"}
                  </div>
                  {!activeConvData?.isGroup && activeConvData?.participants[0]?.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {activeConvData?.isGroup ? activeConvData.groupName : activeConvData?.participants[0]?.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {activeConvData?.isGroup ? (
                      <span>{activeConvData.groupMembers} membres</span>
                    ) : (
                      <>
                        {activeConvData?.participants[0]?.online ? (
                          <span className="text-green-600">{t.online}</span>
                        ) : (
                          <span>{t.offline}</span>
                        )}
                        {activeConvData?.participants[0]?.location && (
                          <>
                            <span>•</span>
                            <span>{activeConvData.participants[0].location}</span>
                          </>
                        )}
                      </>
                    )}
                    {activeConvData?.participants[0]?.rating && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {activeConvData.participants[0].rating}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {isLoadingMessages && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{t.noMessages}</p>
                  <p className="text-xs">{t.typeFirstMessage}</p>
                </div>
              ) : (
                messages.map((message, idx) => {
                  const isCurrentUser = message.senderId === "current"
                  const showAvatar = !isCurrentUser && (idx === 0 || messages[idx-1]?.senderId !== message.senderId)
                  
                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} group`}>
                      <div className="flex items-end gap-2 max-w-[70%]">
                        {!isCurrentUser && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm flex-shrink-0">
                            {activeConvData?.participants[0]?.avatar || "👤"}
                          </div>
                        )}
                        {!isCurrentUser && !showAvatar && <div className="w-8 flex-shrink-0" />}
                        
                        <div className="relative">
                          <div className={`px-4 py-2 rounded-2xl ${
                            isCurrentUser 
                              ? "bg-green-600 text-white" 
                              : "bg-white text-gray-900 shadow-sm"
                          }`}>
                            {message.replyTo && (
                              <div className={`text-xs p-2 rounded mb-1 ${
                                isCurrentUser ? "bg-green-700" : "bg-gray-100"
                              }`}>
                                <p className="font-medium">↳ {message.replyTo.senderName}</p>
                                <p className="truncate">{message.replyTo.content.substring(0, 60)}</p>
                              </div>
                            )}
                            {message.type === "text" && <p className="text-sm">{message.content}</p>}
                            {message.type === "payment" && (
                              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                                isCurrentUser ? "bg-green-700" : "bg-gray-50 border"
                              }`}>
                                <Pi className="h-5 w-5 text-purple-500" />
                                <div>
                                  <p className="text-sm font-medium">{message.amount} π</p>
                                  <p className="text-xs opacity-75">Paiement</p>
                                </div>
                                {message.paymentStatus === "pending" && (
                                  <Badge className="bg-yellow-500 text-white text-xs ml-2">En attente</Badge>
                                )}
                              </div>
                            )}
                            <div className="flex items-center justify-end gap-2 mt-1">
                              <span className={`text-xs ${isCurrentUser ? "text-green-200" : "text-gray-400"}`}>
                                {formatTime(message.timestamp)}
                              </span>
                              {isCurrentUser && (
                                message.delivered ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-200" />
                                ) : (
                                  <Clock className="h-3 w-3 text-green-200" />
                                )
                              )}
                            </div>
                          </div>
                          
                          {/* Menu d'actions */}
                          <div className={`absolute top-0 ${isCurrentUser ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 bg-white shadow-sm rounded-full"
                              onClick={() => setReplyToMessage(message)}
                            >
                              <Reply className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 bg-white shadow-sm rounded-full"
                              onClick={() => handleCopyMessage(message.content)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            {isCurrentUser && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0 bg-white shadow-sm rounded-full text-red-500"
                                onClick={() => handleDeleteMessage(message.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              
              {replyToMessage && (
                <div className="sticky bottom-0 bg-gray-100 rounded-lg p-2 mb-2 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Réponse à {replyToMessage.senderName}</p>
                    <p className="text-sm truncate">{replyToMessage.content}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setReplyToMessage(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className={`h-8 w-8 p-0 rounded-full ${isRecording ? "text-red-500" : ""}`}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? <VolumeX className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder={t.typeMessage}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="pr-24 rounded-full"
                    disabled={!isOnline}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 text-xs rounded-full"
                    onClick={() => setShowPaymentModal(true)}
                    disabled={!isOnline}
                  >
                    <Pi className="h-3 w-3 mr-1" />π
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isOnline || isSending}
                  className="bg-green-600 hover:bg-green-700 rounded-full h-8 w-8 p-0"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              {!isOnline && (
                <p className="text-xs text-red-500 mt-2 text-center">⚠️ Vous êtes hors ligne. Les messages seront envoyés lorsque la connexion sera rétablie.</p>
              )}
              <input type="file" ref={fileInputRef} className="hidden" multiple />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">{t.selectConversation}</p>
              <p className="text-sm text-gray-400">{t.selectConversationDesc}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de paiement Pi */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                {t.paymentRequest}
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Envoyer à: <span className="font-medium">{activeConvData?.participants[0]?.name}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t.amount} (π)</label>
              <Input 
                type="number" 
                step="0.001" 
                placeholder="0.008" 
                value={paymentAmount} 
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum: 0.001 π</p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
                onClick={handleSendPayment}
                disabled={!paymentAmount || isSending}
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pi className="h-4 w-4" />}
                {t.payWithPi}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                {t.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}