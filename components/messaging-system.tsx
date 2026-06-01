"use client"

import { useState } from "react"
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
} from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  read: boolean
  type: "text" | "image" | "file" | "audio"
  fileUrl?: string
  fileName?: string
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
  }[]
  lastMessage: Message
  unreadCount: number
  pinned: boolean
  archived: boolean
  isGroup?: boolean
  groupName?: string
}

interface MessagingSystemProps {
  currentLanguage: string
  userRegion: string
}

export default function MessagingSystem({ currentLanguage, userRegion }: MessagingSystemProps) {
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("messages")

  const conversations: Conversation[] = [
    {
      id: "conv1",
      participants: [
        {
          id: "user1",
          name: "Dr. Moussa Koné",
          avatar: "/placeholder.svg?height=40&width=40&text=MK",
          online: true,
          location: "Bobo-Dioulasso, Mali",
          profession: "Vétérinaire",
        },
      ],
      lastMessage: {
        id: "msg1",
        senderId: "user1",
        senderName: "Dr. Moussa Koné",
        content: "Bonjour, j'ai reçu votre demande de consultation. Je peux vous aider avec votre élevage.",
        timestamp: "2024-02-01T10:30:00Z",
        read: false,
        type: "text",
      },
      unreadCount: 2,
      pinned: true,
      archived: false,
    },
    {
      id: "conv2",
      participants: [
        {
          id: "user2",
          name: "Marie Ouédraogo",
          avatar: "/placeholder.svg?height=40&width=40&text=MO",
          online: false,
          lastSeen: "2024-02-01T08:15:00Z",
          location: "Kaya, Burkina Faso",
          profession: "Éleveuse",
        },
      ],
      lastMessage: {
        id: "msg2",
        senderId: "current",
        senderName: "Vous",
        content: "Merci pour les conseils sur la nutrition. Mes poules pondent beaucoup mieux maintenant !",
        timestamp: "2024-01-31T16:45:00Z",
        read: true,
        type: "text",
      },
      unreadCount: 0,
      pinned: false,
      archived: false,
    },
    {
      id: "conv3",
      participants: [
        {
          id: "user3",
          name: "Ibrahim Sawadogo",
          avatar: "/placeholder.svg?height=40&width=40&text=IS",
          online: true,
          location: "Koudougou, Burkina Faso",
          profession: "Agriculteur",
        },
      ],
      lastMessage: {
        id: "msg3",
        senderId: "user3",
        senderName: "Ibrahim Sawadogo",
        content: "Pouvez-vous me recommander un bon fournisseur d'aliments pour volailles dans la région ?",
        timestamp: "2024-01-30T14:20:00Z",
        read: false,
        type: "text",
      },
      unreadCount: 1,
      pinned: false,
      archived: false,
    },
    {
      id: "conv4",
      participants: [
        {
          id: "user4",
          name: "Groupe Aviculture BF",
          avatar: "/placeholder.svg?height=40&width=40&text=GA",
          online: false,
          lastSeen: "2024-01-29T12:00:00Z",
        },
      ],
      lastMessage: {
        id: "msg4",
        senderId: "user4",
        senderName: "Groupe Aviculture BF",
        content: "Nouvelle formation disponible sur les techniques d'élevage modernes. Intéressé ?",
        timestamp: "2024-01-29T11:30:00Z",
        read: true,
        type: "text",
      },
      unreadCount: 0,
      pinned: false,
      archived: false,
      isGroup: true,
      groupName: "Groupe Aviculture BF",
    },
  ]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      senderId: "user1",
      senderName: "Dr. Moussa Koné",
      content: "Bonjour ! J'ai vu votre demande de consultation vétérinaire.",
      timestamp: "2024-02-01T10:00:00Z",
      read: true,
      type: "text",
    },
    {
      id: "msg2",
      senderId: "current",
      senderName: "Vous",
      content: "Bonjour Docteur, oui j'ai quelques poules qui semblent malades depuis hier.",
      timestamp: "2024-02-01T10:05:00Z",
      read: true,
      type: "text",
    },
    {
      id: "msg3",
      senderId: "user1",
      senderName: "Dr. Moussa Koné",
      content: "Pouvez-vous me décrire les symptômes que vous observez ?",
      timestamp: "2024-02-01T10:10:00Z",
      read: true,
      type: "text",
    },
    {
      id: "msg4",
      senderId: "current",
      senderName: "Vous",
      content: "Elles ont l'air léthargiques, mangent moins et j'ai remarqué des éternuements.",
      timestamp: "2024-02-01T10:15:00Z",
      read: true,
      type: "text",
    },
    {
      id: "msg5",
      senderId: "user1",
      senderName: "Dr. Moussa Koné",
      content:
        "Cela ressemble à une infection respiratoire. Je peux vous aider avec un traitement approprié. Le coût de la consultation sera de 0.008π.",
      timestamp: "2024-02-01T10:30:00Z",
      read: false,
      type: "text",
    },
  ])

  const suggestedUsers = [
    {
      id: "suggest1",
      name: "Prof. Alassane Zoungrana",
      specialty: "Formation aviculture",
      rating: 4.9,
      avatar: "/placeholder.svg?height=40&width=40&text=AZ",
      mutual: 12,
      location: "Ouagadougou, Burkina Faso",
    },
    {
      id: "suggest2",
      name: "TechAgri Solutions",
      specialty: "Support technique",
      rating: 4.8,
      avatar: "/placeholder.svg?height=40&width=40&text=TS",
      mutual: 8,
      location: "Koudougou, Burkina Faso",
    },
    {
      id: "suggest3",
      name: "Fatou Kaboré",
      specialty: "Éleveuse experte",
      rating: 4.7,
      avatar: "/placeholder.svg?height=40&width=40&text=FK",
      mutual: 15,
      location: "Banfora, Burkina Faso",
    },
    {
      id: "suggest4",
      name: "Coopérative YELEN",
      specialty: "Formation et support",
      rating: 4.6,
      avatar: "/placeholder.svg?height=40&width=40&text=CY",
      mutual: 20,
      location: "Gaoua, Burkina Faso",
    },
  ]

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: "current",
      senderName: "Vous",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="h-[700px] flex bg-white rounded-lg border overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost">
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher des conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="messages" className="text-xs">
              Messages
            </TabsTrigger>
            <TabsTrigger value="discover" className="text-xs">
              Découvrir
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              Groupes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeConversation === conv.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={conv.participants[0].avatar || "/placeholder.svg"}
                        alt={conv.participants[0].name}
                        className="w-10 h-10 rounded-full"
                      />
                      {conv.participants[0].online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                      {conv.isGroup && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {conv.isGroup ? conv.groupName : conv.participants[0].name}
                        </p>
                        <div className="flex items-center space-x-1">
                          {conv.pinned && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                          <span className="text-xs text-gray-500">{formatTime(conv.lastMessage.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 truncate">
                          {conv.lastMessage.senderId === "current" ? "Vous: " : ""}
                          {conv.lastMessage.content}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge
                            variant="default"
                            className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                          >
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {!conv.isGroup && conv.participants[0].location && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{conv.participants[0].location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Utilisateurs suggérés</h3>
                <Button variant="ghost" size="sm">
                  <Filter className="h-3 w-3 mr-1" />
                  Filtrer
                </Button>
              </div>
              {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.specialty}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span>{user.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{user.mutual} connexions communes</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{user.location}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Groupes disponibles</h3>
                <Button size="sm" variant="outline">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Créer
                </Button>
              </div>
              {[
                {
                  name: "Aviculture Burkina Faso",
                  members: 234,
                  description: "Groupe pour les éleveurs de volailles du Burkina Faso",
                  avatar: "🐔",
                },
                {
                  name: "Agriculture Sahel",
                  members: 156,
                  description: "Communauté des agriculteurs de la région sahélienne",
                  avatar: "🌾",
                },
                {
                  name: "Transformation Agricole",
                  members: 89,
                  description: "Échanges sur la transformation des produits agricoles",
                  avatar: "🏭",
                },
              ].map((group, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{group.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{group.name}</p>
                      <p className="text-xs text-gray-600">{group.members} membres</p>
                    </div>
                    <Button size="sm">Rejoindre</Button>
                  </div>
                  <p className="text-xs text-gray-600 ml-13">{group.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={
                      conversations.find((c) => c.id === activeConversation)?.participants[0].avatar ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  {conversations.find((c) => c.id === activeConversation)?.participants[0].online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {conversations.find((c) => c.id === activeConversation)?.isGroup
                      ? conversations.find((c) => c.id === activeConversation)?.groupName
                      : conversations.find((c) => c.id === activeConversation)?.participants[0].name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {conversations.find((c) => c.id === activeConversation)?.participants[0].online
                      ? "En ligne"
                      : `Vu ${formatTime(conversations.find((c) => c.id === activeConversation)?.participants[0].lastSeen || "")}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === "current" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === "current" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.type === "text" && <p className="text-sm">{message.content}</p>}
                    {message.type === "image" && (
                      <div>
                        <img
                          src={message.fileUrl || "/placeholder.svg"}
                          alt="Image"
                          className="rounded mb-2 max-w-full"
                        />
                        {message.content && <p className="text-sm">{message.content}</p>}
                      </div>
                    )}
                    {message.type === "file" && (
                      <div className="flex items-center space-x-2">
                        <File className="h-4 w-4" />
                        <span className="text-sm">{message.fileName}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${message.senderId === "current" ? "text-blue-100" : "text-gray-500"}`}>
                        {formatTime(message.timestamp)}
                      </span>
                      {message.senderId === "current" && (
                        <div className="ml-2">
                          {message.read ? (
                            <CheckCircle2 className="h-3 w-3 text-blue-100" />
                          ) : (
                            <Circle className="h-3 w-3 text-blue-100" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Mic className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="sm" variant="ghost" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Sélectionnez une conversation</p>
              <p className="text-sm">Choisissez une conversation pour commencer à discuter</p>
              <Button className="mt-4" onClick={() => setActiveTab("discover")}>
                Découvrir des utilisateurs
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
