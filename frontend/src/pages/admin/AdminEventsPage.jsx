import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Pencil, Trash2, CalendarDays, MapPin, LayoutDashboard, User } from "lucide-react"
import { eventsApi } from "../../api/events"
import { useToast } from "../../context/ToastContext"
import Button from "../../components/ui/Button"
import Modal from "../../components/ui/Modal"
import { Badge, EmptyState, PageLoader } from "../../components/ui/Misc"
import { formatCurrency, formatDate, resolveImageUrl } from "../../lib/utils"

const FALLBACK = "/images/event-placeholder.png"

export default function AdminEventsPage() {
  const toast = useToast()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    eventsApi
      .list({ limit: 100, sort: "date" })
      .then((data) => setEvents(data.events || data.data || data.results || []))
      .catch((err) => setError(err.message || "Failed to load events."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const confirmDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await eventsApi.remove(toDelete._id || toDelete.id)
      setEvents((prev) => prev.filter((e) => (e._id || e.id) !== (toDelete._id || toDelete.id)))
      toast.success("Event deleted.")
      setToDelete(null)
    } catch (err) {
      toast.error(err.message || "Could not delete event.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <PageLoader label="Loading events..." />

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 text-sm text-[var(--color-primary)]">
            <LayoutDashboard className="h-4 w-4" />
            Admin
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">Manage events</h1>
          <p className="mt-1.5 text-[var(--color-muted)]">
            Create, edit, and remove events on EventSphere.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button as={Link} to="/admin/events/new">
            <Plus className="h-4 w-4" />
            New event
          </Button>
          <Button as={Link} to="/admin/users/new" variant="secondary">
            <User className="h-4 w-4" />
            New admin
          </Button>
        </div>
      </header>

      {error ? (
        <EmptyState icon={CalendarDays} title="Couldn't load events" description={error} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Create your first event to get started."
          action={
            <Button as={Link} to="/admin/events/new" size="sm">
              <Plus className="h-4 w-4" /> New event
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                 
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => {
                  const id = e._id || e.id
                  const img = resolveImageUrl(e.image || e.imageUrl) || FALLBACK
                  return (
                    <tr
                      key={id}
                      className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)]/40"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={img || "/placeholder.svg"}
                            alt=""
                            onError={(ev) => (ev.currentTarget.src = FALLBACK)}
                            className="h-11 w-16 shrink-0 rounded-md object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-[var(--color-foreground)]">
                              {e.title}
                            </p>
                            {e.category && (
                              <Badge variant="primary" className="mt-1">
                                {e.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[var(--color-muted)]">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(e.date)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[var(--color-muted)]">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{e.location || e.venue || "TBA"}</span>
                        </span>
                      </td>
                      
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            as={Link}
                            to={`/admin/events/${id}/edit`}
                            variant="outline"
                            size="sm"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Edit</span>
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => setToDelete(e)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!toDelete} onClose={() => !deleting && setToDelete(null)} title="Delete event?">
        <p className="text-sm leading-relaxed text-[var(--color-muted)]">
          This will permanently delete{" "}
          <span className="font-medium text-[var(--color-foreground)]">{toDelete?.title}</span> and
          all associated seat data. This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setToDelete(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={confirmDelete} loading={deleting}>
            Delete event
          </Button>
        </div>
      </Modal>
    </div>
  )
}
