import { auth } from "@clerk/nextjs/server"

import { Prisma } from "@/app/generated/prisma/client"
import { prisma } from "@/lib/prisma"

const ROOM_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

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

// The room id the client previews in the create dialog (slugified name +
// a short random suffix) becomes the project's actual id when it's a valid,
// URL-safe value — this is what keeps the project id and the Liveblocks
// room id aligned instead of the client previewing one value and the
// server minting an unrelated cuid. Falls back to Prisma's own
// `@default(cuid())` when omitted or malformed.
function resolveRoomId(body: unknown): string | undefined {
  if (
    body &&
    typeof body === "object" &&
    "id" in body &&
    typeof (body as { id: unknown }).id === "string"
  ) {
    const id = (body as { id: string }).id
    if (id.length > 0 && id.length <= 80 && ROOM_ID_PATTERN.test(id)) {
      return id
    }
  }

  return undefined
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
  const id = resolveRoomId(body)

  try {
    const project = await prisma.project.create({
      data: { ...(id ? { id } : {}), ownerId: userId, name },
    })

    return Response.json({ project }, { status: 201 })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "That workspace id is already taken. Please try again." },
        { status: 409 }
      )
    }

    throw error
  }
}
