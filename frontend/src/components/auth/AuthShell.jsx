import { Link } from "react-router-dom"
import { Ticket } from "lucide-react"

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="animate-fade-up rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
        <Link to="/" className="mb-6 inline-flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
            <Ticket className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold">EventSphere</span>
        </Link>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-[var(--color-muted)]">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-5 text-center text-sm text-[var(--color-muted)]">{footer}</div>}
    </div>
  )
}
