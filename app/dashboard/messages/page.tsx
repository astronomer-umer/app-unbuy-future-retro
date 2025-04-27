import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageList } from "@/components/message-list"
import { MessageSquare } from "lucide-react"

export default async function DashboardMessagesPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/messages")
  }

  const userId = session.user.id

  // Get conversations (grouped by sender)
  const conversations = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  // Group messages by conversation partner
  const conversationMap = new Map()

  conversations.forEach((message) => {
    const isIncoming = message.receiverId === userId
    const partnerId = isIncoming ? message.senderId : message.receiverId

    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        partnerId,
        partnerName: isIncoming ? message.sender.name : "User",
        partnerImage: isIncoming ? message.sender.image : null,
        lastMessage: message.content,
        lastMessageDate: message.createdAt,
        unreadCount: isIncoming && !message.read ? 1 : 0,
      })
    } else if (isIncoming && !message.read) {
      const conversation = conversationMap.get(partnerId)
      conversation.unreadCount += 1
      conversationMap.set(partnerId, conversation)
    }
  })

  const conversationList = Array.from(conversationMap.values())

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {conversationList.length > 0 ? (
        <MessageList conversations={conversationList} />
      ) : (
        <div className="text-center py-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">No messages yet</h2>
          <p className="text-muted-foreground mt-2">
            When you contact sellers or receive messages, they will appear here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/categories">Browse Items</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
