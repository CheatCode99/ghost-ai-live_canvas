Complete the existing AI sidebar with a placeholder and turn it into a proper floating chat sidebar component. The sidebar already exist so keep the current floating position and slide from the right behavior. We will focus on building the UI inside it.


### Implementation 

1. Separate the AI sidebar into its own component.
    - keep the open/close state controlled by parent. 
    - preserve the current float position, smoot slide in animation, border, background, and shadow styling. 
    - use sidebar surface style like `bg-base/95` , `border-surface-border`, the current shadow treatment.


2. Add sidebar header:
    - title: `AI Workspace`
    - subtitle: `Collaborate with Ghost-AI`
    - small bot icon
    - close button align to the right 
    - use `text-primary-text` for the title
    - use `text-mute-text` for the subtitle

3. Add a tabed layout with two tab.
    Use shadcn `Tabs`.
    - `AI Architect`
    - `Specs`
    - active tab should use the accent styling, like `bg-accent` and `text-accent`
    - inactive table should stay mute with `text-mute-text`

4. Build the AI Architecture tab
    - Use shadcn button where they fit, especially `Button` and `Textarea`
    - scrollable chat area
    - empty state with a bot icon, short description and starter prompt chips.
    - starter chips:
        - `Design E-commerce backend`
        - `Create a chat app architecture`
        - `Build CI/CD pipeline`
    - style the starter chip as soft bill using `bg-subtle` and `text-accent-text`
    - user's messages should be right aligned with `bg-brand-dim border-brand/50 border-2 text-copy-primary`
    - assistant assist text should be left aligned with `bg-elevated border border-surface-border text-accent-text`
    - input area with an auto-resizing textarea, around 72px minimium height and 160px maximium height
    - send button should be `bg-accent text-white`
    - `Enter` submits, `Shift+Enter` new line

5. Build the Specs tab.
    - show a `Generate Spec` button `bg-accent text-white` 
    - show a demo spec card for now.
    - style the card with `bg-elevated` and `border-surface-border`
    - include a file/spec icon, title, short snipper and disable download action

6. Use the existing project color token.
   Check `global.css` and `ui-context.md` or Tailwind before adding a direct color values. Avoid inventing new color if the matching color token already existed.


## Scope Limit:
    - don't rebuild the existing sidebar open/close behavior 
    - don't add backend logic 
    - don't add AI agent or liveblock logic yet
    - Keep this focus on UI sidebar only