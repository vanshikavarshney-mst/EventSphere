import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Ticket, Menu, X, LogOut, LayoutDashboard, CalendarCheck, UserCircle2 } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import Button from "../ui/Button"
import { cn } from "../../lib/utils"

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    toast.success("You have been logged out.")
    navigate("/")
  }

  const linkClass = ({ isActive }) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-[var(--color-surface-2)] text-[var(--color-foreground)]"
        : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]",
    )

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
            <Ticket className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">EventSphere</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
          {isAuthenticated && !isAdmin && (
            <NavLink to="/bookings" className={linkClass}>
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/events" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <UserCircle2 className="h-5 w-5 text-[var(--color-primary)]" />
                {user?.name || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to="/register" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-[var(--color-foreground)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            <NavLink to="/events" className={linkClass} onClick={() => setOpen(false)}>
              <span className="inline-flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" /> Events
              </span>
            </NavLink>
            {isAuthenticated && !isAdmin && (
              <NavLink to="/bookings" className={linkClass} onClick={() => setOpen(false)}>
                <span className="inline-flex items-center gap-2">
                  <Ticket className="h-4 w-4" /> My Bookings
                </span>
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin/events" className={linkClass} onClick={() => setOpen(false)}>
                <span className="inline-flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Admin
                </span>
              </NavLink>
            )}
            <div className="mt-3 flex flex-col gap-2 border-t border-[var(--color-border)] pt-3">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="outline" size="sm" onClick={() => setOpen(false)}>
                    Log in
                  </Button>
                  <Button as={Link} to="/register" size="sm" onClick={() => setOpen(false)}>
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
