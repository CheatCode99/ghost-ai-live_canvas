Add resizing and inline label editing to canvas node.

### Implementation
1. Add resizing.
    - Selected nodes should shows resize handle.
    - Prevent node from resizing below minimium size.
    - Keep the resize handle consistent with the dark canvas UI.

2. Add inline label editing:
    - keep the label centered inside the node.
    - double click on the center/label of the node to edit its label.
    - show placeholder text in the same centered position when the label is empty.
    - Keep the label editing smooth without causing the canvas layout shift.
    - Show text-area directly over the label during editing.
    - update the label as the user types.
    - Close editing on blur or Escape.
    - Prevent text editing interaction from panning or dragging the canvas.

3. Keep all the nodes update connected to existing collaborativve canvas state.

4. Add a simple line connect behavior to shape node, shapes can connect to each other by a line, the connection point of each shape node are left right top and bottom each at the center of its side diameter.

### Scope Limit

- don't change shape rendering from the previous unit.
- don't change shape panel or drag preview.
- don't change how nodes are created.
