import { clerkClient } from "@clerk/nextjs/server"
import type { User } from "@clerk/backend"

import type { Collaborator } from "@/types/collaborator"

interface CollaboratorRow {
  id: string
  email: string
}

// Enriches collaborator rows (stored by email only, per architecture-context.md's
// "Do not add local user table") with Clerk display name/avatar. Falls back to
// email-only when no Clerk user matches.
const BATCH_SIZE = 100

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }
  return result
}

export async function enrichCollaborators(
  rows: CollaboratorRow[]
): Promise<Collaborator[]> {
  if (rows.length === 0) return []

  const emails = [...new Set(rows.map((row) => row.email.toLowerCase()))]

  let users: User[] = []
  try {
    const client = await clerkClient()
    const results = await Promise.all(
      chunk(emails, BATCH_SIZE).map((batch) =>
        client.users.getUserList({ emailAddress: batch, limit: batch.length })
      )
    )
    users = results.flatMap((r) => r.data)
  } catch (error) {
    console.error('Clerk lookup failed; showing emails only:', error)
  }

  const byEmail = new Map<string, User>()
  for (const user of users) {
    for (const address of user.emailAddresses) {
      if (address.verification?.status === 'verified') {
        byEmail.set(address.emailAddress.toLowerCase(), user)
      }
    }
  }

  return rows.map((row) => {
    const user = byEmail.get(row.email.toLowerCase())
    return {
      id: row.id,
      email: row.email,
      displayName: user?.fullName ?? null,
      avatarUrl: user?.imageUrl ?? null,
    }
  })
}

// Resolves the project owner's Clerk identity (owners are tracked by Clerk
// user ID, not email, since they're set from `auth()` at project creation).
// Falls back to an email-less, name-less row if the Clerk lookup fails.
export async function getOwnerInfo(ownerId: string): Promise<Collaborator> {
  const client = await clerkClient()

  try {
    const user = await client.users.getUser(ownerId)
    const email =
      user.emailAddresses.find(
        (address) => address.id === user.primaryEmailAddressId
      )?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      ""

    return {
      id: ownerId,
      email,
      displayName: user.fullName,
      avatarUrl: user.imageUrl,
    }
  } catch {
    return { id: ownerId, email: "", displayName: null, avatarUrl: null }
  }
}
