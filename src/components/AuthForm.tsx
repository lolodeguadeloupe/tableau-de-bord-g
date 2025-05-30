
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"

interface AuthFormProps {
  onSuccess: () => void
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Connexion
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté.",
          })
          onSuccess()
        }
      } else {
        // Inscription
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              role: 'user'
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        })

        if (error) throw error

        if (data.user) {
          toast({
            title: "Inscription réussie",
            description: "Votre compte a été créé avec succès.",
          })
          
          // Basculer vers le mode connexion après inscription
          setIsLogin(true)
          setFirstName("")
          setLastName("")
        }
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'authentification.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Connexion" : "Inscription"}
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            {isLogin 
              ? "Connectez-vous à votre compte administrateur" 
              : "Créez votre compte utilisateur"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                    placeholder="Votre nom"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                "Chargement..."
              ) : isLogin ? (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Se connecter
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  S'inscrire
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin)
                setEmail("")
                setPassword("")
                setFirstName("")
                setLastName("")
              }}
              className="text-sm"
            >
              {isLogin 
                ? "Pas de compte ? S'inscrire" 
                : "Déjà un compte ? Se connecter"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
