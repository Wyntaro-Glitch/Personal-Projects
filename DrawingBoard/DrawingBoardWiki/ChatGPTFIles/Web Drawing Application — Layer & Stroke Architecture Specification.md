# Web Drawing Application — Layer & Stroke Architecture Specification

## 0. Purpose

This document defines the architecture and logic for implementing a Clip Studio Paint-inspired layer and stroke system in a web-based drawing application.

The application must support:

- Multiple layers
- Layer ordering
- Layer visibility
- Layer opacity
- Layer blending modes
- Raster drawing
- Stroke-based/vector-like drawing
- Individual stroke storage
- Undo/redo
- Layer transformations
- Saving/loading projects
- Real-time collaboration through Socket.io
- Persistent project storage using MongoDB Atlas
- Authentication using JWT + bcrypt

The implementation must use **JavaScript only**.

---

# 1. Technology Stack

## Frontend

- React
- JavaScript
- JSX
- CSS
- HTML5 Canvas API
- Vite

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose ODM

## Real-Time Communication

- Socket.io

## Authentication

- JWT
- bcrypt

## Package Management

- npm

## Language Restriction

DO NOT use:

- TypeScript
- `.ts`
- `.tsx`
- TypeScript interfaces
- TypeScript types
- TypeScript generics

All source code must use:

- `.js`
- `.jsx`
- JavaScript objects
- JavaScript classes/functions where appropriate

---

# 2. Core Architecture

The drawing application consists of:

```text
React Application
        |
        v
Canvas Rendering Engine
        |
        v
Document State
        |
        +----------------+
        |                |
        v                v
    Raster Layers    Stroke Layers
        |                |
        |                v
        |            Stroke Objects
        |                |
        +-------+--------+
                |
                v
          Project State
                |
       +--------+--------+
       |                 |
       v                 v
   REST API          Socket.io
       |                 |
       v                 v
    Express           Real-Time
       |              Collaboration
       v
   MongoDB Atlas
```

---

# 3. Important Concept: Separate Document State From Rendering

The application MUST NOT treat the HTML5 Canvas itself as the source of truth.

Canvas is a rendering surface.

The actual source of truth should be JavaScript document state.

Correct architecture:

```text
Document State
      |
      v
Rendering Engine
      |
      v
HTML5 Canvas
```

NOT:

```text
HTML5 Canvas
      |
      v
Document State
```

This distinction is extremely important for:

- Undo
- Redo
- Saving
- Loading
- Collaboration
- Layer manipulation
- Stroke editing
- Re-rendering

---

# 4. Document Structure

A project should conceptually look like:

```javascript
const document = {
    id: "document-id",

    name: "My Artwork",

    width: 1920,
    height: 1080,

    background: {
        color: "#ffffff"
    },

    layers: [],

    activeLayerId: null,

    createdAt: Date,
    updatedAt: Date
};
```

The `layers` array represents the layer stack.

---

# 5. Layer Stack

Layers should be stored in rendering order.

Example:

```javascript
const layers = [
    backgroundLayer,
    sketchLayer,
    lineartLayer,
    colorLayer,
    effectsLayer
];
```

The first layer is rendered first.

The last layer is rendered last.

Therefore:

```text
Top
----------------
Effects
Line Art
Color
Sketch
Background
----------------
Bottom
```

The rendering engine should iterate through the layers in order.

---

# 6. Layer Object

Every layer must have a unique ID.

Example:

```javascript
const layer = {
    id: "layer-001",

    name: "Line Art",

    type: "stroke",

    visible: true,

    opacity: 1,

    blendMode: "source-over",

    locked: false,

    strokes: [],

    transform: {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0
    }
};
```

---

# 7. Layer Types

The application should support at least two layer types:

```text
Raster Layer
Stroke Layer
```

They should NOT be treated as the same thing.

---

# 8. Raster Layer

A raster layer stores rendered pixel information.

Conceptually:

```javascript
const rasterLayer = {
    id: "layer-001",

    type: "raster",

    name: "Paint",

    visible: true,

    opacity: 1,

    blendMode: "source-over",

    locked: false,

    bitmap: null
};
```

The bitmap may be represented internally by:

- HTML Canvas
- ImageBitmap
- OffscreenCanvas
- ImageData
- Serialized image data

depending on implementation.

---

# 9. Stroke Layer

A stroke layer stores individual drawing strokes.

Example:

