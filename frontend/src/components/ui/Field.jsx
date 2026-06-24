import { cn } from "../../lib/utils"

const baseControl =
  "w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"

export function Label({ children, htmlFor, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("mb-1.5 block text-sm font-medium text-[var(--color-foreground)]", className)}
    >
      {children}
    </label>
  )
}

export function Input({ className, error, ...props }) {
  return (
    <input
      className={cn(baseControl, "h-11", error && "border-[var(--color-danger)]", className)}
      {...props}
    />
  )
}

export function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(baseControl, "min-h-28 py-3", error && "border-[var(--color-danger)]", className)}
      {...props}
    />
  )
}

export function Select({ className, error, children, ...props }) {
  return (
    <select
      className={cn(baseControl, "h-11 appearance-none", error && "border-[var(--color-danger)]", className)}
      {...props}
    >
      {children}
    </select>
  )
}

export function FieldError({ children }) {
  if (!children) return null
  return <p className="mt-1 text-xs text-[var(--color-danger)]">{children}</p>
}
