import { NODE_COLORS, NODE_SHAPE_SIZES } from "@/types/canvas"
import type { CanvasEdge, CanvasNode, NodeColor, NodeShape } from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

function templateNode(
  id: string,
  shape: NodeShape,
  label: string,
  color: NodeColor,
  position: { x: number; y: number },
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position,
    ...NODE_SHAPE_SIZES[shape],
    data: { label, color, shape },
  }
}

type HandleSide = "top" | "right" | "bottom" | "left"

function handlePoints(node: CanvasNode): { side: HandleSide; x: number; y: number }[] {
  const { x, y } = node.position
  const width = node.width ?? 0
  const height = node.height ?? 0
  return [
    { side: "top", x: x + width / 2, y },
    { side: "right", x: x + width, y: y + height / 2 },
    { side: "bottom", x: x + width / 2, y: y + height },
    { side: "left", x, y: y + height / 2 },
  ]
}

// Picks whichever handle pair sits closest together, so edges hug the shortest path between nodes.
function closestHandlePair(source: CanvasNode, target: CanvasNode): { sourceHandle: HandleSide; targetHandle: HandleSide } {
  let best = { sourceHandle: "bottom" as HandleSide, targetHandle: "top" as HandleSide, distance: Infinity }

  for (const s of handlePoints(source)) {
    for (const t of handlePoints(target)) {
      const distance = Math.hypot(s.x - t.x, s.y - t.y)
      if (distance < best.distance) {
        best = { sourceHandle: s.side, targetHandle: t.side, distance }
      }
    }
  }

  return { sourceHandle: best.sourceHandle, targetHandle: best.targetHandle }
}

function templateEdge(id: string, source: CanvasNode, target: CanvasNode): CanvasEdge {
  const { sourceHandle, targetHandle } = closestHandlePair(source, target)
  return { id, type: "canvasEdge", source: source.id, target: target.id, sourceHandle, targetHandle }
}

export interface TemplateImportRequest {
  template: CanvasTemplate
  requestId: number
}

// Re-ids nodes/edges with `prefix` so importing the same template twice never collides.
export function instantiateTemplate(
  template: CanvasTemplate,
  prefix: string,
): { nodes: CanvasNode[]; edges: CanvasEdge[] } {
  const idMap = new Map(template.nodes.map((node) => [node.id, `${prefix}-${node.id}`]))

  const nodes = template.nodes.map((node) => ({
    ...node,
    id: idMap.get(node.id)!,
  }))

  const edges = template.edges.map((edge) => ({
    ...edge,
    id: `${prefix}-${edge.id}`,
    source: idMap.get(edge.source)!,
    target: idMap.get(edge.target)!,
  }))

  return { nodes, edges }
}

function buildMicroservicesTemplate(): CanvasTemplate {
  const gateway = templateNode("gateway", "hexagon", "API Gateway", NODE_COLORS[1], { x: 240, y: 0 })
  const authService = templateNode("auth-service", "pill", "Auth Service", NODE_COLORS[6], { x: 0, y: 160 })
  const orderService = templateNode("order-service", "pill", "Order Service", NODE_COLORS[6], { x: 220, y: 160 })
  const paymentService = templateNode("payment-service", "pill", "Payment Service", NODE_COLORS[6], { x: 440, y: 160 })
  const authDb = templateNode("auth-db", "cylinder", "Auth DB", NODE_COLORS[7], { x: 10, y: 320 })
  const orderDb = templateNode("order-db", "cylinder", "Orders DB", NODE_COLORS[7], { x: 230, y: 320 })
  const paymentDb = templateNode("payment-db", "cylinder", "Payments DB", NODE_COLORS[7], { x: 450, y: 320 })

  return {
    id: "microservices",
    name: "Microservices",
    description: "An API gateway routing to independent services, each backed by its own database.",
    nodes: [gateway, authService, orderService, paymentService, authDb, orderDb, paymentDb],
    edges: [
      templateEdge("gateway-auth", gateway, authService),
      templateEdge("gateway-order", gateway, orderService),
      templateEdge("gateway-payment", gateway, paymentService),
      templateEdge("auth-auth-db", authService, authDb),
      templateEdge("order-order-db", orderService, orderDb),
      templateEdge("payment-payment-db", paymentService, paymentDb),
    ],
  }
}

function buildEventDrivenTemplate(): CanvasTemplate {
  const producer = templateNode("producer", "pill", "Order Service", NODE_COLORS[1], { x: 0, y: 40 })
  const eventBus = templateNode("event-bus", "hexagon", "Event Bus", NODE_COLORS[2], { x: 260, y: 0 })
  const consumerEmail = templateNode("consumer-email", "pill", "Email Service", NODE_COLORS[6], { x: 520, y: -40 })
  const consumerAnalytics = templateNode("consumer-analytics", "pill", "Analytics Service", NODE_COLORS[6], {
    x: 520,
    y: 120,
  })
  const eventStore = templateNode("event-store", "cylinder", "Event Store", NODE_COLORS[7], { x: 280, y: 180 })

  return {
    id: "event-driven",
    name: "Event-Driven",
    description: "A producer publishes events through a broker to independent consumers and a store.",
    nodes: [producer, eventBus, consumerEmail, consumerAnalytics, eventStore],
    edges: [
      templateEdge("producer-bus", producer, eventBus),
      templateEdge("bus-email", eventBus, consumerEmail),
      templateEdge("bus-analytics", eventBus, consumerAnalytics),
      templateEdge("bus-store", eventBus, eventStore),
    ],
  }
}

function buildCicdPipelineTemplate(): CanvasTemplate {
  const repo = templateNode("repo", "rectangle", "Git Repository", NODE_COLORS[1], { x: 0, y: 0 })
  const build = templateNode("build", "pill", "Build", NODE_COLORS[3], { x: 220, y: 0 })
  const test = templateNode("test", "diamond", "Tests Pass?", NODE_COLORS[4], { x: 420, y: -10 })
  const deploy = templateNode("deploy", "pill", "Deploy", NODE_COLORS[6], { x: 620, y: 0 })
  const production = templateNode("production", "hexagon", "Production", NODE_COLORS[7], { x: 820, y: -10 })

  return {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description: "A linear pipeline from source control through build, test, and deploy to production.",
    nodes: [repo, build, test, deploy, production],
    edges: [
      templateEdge("repo-build", repo, build),
      templateEdge("build-test", build, test),
      templateEdge("test-deploy", test, deploy),
      templateEdge("deploy-production", deploy, production),
    ],
  }
}

const microservicesTemplate = buildMicroservicesTemplate()
const eventDrivenTemplate = buildEventDrivenTemplate()
const cicdPipelineTemplate = buildCicdPipelineTemplate()

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  microservicesTemplate,
  eventDrivenTemplate,
  cicdPipelineTemplate,
]
