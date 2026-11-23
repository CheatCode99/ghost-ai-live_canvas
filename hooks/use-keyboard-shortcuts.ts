"use client"

import { useEffect } from "react"

import type { Edge, Node, ReactFlowInstance } from "@xyflow/react"

interface UseKeyboardShortcutsOptions<NodeType extends Node, EdgeType extends Edge> {
  reactFlowInstance: ReactFlowInstance<NodeType, EdgeType> | null
  undo: () => void
  redo: () => void
}

const ZOOM_DURATION = 200

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
}

export function useKeyboardShortcuts<NodeType extends Node, EdgeType extends Edge>({
  reactFlowInstance,
  undo,
  redo,
}: UseKeyboardShortcutsOptions<NodeType, EdgeType>) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return
      if (!reactFlowInstance) return

      const isModifier = event.metaKey || event.ctrlKey

      if (!isModifier && (event.key === "+" || event.key === "=")) {
        event.preventDefault()
        reactFlowInstance.zoomIn({ duration: ZOOM_DURATION })
        return
      }

      if (!isModifier && event.key === "-") {
        event.preventDefault()
        reactFlowInstance.zoomOut({ duration: ZOOM_DURATION })
        return
      }

      if (isModifier && event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault()
        redo()
        return
      }

      if (isModifier && event.key.toLowerCase() === "z") {
        event.preventDefault()
        undo()
        return
      }

      if (isModifier && event.key.toLowerCase() === "y") {
        event.preventDefault()
        undo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [reactFlowInstance, undo, redo])
}
