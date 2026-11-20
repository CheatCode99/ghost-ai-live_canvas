Add a button shape panel that user can drag and drop shapes onto the canvas and create new nodes.


## Implementation

Add the bottom pill-shaped toolbar at the bottom-center of the canvas.

Add dragable icons for these shapes:
    - rectangle
    - Diamond
    - circle
    - pill
    - cylinder
    - hexagon

When dragging any shape, include shape name and default size in the drag payload.

    use sensible default size:
        - rectangles should be wider than tall
        - circles should be square
        - diamond should be slightly wider so labels have room.

Add 'dragover' and 'drop' handling to the canvas wrapper.

On 'drop':

    - read the dragged shape payload
    - convert screen position to canvas coordinate using ReactFlow.
    - create new node at that position 
    - use empty label
    - use the default node color
    - use the drag shape value

Generate each node ID using the shape name, timestamp, and a counter.

Add basic renderer for the custom node type so that new nodes are visible.

    For this unit, render every shape as a simple bordered rectangle with label at the center.
    shape specific visual will be added later.

### Check when done:

    - Shape drag payload include correct shape and size data.
    - Drop logic create new canvas node with expected shape data.
    - New node use custom canvas node type.
    - 'npm run build' passes