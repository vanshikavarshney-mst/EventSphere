import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { authApi } from "../api/auth"
import { TOKEN_KEY } from "../api/client"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  // Load current user on mount if token exists
  useEffect(() => {
    let active = true
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .me()
      .then((data) => {
        if (active) setUser(data.user || data)
      })
      .catch(() => {
        if (active) clearSession()
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [clearSession])

  // Handle global 401 logout event
  useEffect(() => {
    const handler = () => setUser(null)
    window.addEventListener("eventsphere:unauthorized", handler)
    return () =>
      window.removeEventListener("eventsphere:unauthorized", handler)
  }, [])

  // ✅ SINGLE persistAuth (FIXED)
  const persistAuth = (data) => {
  const token = data?.token || data?.accessToken

  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  let decodedUser = null

  try {
    if (token) {
      const decoded = jwtDecode(token)
      decodedUser = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      }
    }
  } catch (err) {
    console.log("Invalid token")
  }

  const nextUser = data?.user || decodedUser

  setUser(nextUser)

  return nextUser
}

  const login = async (credentials) => {
    const data = await authApi.login(credentials)
    console.log("LOGIN DATA =>", data)
    return persistAuth(data)
  }

  const register = async (payload) => {
    const data = await authApi.register(payload)

    if (data.token || data.accessToken) {
      return persistAuth(data)
    }

    return data
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore server errors
    } finally {
      clearSession()
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}