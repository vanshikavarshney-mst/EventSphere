import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

const variants = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]",
  accent:
"bg-[var(--color-accent)] text-white hover:opacity-90",
  outline:
    "border border-[var(--color-border)] bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface-2)]",
  ghost: "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface-2)]",
  danger: "bg-[var(--color-danger)] text-white hover:brightness-110",
}

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
}

export default function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) {
  return (
    <Comp
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  )
}
