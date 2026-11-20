"use client"

import { useCallback } from "react"
import type { DragEvent } from "react"

import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react"

import { CanvasNodeRenderer } from "@/components/editor/canvas-node"
import { SHAPE_DRAG_MIME_TYPE, ShapeToolbar } from "@/components/editor/shape-toolbar"
import { NODE_COLORS } from "@/types/canvas"
import type { CanvasEdge, CanvasNode, ShapeDragPayload } from "@/types/canvas"

import "@xyflow/react/dist/style.css"
import "@liveblocks/react-flow/styles.css"

const nodeTypes = { canvasNode: CanvasNodeRenderer }

let nodeIdCounter = 0

export function CanvasFlow() {
  return (
    <ReactFlowProvider>
      <CanvasFlowInner />
    </ReactFlowProvider>
  )
}

function CanvasFlowInner() {
  const { screenToFlowPosition } = useReactFlow<CanvasNode, CanvasEdge>()
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const raw = event.dataTransfer.getData(SHAPE_DRAG_MIME_TYPE)
      if (!raw) return

      const payload = JSON.parse(raw) as ShapeDragPayload
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY })

      nodeIdCounter += 1
      const id = `${payload.shape}-${Date.now()}-${nodeIdCounter}`

      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position,
        width: payload.width,
        height: payload.height,
        data: {
          label: "",
          color: NODE_COLORS[0],
          shape: payload.shape,
        },
      }

      onNodesChange([{ type: "add", item: newNode }])
    },
    [screenToFlowPosition, onNodesChange],
  )

  return (
    <div className="relative h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        fitView
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
      </ReactFlow>

      <ShapeToolbar />
    </div>
  )
}
