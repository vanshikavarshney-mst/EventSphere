import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

export const TOKEN_KEY = "eventsphere_token"

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
})

// Attach JWT to every request if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize errors and handle expired/invalid sessions
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // Token invalid or expired — clear it so the app can prompt re-login
      const hadToken = localStorage.getItem(TOKEN_KEY)
      localStorage.removeItem(TOKEN_KEY)
      if (hadToken && typeof window !== "undefined") {
        window.dispatchEvent(new Event("eventsphere:unauthorized"))
      }
    }
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again."
    return Promise.reject({ status, message, raw: error })
  },
)

export default client
