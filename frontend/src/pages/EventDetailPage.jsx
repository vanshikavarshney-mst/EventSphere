import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  CalendarDays,
  MapPin,
  Clock,
  Armchair,
  ArrowLeft,
  Ticket,
  Tag,
} from "lucide-react"
import { eventsApi } from "../api/events"
import { bookingsApi } from "../api/bookings"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import SeatLayout from "../components/events/SeatLayout"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import { Badge, EmptyState, PageLoader } from "../components/ui/Misc"
import { normalizeSeats } from "../lib/seats"
import { formatCurrency, formatDateTime, resolveImageUrl } from "../lib/utils"

const FALLBACK = "/images/event-placeholder.png"

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { isAuthenticated, isAdmin } = useAuth()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [booking, setBooking] = useState(false)

  const loadEvent = () => {
    setLoading(true)
    setError("")
    eventsApi
      .get(id)
      .then((data) => setEvent(data.data || data.event || data))
      .catch((err) => setError(err.message || "Event not found."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    eventsApi
      .get(id)
      .then((data) => active && setEvent(data.data || data.event || data))
      .catch((err) => active && setError(err.message || "Event not found."))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  const seats = useMemo(() => normalizeSeats(event), [event])
  const seatById = useMemo(() => {
    const m = new Map()
    seats.forEach((s) => m.set(s.id, s))
    return m
  }, [seats])

  const selectedSeats = selected.map((sid) => seatById.get(sid)).filter(Boolean)
  const totalPrice = selectedSeats.reduce((sum, s) => sum + Number(s.price || event?.price || 0), 0)
  const availableCount = seats.filter((s) => s.status === "available").length

  const toggleSeat = (seat) => {
    if (isAdmin || seat.status === "booked") return
    setSelected((prev) =>
      prev.includes(seat.id) ? prev.filter((x) => x !== seat.id) : [...prev, seat.id],
    )
  }

  const startBooking = () => {
  if (!isAuthenticated) {
    navigate("/login", {
      state: { from: { pathname: `/events/${id}` } },
    })
    return
  }

  if (isAdmin) {
    toast.info("Admins can view events, but only regular users can book tickets.")
    return
  }

  if (selected.length === 0) {
    toast.info("Select at least one seat to continue.")
    return
  }

  setConfirmOpen(true)
}

  const confirmBooking = async () => {
  setBooking(true)

  try {
    await bookingsApi.create({
      eventId: event._id,
      seats: selectedSeats.map((s) => s.label),
    })

    toast.success("Booking successful!")

    setConfirmOpen(false)
    setSelected([])

    loadEvent() // 🔥 refresh seats (VERY IMPORTANT)
    navigate("/bookings")
  } catch (err) {
    toast.error(err.message || "Booking failed")
  } finally {
    setBooking(false)
  }
}

  if (loading) return <PageLoader label="Loading event..." />

  if (error || !event) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          icon={Ticket}
          title="Event not found"
          description={error || "This event may have been removed."}
          action={
            <Button as={Link} to="/events" variant="outline" size="sm">
              Back to events
            </Button>
          }
        />
      </div>
    )
  }

  const img = resolveImageUrl(event.image || event.imageUrl) || FALLBACK

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </Link>

      {/* Hero */}
      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="relative aspect-[21/9] w-full bg-[var(--color-surface-2)]">
          <img
            src={img || "/placeholder.svg"}
            alt={event.title}
            onError={(e) => (e.currentTarget.src = FALLBACK)}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
          {event.category && (
            <div className="absolute left-4 top-4">
              <Badge variant="accent">{event.category}</Badge>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {event.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[var(--color-muted)]">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[var(--color-primary)]" />
              {formatDateTime(event.date)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--color-primary)]" />
              {event.location || event.venue || "TBA"}
            </span>
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-[var(--color-primary)]" />
              {formatCurrency(event.price)} per seat
            </span>
            <span className="flex items-center gap-2">
              <Armchair className="h-4 w-4 text-[var(--color-primary)]" />
              {availableCount} seats available
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left: description + seat map */}
        <div className="flex flex-col gap-8">
          {event.description && (
            <section>
    <h2 className="mb-3 text-xl font-semibold">About this event</h2>
    <h3 className="text-sm font-medium text-[var(--color-muted)] leading-relaxed">
      {event.description}
    </h3>
  </section>
          )}

          <section className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
  <h2 className="mb-1 text-xl font-semibold">Select your seats</h2>

  <p className="mb-4 text-sm text-[var(--color-muted)]">
    Tap an available seat to add it to your order.
  </p>

  {/* Category Pricing */}
  <div className="mb-6 flex flex-wrap gap-4 text-sm">
    <span className="rounded-full bg-green-100 px-3 py-1">
      Front ₹{event?.seatPricing?.front}
    </span>

    <span className="rounded-full bg-blue-100 px-3 py-1">
      Middle ₹{event?.seatPricing?.middle}
    </span>

    <span className="rounded-full bg-yellow-100 px-3 py-1">
      Back ₹{event?.seatPricing?.back}
    </span>
  </div>
  <div className="mb-8">
  <div className="mx-auto w-3/4 rounded-lg bg-slate-300 py-3 text-center font-semibold tracking-widest">
    SCREEN
  </div>
</div>
  <SeatLayout
    seats={seats}
    selected={selected}
    onToggle={toggleSeat}
    readOnly={isAdmin}
  />
</section>
        </div>

        {/* Right: order summary (sticky) */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-semibold">Your order</h2>

            {selectedSeats.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--color-muted)]">
                No seats selected yet. Pick seats from the map to get started.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2">
                {selectedSeats.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)] px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Armchair className="h-4 w-4 text-[var(--color-accent)]" />
                      <div>
  <div>Seat {s.label}</div>
  <div className="text-xs text-[var(--color-muted)]">
    {s.category}
  </div>
</div>
                    </span>
                    <span className="font-medium">{formatCurrency(s.price || event.price)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <span className="text-sm text-[var(--color-muted)]">
                {selectedSeats.length} seat{selectedSeats.length === 1 ? "" : "s"}
              </span>
              <span className="text-xl font-semibold">{formatCurrency(totalPrice)}</span>
            </div>

            <Button
  onClick={startBooking}
  className="mt-5 w-full"
  disabled={availableCount === 0 || isAdmin}
>
  <Ticket className="h-4 w-4" />
  {availableCount === 0 ? "Sold out" : isAdmin ? "Admin view only" : "Book Now"}
</Button>

            {isAdmin && (
              <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
                Admin accounts can view events but cannot place bookings.
              </p>
            )}

            {!isAuthenticated && (
              <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
                You'll need to log in to complete your booking.
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Confirmation modal */}
      <Modal open={confirmOpen} onClose={() => !booking && setConfirmOpen(false)} title="Confirm booking">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            {"You're about to book the following seats for "}
            <span className="font-medium text-[var(--color-foreground)]">{event.title}</span>:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((s) => (
              <Badge key={s.id} variant="accent">
                {s.label}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)] px-4 py-3">
            <span className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
              <Clock className="h-4 w-4" />
              {formatDateTime(event.date)}
            </span>
            <span className="text-lg font-semibold">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="mt-2 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmOpen(false)}
              disabled={booking}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={confirmBooking} loading={booking}>
              Confirm & Pay
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