```javascript
const strokeLayer = {
    id: "layer-002",

    type: "stroke",

    name: "Line Art",

    visible: true,

    opacity: 1,

    blendMode: "source-over",

    locked: false,

    strokes: []
};
```

Each stroke is independently stored.

---

# 10. Stroke Object

A stroke should contain the information necessary to reproduce it.

Example:

```javascript
const stroke = {
    id: "stroke-001",

    tool: "brush",

    color: "#000000",

    size: 12,

    opacity: 1,

    blendMode: "source-over",

    pressureEnabled: true,

    points: []
};
```

---

# 11. Stroke Points

Each stroke contains a sequence of points.

Example:

```javascript
const point = {
    x: 100,
    y: 200,
    pressure: 0.75,

    timestamp: 123456789
};
```

A complete stroke:

```javascript
const stroke = {
    id: "stroke-001",

    tool: "brush",

    color: "#000000",

    size: 12,

    opacity: 1,

    points: [
        {
            x: 100,
            y: 200,
            pressure: 0.5
        },

        {
            x: 105,
            y: 204,
            pressure: 0.7
        },

        {
            x: 110,
            y: 209,
            pressure: 0.9
        }
    ]
};
```

The stroke is reconstructed by rendering its points.

---

# 12. Why Store Strokes?

Do NOT immediately flatten every drawing into pixels.

Instead:

```text
User Draws
    |
    v
Pointer Events
    |
    v
Stroke Object
    |
    v
Store Stroke
    |
    v
Render Stroke
```

This allows:

- Stroke editing
- Stroke deletion
- Stroke movement
- Stroke scaling
- Stroke rotation
- Undo
- Redo
- Saving
- Loading
- Collaboration

---

# 13. Pointer Input

Use the HTML5 Canvas Pointer Events API.

Primary events:

```javascript
pointerdown
pointermove
pointerup
pointercancel
```

Example conceptual flow:

```javascript
canvas.addEventListener("pointerdown", startStroke);

canvas.addEventListener("pointermove", updateStroke);

canvas.addEventListener("pointerup", finishStroke);
```

The system should capture:

```text
X position
Y position
Pressure
Timestamp
Pointer ID
```

Optional:

```text
Tilt X
Tilt Y
Twist
Pointer type
```

---

# 14. Stroke Creation

When the user presses the pointer:

```text
pointerdown
      |
      v
Check active layer
      |
      v
Check layer visibility
      |
      v
Check layer locked state
      |
      v
Create new Stroke object
      |
      v
Add first point
```

During movement:

```text
pointermove
      |
      v
Calculate canvas coordinates
      |
      v
Capture pressure
      |
      v
Add point to current stroke
      |
      v
Render preview
```

When released:

```text
pointerup
      |
      v
Finish stroke
      |
      v
Store stroke in active layer
      |
      v
Create undo history entry
      |
      v
Emit Socket.io operation if collaboration is enabled
```

---

# 15. Coordinate System

Canvas coordinates must be separated from screen coordinates.

Screen:

```text
Browser viewport
```

Canvas:

```text
Drawing coordinate system
```

The application should convert:

```text
Mouse/Pointer Screen Coordinates
              |
              v
Canvas Coordinates
              |
              v
Document Coordinates
```

For example:

```javascript
function getCanvasPoint(event, canvas) {

    const rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,

        pressure: event.pressure
    };
}
```

If zooming and panning are implemented, the conversion must additionally account for:

```text
zoom
panX
panY
rotation
```

---

# 16. Rendering Architecture

Do not render every layer directly onto the same canvas without organization.

Recommended architecture:

```text
React UI
   |
   v
Document State
   |
   v
Rendering Engine
   |
   +---------------------+
   |                     |
   v                     v
Layer Renderer       Selection/UI Renderer
   |
   +-------------+
   |             |
   v             v
Raster         Stroke
Renderer       Renderer
   |
   v
Canvas
```

---

# 17. Rendering Each Layer

Pseudo-logic:

```javascript
function renderDocument(document, ctx) {

    clearCanvas(ctx);

    for (const layer of document.layers) {

        if (!layer.visible) {
            continue;
        }

        ctx.save();

        ctx.globalAlpha = layer.opacity;

        ctx.globalCompositeOperation = layer.blendMode;

        applyTransform(ctx, layer.transform);

        if (layer.type === "raster") {
            renderRasterLayer(layer, ctx);
        }

        if (layer.type === "stroke") {
            renderStrokeLayer(layer, ctx);
        }

        ctx.restore();
    }
}
```

