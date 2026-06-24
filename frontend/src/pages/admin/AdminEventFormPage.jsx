import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ImagePlus, X } from "lucide-react"
import { eventsApi } from "../../api/events"
import { useToast } from "../../context/ToastContext"
import Button from "../../components/ui/Button"
import { Label, Input, Textarea, Select, FieldError } from "../../components/ui/Field"
import { PageLoader } from "../../components/ui/Misc"
import { resolveImageUrl, convertUnsplashUrl } from "../../lib/utils"

const CATEGORIES = ["Music", "Sports", "Theatre", "Conference", "Comedy", "Festival", "Other"]

const emptyForm = {
  title: "",
  description: "",
  category: "Music",
  date: "",
  location: "",
  price: "",
  imageUrl: "",
  rows: "",
  seatsPerRow: "",
}


// Convert an ISO date to the value format expected by <input type="datetime-local">
function toLocalInput(value) {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}

export default function AdminEventFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()
  const fileRef = useRef(null)

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    let active = true
    eventsApi
      .get(id)
      .then((data) => {
        if (!active) return
        const e = data.data || data.event || data
        setForm({
          title: e.title || "",
          description: e.description || "",
          category: e.category || "Music",
          date: toLocalInput(e.date),
          location: e.location || e.venue || "",
          price: e.price ?? "",
          imageUrl: e.image || "",
          rows: e.rows ?? "",
          seatsPerRow: e.seatsPerRow ?? "",
})
        setExistingImage(resolveImageUrl(e.image || e.imageUrl))
      })
      .catch((err) => toast.error(err.message || "Failed to load event."))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, isEdit, toast])

  const update = (key) => (e) => {
    const value = e.target.value
    // Auto-convert Unsplash URLs to direct image URLs
    if (key === "imageUrl") {
      setForm((f) => ({ ...f, [key]: convertUnsplashUrl(value) }))
    } else {
      setForm((f) => ({ ...f, [key]: value }))
    }
  }

  const onPickImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.")
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = "Title is required."
    if (!form.date) next.date = "Date is required."
    if (!form.location.trim()) next.location = "Location is required."
    if (form.price === "" || Number(form.price) < 0) next.price = "Enter a valid price."
    if (!isEdit) {
      if (!form.rows || Number(form.rows) < 1) next.rows = "Rows must be at least 1."
      if (!form.seatsPerRow || Number(form.seatsPerRow) < 1)
        next.seatsPerRow = "Seats per row must be at least 1."
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const fd = new FormData()
    fd.append("title", form.title.trim())
    fd.append("description", form.description.trim())
    fd.append("category", form.category)
    fd.append("date", new Date(form.date).toISOString())
    fd.append("venue", form.location.trim())
    fd.append("price", String(Number(form.price)))
    fd.append("image", form.imageUrl)
    if (form.rows !== "") fd.append("rows", String(Number(form.rows)))
    if (form.seatsPerRow !== "") fd.append("seatsPerRow", String(Number(form.seatsPerRow)))
    if (imageFile) fd.append("image", imageFile)

    try {
      if (isEdit) {
        await eventsApi.update(id, fd)
        toast.success("Event updated.")
      } else {
        await eventsApi.create(fd)
        toast.success("Event created.")
      }
      navigate("/admin/events")
    } catch (err) {
      toast.error(err.message || "Could not save event.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader label="Loading event..." />

  const preview = imagePreview || existingImage

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/admin/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight">
        {isEdit ? "Edit event" : "Create event"}
      </h1>
      <p className="mt-1.5 text-[var(--color-muted)]">
        {isEdit
          ? "Update the details for this event."
          : "Fill in the details to publish a new event."}
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 flex flex-col gap-5 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
        noValidate
      >
        {/* Image */}
        {/* <div>
          <Label>Event image</Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="hidden"
            id="event-image"
          />
          {preview ? (
            <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--color-border)]">
              <img src={preview || "/placeholder.svg"} alt="Event preview" className="aspect-[16/9] w-full object-cover" />
              <div className="absolute right-3 top-3 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  Change
                </Button>
                {imagePreview && (
                  <Button type="button" variant="danger" size="sm" onClick={clearImage}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-[var(--radius)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]/40 text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-foreground)]"
            >
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">Click to upload an image</span>
            </button>
          )}
        </div> */}
        <div>
  <Label htmlFor="imageUrl">Image URL</Label>

  <Input
    id="imageUrl"
    value={form.imageUrl}
    onChange={update("imageUrl")}
    placeholder="Paste Unsplash URL or direct image URL..."
  />

  {form.imageUrl && (
    <img
      src={form.imageUrl}
      alt="preview"
      className="mt-3 h-48 w-full rounded border object-cover"
      onError={() => console.error("Image failed to load:", form.imageUrl)}
    />
  )}
</div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={form.title} onChange={update("title")} error={errors.title} />
          <FieldError>{errors.title}</FieldError>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={update("description")}
            placeholder="Tell attendees what to expect..."
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={form.category} onChange={update("category")}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price per seat (INR)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={update("price")}
              error={errors.price}
            />
            <FieldError>{errors.price}</FieldError>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="date">Date & time</Label>
            <Input
              id="date"
              type="datetime-local"
              value={form.date}
              onChange={update("date")}
              error={errors.date}
            />
            <FieldError>{errors.date}</FieldError>
          </div>
          <div>
            <Label htmlFor="location">Location / venue</Label>
            <Input
              id="location"
              value={form.location}
              onChange={update("location")}
              error={errors.location}
            />
            <FieldError>{errors.location}</FieldError>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              value={form.rows}
              onChange={update("rows")}
              error={errors.rows}
              disabled={isEdit}
            />
            <FieldError>{errors.rows}</FieldError>
            {isEdit && (
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Seat layout can't be changed after creation.
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="seatsPerRow">Seats per row</Label>
            <Input
              id="seatsPerRow"
              type="number"
              min="1"
              value={form.seatsPerRow}
              onChange={update("seatsPerRow")}
              error={errors.seatsPerRow}
              disabled={isEdit}
            />
            <FieldError>{errors.seatsPerRow}</FieldError>
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <Button
            as={Link}
            to="/admin/events"
            variant="outline"
            className="flex-1"
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={submitting}>
            {isEdit ? "Save changes" : "Create event"}
          </Button>
        </div>
      </form>
    </div>
  )
}
