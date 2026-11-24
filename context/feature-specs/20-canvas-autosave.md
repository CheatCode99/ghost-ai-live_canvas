Add autosave and loading for collaborative so the state is persisted before adding AI generation. Canvas JSON should be stored in Vercel blob and the saved blob Url should be stored on the Prisma project record.


### What to install 

- `@vercel/blob`

## Implementation

1. Check existing project's schema:
    - review `prisma/models/project.prisma`
    - add or reuse a field for canvas blob URL
    - keep Prisma responsible for metadata only

2. Add Canvas Save/Load API routes.
    - Create `PUT /api/projects/[projectId]/canvas`
    This route should:
        - recieve the latest canvas JSON
        - Upload the JSON to Vercel blob
        - store the returned blob URL on the matching Prisma project record.
    
    - Create `GET /api/projects/[projectId]/canvas`
    this route should:
        - read the project's saved blob URL from prisma record
        - fetch the saved canvas JSON from Vercel blob
        - return the canvas state to the editor

3. Add an autosave hook in the `/hook` folder.
    - watch canvas nodes and edges
    - debounce saves to avoid excessive write
    - save through canvas API route
    - track save status: saving, saved, error

4. Load save state canvas in the editor.
    - when the editor loads, check if Liveblock has any existing nodes or edges
    - if the room is empty and the project has a saved canvas blob URL, fetch and load the saved canvas state.
    - if the room is already has nodes or edges, skip the load entiredly to avoid over-writing the active collaborative canvas.

5. add a small save status indicator in the editor save button.
    - show saving, save or error states.


## Storage pattern:
    - Prisma stores project metadata and canvas blob URL.
    - Vercel blob stores the actual canvas blob.