"use client"

import { useState } from "react"

import { EditorHome, EditorNavbar } from "@/components/editor/editor-navbar"
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/types/project"

interface EditorShellProps {
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProject?: Project | null
}

export function EditorShell({
  ownedProjects,
  sharedProjects,
  activeProject = null,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const {
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
  } = useProjectActions({ activeProjectId: activeProject?.id })

  const projects = [...ownedProjects, ...sharedProjects]

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        onCreateProject={openCreateDialog}
        onRenameProject={openRenameDialog}
        onDeleteProject={openDeleteDialog}
      />
      {activeProject ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
          <h1 className="text-xl font-medium text-copy-primary">
            {activeProject.name}
          </h1>
          <p className="max-w-sm text-sm text-copy-muted">
            The canvas workspace isn&apos;t built yet.
          </p>
        </div>
      ) : (
        <EditorHome onCreateProject={openCreateDialog} />
      )}

      <CreateProjectDialog
        open={dialog?.type === "create"}
        name={name}
        roomId={roomIdPreview}
        isValid={isNameValid}
        isLoading={isLoading}
        error={error}
        onNameChange={setName}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        onSubmit={submitCreate}
      />
      <RenameProjectDialog
        open={dialog?.type === "rename"}
        projectName={dialog?.type === "rename" ? dialog.project.name : ""}
        name={name}
        isValid={isNameValid}
        isLoading={isLoading}
        error={error}
        onNameChange={setName}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        onSubmit={submitRename}
      />
      <DeleteProjectDialog
        open={dialog?.type === "delete"}
        projectName={dialog?.type === "delete" ? dialog.project.name : ""}
        isLoading={isLoading}
        error={error}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        onConfirm={submitDelete}
      />
    </div>
  )
}
