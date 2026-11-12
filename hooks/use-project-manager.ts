"use client"

import { useCallback, useState } from "react"

import { MOCK_PROJECTS } from "@/lib/mock-projects"
import { slugify } from "@/lib/slug"
import type { Project } from "@/types/project"

type ProjectDialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

const SUBMIT_DELAY_MS = 400

export function useProjectManager() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [dialog, setDialog] = useState<ProjectDialogState>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const openCreateDialog = useCallback(() => {
    setName("")
    setDialog({ type: "create" })
  }, [])

  const openRenameDialog = useCallback((project: Project) => {
    setName(project.name)
    setDialog({ type: "rename", project })
  }, [])

  const openDeleteDialog = useCallback((project: Project) => {
    setDialog({ type: "delete", project })
  }, [])

  const closeDialog = useCallback(() => {
    setDialog(null)
    setName("")
  }, [])

  const submitCreate = useCallback(() => {
    const trimmed = name.trim()
    const nextSlug = slugify(trimmed)
    if (!trimmed || !nextSlug) return

    setIsLoading(true)
    window.setTimeout(() => {
      setProjects((prev) => [
        ...prev,
        {
          id: `proj-${Date.now()}`,
          name: trimmed,
          slug: nextSlug,
          role: "owner",
        },
      ])
      setIsLoading(false)
      setDialog(null)
      setName("")
    }, SUBMIT_DELAY_MS)
  }, [name])

  const submitRename = useCallback(() => {
    if (dialog?.type !== "rename") return
    const trimmed = name.trim()
    const nextSlug = slugify(trimmed)
    if (!trimmed || !nextSlug) return
    const { project } = dialog

    setIsLoading(true)
    window.setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, name: trimmed, slug: nextSlug } : p
        )
      )
      setIsLoading(false)
      setDialog(null)
      setName("")
    }, SUBMIT_DELAY_MS)
  }, [dialog, name])

  const submitDelete = useCallback(() => {
    if (dialog?.type !== "delete") return
    const { project } = dialog

    setIsLoading(true)
    window.setTimeout(() => {
      setProjects((prev) => prev.filter((p) => p.id !== project.id))
      setIsLoading(false)
      setDialog(null)
    }, SUBMIT_DELAY_MS)
  }, [dialog])

  return {
    projects,
    dialog,
    name,
    setName,
    slug: slugify(name),
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