---

# 18. Rendering a Stroke Layer

```javascript
function renderStrokeLayer(layer, ctx) {

    for (const stroke of layer.strokes) {

        renderStroke(stroke, ctx);
    }
}
```

---

# 19. Rendering a Stroke

Basic conceptual implementation:

```javascript
function renderStroke(stroke, ctx) {

    if (stroke.points.length === 0) {
        return;
    }

    ctx.save();

    ctx.strokeStyle = stroke.color;

    ctx.globalAlpha = stroke.opacity;

    ctx.lineWidth = stroke.size;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.beginPath();

    const firstPoint = stroke.points[0];

    ctx.moveTo(
        firstPoint.x,
        firstPoint.y
    );

    for (let i = 1; i < stroke.points.length; i++) {

        const point = stroke.points[i];

        ctx.lineTo(
            point.x,
            point.y
        );
    }

    ctx.stroke();

    ctx.restore();
}
```

This is the simplest implementation.

A production brush engine should use pressure to dynamically calculate brush size and/or opacity.

---

# 20. Pressure Sensitivity

Pressure should influence the brush.

Example:

```javascript
const pressure = point.pressure;

const currentSize =
    stroke.size * pressure;
```

However, the system should support different pressure behaviors.

Possible settings:

```javascript
const pressureSettings = {
    size: true,
    opacity: false
};
```

For example:

```text
Pressure
   |
   +----> Brush Size
   |
   +----> Opacity
   |
   +----> Flow
```

---

# 21. Brush Data

The stroke should reference a brush configuration.

Example:

```javascript
const brush = {
    id: "basic-pen",

    name: "Basic Pen",

    size: 12,

    opacity: 1,

    spacing: 0.1,

    pressureSize: true,

    pressureOpacity: false,

    smoothing: 0.5
};
```

Do not store the entire brush definition inside every point.

Instead:

```text
Stroke
  |
  +-- brushId
  +-- brush settings snapshot
  +-- points
```

For long-term compatibility, it is recommended to store enough brush settings with the stroke to reproduce the original appearance.

---

# 22. Layer Operations

The layer system must support:

```text
Create Layer
Delete Layer
Duplicate Layer
Rename Layer
Move Layer
Hide Layer
Show Layer
Lock Layer
Unlock Layer
Change Opacity
Change Blend Mode
Merge Layers
Clear Layer
Transform Layer
```

---

# 23. Create Layer

Example:

```javascript
function createLayer(type = "stroke") {

    return {
        id: crypto.randomUUID(),

        name: "New Layer",

        type,

        visible: true,

        opacity: 1,

        blendMode: "source-over",

        locked: false,

        strokes: type === "stroke" ? [] : undefined,

        bitmap: type === "raster" ? null : undefined,

        transform: {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        }
    };
}
```

---

# 24. Active Layer

The document should maintain:

```javascript
document.activeLayerId
```

When the user draws:

```text
Pointer Input
      |
      v
activeLayerId
      |
      v
Find layer
      |
      v
Verify layer type
      |
      v
Draw
```

The application MUST NOT allow drawing on:

```text
hidden layer
locked layer
non-drawing layer
```

unless explicitly designed otherwise.

---

# 25. Layer Ordering

Example:

```text
Index 0 = Background
Index 1 = Sketch
Index 2 = Line Art
Index 3 = Colors
Index 4 = Effects
```

Moving a layer:

```javascript
function moveLayer(layerId, newIndex) {

    // Remove layer from current position

    // Insert layer into new position

    // Re-render document
}
```

Layer ordering is part of document state and must be saved.

---

# 26. Layer Visibility

Visibility should NOT delete any drawing data.

Correct:

```javascript
layer.visible = false;
```

Incorrect:

```javascript
layer.strokes = [];
```

When invisible:

```text
Layer exists
    |
    +-- Data remains
    |
    +-- Renderer skips it
```

---

# 27. Layer Opacity

Opacity should be applied during rendering.

```javascript
ctx.globalAlpha = layer.opacity;
```

Example:

```text
Layer opacity = 50%

Stroke opacity = 100%

Final rendering = 50%
```

Do not modify every stroke just because the layer opacity changed.

---

# 28. Layer Blending Modes

Use Canvas compositing where possible.

Example:

```javascript
ctx.globalCompositeOperation = layer.blendMode;
```

