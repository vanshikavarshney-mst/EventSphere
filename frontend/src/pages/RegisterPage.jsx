import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import AuthShell from "../components/auth/AuthShell"
import Button from "../components/ui/Button"
import { Label, Input, FieldError } from "../components/ui/Field"

export default function RegisterPage() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "user" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = "Name is required."
    if (!form.email.trim()) next.email = "Email is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email."
    if (!form.password) next.password = "Password is required."
    else if (form.password.length < 6) next.password = "Use at least 6 characters."
    if (form.confirm !== form.password) next.confirm = "Passwords do not match."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role })

      toast.success("Account created. Welcome to EventSphere!")
      navigate("/login", { replace: true })
    } catch (err) {
      toast.error(err.message || "Could not create your account.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join EventSphere to discover and book events."
      footer={
        <>
          {"Already have an account? "}
          <Link to="/login" className="font-medium text-[var(--color-primary)] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              id="name"
              autoComplete="name"
              placeholder="Jane Doe"
              className="pl-10"
              value={form.name}
              onChange={update("name")}
              error={errors.name}
            />
          </div>
          <FieldError>{errors.name}</FieldError>
        </div>

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
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="pl-10"
              value={form.password}
              onChange={update("password")}
              error={errors.password}
            />
          </div>
          <FieldError>{errors.password}</FieldError>
        </div>

        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="pl-10"
              value={form.confirm}
              onChange={update("confirm")}
              error={errors.confirm}
            />
          </div>
          <FieldError>{errors.confirm}</FieldError>
        </div>

        <div>
          <Label>Account type</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === "user"}
                onChange={update("role")}
                className="h-4 w-4"
              />
              <span className="text-sm">User</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={form.role === "admin"}
                onChange={update("role")}
                className="h-4 w-4"
              />
              <span className="text-sm">Admin</span>
            </label>
          </div>
        </div>

        <Button type="submit" loading={submitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
