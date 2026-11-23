"use client"

import { UserButton } from "@clerk/nextjs"
import { LayoutTemplate, PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isAiSidebarOpen: boolean
  onToggleAiSidebar: () => void
  onOpenShare: () => void
  onOpenTemplates: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onToggleSidebar,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onOpenShare,
  onOpenTemplates,
}: WorkspaceNavbarProps) {
  return (
    <nav className="relative z-50 grid h-14 w-full shrink-0 grid-cols-3 items-center border-b border-surface-border-subtle bg-surface px-4">
      <div className="flex items-center justify-start gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex items-center justify-center">
        <span className="truncate text-sm font-medium text-copy-primary">
          {projectName}
        </span>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onOpenTemplates}
        >
          <LayoutTemplate className="h-4 w-4" />
          Templates
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onOpenShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button
          variant={isAiSidebarOpen ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={onToggleAiSidebar}
          aria-label={isAiSidebarOpen ? "Close AI chat" : "Open AI chat"}
        >
          <Sparkles className="h-5 w-5" />
        </Button>
        <UserButton />
      </div>
    </nav>
  )
}
