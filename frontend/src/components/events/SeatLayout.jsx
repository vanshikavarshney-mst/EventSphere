import { useMemo } from "react"

export default function SeatLayout({ seats = [], selected = [], onToggle }) {
  const selectedSet = useMemo(() => new Set(selected), [selected])

  const rows = useMemo(() => {
    const map = new Map()
    seats.forEach((seat) => {
      if (!map.has(seat.row)) map.set(seat.row, [])
      map.get(seat.row).push(seat)
    })
    return [...map.entries()]
      .map(([row, rowSeats]) => [
        row,
        rowSeats.sort((a, b) => Number(a.number) - Number(b.number)),
      ])
      .sort((a, b) => a[0].localeCompare(b[0]))
  }, [seats])

  const getColor = (seat) => {
    if (seat.status !== "available") return "#ef4444"
    if (selectedSet.has(seat.id)) return "#2563eb"
    return "#22c55e"
  }

  return (
    <div className="grid gap-4">
      {rows.map(([row, rowSeats]) => (
        <div key={row}>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)]">
            {row}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(38px,1fr))] gap-2">
            {rowSeats.map((seat) => (
              <button
                key={seat.id}
                type="button"
                disabled={seat.status !== "available"}
                onClick={() => onToggle(seat)}
                aria-label={`Seat ${seat.label}${seat.status !== "available" ? " (booked)" : selectedSet.has(seat.id) ? " (selected)" : " (available)"}`}
                aria-pressed={selectedSet.has(seat.id)}
                className="h-10 rounded-md border px-1 text-[11px] font-semibold transition-all"
                style={{
                  backgroundColor: getColor(seat),
                  color: seat.status !== "available" || selectedSet.has(seat.id) ? "#fff" : "#000",
                  borderColor: seat.status !== "available" ? "#d1d5db" : selectedSet.has(seat.id) ? "#2563eb" : "#9ca3af",
                  cursor: seat.status !== "available" ? "not-allowed" : "pointer",
                }}
              >
                {seat.number}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-[var(--color-muted)]">
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-green-400/20 border border-green-400" />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-blue-500 border border-blue-500" />
          Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-red-500/20 border border-red-500" />
          Booked
        </span>
      </div>
    </div>
  )
}