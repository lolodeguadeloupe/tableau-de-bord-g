
import { useState } from "react"
import {
  Music,
  Home,
  Users,
  Settings,
  BarChart3,
  FileText,
  Database,
  Utensils,
  MapPin,
  Car,
  Waves,
  Calendar,
  Menu,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useLocation, Link } from "react-router-dom"

// Menu items.
const items = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
    color: "text-blue-600"
  },
  {
    title: "Utilisateurs",
    url: "/users", 
    icon: Users,
    color: "text-green-600"
  },
  {
    title: "Restaurants",
    url: "/restaurants",
    icon: Utensils,
    color: "text-orange-600"
  },
  {
    title: "Hébergements",
    url: "/accommodations",
    icon: MapPin,
    color: "text-purple-600"
  },
  {
    title: "Concerts",
    url: "/concerts",
    icon: Music,
    color: "text-pink-600"
  },
  {
    title: "Activités Loisirs",
    url: "/leisure-activities",
    icon: Waves,
    color: "text-cyan-600"
  },
  {
    title: "Analytics", 
    url: "/analytics",
    icon: BarChart3,
    color: "text-indigo-600"
  },
  {
    title: "Contenu",
    url: "/content",
    icon: FileText,
    color: "text-yellow-600"
  },
  {
    title: "Base de Données",
    url: "/database",
    icon: Database,
    color: "text-red-600"
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
    color: "text-gray-600"
  },
]

export function AppSidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <SidebarGroupLabel className={`text-lg font-bold text-primary ${isCollapsed ? 'hidden' : ''}`}>
              Club Créole Admin
            </SidebarGroupLabel>
            <SidebarTrigger 
              className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
