import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, SlidersHorizontal, CalendarSearch, X } from "lucide-react"
import { eventsApi } from "../api/events"
import EventCard from "../components/events/EventCard"
import Pagination from "../components/events/Pagination"
import { Input, Select } from "../components/ui/Field"
import { EmptyState, Spinner } from "../components/ui/Misc"
import Button from "../components/ui/Button"
import { useDebounce } from "../hooks/useDebounce"

const CATEGORIES = ["All", "Music", "Sports", "Theatre", "Conference", "Comedy", "Festival", "Other"]
const SORTS = [
  { value: "date", label: "Date: Soonest" },
  { value: "-date", label: "Date: Latest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "title", label: "Name: A to Z" },
]
const LIMIT = 9

export default function EventsPage() {
  const [params, setParams] = useSearchParams()

  const [search, setSearch] = useState(params.get("search") || "")
  const [category, setCategory] = useState(params.get("category") || "All")
  const [sort, setSort] = useState(params.get("sort") || "date")
  const [page, setPage] = useState(Number(params.get("page")) || 1)

  const [events, setEvents] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const debouncedSearch = useDebounce(search, 450)

  // Keep URL in sync with filters
  useEffect(() => {
    const next = {}
    if (debouncedSearch) next.search = debouncedSearch
    if (category && category !== "All") next.category = category
    if (sort && sort !== "date") next.sort = sort
    if (page > 1) next.page = String(page)
    setParams(next, { replace: true })
  }, [debouncedSearch, category, sort, page, setParams])

  // Reset to page 1 when filters (not page) change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category, sort])

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: category !== "All" ? category : undefined,
      sort,
      page,
      limit: LIMIT,
    }),
    [debouncedSearch, category, sort, page],
  )

  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    eventsApi
      .list(query)
      .then((data) => {
        if (!active) return
        const list = Array.isArray(data?.events)
          ? data.events
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.results)
              ? data.results
              : []
        const meta = data?.meta || {}
        const tp =
          data?.totalPages ??
          meta?.totalPages ??
          (meta?.total && meta?.limit ? Math.ceil(meta.total / meta.limit) : null) ??
          (data?.total && data?.limit ? Math.ceil(data.total / data.limit) : null) ??
          (data?.total ? Math.ceil(data.total / LIMIT) : 1)

        setEvents(list)
        setTotalPages(tp || 1)
        setTotal(meta?.total ?? data?.total ?? list.length)
      })
      .catch((err) => {
        if (!active) return
        setError(err.message || "Failed to load events.")
        setEvents([])
        setTotalPages(1)
        setTotal(0)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [query])

  const clearFilters = () => {
    setSearch("")
    setCategory("All")
    setSort("date")
    setPage(1)
  }

  const hasFilters = search || category !== "All" || sort !== "date"

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Explore events</h1>
        <p className="mt-1.5 text-[var(--color-muted)]">
          {loading ? "Searching..." : `${total} event${total === 1 ? "" : "s"} to discover`}
        </p>
      </header>

      {/* Filter bar */}
      <div className="mb-8 flex flex-col gap-3 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <Input
            placeholder="Search events by name, venue, or keyword..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search events"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="hidden h-4 w-4 text-[var(--color-muted)] sm:block" />
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              className="min-w-36"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort events"
            className="min-w-44"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <EmptyState
          icon={CalendarSearch}
          title="Couldn't load events"
          description={error}
          action={
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p)}>
              Try again
            </Button>
          }
        />
      ) : events.length === 0 ? (
        <EmptyState
          icon={CalendarSearch}
          title="No events found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            hasFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id || event.id} event={event} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
