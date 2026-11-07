import { FileText, Ghost, Sparkles, Users } from "lucide-react"

const FEATURES = [
  {
    icon: Sparkles,
    text: "Describe a system in plain English and let AI map it to a canvas.",
  },
  {
    icon: Users,
    text: "Refine the architecture together in a real-time shared workspace.",
  },
  {
    icon: FileText,
    text: "Generate a persistent Markdown technical spec from the graph.",
  },
]

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="hidden w-1/2 flex-col border-r border-surface-border-subtle bg-surface px-16 py-20 lg:flex">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-dim">
            <Ghost className="h-6 w-6 text-brand" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-copy-primary">
            Ghost AI
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-10">
          <p className="max-w-lg text-5xl leading-[1.1] font-bold tracking-tight text-copy-primary">
            Design systems with AI, together.
          </p>
          <ul className="flex max-w-lg flex-col gap-6">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-dim">
                  <Icon className="h-5 w-5 text-brand" />
                </span>
                <span className="text-base leading-snug text-copy-secondary">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex w-full items-center justify-center px-6 py-20 lg:w-1/2">
        {children}
      </div>
    </div>
  )
}
