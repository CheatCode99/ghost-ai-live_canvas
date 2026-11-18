import { prisma } from "@/lib/prisma"
import type { Project } from "@/types/project"

export async function getOwnedProjects(userId: string): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    role: "owner" as const,
  }))
}

export async function getSharedProjects(email: string): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: { collaborators: { some: { email } } },
    orderBy: { createdAt: "desc" },
  })

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    role: "collaborator" as const,
  }))
}
