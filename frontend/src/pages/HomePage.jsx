import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Search, Ticket, ShieldCheck, Armchair } from "lucide-react"
import { eventsApi } from "../api/events"
import EventCard from "../components/events/EventCard"
import Button from "../components/ui/Button"
import { Spinner } from "../components/ui/Misc"

export default function HomePage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    eventsApi
      .list({ limit: 6, sort: "date" })
      .then((data) => {
        if (!active) return
        setEvents(data.events || data.data || data.results || [])
      })
      .catch(() => active && setEvents([]))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <div className="absolute inset-0">
          
         <div className="absolute inset-0 bg-[var(--color-surface-2)]" />
        </div>

        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-1.5 text-sm text-[var(--color-muted)]">
            <Ticket className="h-4 w-4 text-[var(--color-primary)]" />
            Live events, concerts, and experiences
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Find your next unforgettable experience
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-[var(--color-muted)]">
            Discover events near you, pick the perfect seats on an interactive map, and book your
            tickets in seconds with EventSphere.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to="/events" size="lg">
              <Search className="h-5 w-5" />
              Browse Events
            </Button>
            <Button as={Link} to="/register" size="lg" variant="outline">
              Create Account
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Upcoming events</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Fresh experiences happening soon</p>
          </div>
          <Button as={Link} to="/events" variant="ghost" size="sm">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-7 w-7" />
          </div>
        ) : events.length === 0 ? (
          <p className="rounded-[var(--radius)] border border-dashed border-[var(--color-border)] py-12 text-center text-sm text-[var(--color-muted)]">
            No events available yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
