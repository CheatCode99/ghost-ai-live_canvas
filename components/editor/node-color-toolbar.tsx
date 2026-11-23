"use client"

import type { CSSProperties } from "react"

import { NODE_COLORS } from "@/types/canvas"
import type { NodeColor } from "@/types/canvas"

interface NodeColorToolbarProps {
  activeColor: NodeColor
  onSelect: (color: NodeColor) => void
}

export function NodeColorToolbar({ activeColor, onSelect }: NodeColorToolbarProps) {
  return (
    <div
      className="nodrag nopan nowheel absolute bottom-[calc(100%+10px)] left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-surface-border-subtle bg-elevated px-2 py-1.5 shadow-lg"
      onDoubleClick={(event) => event.stopPropagation()}
    >
      {NODE_COLORS.map((color) => {
        const isActive = color.fill === activeColor.fill && color.text === activeColor.text

        return (
          <button
            key={color.fill}
            type="button"
            aria-label={`Set node color to ${color.text}`}
            aria-pressed={isActive}
            onClick={() => onSelect(color)}
            className={`h-5 w-5 shrink-0 rounded-full border border-surface-border transition-shadow ${
              isActive
                ? "shadow-[0_0_0_2px_var(--accent-primary)]"
                : "hover:shadow-[0_0_0_1px_var(--swatch-glow),0_0_6px_1px_var(--swatch-glow)]"
            }`}
            style={
              {
                backgroundColor: color.fill,
                "--swatch-glow": color.text,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
