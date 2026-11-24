"use client"

import { createContext, useCallback, useContext, useEffect, useRef } from "react"
import type { ChangeEvent, KeyboardEvent } from "react"

import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from "@xyflow/react"
import type { EdgeProps } from "@xyflow/react"

import type { CanvasEdge } from "@/types/canvas"

// Which edge (if any) currently has its label textbox open. Lives outside
// edge `data` on purpose — it's transient, per-viewer UI state, not
// something that should sync to Liveblocks/collaborators.
interface EdgeEditingContextValue {
  editingEdgeId: string | null
  setEditingEdgeId: (id: string | null) => void
}

export const EdgeEditingContext = createContext<EdgeEditingContextValue>({
  editingEdgeId: null,
  setEditingEdgeId: () => {},
})

export function CanvasEdgeRenderer({
  id,
  data,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
  style,
}: EdgeProps<CanvasEdge>) {
  const { updateEdgeData } = useReactFlow<never, CanvasEdge>()
  const { editingEdgeId, setEditingEdgeId } = useContext(EdgeEditingContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const label = data?.label ?? ""
  const isEditing = editingEdgeId === id

  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const stopEditing = useCallback(() => {
    setEditingEdgeId(null)
  }, [setEditingEdgeId])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateEdgeData(id, { label: event.target.value })
    },
    [id, updateEdgeData],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation()
      if (event.key === "Escape" || event.key === "Enter") {
        stopEditing()
      }
    },
    [stopEditing],
  )

  // Nothing to show at rest — the textbox only ever appears via a double
  // click on the edge itself (wired through `onEdgeDoubleClick` on
  // `<ReactFlow>`, which sets `editingEdgeId`), and once there's a label,
  // the label text doubles as that same entry point.
  if (!isEditing && !label) {
    return <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
  }

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-auto absolute"
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          onDoubleClick={(event) => {
            event.stopPropagation()
            setEditingEdgeId(id)
          }}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              className="min-w-16 rounded-xl border border-surface-border bg-surface px-2 py-1 text-center text-xs text-copy-primary outline-none"
              value={label}
              onChange={handleChange}
              onBlur={stopEditing}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span className="rounded-xl border border-surface-border-subtle bg-surface px-2 py-1 text-xs text-copy-secondary">
              {label}
            </span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
