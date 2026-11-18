import { auth, currentUser } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

import { EditorShell } from "@/components/editor/editor-shell"
import { prisma } from "@/lib/prisma"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"
import type { Project } from "@/types/project"

interface WorkspacePageProps {
  params: Promise<{ projectId: string }>
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  return (
    <Suspense>
      <WorkspaceContent params={params} />
    </Suspense>
  )
}

async function WorkspaceContent({ params }: WorkspacePageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const { projectId } = await params
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  })

  const isOwner = project?.ownerId === userId
  const isCollaborator =
    !!project &&
    !!email &&
    project.collaborators.some((collaborator) => collaborator.email === email)

  if (!project || !(isOwner || isCollaborator)) {
    notFound()
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(userId),
    email ? getSharedProjects(email) : Promise.resolve([]),
  ])

  const activeProject: Project = {
    id: project.id,
    name: project.name,
    role: isOwner ? "owner" : "collaborator",
  }

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
      activeProject={activeProject}
    />
  )
}
