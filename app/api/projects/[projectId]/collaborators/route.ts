import { auth } from "@clerk/nextjs/server"

import { Prisma } from "@/app/generated/prisma/client"
import { enrichCollaborators, getOwnerInfo } from "@/lib/collaborators"
import { prisma } from "@/lib/prisma"
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access"

interface RouteParams {
  params: Promise<{ projectId: string }>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function resolveEmail(body: unknown): string | null {
  if (
    body &&
    typeof body === "object" &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
  ) {
    const email = (body as { email: string }).email.trim().toLowerCase()
    if (EMAIL_PATTERN.test(email)) {
      return email
    }
  }

  return null
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

  const [owner, collaborators] = await Promise.all([
    getOwnerInfo(project.ownerId),
    enrichCollaborators(project.collaborators),
  ])

  return Response.json({ owner, collaborators })
}

export async function POST(request: Request, { params }: RouteParams) {
  const { userId } = await auth()

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })

  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const email = resolveEmail(body)

  if (!email) {
    return Response.json({ error: "A valid email is required" }, { status: 400 })
  }

  try {
    const row = await prisma.projectCollaborator.create({
      data: { projectId, email },
    })

    const [collaborator] = await enrichCollaborators([row])

    return Response.json({ collaborator }, { status: 201 })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "This email is already a collaborator." },
        { status: 409 }
      )
    }

    throw error
  }
}
