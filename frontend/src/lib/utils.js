export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function formatCurrency(value) {
  const num = Number(value || 0)
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num)
}

export function formatDate(value, opts = {}) {
  if (!value) return "TBA"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "TBA"
  return date.toLocaleDateString("en-US", {
    weekday: opts.weekday ? "long" : undefined,
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(value) {
  if (!value) return "TBA"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "TBA"
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

// Resolve an image path that may be relative to the API server
export function resolveImageUrl(path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/?$/, "")
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`
}

// Convert Unsplash photo page URL to direct image URL
export function convertUnsplashUrl(url) {
  if (!url) return ""
  
  // Match Unsplash photo page URL format: https://unsplash.com/photos/<id>
  const match = url.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/)
  if (match && match[1]) {
    // Return direct image URL using Unsplash's source service
    return `https://source.unsplash.com/${match[1]}/1920x1080`
  }
  
  // If not an Unsplash URL, return as-is
  return url
}
