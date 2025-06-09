
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const CustomAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (username: string, password: string) => {
    console.log('Attempting login with username:', username)
    
    // Query the database for the user
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    console.log('Database query result:', { data, error })

    if (error || !data) {
      console.error('User not found:', error)
      throw new Error('Invalid credentials')
    }

    // For now, compare password directly (in production, use proper hashing)
    console.log('Comparing passwords - input:', password, 'stored:', data.password_hash)
    
    if (data.password_hash !== password) {
      console.error('Password mismatch')
      throw new Error('Invalid credentials')
    }

    console.log('Login successful, setting user:', data)

    // Set current user context in Supabase for RLS
    await supabase.rpc('set_config', {
      parameter: 'app.current_user_id',
      value: data.id.toString()
    })

    // Create a mock session for username/password login
    const mockSession = {
      user: data,
      access_token: 'mock_token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      refresh_token: 'mock_refresh'
    }

    setUser(data as any)
    setSession(mockSession as any)
    localStorage.setItem('examlab_user', JSON.stringify(data))
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })

    if (error) {
      console.error('Google sign-in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    // Sign out from Supabase auth if using OAuth
    await supabase.auth.signOut()
    
    setUser(null)
    setSession(null)
    localStorage.removeItem('examlab_user')
    
    // Clear user context
    await supabase.rpc('set_config', {
      parameter: 'app.current_user_id',
      value: ''
    })
  }

  // Check if user is admin (works for both custom users table and Supabase auth users)
  const isAdmin = user?.is_admin ?? user?.user_metadata?.is_admin ?? false

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signInWithGoogle,
      signOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useCustomAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useCustomAuth must be used within a CustomAuthProvider')
  }
  return context
}
