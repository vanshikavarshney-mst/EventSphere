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
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/bookings" element={<MyBookingsPage />} />
        </Route>

        {/* Admin only */}
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