Common modes:

```text
source-over
multiply
screen
overlay
darken
lighten
color-dodge
color-burn
hard-light
soft-light
difference
exclusion
```

Not every CSP blending mode has a direct Canvas equivalent.

Unsupported modes may require:

- WebGL
- custom shaders
- offscreen compositing
- pixel processing

The system should therefore keep the blend mode as a logical property rather than assuming Canvas supports every mode.

---

# 29. Transform System

Every layer should have a transform:

```javascript
transform: {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0
}
```

Rendering:

```javascript
ctx.translate(transform.x, transform.y);

ctx.rotate(transform.rotation);

ctx.scale(
    transform.scaleX,
    transform.scaleY
);
```

The actual stroke points should remain unchanged.

Example:

```text
Original Stroke
       |
       v
Layer Transform
       |
       v
Rendered Stroke
```

This is preferable to permanently modifying every point when the user simply moves a layer.

---

# 30. Undo/Redo

Undo/redo should operate on document operations rather than screenshots whenever practical.

Example operation:

```javascript
{
    type: "ADD_STROKE",

    layerId: "layer-001",

    stroke: {...}
}
```

Undo:

```text
ADD_STROKE
     |
     v
REMOVE_STROKE
```

Other operations:

```text
DELETE_STROKE
CREATE_LAYER
DELETE_LAYER
MOVE_LAYER
RENAME_LAYER
SET_LAYER_OPACITY
SET_LAYER_VISIBILITY
TRANSFORM_LAYER
```

---

# 31. History Architecture

Conceptual:

```javascript
const history = {

    undoStack: [],

    redoStack: []
};
```

When a new operation occurs:

```text
New Operation
      |
      v
Push to undoStack
      |
      v
Clear redoStack
```

Undo:

```text
undoStack
    |
    v
Remove latest operation
    |
    v
Apply inverse operation
    |
    v
Push operation to redoStack
```

---

# 32. Important Undo Rule

Do NOT save a history snapshot for every `pointermove`.

Bad:

```text
pointermove
pointermove
pointermove
pointermove
pointermove
...
```

This creates enormous history.

Instead:

```text
pointerdown
    |
    v
Start temporary stroke
    |
pointermove
    |
    v
Modify temporary stroke
    |
pointerup
    |
    v
Commit ONE operation
```

One completed stroke should normally equal one history action.

---

# 33. Project Saving

The project should be represented as serializable document state.

Example:

```javascript
const project = {
    version: 1,

    document: {
        id: "document-001",

        name: "Artwork",

        width: 1920,

        height: 1080,

        layers: []
    }
};
```

Do not attempt to serialize:

```text
HTMLCanvasElement
CanvasRenderingContext2D
React component instances
DOM elements
```

Instead serialize the underlying data.

---

# 34. MongoDB Data Model

MongoDB should store project metadata and serialized drawing information.

Conceptual Mongoose schema:

```javascript
const ProjectSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    width: Number,

    height: Number,

    layers: Array,

    version: Number

}, {
    timestamps: true
});
```

For an initial implementation, `layers: Array` can be used.

As the application grows, schemas can be separated into more structured models.

---

# 35. MongoDB Considerations

Do not assume MongoDB should store huge raw canvas images indefinitely.

Stroke data can become very large.

For large projects consider:

```text
Project Metadata
        |
        +---- Layer Metadata
        |
        +---- Stroke Data
        |
        +---- Raster Assets
```

Raster assets may eventually be better stored in object/file storage rather than directly inside MongoDB.

MongoDB should primarily manage:

```text
Users
Projects
Project metadata
Layer structure
Stroke data
Permissions
Collaboration state
```

---

# 36. Express API

Suggested routes:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/projects
POST   /api/projects

GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Optional:

```text
POST /api/projects/:id/layers
PUT  /api/projects/:id/layers/:layerId
DELETE /api/projects/:id/layers/:layerId
```

However, layer operations may also be handled as project operations rather than individual REST requests.

---

# 37. Authentication

Registration:

```text
User
 |
 v
bcrypt password hash
 |
 v
MongoDB
```

Login:

```text
Email + Password
       |
       v
bcrypt.compare()
       |
       v
JWT
       |
       v
Client
```

The frontend should store the authentication state securely according to the application's security model.

JWT should be validated by Express middleware.

---

# 38. Socket.io Collaboration

Socket.io should synchronize document operations rather than constantly transmitting entire canvas images.

