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
  frontPrice: "",
  middlePrice: "",
  backPrice: "",
  imageUrl: "",
  frontSeats: 20,
  middleSeats: 30,
backSeats: 50,
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
          frontPrice: e.frontPrice ?? "",
          middlePrice: e.middlePrice ?? "",
          backPrice: e.backPrice ?? "",
          imageUrl: e.image || "",
          frontSeats: e.frontSeats ?? 20,
          middleSeats: e.middleSeats ?? 30,
          backSeats: e.backSeats ?? 50,
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
    if (!form.frontPrice || Number(form.frontPrice) <= 0) {
            next.frontPrice = "Enter a valid front price."
          }

    if (!form.middlePrice || Number(form.middlePrice) <= 0) {
          next.middlePrice = "Enter a valid middle price."
}

    if (!form.backPrice || Number(form.backPrice) <= 0) {
          next.backPrice = "Enter a valid back price."
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
    fd.append("frontPrice", String(Number(form.frontPrice)))
    fd.append("middlePrice", String(Number(form.middlePrice)))
    fd.append("backPrice", String(Number(form.backPrice)))
    fd.append("image", form.imageUrl)
    fd.append("frontSeats", String(Number(form.frontSeats)))
fd.append("middleSeats", String(Number(form.middleSeats)))
fd.append("backSeats", String(Number(form.backSeats)))

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
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
  <div>
    <Label htmlFor="frontPrice">Front Price (₹)</Label>
    <Input
      id="frontPrice"
      type="number"
      min="1"
      value={form.frontPrice}
      onChange={update("frontPrice")}
      error={errors.frontPrice}
      placeholder="3000"
    />
    <FieldError>{errors.frontPrice}</FieldError>
  </div>

  <div>
    <Label htmlFor="middlePrice">Middle Price (₹)</Label>
    <Input
      id="middlePrice"
      type="number"
      min="1"
      value={form.middlePrice}
      onChange={update("middlePrice")}
      error={errors.middlePrice}
      placeholder="2000"
    />
    <FieldError>{errors.middlePrice}</FieldError>
  </div>

  <div>
    <Label htmlFor="backPrice">Back Price (₹)</Label>
    <Input
      id="backPrice"
      type="number"
      min="1"
      value={form.backPrice}
      onChange={update("backPrice")}
      error={errors.backPrice}
      placeholder="1000"
    />
    <FieldError>{errors.backPrice}</FieldError>
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

        {/* <div className="grid gap-5 sm:grid-cols-2">
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
        </div> */}
        <div className="grid gap-5 sm:grid-cols-3">
  <div>
    <Label htmlFor="frontSeats">Front Seats</Label>
    <Input
      id="frontSeats"
      type="number"
      min="1"
      value={form.frontSeats}
      onChange={update("frontSeats")}
      disabled={isEdit}
    />
  </div>

  <div>
    <Label htmlFor="middleSeats">Middle Seats</Label>
    <Input
      id="middleSeats"
      type="number"
      min="1"
      onChange={update("middleSeats")}
      value={form.middleSeats}
      disabled={isEdit}
    />
  </div>

  <div>
  <Label>Back Seats</Label>

  <Input
    id="backSeats"
    type="number"
    min="1"
    value={form.backSeats}
    onChange={update("backSeats")}
    disabled={isEdit}
  />

  {isEdit && (
    <p className="mt-1 text-xs text-gray-500">
      Seat layout cannot be changed once the event is created.
    </p>
  )}
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
