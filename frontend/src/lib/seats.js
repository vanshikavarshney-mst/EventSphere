// Normalize a variety of possible backend seat-map shapes into a consistent
// array of { id, label, row, number, price, status } and group them by row.
//
// Supported inputs:
//  - event.seats: [{ _id, seatNumber/label, row, status/isBooked, price }]
//  - event.seatMap: { rows: [{ row: "A", seats: [...] }] }
//  - event with rows/seatsPerRow numbers and a bookedSeats array (generated grid)

export function normalizeSeats(event) {
  if (!event) return []

  // Case 1: explicit array of seat objects
  const rawSeats = event.seats || event.seatMap?.seats
  if (Array.isArray(rawSeats) && rawSeats.length) {
    return rawSeats.map((s, i) => normalizeSeat(s, i, event))
  }

  // Case 2: seatMap with grouped rows
  if (Array.isArray(event.seatMap?.rows)) {
    const flat = []
    event.seatMap.rows.forEach((r) => {
      const rowLabel = r.row || r.name || r.label
      ;(r.seats || []).forEach((s, i) => flat.push(normalizeSeat({ row: rowLabel, ...s }, i, event)))
    })
    return flat
  }

  // Case 3: generate a grid from rows + seatsPerRow + bookedSeats
  const rows = event.rows || event.seatRows
  const perRow = event.seatsPerRow || event.columns
  if (rows && perRow) {
    const booked = new Set((event.bookedSeats || []).map(String))
    const grid = []
    for (let r = 0; r < rows; r++) {
      const rowLabel = String.fromCharCode(65 + r)
      for (let n = 1; n <= perRow; n++) {
        const id = `${rowLabel}${n}`
        grid.push({
          id,
          label: id,
          row: rowLabel,
          number: n,
          price: event.price,
          status: booked.has(id) ? "booked" : "available",
        })
      }
    }
    return grid
  }

  return []
}

function normalizeSeat(s, index, event) {
  const label = s.label || s.seatNumber || `${s.row || "A"}${s.number ?? s.seatNumber ?? index + 1}`
  const id = String(s.seatNumber || s.label || s._id || s.id || s.seatId || label)
  const row = s.row || s.section || (typeof label === "string" ? String(label).charAt(0) : "A")
  const number = s.number ?? s.seatNumber ?? s.col ?? index + 1
  let status = s.status

  if (!status) {
    if (s.isBooked || s.booked || s.reserved) status = "booked"
    else status = "available"
  }

  const normalizedStatus = String(status).toLowerCase()
  if (normalizedStatus === "reserved" || normalizedStatus === "booked") {
    status = "booked"
  } else if (normalizedStatus === "available") {
    status = "available"
  } else {
    status = "available"
  }

  return {
    id,
    label: String(label),
    row: String(row),
    number,
    category: s.category || event.category || "General",
    price: s.price ?? event.price,
    status,
  }
}

export function groupByRow(seats) {
  const map = new Map()
  seats.forEach((seat) => {
    if (!map.has(seat.row)) map.set(seat.row, [])
    map.get(seat.row).push(seat)
  })
  // sort seats within each row by number, and rows alphabetically
  const rows = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  return rows.map(([row, list]) => [
    row,
    list.sort((a, b) => Number(a.number) - Number(b.number)),
  ])
}