Bad:

```text
Every pointer movement
       |
       v
Send entire canvas
```

Good:

```text
Stroke completed
       |
       v
Operation
       |
       v
Socket.io
       |
       v
Other clients
```

Example:

```javascript
socket.emit("stroke:add", {
    projectId,
    layerId,
    stroke
});
```

---

# 39. Real-Time Operation Model

A collaboration event should look conceptually like:

```javascript
{
    operationId: "operation-001",

    type: "ADD_STROKE",

    projectId: "project-001",

    layerId: "layer-001",

    stroke: {
        id: "stroke-001",

        color: "#000000",

        size: 10,

        points: []
    }
}
```

The receiving client:

```text
Socket event
     |
     v
Validate operation
     |
     v
Apply operation to document state
     |
     v
Re-render affected layer/document
```

---

# 40. Do Not Send Full Documents For Every Event

Avoid:

```javascript
socket.emit("document:update", entireDocument);
```

for every small change.

Prefer:

```javascript
socket.emit("operation", {
    type: "ADD_STROKE",
    layerId,
    stroke
});
```

This reduces:

- Bandwidth
- CPU usage
- Memory usage
- Network latency

---

# 41. React State Architecture

React should manage UI state and document state, but rendering should be optimized.

Conceptual state:

```javascript
const [document, setDocument] = useState(null);

const [activeLayerId, setActiveLayerId] = useState(null);

const [tool, setTool] = useState("brush");

const [brushSettings, setBrushSettings] = useState({
    size: 10,
    opacity: 1,
    color: "#000000"
});
```

However, high-frequency pointer events should NOT necessarily trigger React state updates on every movement.

Avoid:

```text
pointermove
    |
    v
setState()
    |
    v
React re-render
```

for every pointer event.

Instead use:

```text
Pointer Events
      |
      v
Drawing Engine / refs
      |
      v
Canvas
```

and commit the finished stroke to React state on completion.

---

# 42. Recommended React Architecture

```text
App
 |
 +-- Editor
 |    |
 |    +-- Canvas
 |    |
 |    +-- Toolbar
 |    |
 |    +-- LayersPanel
 |    |
 |    +-- PropertiesPanel
 |    |
 |    +-- HistoryControls
 |
 +-- ProjectManager
 |
 +-- Authentication
```

Drawing logic should be separated from UI components.

Suggested folders:

```text
src/
│
├── components/
│
├── canvas/
│   ├── CanvasRenderer.js
│   ├── StrokeRenderer.js
│   ├── RasterRenderer.js
│   ├── PointerHandler.js
│   └── CoordinateSystem.js
│
├── drawing/
│   ├── BrushEngine.js
│   ├── Stroke.js
│   └── DrawingEngine.js
│
├── layers/
│   ├── LayerManager.js
│   └── LayerOperations.js
│
├── history/
│   └── HistoryManager.js
│
├── collaboration/
│   └── socket.js
│
├── api/
│   └── projects.js
│
├── auth/
│   └── auth.js
│
└── App.jsx
```

---

# 43. Layer Manager

Layer manipulation should be centralized.

Example:

```javascript
class LayerManager {

    constructor(document) {

        this.document = document;
    }

    addLayer(layer) {

        this.document.layers.push(layer);
    }

    removeLayer(layerId) {

        this.document.layers =
            this.document.layers.filter(
                layer => layer.id !== layerId
            );
    }

    getLayer(layerId) {

        return this.document.layers.find(
            layer => layer.id === layerId
        );
    }

    moveLayer(layerId, newIndex) {

        // Move layer within array
    }
}
```

Do not duplicate layer manipulation logic throughout React components.

---

# 44. Drawing Engine

The drawing engine should be responsible for:

```text
Pointer input
Stroke creation
Stroke completion
Brush calculation
Pressure
Smoothing
Rendering
```

Conceptual:

```javascript
class DrawingEngine {

    startStroke(point) {}

    addPoint(point) {}

    finishStroke() {}

    cancelStroke() {}
}
```

---

# 45. Separation of Responsibilities

Use this rule:

```text
React
= UI and application state

Canvas Engine
= Rendering

Drawing Engine
= Brush/stroke logic

Layer Manager
= Layer operations

History Manager
= Undo/redo

Socket.io
= Real-time synchronization

Express
= API

MongoDB
= Persistence
```

Do not put everything inside one React component.

---

# 46. Raster vs Stroke Layers

