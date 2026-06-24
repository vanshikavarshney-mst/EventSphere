import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CalendarDays, MapPin, Armchair, Ticket, Trash2 } from "lucide-react"
import { bookingsApi } from "../api/bookings"
import { useToast } from "../context/ToastContext"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import { Badge, EmptyState, PageLoader } from "../components/ui/Misc"
import { formatCurrency, formatDateTime, resolveImageUrl } from "../lib/utils"

const FALLBACK = "/images/event-placeholder.png"

export default function MyBookingsPage() {
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [toCancel, setToCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    let active = true
    bookingsApi
      .my()
      .then((data) => {
        if (!active) return
        setBookings(data.bookings || data.data || data || [])
      })
      .catch((err) => active && setError(err.message || "Failed to load bookings."))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const confirmCancel = async () => {
    if (!toCancel) return
    setCancelling(true)
    try {
      await bookingsApi.cancel(toCancel._id || toCancel.id)
      setBookings((prev) =>
        prev.filter((b) => (b._id || b.id) !== (toCancel._id || toCancel.id)),
      )
      toast.success("Booking cancelled and seats released.")
      setToCancel(null)
    } catch (err) {
      toast.error(err.message || "Could not cancel booking.")
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <PageLoader label="Loading your bookings..." />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">My bookings</h1>
        <p className="mt-1.5 text-[var(--color-muted)]">
          Manage the events you've booked and cancel if your plans change.
        </p>
      </header>

      {error ? (
        <EmptyState icon={Ticket} title="Something went wrong" description={error} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No bookings yet"
          description="When you book an event, your tickets will show up here."
          action={
            <Button as={Link} to="/events" size="sm">
              Browse events
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => {
            const event = b.event || b.eventId || {}
            const seats = b.seats || b.seatNumbers || []
            const seatLabels = seats.map((s) => (typeof s === "object" ? s.label || s.seatNumber : s))
            const img = resolveImageUrl(event.image || event.imageUrl) || FALLBACK
            const total =
              b.totalPrice ??
              b.total ??
              (seatLabels.length && event.price ? seatLabels.length * event.price : null)
            const eventId = event._id || event.id || b.eventId

            return (
              <article
                key={b._id || b.id}
                className="flex flex-col gap-4 overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] sm:flex-row"
              >
                <div className="h-40 w-full shrink-0 bg-[var(--color-surface-2)] sm:h-auto sm:w-48">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={event.title || "Event"}
                    onError={(e) => (e.currentTarget.src = FALLBACK)}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold leading-snug">
                        {eventId ? (
                          <Link
                            to={`/events/${eventId}`}
                            className="transition-colors hover:text-[var(--color-primary)]"
                          >
                            {event.title || "Event"}
                          </Link>
                        ) : (
                          event.title || "Event"
                        )}
                      </h2>
                      {b.status && (
                        <Badge
                          variant={b.status === "cancelled" ? "danger" : "success"}
                          className="mt-1"
                        >
                          {b.status}
                        </Badge>
                      )}
                    </div>
                    {total != null && (
                      <span className="text-right text-lg font-semibold">
                        {formatCurrency(total)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-muted)]">
                    {event.date && (
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[var(--color-primary)]" />
                        {formatDateTime(event.date)}
                      </span>
                    )}
                    {(event.location || event.venue) && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
                        {event.location || event.venue}
                      </span>
                    )}
                  </div>

                  {seatLabels.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                        <Armchair className="h-4 w-4" /> Seats:
                      </span>
                      {seatLabels.map((s, i) => (
                        <Badge key={`${s}-${i}`} variant="primary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex justify-end pt-2">
                    <Button variant="danger" size="sm" onClick={() => setToCancel(b)}>
                      <Trash2 className="h-4 w-4" />
                      Cancel booking
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal
        open={!!toCancel}
        onClose={() => !cancelling && setToCancel(null)}
        title="Cancel this booking?"
      >
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          This will cancel your booking for{" "}
          <span className="font-medium text-[var(--color-foreground)]">
            {toCancel?.event?.title || toCancel?.eventId?.title || "this event"}
          </span>{" "}
          and release the seats back to the pool. This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setToCancel(null)}
            disabled={cancelling}
          >
            Keep booking
          </Button>
          <Button variant="danger" className="flex-1" onClick={confirmCancel} loading={cancelling}>
            Yes, cancel
          </Button>
        </div>
      </Modal>
    </div>
  )
}
