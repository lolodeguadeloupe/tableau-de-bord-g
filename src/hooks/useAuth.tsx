
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  admin_type?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  isAdmin: boolean
  isEditor: boolean
  isSuperAdmin: boolean
  isPartnerAdmin: boolean
  canAccessAllData: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const signOut = async () => {
    try {
      console.log('👋 Déconnexion...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('❌ Erreur lors de la déconnexion:', error)
      }
      setUser(null)
      setSession(null)
      setProfile(null)
      console.log('✅ Déconnexion réussie')
    } catch (error) {
      console.error('💥 Erreur inattendue lors de la déconnexion:', error)
    }
  }

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      console.log('🔄 Récupération du profil pour:', userId, userEmail)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('🔍 Résultat de la requête profiles:', { data, error })

      if (error) {
        console.error('❌ Erreur lors de la récupération du profil:', error)
        
        // Si le profil n'existe pas, on peut créer un profil par défaut
        if (error.code === 'PGRST116') {
          console.log('📝 Création d\'un profil par défaut...')
          
          // Déterminer le rôle et le type d'admin en fonction de l'email
          let role = 'client'
          let adminType = null
          
          if (userEmail === 'admin@clubcreole.com') {
            role = 'admin'
            adminType = 'super_admin'
            console.log('🎯 Email super admin détecté, attribution du rôle super_admin')
          } else if (userEmail === 'client@clubcreole.com') {
            role = 'admin'
            adminType = 'partner_admin'
            console.log('🎯 Email partner admin détecté, attribution du rôle partner_admin')
          }
          
          const insertData: any = {
            id: userId,
            email: userEmail || '',
            role: role
          }
          
          if (adminType) {
            insertData.admin_type = adminType
          }
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert(insertData)
            .select()
            .single()

          console.log('🔍 Résultat de la création du profil:', { newProfile, createError })

          if (createError) {
            console.error('❌ Erreur lors de la création du profil:', createError)
            return
          }
          
          // Vérifier si le nouvel utilisateur a les bons droits d'accès
          const hasAccess = newProfile.role === 'admin' && 
            (newProfile.admin_type === 'super_admin' || newProfile.admin_type === 'partner_admin')
          
          if (!hasAccess) {
            console.log('🚫 Utilisateur sans droits d\'accès détecté, déconnexion...')
            toast({
              title: "Accès refusé",
              description: "Seuls les Super Admin et Admin Partenaire peuvent accéder à cette application.",
              variant: "destructive",
            })
            await signOut()
            return
          }
          
          setProfile(newProfile)
          console.log('✅ Profil admin créé avec succès:', newProfile)
        }
        return
      }

      console.log('✅ Profil récupéré:', data)
      
      // Vérifier si l'utilisateur a les bons droits d'accès
      const hasAccess = data.role === 'admin' && 
        (data.admin_type === 'super_admin' || data.admin_type === 'partner_admin')
      
      if (!hasAccess) {
        console.log('🚫 Utilisateur sans droits d\'accès détecté, déconnexion...')
        toast({
          title: "Accès refusé",
          description: "Seuls les Super Admin et Admin Partenaire peuvent accéder à cette application.",
          variant: "destructive",
        })
        await signOut()
        return
      }
      
      setProfile(data)
      console.log('✅ Utilisateur admin validé:', data.admin_type || 'partner_admin')
    } catch (error) {
      console.error('💥 Erreur inattendue lors de la récupération du profil:', error)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email)
    }
  }

  useEffect(() => {
    console.log('🎯 Initialisation de l\'authentification...')
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Changement d\'état d\'authentification:', event, session?.user?.id)
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Utiliser setTimeout pour éviter les conflits avec onAuthStateChange
          setTimeout(() => {
            fetchProfile(session.user.id, session.user.email)
          }, 0)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const isAdmin = profile?.role === 'admin'
  const isEditor = profile?.role === 'editor' || isAdmin
  const isSuperAdmin = profile?.role === 'admin' && profile?.admin_type === 'super_admin'
  const isPartnerAdmin = profile?.role === 'admin' && profile?.admin_type === 'partner_admin'
  const canAccessAllData = isSuperAdmin

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signOut,
      isAdmin,
      isEditor,
      isSuperAdmin,
      isPartnerAdmin,
      canAccessAllData,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
