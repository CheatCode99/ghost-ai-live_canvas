"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react"

import { Handle, NodeResizer, Position, useReactFlow } from "@xyflow/react"
import type { NodeProps } from "@xyflow/react"

import { NodeColorToolbar } from "@/components/editor/node-color-toolbar"
import { NodeShapeVisual } from "@/components/editor/node-shape-visual"
import { MIN_NODE_HEIGHT, MIN_NODE_WIDTH, NODE_SHAPE_SIZES } from "@/types/canvas"
import type { CanvasNode, NodeColor } from "@/types/canvas"

const HANDLE_CLASS_NAME =
  "!h-2 !w-2 !rounded-full !border-0 !bg-white opacity-0 transition-opacity group-hover:opacity-100"

export function CanvasNodeRenderer({ id, data, width, height, selected }: NodeProps<CanvasNode>) {
  const { updateNodeData } = useReactFlow<CanvasNode>()
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const defaultSize = NODE_SHAPE_SIZES[data.shape]
  const nodeWidth = width ?? defaultSize.width
  const nodeHeight = height ?? defaultSize.height

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [])

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
      resizeTextarea()
    }
  }, [isEditing, resizeTextarea])

  const startEditing = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    setIsEditing(true)
  }, [])

  const stopEditing = useCallback(() => {
    setIsEditing(false)
  }, [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { label: event.target.value })
      resizeTextarea()
    },
    [id, updateNodeData, resizeTextarea],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      event.stopPropagation()
      if (event.key === "Escape") {
        stopEditing()
      }
    },
    [stopEditing],
  )

  const handleColorSelect = useCallback(
    (color: NodeColor) => {
      updateNodeData(id, { color })
    },
    [id, updateNodeData],
  )

  return (
    <div
      className="group relative"
      style={{ width: nodeWidth, height: nodeHeight }}
      onDoubleClick={startEditing}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_NODE_WIDTH}
        minHeight={MIN_NODE_HEIGHT}
        color="var(--accent-primary)"
        handleStyle={{ width: 8, height: 8, borderRadius: 2 }}
        lineStyle={{ borderColor: "var(--accent-primary)" }}
      />

      {selected && <NodeColorToolbar activeColor={data.color} onSelect={handleColorSelect} />}

      <NodeShapeVisual
        shape={data.shape}
        width={nodeWidth}
        height={nodeHeight}
        color={data.color}
        label={isEditing ? undefined : data.label}
        selected={selected}
      />

      {!isEditing && !data.label && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 py-2 text-center text-sm text-copy-faint">
          Label
        </div>
      )}

      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center px-3 py-2">
          <textarea
            ref={textareaRef}
            rows={1}
            className="nodrag nopan nowheel w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-center text-sm outline-none"
            style={{ color: data.color.text }}
            value={data.label}
            onChange={handleChange}
            onBlur={stopEditing}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}

      <Handle type="source" position={Position.Top} id="top" className={HANDLE_CLASS_NAME} />
      <Handle type="source" position={Position.Right} id="right" className={HANDLE_CLASS_NAME} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={HANDLE_CLASS_NAME} />
      <Handle type="source" position={Position.Left} id="left" className={HANDLE_CLASS_NAME} />
    </div>
  )
}
