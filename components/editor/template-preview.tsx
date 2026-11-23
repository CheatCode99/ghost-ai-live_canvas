import type { CanvasNode } from "@/types/canvas"
import type { CanvasTemplate } from "@/components/editor/starter-templates"

const PREVIEW_WIDTH = 240
const PREVIEW_HEIGHT = 140
const PREVIEW_PADDING = 12

interface Rect {
  x: number
  y: number
  width: number
  height: number
}

function computePreviewLayout(nodes: CanvasNode[]) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const node of nodes) {
    const width = node.width ?? 0
    const height = node.height ?? 0
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + width)
    maxY = Math.max(maxY, node.position.y + height)
  }

  const boundsWidth = Math.max(maxX - minX, 1)
  const boundsHeight = Math.max(maxY - minY, 1)
  const availableWidth = PREVIEW_WIDTH - PREVIEW_PADDING * 2
  const availableHeight = PREVIEW_HEIGHT - PREVIEW_PADDING * 2
  const scale = Math.min(availableWidth / boundsWidth, availableHeight / boundsHeight)

  return {
    scale,
    offsetX: PREVIEW_PADDING + (availableWidth - boundsWidth * scale) / 2 - minX * scale,
    offsetY: PREVIEW_PADDING + (availableHeight - boundsHeight * scale) / 2 - minY * scale,
  }
}

function PreviewNode({ node, rect }: { node: CanvasNode; rect: Rect }) {
  const { fill } = node.data.color
  const { x, y, width, height } = rect
  const stroke = "var(--border-subtle)"

  switch (node.data.shape) {
    case "rectangle":
      return <rect x={x} y={y} width={width} height={height} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />

    case "pill":
    case "circle": {
      const radius = Math.min(width, height) / 2
      return (
        <rect x={x} y={y} width={width} height={height} rx={radius} ry={radius} fill={fill} stroke={stroke} strokeWidth={1} />
      )
    }

    case "diamond": {
      const points = `${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`
      return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={1} />
    }

    case "hexagon": {
      const points = [
        [x + width * 0.25, y],
        [x + width * 0.75, y],
        [x + width, y + height / 2],
        [x + width * 0.75, y + height],
        [x + width * 0.25, y + height],
        [x, y + height / 2],
      ]
        .map(([px, py]) => `${px},${py}`)
        .join(" ")
      return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={1} />
    }

    case "cylinder": {
      const rx = width / 2
      const ry = height * 0.16
      const bodyTop = y + ry
      const bodyBottom = y + height - ry
      const outline = `M${x},${bodyTop} A${rx},${ry} 0 0 1 ${x + width},${bodyTop} L${x + width},${bodyBottom} A${rx},${ry} 0 0 1 ${x},${bodyBottom} Z`
      return (
        <g>
          <path d={outline} fill={fill} stroke={stroke} strokeWidth={1} />
          <ellipse cx={x + width / 2} cy={bodyTop} rx={rx} ry={ry} fill="none" stroke={stroke} strokeWidth={1} />
        </g>
      )
    }

    default:
      return null
  }
}

export function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const layout = computePreviewLayout(template.nodes)
  const rects = new Map<string, Rect>()

  for (const node of template.nodes) {
    rects.set(node.id, {
      x: node.position.x * layout.scale + layout.offsetX,
      y: node.position.y * layout.scale + layout.offsetY,
      width: (node.width ?? 0) * layout.scale,
      height: (node.height ?? 0) * layout.scale,
    })
  }

  return (
    <svg
      viewBox={`0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label={`${template.name} diagram preview`}
    >
      {template.edges.map((edge) => {
        const source = rects.get(edge.source)
        const target = rects.get(edge.target)
        if (!source || !target) return null

        return (
          <line
            key={edge.id}
            x1={source.x + source.width / 2}
            y1={source.y + source.height / 2}
            x2={target.x + target.width / 2}
            y2={target.y + target.height / 2}
            stroke="var(--border-subtle)"
            strokeWidth={1}
          />
        )
      })}
      {template.nodes.map((node) => {
        const rect = rects.get(node.id)
        if (!rect) return null
        return <PreviewNode key={node.id} node={node} rect={rect} />
      })}
    </svg>
  )
}
