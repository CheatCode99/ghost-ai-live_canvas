import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { getAccessibleProject, type Identity } from "@/lib/project-access"
import { getCursorColorForUser, getLiveblocksClient } from "@/lib/liveblocks"

export async function POST(request: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { room } = await request.json()

  if (typeof room !== "string" || !room) {
    return NextResponse.json({ error: "Missing room" }, { status: 400 })
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null
  const identity: Identity = { userId, email }

  const project = await getAccessibleProject(room, identity)

  if (!project) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const liveblocksClient = getLiveblocksClient()

  await liveblocksClient.getOrCreateRoom(room, {
    defaultAccesses: ["room:write"],
  })

  const name = user?.fullName ?? email ?? "Anonymous"
  const avatarUrl = user?.imageUrl ?? ""
  const cursorColor = getCursorColorForUser(userId)

  const { status, body } = await liveblocksClient.identifyUser(userId, {
    userInfo: { name, avatarUrl, cursorColor },
  })

  return new Response(body, { status })
}
