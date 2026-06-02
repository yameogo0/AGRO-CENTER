"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  Loader2,
} from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useOnlineStatus } from "@/hooks/use-online-status"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { messagesApi } from "@/lib/api/messages"
import { piApi } from "@/lib/api/pi"
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

// Traductions (identiques à l'original)
const translations = { /* ... vos traductions ... */ }

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

  // Hooks personnalisés
  const debouncedSearch = useDebounce(searchQuery, 300)
  const isOnline = useOnlineStatus()
  const { isAuthenticated, userData } = usePiAuth()
  const [pinnedConversations, setPinnedConversations] = useLocalStorage<string[]>("pinnedConversations", [])
  const [archivedConversations, setArchivedConversations] = useLocalStorage<string[]>("archivedConversations", [])
  const [draftMessages, setDraftMessages] = useLocalStorage<Record<string, string>>("draftMessages", {})
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messageActionsRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const t = translations[language as keyof typeof translations] || translations.fr

  useClickOutside(messageActionsRef, () => setShowMessageActions(null))

  // Charger les conversations depuis l'API
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated || !isOnline) return
    
    setIsLoadingConversations(true)
    try {
      const { data } = await messagesApi.getConversations()
      if (data && data.length > 0) {
        // Mettre à jour avec les statuts épinglés/archivés locaux
        const enrichedData = data.map(conv => ({
          ...conv,
          pinned: pinnedConversations.includes(conv.id),
          archived: archivedConversations.includes(conv.id),
        }))
        setConversations(enrichedData)
        localStorage.setItem("conversations", JSON.stringify(enrichedData))
      }
    } catch (error) {
      console.error("Erreur chargement conversations:", error)
      // Fallback localStorage
      const localConversations = localStorage.getItem("conversations")
      if (localConversations) {
        setConversations(JSON.parse(localConversations))
      }
    } finally {
      setIsLoadingConversations(false)
    }
  }, [isAuthenticated, isOnline, pinnedConversations, archivedConversations])

  // Charger les messages d'une conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!isAuthenticated || !isOnline) return
    
    setIsLoadingMessages(true)
    try {
      const { data } = await messagesApi.getMessages(conversationId)
      if (data) {
        setMessages(data)
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(data))
      }
    } catch (error) {
      console.error("Erreur chargement messages:", error)
      const localMessages = localStorage.getItem(`messages_${conversationId}`)
      if (localMessages) {
        setMessages(JSON.parse(localMessages))
      }
    } finally {
      setIsLoadingMessages(false)
    }
  }, [isAuthenticated, isOnline])

  // Envoyer un message
  const sendMessage = useCallback(async (content: string, type: string = "text", replyTo?: Message) => {
    if (!activeConversation || !content.trim()) return
    if (!isOnline) {
      showToast("Connexion internet requise", "error")
      return
    }
    if (!isAuthenticated) {
      showToast("Veuillez vous connecter", "error")
      return
    }

    setIsSending(true)
    try {
      const { data } = await messagesApi.sendMessage(activeConversation, content, type)
      
      const newMsg: Message = {
        id: data.id,
        senderId: "current",
        senderName: userData?.username || "Vous",
        content,
        timestamp: new Date().toISOString(),
        read: true,
        delivered: true,
        type: type as any,
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
      
      localStorage.setItem(`messages_${activeConversation}`, JSON.stringify([...messages, newMsg]))
    } catch (error) {
      console.error("Erreur envoi message:", error)
      showToast("Erreur lors de l'envoi", "error")
    } finally {
      setIsSending(false)
    }
  }, [activeConversation, isOnline, isAuthenticated, userData, messages])

  // Envoyer un paiement Pi
  const handleSendPayment = useCallback(async (toUserId: string, toUserName: string) => {
    if (!paymentAmount) return
    
    setIsSending(true)
    try {
      const amount = parseFloat(paymentAmount)
      await piApi.sendPayment(toUserId, amount, `Paiement à ${toUserName}`)
      
      const paymentMsg = `Paiement de ${amount} π envoyé à ${toUserName}`
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
    if (activeConversation && isOnline && isAuthenticated) {
      fetchMessages(activeConversation)
      
      // Polling toutes les 5 secondes
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(activeConversation)
      }, 5000)
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
        }
      }
    }
  }, [activeConversation, isOnline, isAuthenticated, fetchMessages])

  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (isOnline && isAuthenticated) {
      fetchConversations()
    }
  }, [isOnline, isAuthenticated, fetchConversations])

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
    const diffHours = diff / (1000 * 60 * 60)

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffHours < 48) {
      return t.yesterday
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

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    setShowMessageActions(null)
    showToast(t.copied, "success")
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId))
    setShowMessageActions(null)
  }

  // Filtrer et trier les conversations
  const filteredConversations = conversations.filter(conv => {
    const name = conv.isGroup ? conv.groupName : conv.participants[0]?.name
    return name?.toLowerCase().includes(debouncedSearch.toLowerCase())
  })

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  })

  const activeConvData = conversations.find(c => c.id === activeConversation)

  // Afficher un loader pendant le chargement
  if (isLoadingConversations && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[700px] flex bg-white rounded-xl border shadow-lg overflow-hidden">
      {/* Sidebar - contenu identique à l'original avec ajout des statuts de chargement */}
      {/* ... garder le JSX de la sidebar identique ... */}
      
      {/* Chat Area - contenu identique à l'original avec indicateur d'envoi */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            {/* Header - identique */}
            <div className="p-4 border-b flex items-center justify-between bg-white">
              {/* ... contenu identique ... */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                      {/* Menu d'actions */}
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
                  <Button size="sm" variant="ghost" onClick={() => setReplyToMessage(null)}><X className="h-4 w-4" /></Button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => fileInputRef.current?.click()}>
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
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              {!isOnline && (
                <p className="text-xs text-red-500 mt-2 text-center">⚠️ Vous êtes hors ligne</p>
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
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Wallet className="h-5 w-5 text-purple-600" />{t.paymentRequest}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500">✕</button>
            </div>
            <p className="text-gray-600 mb-4">Envoyer à: <span className="font-medium">{activeConvData?.participants[0]?.name}</span></p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t.amount} (π)</label>
              <Input type="number" step="0.001" placeholder="0.008" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2" onClick={handleSendPayment} disabled={!paymentAmount || isSending}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pi className="h-4 w-4" />}
                {t.payWithPi}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowPaymentModal(false)}>Annuler</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}