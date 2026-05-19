import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single()
    if (data) setProfile({ ...data }) // spread forces new object reference = re-render
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => listener.subscription.unsubscribe()
  }, [fetchProfile])

  async function signUp({ email, password, fullName, profileType }) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      const isAdmin = adminEmail && email.toLowerCase() === adminEmail.toLowerCase()
      await supabase.from('users').insert({
        id: data.user.id,
        full_name: fullName,
        email,
        profile_type: isAdmin ? 'admin' : (profileType || 'investor'),
        cash_holdings: 5000.00,
        member_since: new Date().toISOString().split('T')[0],
      })
    }
    return data
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  async function updateProfile(updates) {
    if (!user) return
    const { error } = await supabase.from('users').update(updates).eq('id', user.id)
    if (error) throw error
    await fetchProfile(user.id)
  }

  // Standalone refresh — always fetches fresh from DB and forces re-render
  async function refreshProfile() {
    if (!user) return
    await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile, fetchProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
