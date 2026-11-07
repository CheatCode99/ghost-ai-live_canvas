"use client"

import { useState } from "react"

import { EditorDialog } from "@/components/editor/editor-dialog"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { Button } from "@/components/ui/button"

export default function EditorPreviewPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <p className="text-sm text-copy-faint">
          Editor canvas — out of scope for Unit 2.
        </p>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Preview dialog pattern
        </Button>
      </div>
      <EditorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Dialog pattern"  
        description="Reusable wrapper over components/ui/dialog.tsx — title, description, and footer actions."
        footer={<Button onClick={() => setIsDialogOpen(false)}>Close</Button>}
      >
        <p className="text-sm text-copy-secondary">Body content slot.</p>
      </EditorDialog>
    </div>
  )
}
