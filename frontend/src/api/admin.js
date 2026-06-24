import client from "./client"

export const adminApi = {
  createAdminUser: (payload) =>
    client.post("/admin/users", payload).then((r) => r.data),
}
