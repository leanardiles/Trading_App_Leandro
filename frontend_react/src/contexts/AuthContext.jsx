import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        // Verify token is still valid
        try {
          const response = await authAPI.getProfile()
          setUser(response.data)
          localStorage.setItem('user', JSON.stringify(response.data))
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      setToken(newToken)
      setUser(userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || { message: 'Login failed' },
      }
    }
  }

  const register = async (userData) => {
    try {
      console.log('Attempting registration with data:', userData)
      const response = await authAPI.register(userData)
      console.log('Registration response:', response.data)
      const { token: newToken, user: newUser } = response.data
      
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      setToken(newToken)
      setUser(newUser)
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
      })
      return {
        success: false,
        error: error.response?.data || { message: 'Registration failed' },
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

