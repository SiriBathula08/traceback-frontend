import React, { createContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('tb_user')
    const t = localStorage.getItem('tb_token')
    if (u && t) setUser(JSON.parse(u))
    setLoading(false)
  }, [])

  useEffect(() => {
    const h = () => { setUser(null); window.location.href = '/login' }
    window.addEventListener('tb:logout', h)
    return () => window.removeEventListener('tb:logout', h)
  }, [])

  const login = useCallback(async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  const p = data.data
  localStorage.setItem('tb_token', p.accessToken)
  localStorage.setItem('tb_user', JSON.stringify(p))
  setUser(p)
  return p
}, [])

const register = useCallback(async (form) => {
  const { data } = await api.post('/auth/register', form)
  const p = data.data
  localStorage.setItem('tb_token', p.accessToken)
  localStorage.setItem('tb_user', JSON.stringify(p))
  setUser(p)
  return p
}, [])

   
  const logout = useCallback(() => {
    localStorage.removeItem('tb_token')
    localStorage.removeItem('tb_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, loading,
      isAuthenticated: !!user,
      isAdmin: user?.role?.includes('ADMIN'),
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
