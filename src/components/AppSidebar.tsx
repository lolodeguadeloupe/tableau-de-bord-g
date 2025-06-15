import { Home, BarChart3, Users, Settings, Database, Activity, Building2, Utensils } from "lucide-react"
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
import { UserMenu } from "./UserMenu"
import { Link, useLocation, useNavigate } from "react-router-dom"

const items = [
  // {
  //   title: "Tableau de bord",
  //   url: "/dashboard",
  //   icon: Home,
  // },
  {
    title: "Analytiques",
    url: "/analytics",
    icon: BarChart3,
  },
  // {
  //   title: "Utilisateurs",
  //   url: "/users",
  //   icon: Users,
  // },
  {
    title: "Loisirs",
    url: "/leisure-activities",
    icon: Activity,
  },
  {
    title: "Hébergements",
    url: "/accommodations",
    icon: Building2,
  },
  {
    title: "Restaurants",
    url: "/restaurants",
    icon: Utensils,
  },

  // {
  //   title: "Base de données",
  //   url: "/database",
  //   icon: Database,
  // },
  // {
  //   title: "Paramètres",
  //   url: "/settings",
  //   icon: Settings,
  // },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    // Ici, ajoute la logique de déconnexion (ex: suppression du token, appel API, etc.)
    // Exemple basique :
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <UserMenu />
        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
