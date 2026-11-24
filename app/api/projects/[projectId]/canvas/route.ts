import { get, put } from "@vercel/blob"

import { prisma } from "@/lib/prisma"
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access"

interface RouteParams {
  params: Promise<{ projectId: string }>
}

interface CanvasPayload {
  nodes: unknown[]
  edges: unknown[]
}

function parseCanvasPayload(body: unknown): CanvasPayload | null {
  if (
    body &&
    typeof body === "object" &&
    "nodes" in body &&
    "edges" in body &&
    Array.isArray((body as { nodes: unknown }).nodes) &&
    Array.isArray((body as { edges: unknown }).edges)
  ) {
    return body as CanvasPayload
  }

  return null
}

export async function PUT(request: Request, { params }: RouteParams) {
  const identity = await getCurrentIdentity()

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await getAccessibleProject(projectId, identity)

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => null)
  const canvas = parseCanvasPayload(body)

  if (!canvas) {
    return Response.json(
      { error: "nodes and edges arrays are required" },
      { status: 400 }
    )
  }

  const blob = await put(`canvas/${projectId}.json`, JSON.stringify(canvas), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  })

  await prisma.project.update({
    where: { id: projectId },
    data: { canvasJsonPath: blob.url },
  })

  return Response.json({ canvasJsonPath: blob.url })
}

export async function GET(_request: Request, { params }: RouteParams) {
  const identity = await getCurrentIdentity()

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await getAccessibleProject(projectId, identity)

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  if (!project.canvasJsonPath) {
    return Response.json({ canvas: null })
  }

  const result = await get(project.canvasJsonPath, { access: "private" }).catch(() => null)

  if (!result) {
    return Response.json({ canvas: null })
  }

  const canvas = await new Response(result.stream)
    .json()
    .catch(() => null)

  return Response.json({ canvas: parseCanvasPayload(canvas) })
}
