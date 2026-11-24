"use client"

import { useState, type KeyboardEvent } from "react"
import { Bot, Download, FileText, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

const STARTER_PROMPTS = [
  "Design E-commerce backend",
  "Create a chat app architecture",
  "Build CI/CD pipeline",
]

const TAB_TRIGGER_CLASS =
  "text-copy-muted data-active:bg-accent-dim data-active:text-brand"

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed top-14 bottom-0 right-0 z-40 flex w-80 flex-col border-l border-surface-border bg-base/95 shadow-2xl backdrop-blur-sm transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-ai-text" />
          <div>
            <h2 className="text-sm font-medium text-copy-primary">AI Workspace</h2>
            <p className="text-xs text-copy-muted">Collaborate with Ghost-AI</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close AI sidebar"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs
        defaultValue="architect"
        className="flex flex-1 flex-col overflow-hidden px-4 pt-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="architect" className={TAB_TRIGGER_CLASS}>
            AI Architect
          </TabsTrigger>
          <TabsTrigger value="specs" className={TAB_TRIGGER_CLASS}>
            Specs
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="architect"
          className="flex flex-1 flex-col overflow-hidden pt-3"
        >
          <AiArchitectTab />
        </TabsContent>
        <TabsContent value="specs" className="flex-1 overflow-y-auto pt-3 pb-4">
          <SpecsTab />
        </TabsContent>
      </Tabs>
    </aside>
  )
}

function AiArchitectTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")

  function sendMessage(content: string) {
    const trimmed = content.trim()
    if (!trimmed) return
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ])
    setInput("")
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onSelectPrompt={sendMessage} />
        ) : (
          <div className="flex flex-col gap-3 pb-3">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-surface-border py-3">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the system you want to build..."
            className="min-h-24 max-h-40 w-full resize-none overflow-y-auto bg-elevated pr-11"
          />
          <Button
            size="icon-sm"
            className="absolute bottom-2 right-2 bg-brand text-white hover:bg-brand/90"
            onClick={() => sendMessage(input)}
            disabled={input.trim().length === 0}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  onSelectPrompt,
}: {
  onSelectPrompt: (prompt: string) => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-2 text-center">
      <Bot className="h-8 w-8 text-ai-text" />
      <p className="text-sm text-copy-muted">
        Describe a system and Ghost-AI will help you design it on the canvas.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="rounded-full bg-subtle px-3 py-1.5 text-xs text-ai-text transition-colors hover:bg-subtle/70"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
          isUser
            ? "border-2 border-brand/50 bg-accent-dim text-copy-primary"
            : "border border-surface-border bg-elevated text-ai-text"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

function SpecsTab() {
  return (
    <div className="flex flex-col gap-4">
      <Button className="w-full bg-brand text-white hover:bg-brand/90">
        Generate Spec
      </Button>

      <Card className="border border-surface-border bg-elevated">
        <CardContent className="flex flex-col gap-3 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-subtle">
              <FileText className="h-4 w-4 text-ai-text" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium text-copy-primary">
                E-commerce Backend Spec
              </h3>
              <p className="text-xs text-copy-muted">
                Service boundaries, data models, and API contracts generated
                from your canvas.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full gap-1.5" disabled>
            <Download className="h-4 w-4" />
            Download
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
