"use client"

import { useCallback, useEffect, useRef } from "react"
import type { DragEvent } from "react"

import { useCanRedo, useCanUndo, useRedo, useUndo } from "@liveblocks/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  SmoothStepEdge,
  useReactFlow,
} from "@xyflow/react"

import { CanvasControls } from "@/components/editor/canvas-controls"
import { CanvasNodeRenderer } from "@/components/editor/canvas-node"
import { SHAPE_DRAG_MIME_TYPE, ShapeToolbar } from "@/components/editor/shape-toolbar"
import { instantiateTemplate } from "@/components/editor/starter-templates"
import type { TemplateImportRequest } from "@/components/editor/starter-templates"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { NODE_COLORS } from "@/types/canvas"
import type { CanvasEdge, CanvasNode, ShapeDragPayload } from "@/types/canvas"

import "@xyflow/react/dist/style.css"
import "@liveblocks/react-flow/styles.css"

const nodeTypes = { canvasNode: CanvasNodeRenderer }
// Covers both explicitly-typed ("canvasEdge") and untyped (user-drawn) edges with the same routing:
// straight segments with a slightly rounded corner (SmoothStepEdge's default 5px borderRadius).
const edgeTypes = { canvasEdge: SmoothStepEdge, default: SmoothStepEdge }

let nodeIdCounter = 0

const ZOOM_DURATION = 200
const FIT_VIEW_DURATION = 300

interface CanvasFlowProps {
  importRequest?: TemplateImportRequest | null
  onImportHandled?: () => void
}

export function CanvasFlow({ importRequest, onImportHandled }: CanvasFlowProps) {
  return (
    <ReactFlowProvider>
      <CanvasFlowInner importRequest={importRequest} onImportHandled={onImportHandled} />
    </ReactFlowProvider>
  )
}

function CanvasFlowInner({ importRequest, onImportHandled }: CanvasFlowProps) {
  const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>()
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = reactFlowInstance
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  useKeyboardShortcuts({ reactFlowInstance, undo, redo })

  const lastImportedRequestId = useRef<number | null>(null)

  useEffect(() => {
    if (!importRequest || importRequest.requestId === lastImportedRequestId.current) return
    lastImportedRequestId.current = importRequest.requestId

    const { nodes: newNodes, edges: newEdges } = instantiateTemplate(
      importRequest.template,
      `tpl-${importRequest.requestId}`,
    )

    onNodesChange(newNodes.map((item) => ({ type: "add" as const, item })))
    onEdgesChange(newEdges.map((item) => ({ type: "add" as const, item })))
    fitView({ duration: FIT_VIEW_DURATION })
    onImportHandled?.()
  }, [importRequest, onNodesChange, onEdgesChange, fitView, onImportHandled])

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
        edgeTypes={edgeTypes}
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

      <CanvasControls
        onZoomIn={() => zoomIn({ duration: ZOOM_DURATION })}
        onZoomOut={() => zoomOut({ duration: ZOOM_DURATION })}
        onFitView={() => fitView({ duration: FIT_VIEW_DURATION })}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  )
}
