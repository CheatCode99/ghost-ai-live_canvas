"use client"

import type { NodeProps } from "@xyflow/react"

import type { CanvasNode } from "@/types/canvas"

export function CanvasNodeRenderer({ data, width, height }: NodeProps<CanvasNode>) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-lg border border-surface-border px-3 py-2 text-center text-sm"
      style={{
        width: width ?? undefined,
        height: height ?? undefined,
        backgroundColor: data.color.fill,
        color: data.color.text,
      }}
    >
      {data.label}
    </div>
  )
}
