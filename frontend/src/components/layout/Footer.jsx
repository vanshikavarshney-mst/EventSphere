import { Ticket } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-[var(--color-muted)] sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
            <Ticket className="h-4 w-4" />
          </span>
          <span className="font-medium text-[var(--color-foreground)]">EventSphere</span>
        </div>
        <p>{`\u00A9 ${new Date().getFullYear()} EventSphere. Discover. Book. Experience.`}</p>
      </div>
    </footer>
  )
}
