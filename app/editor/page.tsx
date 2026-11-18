import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { EditorShell } from "@/components/editor/editor-shell"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

export default function EditorPage() {
  return (
    <Suspense>
      <EditorHomeContent />
    </Suspense>
  )
}

async function EditorHomeContent() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(userId),
    email ? getSharedProjects(email) : Promise.resolve([]),
  ])

  return (
    <EditorShell ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
  )
}
