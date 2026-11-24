"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { DragEvent, MouseEvent as ReactMouseEvent } from "react"

import { useCanRedo, useCanUndo, useRedo, useUndo, useUpdateMyPresence } from "@liveblocks/react"
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
import type { Edge } from "@xyflow/react"

import { CanvasControls } from "@/components/editor/canvas-controls"
import { CanvasEdgeRenderer, EdgeEditingContext } from "@/components/editor/canvas-edge"
import { CanvasNodeRenderer } from "@/components/editor/canvas-node"
import { LiveCursors } from "@/components/editor/live-cursors"
import { PresenceAvatars } from "@/components/editor/presence-avatars"
import { SHAPE_DRAG_MIME_TYPE, ShapeToolbar } from "@/components/editor/shape-toolbar"
import { instantiateTemplate } from "@/components/editor/starter-templates"
import type { TemplateImportRequest } from "@/components/editor/starter-templates"
import { useCanvasAutosave, type SaveStatus } from "@/hooks/use-canvas-autosave"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { NODE_COLORS } from "@/types/canvas"
import type { CanvasEdge, CanvasNode, ShapeDragPayload } from "@/types/canvas"

import "@xyflow/react/dist/style.css"
import "@liveblocks/react-flow/styles.css"

const nodeTypes = { canvasNode: CanvasNodeRenderer }
// Covers both explicitly-typed ("canvasEdge") and untyped (user-drawn) edges with the same
// renderer — straight segments with a slightly rounded corner (getSmoothStepPath's default
// 5px borderRadius), plus an editable label at the path's midpoint.
const edgeTypes = { canvasEdge: CanvasEdgeRenderer, default: CanvasEdgeRenderer }

let nodeIdCounter = 0

const ZOOM_DURATION = 200
const FIT_VIEW_DURATION = 300

interface CanvasFlowProps {
  projectId: string
  importRequest?: TemplateImportRequest | null
  onImportHandled?: () => void
  onSaveStatusChange?: (status: SaveStatus) => void
  manualSaveToken?: number
}

export function CanvasFlow({
  projectId,
  importRequest,
  onImportHandled,
  onSaveStatusChange,
  manualSaveToken,
}: CanvasFlowProps) {
  return (
    <ReactFlowProvider>
      <CanvasFlowInner
        projectId={projectId}
        importRequest={importRequest}
        onImportHandled={onImportHandled}
        onSaveStatusChange={onSaveStatusChange}
        manualSaveToken={manualSaveToken}
      />
    </ReactFlowProvider>
  )
}

function CanvasFlowInner({
  projectId,
  importRequest,
  onImportHandled,
  onSaveStatusChange,
  manualSaveToken,
}: CanvasFlowProps) {
  const reactFlowInstance = useReactFlow<CanvasNode, CanvasEdge>()
  const { screenToFlowPosition, flowToScreenPosition, zoomIn, zoomOut, fitView } = reactFlowInstance
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    })

  const updateMyPresence = useUpdateMyPresence()

  const onPaneMouseMove = useCallback(
    (event: ReactMouseEvent) => {
      updateMyPresence({ cursor: screenToFlowPosition({ x: event.clientX, y: event.clientY }) })
    },
    [screenToFlowPosition, updateMyPresence],
  )

  const onPaneMouseLeave = useCallback(() => {
    updateMyPresence({ cursor: null })
  }, [updateMyPresence])

  // Which edge's label textbox is open — transient, per-viewer UI state
  // (not synced to Liveblocks). Opened by double-clicking an edge.
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null)
  const edgeEditingValue = useMemo(
    () => ({ editingEdgeId, setEditingEdgeId }),
    [editingEdgeId],
  )
  const onEdgeDoubleClick = useCallback((_event: ReactMouseEvent, edge: Edge) => {
    setEditingEdgeId(edge.id)
  }, [])

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

  // Frozen at mount: whether the room already had content before this
  // session touched it. Used to opt the initial viewport into `fitView`
  // only when there's something to fit — if the room starts empty,
  // `fitView` stays queued by @xyflow/react until the first node is ever
  // added, which produced an unwanted auto-zoom the moment a user dropped
  // their very first node onto a blank canvas.
  const [hadInitialContent] = useState(() => nodes.length > 0 || edges.length > 0)

  // Load a previously saved canvas exactly once, and only into a room that
  // has no live nodes/edges yet — if collaborators already populated the
  // room, loading the saved snapshot on top would overwrite their work.
  const [isLoadCheckComplete, setIsLoadCheckComplete] = useState(() => hadInitialContent)
  const hasCheckedLoad = useRef(false)

  useEffect(() => {
    if (hasCheckedLoad.current || isLoadCheckComplete) return
    hasCheckedLoad.current = true

    fetch(`/api/projects/${projectId}/canvas`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { canvas: { nodes: CanvasNode[]; edges: CanvasEdge[] } | null } | null) => {
        if (data?.canvas) {
          onNodesChange(data.canvas.nodes.map((item) => ({ type: "add" as const, item })))
          onEdgesChange(data.canvas.edges.map((item) => ({ type: "add" as const, item })))
          fitView({ duration: FIT_VIEW_DURATION })
        }
      })
      .finally(() => setIsLoadCheckComplete(true))
    // Intentionally runs once on mount — `nodes`/`edges` are read only to
    // decide whether the room was already populated when this check began.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveStatus = useCanvasAutosave({
    projectId,
    nodes,
    edges,
    enabled: isLoadCheckComplete,
    manualSaveToken,
  })

  useEffect(() => {
    onSaveStatusChange?.(saveStatus)
  }, [saveStatus, onSaveStatusChange])

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
      const cursorPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY })
      // `position` is the node's top-left corner, but the cursor marks where
      // the user is dropping visually (the center of the ghost preview) —
      // without this offset the node appears lower and to the right of the
      // cursor by half its own size.
      const position = {
        x: cursorPosition.x - payload.width / 2,
        y: cursorPosition.y - payload.height / 2,
      }

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
      <EdgeEditingContext.Provider value={edgeEditingValue}>
        <ReactFlow<CanvasNode, CanvasEdge>
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDelete={onDelete}
          onPaneMouseMove={onPaneMouseMove}
          onPaneMouseLeave={onPaneMouseLeave}
          onEdgeDoubleClick={onEdgeDoubleClick}
          connectionMode={ConnectionMode.Loose}
          fitView={hadInitialContent}
          colorMode="dark"
        >
          <Background variant={BackgroundVariant.Dots} />
          <MiniMap />
        </ReactFlow>
      </EdgeEditingContext.Provider>

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

      <PresenceAvatars />
      <LiveCursors flowToScreenPosition={flowToScreenPosition} />
    </div>
  )
}
