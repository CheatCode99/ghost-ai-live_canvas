"use client"

import { useState } from "react"

import { AiSidebar } from "@/components/editor/ai-sidebar"
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar"
import { useProjectActions } from "@/hooks/use-project-actions"
import { useShareDialog } from "@/hooks/use-share-dialog"
import type { Project } from "@/types/project"

interface WorkspaceShellProps {
  project: Project
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function WorkspaceShell({
  project,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const shareDialog = useShareDialog(project.id)
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
  } = useProjectActions({ activeProjectId: project.id })

  const projects = [...ownedProjects, ...sharedProjects]

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base">
      <WorkspaceNavbar
        projectName={project.name}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
        onOpenShare={shareDialog.open}
      />

      <div className="relative flex-1 overflow-hidden">
        <main className="flex h-full w-full items-center justify-center bg-base">
          <p className="text-sm text-copy-muted">Canvas coming soon</p>
        </main>

        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          projects={projects}
          activeProjectId={project.id}
          onCreateProject={openCreateDialog}
          onRenameProject={openRenameDialog}
          onDeleteProject={openDeleteDialog}
        />

        <AiSidebar
          isOpen={isAiSidebarOpen}
          onClose={() => setIsAiSidebarOpen(false)}
        />
      </div>

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

      <ShareDialog
        open={shareDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) shareDialog.close()
        }}
        projectName={project.name}
        role={project.role}
        owner={shareDialog.owner}
        collaborators={shareDialog.collaborators}
        isLoading={shareDialog.isLoading}
        inviteEmail={shareDialog.inviteEmail}
        onInviteEmailChange={shareDialog.setInviteEmail}
        onInvite={shareDialog.invite}
        isInviting={shareDialog.isInviting}
        inviteError={shareDialog.inviteError}
        removingId={shareDialog.removingId}
        onRemove={shareDialog.remove}
        isCopied={shareDialog.isCopied}
        onCopyLink={shareDialog.copyLink}
        shareUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
    </div>
  )
}
