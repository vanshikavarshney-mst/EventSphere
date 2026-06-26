import { createContext, useCallback, useContext, useState } from "react"
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react"

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, type = "info", duration = 3800) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration) {
        setTimeout(() => remove(id), duration)
      }
      return id
    },
    [remove],
  )

  const toast = {
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-20 right-5 z-[100] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  const config = {
    success: { Icon: CheckCircle2, color: "text-[var(--color-success)]" },
    error: { Icon: AlertTriangle, color: "text-[var(--color-danger)]" },
    info: { Icon: Info, color: "text-[var(--color-primary)]" },
  }[toast.type]
  const { Icon, color } = config

  return (
    <div className="animate-fade-up flex items-start gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 shadow-2xl">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
      <p className="flex-1 text-sm leading-relaxed text-[var(--color-foreground)]">{toast.message}</p>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}
