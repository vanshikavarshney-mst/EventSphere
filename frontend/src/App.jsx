import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/layout/Layout"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import HomePage from "./pages/HomePage"
import EventsPage from "./pages/EventsPage"
import EventDetailPage from "./pages/EventDetailPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import MyBookingsPage from "./pages/MyBookingsPage"
import AdminEventsPage from "./pages/admin/AdminEventsPage"
import AdminEventFormPage from "./pages/admin/AdminEventFormPage"
import AdminUserFormPage from "./pages/admin/AdminUserFormPage"
import AuthLayout from "./components/layout/AuthLayout"
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {

  return (
    <Routes>

  {/* Login & Register WITHOUT Navbar/Footer */}
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </Route>

  {/* All other pages WITH Navbar/Footer */}
  <Route element={<Layout />}>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/events" element={<EventsPage />} />
    <Route path="/events/:id" element={<EventDetailPage />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/bookings" element={<MyBookingsPage />} />
    </Route>

    <Route element={<ProtectedRoute adminOnly />}>
      <Route path="/admin/events" element={<AdminEventsPage />} />
      <Route path="/admin/events/new" element={<AdminEventFormPage />} />
      <Route path="/admin/events/:id/edit" element={<AdminEventFormPage />} />
      <Route path="/admin/users/new" element={<AdminUserFormPage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Route>

</Routes>
  )
}
