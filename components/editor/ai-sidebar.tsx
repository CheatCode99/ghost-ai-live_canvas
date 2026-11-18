"use client"

import { Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed top-14 bottom-0 right-0 z-40 flex w-80 flex-col border-l border-surface-border-subtle bg-surface/95 backdrop-blur-sm transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border-subtle px-4 py-3">
        <h2 className="text-sm font-medium text-copy-primary">AI Chat</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close AI chat"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
        <Sparkles className="h-8 w-8 text-ai-text" />
        <p className="text-sm text-copy-muted">AI chat is coming soon.</p>
      </div>
    </aside>
  )
}
