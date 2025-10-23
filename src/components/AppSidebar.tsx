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
  PartyPopper,
  Sparkles,
  Tag,
  Activity,
  Plane,
  Megaphone,
  Handshake,
  Building,
  Mail
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
import { useAuth } from "@/hooks/useAuth"
import { usePartnerActivities } from "@/hooks/usePartnerActivities"

// Menu items.
const items = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: Home,
    color: "text-blue-600",
    requiresSuperAdmin: false
  },
  {
    title: "Utilisateurs",
    url: "/users", 
    icon: Users,
    color: "text-green-600",
    requiresSuperAdmin: true
  },
  {
    title: "Partenaires",
    url: "/partners",
    icon: Handshake,
    color: "text-lime-600",
    requiresSuperAdmin: true
  },
  {
    title: "Restaurants",
    url: "/restaurants",
    icon: Utensils,
    color: "text-orange-600",
    requiresSuperAdmin: false,
    activityType: "restaurant"
  },
  {
    title: "Hébergements",
    url: "/accommodations",
    icon: MapPin,
    color: "text-purple-600",
    requiresSuperAdmin: false,
    activityType: "accommodation"
  },
  {
    title: "Concerts",
    url: "/concerts",
    icon: Music,
    color: "text-pink-600",
    requiresSuperAdmin: false,
    activityType: "concert"
  },
  {
    title: "Soirées",
    url: "/nightlife",
    icon: PartyPopper,
    color: "text-violet-600",
    requiresSuperAdmin: false,
    activityType: "nightlife"
  },
  {
    title: "Activités Loisirs",
    url: "/leisure-activities",
    icon: Waves,
    color: "text-cyan-600",
    requiresSuperAdmin: false,
    activityType: "leisure_activity"
  },
  {
    title: "Nos Activités",
    url: "/activities",
    icon: Activity,
    color: "text-teal-600",
    requiresSuperAdmin: true
  },
  {
    title: "Locations de voitures",
    url: "/car-rentals",
    icon: Car,
    color: "text-emerald-600",
    requiresSuperAdmin: false,
    activityType: "car_rental"
  },
  {
    title: "Voyance",
    url: "/voyance",
    icon: Sparkles,
    color: "text-indigo-500",
    requiresSuperAdmin: false,
    activityType: "voyance"
  },
  {
    title: "Bons Plans",
    url: "/bons-plans",
    icon: Tag,
    color: "text-amber-600",
    requiresSuperAdmin: false,
    activityType: "bon_plan"
  },
  {
    title: "Promotions",
    url: "/promotions",
    icon: Megaphone,
    color: "text-red-600",
    requiresSuperAdmin: false,
    activityType: "promotion"
  },
  {
    title: "Newsletter",
    url: "/newsletter",
    icon: Mail,
    color: "text-blue-600",
    requiresSuperAdmin: false
  },
  {
    title: "Analytics", 
    url: "/analytics",
    icon: BarChart3,
    color: "text-indigo-600",
    requiresSuperAdmin: false
  },
  {
    title: "Contenu",
    url: "/content",
    icon: FileText,
    color: "text-yellow-600",
    requiresSuperAdmin: true
  },
  {
    title: "Base de Données",
    url: "/database",
    icon: Database,
    color: "text-red-600",
    requiresSuperAdmin: true
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
    color: "text-gray-600",
    requiresSuperAdmin: true
  },
  {
    title: "Voyages",
    url: "/travel",
    icon: Plane,
    color: "text-blue-600",
    requiresSuperAdmin: false,
    activityType: "travel"
  },
  
]

export function AppSidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isSuperAdmin, canAccessAllData } = useAuth()
  const { hasAccessToActivityType, loading } = usePartnerActivities()

  // Filtrer les éléments selon les droits de l'utilisateur et l'accessibilité des données
  const visibleItems = items.filter(item => {
    // Vérifier d'abord les droits Super Admin
    if (item.requiresSuperAdmin) {
      return isSuperAdmin
    }
    
    // Si l'élément a un activityType, vérifier s'il y a des données accessibles
    if (item.activityType) {
      // Super Admin a accès à tout
      if (canAccessAllData) {
        return true
      }
      
      // Pour les autres utilisateurs, vérifier s'ils ont accès à ce type d'activité
      return hasAccessToActivityType(item.activityType as any)
    }
    
    // Pour les éléments sans activityType (Dashboard, Analytics, etc.), toujours visible
    return true
  })

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
              {visibleItems.map((item) => (
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
