"use client"

import type { ReactNode } from "react"
import { Check, Copy, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Collaborator } from "@/types/collaborator"
import type { ProjectRole } from "@/types/project"

function initials(label: string): string {
  return label.trim().slice(0, 1).toUpperCase() || "?"
}

function PersonRow({
  person,
  trailing,
}: {
  person: Collaborator
  trailing?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-subtle">
      <div className="flex min-w-0 items-center gap-2">
        <Avatar size="sm">
          {person.avatarUrl ? (
            <AvatarImage src={person.avatarUrl} alt="" />
          ) : null}
          <AvatarFallback>
            {initials(person.displayName ?? person.email)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm text-copy-primary">
            {person.displayName ?? (person.email || "Unknown")}
          </span>
          {person.displayName && person.email ? (
            <span className="truncate text-xs text-copy-muted">
              {person.email}
            </span>
          ) : null}
        </div>
      </div>
      {trailing}
    </div>
  )
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectName: string
  role: ProjectRole
  owner: Collaborator | null
  collaborators: Collaborator[]
  isLoading: boolean
  inviteEmail: string
  onInviteEmailChange: (value: string) => void
  onInvite: () => void
  isInviting: boolean
  inviteError: string | null
  removingId: string | null
  onRemove: (collaboratorId: string) => void
  isCopied: boolean
  onCopyLink: () => void
  shareUrl: string
}

export function ShareDialog({
  open,
  onOpenChange,
  projectName,
  role,
  owner,
  collaborators,
  isLoading,
  inviteEmail,
  onInviteEmailChange,
  onInvite,
  isInviting,
  inviteError,
  removingId,
  onRemove,
  isCopied,
  onCopyLink,
  shareUrl,
}: ShareDialogProps) {
  const isOwner = role === "owner"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {`Manage access to "${projectName}".`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Input readOnly value={shareUrl} className="text-copy-secondary" />
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onCopyLink}
              aria-label="Copy project link"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {isCopied ? <p className="text-xs text-success">Copied!</p> : null}
        </div>

        {isOwner ? (
          <form
            className="flex flex-col gap-1.5"
            onSubmit={(event) => {
              event.preventDefault()
              onInvite()
            }}
          >
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="Invite by email"
                value={inviteEmail}
                onChange={(event) => onInviteEmailChange(event.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isInviting || !inviteEmail.trim()}
              >
                {isInviting ? "Inviting..." : "Invite"}
              </Button>
            </div>
            {inviteError ? (
              <p className="text-xs text-error">{inviteError}</p>
            ) : null}
          </form>
        ) : null}

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-copy-faint">Owner</span>
          {isLoading ? (
            <p className="py-2 text-center text-sm text-copy-muted">
              Loading...
            </p>
          ) : owner ? (
            <PersonRow person={owner} />
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-copy-faint">
            Collaborators
          </span>
          <ScrollArea className="max-h-64">
            <div className="flex flex-col gap-1 pr-2">
              {isLoading ? (
                <p className="py-4 text-center text-sm text-copy-muted">
                  Loading...
                </p>
              ) : collaborators.length === 0 ? (
                <p className="px-2 py-2 text-center text-xs text-copy-muted">
                  No collaborators yet.
                </p>
              ) : (
                collaborators.map((collaborator) => (
                  <PersonRow
                    key={collaborator.id}
                    person={collaborator}
                    trailing={
                      isOwner ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onRemove(collaborator.id)}
                          disabled={removingId === collaborator.id}
                          aria-label={`Remove ${collaborator.email}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : undefined
                    }
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
