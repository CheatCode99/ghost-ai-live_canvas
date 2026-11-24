"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { AiSidebar } from "@/components/editor/ai-sidebar"
import { CanvasRoom } from "@/components/editor/canvas-room"
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { CANVAS_TEMPLATES } from "@/components/editor/starter-templates"
import type { CanvasTemplate, TemplateImportRequest } from "@/components/editor/starter-templates"
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal"
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar"
import type { SaveStatus } from "@/hooks/use-canvas-autosave"
import { pendingTemplateStorageKey, useProjectActions } from "@/hooks/use-project-actions"
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
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [manualSaveToken, setManualSaveToken] = useState(0)
  const [importRequest, setImportRequest] = useState<TemplateImportRequest | null>(() => {
    if (typeof window === "undefined") return null
    const key = pendingTemplateStorageKey(project.id)
    const templateId = sessionStorage.getItem(key)
    if (!templateId) return null
    sessionStorage.removeItem(key)
    const template = CANVAS_TEMPLATES.find((candidate) => candidate.id === templateId)
    return template ? { template, requestId: Date.now() } : null
  })
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

  function handleImportTemplate(template: CanvasTemplate) {
    setImportRequest({ template, requestId: Date.now() })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base">
      <WorkspaceNavbar
        projectName={project.name}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        isAiSidebarOpen={isAiSidebarOpen}
        onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
        onOpenShare={shareDialog.open}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        saveStatus={saveStatus}
        onManualSave={() => setManualSaveToken((token) => token + 1)}
      />

      <div className="relative flex-1 overflow-hidden">
        <main className="h-full w-full bg-base">
          <CanvasRoom
            roomId={project.id}
            importRequest={importRequest}
            onImportHandled={() => setImportRequest(null)}
            onSaveStatusChange={setSaveStatus}
            manualSaveToken={manualSaveToken}
          />
        </main>

        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          projects={projects}
          activeProjectId={project.id}
          onCreateProject={openCreateDialog}
          onSelectProject={(selected) => {
            if (selected.id === project.id) return
            router.push(`/editor/${selected.id}`)
          }}
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

      <StarterTemplatesModal
        open={isTemplatesOpen}
        onOpenChange={setIsTemplatesOpen}
        onImport={handleImportTemplate}
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
