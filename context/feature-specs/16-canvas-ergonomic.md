Add control bar for zoom, undo/redo, then wire that same action to keyboard shortcuts.

### Implementation

1. Add a pill-shaped control at the bottom left of the canvas.
    it should sit above the shape panel, and include two groups:
        - zoom controls: zoom in, zoom out, fit view 
        - history controls: redo, undo

    separate the two group with a thin divider.

2. wired the zoom controls to the react flow instance.
    - zoom in
    - zoom out
    - fit view
    - add a short animation so the movement feels smooth.

3. Wire undo and redo to LiveBlocks history.
    - use the existing liveblocks undo/redo hook.
    - disable the undo when there is nothing to undo
    - disable the redo when there is nothing to redo
    - keep the disable button visibly dimmed.

4. Create 'useKeyboardShortcuts' hook in '/hooks/'.
    the hooks should:
        - recieve react flow instance
        - recieve undo and redo handlers.
        - listen for keyboard shortcut on 'window'
        - ignore shortcuts while typing in input, textarea, or editable textfield.

5. support these shortcuts:

    - '+' and '=' for zoom in
    - '-' for zoom out
    - 'Cmd/Ctrl + Z' to undo
    - 'Cmd/Ctrl + Shift + Z' to redo
    - 'Cmd/Ctrl + Y' to undo

## Scope limits

- don't change the shape panel
- don't change node or edge rendering
- don't add extra canvas controls 
- don't change the collaborative canvas state.
