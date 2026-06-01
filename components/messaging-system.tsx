"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useOnlineStatus } from "@/hooks/use-online-status"

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

// Traductions (identiques à l'original)
const translations = {
  fr: {
    messages: "Messages",
    discover: "Découvrir",
    groups: "Groupes",
    search: "Rechercher des conversations...",
    online: "En ligne",
    seen: "Vu",
    typeMessage: "Tapez votre message...",
    selectConversation: "Sélectionnez une conversation",
    selectConversationDesc: "Choisissez une conversation pour commencer à discuter",
    discoverUsers: "Découvrir des utilisateurs",
    suggestedUsers: "Utilisateurs suggérés",
    filter: "Filtrer",
    mutualConnections: "connexions communes",
    message: "Message",
    availableGroups: "Groupes disponibles",
    create: "Créer",
    members: "membres",
    join: "Rejoindre",
    paymentRequest: "Demande de paiement",
    payWithPi: "Payer avec Pi",
    amount: "Montant",
    send: "Envoyer",
    copied: "Copié !",
    delete: "Supprimer",
    reply: "Répondre",
    pin: "Épingler",
    archive: "Archiver",
    report: "Signaler",
    download: "Télécharger",
    share: "Partager",
    delivered: "Délivré",
    read: "Lu",
    pending: "En attente",
    completed: "Complété",
    failed: "Échoué",
    noMessages: "Aucun message",
    typeFirstMessage: "Soyez le premier à envoyer un message",
    onlineNow: "En ligne maintenant",
    activeNow: "Actif maintenant",
    yesterday: "Hier",
  },
  en: {
    messages: "Messages",
    discover: "Discover",
    groups: "Groups",
    search: "Search conversations...",
    online: "Online",
    seen: "Seen",
    typeMessage: "Type your message...",
    selectConversation: "Select a conversation",
    selectConversationDesc: "Choose a conversation to start chatting",
    discoverUsers: "Discover users",
    suggestedUsers: "Suggested users",
    filter: "Filter",
    mutualConnections: "mutual connections",
    message: "Message",
    availableGroups: "Available groups",
    create: "Create",
    members: "members",
    join: "Join",
    paymentRequest: "Payment request",
    payWithPi: "Pay with Pi",
    amount: "Amount",
    send: "Send",
    copied: "Copied!",
    delete: "Delete",
    reply: "Reply",
    pin: "Pin",
    archive: "Archive",
    report: "Report",
    download: "Download",
    share: "Share",
    delivered: "Delivered",
    read: "Read",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    noMessages: "No messages",
    typeFirstMessage: "Be the first to send a message",
    onlineNow: "Online now",
    activeNow: "Active now",
    yesterday: "Yesterday",
  },
  es: {
    messages: "Mensajes",
    discover: "Descubrir",
    groups: "Grupos",
    search: "Buscar conversaciones...",
    online: "En línea",
    seen: "Visto",
    typeMessage: "Escribe tu mensaje...",
    selectConversation: "Selecciona una conversación",
    selectConversationDesc: "Elige una conversación para empezar a chatear",
    discoverUsers: "Descubrir usuarios",
    suggestedUsers: "Usuarios sugeridos",
    filter: "Filtrar",
    mutualConnections: "conexiones mutuas",
    message: "Mensaje",
    availableGroups: "Grupos disponibles",
    create: "Crear",
    members: "miembros",
    join: "Unirse",
    paymentRequest: "Solicitud de pago",
    payWithPi: "Pagar con Pi",
    amount: "Cantidad",
    send: "Enviar",
    copied: "¡Copiado!",
    delete: "Eliminar",
    reply: "Responder",
    pin: "Fijar",
    archive: "Archivar",
    report: "Reportar",
    download: "Descargar",
    share: "Compartir",
    delivered: "Entregado",
    read: "Leído",
    pending: "Pendiente",
    completed: "Completado",
    failed: "Fallido",
    noMessages: "Sin mensajes",
    typeFirstMessage: "Sé el primero en enviar un mensaje",
    onlineNow: "En línea ahora",
    activeNow: "Activo ahora",
    yesterday: "Ayer",
  },
  pt: {
    messages: "Mensagens",
    discover: "Descobrir",
    groups: "Grupos",
    search: "Pesquisar conversas...",
    online: "Online",
    seen: "Visto",
    typeMessage: "Digite sua mensagem...",
    selectConversation: "Selecione uma conversa",
    selectConversationDesc: "Escolha uma conversa para começar a conversar",
    discoverUsers: "Descobrir usuários",
    suggestedUsers: "Usuários sugeridos",
    filter: "Filtrar",
    mutualConnections: "conexões mútuas",
    message: "Mensagem",
    availableGroups: "Grupos disponíveis",
    create: "Criar",
    members: "membros",
    join: "Entrar",
    paymentRequest: "Solicitação de pagamento",
    payWithPi: "Pagar com Pi",
    amount: "Valor",
    send: "Enviar",
    copied: "Copiado!",
    delete: "Excluir",
    reply: "Responder",
    pin: "Fixar",
    archive: "Arquivar",
    report: "Denunciar",
    download: "Baixar",
    share: "Compartilhar",
    delivered: "Entregue",
    read: "Lido",
    pending: "Pendente",
    completed: "Concluído",
    failed: "Falhou",
    noMessages: "Sem mensagens",
    typeFirstMessage: "Seja o primeiro a enviar uma mensagem",
    onlineNow: "Online agora",
    activeNow: "Ativo agora",
    yesterday: "Ontem",
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

  // Hooks personnalisés
  const debouncedSearch = useDebounce(searchQuery, 300)
  const isOnline = useOnlineStatus()
  const [pinnedConversations, setPinnedConversations] = useLocalStorage<string[]>("pinnedConversations", [])
  const [archivedConversations, setArchivedConversations] = useLocalStorage<string[]>("archivedConversations", [])
  const [draftMessages, setDraftMessages] = useLocalStorage<Record<string, string>>("draftMessages", {})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageActionsRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const t = translations[language as keyof typeof translations] || translations.fr

  // Gestion du clic en dehors du menu d'actions
  useClickOutside(messageActionsRef, () => setShowMessageActions(null))

  const conversations: Conversation[] = [
    {
      id: "conv1",
      participants: [{
        id: "user1",
        name: "Dr. Moussa Koné",
        avatar: "👨‍⚕️",
        online: true,
        location: "Bobo-Dioulasso",
        profession: "Vétérinaire",
        rating: 4.9,
        verified: true,
      }],
      lastMessage: {
        id: "msg1",
        senderId: "user1",
        senderName: "Dr. Moussa Koné",
        content: "Bonjour, j'ai reçu votre demande de consultation.",
        timestamp: "2024-02-01T10:30:00Z",
        read: false,
        delivered: true,
        type: "text",
      },
      unreadCount: 2,
      pinned: pinnedConversations.includes("conv1"),
      archived: archivedConversations.includes("conv1"),
    },
    {
      id: "conv2",
      participants: [{
        id: "user2",
        name: "Marie Ouédraogo",
        avatar: "👩‍🌾",
        online: false,
        lastSeen: "2024-02-01T08:15:00Z",
        location: "Kaya",
        profession: "Éleveuse",
        rating: 4.8,
        verified: true,
      }],
      lastMessage: {
        id: "msg2",
        senderId: "current",
        senderName: "Vous",
        content: "Merci pour les conseils !",
        timestamp: "2024-01-31T16:45:00Z",
        read: true,
        delivered: true,
        type: "text",
      },
      unreadCount: 0,
      pinned: pinnedConversations.includes("conv2"),
      archived: archivedConversations.includes("conv2"),
    },
    {
      id: "conv3",
      participants: [{
        id: "user3",
        name: "Ibrahim Sawadogo",
        avatar: "👨‍🌾",
        online: true,
        location: "Koudougou",
        profession: "Agriculteur",
        rating: 4.7,
        verified: false,
      }],
      lastMessage: {
        id: "msg3",
        senderId: "user3",
        senderName: "Ibrahim Sawadogo",
        content: "Pouvez-vous me recommander un fournisseur ?",
        timestamp: "2024-01-30T14:20:00Z",
        read: false,
        delivered: true,
        type: "text",
      },
      unreadCount: 1,
      pinned: pinnedConversations.includes("conv3"),
      archived: archivedConversations.includes("conv3"),
    },
    {
      id: "conv4",
      participants: [{
        id: "group1",
        name: "Groupe Aviculture",
        avatar: "🐔",
        online: false,
      }],
      lastMessage: {
        id: "msg4",
        senderId: "system",
        senderName: "Groupe",
        content: "Nouvelle formation disponible",
        timestamp: "2024-01-29T11:30:00Z",
        read: true,
        delivered: true,
        type: "text",
      },
      unreadCount: 0,
      pinned: pinnedConversations.includes("conv4"),
      archived: archivedConversations.includes("conv4"),
      isGroup: true,
      groupName: "Groupe Aviculture BF",
      groupAvatar: "🐔",
      groupMembers: 234,
    },
  ]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      senderId: "user1",
      senderName: "Dr. Moussa Koné",
      content: "Bonjour ! J'ai vu votre demande de consultation vétérinaire.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      delivered: true,
      type: "text",
    },
    {
      id: "msg2",
      senderId: "current",
      senderName: "Vous",
      content: "Bonjour Docteur, j'ai des poules malades depuis hier.",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      read: true,
      delivered: true,
      type: "text",
    },
    {
      id: "msg3",
      senderId: "user1",
      senderName: "Dr. Moussa Koné",
      content: "Pouvez-vous décrire les symptômes ?",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      read: true,
      delivered: true,
      type: "text",
    },
    {
      id: "msg4",
      senderId: "user1",
      senderName: "Dr. Moussa Koné",
      content: "Consultation vétérinaire",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      read: false,
      delivered: true,
      type: "payment",
      amount: 0.008,
      paymentStatus: "pending",
    },
  ])

  const suggestedUsers = [
    { id: "s1", name: "Prof. Alassane Zoungrana", specialty: "Formation aviculture", rating: 4.9, avatar: "👨‍🏫", mutual: 12, location: "Ouagadougou" },
    { id: "s2", name: "TechAgri Solutions", specialty: "Support technique", rating: 4.8, avatar: "💻", mutual: 8, location: "Koudougou" },
    { id: "s3", name: "Fatou Kaboré", specialty: "Éleveuse experte", rating: 4.7, avatar: "👩‍🌾", mutual: 15, location: "Banfora" },
    { id: "s4", name: "Coopérative YELEN", specialty: "Formation", rating: 4.6, avatar: "🏢", mutual: 20, location: "Gaoua" },
  ]

  const groups = [
    { name: "Aviculture Burkina Faso", members: 234, description: "Groupe pour les éleveurs de volailles", avatar: "🐔" },
    { name: "Agriculture Sahel", members: 156, description: "Communauté des agriculteurs", avatar: "🌾" },
    { name: "Transformation Agricole", members: 89, description: "Échanges sur la transformation", avatar: "🏭" },
  ]

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Sauvegarder le brouillon du message
  useEffect(() => {
    if (activeConversation) {
      if (newMessage.trim()) {
        setDraftMessages({ ...draftMessages, [activeConversation]: newMessage })
      } else {
        const { [activeConversation]: _, ...rest } = draftMessages
        setDraftMessages(rest)
      }
    }
  }, [newMessage, activeConversation])

  // Charger le brouillon sauvegardé
  useEffect(() => {
    if (activeConversation && draftMessages[activeConversation]) {
      setNewMessage(draftMessages[activeConversation])
    } else if (activeConversation && !draftMessages[activeConversation]) {
      setNewMessage("")
    }
  }, [activeConversation])

  // Simuler l'indicateur de frappe
  useEffect(() => {
    if (newMessage.trim() && !isTyping) {
      setIsTyping(true)
      // Simuler que l'autre personne est en train d'écrire
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000)
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [newMessage])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffHours = diff / (1000 * 60 * 60)

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffHours < 48) {
      return t.yesterday
    }
    return date.toLocaleDateString()
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: "current",
      senderName: "Vous",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      delivered: false,
      type: "text",
      replyTo: replyToMessage || undefined,
    }

    setMessages([...messages, message])
    setNewMessage("")
    setReplyToMessage(null)

    // Simuler la délivrance après 1s
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === message.id ? { ...m, delivered: true } : m))
    }, 1000)
  }

  const handleSendPayment = (toUserId: string, toUserName: string) => {
    setSelectedUser({ id: toUserId, name: toUserName })
    setShowPaymentModal(true)
  }

  const confirmPayment = () => {
    if (!paymentAmount || !selectedUser) return

    const amount = parseFloat(paymentAmount)
    const paymentMessage: Message = {
      id: `payment${Date.now()}`,
      senderId: "current",
      senderName: "Vous",
      content: `Paiement de ${amount} π envoyé à ${selectedUser.name}`,
      timestamp: new Date().toISOString(),
      read: true,
      delivered: true,
      type: "payment",
      amount: amount,
      paymentStatus: "completed",
    }

    setMessages([...messages, paymentMessage])
    setShowPaymentModal(false)
    setPaymentAmount("")
    setSelectedUser(null)
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    setShowMessageActions(null)
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
    setShowMessageActions(null)
  }

  const handlePinConversation = (convId: string) => {
    if (pinnedConversations.includes(convId)) {
      setPinnedConversations(pinnedConversations.filter(id => id !== convId))
    } else {
      setPinnedConversations([...pinnedConversations, convId])
    }
  }

  const handleArchiveConversation = (convId: string) => {
    if (archivedConversations.includes(convId)) {
      setArchivedConversations(archivedConversations.filter(id => id !== convId))
    } else {
      setArchivedConversations([...archivedConversations, convId])
    }
  }

  // Filtrer les conversations avec recherche debounced
  const filteredConversations = conversations.filter(conv => {
    const name = conv.isGroup ? conv.groupName : conv.participants[0].name
    return name?.toLowerCase().includes(debouncedSearch.toLowerCase())
  })

  // Trier les conversations (épinglées en premier)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  const activeConvData = conversations.find(c => c.id === activeConversation)

  return (
    <div className="h-[700px] flex bg-white rounded-xl border shadow-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              {t.messages}
              {!isOnline && (
                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                  Hors ligne
                </Badge>
              )}
            </h2>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder={t.search} className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="messages" className="text-xs gap-1"><MessageSquare className="h-3 w-3" />{t.messages}</TabsTrigger>
            <TabsTrigger value="discover" className="text-xs gap-1"><Users className="h-3 w-3" />{t.discover}</TabsTrigger>
            <TabsTrigger value="groups" className="text-xs gap-1"><Users className="h-3 w-3" />{t.groups}</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="flex-1 overflow-y-auto">
            {sortedConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune conversation</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {sortedConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all relative group ${
                      activeConversation === conv.id ? "bg-green-50 border border-green-200 shadow-sm" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveConversation(conv.id)}
                  >
                    {conv.pinned && (
                      <div className="absolute top-2 right-2">
                        <Pin className="h-3 w-3 text-gray-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-2xl">
                          {conv.isGroup ? conv.groupAvatar : conv.participants[0].avatar}
                        </div>
                        {!conv.isGroup && conv.participants[0].online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{conv.isGroup ? conv.groupName : conv.participants[0].name}</p>
                          <span className="text-xs text-gray-400">{formatTime(conv.lastMessage.timestamp)}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.lastMessage.senderId === "current" ? "Vous: " : ""}
                          {conv.lastMessage.content.substring(0, 40)}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          {!conv.isGroup && conv.participants[0].rating && (
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs">{conv.participants[0].rating}</span>
                            </div>
                          )}
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-green-600 text-white text-xs h-5 min-w-5 rounded-full flex items-center justify-center px-1">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Menu contextuel */}
                    <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => { e.stopPropagation(); handlePinConversation(conv.id) }}
                        >
                          <Pin className={`h-3 w-3 ${conv.pinned ? "text-yellow-500 fill-current" : "text-gray-400"}`} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => { e.stopPropagation(); handleArchiveConversation(conv.id) }}
                        >
                          <Archive className={`h-3 w-3 ${conv.archived ? "text-blue-500" : "text-gray-400"}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discover" className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{t.suggestedUsers}</h3>
              <Button variant="ghost" size="sm" className="gap-1"><Filter className="h-3 w-3" />{t.filter}</Button>
            </div>
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-xl">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.specialty}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{user.rating}</span>
                    <span>•</span>
                    <span>{user.mutual} {t.mutualConnections}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {t.message}
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="groups" className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{t.availableGroups}</h3>
              <Button size="sm" variant="outline" className="gap-1"><UserPlus className="h-3 w-3" />{t.create}</Button>
            </div>
            {groups.map((group, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg border hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">{group.avatar}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{group.name}</p>
                    <p className="text-xs text-gray-500">{group.members} {t.members}</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">{t.join}</Button>
                </div>
                <p className="text-xs text-gray-500 ml-13">{group.description}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            <div className="p-4 border-b flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-xl">
                    {activeConvData?.isGroup ? activeConvData.groupAvatar : activeConvData?.participants[0].avatar}
                  </div>
                  {!activeConvData?.isGroup && activeConvData?.participants[0].online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {activeConvData?.isGroup ? activeConvData.groupName : activeConvData?.participants[0].name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {activeConvData?.participants[0].online ? (
                      <><Circle className="h-2 w-2 text-green-500 fill-green-500" />{t.onlineNow}</>
                    ) : (
                      <><Clock className="h-2 w-2" />{activeConvData?.participants[0].lastSeen ? `${t.seen} ${formatTime(activeConvData.participants[0].lastSeen)}` : t.offline}</>
                    )}
                    {activeConvData?.participants[0].verified && <Badge variant="outline" className="text-xs bg-blue-50">✓ Vérifié</Badge>}
                    {isTyping && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-600 animate-pulse">
                        En train d'écrire...
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Phone className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Video className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Pi className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">{t.noMessages}</p>
                  <p className="text-xs">{t.typeFirstMessage}</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.senderId === "current" ? "justify-end" : "justify-start"} group`}>
                    <div className="relative max-w-[70%]">
                      <div className={`px-4 py-2 rounded-2xl ${message.senderId === "current" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                        {message.replyTo && (
                          <div className={`text-xs p-2 rounded mb-1 ${message.senderId === "current" ? "bg-green-700" : "bg-gray-200"}`}>
                            <p className="font-medium">↳ {message.replyTo.senderName}</p>
                            <p className="truncate">{message.replyTo.content.substring(0, 60)}</p>
                          </div>
                        )}
                        {message.type === "text" && <p className="text-sm">{message.content}</p>}
                        {message.type === "payment" && (
                          <div className={`flex items-center gap-2 p-2 rounded-lg ${message.senderId === "current" ? "bg-green-700" : "bg-white border"}`}>
                            <Pi className="h-5 w-5 text-purple-500" />
                            <div>
                              <p className="text-sm font-medium">{message.amount} π</p>
                              <p className="text-xs opacity-75">{message.content}</p>
                            </div>
                            {message.paymentStatus === "pending" && <Badge className="bg-yellow-500 text-white text-xs ml-2">En attente</Badge>}
                            {message.paymentStatus === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
                          </div>
                        )}
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <span className={`text-xs ${message.senderId === "current" ? "text-green-200" : "text-gray-400"}`}>
                            {formatTime(message.timestamp)}
                          </span>
                          {message.senderId === "current" && (
                            message.delivered ? (
                              <CheckCircle2 className="h-3 w-3 text-green-200" />
                            ) : (
                              <Clock className="h-3 w-3 text-green-200" />
                            )
                          )}
                        </div>
                      </div>
                      {/* Menu d'actions au survol */}
                      <div className={`absolute top-0 ${message.senderId === "current" ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setReplyToMessage(message)}>
                          <Reply className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleCopyMessage(message.content)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500" onClick={() => handleDeleteMessage(message.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
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
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleFileUpload}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsRecording(!isRecording)}>
                  {isRecording ? <VolumeX className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder={t.typeMessage}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-24"
                    disabled={!isOnline}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 text-xs"
                    onClick={() => handleSendPayment(activeConvData?.participants[0].id || "", activeConvData?.participants[0].name || "")}
                    disabled={!isOnline}
                  >
                    <Pi className="h-3 w-3 mr-1" />π
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isOnline}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {!isOnline && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  ⚠️ Vous êtes hors ligne. Les messages seront envoyés quand la connexion sera rétablie.
                </p>
              )}
              <input type="file" ref={fileInputRef} className="hidden" />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">{t.selectConversation}</p>
              <p className="text-sm text-gray-400">{t.selectConversationDesc}</p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => setActiveTab("discover")}>
                {t.discoverUsers}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de paiement Pi */}
      {showPaymentModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-purple-600" />
                {t.paymentRequest}
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500">✕</button>
            </div>
            <p className="text-gray-600 mb-4">Envoyer à: <span className="font-medium">{selectedUser.name}</span></p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t.amount} (π)</label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.008"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"
                onClick={confirmPayment}
                disabled={!paymentAmount}
              >
                <Pi className="h-4 w-4" />
                {t.payWithPi}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}