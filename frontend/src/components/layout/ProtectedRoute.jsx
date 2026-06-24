import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 🔒 Admin guard
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}