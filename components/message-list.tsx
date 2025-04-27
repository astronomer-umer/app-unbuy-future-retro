"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Conversation {
  partnerId: string
  partnerName: string
  partnerImage: string | null
  lastMessage: string
  lastMessageDate: Date
  unreadCount: number
}

interface MessageListProps {
  conversations: Conversation[]
}

export function MessageList({ conversations: initialConversations }: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState(initialConversations)

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search messages..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredConversations.map((conversation) => (
          <Link key={conversation.partnerId} href={`/messages/${conversation.partnerId}`} className="block">
            <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.partnerImage || ""} alt={conversation.partnerName} />
                <AvatarFallback>{conversation.partnerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{conversation.partnerName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(conversation.lastMessageDate)}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
              </div>
              {conversation.unreadCount > 0 && <Badge className="ml-auto">{conversation.unreadCount}</Badge>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
