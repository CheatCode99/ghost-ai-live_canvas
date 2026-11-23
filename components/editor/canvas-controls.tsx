"use client"

import { Maximize, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react"

interface CanvasControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

const BUTTON_CLASS_NAME =
  "flex h-9 w-9 items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary disabled:pointer-events-none disabled:opacity-40 disabled:hover:bg-transparent"

export function CanvasControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: CanvasControlsProps) {
  return (
    <div className="absolute bottom-24 left-6 z-10 flex items-center gap-1 rounded-full border border-surface-border bg-surface/90 p-2 shadow-lg backdrop-blur">
      <button type="button" title="Zoom in" aria-label="Zoom in" onClick={onZoomIn} className={BUTTON_CLASS_NAME}>
        <ZoomIn className="h-4 w-4" />
      </button>
      <button type="button" title="Zoom out" aria-label="Zoom out" onClick={onZoomOut} className={BUTTON_CLASS_NAME}>
        <ZoomOut className="h-4 w-4" />
      </button>
      <button type="button" title="Fit view" aria-label="Fit view" onClick={onFitView} className={BUTTON_CLASS_NAME}>
        <Maximize className="h-4 w-4" />
      </button>

      <div className="mx-1 h-5 w-px bg-surface-border-subtle" aria-hidden />

      <button
        type="button"
        title="Undo"
        aria-label="Undo"
        onClick={onUndo}
        disabled={!canUndo}
        className={BUTTON_CLASS_NAME}
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Redo"
        aria-label="Redo"
        onClick={onRedo}
        disabled={!canRedo}
        className={BUTTON_CLASS_NAME}
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  )
}
