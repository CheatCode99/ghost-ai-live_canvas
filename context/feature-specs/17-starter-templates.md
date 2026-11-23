Add a small sets of starter templates in addition to a blank canvas option; where user can pick to start instead of building everything from scratch. 

### Implementation

1. Create 'components/editor/starter-templates.tsx'

    Include:
    - a 'CanvasTemplate' type
    - a 'CANVAS_TEMPLATEs' array
    - at least three templates such as micro-services, event-driven, CI/CD pipeline.

Each templates should include:
    - nodes
    - edges
    - 'id'
    - 'name'
    - 'description'

Use the share canvas type and existing color palette. Add small helper function if needed to keep the data readable.


2. Create 'components/editor/starter-templates-modal.tsx'
    The modal should include:
    - open a dialog
    - show templates card in a readable grid
    - show the templates name and description
    - include import button for each templates
    - call 'onImport' for selected template, then close.

3. Add a simple diagram preview for each template card
    - fit the preview to a fixed-size viewport
    - calculate the preview bounds from the template node position.
    - draw edges as a simple line between node centers
    - draw nodes using their shape and color data 
    - Keep the preview lightweight, no ReactFlow needed.