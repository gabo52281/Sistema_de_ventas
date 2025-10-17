import React, { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem('token', user.token)
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      // backend expected: { token, rol, id_usuario, id_admin }
      const payload = {
        token: res.data.token,
        rol: res.data.rol,
        id_usuario: res.data.id_usuario || null,
        id_admin: res.data.id_admin || null,
        nombre: res.data.nombre || null
      }
      setUser(payload)
      return payload
    } finally {
      setLoading(false)
    }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}