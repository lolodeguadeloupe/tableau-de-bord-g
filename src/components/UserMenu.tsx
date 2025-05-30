
import { LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { Badge } from "@/components/ui/badge"

export function UserMenu() {
  const { profile, signOut } = useAuth()

  if (!profile) return null

  const getInitials = () => {
    const firstName = profile.first_name || ""
    const lastName = profile.last_name || ""
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || profile.email.charAt(0).toUpperCase()
  }

  const getRoleBadge = () => {
    const roleColors = {
      admin: "default",
      editor: "secondary",
      user: "outline"
    } as const

    return (
      <Badge variant={roleColors[profile.role as keyof typeof roleColors] || "outline"}>
        {profile.role === 'admin' ? 'Administrateur' : 
         profile.role === 'editor' ? 'Éditeur' : 'Utilisateur'}
      </Badge>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile.first_name && profile.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : profile.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.email}
            </p>
            <div className="pt-1">
              {getRoleBadge()}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
