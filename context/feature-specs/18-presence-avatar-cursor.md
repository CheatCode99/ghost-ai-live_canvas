Show active room participants inside the editor canvas view, without changing the editor home navbar.

## Implementation

1. Keep the following navbar behavior as it is:
    - do not change the editor home navbar
    - do not move or redesign the shared navbar component globally
    - if the editor home and editor canvas use the same component, make sure this UI presence only appears in editor/canvas room view.

2. Add the participants avatar group in the editor canvas area.
    - position it at the top right of the canvas view
    - keep it visually separate from the main editor navbar actions
    - get the current user's id from active Clerk session
    - filter the Liveblocks presence list to exclude any entry to whose user id match the current Clerk user Id
    - render the filtered list as collaborator avatar only 
    - render the current user separately using the existing Clerk UserButton - Do not render a second avatar for them from Liveblock presence list
    - Keep the Clerk Userbutton and collaborator avatar the same size so the group visually consistent.
    - collaborator avatar is display-only, not interactive
    - use a divider that separate Clerk UserButton from a collaborator avatars only when one collaborator exists
    - If no collaborator exists, do not display a divider only show Clerk UserButton.

3. Render the collaborators avatars.
    - use profile photos when available
    - fall back to initial when the image is not available
    - show up to 5 collaborator avatars overlapping stack
    - show +N chip when there are more than 5 collaborators 
    - add a subtle ring around the avatar so it stay readable on the dark canvas.

4. Add live cursors to the canvas.
    - render the cursor for the other participants only, not for the current user
    - use the exisiting Liveblocks presence state to broadcast cursor position
    - update cursor position to on React Flow's onMouseMove event
    - clear cursor to null when mouse leave
    - show a small colored pointer with a name badge attach on it.
    - match the cursor color and name badge color to the participant presence color.

5. Define a shared presence type in 'Liveblocks.config.ts'
    presence should include:
        - `cursor` : `{ x: number; y: number } | null`
        - `thinking` : boolean

### Scope limit:

    - don't add participants avatar and nav bar globally
    - don't remove the current nav bar actions
    - don't replace Clerk user/profile/logout behavior
    - don't make collaborator avatars interactive 
    - don't change the canvas node, or edge behavior 