import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API = 'http://localhost:5000/api/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('cc_token') || null)
  const [loading] = useState(false)

  // register new user
  const register = async (name, email, password) => {
    const res = await axios.post(`${API}/signup`, {
      username: name,
      email,
      password
    })
    return res.data
  }

  // login existing user
  const login = async (email, password) => {
    const res = await axios.post(`${API}/login`, { email, password })
    const { token, user } = res.data

    localStorage.setItem('cc_token', token)
    localStorage.setItem('cc_user', JSON.stringify({
      id: user._id,
      name: user.username,
      email: user.email
    }))

    setToken(token)
    setUser({ id: user._id, name: user.username, email: user.email })
    return res.data
  }

  // logout and clear storage
  const logout = () => {
    localStorage.removeItem('cc_token')
    localStorage.removeItem('cc_user')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}