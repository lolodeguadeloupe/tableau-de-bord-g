
import { Calendar, Home, FileText, Settings, BarChart3, Database, Activity } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Contenu",
    url: "/content",
    icon: FileText,
  },
  {
    title: "Activités Loisirs",
    url: "/leisure-activities",
    icon: Activity,
  },
  {
    title: "Statistiques",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Base de données",
    url: "/database",
    icon: Database,
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <Database className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Back-Office</h2>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground mb-2">
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`w-full justify-start hover:bg-accent/50 transition-colors ${
                    location.pathname === item.url ? 'bg-accent border border-border/40' : ''
                  }`}>
                    <Link to={item.url} className="flex items-center gap-3 p-3 rounded-lg">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-medium">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@site.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
