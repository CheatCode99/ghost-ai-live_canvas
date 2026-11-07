import { dark } from "@clerk/ui/themes"
import type { Appearance } from "@clerk/ui"

export const clerkAppearance: Appearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorBackground: "var(--bg-surface)",
    colorForeground: "var(--text-primary)",
    colorMutedForeground: "var(--text-muted)",
    colorNeutral: "var(--text-secondary)",
    colorInput: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorBorder: "var(--border-default)",
    colorRing: "var(--accent-primary)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    colorShadow: "var(--bg-base)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyMono: "var(--font-geist-mono)",
    borderRadius: "var(--radius-xl)",
  },
  elements: {
    cardBox: {
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-3xl)",
      boxShadow: "none",
    },
    card: {
      padding: "2rem",
    },
    headerTitle: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    headerSubtitle: {
      color: "var(--text-muted)",
    },
    formFieldInput: {
      borderRadius: "var(--radius-xl)",
    },
    footerActionLink: {
      color: "var(--accent-primary)",
      fontWeight: 600,
    },

    // Primary submit button ("Continue" / "Sign in") — made unmistakably
    // the main call to action: solid brand fill, bold label, full width,
    // and a visible hover/active state instead of relying on a faint
    // opacity shift.
    formButtonPrimary: {
      backgroundColor: "var(--accent-primary)",
      color: "var(--bg-base)",
      borderRadius: "var(--radius-xl)",
      fontWeight: 600,
      fontSize: "0.9375rem",
      padding: "0.75rem 1rem",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "var(--accent-primary)",
        opacity: 0.9,
      },
      "&:focus": {
        boxShadow: "0 0 0 3px var(--accent-primary-dim)",
      },
      "&:active": {
        opacity: 0.85,
      },
    },

    // "Sign in another way" / strategy-switch buttons and OAuth buttons —
    // these ship nearly invisible against a dark card by default (faint
    // border, no fill). Give them a solid surface fill and a clear border
    // so they read as clickable, not as plain text.
    alternativeMethodsBlockButton: {
      backgroundColor: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)",
      color: "var(--text-primary)",
      fontWeight: 500,
      "&:hover": {
        backgroundColor: "var(--bg-subtle)",
        borderColor: "var(--border-subtle)",
      },
    },
    socialButtonsBlockButton: {
      backgroundColor: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-xl)",
      color: "var(--text-primary)",
      fontWeight: 500,
      "&:hover": {
        backgroundColor: "var(--bg-subtle)",
        borderColor: "var(--border-subtle)",
      },
    },
  },
}