Use stroke layers when:

```text
Line art
Sketches
Ink
Simple vector-like drawings
Editable strokes
```

Use raster layers when:

```text
Painting
Texture
Pixel manipulation
Airbrush-heavy work
Image editing
Imported images
```

A future implementation may support conversion:

```text
Stroke Layer
     |
     v
Rasterize
     |
     v
Raster Layer
```

And potentially:

```text
Raster Layer
     |
     v
Vectorization
```

but raster-to-stroke conversion is substantially more complex and should not be part of the initial implementation.

---

# 47. Performance Strategy

The application should not re-render the entire document unnecessarily.

Possible strategy:

```text
Background Layer
      |
      v
Cached

Sketch Layer
      |
      v
Cached

Line Art
      |
      v
Re-render when changed

UI Overlay
      |
      v
Re-render frequently
```

Use:

- OffscreenCanvas where appropriate
- Cached layer rendering
- `requestAnimationFrame`
- Dirty-layer rendering
- `ImageBitmap`
- Canvas transforms

when performance becomes necessary.

---

# 48. Recommended Canvas Architecture

Use multiple canvas layers if helpful:

```text
Canvas 1
Background

Canvas 2
Document Rendering

Canvas 3
Current Stroke Preview

Canvas 4
Selection / Transform UI

Canvas 5
Cursor / Guides
```

This can reduce unnecessary redraws.

Example:

```text
DOM
 |
 +-- Background Canvas
 |
 +-- Artwork Canvas
 |
 +-- Preview Canvas
 |
 +-- UI Overlay Canvas
```

---

# 49. Current Stroke vs Saved Stroke

During drawing, maintain a temporary stroke:

```javascript
let currentStroke = null;
```

This stroke should NOT immediately become permanent document state.

Flow:

```text
pointerdown
      |
      v
currentStroke
      |
pointermove
      |
      v
modify currentStroke
      |
pointerup
      |
      v
commit currentStroke
      |
      v
layer.strokes.push(currentStroke)
```

This makes undo/history much cleaner.

---

# 50. Stroke Deletion

To delete an individual stroke:

```javascript
function deleteStroke(layer, strokeId) {

    layer.strokes =
        layer.strokes.filter(
            stroke => stroke.id !== strokeId
        );
}
```

Then re-render.

---

# 51. Stroke Selection

A future stroke selection system should calculate whether the user's pointer intersects the stroke.

Possible approaches:

```text
Bounding box
      |
      v
Quick rejection
      |
      v
Distance-to-segment test
      |
      v
Stroke selected
```

Do NOT initially use expensive pixel-perfect hit detection for every stroke.

---

# 52. Saving Strategy

Autosave should NOT occur on every pointer event.

Recommended:

```text
Stroke completed
      |
      v
Update local document
      |
      v
Mark document dirty
      |
      v
Debounced save
      |
      v
Express API
      |
      v
MongoDB
```

Example concept:

```text
User draws
    |
    v
Local state updates immediately
    |
    v
Autosave after inactivity
```

---

# 53. Local Recovery

For resilience, consider using:

```text
IndexedDB
```

in the browser for temporary/local project recovery.

Architecture:

```text
React Document State
       |
       +----> IndexedDB
       |
       +----> Express API
                    |
                    v
                MongoDB
```

This is optional but recommended for a serious drawing application.

---

# 54. Project Versioning

Every saved project should have a version.

Example:

```javascript
{
    version: 1
}
```

If the data structure changes:

```text
Version 1
   |
   v
Migration
   |
   v
Version 2
```

Never assume old project files will always match the newest schema.

---

# 55. Example Complete Document

```javascript
const project = {

    version: 1,

    name: "Character Illustration",

    width: 1920,

    height: 1080,

    layers: [

        {
            id: "background",

            name: "Background",

            type: "raster",

            visible: true,

            opacity: 1,

            blendMode: "source-over",

            locked: true,

            bitmap: null,

            transform: {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0
            }
        },

        {
            id: "lineart",

            name: "Line Art",

            type: "stroke",

            visible: true,

            opacity: 1,

            blendMode: "source-over",

            locked: false,

            strokes: [

                {
                    id: "stroke-001",

                    tool: "brush",

                    color: "#000000",

                    size: 8,

                    opacity: 1,

                    points: [

                        {
                            x: 100,
                            y: 200,
                            pressure: 0.5
                        },

                        {
                            x: 110,
                            y: 210,
                            pressure: 0.7
                        },

                        {
                            x: 120,
                            y: 225,
                            pressure: 1
                        }
                    ]
                }
            ],

            transform: {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotation: 0
            }
        }
    ]
};
```

