"use client"

import { EditorDialog } from "@/components/editor/editor-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CreateProjectDialogProps {
  open: boolean
  name: string
  slug: string
  isLoading: boolean
  onNameChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function CreateProjectDialog({
  open,
  name,
  slug,
  isLoading,
  onNameChange,
  onOpenChange,
  onSubmit,
}: CreateProjectDialogProps) {
  const isInvalid = name.trim().length > 0 && slug.length === 0

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create project"
      description="Start a new architecture workspace."
      footer={
        <Button onClick={onSubmit} disabled={!slug || isLoading}>
          {isLoading ? "Creating..." : "Create project"}
        </Button>
      }
    >
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-project-name"
            className="text-sm text-copy-secondary"
          >
            Project name
          </label>
          <Input
            id="create-project-name"
            autoFocus
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="My architecture project"
            aria-invalid={isInvalid}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-copy-faint">Slug</span>
          <p className="truncate text-sm text-copy-secondary">{slug || "—"}</p>
          {isInvalid ? (
            <p className="text-xs text-error">
              Name must include at least one letter or number.
            </p>
          ) : null}
        </div>
      </form>
    </EditorDialog>
  )
}

interface RenameProjectDialogProps {
  open: boolean
  projectName: string
  name: string
  slug: string
  isLoading: boolean
  onNameChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}

export function RenameProjectDialog({
  open,
  projectName,
  name,
  slug,
  isLoading,
  onNameChange,
  onOpenChange,
  onSubmit,
}: RenameProjectDialogProps) {
  const isInvalid = name.trim().length > 0 && slug.length === 0

  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Rename project"
      description={`Rename "${projectName}".`}
      footer={
        <Button onClick={onSubmit} disabled={!slug || isLoading}>
          {isLoading ? "Renaming..." : "Rename"}
        </Button>
      }
    >
      <form
        className="flex flex-col gap-1.5"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <label htmlFor="rename-project-name" className="sr-only">
          Project name
        </label>
        <Input
          id="rename-project-name"
          autoFocus
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          aria-invalid={isInvalid}
        />
        {isInvalid ? (
          <p className="text-xs text-error">
            Name must include at least one letter or number.
          </p>
        ) : null}
      </form>
    </EditorDialog>
  )
}

interface DeleteProjectDialogProps {
  open: boolean
  projectName: string
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteProjectDialog({
  open,
  projectName,
  isLoading,
  onOpenChange,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete project"
      description={`This permanently deletes "${projectName}". This action cannot be undone.`}
      footer={
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete project"}
        </Button>
      }
    />
  )
}
