import { Link } from "react-router-dom"
import Button from "../components/ui/Button"

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        This page took an intermission
      </h1>
      <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back to the
        show.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button as={Link} to="/">
          Back home
        </Button>
        <Button as={Link} to="/events" variant="outline">
          Browse events
        </Button>
      </div>
    </div>
  )
}
