import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Mail, Lock } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import AuthShell from "../components/auth/AuthShell"
import Button from "../components/ui/Button"
import { Label, Input, FieldError } from "../components/ui/Field"

export default function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/home"

  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email."
    if (!form.password) next.password = "Password is required."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e) => {
  e.preventDefault()
  if (!validate()) return

  setSubmitting(true)

  try {
    const user = await login(form)

    toast.success(`Welcome back, ${user?.name || "there"}!`)

    if (user?.role === "admin") {
      navigate("/admin/events", { replace: true })
    } else {
      navigate(from, { replace: true })
    }

  } catch (err) {
    toast.error(err.message || "Invalid email or password.")
  } finally {
    setSubmitting(false)
  }
}

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to book events and manage your tickets."
      footer={
        <>
          {"Don't have an account? "}
          <Link to="/register" className="font-medium text-[var(--color-primary)] hover:underline">
            Register
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="pl-10"
              value={form.email}
              onChange={update("email")}
              error={errors.email}
            />
          </div>
          <FieldError>{errors.email}</FieldError>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pl-10"
              value={form.password}
              onChange={update("password")}
              error={errors.password}
            />
          </div>
          <FieldError>{errors.password}</FieldError>
        </div>

        <Button type="submit" loading={submitting} className="mt-2 w-full">
          Log in
        </Button>
      </form>
    </AuthShell>
  )
}
