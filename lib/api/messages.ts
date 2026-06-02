import { http } from './client'
import { BACKEND_URLS } from './endpoints'
import type { Conversation, Message } from './types'

export const messagesApi = {
  getConversations: () => http.get<Conversation[]>(BACKEND_URLS.CONVERSATIONS),
  getMessages: (conversationId: string) =>
    http.get<Message[]>(`${BACKEND_URLS.MESSAGES}?conversationId=${conversationId}`),
  sendMessage: (conversationId: string, content: string, type?: string) =>
    http.post<Message>(BACKEND_URLS.MESSAGES, { conversationId, content, type }),
}