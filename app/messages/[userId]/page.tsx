"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ConversationMessages } from "@/components/conversation-messages"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface ConversationPageProps {
  params: {
    userId: string
  }
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [partner, setPartner] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      // Fetch partner data
      fetch(`/api/users/${params.userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("User not found")
          return res.json()
        })
        .then((data) => {
          setPartner(data.user)
        })
        .catch(() => {
          router.push("/messages")
        })

      // Fetch messages
      fetch(`/api/messages/${params.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching messages:", error)
          setLoading(false)
        })
    }
  }, [params.userId, router, status])

  if (status === "loading" || loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!session?.user || !partner) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          Back
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={partner.image || ""} alt={partner.name || "User"} />
          <AvatarFallback>{partner.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold">{partner.name}</h1>
      </div>

      <div className="border rounded-lg">
        <ConversationMessages messages={messages} currentUserId={session.user.id} partnerId={params.userId} />
      </div>
    </div>
  )
}
