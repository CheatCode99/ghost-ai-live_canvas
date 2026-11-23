Add a small floating color toolbar so selected nodes can change both their background color and text color directly on the canvas.

## Implementation

1. Check 'ui-context.md' for node color palletes.
    each palletes option should include:
        - a node background color
        - a matching text color.

    reuse existing theme colors if they already exists in 'global.css'. Otherwise keep the palletes in the canvas types/constants, such as 'types/canvas.ts'.

2. Add a toolbar over a selected node.
    - only shows it when the node is selected.
    - keep it slightly above the node without overlapping it.
    - show one swatch per color pair.
    - active swatch should appear clearly selected.
    - hovering a swatch should show a subtle glow based on its text color.
    - keep the glow tight and controlled without overly blurred.
    - prevent toolbar interaction from dragging or panning the canvas.

3. When the swatch is selected:
    - update both the node background color and text color
    - update the nodes UI immediately
    - Keep this inside the existing collaborative canvas state.
    - no server calls

4. Selected node should visually reflect their active color pair.

    the node background updates to the selected color, and the text automatically updates to its pair text color.

### Scope limit

    - don't change drag/drop behavior 
    - don't rebuild node selection logic
    - don't add full color picker
    - keep this focus on predetermine color theme only.

### Check when done:

- nodes use predifine background/text color pair.
- selected nodes show a floating color toolbar.
- swatch selecting update the node and text color.
- 'npm run build' passes with no type errors.
