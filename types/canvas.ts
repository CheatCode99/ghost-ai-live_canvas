import type { Edge, Node } from "@xyflow/react"

export const NODE_COLORS = [
  { fill: "#1F1F1F", text: "#EDEDED" },
  { fill: "#10233D", text: "#52A8FF" },
  { fill: "#2E1938", text: "#BF7AF0" },
  { fill: "#331B00", text: "#FF990A" },
  { fill: "#3C1618", text: "#FF6166" },
  { fill: "#3A1726", text: "#F75F8F" },
  { fill: "#0F2E18", text: "#62C073" },
  { fill: "#062822", text: "#0AC7B4" },
] as const

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const

export type NodeColor = (typeof NODE_COLORS)[number]
export type NodeShape = (typeof NODE_SHAPES)[number]

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color: NodeColor
  shape: NodeShape
}

export interface CanvasEdgeData extends Record<string, unknown> {
  label?: string
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">
export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">

export const NODE_SHAPE_SIZES: Record<NodeShape, { width: number; height: number }> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 140, height: 100 },
  circle: { width: 90, height: 90 },
  pill: { width: 160, height: 56 },
  cylinder: { width: 100, height: 120 },
  hexagon: { width: 140, height: 100 },
}

export interface ShapeDragPayload {
  shape: NodeShape
  width: number
  height: number
}

export const MIN_NODE_WIDTH = 40
export const MIN_NODE_HEIGHT = 40
