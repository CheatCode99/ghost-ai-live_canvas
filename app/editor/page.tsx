"use client"

import { useState } from "react"

import { EditorHome, EditorNavbar } from "@/components/editor/editor-navbar"
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectManager } from "@/hooks/use-project-manager"

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const {
    projects,
    dialog,
    name,
    setName,
    slug,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  } = useProjectManager()

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
      <EditorHome onCreateProject={openCreateDialog} />

      <CreateProjectDialog
        open={dialog?.type === "create"}
        name={name}
        slug={slug}
        isLoading={isLoading}
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
        slug={slug}
        isLoading={isLoading}
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
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        onConfirm={submitDelete}
      />
    </div>
  )
}