---

# 56. Golden Rule

The application should follow this fundamental architecture:

```text
                DOCUMENT
                    |
              +-----+-----+
              |           |
           LAYERS       HISTORY
              |
       +------+------+
       |             |
    RASTER        STROKE
    LAYER         LAYER
                     |
                  STROKES
                     |
                  POINTS
                     |
              x / y / pressure
```

Canvas is only the renderer.

MongoDB is only persistence.

Socket.io is only synchronization.

React is primarily the application/UI layer.

The document model is the source of truth.

---

# 57. Implementation Priority

Implement the system in this order.

## Phase 1 — Basic Drawing

```text
Canvas
Pointer events
Brush
Stroke points
Stroke rendering
```

## Phase 2 — Layers

```text
Create layer
Delete layer
Select layer
Layer ordering
Visibility
Opacity
Lock
```

## Phase 3 — History

```text
Undo
Redo
Operation-based history
```

## Phase 4 — Persistence

```text
MongoDB
Mongoose
Express API
Project saving
Project loading
```

## Phase 5 — Authentication

```text
Registration
bcrypt
Login
JWT
Protected projects
```

## Phase 6 — Real-Time

```text
Socket.io
Project rooms
Stroke operations
Layer operations
Synchronization
```

## Phase 7 — Advanced Drawing

```text
Pressure
Brush engine
Smoothing
Eraser
Stroke selection
Transforms
Blending
Raster layers
```

## Phase 8 — Optimization

```text
Layer caching
OffscreenCanvas
Dirty rendering
IndexedDB
Project versioning
Large-document optimization
```

---

# 58. AI Implementation Instructions

When generating code for this project, the AI MUST follow these rules:

1. Use JavaScript only.
2. Use JSX for React components.
3. Do not introduce TypeScript.
4. Do not use `.ts` or `.tsx`.
5. Keep drawing logic separate from React UI.
6. Keep Canvas rendering separate from MongoDB persistence.
7. Keep Socket.io synchronization separate from rendering.
8. Treat the document model as the source of truth.
9. Do not use the Canvas bitmap as the primary document state for stroke layers.
10. Store individual strokes as structured JavaScript objects.
11. Store points containing at minimum `x`, `y`, and `pressure`.
12. Use unique IDs for documents, layers, strokes, and operations.
13. Do not create an undo history entry for every pointer movement.
14. Commit one completed stroke as one logical history operation.
15. Do not send the entire document through Socket.io for every pointer movement.
16. Synchronize operations whenever possible.
17. Keep MongoDB persistence separate from the real-time rendering loop.
18. Do not store React component state inside MongoDB.
19. Do not store CanvasRenderingContext2D inside project data.
20. Preserve layer ordering when saving/loading.
21. Preserve visibility, opacity, blend mode, lock state, and transform.
22. Support both raster and stroke layer types.
23. Design the system so additional layer types can be added later.
24. Use modular files rather than putting the entire drawing engine inside `App.jsx`.
25. Optimize pointer movement separately from React rendering.

---

# 59. Final Mental Model

The AI implementing this project should think of the application as:

```text
USER
 |
 | pointer events
 v
DRAWING ENGINE
 |
 | creates
 v
STROKE
 |
 | stored inside
 v
LAYER
 |
 | stored inside
 v
DOCUMENT
 |
 +------------------+
 |                  |
 v                  v
CANVAS           DATABASE
Rendering        Persistence
 |
 v
USER
```

For collaboration:

```text
DOCUMENT
   |
   v
OPERATION
   |
   v
SOCKET.IO
   |
   +--------> CLIENT A
   |
   +--------> CLIENT B
   |
   +--------> CLIENT C
```

For persistence:

```text
DOCUMENT
   |
   v
EXPRESS API
   |
   v
MONGOOSE
   |
   v
MONGODB ATLAS
```

For authentication:

```text
USER
 |
 v
EXPRESS
 |
 +--> bcrypt
 |
 +--> JWT
 |
 v
AUTHENTICATED SESSION
```

The central principle is:

**Store the drawing as structured data; use Canvas to render that data.**

This makes the web application fundamentally different from a simple image editor and provides the architectural foundation needed for a CSP-inspired editable drawing system.