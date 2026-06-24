import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, User } from "lucide-react"
import { adminApi } from "../../api/admin"
import { useToast } from "../../context/ToastContext"
import AuthShell from "../../components/auth/AuthShell"
import Button from "../../components/ui/Button"
import { Label, Input, FieldError } from "../../components/ui/Field"

export default function AdminUserFormPage() {
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
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
      await adminApi.createAdminUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "admin",
      })

      toast.success("Admin account created successfully.")
      navigate("/admin/events", { replace: true })
    } catch (err) {
      toast.error(err.message || "Could not create admin account.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Create an admin account"
      subtitle="Only existing admins can create new admin users."
      footer={
        <p className="text-sm text-[var(--color-muted)]">
          Creating a new admin account is restricted to current admins.
        </p>
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
              placeholder="admin@example.com"
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

        <Button type="submit" loading={submitting} className="mt-2 w-full">
          Create admin account
        </Button>
      </form>
    </AuthShell>
  )
}
