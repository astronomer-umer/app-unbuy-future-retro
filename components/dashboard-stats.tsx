import type React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  title: string
  value: string
  icon: React.ReactNode
  href: string
}

export function DashboardStats({ title, value, icon, href }: DashboardStatsProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-all hover:border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className="rounded-full p-2 bg-primary/10 text-primary">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
