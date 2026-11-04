# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Foundation setup

## Current Goal

- Define Unit 3 (next feature unit after the editor chrome shell).

## Completed

- Unit 2: Editor Chrome (`context/feature-specs/2-editor.md`)
  - Added `components/editor/editor-navbar.tsx`: fixed-height (`h-14`) client component with a 3-column grid (left/center/right sections), `bg-surface` background, `border-surface-border-subtle` bottom border. Left section holds a sidebar toggle `Button` swapping `PanelLeftOpen`/`PanelLeftClose` based on the `isSidebarOpen` prop; center and right sections are empty placeholders for future content. Sidebar open/close state is owned by the parent and passed in via `isSidebarOpen`/`onToggleSidebar` props (no internal state) so the navbar and sidebar can share it once composed into a real page.
  - Added `components/editor/project-sidebar.tsx`: `fixed` (not flex-flow) overlay positioned `inset-y-0 left-0`, so opening it never pushes page content. Slides in/out via `translate-x-full` ↔ `translate-x-0` on the `isOpen` prop. Header has a "Projects" title and a close button (`onClose` prop). Uses the existing `components/ui/tabs.tsx` primitives for "My Project" / "Shared" tabs, each rendering a one-line empty-state placeholder. Footer has a full-width primary `Button` with a `Plus` icon reading "New Project" (no click handler yet — out of scope per spec, which only asked for the shell).
  - Added `components/editor/editor-dialog.tsx`: a thin reusable wrapper (`EditorDialog`) composing the existing `components/ui/dialog.tsx` primitives (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`). Takes `open`, `onOpenChange`, `title`, optional `description`, optional `footer`, and `children` (body slot). Deliberately does not wire up any concrete dialog instance (e.g. a "new project" dialog) — per spec, "do not build the dialog yet." Styling comes entirely from the untouched `components/ui/dialog.tsx`, which already resolves to the `globals.css` tokens (`popover`, `muted`, `foreground`, etc. from Unit 1) — no new hardcoded colors were introduced.
  - Did not modify any `components/ui/*` file (protected foundation components).
  - Added `app/preview/editor/page.tsx`: a standalone preview route (separate from the real `app/page.tsx`) mounting the navbar, sidebar, and dialog pattern together so they can be checked out in the browser.
  - Bug found and fixed (via manual click-through of `/preview/editor`): `ProjectSidebar` was `fixed inset-y-0`, so while open it spanned the full viewport height starting at the very top — physically overlapping `EditorNavbar`'s top-left corner, exactly where the sidebar-toggle button lives. Being a positioned element with `z-40` against the navbar's unpositioned `nav`, the sidebar stacked above it and silently swallowed clicks on the toggle button. Fixed by positioning the sidebar at `top-14 bottom-0` (below the fixed-height `h-14` navbar) instead of `inset-y-0`, and giving the navbar `relative z-50` as a safety margin so it always stays on top and clickable regardless of what else is composed underneath it. Note: this introduces an implicit coupling — the sidebar's `top-14` offset must match the navbar's `h-14` height — acceptable for now since both are fixed per spec, but worth revisiting if the navbar height ever becomes configurable.
  - Verified: `npx tsc --noEmit` clean, `npm run lint` clean (no errors or warnings). Smoke-tested all three components together (first via a temporary mount in `app/page.tsx`, later via the permanent `/preview/editor` route) against the already-running dev server; confirmed via `curl` that the rendered HTML contains "Projects", "My Project", "New Project", and the dialog trigger text with a `200` response. The temporary `app/page.tsx` mount was reverted to its exact prior (uncommitted) content afterward — verified the diff against it is unchanged.

- Unit 1: Design System (`context/feature-specs/1-design-system.md`)
  - Installed and configured `shadcn/ui` (`components.json`, style `base-nova`, base color `neutral`, icon library `lucide-react`).
  - Added `components/ui/`: `button`, `card`, `dialog`, `input`, `tabs`, `textarea`, `scroll-area`.
  - Installed `lucide-react`.
  - `lib/utils.ts` re-exports `cn()` from the `cn` package (shadcn's own clsx+tailwind-merge replacement) — this is the CLI's generated convention, not hand-rolled.
  - Rewrote `app/globals.css`: replaced the default light/dark neutral oklch palette with the dark-only hex palette from `context/ui-context.md`, mapped onto shadcn's semantic tokens (`background`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `sidebar-*`, `chart-*`) and onto the project's own utility tokens (`bg-base`, `bg-surface`, `text-copy-primary`, `text-brand`, etc.).
  - Fixed `--font-sans`/`--font-mono` in `@theme inline` to point at the actual `--font-geist-sans`/`--font-geist-mono` variables set in `app/layout.tsx` (previously self-referential and would have fallen back to a generic sans-serif).
  - Added the `dark` class to `<html>` in `app/layout.tsx` since the app is dark-only (no light mode), so `dark:`-tuned variants in generated components apply.
  - Verified: `npx tsc --noEmit` clean, `npm run build` clean, and a temporary smoke-test render of all 7 components (fetched via curl from the running dev server) showed the dark theme applied with no runtime errors, then reverted `app/page.tsx` back to its prior placeholder content since the real homepage is out of scope for this unit.
  - Did not modify any generated `components/ui/*` file.

## In Progress

- None.

## Next Up

- Compose `editor-navbar.tsx` + `project-sidebar.tsx` into an actual editor route/page (out of scope for Unit 2, which only builds the shell components).
- Scope and write the spec for Unit 3.

## Open Questions

- None yet.

## Architecture Decisions

- `ui-context.md`'s token-to-Tailwind-utility mapping was only given by example (`bg-base`, `text-copy-primary`, etc.), not exhaustively. Resolved the full mapping and documented it directly in `context/ui-context.md` (new table) rather than guessing silently — see that file for the complete CSS-variable-to-utility table.
- shadcn's semantic tokens (`primary`, `card`, `popover`, `muted`, `destructive`, ...) are mapped onto the same dark palette rather than kept as a separate theme, so generated `components/ui/*` files render correctly themed without ever being edited.
- Bug found and fixed (post-completion check of `app/globals.css`): `--color-base` had been registered as a generic `@theme` color token for `bg-base`. Tailwind generates `bg-/text-/border-/ring-*` for every `--color-*` key, and `base` collides with Tailwind's own built-in font-size scale key (`text-base` = 1rem). The collision made `.text-base` compile to `color: var(--bg-base)` instead of `font-size: 1rem` — breaking `Input`, `Textarea`, `CardTitle`, and `DialogTitle` (all use `text-base`), making their text both the wrong size and the same near-black as the page background. Fixed by dropping `--color-base` from `@theme` and giving `bg-base` its own `@utility` rule instead, scoped to `background-color` only. Verified via the compiled CSS: `.text-base` now outputs `font-size`/`line-height` again, `.bg-base` still outputs `background-color`.

## Session Notes

- Context files (`project-overview.md`, `architecture-context.md`, `ui-context.md`, `code-standards.md`, `ai-workflow-rules.md`, `progress-tracker.md`) and `feature-specs/1-design-system.md` were copied into `context/` from the Six-File Context Methodology kit to match the entry point referenced in `AGENTS.md`.
- The project's own dev server was already running on port 3000 (PID 3272) during verification; an `npm run dev` invocation used for testing detected the port in use and exited on its own without binding — no process was left behind.
- Re-verified Unit 1 end to end on 2026-11-01 against `feature-specs/1-design-system.md`'s checklist line by line: `components/ui/*` unchanged since generation, `lucide-react` + `cn()` both exercised in a temporary smoke-test render, `npx tsc --noEmit` and `npm run build` clean, and the dev server's actual served CSS inspected directly (not just the production build) to confirm `--background`/`--primary`/`--card`/etc. resolve to the dark hex palette with no stray light/oklch defaults, and that `.text-base` and `.bg-base` both compile correctly (the earlier collision bug stayed fixed). `app/page.tsx` was restored to its exact prior content (including the user's own in-progress `<button>GT</button>`) afterward. Everything in the spec holds — the plain native `<button>` in `page.tsx` is outside the design system (not the shadcn `Button` component) and renders with default browser chrome by design; that's not a defect in Unit 1.
