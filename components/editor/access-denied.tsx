import { Lock } from "lucide-react"
import Link from "next/link"

export function AccessDenied() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-base px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-dim">
        <Lock className="h-6 w-6 text-brand" />
      </div>
      <h1 className="text-xl font-medium text-copy-primary">Access denied</h1>
      <p className="max-w-sm text-sm text-copy-muted">
        You don&apos;t have access to this project, or it doesn&apos;t exist.
      </p>
      <Link
        href="/editor"
        className="text-sm font-medium text-brand hover:underline"
      >
        Back to projects
      </Link>
    </div>
  )
}
