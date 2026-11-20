Replace the node renderer with a proper shape rendering and drag preview.

### Implementation

1. Replace the placeholder node shape rendering.
    - rectangle, pill and circle should use CSS styling.
    - diamond, hexagon and cylinder should render using SVG.
    - SVG shapes should scale with node size.
    - keep the shape's border subtle at rest and bright when selected.

2. Add a shape drag preview.
    - when drag shape from shape panel, should show a ghost preview of that shape.
    - Keep the preview attach to the cursor while dragging.
    - use the same shape type and default size that will be used on drop.
    - hide preview when the shape is dropped or the drag is cancelled.
    - keep this limited to the drag preview behavior only.

3. Keep the node rendering connected to the existing collaborative canvas state.

### Scope limit.

- don't rebuild shape panel layout
- don't change how dropped nodes are created.
- don't add resize or label editing yet.
- keep drag/drop change limited to the ghost preview only.

## Check

- node render the correct shape variant for each type.
- CSS shape rendered correctly for rectangle, circle and pill.
- SVG Shapes rendered and scale correctly for hexagon, cylinder and diamond.
- Shape dragging show ghost preview exactly the same as the dragging shape.
- 'npm run build' passes without type errors.