"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

import { slugify } from "@/lib/slug"
import type { Project } from "@/types/project"

type ProjectDialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

interface UseProjectActionsOptions {
  activeProjectId?: string
}

function generateRoomSuffix(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function pendingTemplateStorageKey(projectId: string): string {
  return `ghost-ai:pending-template:${projectId}`
}

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

export function useProjectActions({
  activeProjectId,
}: UseProjectActionsOptions = {}) {
  const router = useRouter()
  const [dialog, setDialog] = useState<ProjectDialogState>(null)
  const [name, setName] = useState("")
  const [roomSuffix, setRoomSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const slug = slugify(name)
  const isNameValid = slug.length > 0
  const roomIdPreview = isNameValid ? `${slug}-${roomSuffix}` : ""

  const openCreateDialog = useCallback((templateId: string | null = null) => {
    setName("")
    setRoomSuffix(generateRoomSuffix())
    setError(null)
    setSelectedTemplateId(templateId)
    setDialog({ type: "create" })
  }, [])

  const openRenameDialog = useCallback((project: Project) => {
    setName(project.name)
    setError(null)
    setDialog({ type: "rename", project })
  }, [])

  const openDeleteDialog = useCallback((project: Project) => {
    setError(null)
    setDialog({ type: "delete", project })
  }, [])

  const closeDialog = useCallback(() => {
    setDialog(null)
    setName("")
    setError(null)
    setSelectedTemplateId(null)
  }, [])

  const submitCreate = useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed || !isNameValid) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, id: roomIdPreview }),
      })

      if (!response.ok) {
        setError(await readErrorMessage(response))
        return
      }

      const { project } = (await response.json()) as { project: { id: string } }
      setDialog(null)
      setName("")
      if (selectedTemplateId) {
        // sessionStorage, not a URL query param: a query param would make the import
        // triggerable by anyone who gets a collaborator to open a crafted link, with no
        // confirmation step. This only fires right after this tab created the project.
        sessionStorage.setItem(pendingTemplateStorageKey(project.id), selectedTemplateId)
      }
      // Refresh the current route's data before navigating away: Cache
      // Components freezes this page's last render via Activity instead of
      // unmounting it, and only a fresh push/replace re-renders on its own —
      // browser back restores that frozen snapshot verbatim. Refreshing here
      // means the new project is already in the frozen copy, so back
      // navigation shows it without needing a manual reload.
      router.refresh()
      router.push(`/editor/${project.id}`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [name, isNameValid, roomIdPreview, selectedTemplateId, router])

  const submitRename = useCallback(async () => {
    if (dialog?.type !== "rename") return
    const trimmed = name.trim()
    if (!trimmed || !isNameValid) return
    const { project } = dialog

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      })

      if (!response.ok) {
        setError(await readErrorMessage(response))
        return
      }

      setDialog(null)
      setName("")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [dialog, name, isNameValid, router])

  const submitDelete = useCallback(async () => {
    if (dialog?.type !== "delete") return
    const { project } = dialog

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        setError(await readErrorMessage(response))
        return
      }

      setDialog(null)
      if (project.id === activeProjectId) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [dialog, activeProjectId, router])

  return {
    dialog,
    name,
    setName,
    isNameValid,
    roomIdPreview,
    isLoading,
    error,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
