"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense"
import { ErrorBoundary } from "react-error-boundary"

import { CanvasFlow } from "@/components/editor/canvas-flow"
import type { TemplateImportRequest } from "@/components/editor/starter-templates"
import type { SaveStatus } from "@/hooks/use-canvas-autosave"

interface CanvasRoomProps {
  roomId: string
  importRequest?: TemplateImportRequest | null
  onImportHandled?: () => void
  onSaveStatusChange?: (status: SaveStatus) => void
  manualSaveToken?: number
}

function CanvasLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-copy-muted">Loading canvas…</p>
    </div>
  )
}

function CanvasError() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base">
      <p className="text-sm text-error">
        Couldn&apos;t connect to the canvas. Try refreshing the page.
      </p>
    </div>
  )
}

export function CanvasRoom({
  roomId,
  importRequest,
  onImportHandled,
  onSaveStatusChange,
  manualSaveToken,
}: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null, thinking: false }}>
        <ErrorBoundary FallbackComponent={CanvasError}>
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <CanvasFlow
              projectId={roomId}
              importRequest={importRequest}
              onImportHandled={onImportHandled}
              onSaveStatusChange={onSaveStatusChange}
              manualSaveToken={manualSaveToken}
            />
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
