"use client"

import { shallow, useOthers } from "@liveblocks/react"

interface LiveCursorsProps {
  flowToScreenPosition: (position: { x: number; y: number }) => { x: number; y: number }
}

export function LiveCursors({ flowToScreenPosition }: LiveCursorsProps) {
  const cursors = useOthers(
    (others) =>
      others
        .filter((other) => other.presence.cursor !== null)
        .map((other) => ({
          connectionId: other.connectionId,
          name: other.info.name,
          color: other.info.cursorColor,
          x: other.presence.cursor!.x,
          y: other.presence.cursor!.y,
        })),
    shallow,
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {cursors.map((cursor) => {
        const screenPosition = flowToScreenPosition({ x: cursor.x, y: cursor.y })

        return (
          <div
            key={cursor.connectionId}
            className="absolute"
            style={{ left: screenPosition.x, top: screenPosition.y }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="drop-shadow-sm"
            >
              <path
                d="M1 1L1 14.5L5 11L7.5 16L10 14.8L7.5 9.8L14 9.8L1 1Z"
                fill={cursor.color}
                stroke="white"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="ml-3 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium text-white shadow-md"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
