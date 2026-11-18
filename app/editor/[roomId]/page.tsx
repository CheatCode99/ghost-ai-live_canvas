import { redirect } from "next/navigation"
import { Suspense } from "react"

import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>
}

export default function EditorRoomPage({ params }: EditorRoomPageProps) {
  return (
    <Suspense>
      <EditorRoomContent params={params} />
    </Suspense>
  )
}

async function EditorRoomContent({ params }: EditorRoomPageProps) {
  const { roomId } = await params
  const identity = await getCurrentIdentity()

  if (!identity) {
    redirect("/sign-in")
  }

  const project = await getAccessibleProject(roomId, identity)

  if (!project) {
    return <AccessDenied />
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(identity.userId),
    identity.email ? getSharedProjects(identity.email) : Promise.resolve([]),
  ])

  return (
    <WorkspaceShell
      project={{
        id: project.id,
        name: project.name,
        role: project.ownerId === identity.userId ? "owner" : "collaborator",
      }}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
