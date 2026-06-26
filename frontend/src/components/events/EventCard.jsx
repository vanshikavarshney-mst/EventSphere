import { Link } from "react-router-dom"
import { CalendarDays, MapPin, Armchair } from "lucide-react"
import { Badge } from "../ui/Misc"
import { formatDate, formatCurrency, resolveImageUrl } from "../../lib/utils"

const FALLBACK = "/images/event-placeholder.png"

export default function EventCard({ event }) {
  const img = resolveImageUrl(event.image || event.imageUrl) || FALLBACK
  console.log(event)
  const available = event.availableSeats ?? event.seatsAvailable
  const soldOut = typeof available === "number" && available <= 0

  return (
    <Link
      to={`/events/${event._id || event.id}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface-2)]">
        <img
          src={img || "/placeholder.svg"}
          alt={event.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {event.category && (
          <div className="absolute left-3 top-3">
            <Badge variant="accent">{event.category}</Badge>
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-[var(--color-danger)] px-4 py-1.5 text-sm font-semibold text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[var(--color-foreground)] text-balance">
          {event.title}
        </h3>

        <div className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            <span className="line-clamp-1">{event.location || event.venue || "TBA"}</span>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <span className="text-lg font-bold text-[var(--color-foreground)]">
            <p>
  Starting from{" "}
  {formatCurrency(
    Math.min(
      event?.seatPricing?.front || Infinity,
      event?.seatPricing?.middle || Infinity,
      event?.seatPricing?.back || Infinity
    )
  )}
</p>
          </span>
          {typeof available === "number" && !soldOut && (
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <Armchair className="h-4 w-4" />
              {available} left
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
