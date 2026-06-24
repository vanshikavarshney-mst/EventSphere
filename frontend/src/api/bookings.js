import client from "./client"

export const bookingsApi = {
  // payload: { eventId, seats: [seatId, ...] }
  create: (payload) => client.post("/bookings", payload).then((r) => r.data),
  my: () => client.get("/bookings/my").then((r) => r.data),
  cancel: (id) => client.delete(`/bookings/${id}`).then((r) => r.data),
}
