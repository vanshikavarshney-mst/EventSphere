import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const add = (p) => pages.push(p)
  const window = 1
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - window && p <= page + window)) {
      add(p)
    } else if (pages[pages.length - 1] !== "...") {
      add("...")
    }
  }

  const btn =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-[var(--color-border)] px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        className={btn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`gap-${i}`} className="px-1 text-[var(--color-muted)]">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              btn,
              p === page &&
                "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        className={btn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
