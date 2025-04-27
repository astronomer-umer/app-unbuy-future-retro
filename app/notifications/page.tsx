import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Bell } from "lucide-react"

export default async function NotificationsPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login?callbackUrl=/notifications")
  }

  // This would be a real API call in production
  // For now, we'll use mock data
  const notifications = [
    {
      id: "1",
      title: "New message",
      description: "You have a new message from John Doe",
      createdAt: new Date(),
      read: false,
      link: "/messages/user123",
    },
    {
      id: "2",
      title: "Price drop",
      description: "A product in your favorites has dropped in price",
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      link: "/products/product456",
    },
    {
      id: "3",
      title: "Product sold",
      description: "Your product 'Vintage Camera' has been sold",
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
      read: true,
      link: "/dashboard/listings",
    },
  ]

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 transition-colors ${
                notification.read ? "bg-background" : "bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${notification.read ? "" : "font-semibold"}`}>{notification.title}</h3>
                <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
              <div className="mt-2">
                <Button asChild variant="link" className="p-0 h-auto">
                  <Link href={notification.link}>View details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <Bell className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No notifications</h2>
          <p className="text-muted-foreground mt-2">You don't have any notifications at the moment.</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
