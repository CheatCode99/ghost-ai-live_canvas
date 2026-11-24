import { AlertCircle, Check, Loader2, Save } from "lucide-react"

import type { SaveStatus } from "@/hooks/use-canvas-autosave"

interface SaveStatusIndicatorProps {
  status: SaveStatus
  onSave: () => void
}

const STATUS_CONFIG = {
  idle: { icon: Save, label: "Save", className: "text-copy-muted", spin: false },
  saving: { icon: Loader2, label: "Saving…", className: "text-copy-muted", spin: true },
  saved: { icon: Check, label: "Saved", className: "text-success", spin: false },
  error: { icon: AlertCircle, label: "Save failed", className: "text-error", spin: false },
} satisfies Record<SaveStatus, { icon: typeof Save; label: string; className: string; spin: boolean }>

export function SaveStatusIndicator({ status, onSave }: SaveStatusIndicatorProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={status === "saving"}
      aria-label="Save canvas"
      className={`flex items-center gap-1.5 rounded-xl border border-surface-border-subtle bg-subtle px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-elevated disabled:cursor-not-allowed disabled:hover:bg-subtle ${config.className}`}
    >
      <Icon className={`h-3.5 w-3.5 ${config.spin ? "animate-spin" : ""}`} />
      {config.label}
    </button>
  )
}
