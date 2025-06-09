
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, User } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const CustomAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('examlab_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (username: string, password: string) => {
    // For now, we'll do a simple check against the database
    // In production, you should hash the password and compare properly
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !data) {
      throw new Error('Invalid credentials')
    }

    // Simple password check (in production, use proper password hashing)
    if (password !== 'xajh@1314') {
      throw new Error('Invalid credentials')
    }

    // Set current user context in Supabase for RLS
    await supabase.rpc('set_config', {
      parameter: 'app.current_user_id',
      value: data.id.toString()
    })

    setUser(data)
    localStorage.setItem('examlab_user', JSON.stringify(data))
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('examlab_user')
    
    // Clear user context
    await supabase.rpc('set_config', {
      parameter: 'app.current_user_id',
      value: ''
    })
  }

  const isAdmin = user?.is_admin ?? false

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
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
