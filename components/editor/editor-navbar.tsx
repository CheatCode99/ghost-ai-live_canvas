"use client"

import { UserButton } from "@clerk/nextjs"
import { LayoutGrid, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react"
import type { ReactNode } from "react"

import { CANVAS_TEMPLATES } from "@/components/editor/starter-templates"
import { TemplatePreview } from "@/components/editor/template-preview"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
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
      <div className="flex items-center justify-center" />
      <div className="flex items-center justify-end">
        <UserButton />
      </div>
    </nav>
  )
}

interface EditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  footer?: ReactNode
  children?: ReactNode
}

export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  )
}

interface EditorHomeProps {
  onCreateProject: (templateId: string | null) => void
}

export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 overflow-y-auto px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-xl font-medium text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="max-w-sm text-sm text-copy-muted">
          Start from a blank canvas or a starter template, or choose a project from the sidebar
        </p>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <div className="flex h-[140px] items-center justify-center bg-subtle">
            <LayoutGrid className="h-8 w-8 text-copy-faint" />
          </div>
          <CardHeader>
            <CardTitle>Blank Canvas</CardTitle>
            <CardDescription>Start from an empty canvas and build your own architecture.</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button
              type="button"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => onCreateProject(null)}
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </CardFooter>
        </Card>

        {CANVAS_TEMPLATES.map((template) => (
          <Card key={template.id}>
            <div className="flex h-[140px] items-center justify-center bg-subtle">
              <TemplatePreview template={template} />
            </div>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button
                type="button"
                size="sm"
                className="w-full"
                onClick={() => onCreateProject(template.id)}
              >
                Use template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
