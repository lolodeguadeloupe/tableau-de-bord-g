
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const [showAccessDeniedMessage, setShowAccessDeniedMessage] = useState(false)
  const { toast } = useToast()

  // Afficher le message d'accès refusé si l'utilisateur a été déconnecté
  useEffect(() => {
    const checkForAccessDenied = () => {
      // Vérifier si l'utilisateur a été redirigé à cause d'un accès refusé
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('access_denied') === 'true') {
        setShowAccessDeniedMessage(true)
        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
    
    checkForAccessDenied()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowAccessDeniedMessage(false)

    try {
      if (isLogin) {
        console.log("🔐 Tentative de connexion pour:", email)
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("❌ Erreur de connexion:", error)
          throw error
        }

        if (data.user) {
          // Vérifier le profil de l'utilisateur
          console.log("🔍 ID de l'utilisateur:", data.user.id)
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role, admin_type')
            .eq('id', data.user.id as string)
            .single();

          console.log("🔍 Données du profil:", profileData)
          if (profileError) {
            throw new Error('Erreur lors de la vérification des permissions');
          }

          if (profileData.role !== 'admin') {
            throw new Error('Accès refusé. Seuls les administrateurs peuvent accéder à cette application.');
          }

          const adminTypeText = profileData.admin_type === 'super_admin' 
            ? 'Super Administrateur' 
            : 'Administrateur Partenaire'

          toast({
            title: "Connexion réussie",
            description: `Bienvenue dans l'interface d'administration (${adminTypeText}).`,
          })

          // Petit délai pour laisser le temps au hook useAuth de se mettre à jour
          setTimeout(() => {
            onSuccess();
          }, 100);
        }
      } else {
        console.log("📝 Tentative d'inscription pour:", email)
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              role: 'client'
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        })

        if (error) {
          console.error("❌ Erreur d'inscription:", error)
          throw error
        }

        if (data.user) {
          console.log("✅ Inscription réussie pour:", data.user.email)
          toast({
            title: "Inscription réussie",
            description: "Votre compte a été créé. Veuillez noter que seuls les administrateurs peuvent accéder à cette application.",
          })
          
          // Basculer vers le mode connexion après inscription
          setIsLogin(true)
          setFirstName("")
          setLastName("")
        }
      }
    } catch (error) {
      const err = error as { message?: string }
      console.error("❌ Erreur d'authentification:", err)
      toast({
        title: "Erreur",
        description: err.message || "Une erreur est survenue lors de l'authentification.",
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
            {isLogin ? "Connexion Administrateur" : "Inscription"}
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            {isLogin 
              ? "Accès réservé aux administrateurs uniquement" 
              : "Créez votre compte (accès admin requis)"}
          </p>
        </CardHeader>
        <CardContent>
          {showAccessDeniedMessage && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Accès refusé. Seuls les administrateurs peuvent accéder à cette application.
              </AlertDescription>
            </Alert>
          )}

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
                placeholder="admin@exemple.com"
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
        </CardContent>
      </Card>
    </div>
  )
}
