"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense"
import { ErrorBoundary } from "react-error-boundary"

import { CanvasFlow } from "@/components/editor/canvas-flow"
import type { TemplateImportRequest } from "@/components/editor/starter-templates"

interface CanvasRoomProps {
  roomId: string
  importRequest?: TemplateImportRequest | null
  onImportHandled?: () => void
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

export function CanvasRoom({ roomId, importRequest, onImportHandled }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
        <ErrorBoundary FallbackComponent={CanvasError}>
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <CanvasFlow importRequest={importRequest} onImportHandled={onImportHandled} />
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
