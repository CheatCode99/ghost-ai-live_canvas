import { useEffect, useRef, useState } from "react"

import type { CanvasEdge, CanvasNode } from "@/types/canvas"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

interface UseCanvasAutosaveOptions {
  projectId: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  enabled: boolean
  // Incremented by the caller (e.g. a manual "Save" button) to force an
  // immediate save outside the debounce, without changing how autosave
  // itself behaves.
  manualSaveToken?: number
}

const AUTOSAVE_DEBOUNCE_MS = 1500

export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
  enabled,
  manualSaveToken = 0,
}: UseCanvasAutosaveOptions): SaveStatus {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRun = useRef(true)
  const lastManualSaveToken = useRef(manualSaveToken)

  const saveNow = () => {
    setStatus("saving")

    fetch(`/api/projects/${projectId}/canvas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes, edges }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save canvas")
        setStatus("saved")
      })
      .catch(() => {
        setStatus("error")
      })
  }

  useEffect(() => {
    if (!enabled) return

    // Skip the save triggered by the autosave hook turning on (e.g. right
    // after the initial load check resolves) so we don't immediately
    // re-upload the canvas we just loaded.
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(saveNow, AUTOSAVE_DEBOUNCE_MS)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, nodes, edges, enabled])

  // Manual save: bypasses the debounce entirely and saves immediately with
  // whatever nodes/edges are current. Guarded so it only fires on an actual
  // token change (a real button click), never on re-render.
  useEffect(() => {
    if (manualSaveToken === lastManualSaveToken.current) return
    lastManualSaveToken.current = manualSaveToken
    if (!enabled) return

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
    // Scheduled rather than called directly so `setStatus` never runs
    // synchronously inside the effect body itself.
    debounceTimeout.current = setTimeout(saveNow, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualSaveToken, enabled])

  return status
}
