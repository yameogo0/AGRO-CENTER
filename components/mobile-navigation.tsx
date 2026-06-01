"use client"

import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Store, BarChart3, Menu } from "lucide-react"

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onMenuToggle: () => void
}

export default function MobileNavigation({ activeTab, onTabChange, onMenuToggle }: MobileNavigationProps) {
  const navigationItems = [
    { id: "home", label: "Accueil", icon: Home },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "services", label: "Marché", icon: Store },
    { id: "analytics", label: "Données", icon: BarChart3 },
    { id: "menu", label: "Menu", icon: Menu, action: "menu" },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className="flex flex-col h-14 p-1"
              onClick={() => {
                if (item.action === "menu") {
                  onMenuToggle()
                } else {
                  onTabChange(item.id)
                }
              }}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
