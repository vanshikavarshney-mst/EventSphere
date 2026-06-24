import client from "./client"

export const eventsApi = {
  // params: { search, category, sort, page, limit }
  list: (params = {}) => client.get("/events", { params }).then((r) => r.data),
  get: (id) => client.get(`/events/${id}`).then((r) => r.data),

  // create/update accept multipart form data because of the `image` file field
  create: (formData) =>
    client
      .post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),

  update: (id, formData) =>
    client
      .put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),

  remove: (id) => client.delete(`/events/${id}`).then((r) => r.data),
}
