import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

export default function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose?.()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "animate-fade-up relative z-10 w-full max-w-lg rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl",
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
