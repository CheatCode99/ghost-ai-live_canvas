import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/app/generated/prisma/client"

export interface Identity {
  userId: string
  email: string | null
}

export type AccessibleProject = Prisma.ProjectGetPayload<{
  include: { collaborators: true }
}>

export async function getCurrentIdentity(): Promise<Identity | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  return { userId, email }
}

export async function getAccessibleProject(
  projectId: string,
  identity: Identity
): Promise<AccessibleProject | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  if (!project) {
    return null
  }

  const isOwner = project.ownerId === identity.userId
  const isCollaborator =
    identity.email !== null &&
    project.collaborators.some((collaborator) => collaborator.email === identity.email)

  return isOwner || isCollaborator ? project : null
}
