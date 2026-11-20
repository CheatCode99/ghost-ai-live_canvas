"use client"

import type { NodeProps } from "@xyflow/react"

import { NodeShapeVisual } from "@/components/editor/node-shape-visual"
import { NODE_SHAPE_SIZES } from "@/types/canvas"
import type { CanvasNode } from "@/types/canvas"

export function CanvasNodeRenderer({ data, width, height, selected }: NodeProps<CanvasNode>) {
  const defaultSize = NODE_SHAPE_SIZES[data.shape]

  return (
    <NodeShapeVisual
      shape={data.shape}
      width={width ?? defaultSize.width}
      height={height ?? defaultSize.height}
      color={data.color}
      label={data.label}
      selected={selected}
    />
  )
}
