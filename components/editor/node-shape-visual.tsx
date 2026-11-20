import type { NodeColor, NodeShape } from "@/types/canvas"

interface NodeShapeVisualProps {
  shape: NodeShape
  width: number
  height: number
  color: NodeColor
  label?: string
  selected?: boolean
}

const CSS_SHAPE_RADIUS: Record<"rectangle" | "pill" | "circle", string> = {
  rectangle: "rounded-lg",
  pill: "rounded-full",
  circle: "rounded-full",
}

export function NodeShapeVisual({
  shape,
  width,
  height,
  color,
  label,
  selected = false,
}: NodeShapeVisualProps) {
  if (shape === "rectangle" || shape === "pill" || shape === "circle") {
    return (
      <div
        className={`flex items-center justify-center px-3 py-2 text-center text-sm ${CSS_SHAPE_RADIUS[shape]} ${
          selected ? "border-2 border-brand" : "border border-surface-border"
        }`}
        style={{ width, height, backgroundColor: color.fill, color: color.text }}
      >
        {label}
      </div>
    )
  }

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
        <SvgShapePath shape={shape} width={width} height={height} fill={color.fill} selected={selected} />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center px-3 py-2 text-center text-sm"
        style={{ color: color.text }}
      >
        {label}
      </div>
    </div>
  )
}

function SvgShapePath({
  shape,
  width,
  height,
  fill,
  selected,
}: {
  shape: "diamond" | "hexagon" | "cylinder"
  width: number
  height: number
  fill: string
  selected: boolean
}) {
  const stroke = selected ? "var(--accent-primary)" : "var(--border-default)"
  const strokeWidth = selected ? 2 : 1.5

  if (shape === "diamond") {
    const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`
    return <polygon points={points} fill={fill} style={{ stroke, strokeWidth }} />
  }

  if (shape === "hexagon") {
    const points = [
      [width * 0.25, 0],
      [width * 0.75, 0],
      [width, height / 2],
      [width * 0.75, height],
      [width * 0.25, height],
      [0, height / 2],
    ]
      .map(([x, y]) => `${x},${y}`)
      .join(" ")
    return <polygon points={points} fill={fill} style={{ stroke, strokeWidth }} />
  }

  const rx = width / 2
  const ry = height * 0.12
  const outline = `M0,${ry} A${rx},${ry} 0 0 1 ${width},${ry} L${width},${height - ry} A${rx},${ry} 0 0 1 0,${height - ry} Z`

  return (
    <>
      <path d={outline} fill={fill} style={{ stroke, strokeWidth }} />
      <ellipse cx={width / 2} cy={ry} rx={rx} ry={ry} fill="none" style={{ stroke, strokeWidth }} />
    </>
  )
}
