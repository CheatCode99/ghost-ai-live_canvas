"use client"

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

import { NODE_SHAPE_SIZES, NODE_SHAPES } from "@/types/canvas"
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
  function onDragStart(event: DragEvent<HTMLDivElement>, shape: NodeShape) {
    const payload: ShapeDragPayload = { shape, ...NODE_SHAPE_SIZES[shape] }
    event.dataTransfer.setData(SHAPE_DRAG_MIME_TYPE, JSON.stringify(payload))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
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
  )
}
