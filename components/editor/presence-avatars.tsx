"use client"

import { useUser } from "@clerk/nextjs"
import { shallow, useOthers } from "@liveblocks/react"

const MAX_VISIBLE_COLLABORATORS = 5
const AVATAR_SIZE_CLASS = "h-8 w-8"

interface Person {
  name: string
  avatarUrl: string
}

export function PresenceAvatars() {
  const { user } = useUser()
  const currentUserId = user?.id

  const collaborators = useOthers(
    (others) =>
      others
        .filter((other) => other.id !== currentUserId)
        .map((other) => ({
          connectionId: other.connectionId,
          name: other.info.name,
          avatarUrl: other.info.avatarUrl,
        })),
    shallow,
  )

  const visibleCollaborators = collaborators.slice(0, MAX_VISIBLE_COLLABORATORS)
  const overflowCount = collaborators.length - visibleCollaborators.length

  const currentUserName = user?.fullName || user?.primaryEmailAddress?.emailAddress || "You"

  return (
    <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-surface-border bg-surface/90 px-2 py-1.5 shadow-lg backdrop-blur">
      {/* Display-only — this is not the account-management UserButton (that stays in the navbar); clicking here must not open a menu. */}
      <PresenceAvatar name={currentUserName} avatarUrl={user?.imageUrl ?? ""} />

      {collaborators.length > 0 && (
        <>
          <div className="h-5 w-px bg-surface-border-subtle" />
          <div className="flex items-center -space-x-2">
            {visibleCollaborators.map((collaborator) => (
              <PresenceAvatar
                key={collaborator.connectionId}
                name={collaborator.name}
                avatarUrl={collaborator.avatarUrl}
              />
            ))}
            {overflowCount > 0 && (
              <div
                className={`${AVATAR_SIZE_CLASS} flex items-center justify-center rounded-full border-2 border-surface bg-elevated text-xs font-medium text-copy-secondary ring-1 ring-surface-border-subtle`}
              >
                +{overflowCount}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function PresenceAvatar({ name, avatarUrl }: Person) {
  const initial = name ? name.charAt(0).toUpperCase() : "?"

  return (
    <div
      title={name}
      className={`${AVATAR_SIZE_CLASS} overflow-hidden rounded-full border-2 border-surface bg-elevated ring-1 ring-surface-border-subtle`}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-medium text-copy-secondary">
          {initial}
        </div>
      )}
    </div>
  )
}
