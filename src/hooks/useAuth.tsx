
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"

interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
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
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔄 Récupération du profil pour:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('❌ Erreur lors de la récupération du profil:', error)
        // Si le profil n'existe pas, on peut créer un profil par défaut
        if (error.code === 'PGRST116') {
          console.log('📝 Création d\'un profil par défaut...')
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user?.email || '',
              role: 'user'
            })
            .select()
            .single()

          if (createError) {
            console.error('❌ Erreur lors de la création du profil:', createError)
            return
          }
          setProfile(newProfile)
        }
        return
      }

      console.log('✅ Profil récupéré:', data)
      setProfile(data)
    } catch (error) {
      console.error('💥 Erreur inattendue lors de la récupération du profil:', error)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    console.log('🎯 Initialisation de l\'authentification...')
    
    // Configurer l'écoute des changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Changement d\'état d\'authentification:', event, session?.user?.id)
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Différer la récupération du profil pour éviter les blocages
          setTimeout(() => {
            fetchProfile(session.user.id)
          }, 100)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Session existante:', session?.user?.id)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

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

  const isAdmin = profile?.role === 'admin'
  const isEditor = profile?.role === 'editor' || isAdmin

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signOut,
      isAdmin,
      isEditor,
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
