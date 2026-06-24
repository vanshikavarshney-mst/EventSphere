import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

export function Spinner({ className }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-[var(--color-primary)]", className)} />
}

export function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-[var(--color-muted)]">
      <Spinner className="h-7 w-7" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-[var(--color-surface-2)] text-[var(--color-muted)]",
    primary: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
    accent: "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
    danger: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
    success: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50 px-6 py-16 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-primary)]">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
      {description && <p className="max-w-sm text-sm text-[var(--color-muted)]">{description}</p>}
      {action}
    </div>
  )
}
