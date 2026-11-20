"use client"

import { useRef } from "react"
import type { DragEvent } from "react"

import {
  Circle,
  Cylinder,
  Diamond,
  Hexagon,
  type LucideIcon,
  Pill,
  RectangleHorizontal,
} from "lucide-react"

import { NodeShapeVisual } from "@/components/editor/node-shape-visual"
import { NODE_COLORS, NODE_SHAPE_SIZES, NODE_SHAPES } from "@/types/canvas"
import type { NodeShape, ShapeDragPayload } from "@/types/canvas"

export const SHAPE_DRAG_MIME_TYPE = "application/ghost-ai-shape"

const SHAPE_ICONS: Record<NodeShape, LucideIcon> = {
  rectangle: RectangleHorizontal,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Cylinder,
  hexagon: Hexagon,
}

const SHAPE_LABELS: Record<NodeShape, string> = {
  rectangle: "Rectangle",
  diamond: "Diamond",
  circle: "Circle",
  pill: "Pill",
  cylinder: "Cylinder",
  hexagon: "Hexagon",
}

export function ShapeToolbar() {
  const previewRefs = useRef<Partial<Record<NodeShape, HTMLDivElement | null>>>({})

  function onDragStart(event: DragEvent<HTMLDivElement>, shape: NodeShape) {
    const payload: ShapeDragPayload = { shape, ...NODE_SHAPE_SIZES[shape] }
    event.dataTransfer.setData(SHAPE_DRAG_MIME_TYPE, JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "move"

    const preview = previewRefs.current[shape]
    if (preview) {
      const { width, height } = NODE_SHAPE_SIZES[shape]
      event.dataTransfer.setDragImage(preview, width / 2, height / 2)
    }
  }

  return (
    <>
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface/90 p-2 shadow-lg backdrop-blur">
          {NODE_SHAPES.map((shape) => {
            const Icon = SHAPE_ICONS[shape]
            return (
              <div
                key={shape}
                draggable
                onDragStart={(event) => onDragStart(event, shape)}
                title={SHAPE_LABELS[shape]}
                className="flex h-10 w-10 cursor-grab items-center justify-center rounded-full text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary active:cursor-grabbing"
              >
                <Icon className="h-5 w-5" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Offscreen drag-image sources: setDragImage needs a rendered element per
          shape, matching the exact shape/size that will be created on drop. */}
      <div className="pointer-events-none fixed top-[-9999px] left-[-9999px]" aria-hidden>
        {NODE_SHAPES.map((shape) => (
          <div
            key={shape}
            ref={(element) => {
              previewRefs.current[shape] = element
            }}
          >
            <NodeShapeVisual
              shape={shape}
              width={NODE_SHAPE_SIZES[shape].width}
              height={NODE_SHAPE_SIZES[shape].height}
              color={NODE_COLORS[0]}
            />
          </div>
        ))}
      </div>
    </>
  )
}
