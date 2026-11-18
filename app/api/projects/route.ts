import { auth } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

function resolveName(body: unknown): string {
  if (
    body &&
    typeof body === "object" &&
    "name" in body &&
    typeof (body as { name: unknown }).name === "string"
  ) {
    const trimmed = (body as { name: string }).name.trim()
    if (trimmed.length > 0) {
      return trimmed
    }
  }

  return "Untitled Project"
}

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })

  return Response.json({ projects })
}

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const name = resolveName(body)

  const project = await prisma.project.create({
    data: { ownerId: userId, name },
  })

  return Response.json({ project }, { status: 201 })
}
