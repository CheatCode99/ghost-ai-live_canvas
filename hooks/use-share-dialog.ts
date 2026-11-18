"use client"

import { useCallback, useState } from "react"

import type { Collaborator } from "@/types/collaborator"

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null)
  if (
    body &&
    typeof body === "object" &&
    "error" in body &&
    typeof (body as { error: unknown }).error === "string"
  ) {
    return (body as { error: string }).error
  }
  return "Something went wrong. Please try again."
}

export function useShareDialog(projectId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [owner, setOwner] = useState<Collaborator | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const loadCollaborators = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`)
      if (!response.ok) return

      const { owner: ownerData, collaborators: data } =
        (await response.json()) as {
          owner: Collaborator
          collaborators: Collaborator[]
        }
      setOwner(ownerData)
      setCollaborators(data)
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  const open = useCallback(() => {
    setIsOpen(true)
    setInviteEmail("")
    setInviteError(null)
    setIsCopied(false)
    loadCollaborators()
  }, [loadCollaborators])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const invite = useCallback(async () => {
    const email = inviteEmail.trim()
    if (!email) return

    setIsInviting(true)
    setInviteError(null)
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        setInviteError(await readErrorMessage(response))
        return
      }

      const { collaborator } = (await response.json()) as {
        collaborator: Collaborator
      }
      setCollaborators((current) => [...current, collaborator])
      setInviteEmail("")
    } catch {
      setInviteError("Something went wrong. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }, [projectId, inviteEmail])

  const remove = useCallback(
    async (collaboratorId: string) => {
      setRemovingId(collaboratorId)
      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators/${collaboratorId}`,
          { method: "DELETE" }
        )
        if (!response.ok) return

        setCollaborators((current) =>
          current.filter((collaborator) => collaborator.id !== collaboratorId)
        )
      } finally {
        setRemovingId(null)
      }
    },
    [projectId]
  )

  const copyLink = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard not available');
      }
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      
      window.prompt('Copy this link:', window.location.href);
    }
  }, []);

  return {
    isOpen,
    open,
    close,
    owner,
    collaborators,
    isLoading,
    inviteEmail,
    setInviteEmail,
    invite,
    isInviting,
    inviteError,
    remove,
    removingId,
    isCopied,
    copyLink,
  }
}
